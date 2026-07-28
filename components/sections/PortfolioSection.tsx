'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from '@/components/ui/Icons'
import SectionHeading from '@/components/ui/SectionHeading'

type Item = {
  title: string; client: string; platform: string; result: string; resultLabel: string; quote: string;
  image?: string; url?: string; slug?: string; cat?: string
}

type Props = {
  headingTag?: string;
  eyebrow?: string; headline?: string; intro?: string; items?: Item[]; ctaLabel?: string; ctaHref?: string
}

/**
 * Portfolio grid — FexArt-style: a 3-column grid of project cards. Each card is
 * a framed screenshot on a tinted background with the category + title below.
 * On hover, a tall full-page screenshot pans from top to bottom inside the
 * frame, revealing the whole page. Rendered in the ARIOSETECH brand palette.
 */

// One card, so each manages its own hover-pan independently.
function ProjectCard({ item, index }: { item: Item; index: number }) {
  const catClass = (item.cat || 'other').toLowerCase()
  const href = item.slug ? `/portfolio/${catClass}/${item.slug}` : (item.url || '#')

  // A full-page screenshot service is used when no image is provided, so the
  // pan effect always has a tall image to scroll through.
  const screenshot =
    item.image ||
    (item.url ? `https://image.thum.io/get/width/1000/crop/3000/noanimate/${item.url}` : '')

  return (
    <Link href={href} className="pfc" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="pfc-frame">
        {screenshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={screenshot} alt={item.title} className="pfc-shot" loading="lazy" />
        ) : (
          <div className="pfc-fallback"><span>{item.platform}</span></div>
        )}
        <div className="pfc-frame-overlay" />
        <span className="pfc-arrow"><ArrowRight size={18} /></span>
      </div>
      <div className="pfc-meta">
        <span className="pfc-cat">{catClass === 'other' ? 'Project' : catClass.toUpperCase()}</span>
        <h3 className="pfc-title">{item.title}</h3>
      </div>
    </Link>
  )
}

export default function PortfolioSection({
  eyebrow = 'Our Work',
  headline = 'Success Stories That Speak for Themselves',
  headingTag = 'h2',
  intro = '',
  items = [],
  ctaLabel = 'Start a Project',
  ctaHref = '/contact',
}: Props) {
  const safeItems: Item[] = Array.isArray(items) ? items : []
  const pathname = usePathname()
  const [dbItems, setDbItems] = useState<Item[]>([])

  const defaultFilter = pathname?.match(/^\/portfolio\/([^/]+)\/?$/) ? pathname.split('/')[2].toLowerCase() : 'all'
  const [filter, setFilter] = useState(defaultFilter)

  // Fetch full portfolio from the DB (same behaviour as before).
  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return
        const mapped = data.map((item: Record<string, any>) => {
          const result = item.results?.[0]?.value || ''
          const resultLabel = item.results?.[0]?.label || ''
          return {
            title: item.title, client: item.client,
            platform: item.category || 'other', cat: item.category || 'other',
            result, resultLabel,
            quote: item.quote || item.summary || '',
            image: item.image, url: item.clientUrl, slug: item.slug,
          }
        })
        setDbItems(mapped)
      })
      .catch(console.error)
  }, [])

  // Explicit page picks win; otherwise fall back to the full DB collection.
  const displayItems = safeItems.length > 0 ? safeItems : dbItems
  const displayCats = Array.from(new Set(displayItems.map(item => (item.cat || 'other').toLowerCase())))
  const filtered = filter === 'all' ? displayItems : displayItems.filter(p => (p.cat || '').toLowerCase() === filter)

  return (
    <section id="projects" className="section section--dark pf-grid-section">
      <div className="container">
        {/* Heading */}
        <div className="pf-grid-head">
          <p className="eyebrow font-mono text-primary uppercase tracking-widest font-bold text-10 mb-4">{eyebrow}</p>
          <SectionHeading as={headingTag} className="pf-grid-headline">{headline}</SectionHeading>
          {intro && <p className="pf-grid-intro">{intro}</p>}
        </div>

        {/* Filters */}
        {displayCats.length > 1 && (
          <div className="pf-filters">
            <button className={`pf-fb ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</button>
            {displayCats.map(c => (
              <button key={c} className={`pf-fb ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-gray-3 text-center py-12">No projects to show yet.</p>
        ) : (
          <div className="pf-grid">
            {filtered.map((item, i) => (
              <ProjectCard key={`${item.slug || item.title}-${i}`} item={item} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        {ctaLabel && (
          <div className="pf-grid-cta">
            <Link href={ctaHref} className="btn btn-primary btn-lg">{ctaLabel} <ArrowRight size={16} /></Link>
          </div>
        )}
      </div>
    </section>
  )
}
