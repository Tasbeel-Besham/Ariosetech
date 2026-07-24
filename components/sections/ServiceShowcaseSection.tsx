'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from '@/components/ui/Icons'
import SectionHeading from '@/components/ui/SectionHeading'

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
                  {s.icon && <span className="svcx-icon">{s.icon}</span>}
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
