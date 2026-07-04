export const dynamic = 'force-dynamic'

import { getCollection } from '@/lib/db/mongodb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

// Static routes that are not stored in the pages collection
const STATIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/blog',
  '/tools/wordpress-theme-detector',
  '/tools/shopify-theme-detector',
  '/portfolio/wordpress',
  '/portfolio/woocommerce',
  '/portfolio/shopify',
  '/portfolio/seo',
  '/privacy-policy',
  '/terms-of-service',
]

type UrlEntry = { loc: string; lastmod?: string; priority: string }

function iso(d: unknown): string | undefined {
  if (!d) return undefined
  const date = new Date(d as string | number | Date)
  return isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10)
}

export async function GET() {
  const [pagesCol, blogsCol, portfolioCol] = await Promise.all([
    getCollection('pages'),
    getCollection('blogs'),
    getCollection('portfolio'),
  ])
  const [pages, blogs, portfolio] = await Promise.all([
    pagesCol.find({ status: 'published' }).toArray(),
    blogsCol.find({ published: true }).toArray(),
    portfolioCol.find({ published: true }).toArray().catch(() => []),
  ])

  const entries = new Map<string, UrlEntry>()
  const add = (path: string, lastmod?: string, priority = '0.8') => {
    const loc = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/+$/, '')}`
    if (!entries.has(loc)) entries.set(loc, { loc, lastmod, priority })
  }

  for (const r of STATIC_ROUTES) add(r, undefined, r === '/' ? '1.0' : '0.7')

  for (const p of pages) {
    const doc = p as unknown as { fullPath: string; updatedAt?: Date; seo?: { robots?: { index?: boolean } } }
    if (doc.seo?.robots?.index === false) continue // don't advertise noindexed pages
    add(doc.fullPath, iso(doc.updatedAt), '0.9')
  }

  for (const b of blogs) {
    const doc = b as unknown as { slug: string; updatedAt?: string }
    add(`/blog/${doc.slug}`, iso(doc.updatedAt), '0.6')
  }

  for (const item of portfolio) {
    const doc = item as unknown as { slug: string; category?: string; updatedAt?: string }
    if (doc.category && doc.slug) add(`/portfolio/${doc.category}/${doc.slug}`, iso(doc.updatedAt), '0.6')
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...entries.values()].map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
