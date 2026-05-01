type Step = { n: string; title: string; sub: string; desc: string; time: string }
type Props = { eyebrow?: string; headline?: string; items?: Step[]; steps?: Step[] }

export default function ProcessSection({ eyebrow='How We Work', headline='Your Success Journey in 5 Simple Steps', items=[], steps=[] }: Props) {
  const F = { fontFamily:'var(--font-display)' } as const
  const safe = items.length ? items : steps
  return (
    <section className="section section--dark">
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:'60px' }}>
          <p className="eyebrow sr" style={{ justifyContent:'center' }}>{eyebrow}</p>
          <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>{headline}</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)' }}>
          {safe.map(({n,title,sub,desc,time},i) => (
            <div key={i} className="sr" style={{ paddingRight:i<safe.length-1?'28px':'0', borderRight:i<safe.length-1?'1px solid var(--border)':'none', animationDelay:`${i*0.07}s` }}>
              <p style={{ ...F, fontSize:'clamp(3.5rem,5vw,5rem)', fontWeight:800, color:'rgba(118,108,255,0.15)', lineHeight:1, marginBottom:'16px', userSelect:'none' }}>{n}</p>
              <p style={{ ...F, fontSize:'15px', fontWeight:700, color:'#fff', marginBottom:'5px' }}>{title}</p>
              <p style={{ fontSize:'12px', color:'var(--primary)', fontWeight:600, marginBottom:'10px' }}>{sub}</p>
              <p style={{ fontSize:'12px', color:'var(--text-3)', lineHeight:1.8, marginBottom:'14px' }}>{desc}</p>
              <span className="tag">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
