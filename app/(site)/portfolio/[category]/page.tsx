import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCollection } from '@/lib/db/mongodb'
import type { PageDoc } from '@/types'
import { BuilderRenderer } from '@/components/builder/canvas/BuilderRenderer'

export const dynamic = 'force-dynamic'

async function getPortfolioPage() {
  try {
    const col = await getCollection<PageDoc>('pages')
    return await col.findOne({ fullPath: '/portfolio', status: 'published' })
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPortfolioPage()
  if (!page) return {}

  const seo = page.seo || {}
  const isIndexed = seo.robots?.index !== false
  const isFollowed = seo.robots?.follow !== false

  return {
    title: seo.title || page.title,
    description: seo.description || '',
    keywords: seo.keywords?.join(', ') || '',
    openGraph: {
      title: seo.ogTitle || seo.title || page.title,
      description: seo.ogDescription || seo.description || '',
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    twitter: {
      title: seo.twitterTitle || seo.title || page.title,
      description: seo.twitterDescription || seo.description || '',
      images: seo.twitterImage ? [seo.twitterImage] : [],
    },
    alternates: {
      canonical: seo.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || ''}/portfolio`,
    },
    robots: `${isIndexed ? 'index' : 'noindex'},${isFollowed ? 'follow' : 'nofollow'}`,
  }
}

export default async function CategoryPage() {
  const page = await getPortfolioPage()
  if (!page) notFound()
  return <BuilderRenderer sections={page.layout?.sections || []} />
}
