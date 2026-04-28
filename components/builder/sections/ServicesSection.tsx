import Link from 'next/link'

type Item = { icon: string; title: string; headline: string; desc: string; features: string; price: string; href: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }

export default function ServicesSection({ eyebrow='What We Offer', headline='Comprehensive Web Development Solutions for Your Business Growth', items=[] }: Props) {
  const F = { fontFamily:'var(--font-display)' } as const
  const M = { fontFamily:'var(--font-mono)' } as const
  const safe = Array.isArray(items) ? items : []
  return (
    <section className="section section--dark">
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'end', marginBottom:'60px' }}>
          <div>
            <p className="eyebrow sr">{eyebrow}</p>
            <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>{headline}</h2>
          </div>
          <p className="sr" style={{ fontSize:'16px', color:'var(--text-2)', lineHeight:1.8 }}>Three core platforms. One expert team. We don&apos;t dabble — we specialise so you get the best results every time.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'20px' }}>
          {safe.map((svc,i) => {
            const featureList = (svc.features||'').split(',').map(f=>f.trim()).filter(Boolean)
            return (
              <div key={i} className="card card-hover sr" style={{ display:'flex', flexDirection:'column', animationDelay:`${i*0.07}s` }}>
                <div style={{ height:'3px', background:'var(--grad)' }} />
                <div style={{ padding:'36px', flex:1, display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'16px', marginBottom:'20px' }}>
                    <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', flexShrink:0 }}>{svc.icon}</div>
                    <div>
                      <h3 style={{ ...F, fontSize:'20px', fontWeight:800, color:'#fff', marginBottom:'4px' }}>{svc.title}</h3>
                      <p style={{ ...F, fontSize:'13px', fontWeight:600, color:'var(--primary)' }}>{svc.headline}</p>
                    </div>
                  </div>
                  <p style={{ fontSize:'14px', color:'var(--text-3)', lineHeight:1.8, marginBottom:'22px', flex:1 }}>{svc.desc}</p>
                  <ul style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 16px', marginBottom:'28px' }}>
                    {featureList.map(f => (
                      <li key={f} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'var(--text-2)' }}>
                        <div style={{ width:'16px', height:'16px', borderRadius:'50%', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--primary)' }}>
                          <svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'22px', borderTop:'1px solid var(--border)' }}>
                    <div>
                      <p style={{ ...M, fontSize:'9px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:700, marginBottom:'2px' }}>Starting at</p>
                      <p style={{ ...F, fontSize:'1.5rem', fontWeight:800, color:'var(--primary)' }}>{svc.price}</p>
                    </div>
                    <Link href={svc.href||'#'} className="btn btn-primary btn-md">Learn More
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
