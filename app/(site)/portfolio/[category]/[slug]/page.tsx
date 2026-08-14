import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, ExternalLink } from '@/components/ui/Icons'
import { getCollection } from '@/lib/db/mongodb'
import { caseStudySchema, breadcrumbSchema, trailFromPath } from '@/lib/schema'
import PortfolioCarousel from '@/components/portfolio/PortfolioCarousel'
import Image from 'next/image'

type Props = { params: Promise<{ category: string; slug: string }> }

type PortfolioSection = { id: string; type: string; title: string; content: string; items?: string[] }

type PortfolioItem = {
  _id: unknown; slug: string; title: string; client: string; clientUrl?: string
  category: string; summary: string; challenge: string; solution: string; quote: string
  results: { label: string; value: string }[]; stack: string[]; image?: string; gallery?: string[]
  sections?: PortfolioSection[]
  featured: boolean; published: boolean; updatedAt: string
}

const CAT_COLOR: Record<string, string> = {
  wordpress: '#4f6ef7', woocommerce: '#9b6dff', shopify: '#766cff', seo: '#fbbf24'
}

async function getItem(slug: string) {
  try {
    const col = await getCollection<PortfolioItem>('portfolio')
    return await col.findOne({ slug, published: true })
  } catch { return null }
}

/** The one canonical path for an item. */
function canonicalPath(item: { category?: string; slug: string }): string {
  return `/portfolio/${(item.category || 'other').toLowerCase()}/${item.slug}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const item = await getItem(slug)
  if (!item) return {}
  // The category segment was previously ignored, so /portfolio/<anything>/<slug>
  // served identical content at unlimited URLs. Mismatches are noindexed here
  // and 301'd in the page component.
  if ((category || '').toLowerCase() !== (item.category || 'other').toLowerCase()) {
    return { robots: 'noindex,follow' }
  }
  return {
    title: `${item.title}, Case Study`,
    alternates: { canonical: `https://ariosetech.com/portfolio/${(item.category||'other').toLowerCase()}/${item.slug}` },
    // Twitter was falling through to the site-wide default, so every case
    // study shared on X showed the generic agency card and logo instead of the
    // project's own title and screenshot. openGraph was set; twitter was not.
    twitter: {
      card: 'summary_large_image',
      title: `${item.title} — ${item.client}`,
      description: item.summary || `${item.title} case study by ARIOSETECH.`,
      images: item.image ? [item.image] : [],
    },
    openGraph: {
      type: 'article',
      title: item.title,
      description: item.summary || undefined,
      url: `https://ariosetech.com/portfolio/${(item.category||'other').toLowerCase()}/${item.slug}`,
      ...(item.image ? { images: [item.image] } : {}),
    },
    description: item.summary,
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { category, slug } = await params
  const item = await getItem(slug)
  if (!item) notFound()

  // Send any wrong-category URL to the single canonical one with a 301. A
  // redirect rather than a 404 so existing inbound links keep working and pass
  // their authority on.
  if ((category || '').toLowerCase() !== (item.category || 'other').toLowerCase()) {
    permanentRedirect(canonicalPath(item))
  }

  // Normalize fields that may arrive as a comma-separated string (from the seed
  // or the admin form) or as an array. Calling .map() on a string crashes SSR.
  const stackList: string[] = Array.isArray((item as any).stack)
    ? (item as any).stack
    : typeof (item as any).stack === 'string' && (item as any).stack.trim()
      ? (item as any).stack.split(',').map((t: string) => t.trim()).filter(Boolean)
      : []
  const resultsList: { label: string; value: string }[] = Array.isArray((item as any).results)
    ? (item as any).results
    : []

  // Gallery for the carousel. Accepts an array or comma/newline-separated string.
  // Falls back to any images used in the body sections so the carousel is
  // populated even before a dedicated gallery is set.
  const rawGallery = (item as any).gallery
  let galleryList: string[] = Array.isArray(rawGallery)
    ? rawGallery.filter(Boolean)
    : typeof rawGallery === 'string' && rawGallery.trim()
      ? rawGallery.split(/[\n,]/).map((s: string) => s.trim()).filter(Boolean)
      : []
  if (galleryList.length === 0 && Array.isArray(item.sections)) {
    galleryList = item.sections
      .filter((s: PortfolioSection) => s.type === 'image' && s.content)
      .map((s: PortfolioSection) => s.content as string)
  }

  const color = CAT_COLOR[item.category] || '#766cff'
  const F = { fontFamily: 'var(--font-display)' } as React.CSSProperties
  const M = { fontFamily: 'var(--font-mono)' } as React.CSSProperties

  // Structured data for this case study: CreativeWork describing the project
  // plus a breadcrumb trail. Generated from the saved item, so editing the
  // project in Admin → Portfolio updates the schema automatically.
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'
  const caseUrl = `${SITE_URL}/portfolio/${(item.category || 'other').toLowerCase()}/${item.slug}`
  const caseLd = caseStudySchema({
    title: item.title,
    description: item.summary || item.challenge || undefined,
    url: caseUrl,
    image: item.image || undefined,
    clientName: item.client || undefined,
    keywords: [item.category, ...stackList].filter(Boolean) as string[],
  })
  // Built from the path with the same helper the visible breadcrumb uses.
  // This previously declared three levels (Home / Portfolio / Title) while the
  // URL and the visible trail have four (Home / Portfolio / Category / Slug) —
  // structured data that doesn't match the page.
  const crumbLd = breadcrumbSchema(trailFromPath(canonicalPath(item)))

  return (
    <div style={{ '--proj-color': color } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      {/* Visible breadcrumbs are rendered site-wide by the layout. */}
      {/* Hero — text on the left, project image featured on the right */}
      <section className="pd-hero pd-hero-img">
        <div className="pd-hero-glow" />
        <div className="container relative z-1">
          <Link href={`/portfolio/${(item.category || 'other').toLowerCase()}`} className="pd-back hover:text-[var(--text-2)]">
            <ArrowLeft size={13} /> Back to Portfolio
          </Link>

          <div className="pd-hero-grid">
            <div className="pd-hero-copy">
              <div className="flex items-center gap-10 mb-6">
                <span className="pd-cat">{item.category}</span>
              </div>
              <h1 className="pd-title">{item.title}</h1>
              <p className="pd-client">{item.client}</p>
              <p className="pd-summary">{item.summary}</p>
              {item.clientUrl && (
                <a href={item.clientUrl} target="_blank" rel="noopener noreferrer" className="pd-visit">
                  Visit Live Site <ExternalLink size={14} />
                </a>
              )}
            </div>

            {item.image && (
              <div className="pd-hero-media">
                <div className="pd-hero-media-frame">
                  {/* Hero image: the LCP element on this page, so priority
                      loads it eagerly instead of waiting on lazy discovery. */}
                  <Image src={item.image} alt={item.title} width={1280} height={800} priority sizes="(max-width: 900px) 100vw, 900px" className="pd-hero-media-img" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results stats */}
      {resultsList.length > 0 && (
        <section className="pd-stats-section">
          <div className="container">
            <p className="pd-label text-center mb-28-i">Results Achieved</p>
            <div className="portfolio-stats-grid pd-stats-grid" style={{ '--stat-cols': Math.min(resultsList.length, 4) } as React.CSSProperties}>
              {resultsList.map((r) => (
                <div key={r.label} className="pd-stat pd-stat-r20 bg-3">
                  <p className="pd-stat-value">{r.value}</p>
                  <p className="pd-stat-label">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Challenge + Solution */}
      <section className="pd-section-80">
        <div className="container">
          <div className="g-2 gap-[48px]">
            {item.challenge && (
              <div>
                <p className="pd-label mb-14-i">The Challenge</p>
                <h2 className="pd-h2">What problem did we solve?</h2>
                <p className="pd-body">{item.challenge}</p>
              </div>
            )}
            {item.solution && (
              <div>
                <p className="pd-label mb-14-i">Our Solution</p>
                <h2 className="pd-h2">How we built it</h2>
                <p className="pd-body">{item.solution}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quote */}
      {item.quote && (
        <section className="pd-section-80 bg-2-section">
          <div className="container pd-quote-wrap">
            <div className="pd-quote-mark">&ldquo;</div>
            <p className="pd-quote">{item.quote}</p>
            <p className="pd-quote-by">{item.client}</p>
          </div>
        </section>
      )}

      {/* Tech stack */}
      {stackList.length > 0 && (
        <section className="pd-section-60">
          <div className="container">
            <p className="pd-label text-center mb-20-i">Technologies Used</p>
            <div className="flex flex-wrap gap-10 justify-center">
              {stackList.map(tech => (
                <div key={tech} className="pd-tech">
                  <Check size={12} className="pd-accent" /> {tech}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Extra sections */}
      {item.sections && item.sections.length > 0 && item.sections.map(sec => (
        <section key={sec.id} className="pd-section-72">
          <div className="container">
            {sec.title && (
              <p className="pd-label mb-10-i">{sec.title}</p>
            )}

            {sec.type === 'text' && (
              <p className="pd-text">{sec.content}</p>
            )}

            {sec.type === 'quote' && (
              <div className="pd-quote-wrap-sm">
                <div className="pd-quote-mark-sm">&ldquo;</div>
                <p className="pd-quote pd-quote-sm">{sec.content}</p>
              </div>
            )}

            {sec.type === 'image' && sec.content && (
              <div className="pd-img-frame">
                <Image src={sec.content} alt={sec.title || 'Project image'} width={1280} height={800} sizes="(max-width: 900px) 100vw, 900px" className="pd-img" />
              </div>
            )}

            {sec.type === 'highlights' && sec.items && (
              <div className="pd-feature-grid">
                {sec.items.map((item, i) => (
                  <div key={i} className="pd-feature">
                    <div className="pd-check">
                      <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="pd-feature-text">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {sec.type === 'metrics' && sec.items && (
              <div className="portfolio-stats-grid pd-stats-grid" style={{ '--stat-cols': Math.min(sec.items.length, 4) } as React.CSSProperties}>
                {sec.items.map((item, i) => {
                  const [val, lbl] = item.split('::')
                  return (
                    <div key={i} className="pd-stat pd-stat-r16 bg-2-card">
                      <p className="pd-stat-value pd-stat-value-sm">{val}</p>
                      <p className="pd-stat-label">{lbl}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {sec.type === 'technology' && sec.items && (
              <div className="flex flex-wrap gap-10">
                {sec.items.map((tech, i) => (
                  <span key={i} className="pd-tech">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {sec.type === 'process' && sec.items && (
              <div className="flex flex-col gap-12 pd-steps">
                {sec.items.map((step, i) => (
                  <div key={i} className="flex gap-16 items-start">
                    <div className="pd-step-num">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p className="pd-step-text">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Project gallery carousel */}
      {galleryList.length > 0 && (
        <PortfolioCarousel images={galleryList} title={item.title} />
      )}

      {/* CTA */}
      <section className="pd-section-100">
        <div className="container text-center">
          <p className="eyebrow justify-center">Start Your Project</p>
          <h2 className="pd-cta-title">
            Ready for results like these?
          </h2>
          <p className="pd-cta-desc">
            Get a free consultation and let&apos;s discuss how we can deliver similar results for your business.
          </p>
          <div className="flex gap-12 justify-center flex-wrap">
            <Link href="/contact" className="btn btn-primary btn-xl">Start a Project <ArrowRight size={16} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-xl">View More Work</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
