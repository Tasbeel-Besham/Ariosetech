'use client'
import Link from 'next/link'

type ServiceCard = {
  icon?: string
  title?: string
  tagline?: string
  desc?: string
  features?: string
  price?: string
  href?: string
}

type Props = {
  eyebrow?: string
  headline?: string
  intro?: string
  items?: ServiceCard[]
}

const ArrowSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
)

export default function ServiceGridSection({
  eyebrow = 'What We Do',
  headline = 'Everything You Need to Succeed Online',
  intro = 'Four focused disciplines, one expert team. Whatever stage your business is at, we have a service built to move it forward.',
  items = [],
}: Props) {
  return (
    <section className="section svcgrid-section">
      <div className="container">
        <div className="svcgrid-header">
          {eyebrow && <p className="eyebrow justify-center">{eyebrow}</p>}
          <h2 className="svcgrid-headline">{headline}</h2>
          {intro && <p className="svcgrid-intro">{intro}</p>}
        </div>

        <div className="svcgrid">
          {items.map((s, i) => {
            const feats = (s.features || '').split(',').map(f => f.trim()).filter(Boolean)
            return (
              <div key={i} className="svcgrid-card group">
                <div className="svcgrid-card-glow" aria-hidden="true" />
                <div className="svcgrid-card-top">
                  <div className="svcgrid-icon" dangerouslySetInnerHTML={{ __html: s.icon || '' }} />
                  {s.price && <span className="svcgrid-price">{s.price}</span>}
                </div>
                <h3 className="svcgrid-title">{s.title}</h3>
                {s.tagline && <p className="svcgrid-tagline">{s.tagline}</p>}
                {s.desc && <p className="svcgrid-desc">{s.desc}</p>}
                {feats.length > 0 && (
                  <ul className="svcgrid-feats">
                    {feats.map((f, j) => (
                      <li key={j}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {s.href && (
                  <Link href={s.href} className="svcgrid-link">
                    Explore service <ArrowSVG />
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
