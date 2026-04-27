import Link from 'next/link'

type Item = { icon: string; title: string; headline: string; desc: string; features: string; price: string; href: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }

export default function ServicesSection({ eyebrow='What We Offer', headline='Comprehensive Web Development Solutions', items=[] }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safeItems: Item[] = Array.isArray(items) ? items : []
  return (
    <section className="section section--dark">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>{headline}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(safeItems.length || 3, 3)}, 1fr)`, gap: '20px' }}>
          {safeItems.map((svc, i) => {
            const featureList = (svc.features || '').split(',').map(f => f.trim()).filter(Boolean)
            return (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '3px', background: 'var(--grad)' }} />
                <div style={{ padding: '26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '14px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(118,108,255,0.1)', borderRadius: '12px', color: 'var(--primary)' }} dangerouslySetInnerHTML={{ __html: svc.icon }} />
                  <h3 style={{ ...F, fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{svc.title}</h3>
                  <p style={{ ...F, fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '10px' }}>{svc.headline}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.75, flex: 1, marginBottom: '18px' }}>{svc.desc}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                    {featureList.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--text-2)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ ...M, fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Starting at</p>
                      <p style={{ ...F, fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{svc.price}</p>
                    </div>
                    <Link href={svc.href || '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-display)', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.3)', color: 'var(--primary)', textDecoration: 'none' }}>
                      Learn More 
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
