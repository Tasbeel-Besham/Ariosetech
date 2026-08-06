// Rendered per request, straight from the database. Never prerendered — a
// sitemap baked at build time can advertise a stale or empty set of URLs.
export const dynamic = 'force-dynamic'

import { getCollection } from '@/lib/db/mongodb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

/**
 * Routes that exist as FILES in the app, so they can never 404.
 *
 * Everything else — /services, /industries/*, and any other builder page — is
 * supplied by the `pages` collection below.
 *
 * This list previously also hardcoded /services, /services/business-automation,
 * /about/team, /industries and eleven /industries/* paths. None of those are
 * code routes: they're builder pages resolved through [...slug]. If one is
 * unpublished, renamed or deleted in the admin, the URL 404s while the sitemap
 * keeps submitting it — which is exactly what produces "Submitted URL not
 * found (404)" in Search Console. They were also redundant, because the pages
 * loop already emits every published page.
 */
const FILE_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/blog',
  '/privacy-policy',
  '/terms-of-service',
  '/tools/wordpress-theme-detector',
  '/tools/shopify-theme-detector',
  '/tools/seo-audit',
  // Always resolve — these four are the base categories in the route's guard.
  '/portfolio/wordpress',
  '/portfolio/woocommerce',
  '/portfolio/shopify',
  '/portfolio/seo',
]

type UrlEntry = { loc: string; lastmod?: string }

/**
 * Escape XML entities.
 *
 * A single unescaped `&` in one slug makes the whole document malformed, and
 * Search Console rejects the entire sitemap with a parse error rather than
 * skipping the bad line. Cheap insurance against one bad slug taking out
 * every URL.
 */
function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** W3C date (YYYY-MM-DD), or undefined if the value isn't a usable date. */
function iso(...candidates: unknown[]): string | undefined {
  for (const c of candidates) {
    if (!c) continue
    const date = new Date(c as string | number | Date)
    if (!isNaN(date.getTime())) return date.toISOString().slice(0, 10)
  }
  return undefined
}

/** Each read is independently guarded: one failing collection must not empty the sitemap. */
async function safeFind<T>(name: string, filter: Record<string, unknown>): Promise<T[]> {
  try {
    const col = await getCollection(name)
    return (await col.find(filter as never).toArray()) as T[]
  } catch (e) {
    console.error(`[sitemap] could not read "${name}":`, e)
    return []
  }
}

export async function GET() {
  const [pages, blogs, portfolio, authors] = await Promise.all([
    safeFind<Record<string, any>>('pages',     { status: 'published' }),
    safeFind<Record<string, any>>('blogs',     { published: true }),
    safeFind<Record<string, any>>('portfolio', { published: true }),
    safeFind<Record<string, any>>('authors',   { published: { $ne: false } }),
  ])

  const entries = new Map<string, UrlEntry>()
  const add = (path: string, lastmod?: string) => {
    if (!path || !path.startsWith('/')) return
    const clean = path === '/' ? '/' : path.replace(/\/+$/, '')
    const loc = `${SITE_URL}${clean}`
    // First write wins, so a file route never gets overwritten by a DB row.
    if (!entries.has(loc)) entries.set(loc, { loc, lastmod })
  }

  for (const r of FILE_ROUTES) add(r)

  for (const p of pages) {
    if (p?.seo?.robots?.index === false) continue // don't advertise noindexed pages
    add(String(p.fullPath || ''), iso(p.updatedAt, p.createdAt))
  }

  for (const a of authors) {
    if (a?.slug) add(`/author/${a.slug}`, iso(a.updatedAt))
  }

  for (const b of blogs) {
    // `date` as a fallback — many posts carry only a publish date, and a
    // sitemap with no lastmod anywhere gives Google nothing to prioritise on.
    if (b?.slug) add(`/blog/${b.slug}`, iso(b.updatedAt, b.date))
  }

  for (const item of portfolio) {
    if (!item?.slug) continue
    // Lowercased, and defaulted to 'other' exactly as the route does. The
    // category was previously used raw: a project stored as "Shopify"
    // produced /portfolio/Shopify/slug in the sitemap while the page's own
    // canonical said /portfolio/shopify/slug — a self-inflicted duplicate.
    // Items with no category were skipped entirely, so they never appeared.
    const cat = String(item.category || 'other').toLowerCase()
    add(`/portfolio/${cat}/${item.slug}`, iso(item.updatedAt, item.date))
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...entries.values()].map(u => `  <url>
    <loc>${xml(u.loc)}</loc>${u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
