import { getCollection } from '@/lib/db/mongodb'
import type { BlogDoc, PortfolioDoc } from '@/types'
import HomeClient from './HomeClient'
import { BuilderRenderer } from '@/components/builder/canvas/BuilderRenderer'
import type { PageDoc, SectionInstance } from '@/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Prefer rendering the homepage from the Builder layout (so admin can edit sections).
  try {
    const pagesCol = await getCollection<PageDoc>('pages')
    const home = await pagesCol.findOne({ fullPath: '/' })
    const layout = (home as unknown as PageDoc | null)?.layout
    const sections = (layout?.sections || []) as SectionInstance[]
    if (sections.length > 0) return <BuilderRenderer sections={sections} />
  } catch {
    // DB not configured — fall back to hardcoded HomeClient
  }

  let blogs: Parameters<typeof HomeClient>[0]['blogs'] = []
  let portfolio: Parameters<typeof HomeClient>[0]['portfolio'] = []

  try {
    const [blogsCol, portfolioCol] = await Promise.all([
      getCollection<BlogDoc>('blogs'),
      getCollection<PortfolioDoc>('portfolio'),
    ])
    const [blogsRaw, portfolioRaw] = await Promise.all([
      blogsCol.find({ published: true }).sort({ date: -1 }).limit(3).toArray(),
      portfolioCol.find({ published: true }).sort({ featured: -1 }).limit(3).toArray(),
    ])

    blogs = blogsRaw.map(b => ({
      _id:      String(b._id),
      slug:     b.slug,
      title:    b.title,
      excerpt:  b.excerpt,
      category: b.category,
      date:     b.date,
      readTime: b.readTime ?? b.readingTime ?? 5,
    }))

    portfolio = portfolioRaw.map(p => ({
      _id:      String(p._id),
      slug:     p.slug,
      title:    p.title,
      client:   p.client,
      category: p.category,
      summary:  p.summary,
      results:  p.results,
      stack:    p.stack,
      featured: p.featured,
    }))
  } catch {
    // DB not configured — render with static fallback data in HomeClient
  }

  return <HomeClient blogs={blogs} portfolio={portfolio} />
}
