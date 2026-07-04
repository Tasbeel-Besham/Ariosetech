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
    <span ref={ref} className={`scramble-inline${className ? ` ${className}` : ''}`} style={style}>
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
    <div ref={wrapperRef} className="approach-wrapper relative" style={{ height:`${safeItems.length * 100 + 60}vh` }}>
      <div className="approach-sticky approach-sticky-shell">

        {/* Header */}
        <div className="approach-header shrink-0 text-center pb-[28px] pt-[52px]">
          {eyebrow && <p className="eyebrow justify-center">{eyebrow}</p>}
          <h2 className="font-display font-extrabold mb-20 leading-none tracking-tighter section-headline-sm">
            {headline} {scrambleWord && <ScrambleText text={scrambleWord} className="text-gradient" />}
          </h2>
          {/* Progress dots */}
          <div className="flex justify-center gap-8">
            {safeItems.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-[400ms] approach-dot${i === activeIdx ? ' active' : ''}`} />
            ))}
          </div>
        </div>

        {/* Sliding strip */}
        <div className="approach-strip-container flex-1 overflow-hidden flex items-center relative">
          {/* Edge fades */}
          <div className="approach-fade approach-fade-l absolute top-0 bottom-0 left-0 w-[80px] z-[2] pointer-events-none" />
          <div className="approach-fade approach-fade-r absolute top-0 bottom-0 right-0 w-[80px] z-[2] pointer-events-none" />

            <div
              ref={stripRef}
              className="approach-strip flex gap-20"
              style={{ transform:`translateX(var(--approach-tx, ${tx}px))` }}
            >
              {safeItems.map((item, i) => {
                const isActive = i === activeIdx
                return (
                  <div
                    key={item.n || i}
                    className={`approach-card shrink-0 relative overflow-hidden rounded-3xl transition-all duration-[400ms] ${isActive ? 'active' : ''}`}
                  >
                    {/* Gradient top bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-grad transition-opacity duration-[400ms] approach-topline" />
  
                    {/* Ghost number */}
                    <p className="approach-ghost-num font-display font-black absolute top-[10px] right-[16px] leading-none select-none tracking-tighter pointer-events-none">
                      {item.n}
                    </p>
  
                    {/* Step number pill */}
                    <div className="approach-pill inline-flex items-center gap-6 px-[12px] py-[4px] rounded-full border border-subtle-primary bg-soft-primary">
                      <span className="font-mono font-bold text-primary tracking-widest text-xs">{item.n}</span>
                    </div>
  
                    {/* Title */}
                    <h3 className="font-display font-black text-white leading-tight mb-16 uppercase tracking-tight break-words approach-card-title">
                      {item.title}
                    </h3>
  
                    <p className="font-mono font-bold text-primary mb-12 uppercase tracking-widest text-xs">
                      {item.sub}
                    </p>
                    <p className="text-gray-2 leading-loose text-sm max-w-[340px]">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
  
          {/* Scroll hint */}
          <div className={`approach-hint shrink-0 text-center pb-[20px] pt-[16px] pointer-events-none transition-opacity duration-500${showHint ? ' visible-hint' : ' hidden-hint'}`}>
            <div className="inline-flex items-center gap-8">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
              <span className="font-mono text-gray-3 uppercase tracking-widest text-10">Scroll to explore</span>
            </div>
          </div>
  
          {/* Border bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 border-t border-subtle" />
        </div>
        <style>{`
          @media (max-width: 768px) {
            .approach-wrapper { height: auto !important; }
            .approach-sticky { position: static !important; height: auto !important; }
            .approach-strip-container { display: block !important; padding: 40px 0 !important; }
            .approach-strip { 
              --approach-flex-dir: column !important; 
              --approach-tx: 0 !important; 
              --approach-pad-l: 20px !important; 
              --approach-pad-r: 20px !important;
              padding-bottom: 40px !important;
            }
            .approach-card { 
              width: 100% !important; 
              opacity: 1 !important; 
              transform: scale(1) !important; 
              margin-bottom: 12px !important;
            }
            .approach-hint, .approach-fade { display: none !important; }
          }
        `}</style>
      </div>
    )
}
