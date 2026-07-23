'use client'
import SectionHeading from '@/components/ui/SectionHeading'

type Stat = {
  value?: string
  label?: string
  sub?: string
}

type Props = {
  headingTag?: string
  eyebrow?: string
  headline?: string
  items?: Stat[]
}

export default function StatBandSection({
  eyebrow = '',
  headline = '',
  headingTag = 'h2',
  items = [],
}: Props) {
  return (
    <section className="statband-section">
      <div className="statband-glow" aria-hidden="true" />
      <div className="container relative z-1">
        {(eyebrow || headline) && (
          <div className="statband-header">
            {eyebrow && <p className="eyebrow justify-center">{eyebrow}</p>}
            {headline && <SectionHeading as={headingTag} className="statband-headline">{headline}</SectionHeading>}
          </div>
        )}
        <div className="statband-grid">
          {items.map((s, i) => (
            <div key={i} className="statband-item">
              <p className="statband-value">{s.value}</p>
              <p className="statband-label">{s.label}</p>
              {s.sub && <p className="statband-sub">{s.sub}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
