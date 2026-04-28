import Link from 'next/link'

type Item = { icon: string; title: string; subhead: string; desc: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }

export default function WhyUsSection({ eyebrow='Why Choose Us', headline='Why 100+ Businesses Trust ARIOSETECH for Their Success', items=[] }: Props) {
  const F = { fontFamily:'var(--font-display)' } as const
  const safe = Array.isArray(items) ? items : []
  return (
    <section className="section" style={{ overflow:'visible' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'start' }}>
          <div style={{ position:'sticky', top:'88px' }}>
            <p className="eyebrow sr">{eyebrow}</p>
            <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.04em', marginBottom:'20px' }}>
              Why 100+ Businesses Trust{' '}
              <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ARIOSETECH</span>
              {' '}for Their Success
            </h2>
            <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.85, marginBottom:'32px' }}>We combine world-class expertise with transparent pricing and a genuine commitment to your success. Not just code — business growth.</p>
            <Link href="/contact" className="btn btn-primary btn-lg sr">Start a Project
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            {safe.map((b,i) => (
              <div key={i} className="sr" style={{ display:'flex', gap:'18px', padding:'24px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'16px', transition:'all 0.25s var(--ease)', animationDelay:`${i*0.08}s` }}
                onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='rgba(118,108,255,0.35)';el.style.transform='translateX(4px)'}}
                onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='var(--border)';el.style.transform=''}}>
                <div style={{ flexShrink:0, width:'48px', height:'48px', borderRadius:'12px', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)', fontSize:'22px' }}>{b.icon}</div>
                <div>
                  <p style={{ ...F, fontSize:'15px', fontWeight:700, color:'#fff', marginBottom:'3px' }}>{b.title}</p>
                  <p style={{ ...F, fontSize:'12px', fontWeight:600, color:'var(--primary)', marginBottom:'8px' }}>{b.subhead}</p>
                  <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:1.75 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
