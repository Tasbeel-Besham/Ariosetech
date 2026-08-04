/**
 * Client-side image compression + upload.
 *
 * WHY THIS EXISTS
 * ---------------
 * Vercel caps the request body of a serverless function at 4.5 MB and returns
 * 413 FUNCTION_PAYLOAD_TOO_LARGE above it. That limit is enforced at the
 * infrastructure level — it cannot be raised from `vercel.json` or from route
 * handler config. The request is killed at the edge, so /api/media/upload never
 * runs and never gets a chance to report anything useful.
 *
 * Normal photos (a few hundred KB) pass fine. Full-page screenshots do not: a
 * 1440x6000 PNG is routinely 4–8 MB. So we shrink the file in the browser
 * before it is ever sent.
 *
 * This is a happy accident for page weight too — the portfolio grid loads one
 * screenshot per card, and shipping 5 MB PNGs to visitors would be brutal.
 *
 * NOTE: browser-only. Never import this into a server component or route.
 */

/** Widest we ever need. The portfolio frame renders around 400–450px CSS. */
const MAX_WIDTH = 1400
/** Guard against absurdly long captures (some CMS pages run 30k px). */
const MAX_HEIGHT = 12000
/**
 * Canvas area ceiling. Browsers silently produce a blank canvas past their
 * internal limit — Safari in particular is far stricter than Chrome — and a
 * blank canvas encodes as a valid-but-empty image, so this fails silently
 * rather than throwing. Staying well under avoids that class of bug.
 */
const MAX_AREA = 40_000_000
/** Encoder quality. 0.82 is visually clean for screenshots of flat UI. */
const QUALITY = 0.82
/** Files under this are already fine — don't waste time re-encoding. */
const SKIP_UNDER_BYTES = 900 * 1024
/** Our own ceiling, kept under Vercel's 4.5 MB with headroom for the
 *  multipart envelope and the other form fields. */
export const UPLOAD_LIMIT_BYTES = 4 * 1024 * 1024

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Decode a File into something drawable, preferring the faster path. */
async function decode(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; release: () => void }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file)
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close?.() }
    } catch {
      // Fall through to the <img> path below.
    }
  }

  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Could not read that image file.'))
      el.src = url
    })
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    }
  } catch (e) {
    URL.revokeObjectURL(url)
    throw e
  }
}

function canEncodeWebp(): boolean {
  try {
    const c = document.createElement('canvas')
    c.width = 1; c.height = 1
    return c.toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    return false
  }
}

/**
 * Downscale and re-encode an image so it fits comfortably under the upload
 * limit. Returns the original File untouched when compression isn't applicable
 * or wouldn't help.
 */
export async function compressImage(file: File): Promise<File> {
  // Not a raster image we can safely re-encode.
  if (!file.type.startsWith('image/')) return file
  // GIF would lose animation; SVG is vector and tiny already.
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file
  // Already small enough to not be worth the CPU.
  if (file.size < SKIP_UNDER_BYTES) return file
  if (typeof document === 'undefined') return file

  let decoded
  try {
    decoded = await decode(file)
  } catch {
    // Can't decode it — let the server try the original and report properly.
    return file
  }

  const { source, width, height, release } = decoded

  try {
    if (!width || !height) return file

    // Work out a single scale factor that satisfies all three constraints.
    let scale = Math.min(1, MAX_WIDTH / width)
    if (height * scale > MAX_HEIGHT) scale = MAX_HEIGHT / height
    if (width * scale * height * scale > MAX_AREA) scale = Math.sqrt(MAX_AREA / (width * height))

    const targetW = Math.max(1, Math.round(width * scale))
    const targetH = Math.max(1, Math.round(height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    const mime = canEncodeWebp() ? 'image/webp' : 'image/jpeg'

    // JPEG has no alpha — without this, transparent regions render black.
    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, targetW, targetH)
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(source, 0, 0, targetW, targetH)

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mime, QUALITY))
    if (!blob || blob.size === 0) return file

    // Re-encoding made it bigger (happens with already-optimised files) and the
    // original fits anyway — keep the original, it's better quality.
    if (blob.size >= file.size && file.size <= UPLOAD_LIMIT_BYTES) return file

    const ext = mime === 'image/webp' ? 'webp' : 'jpg'
    const base = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${base}.${ext}`, { type: mime, lastModified: Date.now() })
  } finally {
    release()
  }
}

/**
 * Compress then upload a single image. Throws an Error with a message that is
 * safe to show the user directly.
 */
export async function uploadImageFile(file: File): Promise<{ url: string; alt?: string }> {
  const prepared = await compressImage(file)

  if (prepared.size > UPLOAD_LIMIT_BYTES) {
    throw new Error(
      `"${file.name}" is still ${formatBytes(prepared.size)} after compression — over the ${formatBytes(UPLOAD_LIMIT_BYTES)} server limit. Try exporting it narrower or as WebP.`
    )
  }

  const fd = new FormData()
  fd.append('files', prepared)

  let res: Response
  try {
    res = await fetch('/api/media/upload', { method: 'POST', body: fd })
  } catch {
    throw new Error('Network error during upload. Check your connection and try again.')
  }

  // A 413 from Vercel's edge returns HTML, not JSON — reading as text first
  // means a rejected upload reports a real message instead of throwing an
  // unhandled JSON parse error and leaving the spinner stuck.
  const raw = await res.text()
  let data: Record<string, unknown> | null = null
  try { data = JSON.parse(raw) } catch { /* non-JSON error page */ }

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error(
        `"${file.name}" (${formatBytes(prepared.size)}) was rejected as too large. The hosting platform caps uploads at 4.5 MB.`
      )
    }
    if (res.status === 401) throw new Error('Your session expired — sign in again and retry.')
    throw new Error(String(data?.error || `Upload failed (${res.status}).`))
  }

  const url =
    (data?.url as string | undefined) ||
    ((data?.uploaded as Array<{ url?: string }> | undefined)?.[0]?.url)

  if (!url) {
    throw new Error(String(data?.error || 'The server accepted the file but returned no URL.'))
  }

  return { url, alt: data?.alt as string | undefined }
}

/** Upload several images, collecting per-file errors instead of aborting. */
export async function uploadImageFiles(
  files: File[],
  onProgress?: (done: number, total: number, name: string) => void,
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = []
  const errors: string[] = []

  for (let i = 0; i < files.length; i++) {
    onProgress?.(i, files.length, files[i].name)
    try {
      const { url } = await uploadImageFile(files[i])
      urls.push(url)
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e))
    }
  }

  onProgress?.(files.length, files.length, '')
  return { urls, errors }
}
