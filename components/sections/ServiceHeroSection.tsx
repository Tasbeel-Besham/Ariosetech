'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconBox, CheckSVG } from '@/components/ui/IconBox'

/* ── SVGs ── */
const SpeedSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
)
const StarSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
)
const LockSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)
const ArrowSVG = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const B_PRI = '#766cff'
const B_SEC = '#9b8fff'
const B_GLO = 'rgba(118,108,255,0.25)'

type Props = {
  eyebrow?: string
  headline?: string
  subheadline?: string
  desc?: string
  bullets?: string[]
  trust?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
}

export default function ServiceHeroSection({
  eyebrow = 'Professional Services',
  headline = 'Elevate Your Digital',
  subheadline = 'Presence Today',
  desc = 'We build high-performance solutions tailored to your business needs.',
  bullets = [],
  trust = '',
  ctaPrimaryLabel = 'Get Started',
  ctaPrimaryHref = '/contact',
  ctaSecondaryLabel = 'View Portfolio',
  ctaSecondaryHref = '/portfolio',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cdotRef = useRef<HTMLDivElement>(null)
  const cringRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)

  const F = { fontFamily: 'var(--font-manrope), var(--font-display), sans-serif' } as const
  const B = { fontFamily: 'var(--font-body), sans-serif' } as const
  const M = { fontFamily: 'var(--font-mono), monospace' } as const

  /* ── Interactivity ── */
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d'); if (!ctx) return
    let W = cv.width = window.innerWidth, H = cv.height = window.innerHeight
    let mx = W / 2, my = H / 2, rx = mx, ry = my

    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight }
    window.addEventListener('resize', resize)
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMove)

    const TCOUNT = 14, trails: { x: number; y: number }[] = Array(TCOUNT).fill(0).map(() => ({ x: mx, y: my }))
    const trailEls: HTMLDivElement[] = []
    for (let i = 0; i < TCOUNT; i++) {
      const el = document.createElement('div')
      el.className = 'custom-cursor'
      const s = Math.max(0.5, 4 - i * 0.26)
      el.style.cssText = `position:fixed; pointer-events:none; z-index:9990; border-radius:50%; transform:translate(-50%,-50%); width:${s}px; height:${s}px; background:rgba(118,108,255,${(1 - i / TCOUNT) * 0.32}); opacity:0; transition:opacity 0.3s;`
      document.body.appendChild(el); trailEls.push(el)
    }

    const rips: { x: number; y: number; r: number; life: number }[] = []
    let lastR = 0
    const onMoveRip = () => { const now = Date.now(); if (now - lastR > 70) { rips.push({ x: mx, y: my, r: 0, life: 1 }); lastR = now } }
    window.addEventListener('mousemove', onMoveRip)

    const pts = Array(70).fill(0).map(() => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.28 + 0.05,
      c: [[118, 108, 255], [155, 143, 255], [244, 114, 182], [255, 255, 255]][Math.floor(Math.random() * 4)]
    }))

    const orbs = [
      { x: 0.35, y: 0.45, r: 340, c: [118, 108, 255], a: 0.045, vx: 0.00015, vy: 0.00012 },
      { x: 0.72, y: 0.32, r: 220, c: [155, 143, 255], a: 0.035, vx: -0.0002, vy: 0.00015 },
      { x: 0.15, y: 0.65, r: 180, c: [244, 114, 182], a: 0.028, vx: 0.00018, vy: -0.0002 }
    ]

    let raf: number
    let isVisible = true
    const obs = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting }, { threshold: 0.01 })
    obs.observe(cv)

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!isVisible) return
      ctx.fillStyle = '#05050e'; ctx.fillRect(0, 0, W, H)
      const sp = 52, ox = (mx * 0.028) % sp, oy = (my * 0.028) % sp
      ctx.strokeStyle = 'rgba(118,108,255,0.035)'; ctx.lineWidth = 1
      for (let x = -sp + ox; x < W + sp; x += sp) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = -sp + oy; y < H + sp; y += sp) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
      orbs.forEach(o => {
        o.x += o.vx + (mx / W - 0.5) * 0.0004; o.y += o.vy + (my / H - 0.5) * 0.0004
        if (o.x < 0.1 || o.x > 0.9) o.vx *= -1; if (o.y < 0.1 || o.y > 0.9) o.vy *= -1
        const [r, g, b] = o.c; const gr = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r)
        gr.addColorStop(0, `rgba(${r},${g},${b},${o.a})`); gr.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill()
      })
      const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 110)
      cg.addColorStop(0, 'rgba(118,108,255,0.08)'); cg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(mx, my, 110, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill()
      pts.forEach(p => {
        const d = Math.hypot(mx - p.x, my - p.y); if (d < 90) { p.vx -= (mx - p.x) / d * 0.14; p.vy -= (my - p.y) / d * 0.14 }
        p.vx *= 0.97; p.vy *= 0.97; p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        const [r, g, b] = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`; ctx.fill()
      })
      for (let i = rips.length - 1; i >= 0; i--) {
        const rp = rips[i]; rp.r += 1.8; rp.life -= 0.038
        if (rp.life <= 0) { rips.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(118,108,255,${rp.life * 0.1})`; ctx.stroke()
      }
      if (cdotRef.current) { cdotRef.current.style.left = mx + 'px'; cdotRef.current.style.top = my + 'px' }
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13
      if (cringRef.current) { cringRef.current.style.left = rx + 'px'; cringRef.current.style.top = ry + 'px' }
      for (let i = 0; i < TCOUNT; i++) {
        const p = i === 0 ? { x: mx, y: my } : trails[i - 1]; trails[i].x += (p.x - trails[i].x) * 0.38; trails[i].y += (p.y - trails[i].y) * 0.38
        trailEls[i].style.left = trails[i].x + 'px'; trailEls[i].style.top = trails[i].y + 'px'
      }
      if (headlineRef.current) {
        headlineRef.current.querySelectorAll('.char').forEach(ch => {
          const rect = ch.getBoundingClientRect(), cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
          const dx = mx - cx, dy = my - cy, dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            const force = (1 - dist / 80), px = -dx * force * 32 / dist || 0, py = -dy * force * 32 / dist || 0, sc = 1 + force * 0.25
            ;(ch as HTMLElement).style.transform = `translate(${px}px,${py}px) scale(${sc})`
          } else { ;(ch as HTMLElement).style.transform = 'translate(0,0) scale(1)' }
        })
      }
    }
    loop()
    return () => { cancelAnimationFrame(raf); obs.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); window.removeEventListener('mousemove', onMoveRip); trailEls.forEach(el => document.body.removeChild(el)) }
  }, [])

  /* ── Headline Rendering Logic ── */
  const renderChar = (txt: string) => {
    const words = txt.split(' ')
    return words.map((word, wi) => (
      <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.25em' }}>
        {[...word].map((ch, ci) => (
          <span key={ci} className="char" style={{ display: 'inline-block', transition: 'transform .08s, color .15s', willChange: 'transform' }}>
            {ch}
          </span>
        ))}
      </span>
    ))
  }

  const trustItems = trust ? trust.split('|').map(s => s.trim()).filter(Boolean) : []

  return (
    <section className="hero-section-wrapper" style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', background: '#05050e', display: 'flex', flexDirection: 'column' }}>
      
      {/* Interaction Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div ref={cdotRef} className="custom-cursor" style={{ position: 'fixed', zIndex: 9999, width: '6px', height: '6px', background: '#fff', borderRadius: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.3s' }} />
        <div ref={cringRef} className="custom-cursor" style={{ position: 'fixed', zIndex: 9999, width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.45)', borderRadius: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.3s' }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', alignItems: 'center', gap: '4rem', padding: '120px 32px 80px', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Left Side */}
        <div style={{ display: 'flex', flexDirection: 'column', pointerEvents: 'all' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '22px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.15)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: B_PRI, boxShadow: '0 0 10px var(--primary)' }} />
              <span style={{ ...M, fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: B_PRI, fontWeight: 700 }}>{eyebrow}</span>
            </div>
          </motion.div>

          <div ref={headlineRef} style={{ marginBottom: '24px', maxWidth: '620px' }}>
            <h1 style={{ ...F, fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', color: '#fff', cursor: 'none' }}>
              {renderChar(headline)}
            </h1>
            {subheadline && (
              <h1 style={{ ...F, fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', cursor: 'none' }}>
                {renderChar(subheadline)}
              </h1>
            )}
          </div>

          <p style={{ ...B, fontSize: '17px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', maxWidth: '540px', marginBottom: '36px', fontWeight: 400 }}>
            {desc}
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
            <Link href={ctaPrimaryHref} className="cta-custom-primary" style={{ textDecoration: 'none' }}>
              {ctaPrimaryLabel.toUpperCase()} <ArrowSVG />
            </Link>
            <Link href={ctaSecondaryHref} className="cta-custom-secondary" style={{ textDecoration: 'none' }}>{ctaSecondaryLabel} →</Link>
          </div>
        </div>

        {/* Right Side: Dynamic Premium Layout */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', pointerEvents: 'all' }}>
          
          <div style={{ position: 'absolute', top: '-24px', right: '16px', background: 'rgba(5,5,14,0.95)', border: '1px solid rgba(118,108,255,0.25)', borderRadius: '12px', padding: '10px 16px', fontSize: '11px', color: '#fff', backdropFilter: 'blur(12px)', zIndex: 20, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 32px rgba(118,108,255,0.15)', animation: 'chipBob 4s ease-in-out infinite alternate' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
            Enterprise Grade Quality
          </div>

          <div style={{ background: 'rgba(10,10,22,0.85)', border: '1px solid rgba(118,108,255,0.22)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 32px 100px rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ ...M, fontSize: '12px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Core Capabilities
            </div>

            {bullets.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {bullets.map((b: string, i: number) => (
                  <motion.div key={b} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(118,108,255,0.06)', border: '1px solid rgba(118,108,255,0.15)', borderRadius: '16px', padding: '12px 16px', transition: 'all 0.3s' }} className="hover:bg-[rgba(118,108,255,0.1)] hover:border-[rgba(118,108,255,0.3)] hover:-translate-y-1">
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckSVG size={12} />
                      </div>
                      <span style={{ ...F, fontSize: '14px', color: '#fff', fontWeight: 600 }}>{b}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : trustItems.length > 0 ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {trustItems.map((b: string, i: number) => (
                  <motion.div key={b} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(118,108,255,0.04)', border: '1px solid rgba(118,108,255,0.1)', borderRadius: '16px', padding: '14px 20px', transition: 'all 0.3s' }} className="hover:bg-[rgba(118,108,255,0.08)] hover:border-[rgba(118,108,255,0.2)]">
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(118,108,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: B_PRI }}>
                        <CheckSVG size={10} />
                      </div>
                      <span style={{ ...B, fontSize: '15px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{b}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontStyle: 'italic' }}>
                Elevating Brands Worldwide.
              </div>
            )}
          </div>

          {/* Bottom Stats Row */}
          <div style={{ display: 'flex', gap: '14px' }}>
            {[
              { ico: <SpeedSVG />, val: '99+', lbl: 'Performance', c1: B_PRI, c2: B_SEC, bar: 0.95 },
              { ico: <StarSVG />, val: '5.0', lbl: 'Client Rating', c1: B_PRI, c2: B_SEC, bar: 1.0 },
              { ico: <LockSVG />, val: '24/7', lbl: 'Total Support', c1: B_PRI, c2: B_SEC, bar: 0.98 },
            ].map((m, i) => (
              <motion.div key={m.lbl} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} style={{ flex: 1 }}>
                <div style={{ background: 'rgba(15,15,30,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '18px', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
                  <div style={{ color: m.c1, marginBottom: '8px', display: 'flex' }}>{m.ico}</div>
                  <div style={{ ...F, fontWeight: 800, fontSize: '22px', color: '#fff', marginBottom: '2px' }}>{m.val}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{m.lbl}</div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${m.c1}, ${m.c2})`, transform: `scaleX(${m.bar})`, transformOrigin: 'left', opacity: 0.8 }} />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes chipBob { from { transform: translateY(0); } to { transform: translateY(-8px); } }
        .hero-section-wrapper { cursor: none; }
        .hero-section-wrapper:hover .custom-cursor { opacity: 1 !important; }
        .cta-custom-primary {
          background: var(--grad); color: #fff; padding: 0.9rem 2rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
          transition: all 0.28s; white-space: nowrap; box-shadow: 0 0 30px ${B_GLO};
          border: none; cursor: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .cta-custom-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 38px rgba(118,108,255,0.5); }
        .cta-custom-secondary {
          color: rgba(255,255,255,0.65); font-size: 0.9rem; background: none; border: 1px solid rgba(255,255,255,0.15);
          padding: 0.85rem 1.8rem; border-radius: 12px; font-family: 'DM Sans', sans-serif;
          transition: all 0.25s; white-space: nowrap; cursor: none; font-weight: 500;
        }
        .cta-custom-secondary:hover { color: #fff; border-color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.05); }
        @media (max-width: 1024px) {
          .container { grid-template-columns: 1fr !important; padding-top: 100px !important; gap: 2rem !important; }
          .container > div:last-child { display: none; }
        }
      `}</style>
    </section>
  )
}
