type Item = { icon: string; title: string; subhead: string; desc: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }
export default function WhyUsSection({ eyebrow='Why Choose Us', headline='Why 100+ Businesses Trust ARIOSETECH', items=[] }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const safeItems: Item[] = Array.isArray(items) ? items : []
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>{headline}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(safeItems.length || 4, 4)}, 1fr)`, gap: '16px' }}>
          {safeItems.map((b, i) => (
            <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '26px' }}>
              <div style={{ fontSize: '32px', marginBottom: '14px' }}>{b.icon}</div>
              <p style={{ ...F, fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{b.title}</p>
              <p style={{ ...F, fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '10px' }}>{b.subhead}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.75 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
