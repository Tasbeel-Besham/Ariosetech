'use client'

import { useEffect, useRef, useState } from 'react'
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
const Star = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
)
const Zap = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
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

/* ══ Interactive Particle Canvas ══ */
interface Particle {
  x: number; y: number
  ox: number; oy: number   // origin
  vx: number; vy: number
  r: number; alpha: number
  color: string
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const particles = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const COLORS = ['rgba(118,108,255,', 'rgba(160,148,255,', 'rgba(96,165,250,', 'rgba(255,255,255,']

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      // Re-seed particles on resize
      particles.current = Array.from({ length: 110 }, () => {
        const x = Math.random() * W
        const y = Math.random() * H
        return {
          x, y, ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.5 + 0.15,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }
      })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }
    canvas.parentElement?.addEventListener('mousemove', onMove)
    canvas.parentElement?.addEventListener('mouseleave', onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const { x: mx, y: my } = mouse.current

      for (const p of particles.current) {
        // Mouse repulsion
        const dx = p.x - mx, dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const REPEL = 90
        if (dist < REPEL) {
          const force = (REPEL - dist) / REPEL
          p.vx += (dx / dist) * force * 2.2
          p.vy += (dy / dist) * force * 2.2
        }

        // Spring back to origin
        p.vx += (p.ox - p.x) * 0.018
        p.vy += (p.oy - p.y) * 0.018

        // Damping
        p.vx *= 0.88
        p.vy *= 0.88

        p.x += p.vx
        p.y += p.vy

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + p.alpha + ')'
        ctx.fill()

        // Glow on hover proximity
        if (dist < REPEL) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = p.color + ((REPEL - dist) / REPEL * 0.18) + ')'
          ctx.fill()
        }
      }

      // Draw connections between nearby particles
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i], b = particles.current[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 72) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(118,108,255,${(1 - d / 72) * 0.12})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      canvas.parentElement?.removeEventListener('mousemove', onMove)
      canvas.parentElement?.removeEventListener('mouseleave', onLeave)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

/* ══ Types ══ */
type StatItem = { value: string | number; suffix?: string; label: string }
type Props = {
  eyebrow?: string
  headline?: string
  subheadline?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  trust?: string
  stats?: StatItem[]
  badgeLeftValue?: string
  badgeLeftLabel?: string
  badgeRightValue?: string
  badgeRightLabel?: string
}

/* ══ HeroSection ══ */
export default function HeroSection({
  eyebrow        = 'Trusted by 100+ businesses worldwide',
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
}: Props) {
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

  /* Scroll parallax */
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.88])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const y       = useTransform(scrollYProgress, [0, 1], [0, -40])

  return (
    <>
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes badge-float {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-6px); }
        }
        .hero-anim-1 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .hero-anim-2 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.18s both; }
        .hero-anim-3 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.30s both; }
        .hero-anim-4 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.42s both; }
        .hero-anim-5 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.52s both; }
        .hero-stats  { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.65s both; }
        .hero-badge-l { animation: hero-fade-in 0.6s ease 0.9s both, badge-float 5s ease-in-out 1.5s infinite; }
        .hero-badge-r { animation: hero-fade-in 0.6s ease 1.1s both, badge-float 5s ease-in-out 2s infinite; }
        .hero-cta-primary {
          position: relative; overflow: hidden;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s ease;
        }
        .hero-cta-primary::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.14) 0%,transparent 60%);
          opacity:0; transition:opacity 0.2s;
        }
        .hero-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(118,108,255,0.38),0 4px 16px rgba(0,0,0,0.3); }
        .hero-cta-primary:hover::after { opacity:1; }
        .hero-cta-secondary { transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), border-color 0.2s, color 0.2s; }
        .hero-cta-secondary:hover { transform:translateY(-2px); border-color:rgba(118,108,255,0.55)!important; color:#fff!important; }
        .hero-stat-item:hover { border-color: rgba(118,108,255,0.25)!important; }
      `}</style>

      {/* ── Parallax wrapper — scroll shrinks & fades the whole hero ── */}
      <motion.div style={{ scale, opacity, y, originY: 0, position: 'relative', zIndex: 1 }}>
        <section
          ref={sectionRef}
          id="hero"
          style={{
            minHeight: '92vh',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderBottom: '1px solid var(--border)',
            position: 'relative', overflow: 'hidden',
            padding: '56px 0 64px',
          }}
        >
          {/* ── Background: particles + static glows ── */}
          <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
            {/* Interactive particle canvas */}
            <ParticleCanvas />

            {/* Purple glow — center top */}
            <div style={{
              position: 'absolute', top: '-25%', left: '50%', transform: 'translateX(-50%)',
              width: '80%', maxWidth: 1000, height: '80%',
              background: 'radial-gradient(ellipse at top, rgba(118,108,255,0.16) 0%, transparent 62%)',
              pointerEvents: 'none',
            }} />
            {/* Subtle warm accent — bottom right */}
            <div style={{
              position: 'absolute', bottom: '-10%', right: '-8%',
              width: '45%', height: '55%',
              background: 'radial-gradient(ellipse, rgba(96,165,250,0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* ── Floating badges (desktop) ── */}
          <div className="hero-badge-l" style={{
            position: 'absolute', left: '5%', top: '28%',
            display: 'none', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 14,
            background: 'rgba(10,10,18,0.88)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(118,108,255,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)', zIndex: 3,
          }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'rgba(251,191,36,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fbbf24' }}>
              <Zap size={15} />
            </div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:800, color:'#fff', lineHeight:1 }}>{badgeLeftValue}</p>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>{badgeLeftLabel}</p>
            </div>
          </div>

          <div className="hero-badge-r" style={{
            position: 'absolute', right: '5%', top: '28%',
            display: 'none', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 14,
            background: 'rgba(10,10,18,0.88)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(118,108,255,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)', zIndex: 3,
          }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'rgba(118,108,255,0.14)', display:'flex', alignItems:'center', justifyContent:'center', color:'#766cff' }}>
              <Star size={15} />
            </div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:800, color:'#fff', lineHeight:1 }}>{badgeRightValue}</p>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>{badgeRightLabel}</p>
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
                <span style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:'0.14em' }}>
                  {eyebrow}
                </span>
              </div>
            </div>

            {/* H1 */}
            <h1 className="hero-anim-2" style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.6rem, 5.4vw, 4rem)', fontWeight:900, lineHeight:1.06, letterSpacing:'-0.04em', color:'#fff', marginBottom:10 }}>
              We Build Websites That Drive{' '}
              <br />
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
              <Link href={ctaPrimaryHref} className="btn btn-primary btn-lg hero-cta-primary"
                style={{ background:'linear-gradient(135deg, #766cff 0%, #9b8fff 100%)', boxShadow:'0 8px 32px rgba(118,108,255,0.28),0 2px 8px rgba(0,0,0,0.25)', letterSpacing:'-0.01em', fontSize:15, padding:'14px 30px' }}>
                {ctaPrimaryLabel} <ArrowRight size={16} />
              </Link>
              <Link href={ctaSecondaryHref} className="btn hero-cta-secondary"
                style={{ fontSize:15, padding:'14px 30px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'var(--r-lg)', color:'rgba(255,255,255,0.7)', letterSpacing:'-0.01em' }}>
                {ctaSecondaryLabel}
              </Link>
            </div>

            {/* Trust pills */}
            <div className="hero-anim-5" style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px 22px' }}>
              {trustItems.map(t => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:17, height:17, borderRadius:'50%', background:'rgba(118,108,255,0.08)', border:'1px solid rgba(118,108,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--primary)' }}>
                    <Check size={9} />
                  </div>
                  <span style={{ fontFamily:'var(--font-body)', fontSize:13, color:'rgba(255,255,255,0.42)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Stat bar ── */}
          <div className="container hero-stats" style={{ position:'relative', zIndex:1, marginTop:64, maxWidth:820 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', borderRadius:18, background:'rgba(255,255,255,0.022)', border:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(24px)', overflow:'hidden' }}>
              {stats.map((s, i) => (
                <div key={s.label} className="hero-stat-item" style={{ padding:'26px 16px', textAlign:'center', borderRight:i<3?'1px solid rgba(255,255,255,0.055)':'none', transition:'border-color 0.25s' }}>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.7rem, 2.8vw, 2.3rem)', fontWeight:900, lineHeight:1, marginBottom:7, background:'linear-gradient(135deg, #c4b5fd, #766cff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.32)', textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:700 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>

      {/* Badges + responsive CSS */}
      <style>{`
        @media (min-width: 1100px) { .hero-badge-l, .hero-badge-r { display: flex !important; } }
        @media (max-width: 600px) {
          #hero { padding: 40px 0 48px !important; }
          #hero [style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </>
  )
}
