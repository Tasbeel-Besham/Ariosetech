import { getCollection } from '@/lib/db/mongodb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

export async function GET() {
  const [pagesCol, blogsCol] = await Promise.all([
    getCollection('pages'),
    getCollection('blogs'),
  ])
  const [pages, blogs] = await Promise.all([
    pagesCol.find({ status: 'published' }).toArray(),
    blogsCol.find({ published: true }).toArray(),
  ])

  const urls = [
    `${SITE_URL}/`,
    ...pages.map(p => `${SITE_URL}${(p as unknown as { fullPath: string }).fullPath}`),
    ...blogs.map(b => `${SITE_URL}/blog/${(b as unknown as { slug: string }).slug}`),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
