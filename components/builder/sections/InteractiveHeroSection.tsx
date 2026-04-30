'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function InteractiveHeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cdotRef = useRef<HTMLDivElement>(null)
  const cringRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  
  const F = { fontFamily: 'var(--font-manrope), var(--font-display), sans-serif' } as const
  const B = { fontFamily: 'var(--font-body), sans-serif' } as const
  const M = { fontFamily: 'var(--font-mono), monospace' } as const

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d'); if (!ctx) return
    let W = cv.width = window.innerWidth, H = cv.height = window.innerHeight
    let mx = W / 2, my = H / 2, rx = mx, ry = my

    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight }
    window.addEventListener('resize', resize)
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMove)

    // Cursor Trails
    const TCOUNT = 14, trails: { x: number; y: number }[] = Array(TCOUNT).fill(0).map(() => ({ x: mx, y: my }))
    const trailEls: HTMLDivElement[] = []
    for (let i = 0; i < TCOUNT; i++) {
      const el = document.createElement('div')
      const s = Math.max(0.5, 4 - i * 0.26)
      el.style.cssText = `position:fixed; pointer-events:none; z-index:9990; border-radius:50%; transform:translate(-50%,-50%); width:${s}px; height:${s}px; background:rgba(118,108,255,${(1 - i / TCOUNT) * 0.32});`
      document.body.appendChild(el); trailEls.push(el)
    }

    // Nodes (Restoring the interactive cluster from the previous successful version)
    const services = [
      { label: 'WordPress Dev', sub: 'Expert builds', color: [118, 108, 255], size: 50, icon: '⚡' },
      { label: 'E-Commerce', sub: 'Shopify & Woo', color: [167, 139, 250], size: 44, icon: '🛒' },
      { label: 'SEO & Speed', sub: 'Performance', color: [244, 114, 182], size: 40, icon: '🔍' },
      { label: 'UI/UX Design', sub: 'Modern UX', color: [34, 211, 238], size: 42, icon: '🎨' },
      { label: '24/7 Support', sub: 'Reliable help', color: [74, 222, 128], size: 38, icon: '🛡️' },
    ]

    let nodes = services.map((s, i) => {
      const angle = (i / services.length) * Math.PI * 2
      const radiusX = window.innerWidth * 0.18; const radiusY = window.innerHeight * 0.22
      const cx = window.innerWidth * 0.82; const cy = window.innerHeight * 0.5
      return {
        ...s, x: cx + Math.cos(angle) * radiusX, y: cy + Math.sin(angle) * radiusY,
        vx: 0, vy: 0, baseX: cx + Math.cos(angle) * radiusX, baseY: cy + Math.sin(angle) * radiusY,
        phase: Math.random() * Math.PI * 2, orbitR: 5 + Math.random() * 5, hover: 0
      }
    })

    const rips: { x: number; y: number; r: number; life: number }[] = []
    let lastR = 0
    const onMoveRip = () => { const now = Date.now(); if (now - lastR > 70) { rips.push({ x: mx, y: my, r: 0, life: 1 }); lastR = now } }
    window.addEventListener('mousemove', onMoveRip)

    let raf: number
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, W, H)

      // Grid
      const sp = 52, ox = (mx * 0.028) % sp, oy = (my * 0.028) % sp
      ctx.strokeStyle = 'rgba(118,108,255,0.035)'; ctx.lineWidth = 1
      for (let x = -sp + ox; x < W + sp; x += sp) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = -sp + oy; y < H + sp; y += sp) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // Nodes Physics
      nodes.forEach(n => {
        const dx = mx - n.x, dy = my - n.y, d = Math.sqrt(dx*dx + dy*dy)
        n.hover += (d < n.size + 15 ? 1 : -1) * 0.1; n.hover = Math.max(0, Math.min(1, n.hover))
        if (d < 140 && d > 0) { const f = (140 - d) / 140; n.vx -= (dx / d) * f * 1.5; n.vy -= (dy / d) * f * 1.5 }
        const tx = n.baseX + Math.cos(t * 0.0015 + n.phase) * n.orbitR
        const ty = n.baseY + Math.sin(t * 0.0015 + n.phase) * n.orbitR
        n.vx += (tx - n.x) * 0.02; n.vy += (ty - n.y) * 0.02; n.vx *= 0.85; n.vy *= 0.85; n.x += n.vx; n.y += n.vy

        const [r,g,b] = n.color; const sz = n.size + n.hover * 10
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, sz * 2.2)
        grad.addColorStop(0, `rgba(${r},${g},${b},${0.12 + n.hover * 0.2})`); grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath(); ctx.arc(n.x, n.y, sz * 2.2, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        ctx.beginPath(); ctx.arc(n.x, n.y, sz, 0, Math.PI * 2); ctx.strokeStyle = `rgba(${r},${g},${b},${0.4 + n.hover * 0.4})`; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.font = `${sz * 0.5}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = `rgba(${r},${g},${b},0.9)`; ctx.fillText(n.icon, n.x, n.y)
        if (n.hover > 0.1) {
          ctx.globalAlpha = n.hover; ctx.font = `800 13px var(--font-manrope)`; ctx.fillStyle = '#fff'; ctx.fillText(n.label, n.x, n.y + sz + 20)
          ctx.font = `700 10px var(--font-mono)`; ctx.fillStyle = `rgba(${r},${g},${b},0.8)`; ctx.fillText(n.sub, n.x, n.y + sz + 36); ctx.globalAlpha = 1
        }
      })

      // Ripples
      for (let i = rips.length - 1; i >= 0; i--) {
        const rp = rips[i]; rp.r += 1.8; rp.life -= 0.038
        if (rp.life <= 0) { rips.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(118,108,255,${rp.life * 0.1})`; ctx.stroke()
      }

      // Cursor
      if (cdotRef.current) { cdotRef.current.style.left = mx + 'px'; cdotRef.current.style.top = my + 'px' }
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13
      if (cringRef.current) { cringRef.current.style.left = rx + 'px'; cringRef.current.style.top = ry + 'px' }
      for (let i = 0; i < TCOUNT; i++) {
        const p = i === 0 ? { x: mx, y: my } : trails[i - 1]; trails[i].x += (p.x - trails[i].x) * 0.38; trails[i].y += (p.y - trails[i].y) * 0.38
        trailEls[i].style.left = trails[i].x + 'px'; trailEls[i].style.top = trails[i].y + 'px'
      }

      // Magnetic Characters
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
    raf = requestAnimationFrame(loop)
    document.body.style.cursor = 'none'

    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); window.removeEventListener('mousemove', onMoveRip); trailEls.forEach(el => document.body.removeChild(el)); document.body.style.cursor = 'auto'
    }
  }, [])

  const renderChar = (txt: string, isGradient = false) => {
    return [...txt].map((ch, i) => (
      <span key={i} className="char" style={{ display: 'inline-block', transition: 'transform .08s, color .15s', willChange: 'transform', ...(isGradient ? { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}) }}>
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ))
  }

  return (
    <section style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', background: '#050508', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Background & Custom Cursor ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div ref={cdotRef} style={{ position: 'fixed', zIndex: 9999, width: '6px', height: '6px', background: '#fff', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
        <div ref={cringRef} style={{ position: 'fixed', zIndex: 9999, width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.45)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', padding: '100px 32px 120px', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Content Block */}
        <div style={{ maxWidth: '820px', pointerEvents: 'all' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{ width: '24px', height: '2px', background: 'var(--grad)', borderRadius: '2px' }} />
              <span style={{ ...M, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', fontWeight: 700 }}>Professional Web Development Since 2017</span>
            </div>
          </motion.div>

          <div ref={headlineRef} style={{ marginBottom: '28px' }}>
            <h1 style={{ ...F, fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#fff', cursor: 'none' }}>
              <div>{renderChar('Professional')}</div>
              <div>{renderChar('WordPress, ')}{renderChar('Shopify')}</div>
              <div>{renderChar('& ')}{renderChar('WooCommerce')}</div>
              <div>{renderChar('Development', true)}</div>
            </h1>
          </div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ ...B, fontSize: '17px', lineHeight: 1.8, color: 'rgba(255,255,255,0.38)', maxWidth: '540px', marginBottom: '28px', fontWeight: 300 }}>
            Transform your business with custom e-commerce solutions that drive results. We've helped <strong style={{ color: '#fff', fontWeight: 500 }}>100+ businesses across the globe</strong> scale their online presence with expert development.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ ...B, fontSize: '14px', color: 'rgba(255,255,255,0.22)', marginBottom: '44px', fontStyle: 'italic' }}>
            Trusted by businesses in <span style={{ color: 'var(--primary)', fontStyle: 'normal' }}>USA</span>, <span style={{ color: 'var(--primary)', fontStyle: 'normal' }}>UAE</span>, and <span style={{ color: 'var(--primary)', fontStyle: 'normal' }}>Switzerland</span>.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '44px' }}>
            <Link href="/contact" className="btn btn-primary btn-lg" style={{ padding: '16px 36px' }}>Get Free Quote & Strategy Call</Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg" style={{ padding: '16px 36px', border: '1px solid var(--border-3)' }}>View Our Portfolio →</Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {['7+ Years of Excellence', '100+ Successful Projects', '24/7 Expert Support', '30-Day Money-Back Guarantee'].map(t => (
              <div key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '6px 16px', fontSize: '11px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.03em' }}>
                <span style={{ color: '#22c55e' }}>✓</span> {t}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer Ticker (Integrated into section flow) */}
      <div style={{ background: 'rgba(5,5,8,0.92)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 40s linear infinite' }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex' }}>
              {['WordPress Development', 'WooCommerce Stores', 'Shopify Development', 'SEO Strategy', 'Speed Optimization', '24/7 Support', 'UI/UX Design', 'Custom Web Apps'].map(text => (
                <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', padding: '0 40px', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', ...M, fontWeight: 700 }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (max-width: 1024px) {
          .container { padding-top: 100px !important; }
        }
      `}</style>
    </section>
  )
}
