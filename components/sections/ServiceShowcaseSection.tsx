'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from '@/components/ui/Icons'
import SectionHeading from '@/components/ui/SectionHeading'

/* Clean line SVG icons keyed by name. Editors pick a name in the dashboard
   ("wordpress", "cart", "store", "seo", "code", "rocket") instead of pasting
   an emoji, so icons stay crisp and on-brand at any size. */
const ICONS: Record<string, React.ReactNode> = {
  wordpress: (<><circle cx="12" cy="12" r="9" /><path d="M4 9h9M6 12l3 6M15 6l3 9M11 15l2-9" /></>),
  cart: (<><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 7H5" /></>),
  store: (<><path d="M3 9l1-5h16l1 5M4 9v11h16V9M3 9h18M9 20v-6h6v6" /></>),
  seo: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4M8 11l2 2 4-4" /></>),
  code: (<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>),
  rocket: (<><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0zM12 15l-3-3a22 22 0 0 1 8-11c3 0 6 3 6 6a22 22 0 0 1-11 8zM9 12H4s.5-3 2-4 5-1 5-1M12 15v5s3-.5 4-2 1-5 1-5" /></>),
  chart: (<><line x1="3" y1="21" x2="21" y2="21" /><rect x="6" y="11" width="3" height="7" /><rect x="11" y="7" width="3" height="11" /><rect x="16" y="13" width="3" height="5" /></>),
  gear: (<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2" /></>),
}

function ServiceIcon({ name }: { name?: string }) {
  const key = (name || '').toLowerCase().trim()
  const glyph = ICONS[key] || ICONS.code
  return (
    <svg className="svcx-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {glyph}
    </svg>
  )
}

type ServiceItem = {
  icon?: string
  title: string
  tagline?: string
  desc?: string
  features?: string | string[]
  price?: string
  href?: string
}

type Props = {
  headingTag?: string
  eyebrow?: string
  headline?: string
  intro?: string
  items?: ServiceItem[]
}

const asList = (f?: string | string[]): string[] =>
  Array.isArray(f) ? f : typeof f === 'string' ? f.split(',').map(s => s.trim()).filter(Boolean) : []

/**
 * Compact, scannable service grid. Every service is visible at once as a small
 * card — no scrolling through stacked full-width sections. Clicking a card
 * expands it in place to reveal the full detail (features, price, CTA), so a
 * visitor reads exactly the one they care about without leaving the grid.
 *
 * Signature element: the selected card lifts and spans the full row with an
 * accent spine, while the others dim — the grid reorganises around your focus.
 */
export default function ServiceShowcaseSection({
  headingTag = 'h2',
  eyebrow = 'What We Do',
  headline = 'Everything you need to launch and grow',
  intro,
  items = [],
}: Props) {
  const [open, setOpen] = useState<number | null>(0)

  if (!items.length) return null

  return (
    <section className="section section--dark svcx">
      <div className="svcx-glow" aria-hidden="true" />
      <div className="container relative z-1">
        <div className="svcx-head">
          <p className="eyebrow">{eyebrow}</p>
          <SectionHeading as={headingTag} className="svcx-headline">{headline}</SectionHeading>
          {intro && <p className="svcx-intro">{intro}</p>}
        </div>

        <div className="svcx-grid">
          {items.map((s, i) => {
            const isOpen = open === i
            const features = asList(s.features)
            return (
              <article
                key={i}
                className={`svcx-card ${isOpen ? 'is-open' : ''} ${open !== null && !isOpen ? 'is-dim' : ''}`}
                onClick={() => setOpen(isOpen ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(isOpen ? null : i) } }}
                aria-expanded={isOpen}
              >
                <div className="svcx-card-top">
                  <span className="svcx-icon"><ServiceIcon name={s.icon} /></span>
                  <div className="svcx-card-titlewrap">
                    <h3 className="svcx-card-title">{s.title}</h3>
                    {s.tagline && <p className="svcx-card-tagline">{s.tagline}</p>}
                  </div>
                  {s.price && <span className="svcx-price">{s.price}</span>}
                  <span className="svcx-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </div>

                {/* Expanded detail */}
                <div className="svcx-detail" style={{ maxHeight: isOpen ? '520px' : '0px' }}>
                  <div className="svcx-detail-inner">
                    {s.desc && <p className="svcx-desc">{s.desc}</p>}
                    {features.length > 0 && (
                      <ul className="svcx-features">
                        {features.map((f, fi) => (
                          <li key={fi}><Check size={14} /> {f}</li>
                        ))}
                      </ul>
                    )}
                    {s.href && (
                      <Link href={s.href} className="svcx-cta" onClick={e => e.stopPropagation()}>
                        Explore {s.title} <ArrowRight size={15} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
