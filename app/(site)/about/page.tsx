import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'
import ClutchWidget from '@/components/ui/ClutchWidget'
import AboutHeroSection from './AboutHeroSection'
import Reveal from '@/components/motion/Reveal'

export const metadata: Metadata = {
  title: 'About ARIOSETECH — Professional Web Development Since 2017',
  description: 'Meet the team behind 100+ successful web development projects. WordPress, WooCommerce, and Shopify specialists based in Lahore, Pakistan.',
}

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const

const ArrowSVG = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ValIcon1 = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const ValIcon2 = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const ValIcon3 = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const ValIcon4 = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />

      {/* Story */}
      <section className="section" style={{ overflow: 'visible' }}>
        <div className="container">
          <div className="g-2" style={{ gap: '80px', alignItems: 'start' }}>
            {/* Left - Sticky Story */}
            <div className="sr sticky-mobile-fix" style={{ position: 'sticky', top: '100px' }}>
              <p className="eyebrow">Our Story</p>
              <h2 style={{ ...hs, fontSize: 'clamp(2.2rem,4.5vw,3.2rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '28px' }}>
                Built from real <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>e-commerce experience.</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.85 }}>
                  Since 2017, we&apos;ve helped 100+ businesses across 40+ industries scale their online presence. From small fashion brands in Lahore to international B2B
                  distributors in Switzerland and the UAE — we&apos;ve seen what works and what doesn&apos;t.
                </p>
                <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.85 }}>
                  We don&apos;t dabble in everything. <strong style={{ color: '#fff' }}>WordPress, WooCommerce, and Shopify</strong> are all we do — and we do them
                  exceptionally well. Every project gets our full expertise, not a junior who googled it.
                </p>
                <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.85 }}>
                  Based in <strong style={{ color: '#fff' }}>Lahore, Pakistan</strong>, we serve clients globally across the USA, UAE, Switzerland, and beyond —
                  delivering world-class quality at honest prices.
                </p>
              </div>
            </div>

            {/* Right - Stats Grid */}
            <div className="g-2" style={{ gap: '16px' }}>
              {[
                { value: '100+', label: 'Projects Delivered' },
                { value: '7+', label: 'Years Experience' },
                { value: '40+', label: 'Industries Served' },
                { value: '5.0★', label: 'Clutch Rating' },
              ].map((s, i) => (
                <div key={s.label} className='card' style={{ padding: '40px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden', animationDelay: `${i * 0.1}s` }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)' }} />
                  <p style={{ ...hs, fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: '12px' }}>{s.value}</p>
                  <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{s.label}</p>
                </div>
              ))}
              
              {/* Extra content for right column to make it longer for sticky effect */}
              <div className="card" style={{ gridColumn: 'span 2', padding: '40px', background: 'var(--bg-3)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)' }} />
                <h3 style={{ ...hs, fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Our Mission</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.8 }}>
                  To bridge the gap between expensive Western agencies and low-quality freelance work. We provide high-end, secure, and scalable web solutions that help businesses thrive in the digital economy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--dark" style={{ overflow: 'visible' }}>
        <div className="container">
          <div className="g-2" style={{ gap: '80px', alignItems: 'start' }}>
            {/* Left - Sticky Header */}
            <div className="sr sticky-mobile-fix" style={{ position: 'sticky', top: '100px' }}>
              <p className="eyebrow">Our Values</p>
              <h2 style={{ ...hs, fontSize: 'clamp(2.2rem,4.5vw,3.2rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px' }}>
                What Sets <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Us Apart</span>
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '32px' }}>
                We believe in long-term relationships built on trust, transparency, and technical excellence.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Start a Partnership <ArrowSVG size={16} /></Link>
            </div>

            {/* Right - Horizontal Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {[
                { icon: <ValIcon1 />, title: 'Specialists Only', desc: 'We only work with WordPress, WooCommerce, and Shopify. This focus means deeper expertise and better results for you.' },
                { icon: <ValIcon2 />, title: 'Transparent Communication', desc: "No hidden fees, no surprises. You know exactly what you're getting, when you're getting it, and what it costs." },
                { icon: <ValIcon3 />, title: 'Speed Without Compromise', desc: 'We deliver fast because we\'ve done it before. Our team knows these platforms inside out — no learning on your dime.' },
                { icon: <ValIcon4 />, title: 'Long-term Partnership', desc: 'We don\'t disappear after launch. Ongoing support, maintenance, and growth — we\'re your long-term web partner.' }
              ].map((v, i) => (
                <div key={v.title} className='card card-hover' style={{ display: 'flex', gap: '24px', padding: '32px', position: 'relative', overflow: 'hidden', alignItems: 'flex-start', animationDelay: `${i * 0.1}s` }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)' }} />
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    {v.icon}
                  </div>
                  <div>
                    <h3 style={{ ...hs, fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{v.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.8 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Industries We Serve</p>
            <h2 style={{ ...hs, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              40+ Industries, One <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Expert Team</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            {['Fashion & Apparel', 'Sports Equipment', 'Beauty & Skincare', 'Fragrances & Perfumes', 'Educational Products', 'Promotional Products', 'Health & Wellness', 'Food & Beverage', 'Electronics', 'Jewelry', 'Home Décor', 'B2B Wholesale', 'SaaS Products', 'Professional Services', 'Real Estate', 'Healthcare', 'Travel & Tourism', 'Non-profits'].map(i => (
              <span key={i} className="card card-hover" style={{ fontSize: '13px', padding: '12px 24px', borderRadius: '14px', background: 'var(--bg-2)', border: '1px solid var(--border)', fontWeight: 600, color: 'var(--text-2)', transition: 'all 0.3s var(--ease)', cursor: 'default' }}>
                <span style={{ color: 'var(--primary)', marginRight: '8px', opacity: 0.7 }}>#</span>{i}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Clutch live review cards */}
      <section className="section section--dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '70%', height: '80%', background: 'radial-gradient(ellipse, rgba(118,108,255,0.08) 0%, transparent 65%)', pointerEvents: 'none', filter: 'blur(30px)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Client Reviews</p>
            <h2 style={{ ...hs, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>
              Trusted by Businesses <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Worldwide</span>
            </h2>
          </div>
          <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'var(--bg-3)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <ClutchWidget widgetType={2} height={400} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <h2 style={{ ...hs, fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '32px' }}>
            Ready to scale your <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>online presence?</span>
          </h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Schedule a Free Strategy Call <ArrowSVG size={16} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg">Browse Case Studies</Link>
          </div>
        </div>
      </section>
    </>
  )
}
