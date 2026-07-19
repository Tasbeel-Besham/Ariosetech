import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCollection } from '@/lib/db/mongodb'
import { webPageSchema, serviceSchema, breadcrumbSchema, trailFromPath, isServicePath } from '@/lib/schema'
import type { PageDoc } from '@/types'
import { BuilderRenderer } from '@/components/builder/canvas/BuilderRenderer'
import SetFooterCta from '@/components/layout/SetFooterCta'


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

/** Pull a usable description out of the page's own sections when no SEO description is set. */
function deriveDescription(page: PageDoc): string | undefined {
  const sections = page.layout?.sections || []
  for (const s of sections) {
    const p = (s as { props?: Record<string, unknown> }).props || {}
    const candidate = (p.desc || p.intro || p.sub || p.body) as string | undefined
    if (typeof candidate === 'string' && candidate.trim().length > 40) {
      return candidate.trim().slice(0, 160)
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
    keywords: seo.keywords?.length ? seo.keywords.join(', ') : undefined,
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
  const schemas: object[] = [
    webPageSchema({ title: (seo.title || page.title || '').replace(/\s*[|\u2014-]\s*ARIOSETECH\s*$/i, ''), description: desc, url: pageUrl, image: seo.ogImage }),
    breadcrumbSchema(trailFromPath(page.fullPath, page.title || 'Page')),
  ]
  if (isServicePath(page.fullPath)) {
    schemas.push(serviceSchema({ name: page.title || 'Service', description: desc, url: pageUrl }))
  }

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      {page.footerCta && (page.footerCta.headline || page.footerCta.desc) && (
        <SetFooterCta
          headline={page.footerCta.headline}
          desc={page.footerCta.desc}
          primaryLabel={page.footerCta.primaryLabel}
          primaryHref={page.footerCta.primaryHref}
        />
      )}
      <BuilderRenderer
        sections={page.layout.sections}
        pageName={page.title || 'Page'}
        pageUrl={pageUrl}
      />
    </>
  )
}
