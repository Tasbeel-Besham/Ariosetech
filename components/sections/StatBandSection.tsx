'use client'

type Stat = {
  value?: string
  label?: string
  sub?: string
}

type Props = {
  eyebrow?: string
  headline?: string
  items?: Stat[]
}

export default function StatBandSection({
  eyebrow = '',
  headline = '',
  items = [],
}: Props) {
  return (
    <section className="statband-section">
      <div className="statband-glow" aria-hidden="true" />
      <div className="container relative z-1">
        {(eyebrow || headline) && (
          <div className="statband-header">
            {eyebrow && <p className="eyebrow justify-center">{eyebrow}</p>}
            {headline && <h2 className="statband-headline">{headline}</h2>}
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
