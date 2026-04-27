type Step = { n: string; title: string; sub: string; desc: string }
type Props = { eyebrow?: string; headline?: string; intro?: string; steps?: Step[] }

export default function HowItWorksSection({
  eyebrow = 'Our Process',
  headline = 'How It Works',
  intro = 'From setup to scale — a proven 5-step process that takes you from idea to a live, high-performing site.',
  steps = [],
}: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safe = Array.isArray(steps) ? steps : []

  return (
    <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em' }}>{headline}</h2>
          {intro && <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '520px', margin: '16px auto 0' }}>{intro}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '920px', margin: '0 auto' }}>
          {safe.map((s, i) => (
            <div key={`${s.n}-${i}`} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '26px 28px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(118,108,255,0.10)', border: '1px solid rgba(118,108,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ ...M, fontSize: '11px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.12em' }}>{s.n}</span>
              </div>
              <div>
                <p style={{ ...F, fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{s.title}</p>
                <p style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '10px' }}>{s.sub}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.85 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

