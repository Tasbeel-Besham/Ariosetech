import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCollection } from '@/lib/db/mongodb'
import type { PageDoc } from '@/types'
import { BuilderRenderer } from '@/components/builder/canvas/BuilderRenderer'
import PortfolioSection from '@/components/sections/PortfolioSection'
import CtaSection from '@/components/sections/CtaSection'

// Cached, with on-demand invalidation when portfolio items or pages are saved.
// Previously force-dynamic, so every crawl and every visitor paid a full round
// trip to MongoDB.
export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

type Props = { params: Promise<{ category: string }> }

/** Categories that always resolve, even before a project is tagged with them. */
const BASE_CATEGORIES = ['wordpress', 'woocommerce', 'shopify', 'seo']

/**
 * Per-category title and description. Without these, all four category pages
 * inherited the identical title and description from the /portfolio page
 * document — four URLs competing with the same snippet.
 */
const CATEGORY_COPY: Record<string, { label: string; title: string; description: string }> = {
  wordpress: {
    label: 'WordPress',
    title: 'WordPress Development Portfolio',
    description: 'Custom WordPress websites we have designed, built and optimised — themes, plugins and performance work for businesses worldwide.',
  },
  woocommerce: {
    label: 'WooCommerce',
    title: 'WooCommerce Store Portfolio',
    description: 'WooCommerce stores we have built — custom checkouts, multi-vendor setups, payment gateway integrations and conversion optimisation.',
  },
  shopify: {
    label: 'Shopify',
    title: 'Shopify Development Portfolio',
    description: 'Shopify and Shopify Plus stores we have built — custom Liquid sections, B2B wholesale platforms, migrations and app integrations.',
  },
  seo: {
    label: 'SEO',
    title: 'SEO Case Studies',
    description: 'SEO campaigns with measurable outcomes — technical fixes, content strategy and on-page work, with the traffic data behind each result.',
  },
}

/**
 * The set of categories allowed to render.
 *
 * `[category]` matches any string, so without this guard every made-up path
 * (/portfolio/anything) returns a valid 200. That is a crawl trap: unlimited
 * indexable URLs all serving identical content. Anything outside the set 404s.
 */
async function allowedCategories(): Promise<Set<string>> {
  const base = new Set(BASE_CATEGORIES)
  try {
    const col = await getCollection('portfolio')
    const found = await col.distinct('category', { published: true })
    for (const c of found) {
      if (typeof c === 'string' && c.trim()) base.add(c.trim().toLowerCase())
    }
  } catch {
    // DB unavailable — fall back to the base list rather than 404 everything.
  }
  return base
}

async function getPortfolioPage() {
  try {
    const col = await getCollection<PageDoc>('pages')
    return await col.findOne({ fullPath: '/portfolio', status: 'published' })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = decodeURIComponent(category || '').toLowerCase()

  const allowed = await allowedCategories()
  if (!allowed.has(cat)) return { robots: 'noindex,nofollow' }

  const page = await getPortfolioPage()
  const seo = page?.seo || {}
  const copy = CATEGORY_COPY[cat]

  const label = copy?.label || cat.charAt(0).toUpperCase() + cat.slice(1)
  const title = copy?.title || `${label} Projects`
  const description =
    copy?.description ||
    `Selected ${label} projects delivered by ARIOSETECH — real builds with the results behind them.`

  const isIndexed = seo.robots?.index !== false
  const isFollowed = seo.robots?.follow !== false

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName: 'ARIOSETECH',
      url: `${SITE_URL}/portfolio/${cat}`,
      title,
      description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: seo.twitterImage ? [seo.twitterImage] : [],
    },
    alternates: {
      // Self-referencing. This previously pointed every category page at
      // /portfolio, telling Google these four URLs were duplicates that should
      // not be indexed in their own right.
      canonical: `${SITE_URL}/portfolio/${cat}`,
    },
    robots: `${isIndexed ? 'index' : 'noindex'},${isFollowed ? 'follow' : 'nofollow'}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = decodeURIComponent(category || '').toLowerCase()

  const allowed = await allowedCategories()
  if (!allowed.has(cat)) notFound()

  const page = await getPortfolioPage()

  if (page && page.layout?.sections && page.layout.sections.length > 0) {
    return <BuilderRenderer sections={page.layout.sections} />
  }

  return (
    <>
      <PortfolioSection />
      <CtaSection />
    </>
  )
}
