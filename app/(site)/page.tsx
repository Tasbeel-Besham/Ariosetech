import { getCollection } from '@/lib/db/mongodb'
import type { Metadata } from 'next'
import type { PageDoc, BlogDoc, PortfolioDoc } from '@/types'
import { BuilderRenderer } from '@/components/builder/canvas/BuilderRenderer'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const col = await getCollection<PageDoc>('pages')
    const page = await col.findOne({ fullPath: '/', status: 'published' })
    if (!page) return {}
    const seo = page.seo || {}
    const isIndexed = seo.robots?.index !== false
    const isFollowed = seo.robots?.follow !== false
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'
    const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png'
    const DEFAULT_DESC = 'Professional WordPress, Shopify & WooCommerce development since 2017. 100+ businesses scaled globally.'
    const title = seo.title || page.title
    const description = seo.description || DEFAULT_DESC
    const ogImage = seo.ogImage || DEFAULT_OG_IMAGE
    return {
      title,
      description,
      keywords: seo.keywords?.length ? seo.keywords.join(', ') : undefined,
      openGraph: {
        type: 'website',
        siteName: 'ARIOSETECH',
        url: `${SITE_URL}/`,
        title: seo.ogTitle || title,
        description: seo.ogDescription || description,
        images: [ogImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.twitterTitle || title,
        description: seo.twitterDescription || description,
        images: [seo.twitterImage || ogImage],
      },
      alternates: {
        canonical: seo.canonicalUrl || `${SITE_URL}/`,
      },
      robots: `${isIndexed ? 'index' : 'noindex'},${isFollowed ? 'follow' : 'nofollow'}`,
    }
  } catch {
    return {}
  }
}

export default async function Home() {
  let layout = null

  try {
    const pagesCol = await getCollection<PageDoc>('pages')
    const page = await pagesCol.findOne({ fullPath: '/' })
    if (page?.layout?.sections && page.layout.sections.length > 0) {
      layout = page.layout
    }
  } catch (err) {
    console.error('Error fetching homepage layout:', err)
  }

  // If the dynamic builder layout is found, use it
  if (layout) {
    return <BuilderRenderer sections={layout.sections} pageName="Home" pageUrl="https://ariosetech.com/" />
  }

  // Fallback to static HomeClient if DB fails or isn't seeded
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
