type Item = { icon: string; title: string; subhead: string; desc: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }
export default function WhyUsSection({ eyebrow='Why Choose Us', headline='Why 100+ Businesses Trust ARIOSETECH', items=[] }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const safeItems: Item[] = Array.isArray(items) ? items : []
  return (
    <section className="section" style={{ overflow: 'visible' }}>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }} className="md:flex-row md:items-start lg:gap-24">
          <div style={{ flex: '1', position: 'sticky', top: '120px' }} className="md:w-1/3 shrink-0">
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>{headline}</h2>
          </div>
          <div style={{ flex: '2', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }} className="md:w-2/3">
            {safeItems.map((b, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '26px' }}>
                <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(118,108,255,0.1)', color: 'var(--primary)' }} dangerouslySetInnerHTML={{ __html: b.icon }} />
                <p style={{ ...F, fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{b.title}</p>
                <p style={{ ...F, fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '10px' }}>{b.subhead}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.75 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
