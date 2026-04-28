import ClutchWidget from '@/components/ui/ClutchWidget'

type Item = { name: string; role: string; initials: string; quote: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }

const StarSVG = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--primary)"><path d="M7 1l1.5 4.5H13L9.5 8l1.3 4L7 10l-3.8 2 1.3-4L1 5.5h4.5z"/></svg>

export default function TestimonialsSection({ eyebrow='Client Reviews', headline='What Our Clients Say About Working With Us', items=[] }: Props) {
  const F = { fontFamily:'var(--font-display)' } as const
  const M = { fontFamily:'var(--font-mono)' } as const
  const safe = Array.isArray(items) ? items : []
  return (
    <section className="section">
      <div className="container">
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'56px', flexWrap:'wrap', gap:'20px' }}>
          <div>
            <p className="eyebrow sr">{eyebrow}</p>
            <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>{headline}</h2>
          </div>
          <div className="sr"><ClutchWidget widgetType={7} height={65} /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'40px' }}>
          {safe.map((t,i) => (
            <div key={i} className="card sr" style={{ padding:'32px', animationDelay:`${i*0.08}s` }}>
              <div style={{ display:'flex', gap:'3px', marginBottom:'20px' }}>
                {[0,1,2,3,4].map(s => <StarSVG key={s} />)}
              </div>
              <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.85, fontStyle:'italic', marginBottom:'28px', flex:1 }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display:'flex', alignItems:'center', gap:'14px', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'14px', fontWeight:800, color:'#fff', flexShrink:0 }}>{t.initials}</div>
                <div>
                  <p style={{ ...F, fontSize:'14px', fontWeight:700, color:'#fff' }}>{t.name}</p>
                  <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderRadius:'16px', overflow:'hidden', border:'1px solid var(--border)' }}>
          <ClutchWidget widgetType={12} height={375} reviews="449566,412231,406618,406326,405095,379000,373080,373075,372945,372930,372228,372128" />
        </div>
      </div>
    </section>
  )
}
