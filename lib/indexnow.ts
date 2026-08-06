/**
 * IndexNow — push-based index notification.
 *
 * WHAT IT DOES AND DOESN'T DO
 * ---------------------------
 * IndexNow tells participating search engines the moment a URL changes,
 * instead of waiting for a crawler to come round. Bing, Yandex, Seznam, Naver
 * and Yep support it.
 *
 * Google does NOT, and has not since the protocol launched in 2021. Nothing
 * here speeds up Google. For Google you still rely on the sitemap and Search
 * Console.
 *
 * The reason it's worth having anyway: Bing's index is what ChatGPT Search and
 * Microsoft Copilot run on, and it's a significant source for Perplexity. For a
 * B2B agency whose buyers increasingly ask an assistant for shortlists, being
 * in that index promptly is worth the fifteen minutes this takes to set up.
 *
 * It is NOT a ranking factor. It affects discovery speed only.
 *
 * SETUP
 * -----
 * 1. Generate a random key (32+ hex chars):
 *      node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
 * 2. Save it as `public/<key>.txt`, containing exactly that key and nothing
 *    else. It must be reachable at https://ariosetech.com/<key>.txt — a static
 *    file in /public is served ahead of any route, so this is the reliable
 *    place for it.
 * 3. Set INDEXNOW_KEY=<key> in your environment (Vercel → Settings → Env Vars).
 *
 * With no INDEXNOW_KEY set, every function here is a silent no-op — safe to
 * deploy before you've done the setup.
 */

const ENDPOINT = 'https://api.indexnow.org/indexnow'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

/** Absolute, deduplicated, same-host URLs only. */
function normalize(paths: string[]): string[] {
  const host = new URL(SITE_URL).host
  const out = new Set<string>()
  for (const p of paths) {
    if (!p) continue
    try {
      const url = p.startsWith('http') ? new URL(p) : new URL(p.startsWith('/') ? p : `/${p}`, SITE_URL)
      // The protocol rejects a submission outright if any URL is off-host.
      if (url.host !== host) continue
      out.add(url.toString())
    } catch {
      // Skip anything unparseable rather than poisoning the batch.
    }
  }
  return [...out]
}

/**
 * Submit URLs. Fire-and-forget by design: indexing is a nice-to-have and must
 * never delay or fail an admin save.
 *
 * Returns true if a submission was accepted, false if skipped or rejected.
 */
export async function submitUrls(paths: string[]): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY
  if (!key) return false

  const urlList = normalize(paths)
  if (urlList.length === 0) return false

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        // The protocol caps a batch at 10,000.
        urlList: urlList.slice(0, 10000),
      }),
    })

    if (!res.ok) {
      // 403 = key file not reachable or contents don't match.
      // 422 = a URL was off-host or the key format was rejected.
      console.error(`[indexnow] rejected (${res.status}) for ${urlList.length} url(s)`)
      return false
    }
    return true
  } catch (e) {
    console.error('[indexnow] submission failed:', e)
    return false
  }
}

/** Fire without awaiting — for use inside request handlers. */
export function submitUrlsInBackground(paths: string[]): void {
  if (!process.env.INDEXNOW_KEY) return
  void submitUrls(paths).catch(() => { /* already logged */ })
}
