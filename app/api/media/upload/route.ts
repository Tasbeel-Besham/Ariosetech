import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const files = formData.getAll('files') as File[]
  const file  = formData.get('file') as File | null
  const url   = formData.get('url') as string | null
  const alt   = (formData.get('alt') as string) || ''

  const allFiles = [...files, ...(file ? [file] : [])].filter(Boolean)

  // Option A: External URL — just store it
  if (url && allFiles.length === 0) {
    const col = await getCollection('media')
    const result = await col.insertOne({
      url, alt: alt || url.split('/').pop() || 'image',
      key: url, mimeType: 'image/unknown', size: 0, createdAt: new Date(),
    } as never)
    return NextResponse.json({ _id: result.insertedId, url, alt })
  }

  if (allFiles.length === 0) {
    return NextResponse.json({ error: 'No files or URL provided' }, { status: 400 })
  }

  const uploaded: { _id: unknown; url: string; alt: string }[] = []
  const errors: string[] = []

  const cloudName   = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
  const imgbbKey    = process.env.IMGBB_API_KEY

  for (const f of allFiles) {
    const fileAlt = alt || f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')

    try {
      // ── Cloudinary via multipart/form-data (more reliable than base64) ──
      if (cloudName && uploadPreset) {
        const cloudForm = new FormData()
        cloudForm.append('file', f)
        cloudForm.append('upload_preset', uploadPreset)
        cloudForm.append('folder', 'ariosetech')
        // Don't set Content-Type header — let fetch set multipart boundary automatically

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: cloudForm }
        )

        const cloudData = await cloudRes.json()

        if (!cloudRes.ok) {
          const cloudError = cloudData?.error?.message || JSON.stringify(cloudData)
          console.error('[media/upload] Cloudinary error response:', JSON.stringify(cloudData))
          // Return full detail so you can debug
          errors.push(`${f.name}: ${cloudError} (preset=${uploadPreset}, cloud=${cloudName})`)
          continue
        }

        const col = await getCollection('media')
        const result = await col.insertOne({
          url: cloudData.secure_url,
          key: cloudData.public_id,
          alt: fileAlt,
          title: fileAlt,
          width: cloudData.width,
          height: cloudData.height,
          size: cloudData.bytes,
          mimeType: f.type || 'image/jpeg',
          createdAt: new Date(),
        } as never)

        uploaded.push({ _id: result.insertedId, url: cloudData.secure_url, alt: fileAlt })
        continue
      }

      // ── ImgBB fallback ──────────────────────────────────────────
      if (imgbbKey) {
        const bytes = await f.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')
        const imgForm = new FormData()
        imgForm.append('image', base64)
        imgForm.append('name', fileAlt)

        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          { method: 'POST', body: imgForm }
        )
        const imgData = await imgRes.json()

        if (!imgRes.ok || !imgData.success) {
          const imgError = imgData?.error?.message || 'ImgBB upload failed'
          errors.push(`${f.name}: ${imgError}`)
          continue
        }

        const col = await getCollection('media')
        const result = await col.insertOne({
          url: imgData.data.url,
          key: imgData.data.id,
          alt: fileAlt,
          title: fileAlt,
          width: imgData.data.width,
          height: imgData.data.height,
          size: imgData.data.size,
          mimeType: f.type || 'image/jpeg',
          createdAt: new Date(),
        } as never)

        uploaded.push({ _id: result.insertedId, url: imgData.data.url, alt: fileAlt })
        continue
      }

      errors.push(`${f.name}: No upload service configured. Add CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET (or IMGBB_API_KEY) to Vercel env vars.`)

    } catch (e) {
      console.error('[media/upload] Exception:', e)
      errors.push(`${f.name}: ${String(e)}`)
    }
  }

  if (uploaded.length === 0 && errors.length > 0) {
    return NextResponse.json({ error: errors.join('; ') }, { status: 500 })
  }

  return NextResponse.json(
    uploaded.length === 1
      ? { ...uploaded[0], errors: errors.length ? errors : undefined }
      : { uploaded, errors }
  )
}
