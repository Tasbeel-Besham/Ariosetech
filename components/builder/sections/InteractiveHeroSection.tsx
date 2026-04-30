'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

/* ── Types ── */
type Tok = { t: 'com' | 'kw' | 'fn' | 'attr' | 'str' | 'v'; v: string }

const CODE_LINES: Tok[][] = [
  [{ t: 'com', v: '// Ariosetech WooCommerce Store — 2025' }],
  [],
  [{ t: 'kw', v: 'function ' }, { t: 'fn', v: 'ariose_boost_performance' }, { t: 'v', v: '() {' }],
  [{ t: 'v', v: '  ' }, { t: 'attr', v: '$config' }, { t: 'v', v: ' = [' }, { t: 'str', v: "'speed'" }, { t: 'v', v: ', ' }, { t: 'str', v: "'seo'" }, { t: 'v', v: ', ' }, { t: 'str', v: "'conversions'" }, { t: 'v', v: '];' }],
  [{ t: 'v', v: '  ' }, { t: 'kw', v: 'foreach' }, { t: 'v', v: ' (' }, { t: 'attr', v: '$config' }, { t: 'v', v: ' as ' }, { t: 'attr', v: '$module' }, { t: 'v', v: ') {' }],
  [{ t: 'v', v: '    ' }, { t: 'fn', v: 'load_module' }, { t: 'v', v: '(' }, { t: 'attr', v: '$module' }, { t: 'v', v: ', ' }, { t: 'str', v: "'priority=high'" }, { t: 'v', v: ');' }],
  [{ t: 'v', v: '  }' }],
  [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'✓ Performance Optimized'" }, { t: 'v', v: ';' }],
  [{ t: 'v', v: '}' }],
  [],
  [{ t: 'com', v: '// Result: 98 PageSpeed · 150% more conversions' }],
  [{ t: 'fn', v: 'add_action' }, { t: 'v', v: '(' }, { t: 'str', v: "'woocommerce_loaded'" }, { t: 'v', v: ', ' }, { t: 'fn', v: "'ariose_boost_performance'"}, { t: 'v', v: ');' }],
]

const COLOR_MAP = {
  com: 'rgba(255,255,255,.22)', kw: '#60a5fa', fn: '#fbbf24', attr: '#a78bfa', str: '#4ade80', v: 'rgba(255,255,255,.55)'
}

export default function InteractiveHeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cdotRef = useRef<HTMLDivElement>(null)
  const cringRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  
  const [typedLines, setTypedLines] = useState<Tok[][]>([])
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  const F = { fontFamily: 'var(--font-manrope), var(--font-display), sans-serif' } as const
  const B = { fontFamily: 'var(--font-body), sans-serif' } as const
  const M = { fontFamily: 'var(--font-mono), monospace' } as const

  /* ── Typing Animation ── */
  useEffect(() => {
    let timer: NodeJS.Timeout
    const tick = () => {
      if (lineIdx >= CODE_LINES.length) {
        timer = setTimeout(() => { setTypedLines([]); setLineIdx(0); setCharIdx(0) }, 2800)
        return
      }
      const currentTokens = CODE_LINES[lineIdx]
      const lineLen = currentTokens.reduce((acc, tok) => acc + tok.v.length, 0)
      if (charIdx === 0) setTypedLines(prev => [...prev, []])
      if (charIdx < lineLen) {
        setCharIdx(prev => prev + 1)
        timer = setTimeout(tick, 16 + Math.random() * 24)
      } else {
        setLineIdx(prev => prev + 1); setCharIdx(0)
        timer = setTimeout(tick, (lineIdx + 1) % 3 === 0 ? 260 : 80)
      }
    }
    timer = setTimeout(tick, 800)
    return () => clearTimeout(timer)
  }, [lineIdx, charIdx])

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
      const s = Math.max(0.5, 4 - i * 0.26)
      el.style.cssText = `position:fixed; pointer-events:none; z-index:9990; border-radius:50%; transform:translate(-50%,-50%); width:${s}px; height:${s}px; background:rgba(118,108,255,${(1 - i / TCOUNT) * 0.32});`
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
      c: [[118, 108, 255], [167, 139, 250], [244, 114, 182], [255, 255, 255]][Math.floor(Math.random() * 4)]
    }))

    const orbs = [
      { x: 0.35, y: 0.45, r: 340, c: [118, 108, 255], a: 0.045, vx: 0.00015, vy: 0.00012 },
      { x: 0.72, y: 0.32, r: 220, c: [167, 139, 250], a: 0.035, vx: -0.0002, vy: 0.00015 },
      { x: 0.15, y: 0.65, r: 180, c: [244, 114, 182], a: 0.028, vx: 0.00018, vy: -0.0002 }
    ]

    let raf: number
    const loop = () => {
      raf = requestAnimationFrame(loop)
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
    document.body.style.cursor = 'none'
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); window.removeEventListener('mousemove', onMoveRip); trailEls.forEach(el => document.body.removeChild(el)); document.body.style.cursor = 'auto' }
  }, [])

  const renderChar = (txt: string, isGradient = false) => {
    return [...txt].map((ch, i) => (
      <span key={i} className="char" style={{ display: 'inline-block', transition: 'transform .08s, color .15s', willChange: 'transform', ...(isGradient ? { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}) }}>
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ))
  }

  return (
    <section style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', background: '#05050e', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Fixed Interaction Layer ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div ref={cdotRef} style={{ position: 'fixed', zIndex: 9999, width: '6px', height: '6px', background: '#fff', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
        <div ref={cringRef} style={{ position: 'fixed', zIndex: 9999, width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.45)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', alignItems: 'center', gap: '4rem', padding: '120px 32px 140px', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Left Side */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ width: '24px', height: '2px', background: 'var(--grad)', borderRadius: '2px' }} />
            <span style={{ ...M, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', fontWeight: 700 }}>Professional Web Development Since 2017</span>
          </div>

          <div ref={headlineRef} style={{ marginBottom: '28px' }}>
            <h1 style={{ ...F, fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#fff', cursor: 'none' }}>
              <div>{renderChar('Professional')}</div>
              <div>{renderChar('WordPress, ')}{renderChar('Shopify')}</div>
              <div>{renderChar('& ')}{renderChar('WooCommerce')}</div>
              <div>{renderChar('Development', true)}</div>
            </h1>
          </div>

          <p style={{ ...B, fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.38)', maxWidth: '500px', marginBottom: '24px', fontWeight: 300 }}>
            Transform your business with custom e-commerce solutions that drive results. We've helped <strong style={{ color: '#fff', fontWeight: 500 }}>100+ businesses across the globe</strong> scale with expert development and performance.
          </p>

          <p style={{ ...B, fontSize: '14px', color: 'rgba(255,255,255,0.22)', marginBottom: '40px', fontStyle: 'italic' }}>
            Trusted by businesses in <span style={{ color: 'var(--primary)', fontStyle: 'normal' }}>USA</span>, <span style={{ color: 'var(--primary)', fontStyle: 'normal' }}>UAE</span>, and <span style={{ color: 'var(--primary)', fontStyle: 'normal' }}>Switzerland</span>.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '48px' }}>
            <Link href="/contact" className="btn btn-primary btn-lg" style={{ padding: '16px 36px' }}>Get Free Quote & Strategy Call</Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg" style={{ padding: '16px 36px', border: '1px solid var(--border-3)' }}>View Our Portfolio →</Link>
          </div>

          <div style={{ display: 'flex', gap: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[{v:'100+',l:'Projects'},{v:'7+',l:'Years'},{v:'150%',l:'Conv. Lift'},{v:'98%',l:'Success'}].map(s=>(
              <div key={s.l}>
                <div style={{ ...F, fontSize: '28px', fontWeight: 800, color: '#fff' }}>{s.v}</div>
                <div style={{ ...M, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginTop: '4px', fontWeight: 700 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Filled Space */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'rgba(13,13,26,0.92)', border: '1px solid rgba(118,108,255,0.18)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', width: '100%', minHeight: '340px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', ...M }}>ariosetech-store / functions.php</div>
              <div style={{ fontSize: '10px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', ...M }}>LIVE 🚀</div>
            </div>
            <div style={{ padding: '24px', ...M, fontSize: '13px', lineHeight: 1.9, color: 'rgba(255,255,255,0.55)' }}>
              {typedLines.map((toks, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.12)', minWidth: '20px', textAlign: 'right' }}>{i + 1}</span>
                  <span>
                    {toks.map((t, ti) => (<span key={ti} style={{ color: COLOR_MAP[t.t] }}>{t.v}</span>))}
                    {i === typedLines.length - 1 && <span style={{ display: 'inline-block', width: '2px', height: '12px', background: 'var(--primary)', animation: 'cblink .9s infinite', marginLeft: '2px' }} />}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              {ico:'⚡',v:'98',l:'Speed',c1:'#5b6fff',c2:'#a78bfa'},
              {ico:'⭐',v:'5.0',l:'Clutch',c1:'#f472b6',c2:'#fb923c'},
              {ico:'🔒',v:'30d',l:'Security',c1:'#22c55e',c2:'#06b6d4'}
            ].map(m=>(
              <div key={m.l} style={{ background: 'rgba(13,13,26,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{m.ico}</div>
                <div style={{ ...F, fontWeight: 800, fontSize: '22px', color: '#fff' }}>{m.val}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.lbl}</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${m.c1}, ${m.c2})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticker at the bottom of the SECTION, not fixed to window */}
      <div style={{ background: 'rgba(5,5,14,0.88)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 40s linear infinite' }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex' }}>
              {['WordPress Development', 'WooCommerce Stores', 'Shopify Development', 'SEO Strategy', 'Speed Boost', '24/7 Support'].map(text => (
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
        @keyframes cblink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @media (max-width: 1024px) {
          .container { grid-template-columns: 1fr !important; padding-top: 100px !important; }
          .container > div:last-child { display: none; }
        }
      `}</style>
    </section>
  )
}
