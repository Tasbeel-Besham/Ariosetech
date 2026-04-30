'use client'
import { useState, useEffect, useRef } from 'react'

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const
const P  = { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as const

type ProcessItem = {
  n: string
  title: string
  sub: string
  desc: string
  time: string
}

export default function ApproachSection({ processItems, title = 'Development Process' }: { processItems: ProcessItem[], title?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stripRef   = useRef<HTMLDivElement>(null)
  const [tx, setTx]               = useState(0)
  const [scrollIdx, setScrollIdx] = useState(0)
  const [hoverIdx, setHoverIdx]   = useState<number | null>(null)
  const [showHint, setShowHint]   = useState(true)

  const activeIdx = hoverIdx !== null ? hoverIdx : scrollIdx

  useEffect(() => {
    const wrapper = wrapperRef.current
    const strip   = stripRef.current
    if (!wrapper || !strip || processItems.length === 0) return

    const onScroll = () => {
      const rect      = wrapper.getBoundingClientRect()
      const maxScroll = wrapper.offsetHeight - window.innerHeight
      const scrolled  = Math.max(0, -rect.top)
      const progress  = Math.min(1, Math.max(0, scrolled / maxScroll))

      const maxTx = strip.scrollWidth - window.innerWidth
      setTx(-(progress * maxTx))
      setScrollIdx(Math.min(processItems.length - 1, Math.floor(progress * processItems.length)))
      setShowHint(progress < 0.05)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [processItems.length])

  if (!processItems || processItems.length === 0) return null

  return (
    <div ref={wrapperRef} className="approach-wrapper" style={{ height:`${processItems.length * 100 + 60}vh`, position:'relative' }}>
      <div className="approach-sticky" style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
        <div className="approach-header" style={{ textAlign:'center', padding:'52px 0 28px', flexShrink:0 }}>
          <p className="eyebrow sr" style={{ justifyContent:'center' }}>How We Work</p>
          <h2 className="sr" style={{ ...hs, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', marginBottom:'20px' }}>
            {title.split(' ').slice(0, -1).join(' ')} <span style={P}>{title.split(' ').slice(-1)}</span>
          </h2>
          <div className="approach-dots" style={{ display:'flex', justifyContent:'center', gap:'8px' }}>
            {processItems.map((_, i) => (
              <div key={i} style={{ width: i === activeIdx ? '24px' : '6px', height:'6px', borderRadius:'9999px', background: i === activeIdx ? 'var(--primary)' : 'rgba(118,108,255,0.25)', transition:'all 0.4s var(--ease)' }} />
            ))}
          </div>
        </div>

        <div className="approach-strip-container" style={{ flex:1, overflow:'hidden', display:'flex', alignItems:'center', position:'relative' }}>
          <div className="approach-fade" style={{ position:'absolute', left:0, top:0, bottom:0, width:'80px', background:'linear-gradient(to right, var(--bg), transparent)', zIndex:2, pointerEvents:'none' }} />
          <div className="approach-fade" style={{ position:'absolute', right:0, top:0, bottom:0, width:'80px', background:'linear-gradient(to left, var(--bg), transparent)', zIndex:2, pointerEvents:'none' }} />

          <div ref={stripRef} className="approach-strip" style={{ display:'flex', gap:'20px', paddingLeft:'8vw', paddingRight:'8vw', transform:`translateX(${tx}px)`, willChange:'transform', transition:'transform 0.06s linear' }}>
            {processItems.map((item, i) => {
              const isActive = i === activeIdx
              return (
                <div 
                  key={item.n} 
                  className={`approach-card ${isActive ? 'active' : ''}`} 
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                  style={{ width:'min(460px, 82vw)', flexShrink:0, background: isActive ? 'linear-gradient(145deg, rgba(118,108,255,0.13) 0%, rgba(10,10,18,0.95) 80%)' : 'var(--bg-2)', border:`1px solid ${isActive ? 'rgba(118,108,255,0.45)' : 'var(--border)'}`, borderRadius:'24px', padding:'44px 40px', position:'relative', overflow:'hidden', transform: isActive ? 'scale(1.02)' : 'scale(0.95)', opacity: isActive ? 1 : 0.45, transition:'all 0.45s var(--ease)', boxShadow: isActive ? '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(118,108,255,0.1)' : 'none' }}
                >
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'var(--grad)', opacity: isActive ? 1 : 0, transition:'opacity 0.4s' }} />
                  <p className="approach-ghost-num" style={{ ...hs, fontSize:'clamp(8rem,13vw,14rem)', fontWeight:900, color:'rgba(255,255,255,0.04)', position:'absolute', top:'10px', right:'16px', lineHeight:1, userSelect:'none', letterSpacing:'-0.06em', pointerEvents:'none' }}>{item.n}</p>
                  <div className="approach-pill" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', borderRadius:'9999px', background:'rgba(118,108,255,0.12)', border:'1px solid rgba(118,108,255,0.25)', marginBottom:'clamp(32px,5vw,64px)' }}>
                    <span style={{ ...hm, fontSize:'11px', fontWeight:700, color:'var(--primary)', letterSpacing:'0.14em' }}>{item.n}</span>
                  </div>
                  <h3 style={{ ...hs, fontSize:'clamp(1.8rem, 2.8vw, 2.2rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.02em', lineHeight:1.1, marginBottom:'18px', textTransform:'uppercase', overflowWrap:'anywhere', wordBreak:'break-word' }}>{item.title}</h3>
                  <p style={{ ...hm, fontSize:'11px', fontWeight:700, color:'var(--primary)', marginBottom:'14px', textTransform:'uppercase', letterSpacing:'0.12em' }}>{item.sub}</p>
                  <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.85, maxWidth:'340px' }}>{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="approach-hint" style={{ textAlign:'center', padding:'16px 0 20px', flexShrink:0, opacity: showHint ? 1 : 0, transition:'opacity 0.5s', pointerEvents:'none' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            <span style={{ ...hm, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.14em' }}>Scroll to explore</span>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'var(--border)' }} />
      </div>
    </div>
  )
}
