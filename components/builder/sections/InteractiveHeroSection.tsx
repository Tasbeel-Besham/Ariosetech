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
  subheadline = "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence.",
  ctaPrimaryLabel = 'Get Free Quote & Strategy Call',
  ctaPrimaryHref = '/contact',
  ctaSecondaryLabel = 'View Our Portfolio',
  ctaSecondaryHref = '/portfolio',
  stats = [
    { value: '150%', label: 'Conversion Lift' },
    { value: '30d', label: 'Avg Delivery' },
    { value: '60%', label: 'Cost Savings' },
    { value: '24/7', label: 'Support' },
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

    const services = [
      { label: 'WordPress', color: [118, 108, 255], size: 40, icon: '⚡' },
      { label: 'Shopify', color: [155, 143, 255], size: 36, icon: '🛒' },
      { label: 'E-Com', color: [180, 160, 255], size: 32, icon: '🛍️' },
      { label: 'SEO', color: [118, 108, 255], size: 34, icon: '🔍' },
      { label: 'UI/UX', color: [155, 143, 255], size: 38, icon: '🎨' },
    ]

    let nodes = services.map((s, i) => {
      const angle = (i / services.length) * Math.PI * 2
      const radiusX = W * 0.35, radiusY = H * 0.35
      return {
        ...s,
        x: W * 0.5 + Math.cos(angle) * radiusX,
        y: H * 0.5 + Math.sin(angle) * radiusY,
        vx: 0, vy: 0,
        baseX: W * 0.5 + Math.cos(angle) * radiusX,
        baseY: H * 0.5 + Math.sin(angle) * radiusY,
        orbitR: 4 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
        hover: 0
      }
    })

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.4, alpha: Math.random() * 0.2 + 0.05
    }))

    let raf: number
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      ctx.clearRect(0, 0, W, H)

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(118,108,255,${p.alpha})`; ctx.fill()
      })

      // Nodes
      nodes.forEach((n, i) => {
        const dx = mx - n.x, dy = my - n.y, dist = Math.sqrt(dx*dx + dy*dy)
        const hovered = dist < n.size + 10; n.hover += (hovered ? 1 : -1) * 0.1; n.hover = Math.max(0, Math.min(1, n.hover))

        const targetX = n.baseX + Math.cos(t * 0.001 * 0.5 + n.phase) * n.orbitR
        const targetY = n.baseY + Math.sin(t * 0.001 * 0.5 + n.phase) * n.orbitR
        if (dist < 120 && dist > 0) { const f = (120 - dist) / 120; n.vx -= (dx / dist) * f * 1.5; n.vy -= (dy / dist) * f * 1.5 }
        n.vx += (targetX - n.x) * 0.02; n.vy += (targetY - n.y) * 0.02
        n.vx *= 0.85; n.vy *= 0.85; n.x += n.vx; n.y += n.vy

        const [r,g,b] = n.color; const sz = n.size + n.hover * 6
        ctx.beginPath(); ctx.arc(n.x, n.y, sz, 0, Math.PI * 2); ctx.strokeStyle = `rgba(${r},${g},${b},${0.25 + n.hover * 0.5})`; ctx.lineWidth = 1; ctx.stroke()
        ctx.font = `${sz * 0.5}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n.icon, n.x, n.y)
        if (n.hover > 0.1) {
          ctx.globalAlpha = n.hover; ctx.font = `700 11px var(--font-display)`; ctx.fillStyle = '#fff'; ctx.fillText(n.label, n.x, n.y + sz + 14); ctx.globalAlpha = 1
        }
      })

      // Connections
      nodes.forEach((n, i) => {
        nodes.slice(i + 1).forEach(m => {
          const d = Math.sqrt((n.x-m.x)**2 + (n.y-m.y)**2)
          if (d < 180) {
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.strokeStyle = `rgba(118,108,255,${(1-d/180)*0.08})`; ctx.stroke()
          }
        })
      })

      if (cdotRef.current) { cdotRef.current.style.left = `${mx}px`; cdotRef.current.style.top = `${my}px` }
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15
      if (cringRef.current) { cringRef.current.style.left = `${rx}px`; cringRef.current.style.top = `${ry}px` }
    }
    raf = requestAnimationFrame(loop)

    document.body.style.cursor = 'none'
    return () => { cancelAnimationFrame(raf); ro.disconnect(); document.body.style.cursor = 'auto' }
  }, [])

  return (
    <section className="hero-sleek" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg)', display: 'flex', alignItems: 'center' }}>
      {/* Custom Cursor */}
      <div style={{ pointerEvents: 'none' }}>
        <div ref={cdotRef} style={{ position: 'fixed', zIndex: 9999, width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
        <div ref={cringRef} style={{ position: 'fixed', zIndex: 9999, width: '32px', height: '32px', border: '1px solid var(--primary)', opacity: 0.5, borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
      </div>

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }} />

      <div className="container" style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ maxWidth: '820px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            
            {/* Eyebrow */}
            <div className="eyebrow" style={{ marginBottom: '32px' }}>
              <span style={{ marginLeft: '12px', color: 'var(--text-3)' }}>{eyebrow}</span>
            </div>

            {/* Headline */}
            <h1 style={{ ...F, fontSize: 'clamp(2.2rem, 4.8vw, 4.2rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', color: '#fff', marginBottom: '28px', textTransform: 'uppercase' }}>
              Professional WordPress, <br />
              <span style={{ display: 'block', paddingLeft: '3.5rem', background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                 Shopify & WooCommerce <br />
                 <span style={{ color: '#fff', paddingLeft: '1.5rem' }}>Development Since 2017</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '540px', marginBottom: '48px', fontWeight: 400 }}>
              {subheadline}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', pointerEvents: 'all' }}>
              <Link href={ctaPrimaryHref} className="btn btn-primary btn-lg">
                {ctaPrimaryLabel}
              </Link>
              <Link href={ctaSecondaryHref} className="btn btn-outline btn-lg">
                {ctaSecondaryLabel}
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '48px', marginTop: '72px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ ...F, fontSize: '26px', fontWeight: 800, color: '#fff' }}>{s.value}</div>
                  <div style={{ ...M, fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>

      {/* Decorative Gradient Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '60%', background: 'radial-gradient(circle, rgba(118,108,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '30%', height: '50%', background: 'radial-gradient(circle, rgba(118,108,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <style jsx global>{`
        .btn-primary:hover { box-shadow: 0 12px 40px var(--primary-glow); }
      `}</style>
    </section>
  )
}
