import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCollection } from '@/lib/db/mongodb'
import type { PageDoc } from '@/types'
import { BuilderRenderer } from '@/components/builder/canvas/BuilderRenderer'
import PortfolioSection from '@/components/sections/PortfolioSection'
import CtaSection from '@/components/sections/CtaSection'

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
  if (!page) return { title: 'Portfolio | Ariosetech', description: 'Explore our web development portfolio.' }

  const seo = page.seo || {}
  const isIndexed = seo.robots?.index !== false
  const isFollowed = seo.robots?.follow !== false

  return {
    title: seo.title || page.title || 'Portfolio | Ariosetech',
    description: seo.description || 'Explore our web development portfolio.',
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

export default async function PortfolioPage() {
  const page = await getPortfolioPage()
  
  if (page && page.layout?.sections && page.layout.sections.length > 0) {
    return <BuilderRenderer sections={page.layout.sections} pageName="Portfolio" pageUrl="https://ariosetech.com/portfolio" />
  }

  // Fallback if no page in DB
  return (
    <>
      <PortfolioSection />
      <CtaSection />
    </>
  )
}
