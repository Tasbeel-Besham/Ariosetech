import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCollection } from '@/lib/db/mongodb'
import { webPageSchema, serviceSchema, isServicePath, faqSchema, faqFromSections, itemListSchema } from '@/lib/schema'
import type { PageDoc } from '@/types'
import { BuilderRenderer } from '@/components/builder/canvas/BuilderRenderer'
import { withServerData } from '@/lib/builder/server-data'
import SetFooterCta from '@/components/layout/SetFooterCta'


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

type Props = { params: Promise<{ slug: string[] }> }

async function getPageData(slugArray: string[]) {
  const path = '/' + slugArray.join('/')
  try {
    const col = await getCollection<PageDoc>('pages')
    return await col.findOne({ fullPath: path, status: 'published' })
  } catch {
    return null
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png'

/**
 * Pull a usable description out of the page's own sections when no SEO
 * description is set.
 *
 * A page that ships with no <meta name="description"> hands Google a blank
 * cheque to write the snippet itself, usually from whatever text happens to be
 * near the top. That is why this fallback exists at all.
 *
 * It was checking exactly four prop names — desc, intro, sub, body — which is
 * why /services and /services/wordpress still went out with no description:
 * their heroes store the copy under `subheadline`, a name the old list did not
 * know about. The section components between them use at least a dozen names
 * for "the paragraph under the heading", so the list now covers all of them,
 * in rough order of how well each one summarises a page.
 *
 * Hidden sections are skipped — describing a page by text it never shows is
 * both wrong and a snippet Google will overwrite anyway.
 */
const DESCRIPTION_PROPS = [
  // Explicit summaries first — closest in intent to a meta description.
  'seoDescription', 'metaDescription', 'summary',
  // Hero sub-copy. `subheadline` is what InteractiveHeroSection and
  // ToolHeroSection use, and it is the single most common miss.
  'subheadline', 'subhead', 'subtitle', 'sub',
  // Generic body copy.
  'desc', 'description', 'intro', 'lede', 'lead', 'blurb', 'body', 'text', 'copy',
] as const

/** Collapse whitespace and trim to a length Google will actually display. */
function tidy(raw: string): string {
  const clean = raw.replace(/\s+/g, ' ').trim()
  if (clean.length <= 160) return clean
  // Cut on a word boundary rather than mid-word.
  const cut = clean.slice(0, 160)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut).replace(/[,;:\s]+$/, '')
}

function deriveDescription(page: PageDoc): string | undefined {
  const sections = page.layout?.sections || []
  for (const s of sections) {
    if ((s as { meta?: { hidden?: boolean } }).meta?.hidden) continue
    const p = (s as { props?: Record<string, unknown> }).props || {}
    for (const key of DESCRIPTION_PROPS) {
      const candidate = p[key]
      if (typeof candidate === 'string' && candidate.replace(/\s+/g, ' ').trim().length > 40) {
        return tidy(candidate)
      }
    }
  }
  return undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageData(slug)
  if (!page) return {}

  const seo = page.seo || {}
  const path = '/' + slug.join('/')
  const isIndexed = seo.robots?.index !== false
  const isFollowed = seo.robots?.follow !== false

  // Strip any brand suffix typed in the admin — the root template appends it once.
  const title = (seo.title || page.title || '').replace(/\s*[|\u2014-]\s*ARIOSETECH\s*$/i, '')
  // Never emit an empty description — it suppresses the tag and Google writes its own snippet.
  const description = seo.description || deriveDescription(page)
  const ogImage = seo.ogImage || DEFAULT_OG_IMAGE

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName: 'ARIOSETECH',
      url: `${SITE_URL}${path}`,
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
      canonical: seo.canonicalUrl || `${SITE_URL}${path}`,
    },
    robots: `${isIndexed ? 'index' : 'noindex'},${isFollowed ? 'follow' : 'nofollow'}`,
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageData(slug)
  if (!page || !page.layout || !page.layout.sections || page.layout.sections.length === 0) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com';
  const pageUrl = `${siteUrl}${page.fullPath}`;

  // Auto-attach structured data so every builder page has schema (previously
  // only the homepage, blog and FAQ did). WebPage + Breadcrumbs always; Service
  // schema when the path is under /services.
  const seo = page.seo || {}
  const desc = seo.description || deriveDescription(page)
  // BreadcrumbList is NOT emitted here. It is emitted once, site-wide, by
  // <AutoBreadcrumbs> from the same trail it visibly renders \u2014 see that file.
  // Emitting it in both places produced two BreadcrumbList nodes per page.
  const schemas: object[] = [
    webPageSchema({ title: (seo.title || page.title || '').replace(/\s*[|\u2014-]\s*ARIOSETECH\s*$/i, ''), description: desc, url: pageUrl, image: seo.ogImage }),
  ]
  if (isServicePath(page.fullPath)) {
    schemas.push(serviceSchema({ name: page.title || 'Service', description: desc, url: pageUrl }))
  }

  // ── Automatic FAQPage ──
  // Any page with an FAQ section gets FAQPage schema generated from its saved
  // items. Editors add or edit FAQ entries in the builder and the structured
  // data follows automatically — no separate step, never out of sync.
  const faqs = faqFromSections(page.layout?.sections)
  if (faqs.length > 0) schemas.push(faqSchema(faqs))

  // ── Automatic ItemList for hub pages ──
  // A hub (e.g. /industries) lists child pages via a services-overview section;
  // emit ItemList so Google understands the collection.
  // `!s.meta?.hidden` matters: BuilderRenderer skips hidden sections, so an
  // ItemList built from one would describe a list the page never shows.
  const overview = (page.layout?.sections as Record<string, any>[] | undefined)
    ?.find(s => s?.type === 'services-overview' && !s?.meta?.hidden && Array.isArray(s?.props?.items) && s.props.items.length > 2)
  if (overview) {
    const listItems = (overview.props.items as Record<string, any>[])
      .map(it => ({
        name: String(it?.title || '').trim(),
        url: it?.href ? new URL(String(it.href), SITE_URL).toString() : pageUrl,
        description: it?.desc ? String(it.desc) : undefined,
      }))
      .filter(it => it.name)
    if (listItems.length > 2) {
      schemas.push(itemListSchema({ name: page.title || 'List', url: pageUrl, items: listItems }))
    }
  }

  // Fill data-driven sections (portfolio, blog) on the server so their content
  // lands in the initial HTML instead of appearing only after a client fetch.
  const sections = await withServerData(page.layout.sections)

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      {/* Visible breadcrumbs are rendered site-wide by the layout. */}
      {page.footerCta && (page.footerCta.headline || page.footerCta.desc) && (
        <SetFooterCta
          headline={page.footerCta.headline}
          desc={page.footerCta.desc}
          primaryLabel={page.footerCta.primaryLabel}
          primaryHref={page.footerCta.primaryHref}
        />
      )}
      <BuilderRenderer
        sections={sections}
        pageName={page.title || 'Page'}
        pageUrl={pageUrl}
      />
    </>
  )
}
