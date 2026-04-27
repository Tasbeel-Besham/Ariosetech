type Metric = { value: string; label: string; desc: string }
type Props = {
  eyebrow?: string
  headline?: string
  intro?: string
  metrics?: Metric[]
}

export default function ImpactSection({
  eyebrow = 'Results That Matter',
  headline = 'The Impact, Quantified',
  intro = "Numbers don't lie. Here's what working with ARIOSETECH actually delivers for your business.",
  metrics = [],
}: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safe = Array.isArray(metrics) ? metrics : []

  return (
    <section className="section section--dark" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '70%', height: '80%', background: 'radial-gradient(ellipse, rgba(118,108,255,0.09) 0%, transparent 65%)', pointerEvents: 'none', filter: 'blur(30px)' }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em' }}>
            {headline.split('Quantified').length > 1 ? (
              <>
                {headline.replace('Quantified', '')}
                <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Quantified</span>
              </>
            ) : headline}
          </h2>
          {intro && <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '560px', margin: '16px auto 0' }}>{intro}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
          {safe.map(m => (
            <div key={m.label} style={{ background: 'rgba(10,10,18,0.7)', border: '1px solid rgba(118,108,255,0.18)', borderRadius: '24px', padding: '44px 36px', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden', transition: 'all 0.3s var(--ease)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)' }} />
              <div style={{ position: 'absolute', top: '-30%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, rgba(118,108,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <p style={{ ...F, fontSize: 'clamp(3rem,5vw,4.5rem)', fontWeight: 800, lineHeight: 1, marginBottom: '12px', background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {m.value}
              </p>
              <p style={{ ...F, fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>{m.label}</p>
              <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.8 }}>{m.desc}</p>
              <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '18px' }}>Real client outcomes</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

