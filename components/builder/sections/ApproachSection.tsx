'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'

function ScrambleText({ text, delay = 0, className, style }: { text: string; delay?: number; className?: string; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState(text)
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = useCallback(() => {
    let iteration = 0
    const totalFrames = text.length * 4
    clearInterval(frameRef.current!)
    frameRef.current = setInterval(() => {
      setDisplay(
        text.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < Math.floor(iteration / 4)) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      iteration++
      if (iteration >= totalFrames) {
        clearInterval(frameRef.current!)
        setDisplay(text)
      }
    }, 40)
  }, [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !revealed) { setRevealed(true); setTimeout(scramble, delay) } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearInterval(frameRef.current!) }
  }, [scramble, delay, revealed])

  return (
    <span ref={ref} className={className} style={{ fontFamily:'inherit', ...style, display:'inline' }}>
      {display}
    </span>
  )
}

type ApproachItem = { n: string; title: string; sub: string; desc: string }

type Props = { eyebrow?: string; headline?: string; scrambleWord?: string; items?: ApproachItem[] }

export default function ApproachSection({ 
  eyebrow = "Why We're Different", 
  headline = "Our ", 
  scrambleWord = "Approach",
  items = []
}: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safeItems = Array.isArray(items) ? items : []

  const wrapperRef = useRef<HTMLDivElement>(null)
  const stripRef   = useRef<HTMLDivElement>(null)
  const [tx, setTx]             = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)
  const [showHint, setShowHint]   = useState(true)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const strip   = stripRef.current
    if (!wrapper || !strip || safeItems.length === 0) return

    const onScroll = () => {
      const rect      = wrapper.getBoundingClientRect()
      const maxScroll = wrapper.offsetHeight - window.innerHeight
      const scrolled  = Math.max(0, -rect.top)
      const progress  = Math.min(1, scrolled / maxScroll)

      const maxTx = strip.scrollWidth - window.innerWidth
      setTx(-(progress * maxTx))
      setActiveIdx(Math.min(safeItems.length - 1, Math.floor(progress * safeItems.length)))
      setShowHint(progress < 0.05)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [safeItems.length])

  if (safeItems.length === 0) return null

  return (
    <div ref={wrapperRef} className="approach-wrapper" style={{ height:`${safeItems.length * 100 + 60}vh`, position:'relative' }}>
      <div className="approach-sticky" style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', background:'var(--bg)' }}>

        {/* Header */}
        <div className="approach-header" style={{ textAlign:'center', padding:'52px 0 28px', flexShrink:0 }}>
          {eyebrow && <p className="eyebrow" style={{ justifyContent:'center' }}>{eyebrow}</p>}
          <h2 style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', marginBottom:'20px' }}>
            {headline} {scrambleWord && <ScrambleText text={scrambleWord} style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }} />}
          </h2>
          {/* Progress dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:'8px' }}>
            {safeItems.map((_, i) => (
              <div key={i} style={{ width: i === activeIdx ? '24px' : '6px', height:'6px', borderRadius:'9999px', background: i === activeIdx ? 'var(--primary)' : 'rgba(118,108,255,0.25)', transition:'all 0.4s var(--ease)' }} />
            ))}
          </div>
        </div>

        {/* Sliding strip */}
        <div className="approach-strip-container" style={{ flex:1, overflow:'hidden', display:'flex', alignItems:'center', position:'relative' }}>
          {/* Edge fades */}
          <div className="approach-fade" style={{ position:'absolute', left:0, top:0, bottom:0, width:'80px', background:'linear-gradient(to right, var(--bg), transparent)', zIndex:2, pointerEvents:'none' }} />
          <div className="approach-fade" style={{ position:'absolute', right:0, top:0, bottom:0, width:'80px', background:'linear-gradient(to left, var(--bg), transparent)', zIndex:2, pointerEvents:'none' }} />

          <div
            ref={stripRef}
            className="approach-strip"
            style={{
              display:'flex',
              gap:'20px',
              paddingLeft:'8vw',
              paddingRight:'8vw',
              transform:`translateX(${tx}px)`,
              willChange:'transform',
              transition:'transform 0.06s linear',
            }}
          >
            {safeItems.map((item, i) => {
              const isActive = i === activeIdx
              return (
                <div
                  key={item.n || i}
                  className={`approach-card ${isActive ? 'active' : ''}`}
                  style={{
                    width:'min(460px, 82vw)',
                    flexShrink:0,
                    background: isActive
                      ? 'linear-gradient(145deg, rgba(118,108,255,0.13) 0%, rgba(10,10,18,0.95) 80%)'
                      : 'var(--bg-2)',
                    border:`1px solid ${isActive ? 'rgba(118,108,255,0.45)' : 'var(--border)'}`,
                    borderRadius:'24px',
                    padding:'44px 40px',
                    position:'relative',
                    overflow:'hidden',
                    transform: isActive ? 'scale(1.02)' : 'scale(0.95)',
                    opacity: isActive ? 1 : 0.45,
                    transition:'all 0.45s var(--ease)',
                    boxShadow: isActive ? '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(118,108,255,0.1)' : 'none',
                  }}
                >
                  {/* Gradient top bar */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'var(--grad)', opacity: isActive ? 1 : 0, transition:'opacity 0.4s' }} />

                  {/* Ghost number */}
                  <p className="approach-ghost-num" style={{ ...F, fontSize:'clamp(8rem,13vw,14rem)', fontWeight:900, color:'rgba(255,255,255,0.04)', position:'absolute', top:'10px', right:'16px', lineHeight:1, userSelect:'none', letterSpacing:'-0.06em', pointerEvents:'none' }}>
                    {item.n}
                  </p>

                  {/* Step number pill */}
                  <div className="approach-pill" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', borderRadius:'9999px', background:'rgba(118,108,255,0.12)', border:'1px solid rgba(118,108,255,0.25)', marginBottom:'clamp(32px,5vw,64px)' }}>
                    <span style={{ ...M, fontSize:'11px', fontWeight:700, color:'var(--primary)', letterSpacing:'0.14em' }}>{item.n}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{ ...F, fontSize:'clamp(1.8rem, 2.8vw, 2.2rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.02em', lineHeight:1.1, marginBottom:'18px', textTransform:'uppercase', overflowWrap:'anywhere', wordBreak:'break-word' }}>
                    {item.title}
                  </h3>

                  <p style={{ ...M, fontSize:'11px', fontWeight:700, color:'var(--primary)', marginBottom:'14px', textTransform:'uppercase', letterSpacing:'0.12em' }}>
                    {item.sub}
                  </p>
                  <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.85, maxWidth:'340px' }}>
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="approach-hint" style={{ textAlign:'center', padding:'16px 0 20px', flexShrink:0, opacity: showHint ? 1 : 0, transition:'opacity 0.5s', pointerEvents:'none' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            <span style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.14em' }}>Scroll to explore</span>
          </div>
        </div>

        {/* Border bottom */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'var(--border)' }} />
      </div>
    </div>
  )
}
