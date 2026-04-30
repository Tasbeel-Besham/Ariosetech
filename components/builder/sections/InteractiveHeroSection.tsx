'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type HeroProps = {
  eyebrow?: string
  headline?: string
  subheadline?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  stats?: { value: string; label: string }[]
}

export default function InteractiveHeroSection({
  eyebrow = 'Trusted by businesses in the USA, UAE, and Switzerland',
  headline = 'Professional WordPress, Shopify & WooCommerce Development Since 2017',
  subheadline = "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.",
  ctaPrimaryLabel = 'Get Free Quote & Strategy Call',
  ctaPrimaryHref = '/contact',
  ctaSecondaryLabel = 'View Our Portfolio',
  ctaSecondaryHref = '/portfolio',
  stats = [
    { value: '150%', label: 'Avg Conversion Lift' },
    { value: '30d', label: 'Concept to Launch' },
    { value: '60%', label: 'Cost Savings' },
    { value: '24/7', label: 'Support Included' },
  ]
}: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cdotRef = useRef<HTMLDivElement>(null)
  const cringRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const

  useEffect(() => {
    if (typeof window === 'undefined') return

    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d'); if (!ctx) return

    let W: number, H: number
    let mx = -2000, my = -2000
    let rx = -2000, ry = -2000

    const resize = () => {
      W = cv.width = window.innerWidth
      H = cv.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── CURSOR TRAIL LOGIC ───────────────────────────────────────
    const TRAIL_COUNT = 15
    const trails: { el: HTMLDivElement; x: number; y: number }[] = []
    const trailContainer = document.createElement('div')
    trailContainer.style.pointerEvents = 'none'
    document.body.appendChild(trailContainer)

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const t = document.createElement('div')
      t.style.position = 'fixed'
      t.style.borderRadius = '50%'
      t.style.pointerEvents = 'none'
      t.style.zIndex = '9998'
      t.style.transform = 'translate(-50%, -50%)'
      t.style.transition = 'opacity .5s'
      const s = 5 - i * 0.3
      const op = (1 - i / TRAIL_COUNT) * 0.3
      t.style.width = `${s}px`; t.style.height = `${s}px`
      t.style.background = `var(--primary)`
      t.style.opacity = `${op}`
      trailContainer.appendChild(t)
      trails.push({ el: t, x: -2000, y: -2000 })
    }

    // ── CANVAS NODES ─────────────────────────────────────────────
    const services = [
      { label: 'WordPress Dev', sub: 'Custom themes', color: [118, 108, 255], size: 52, icon: '⚡' },
      { label: 'E-Commerce', sub: 'Shopify & Woo', color: [155, 143, 255], size: 46, icon: '🛒' },
      { label: 'SEO & Speed', sub: 'Performance', color: [180, 160, 255], size: 42, icon: '🔍' },
      { label: 'UI/UX Design', sub: 'Interfaces', color: [118, 108, 255], size: 44, icon: '🎨' },
      { label: '24/7 Support', sub: 'Always here', color: [155, 143, 255], size: 40, icon: '🛡️' },
      { label: 'Web Apps', sub: 'Scalable builds', color: [180, 160, 255], size: 38, icon: '⚙️' },
    ]

    let nodes = services.map((s, i) => {
      const angle = (i / services.length) * Math.PI * 2
      const radiusX = window.innerWidth * 0.2, radiusY = window.innerHeight * 0.28
      const cx = window.innerWidth * 0.78, cy = window.innerHeight * 0.48
      return {
        ...s,
        x: cx + Math.cos(angle) * radiusX,
        y: cy + Math.sin(angle) * radiusY * 0.7,
        vx: 0, vy: 0,
        baseX: cx + Math.cos(angle) * radiusX,
        baseY: cy + Math.sin(angle) * radiusY * 0.7,
        orbitR: 3 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
        glowPulse: Math.random() * Math.PI * 2,
        hover: 0
      }
    })

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.3, alpha: Math.random() * 0.25 + 0.05,
      color: [118, 108, 255]
    }))

    const ripples: any[] = []
    let lastRipple = 0
    const onMouseMoveRipple = () => {
      const now = Date.now()
      if (now - lastRipple > 100 && mx > 0) {
        ripples.push({ x: mx, y: my, r: 0, life: 1 })
        lastRipple = now
      }
    }
    window.addEventListener('mousemove', onMouseMoveRipple)

    let raf: number
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#050508'
      ctx.fillRect(0, 0, W, H)

      // Grid
      const sp = 60; const ox = (mx * 0.03) % sp; const oy = (my * 0.03) % sp
      ctx.strokeStyle = 'rgba(118,108,255,0.03)'; ctx.lineWidth = 1
      for (let x = -sp + ox; x < W + sp; x += sp) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = -sp + oy; y < H + sp; y += sp) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]; rp.r += 2.2; rp.life -= 0.035
        if (rp.life <= 0) { ripples.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(118,108,255,${0.1 * rp.life})`; ctx.stroke()
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`; ctx.fill()
      })

      // Connections
      nodes.forEach((n, i) => {
        nodes.slice(i + 1).forEach(m => {
          const dx = n.x - m.x, dy = n.y - m.y, d = Math.sqrt(dx*dx + dy*dy)
          if (d < 220) {
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y)
            ctx.strokeStyle = `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${(1 - d/220) * 0.12})`; ctx.stroke()
          }
        })
      })

      // Nodes
      nodes.forEach((n, i) => {
        n.glowPulse += 0.02
        const dx = mx - n.x, dy = my - n.y, dist = Math.sqrt(dx*dx + dy*dy)
        const hovered = dist < n.size + 15; n.hover += (hovered ? 1 : -1) * 0.08; n.hover = Math.max(0, Math.min(1, n.hover))

        const targetX = n.baseX + Math.cos(t * 0.001 * 40 + n.phase) * n.orbitR
        const targetY = n.baseY + Math.sin(t * 0.001 * 40 + n.phase) * n.orbitR
        if (dist < 140 && dist > 0) { const f = (140 - dist) / 140; n.vx -= (dx / dist) * f * 1.2; n.vy -= (dy / dist) * f * 1.2 }
        n.vx += (targetX - n.x) * 0.018; n.vy += (targetY - n.y) * 0.018
        n.vx *= 0.88; n.vy *= 0.88; n.x += n.vx; n.y += n.vy

        const [r,g,b] = n.color; const glow = 0.5 + Math.sin(n.glowPulse) * 0.3; const sz = n.size + n.hover * 10
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, sz * 2.5)
        grad.addColorStop(0, `rgba(${r},${g},${b},${0.1 * glow + n.hover * 0.2})`); grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath(); ctx.arc(n.x, n.y, sz * 2.5, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        ctx.beginPath(); ctx.arc(n.x, n.y, sz, 0, Math.PI * 2); ctx.strokeStyle = `rgba(${r},${g},${b},${0.4 + n.hover * 0.4})`; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.font = `${sz * 0.52}px var(--font-display)`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n.icon, n.x, n.y)
        if (n.hover > 0.1) {
          ctx.globalAlpha = n.hover; ctx.font = `700 13px var(--font-display)`; ctx.fillStyle = '#fff'; ctx.fillText(n.label, n.x, n.y + sz + 18)
          ctx.font = `700 11px var(--font-mono)`; ctx.fillStyle = `var(--text-3)`; ctx.fillText(n.sub, n.x, n.y + sz + 34); ctx.globalAlpha = 1
        }
      })

      // Cursor
      if (cdotRef.current) { cdotRef.current.style.left = `${mx}px`; cdotRef.current.style.top = `${my}px` }
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13
      if (cringRef.current) { cringRef.current.style.left = `${rx}px`; cringRef.current.style.top = `${ry}px` }
      trails.forEach((tr, i) => {
        const prev = i === 0 ? { x: mx, y: my } : trails[i - 1]
        tr.x += (prev.x - tr.x) * 0.35; tr.y += (prev.y - tr.y) * 0.35
        tr.el.style.left = `${tr.x}px`; tr.el.style.top = `${tr.y}px`
      })
    }
    raf = requestAnimationFrame(loop)

    document.body.style.cursor = 'none'

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousemove', onMouseMoveRipple)
      document.body.removeChild(trailContainer)
      document.body.style.cursor = 'auto'
    }
  }, [])

  const headlineParts = headline.split(' & ')
  const headLine1 = headlineParts[0] + (headlineParts.length > 1 ? ' &' : '')
  const headLine2 = headlineParts.length > 1 ? headlineParts[1] : ''

  return (
    <section ref={heroRef} className="hero-interactive" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Custom Cursor */}
      <div id="cur" style={{ pointerEvents: 'none' }}>
        <div ref={cdotRef} style={{ position: 'fixed', zLength: 9999, width: '10px', height: '10px', background: '#fff', borderRadius: '50%', transform: 'translate(-50%, -50%)', transition: 'width .2s, height .2s, background .2s', zIndex: 9999 }} />
        <div ref={cringRef} style={{ position: 'fixed', zLength: 9999, width: '40px', height: '40px', border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }} />
      </div>

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ maxWidth: '1100px', padding: '0 20px' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="eyebrow" style={{ marginBottom: '28px', pointerEvents: 'none' }}>
              <span style={{ marginLeft: '12px' }}>{eyebrow}</span>
            </div>

            <h1 style={{ ...F, fontSize: 'clamp(2rem, 4.2vw, 4rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#fff', marginBottom: '24px', textTransform: 'uppercase' }}>
              <span style={{ color: '#fff' }}>{headline.split(' & ')[0]} &</span><br />
              <span style={{ display: 'inline-block', paddingLeft: '3.5rem', background: 'linear-gradient(110deg, #766cff, #9b8fff 45%, #60a5fa 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gAnim 5s ease-in-out infinite alternate', backgroundSize: '200%' }}>{headline.split(' & ')[1]}</span>
            </h1>

            <p style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '520px', marginBottom: '44px' }}>
              {subheadline}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', pointerEvents: 'all' }}>
              <Link href={ctaPrimaryHref} className="btn btn-primary btn-xl">
                {ctaPrimaryLabel} →
              </Link>
              <Link href={ctaSecondaryHref} className="btn btn-outline btn-xl">
                {ctaSecondaryLabel}
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '48px', marginTop: '64px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
              {stats.map((s, i) => (
                <div key={s.label}>
                  <div style={{ ...F, fontSize: '28px', fontWeight: 900, background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                  <div style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <div className="ticker-wrap" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15, background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--border)', padding: '12px 0', overflow: 'hidden' }}>
        <div className="ticker-track" style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 40s linear infinite' }}>
          {[
            'WordPress Development', 'E-Commerce Stores', 'SEO Optimization', 'Custom Web Apps', 
            'Speed Optimization', '24/7 Support', 'UI/UX Design', 'Conversion Rate Optimization'
          ].map((text, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '0 32px', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.14em', ...M }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />
              {text}
            </span>
          ))}
          {/* Repeat for seamless loop */}
          {[
            'WordPress Development', 'E-Commerce Stores', 'SEO Optimization', 'Custom Web Apps', 
            'Speed Optimization', '24/7 Support', 'UI/UX Design', 'Conversion Rate Optimization'
          ].map((text, i) => (
            <span key={'repeat-'+i} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '0 32px', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.14em', ...M }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />
              {text}
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes gAnim {
          0% { background-position: 0%; }
          100% { background-position: 100%; }
        }
      `}</style>
    </section>
  )
}
