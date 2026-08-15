import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCollection } from '@/lib/db/mongodb'
import type { PageDoc } from '@/types'
import { BuilderRenderer } from '@/components/builder/canvas/BuilderRenderer'
import PortfolioSection from '@/components/sections/PortfolioSection'
import { withServerData, getPortfolioItems } from '@/lib/builder/server-data'
import { webPageSchema, itemListSchema } from '@/lib/schema'
import CtaSection from '@/components/sections/CtaSection'

// Rendered per request.
//
// This was briefly `revalidate = 3600`. That was wrong for this app: the root
// layout's force-dynamic had been forcing EVERY page to render per request, so
// switching it made the whole site prerender at build time — including pages
// whose files were never touched. Any page whose database read failed or came
// back empty during the build got that empty result baked in and served until
// the next revalidation.
//
// Caching is still worth doing here, but only once the build is known to reach
// MongoDB reliably. Correct beats fast.
export const dynamic = 'force-dynamic'

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
  const copy = CATEGORY_COPY[cat]
  const label = copy?.label || cat.charAt(0).toUpperCase() + cat.slice(1)
  const catUrl = `${SITE_URL}/portfolio/${cat}`

  // ── Structured data ──
  // These four category URLs previously emitted no schema at all: the builder
  // branch called BuilderRenderer without a pageUrl, and the fallback branch
  // rendered raw sections. WebPage describes the page; ItemList describes the
  // projects it actually lists, which is the part worth understanding.
  // BreadcrumbList comes from <AutoBreadcrumbs> site-wide.
  // NB: getPortfolioItems() returns the shape PortfolioSection consumes, where
  // the category lives on `cat` (not `category`) and the blurb on `quote`.
  const allItems = await getPortfolioItems()
  const catItems = allItems.filter(p => String(p.cat || '').toLowerCase() === cat)

  const schemas: object[] = [
    webPageSchema({
      title: copy?.title || `${label} Projects`,
      description:
        copy?.description ||
        `Selected ${label} projects delivered by ARIOSETECH — real builds with the results behind them.`,
      url: catUrl,
    }),
  ]
  if (catItems.length > 2) {
    schemas.push(
      itemListSchema({
        name: copy?.title || `${label} Projects`,
        url: catUrl,
        items: catItems
          .map(p => ({
            name: String(p.title || ''),
            url: `${SITE_URL}/portfolio/${cat}/${p.slug}`,
            description: p.quote ? String(p.quote) : undefined,
          }))
          // Drop anything with no title or no slug — a bare /portfolio/{cat}/
          // entry in an ItemList points at a URL that does not exist.
          .filter(i => Boolean(i.name) && !i.url.endsWith('/')),
      }),
    )
  }

  const schemaTags = schemas.map((s, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
  ))

  if (page && page.layout?.sections && page.layout.sections.length > 0) {
    const sections = await withServerData(page.layout.sections)
    return (
      <>
        {schemaTags}
        <BuilderRenderer sections={sections} />
      </>
    )
  }

  // Fallback path: pass items in as props so they are server-rendered too.
  return (
    <>
      {schemaTags}
      <PortfolioSection items={allItems} />
      <CtaSection />
    </>
  )
}
