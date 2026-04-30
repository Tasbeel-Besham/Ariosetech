'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type HeroProps = {
  eyebrow?: string
  headline?: string
  subheadline?: string
  supportingText?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  trust?: string
  stats?: { value: string; label: string }[]
}

export default function InteractiveHeroSection({
  eyebrow = 'Web Development Agency · Lahore',
  headline = 'Consider It Solved.',
  subheadline = 'Premium WordPress, e-commerce & custom web development. 60% less than US agencies — zero compromise on quality.',
  supportingText,
  ctaPrimaryLabel = 'Start Your Project',
  ctaPrimaryHref = '/contact',
  ctaSecondaryLabel = 'View Our Work',
  ctaSecondaryHref = '/portfolio',
  trust,
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

    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let W: number, H: number
    let mx = -200, my = -200
    let rx = -200, ry = -200

    const resize = () => {
      W = cv.width = window.innerWidth
      H = cv.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

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
      t.style.width = `${s}px`
      t.style.height = `${s}px`
      t.style.background = `rgba(118, 108, 255, ${op})`
      trailContainer.appendChild(t)
      trails.push({ el: t, x: -200, y: -200 })
    }

    // ── CANVAS NODES ─────────────────────────────────────────────
    const services = [
      { label: 'WordPress Dev', sub: 'Custom themes & plugins', color: [118, 108, 255], size: 52, icon: '⚡' },
      { label: 'E-Commerce', sub: 'WooCommerce & Shopify', color: [167, 139, 250], size: 46, icon: '🛒' },
      { label: 'SEO & Speed', sub: '40% faster, rank higher', color: [244, 114, 182], size: 42, icon: '🔍' },
      { label: 'UI/UX Design', sub: 'Pixel-perfect interfaces', color: [34, 211, 238], size: 44, icon: '🎨' },
      { label: '24/7 Support', sub: 'Always here for you', color: [74, 222, 128], size: 40, icon: '🛡️' },
      { label: 'Web Apps', sub: 'Scalable & secure builds', color: [251, 146, 60], size: 38, icon: '⚙️' },
    ]

    let nodes = services.map((s, i) => {
      const angle = (i / services.length) * Math.PI * 2
      const radiusX = window.innerWidth * 0.22
      const radiusY = window.innerHeight * 0.28
      const cx = window.innerWidth * 0.72
      const cy = window.innerHeight * 0.48
      return {
        ...s,
        x: cx + Math.cos(angle) * radiusX,
        y: cy + Math.sin(angle) * radiusY * 0.7,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseX: cx + Math.cos(angle) * radiusX,
        baseY: cy + Math.sin(angle) * radiusY * 0.7,
        angle: angle,
        orbitSpeed: 0.003 + Math.random() * 0.002,
        orbitR: 3 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
        glowPulse: Math.random() * Math.PI * 2,
        hover: 0,
        grabbed: false,
      }
    })

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.4 + 0.05,
      color: [[118, 108, 255], [167, 139, 250], [244, 114, 182], [255, 255, 255]][Math.floor(Math.random() * 4)],
    }))

    const ripples: any[] = []
    let lastRipple = 0
    const onMouseMoveRipple = () => {
      const now = Date.now()
      if (now - lastRipple > 80) {
        ripples.push({ x: mx, y: my, r: 0, alpha: 0.18, life: 1 })
        lastRipple = now
      }
    }
    window.addEventListener('mousemove', onMouseMoveRipple)

    let grabbedNode: any = null
    let grabOffX = 0, grabOffY = 0
    const onMouseDown = () => {
      for (const n of nodes) {
        const dx = mx - n.x, dy = my - n.y
        if (Math.sqrt(dx * dx + dy * dy) < n.size + 10) {
          grabbedNode = n
          n.grabbed = true
          grabOffX = dx; grabOffY = dy
          if (cdotRef.current) { cdotRef.current.style.width = '0px'; cdotRef.current.style.height = '0px' }
          if (cringRef.current) { cringRef.current.style.width = '70px'; cringRef.current.style.height = '70px' }
          break
        }
      }
    }
    const onMouseUp = () => {
      if (grabbedNode) {
        grabbedNode.grabbed = false
        grabbedNode.vx = (mx - grabbedNode.x) * 0.15
        grabbedNode.vy = (my - grabbedNode.y) * 0.15
        grabbedNode = null
        if (cdotRef.current) { cdotRef.current.style.width = '10px'; cdotRef.current.style.height = '10px' }
        if (cringRef.current) { cringRef.current.style.width = '40px'; cringRef.current.style.height = '40px' }
      }
    }
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    let raf: number
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#050508'
      ctx.fillRect(0, 0, W, H)

      // Grid
      const sp = 60
      const ox = (mx * 0.04) % sp
      const oy = (my * 0.04) % sp
      ctx.strokeStyle = 'rgba(118,108,255,0.04)'
      ctx.lineWidth = 1
      for (let x = -sp + ox; x < W + sp; x += sp) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = -sp + oy; y < H + sp; y += sp) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r += 2.5; rp.life -= 0.04
        if (rp.life <= 0) { ripples.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(118,108,255,${rp.alpha * rp.life})`; ctx.stroke()
      }

      // Particles
      particles.forEach(p => {
        const dx = mx - p.x, dy = my - p.y; const d = Math.sqrt(dx*dx + dy*dy)
        if (d < 100) { p.vx -= dx/d * 0.2; p.vy -= dy/d * 0.2 }
        p.vx *= 0.97; p.vy *= 0.97; p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        const [r,g,b] = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`; ctx.fill()
      })

      // Connections
      nodes.forEach((n, i) => {
        nodes.slice(i + 1).forEach(m => {
          const dx = n.x - m.x, dy = n.y - m.y, d = Math.sqrt(dx*dx + dy*dy)
          if (d < 220) {
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y)
            ctx.strokeStyle = `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${(1 - d/220) * 0.15})`; ctx.stroke()
          }
        })
        const dx = mx - n.x, dy = my - n.y, d = Math.sqrt(dx*dx + dy*dy)
        if (d < 280) {
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mx, my)
          ctx.strokeStyle = `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${(1 - d/280) * 0.5})`; ctx.setLineDash([4, 8]); ctx.stroke(); ctx.setLineDash([])
        }
      })

      // Nodes
      nodes.forEach((n, i) => {
        n.glowPulse += 0.025
        const dx = mx - n.x, dy = my - n.y, dist = Math.sqrt(dx*dx + dy*dy)
        const hovered = dist < n.size + 16 && !grabbedNode
        n.hover += (hovered ? 1 : -1) * 0.08
        n.hover = Math.max(0, Math.min(1, n.hover))

        if (n.grabbed) { n.x = mx - grabOffX; n.y = my - grabOffY; n.vx = 0; n.vy = 0 }
        else {
          if (dist < 160 && dist > 0) { const force = (160 - dist) / 160; n.vx -= (dx / dist) * force * 1.4; n.vy -= (dy / dist) * force * 1.4 }
          const targetX = n.baseX + Math.cos(t * 0.001 * 40 + n.phase) * n.orbitR
          const targetY = n.baseY + Math.sin(t * 0.001 * 40 + n.phase) * n.orbitR
          n.vx += (targetX - n.x) * 0.018; n.vy += (targetY - n.y) * 0.018
          n.vx *= 0.88; n.vy *= 0.88; n.x += n.vx; n.y += n.vy
        }

        const [r,g,b] = n.color; const glow = 0.5 + Math.sin(n.glowPulse) * 0.3; const sz = n.size + n.hover * 10
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, sz * 2.5)
        grad.addColorStop(0, `rgba(${r},${g},${b},${0.15 * glow + n.hover * 0.2})`); grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath(); ctx.arc(n.x, n.y, sz * 2.5, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        ctx.beginPath(); ctx.arc(n.x, n.y, sz, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.45 + n.hover * 0.4})`; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.font = `${sz * 0.52}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n.icon, n.x, n.y)
        if (n.hover > 0.1) {
          ctx.globalAlpha = n.hover; ctx.font = `700 13px var(--font-display)`; ctx.fillStyle = '#fff'; ctx.fillText(n.label, n.x, n.y + sz + 18)
          ctx.font = `11px var(--font-mono)`; ctx.fillStyle = `rgba(${r},${g},${b},0.9)`; ctx.fillText(n.sub, n.x, n.y + sz + 34); ctx.globalAlpha = 1
        }
      })

      // Vignette
      const vg = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.85)
      vg.addColorStop(0, 'rgba(5,5,8,0)'); vg.addColorStop(1, 'rgba(5,5,8,0.75)')
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)

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

    // Apply cursor: none to body
    document.body.style.cursor = 'none'

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousemove', onMouseMoveRipple)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.removeChild(trailContainer)
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <section ref={heroRef} className="hero-interactive" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', background: '#050508' }}>
      {/* Custom Cursor Scoped to Hero (or Global) */}
      <div id="cur" style={{ pointerEvents: 'none' }}>
        <div ref={cdotRef} style={{ position: 'fixed', zIndex: 9999, width: '10px', height: '10px', background: '#fff', borderRadius: '50%', transform: 'translate(-50%, -50%)', transition: 'width .2s, height .2s, background .2s' }} />
        <div ref={cringRef} style={{ position: 'fixed', zIndex: 9999, width: '40px', height: '40px', border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
      </div>

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ maxWidth: '800px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '24px', height: '2px', background: 'var(--grad)' }} />
              <span style={{ ...M, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{eyebrow}</span>
            </div>

            <h1 style={{ ...F, fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.05em', color: '#fff', marginBottom: '24px' }}>
              Consider <br />
              <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>It Solved.</span>
            </h1>

            <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '500px', marginBottom: '40px' }}>
              {subheadline}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', pointerEvents: 'all' }}>
              <Link href={ctaPrimaryHref} className="btn btn-primary btn-xl">
                {ctaPrimaryLabel} →
              </Link>
              <Link href={ctaSecondaryHref} style={{ ...M, fontSize: '13px', color: 'var(--text-2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {ctaSecondaryLabel} <span style={{ fontSize: '16px' }}>→</span>
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '48px', marginTop: '64px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '32px' }}>
              {stats.map((s, i) => (
                <div key={s.label}>
                  <div style={{ ...F, fontSize: '28px', fontWeight: 900, background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                  <div style={{ ...M, fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div style={{ position: 'absolute', bottom: '40px', right: '40px', zIndex: 20, display: 'flex', alignItems: 'center', gap: '12px' }}>
         <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px' }}>↗</div>
         <span style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Move cursor to play</span>
      </div>

      {/* Ticker */}
      <div className="ticker-wrap" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15, background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 0', overflow: 'hidden' }}>
        <div className="ticker-track" style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 40s linear infinite' }}>
          {[
            'WordPress Development', 'E-Commerce Stores', 'SEO Optimization', 'Custom Web Apps', 
            'Speed Optimization', '24/7 Support', 'UI/UX Design', 'Conversion Rate Optimization'
          ].map((text, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '0 32px', fontSize: '10px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', ...M }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />
              {text}
            </span>
          ))}
          {/* Repeat for seamless loop */}
          {[
            'WordPress Development', 'E-Commerce Stores', 'SEO Optimization', 'Custom Web Apps', 
            'Speed Optimization', '24/7 Support', 'UI/UX Design', 'Conversion Rate Optimization'
          ].map((text, i) => (
            <span key={'repeat-'+i} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '0 32px', fontSize: '10px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', ...M }}>
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
      `}</style>
    </section>
  )
}
