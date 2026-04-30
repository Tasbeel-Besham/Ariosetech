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

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <p className="eyebrow">Our Story</p>
                <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                  Built from real e-commerce experience.
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '16px' }}>
                  Since 2017, we&apos;ve helped 100+ businesses across 40+ industries scale their online presence. From small fashion brands in Lahore to international B2B
                  distributors in Switzerland and the UAE — we&apos;ve seen what works and what doesn&apos;t.
                </p>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '16px' }}>
                  We don&apos;t dabble in everything. <strong style={{ color: 'var(--text)' }}>WordPress, WooCommerce, and Shopify</strong> are all we do — and we do them
                  exceptionally well. Every project gets our full expertise, not a junior who googled it.
                </p>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.85 }}>
                  Based in <strong style={{ color: 'var(--text)' }}>Lahore, Pakistan</strong>, we serve clients globally across the USA, UAE, Switzerland, and beyond —
                  delivering world-class quality at honest prices.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.06}>
              <div className="g-2" style={{ gap: '16px' }}>
                {[
                  { value: '100+', label: 'Projects Delivered', color: 'var(--primary)' },
                  { value: '7+', label: 'Years Experience', color: 'var(--primary)' },
                  { value: '40+', label: 'Industries Served', color: 'var(--green)' },
                  { value: '5.0★', label: 'Clutch Rating', color: 'var(--amber)' },
                ].map(({ value, label, color }) => (
                  <div key={label} className='card' style={{ padding: '28px', textAlign: 'center' }}>
                    <p style={{ ...hs, fontSize: '2rem', fontWeight: 800, color, lineHeight: 1, marginBottom: '8px' }}>{value}</p>
                    <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--dark">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Our Values</p>
            <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '48px' }}>
              What Sets Us Apart
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '🎯', title: 'Specialists Only', desc: 'We only work with WordPress, WooCommerce, and Shopify. This focus means deeper expertise and better results for you.' },
              { icon: '💬', title: 'Transparent Communication', desc: 'No hidden fees, no surprises. You know exactly what you\'re getting, when you\'re getting it, and what it costs.' },
              { icon: '⚡', title: 'Speed Without Compromise', desc: 'We deliver fast because we\'ve done it before. Our team knows these platforms inside out — no learning on your dime.' },
              { icon: '🤝', title: 'Long-term Partnership', desc: 'We don\'t disappear after launch. Ongoing support, maintenance, and growth — we\'re your long-term web partner.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className='card' style={{ background: 'var(--bg-3)', padding: '28px' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'12px', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)', marginBottom:'16px', fontSize:'22px' }}>{icon}</div>
                <h3 style={{ ...hs, fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.75 }}>{desc}</p>
              </div>
            ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Clients we&apos;ve served */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Industries We Serve</p>
            <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '48px' }}>
              40+ Industries, One Expert Team
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['Fashion & Apparel', 'Sports Equipment', 'Beauty & Skincare', 'Fragrances & Perfumes', 'Educational Products', 'Promotional Products', 'Health & Wellness', 'Food & Beverage', 'Electronics', 'Jewelry', 'Home Décor', 'B2B Wholesale', 'SaaS Products', 'Professional Services', 'Real Estate', 'Healthcare', 'Travel & Tourism', 'Non-profits'].map(i => (
                <span key={i} className="tag" style={{ fontSize: '12px', padding: '6px 14px' }}>{i}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Clutch live review cards */}
      <section className="section section--dark">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p className="eyebrow" style={{ justifyContent: 'center' }}>Verified Reviews</p>
              <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>
                What clients say on Clutch
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <ClutchWidget widgetType={4} height="auto" reviews="449566,412231,406618,406326,405095" />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(79,110,247,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <h2 style={{ ...hs, fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '20px' }}>
              Ready to work with specialists?
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto 36px' }}>
              Get a free consultation and see why 100+ businesses chose ARIOSETECH.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary btn-lg" style={{ ...hs, fontWeight: 700 }}>Start a Project <ArrowRight size={16} /></Link>
              <Link href="/portfolio" className="btn btn-outline btn-lg" style={{ ...hs, fontWeight: 600 }}>View Our Work</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
