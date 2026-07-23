'use client'
import Link from 'next/link'
import { CheckSVG, ArrowSVG } from '@/components/ui/IconBox'
import SectionHeading from '@/components/ui/SectionHeading'

type Cap = { title?: string; desc?: string }

type Props = {
  headingTag?: string
  eyebrow?: string
  headline?: string
  desc?: string
  ctaLabel?: string
  ctaHref?: string
  items?: Cap[]
}

const DEFAULT_ITEMS: Cap[] = [
  { title: 'Custom, not templated', desc: 'Every build is designed around your brand and goals — no recycled themes.' },
  { title: 'Speed-obsessed', desc: 'Core Web Vitals in the green, because slow sites lose customers.' },
  { title: 'SEO from day one', desc: 'Clean markup, schema, and structure that search engines reward.' },
  { title: 'Mobile-first', desc: 'Designed for the phone first, where most of your traffic actually is.' },
  { title: 'Secure by default', desc: 'Hardening, backups, and monitoring baked into every project.' },
  { title: 'Support that stays', desc: 'We do not disappear at launch — ongoing care keeps you running.' },
]

export default function CapabilitiesSection({
  eyebrow = 'How We Work',
  headline = 'The standard behind every project',
  headingTag = 'h2',
  desc = 'Whatever platform you need, the fundamentals never change. This is what you get with ARIOSETECH — on every engagement, at every price point.',
  ctaLabel = 'Start Your Project',
  ctaHref = '/contact',
  items = [],
}: Props) {
  const list = items.length ? items : DEFAULT_ITEMS
  return (
    <section className="section section--dark cap-sec">
      <div className="container">
        <div className="cap-grid">
          {/* Sticky claim */}
          <div className="cap-claim">
            <p className="eyebrow">{eyebrow}</p>
            <SectionHeading as={headingTag} className="cap-headline">{headline}</SectionHeading>
            <p className="cap-desc">{desc}</p>
            {ctaLabel && (
              <Link href={ctaHref} className="btn btn-primary btn-lg cap-cta">
                {ctaLabel} <ArrowSVG size={15} />
              </Link>
            )}
          </div>

          {/* Capability list */}
          <div className="cap-list">
            {list.map((c, i) => (
              <div key={i} className="cap-item">
                <span className="cap-check"><CheckSVG size={13} /></span>
                <div>
                  <p className="cap-item-title">{c.title}</p>
                  {c.desc && <p className="cap-item-desc">{c.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
