'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ── Inline SVG icons (no lucide dependency) ── */
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

/* ─── Animated counter ─── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const duration = 1400
        const startTime = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setVal(Math.round(ease * to))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])

  return <span ref={ref}>{val}{suffix}</span>
}

type Props = {
  eyebrow?: string
  headline?: string
  subheadline?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  trust?: string
}

export default function HeroSection({
  eyebrow = 'Trusted by 100+ businesses worldwide',
  subheadline = 'Expert WordPress, Shopify & WooCommerce development — optimized for speed, conversions, and long-term scale.',
  ctaPrimaryLabel = 'Get Free Strategy Call',
  ctaPrimaryHref = '/contact',
  ctaSecondaryLabel = 'View Case Studies',
  ctaSecondaryHref = '/portfolio',
  trust = '',
}: Props) {
  const trustItems = trust
    ? trust.split(',').map(s => s.trim()).filter(Boolean)
    : ['7+ Years of Excellence', '100+ Projects Delivered', '24/7 Expert Support', '30-Day Guarantee']

  const stats = [
    { value: 100, suffix: '+', label: 'Projects Delivered' },
    { value: 7,   suffix: '+', label: 'Years of Excellence' },
    { value: 98,  suffix: '%', label: 'Client Satisfaction' },
    { value: 40,  suffix: '+', label: 'Industries Served' },
  ]

  return (
    <>
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes hero-line-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes badge-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
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
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .hero-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(118,108,255,0.38), 0 4px 16px rgba(0,0,0,0.3); }
        .hero-cta-primary:hover::after { opacity: 1; }
        .hero-cta-secondary {
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), border-color 0.2s, color 0.2s;
        }
        .hero-cta-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(118,108,255,0.55) !important;
          color: #fff !important;
        }
        .hero-stat-item:hover { border-color: rgba(118,108,255,0.25) !important; }
      `}</style>

      <section
        id="hero"
        style={{
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
          /* Tight padding — header is sticky so no extra offset needed */
          padding: '56px 0 64px',
        }}
      >
        {/* ── Background layers ── */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, black 20%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, black 20%, transparent 100%)',
          }} />
          {/* Purple glow — center top */}
          <div style={{
            position: 'absolute', top: '-25%', left: '50%', transform: 'translateX(-50%)',
            width: '80%', maxWidth: 1000, height: '80%',
            background: 'radial-gradient(ellipse at top, rgba(118,108,255,0.18) 0%, transparent 62%)',
          }} />
          {/* Subtle warm accent — bottom right */}
          <div style={{
            position: 'absolute', bottom: '-10%', right: '-8%',
            width: '45%', height: '55%',
            background: 'radial-gradient(ellipse, rgba(96,165,250,0.05) 0%, transparent 70%)',
          }} />
        </div>

        {/* ── Floating stat badges (desktop) ── */}
        <div className="hero-badge-l" style={{
          position: 'absolute', left: '5%', top: '28%',
          display: 'none', // overridden via media-like logic below
          alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 14,
          background: 'rgba(10,10,18,0.88)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(118,108,255,0.18)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          zIndex: 3,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Zap size={15} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1 }}>~30 Days</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>Avg delivery</p>
          </div>
        </div>

        <div className="hero-badge-r" style={{
          position: 'absolute', right: '5%', top: '28%',
          display: 'none',
          alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 14,
          background: 'rgba(10,10,18,0.88)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(118,108,255,0.18)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          zIndex: 3,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(118,108,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#766cff' }}>
            <Star size={15} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1 }}>5.0 ★</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>Clutch Rating</p>
          </div>
        </div>

        {/* ── Main content ── */}
        <div
          className="container"
          style={{
            position: 'relative', zIndex: 1,
            maxWidth: 820,
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}
        >
          {/* Eyebrow */}
          <div className="hero-anim-1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '6px 20px 6px 10px', borderRadius: 999,
              background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.20)',
              backdropFilter: 'blur(12px)',
            }}>
              <span style={{ position: 'relative', display: 'flex', width: 7, height: 7 }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--primary)', opacity: 0.5, animation: 'pulse-ring 1.8s ease-out infinite' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', display: 'block', position: 'relative' }} />
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                {eyebrow}
              </span>
            </div>
          </div>

          {/* H1 */}
          <h1
            className="hero-anim-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.6rem, 5.4vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: '-0.04em',
              color: '#fff',
              marginBottom: 10,
            }}
          >
            We Build Websites That Drive{' '}
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #766cff 45%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Real Business Growth
            </span>
          </h1>

          {/* Decorative line under title */}
          <div className="hero-anim-3" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{
              height: 2, width: 64, borderRadius: 2,
              background: 'linear-gradient(90deg, transparent, rgba(118,108,255,0.6), transparent)',
            }} />
          </div>

          {/* Subheadline */}
          <p
            className="hero-anim-3"
            style={{
              fontSize: 'clamp(15px, 1.9vw, 18px)',
              color: 'rgba(255,255,255,0.52)',
              lineHeight: 1.75,
              maxWidth: 620,
              marginBottom: 40,
            }}
          >
            {subheadline}
          </p>

          {/* CTAs */}
          <div className="hero-anim-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 44 }}>
            <Link
              href={ctaPrimaryHref}
              className="btn btn-primary btn-lg hero-cta-primary"
              style={{
                background: 'linear-gradient(135deg, #766cff 0%, #9b8fff 100%)',
                boxShadow: '0 8px 32px rgba(118,108,255,0.28), 0 2px 8px rgba(0,0,0,0.25)',
                letterSpacing: '-0.01em', fontSize: 15, padding: '14px 30px',
              }}
            >
              {ctaPrimaryLabel} <ArrowRight size={16} />
            </Link>
            <Link
              href={ctaSecondaryHref}
              className="btn hero-cta-secondary"
              style={{
                fontSize: 15, padding: '14px 30px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--r-lg)',
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '-0.01em',
              }}
            >
              {ctaSecondaryLabel}
            </Link>
          </div>

          {/* Trust pills */}
          <div className="hero-anim-5" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 22px' }}>
            {trustItems.map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 17, height: 17, borderRadius: '50%',
                  background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  color: 'var(--primary)',
                }}>
                  <Check size={9} />
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.42)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stat bar ── */}
        <div
          className="container hero-stats"
          style={{
            position: 'relative', zIndex: 1,
            marginTop: 64,
            maxWidth: 820,
          }}
        >
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            borderRadius: 18,
            background: 'rgba(255,255,255,0.022)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            overflow: 'hidden',
          }}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="hero-stat-item"
                style={{
                  padding: '26px 16px',
                  textAlign: 'center',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.055)' : 'none',
                  transition: 'border-color 0.25s',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)',
                  fontWeight: 900, lineHeight: 1, marginBottom: 7,
                  background: 'linear-gradient(135deg, #c4b5fd, #766cff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scroll cue ── */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1,
          animation: 'hero-fade-in 0.6s ease 1.4s both',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.22em' }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)' }} />
        </div>
      </section>

      {/* Show badges on desktop via CSS */}
      <style>{`
        @media (min-width: 1100px) {
          .hero-badge-l, .hero-badge-r { display: flex !important; }
        }
        @media (max-width: 600px) {
          #hero { padding: 40px 0 48px !important; }
          #hero [style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </>
  )
}
