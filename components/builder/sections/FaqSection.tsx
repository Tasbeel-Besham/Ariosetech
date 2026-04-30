'use client'
import { useState } from 'react'
import Link from 'next/link'

type Item = { q: string; a: string }
type Props = { eyebrow?: string; headline?: string; subheadline?: string; ctaLabel?: string; ctaHref?: string; items?: Item[] }

export default function FaqSection({ eyebrow='FAQ', subheadline="Can't find what you're looking for? We're here to help.", ctaLabel='Ask Us Anything', ctaHref='/contact', items=[] }: Props) {
  const [open, setOpen] = useState<number|null>(null)
  const F = { fontFamily:'var(--font-display)' } as const
  const safe = Array.isArray(items) ? items : []
  return (
    <section className="section" style={{ overflow:'visible' }}>
      <div className="container">
        <div className="g-2" style={{ gap:'80px', alignItems:'start' }}>
          <div style={{ position:'relative', top:0 }} className="lg:sticky lg:top-[88px]">
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.04em', marginBottom:'20px' }}>
              Frequently Asked{' '}
              <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Questions</span>
            </h2>
            <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.8, marginBottom:'32px' }}>{subheadline}</p>
            <Link href={ctaHref} className="btn btn-primary btn-lg">
              {ctaLabel}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {safe.map(({q,a},i) => (
              <div key={i} style={{ background:'var(--bg-2)', border:`1px solid ${open===i?'rgba(118,108,255,0.35)':'var(--border)'}`, borderRadius:'14px', overflow:'hidden', transition:'border-color 0.2s' }}>
                <button onClick={()=>setOpen(open===i?null:i)} style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 22px', background:'none', border:'none', cursor:'pointer', gap:'16px', textAlign:'left' }}>
                  <span style={{ ...F, fontSize:'15px', fontWeight:600, color:open===i?'var(--primary)':'#fff', flex:1, lineHeight:1.4 }}>{q}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform:open===i?'rotate(180deg)':'', transition:'transform 0.25s', flexShrink:0 }}>
                    <path d="M4 6l4 4 4-4" stroke={open===i?'var(--primary)':'var(--text-3)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {open===i && <div style={{ padding:'0 22px 20px' }}><p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.85 }}>{a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
