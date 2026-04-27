type Step = { n: string; title: string; sub: string; desc: string; time: string }
type Props = { eyebrow?: string; headline?: string; steps?: Step[] }

export default function ProcessSection({
  eyebrow  = 'How We Work',
  headline = 'Your Success Journey in 5 Simple Steps',
  steps    = [],
}: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const safeSteps: Step[] = Array.isArray(steps) ? steps : []

  return (
    <section className="section section--dark">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>
            {headline}
          </h2>
          {/* Brand underline accent */}
          <div style={{ height: '3px', width: '48px', background: 'var(--grad)', borderRadius: '2px', margin: '16px auto 0' }} />
        </div>

        {/* Steps grid — responsive: 1 col mobile → 3 col tablet → 5 col desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px 24px' }}>
          {safeSteps.map(({ n, title, sub, desc, time }, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {/* Large step number — decorative */}
              <p style={{ ...F, fontSize: 'clamp(3rem,6vw,4.5rem)', fontWeight: 800, color: 'rgba(118,108,255,0.15)', lineHeight: 1, marginBottom: '12px', userSelect: 'none' }}>
                {n}
              </p>
              {/* Connector line — hidden on last */}
              {i < safeSteps.length - 1 && (
                <div style={{ position: 'absolute', top: 'clamp(1.5rem,3vw,2.25rem)', left: 'calc(clamp(3rem,6vw,4.5rem) * 0.6)', right: '-12px', height: '2px', background: 'linear-gradient(90deg, rgba(118,108,255,0.3), transparent)', pointerEvents: 'none' }} className="hidden-mobile" />
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ ...F, fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{title}</p>
                <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>{sub}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.75, marginBottom: '12px' }}>{desc}</p>
                <span className="tag">{time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
