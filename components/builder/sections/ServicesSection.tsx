import Link from 'next/link'

type Item = { icon: string; title: string; headline: string; desc: string; features: string; price: string; href: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }

const SERVICE_ICONS: Record<string, string> = {
  wordpress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
  woocommerce: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  shopify: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  seo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
  speed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  security: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  maintenance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
  design: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>`,
  migration: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
  payment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
}

function getIcon(icon: string, title: string): string {
  const t = (title || '').toLowerCase()
  if (t.includes('wordpress') && !t.includes('woo')) return SERVICE_ICONS.wordpress
  if (t.includes('woocommerce') || t.includes('woo')) return SERVICE_ICONS.woocommerce
  if (t.includes('shopify')) return SERVICE_ICONS.shopify
  if (t.includes('seo')) return SERVICE_ICONS.seo
  if (t.includes('speed') || t.includes('performance') || t.includes('optim')) return SERVICE_ICONS.speed
  if (t.includes('security') || t.includes('secure') || t.includes('virus')) return SERVICE_ICONS.security
  if (t.includes('maintenance') || t.includes('support')) return SERVICE_ICONS.maintenance
  if (t.includes('design') || t.includes('redesign')) return SERVICE_ICONS.design
  if (t.includes('migrat')) return SERVICE_ICONS.migration
  if (t.includes('payment') || t.includes('gateway')) return SERVICE_ICONS.payment
  return icon && !icon.match(/[\u{1F300}-\u{1FAD6}]/u) ? icon : SERVICE_ICONS.default
}

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
            const svgIcon = getIcon(svc.icon, svc.title)
            return (
              <div key={i} className="card card-hover sr" style={{ display:'flex', flexDirection:'column', animationDelay:`${i*0.07}s` }}>
                                <div style={{ padding:'36px', flex:1, display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'16px', marginBottom:'20px' }}>
                    <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--primary)', padding:'12px' }}
                      dangerouslySetInnerHTML={{ __html: svgIcon }} />
                    <div>
                      <h3 style={{ ...F, fontSize:'20px', fontWeight:800, color:'#fff', marginBottom:'4px' }}>{svc.title}</h3>
                      <p style={{ ...F, fontSize:'13px', fontWeight:600, color:'var(--primary)' }}>{svc.headline}</p>
                    </div>
                  </div>
                  <p style={{ fontSize:'14px', color:'var(--text-3)', lineHeight:1.8, marginBottom:'22px', flex:1 }}>{svc.desc}</p>
                  <ul style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 16px', marginBottom:'28px' }}>
                    {featureList.map(f => (
                      <li key={f} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'var(--text-2)' }}>
                        <div style={{ width:'16px', height:'16px', borderRadius:'50%', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--primary)', padding:'3px' }}>
                          <svg viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
