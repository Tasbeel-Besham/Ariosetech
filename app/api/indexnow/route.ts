import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { submitUrls } from '@/lib/indexnow'

export const dynamic = 'force-dynamic'

/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver, Yep — not Google).
 *
 * POST /api/indexnow                    → submit every published URL
 * POST /api/indexnow { urls: [...] }    → submit specific paths
 *
 * Auth required. Without it, anyone could make the site spam the protocol,
 * which is how a host gets rate-limited or blocked.
 *
 * Submit on real changes only. Re-submitting the whole site on every minor
 * edit is the behaviour the protocol asks you not to exhibit — so this is a
 * deliberate action rather than something wired into every save.
 */
export async function POST(req: NextRequest) {
  if (!await requireAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.INDEXNOW_KEY) {
    return NextResponse.json(
      { error: 'INDEXNOW_KEY is not set. See the setup notes in lib/indexnow.ts.' },
      { status: 400 },
    )
  }

  let body: { urls?: string[] } = {}
  try { body = await req.json() } catch { /* empty body means "everything" */ }

  if (Array.isArray(body.urls) && body.urls.length > 0) {
    const ok = await submitUrls(body.urls)
    return NextResponse.json({ ok, submitted: ok ? body.urls.length : 0 })
  }

  // Enumerate everything published. Each read is independently guarded so one
  // failing collection doesn't lose the whole submission.
  const paths = new Set<string>([
    '/', '/about', '/services', '/portfolio', '/blog', '/contact', '/faq',
    '/tools/wordpress-theme-detector', '/tools/shopify-theme-detector', '/tools/seo-audit',
  ])

  const safe = async (name: string, filter: Record<string, unknown>, map: (d: Record<string, unknown>) => string | null) => {
    try {
      const col = await getCollection(name)
      const docs = await col.find(filter as never).toArray()
      for (const d of docs as Record<string, unknown>[]) {
        const p = map(d)
        if (p) paths.add(p)
      }
    } catch (e) {
      console.error(`[indexnow] could not read "${name}":`, e)
    }
  }

  await Promise.all([
    safe('pages', { status: 'published' }, d => (typeof d.fullPath === 'string' && d.fullPath !== '/' ? d.fullPath : null)),
    safe('blogs', { published: true }, d => (d.slug ? `/blog/${d.slug}` : null)),
    safe('portfolio', { published: true }, d =>
      d.slug ? `/portfolio/${String(d.category || 'other').toLowerCase()}/${d.slug}` : null),
    safe('authors', { published: { $ne: false } }, d => (d.slug ? `/author/${d.slug}` : null)),
  ])

  const list = [...paths]
  const ok = await submitUrls(list)

  return NextResponse.json({ ok, submitted: ok ? list.length : 0, urls: list.length })
}
