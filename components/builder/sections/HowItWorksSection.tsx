type Step = { n: string; title: string; sub: string; desc: string }
type Props = { eyebrow?: string; headline?: string; subheadline?: string; intro?: string; items?: Step[]; steps?: Step[] }

export default function HowItWorksSection({ eyebrow='Our Process', headline='How It Works', subheadline, intro, items=[], steps=[] }: Props) {
  const F = { fontFamily:'var(--font-display)' } as const
  const M = { fontFamily:'var(--font-mono)' } as const
  const safe = items.length ? items : steps
  const sub = subheadline || intro || ''
  return (
    <section className="section" style={{ position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', left:'50%', top:'160px', bottom:'80px', width:'1px', background:'linear-gradient(to bottom, transparent, rgba(118,108,255,0.20) 20%, rgba(118,108,255,0.20) 80%, transparent)', pointerEvents:'none' }} className="hidden-mobile" />
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'72px' }}>
          <p className="eyebrow sr" style={{ justifyContent:'center' }}>{eyebrow}</p>
          <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>{headline}</h2>
          {sub && <p className="sr" style={{ fontSize:'16px', color:'var(--text-2)', lineHeight:1.8, maxWidth:'480px', margin:'16px auto 0' }}>{sub}</p>}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'32px', maxWidth:'900px', margin:'0 auto' }}>
          {safe.map((step,i) => {
            const isRight = i % 2 !== 0
            const card = (dir: 'left'|'right') => (
              <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'20px', padding:'32px 36px', transition:'all 0.3s var(--ease)' }}
                onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='rgba(118,108,255,0.35)';el.style.transform=`translateX(${dir==='left'?'-':''}6px)`}}
                onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='var(--border)';el.style.transform=''}}>
                <p style={{ ...F, fontSize:'clamp(3rem,4vw,3.8rem)', fontWeight:800, color:'rgba(118,108,255,0.15)', lineHeight:1, marginBottom:'16px', userSelect:'none' }}>{step.n}</p>
                <p style={{ ...F, fontSize:'17px', fontWeight:800, color:'#fff', marginBottom:'6px' }}>{step.title}</p>
                <p style={{ fontSize:'12px', color:'var(--primary)', fontWeight:600, marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.08em' }}>{step.sub}</p>
                <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.8 }}>{step.desc}</p>
              </div>
            )
            return (
              <div key={i} className="sr" style={{ animationDelay:`${i*0.1}s`, display:'grid', gridTemplateColumns:'1fr 80px 1fr', alignItems:'center' }}>
                {isRight ? <div /> : card('left')}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--primary-soft)', border:'2px solid rgba(118,108,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ ...M, fontSize:'12px', fontWeight:800, color:'var(--primary)' }}>{step.n}</span>
                  </div>
                </div>
                {!isRight ? <div /> : card('right')}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
