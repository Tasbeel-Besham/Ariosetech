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
      W = cv.width = cv.offsetWidth
      H = cv.height = cv.offsetHeight
    }
    resize(); const ro = new ResizeObserver(resize); ro.observe(cv)

    const onMove = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect()
      mx = e.clientX - rect.left; my = e.clientY - rect.top
    }
    cv.parentElement?.addEventListener('mousemove', onMove)

    // ── CURSOR TRAIL LOGIC ───────────────────────────────────────
    const TRAIL_COUNT = 18
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
      const s = 6 - i * 0.25
      const op = (1 - i / TRAIL_COUNT) * 0.35
      t.style.width = `${s}px`; t.style.height = `${s}px`
      t.style.background = `var(--primary)`
      t.style.opacity = `${op}`
      trailContainer.appendChild(t)
      trails.push({ el: t, x: -2000, y: -2000 })
    }

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
      const radiusX = W * 0.35, radiusY = H * 0.45
      return {
        ...s,
        x: W * 0.6 + Math.cos(angle) * radiusX,
        y: H * 0.5 + Math.sin(angle) * radiusY,
        vx: 0, vy: 0,
        baseX: W * 0.6 + Math.cos(angle) * radiusX,
        baseY: H * 0.5 + Math.sin(angle) * radiusY,
        orbitR: 4 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
        hover: 0
      }
    })

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.3, alpha: Math.random() * 0.3 + 0.05
    }))

    const ripples: any[] = []
    let lastRipple = 0
    const onMoveRipple = () => {
      const now = Date.now()
      if (now - lastRipple > 80 && mx > 0) {
        ripples.push({ x: mx, y: my, r: 0, life: 1 })
        lastRipple = now
      }
    }
    cv.parentElement?.addEventListener('mousemove', onMoveRipple)

    let raf: number
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      ctx.clearRect(0, 0, W, H)

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
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(118,108,255,${p.alpha})`; ctx.fill()
      })

      // Connections
      nodes.forEach((n, i) => {
        nodes.slice(i + 1).forEach(m => {
          const d = Math.sqrt((n.x-m.x)**2 + (n.y-m.y)**2)
          if (d < 220) {
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.strokeStyle = `rgba(118,108,255,${(1-d/220)*0.12})`; ctx.stroke()
          }
        })
      })

      // Nodes
      nodes.forEach((n, i) => {
        const dx = mx - n.x, dy = my - n.y, dist = Math.sqrt(dx*dx + dy*dy)
        const hovered = dist < n.size + 15; n.hover += (hovered ? 1 : -1) * 0.08; n.hover = Math.max(0, Math.min(1, n.hover))

        const targetX = n.baseX + Math.cos(t * 0.001 * 40 + n.phase) * n.orbitR
        const targetY = n.baseY + Math.sin(t * 0.001 * 40 + n.phase) * n.orbitR
        if (dist < 140 && dist > 0) { const f = (140 - dist) / 140; n.vx -= (dx / dist) * f * 1.2; n.vy -= (dy / dist) * f * 1.2 }
        n.vx += (targetX - n.x) * 0.018; n.vy += (targetY - n.y) * 0.018
        n.vx *= 0.88; n.vy *= 0.88; n.x += n.vx; n.y += n.vy

        const [r,g,b] = n.color; const sz = n.size + n.hover * 10
        ctx.beginPath(); ctx.arc(n.x, n.y, sz, 0, Math.PI * 2); ctx.strokeStyle = `rgba(${r},${g},${b},${0.4 + n.hover * 0.4})`; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.font = `${sz * 0.52}px var(--font-display)`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n.icon, n.x, n.y)
        if (n.hover > 0.1) {
          ctx.globalAlpha = n.hover; ctx.font = `700 13px var(--font-display)`; ctx.fillStyle = '#fff'; ctx.fillText(n.label, n.x, n.y + sz + 18)
          ctx.font = `700 11px var(--font-mono)`; ctx.fillStyle = `var(--text-3)`; ctx.fillText(n.sub, n.x, n.y + sz + 34); ctx.globalAlpha = 1
        }
      })

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
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('mousemove', onMove); document.body.removeChild(trailContainer); document.body.style.cursor = 'auto' }
  }, [])

  return (
    <section className="hero-interactive" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg)', display: 'flex', alignItems: 'center' }}>
      
      {/* Custom Cursor */}
      <div style={{ pointerEvents: 'none' }}>
        <div ref={cdotRef} style={{ position: 'fixed', zIndex: 9999, width: '10px', height: '10px', background: '#fff', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }} />
        <div ref={cringRef} style={{ position: 'fixed', zIndex: 9999, width: '40px', height: '40px', border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }} />
      </div>

      {/* Canvas Background Layer */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.8 }} />

      <div className="container" style={{ position: 'relative', zIndex: 10, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
        
        {/* LEFT CONTENT — Managed Width */}
        <div style={{ flex: '1', maxWidth: '680px' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            
            {/* Eyebrow */}
            <div className="eyebrow" style={{ marginBottom: '28px' }}>
              <span style={{ marginLeft: '12px' }}>{eyebrow}</span>
            </div>

            {/* Headline */}
            <h1 style={{ ...F, fontSize: 'clamp(2.2rem, 4.8vw, 4.2rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', color: '#fff', marginBottom: '24px', textTransform: 'uppercase' }}>
              Professional WordPress, <br />
              <span style={{ display: 'block', paddingLeft: '3.5rem', background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gAnim 5s ease-in-out infinite alternate', backgroundSize: '200%' }}>
                Shopify & WooCommerce <br />
                <span style={{ color: '#fff', paddingLeft: '1.5rem' }}>Development Since 2017</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '520px', marginBottom: '44px', fontWeight: 400 }}>
              {subheadline}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', pointerEvents: 'all' }}>
              <Link href={ctaPrimaryHref} className="btn btn-primary btn-xl">
                {ctaPrimaryLabel} →
              </Link>
              <Link href={ctaSecondaryHref} className="btn btn-outline btn-xl">
                {ctaSecondaryLabel}
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '48px', marginTop: '64px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ ...F, fontSize: '28px', fontWeight: 900, color: '#fff' }}>{s.value}</div>
                  <div style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>

          </motion.div>
        </div>

        {/* RIGHT SIDE — Empty space for nodes to live in without overlapping text */}
        <div style={{ flex: '1' }} />

      </div>

      {/* Ticker — Important Element */}
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
