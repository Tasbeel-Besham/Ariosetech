'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ── Inline SVG icons ── */
const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const Check = ({ size = 9, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const Zap = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const Star = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
)

/* ── Animated counter ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const dur = 1400, t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1)
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val}{suffix}</span>
}

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
  stats?: { value: string | number; suffix?: string; label: string }[]
  badgeLeftValue?: string
  badgeLeftLabel?: string
  badgeRightValue?: string
  badgeRightLabel?: string
}

export default function InteractiveHeroSection({
  eyebrow        = 'Trusted by 100+ businesses worldwide',
  headline       = 'Professional WordPress, Shopify & WooCommerce Development Since 2017',
  subheadline    = 'Expert WordPress, Shopify & WooCommerce development — optimized for speed, conversions, and long-term scale.',
  ctaPrimaryLabel   = 'Get Free Strategy Call',
  ctaPrimaryHref    = '/contact',
  ctaSecondaryLabel = 'View Case Studies',
  ctaSecondaryHref  = '/portfolio',
  trust = '',
  stats: statsProp = [],
  badgeLeftValue  = '~30 Days',
  badgeLeftLabel  = 'Avg Delivery',
  badgeRightValue = '5.0 ★',
  badgeRightLabel = 'Clutch Rating',
}: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const

  const trustItems = trust
    ? trust.split(',').map(s => s.trim()).filter(Boolean)
    : ['7+ Years of Excellence', '100+ Projects Delivered', '24/7 Expert Support', '30-Day Guarantee']

  const DEFAULT_STATS = [
    { value: 100, suffix: '+', label: 'Projects Delivered' },
    { value: 7,   suffix: '+', label: 'Years of Excellence' },
    { value: 98,  suffix: '%', label: 'Client Satisfaction' },
    { value: 40,  suffix: '+', label: 'Industries Served' },
  ]
  const stats = statsProp.length ? statsProp.map(s => {
    const raw = String(s.value ?? '')
    const num = Number(raw.replace(/[^0-9.]/g, '')) || 0
    const suf = s.suffix ?? raw.replace(/[0-9.]/g, '').trim()
    return { value: num, suffix: suf, label: s.label }
  }) : DEFAULT_STATS

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const sScale  = useTransform(scrollYProgress, [0, 1], [1, 0.88])
  const sOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const sY       = useTransform(scrollYProgress, [0, 1], [0, -40])

  // ── INTERACTIVE CANVAS LOGIC ─────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d'); if (!ctx) return

    let W: number, H: number
    let mx = -2000, my = -2000 // Start off-screen

    const resize = () => {
      W = cv.width = cv.offsetWidth
      H = cv.height = cv.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(cv)

    const onMove = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect()
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
    }
    const onLeave = () => { mx = -2000; my = -2000 }
    
    cv.parentElement?.addEventListener('mousemove', onMove)
    cv.parentElement?.addEventListener('mouseleave', onLeave)

    const services = [
      { label: 'WordPress Dev', sub: 'Custom themes', color: [118, 108, 255], size: 48, icon: '⚡' },
      { label: 'E-Commerce', sub: 'Shopify & Woo', color: [167, 139, 250], size: 42, icon: '🛒' },
      { label: 'SEO & Speed', sub: 'Core Web Vitals', color: [244, 114, 182], size: 38, icon: '🔍' },
      { label: 'UI/UX Design', sub: 'Pixel-perfect', color: [34, 211, 238], size: 40, icon: '🎨' },
      { label: '24/7 Support', sub: 'Maintenance', color: [74, 222, 128], size: 36, icon: '🛡️' },
      { label: 'Web Apps', sub: 'Scalable builds', color: [251, 146, 60], size: 34, icon: '⚙️' },
    ]

    let nodes = services.map((s, i) => {
      const angle = (i / services.length) * Math.PI * 2
      const rx = W * 0.28, ry = H * 0.22
      const cx = W * 0.75, cy = H * 0.45
      return {
        ...s,
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
        vx: 0, vy: 0,
        baseX: cx + Math.cos(angle) * rx,
        baseY: cy + Math.sin(angle) * ry,
        phase: Math.random() * Math.PI * 2,
        glowPulse: Math.random() * Math.PI * 2,
        hover: 0,
        grabbed: false,
        orbitR: 4 + Math.random() * 5
      }
    })

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3, alpha: Math.random() * 0.3 + 0.05,
      color: [[118, 108, 255], [167, 139, 250], [255, 255, 255]][Math.floor(Math.random() * 3)],
    }))

    const ripples: any[] = []
    let lastRipple = 0
    const onMoveRipple = () => {
      const now = Date.now()
      if (now - lastRipple > 100 && mx > 0) {
        ripples.push({ x: mx, y: my, r: 0, life: 1 })
        lastRipple = now
      }
    }
    cv.parentElement?.addEventListener('mousemove', onMoveRipple)

    let raf: number
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      ctx.clearRect(0, 0, W, H)

      // Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]; rp.r += 2; rp.life -= 0.03
        if (rp.life <= 0) { ripples.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(118,108,255,${0.12 * rp.life})`; ctx.stroke()
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        const [r,g,b] = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`; ctx.fill()
      })

      // Connections & Nodes
      nodes.forEach((n, i) => {
        nodes.slice(i + 1).forEach(m => {
          const dx = n.x - m.x, dy = n.y - m.y, d = Math.sqrt(dx*dx + dy*dy)
          if (d < 200) {
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y)
            ctx.strokeStyle = `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${(1 - d/200) * 0.12})`; ctx.stroke()
          }
        })

        n.glowPulse += 0.02
        const dx = mx - n.x, dy = my - n.y, dist = Math.sqrt(dx*dx + dy*dy)
        const hovered = dist < n.size + 10
        n.hover += (hovered ? 1 : -1) * 0.08; n.hover = Math.max(0, Math.min(1, n.hover))

        const targetX = n.baseX + Math.cos(t * 0.001 * 0.5 + n.phase) * n.orbitR
        const targetY = n.baseY + Math.sin(t * 0.001 * 0.5 + n.phase) * n.orbitR
        if (dist < 140 && dist > 0) { const f = (140 - dist) / 140; n.vx -= (dx / dist) * f * 1.2; n.vy -= (dy / dist) * f * 1.2 }
        n.vx += (targetX - n.x) * 0.015; n.vy += (targetY - n.y) * 0.015
        n.vx *= 0.85; n.vy *= 0.85; n.x += n.vx; n.y += n.vy

        const [r,g,b] = n.color; const sz = n.size + n.hover * 8
        ctx.beginPath(); ctx.arc(n.x, n.y, sz, 0, Math.PI * 2); ctx.strokeStyle = `rgba(${r},${g},${b},${0.3 + n.hover * 0.4})`; ctx.stroke()
        ctx.font = `${sz * 0.5}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n.icon, n.x, n.y)
        if (n.hover > 0.1) {
          ctx.globalAlpha = n.hover; ctx.font = `700 12px var(--font-display)`; ctx.fillStyle = '#fff'; ctx.fillText(n.label, n.x, n.y + sz + 16); ctx.globalAlpha = 1
        }
      })
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      cv.parentElement?.removeEventListener('mousemove', onMove)
      cv.parentElement?.removeEventListener('mouseleave', onLeave)
      cv.parentElement?.removeEventListener('mousemove', onMoveRipple)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes hero-fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hero-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes badge-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        .hero-anim-1 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .hero-anim-2 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.18s both; }
        .hero-anim-3 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.30s both; }
        .hero-anim-4 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.42s both; }
        .hero-anim-5 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.52s both; }
        .hero-stats  { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.65s both; }
        .hero-badge-l { animation: hero-fade-in 0.6s ease 0.9s both, badge-float 5s ease-in-out 1.5s infinite; }
        .hero-badge-r { animation: hero-fade-in 0.6s ease 1.1s both, badge-float 5s ease-in-out 2s infinite; }
        
        @media (min-width: 1100px) { .hero-badge-l, .hero-badge-r { display: flex !important; } }
        @media (max-width: 600px) {
          #hero-interactive { padding: 40px 0 48px !important; }
          #hero-interactive [style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <motion.div style={{ scale: sScale, opacity: sOpacity, y: sY, originY: 0, position: 'relative', zIndex: 1 }}>
        <section
          ref={sectionRef}
          id="hero-interactive"
          style={{
            minHeight: '92vh',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderBottom: '1px solid var(--border)',
            position: 'relative', overflow: 'hidden',
            padding: '56px 0 64px',
            background: '#080810'
          }}
        >
          {/* ── Background Layer ── */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '-25%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '80%', background: 'radial-gradient(ellipse at top, rgba(118,108,255,0.12) 0%, transparent 62%)' }} />
          </div>

          {/* ── Floating badges (desktop) ── */}
          <div className="hero-badge-l" style={{ position: 'absolute', left: '5%', top: '28%', display: 'none', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 14, background: 'rgba(10,10,18,0.88)', backdropFilter: 'blur(20px)', border: '1px solid rgba(118,108,255,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.45)', zIndex: 3 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'rgba(251,191,36,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fbbf24' }}><Zap size={15} /></div>
            <div>
              <p style={{ ...F, fontSize:14, fontWeight:800, color:'#fff', lineHeight:1 }}>{badgeLeftValue}</p>
              <p style={{ ...M, fontSize:9, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>{badgeLeftLabel}</p>
            </div>
          </div>

          <div className="hero-badge-r" style={{ position: 'absolute', right: '5%', top: '28%', display: 'none', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 14, background: 'rgba(10,10,18,0.88)', backdropFilter: 'blur(20px)', border: '1px solid rgba(118,108,255,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.45)', zIndex: 3 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'rgba(118,108,255,0.14)', display:'flex', alignItems:'center', justifyContent:'center', color:'#766cff' }}><Star size={15} /></div>
            <div>
              <p style={{ ...F, fontSize:14, fontWeight:800, color:'#fff', lineHeight:1 }}>{badgeRightValue}</p>
              <p style={{ ...M, fontSize:9, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>{badgeRightLabel}</p>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="container" style={{ position:'relative', zIndex:1, maxWidth:820, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
            {/* Eyebrow */}
            <div className="hero-anim-1" style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'6px 20px 6px 10px', borderRadius:999, background:'rgba(118,108,255,0.08)', border:'1px solid rgba(118,108,255,0.20)', backdropFilter:'blur(12px)' }}>
                <span style={{ position:'relative', display:'flex', width:7, height:7 }}>
                  <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:'var(--primary)', opacity:0.5, animation:'pulse-ring 1.8s ease-out infinite' }} />
                  <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--primary)', display:'block', position:'relative' }} />
                </span>
                <span style={{ ...M, fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:'0.14em' }}>{eyebrow}</span>
              </div>
            </div>

            {/* H1 */}
            <h1 className="hero-anim-2" style={{ ...F, fontSize:'clamp(2.6rem, 5.4vw, 4rem)', fontWeight:900, lineHeight:1.06, letterSpacing:'-0.04em', color:'#fff', marginBottom:10 }}>
              {headline.split('Drive')[0]} Drive <br />
              <span style={{ background:'linear-gradient(135deg, #a78bfa 0%, #766cff 45%, #60a5fa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Real Business Growth
              </span>
            </h1>

            {/* Decorative line */}
            <div className="hero-anim-3" style={{ width:'100%', display:'flex', justifyContent:'center', marginBottom:28 }}>
              <div style={{ height:2, width:64, borderRadius:2, background:'linear-gradient(90deg, transparent, rgba(118,108,255,0.6), transparent)' }} />
            </div>

            {/* Subheadline */}
            <p className="hero-anim-3" style={{ fontSize:'clamp(15px, 1.9vw, 18px)', color:'rgba(255,255,255,0.52)', lineHeight:1.75, maxWidth:620, marginBottom:40 }}>
              {subheadline}
            </p>

            {/* CTAs */}
            <div className="hero-anim-4" style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center', marginBottom:44 }}>
              <Link href={ctaPrimaryHref} className="btn btn-primary btn-lg" style={{ background:'linear-gradient(135deg, #766cff 0%, #9b8fff 100%)', boxShadow:'0 8px 32px rgba(118,108,255,0.28),0 2px 8px rgba(0,0,0,0.25)', letterSpacing:'-0.01em', fontSize:15, padding:'14px 30px' }}>
                {ctaPrimaryLabel} <ArrowRight size={16} />
              </Link>
              <Link href={ctaSecondaryHref} style={{ fontSize:15, padding:'14px 30px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'rgba(255,255,255,0.7)', letterSpacing:'-0.01em', textDecoration:'none' }}>
                {ctaSecondaryLabel}
              </Link>
            </div>

            {/* Trust pills */}
            <div className="hero-anim-5" style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px 22px' }}>
              {trustItems.map(t => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:17, height:17, borderRadius:'50%', background:'rgba(118,108,255,0.08)', border:'1px solid rgba(118,108,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)' }}><Check size={9} /></div>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.42)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Stat bar ── */}
          <div className="container hero-stats" style={{ position:'relative', zIndex:1, marginTop:64, maxWidth:820 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', borderRadius:18, background:'rgba(255,255,255,0.022)', border:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(24px)', overflow:'hidden' }}>
              {stats.map((s, i) => (
                <div key={s.label} style={{ padding:'26px 16px', textAlign:'center', borderRight:i<3?'1px solid rgba(255,255,255,0.055)':'none' }}>
                  <p style={{ ...F, fontSize:'clamp(1.7rem, 2.8vw, 2.3rem)', fontWeight:900, lineHeight:1, marginBottom:7, background:'linear-gradient(135deg, #c4b5fd, #766cff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p style={{ ...M, fontSize:9, color:'rgba(255,255,255,0.32)', textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:700 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </>
  )
}
