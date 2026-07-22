import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'
import ReviewsBadge from '@/components/ui/ReviewsBadge'
import ClutchWidget from '@/components/ui/ClutchWidget'
import InteractiveHeroSection from '@/components/sections/InteractiveHeroSection'
import CtaSection from '@/components/sections/CtaSection'
import SetFooterCta from '@/components/layout/SetFooterCta'
import Reveal from '@/components/motion/Reveal'

export const metadata: Metadata = {
  title: 'About ARIOSETECH, Professional Web Development Since 2017',
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
      <SetFooterCta
        headline="Want a team that treats your site like their own?"
        desc="Since 2017 we've helped 100+ businesses build, fix, and grow. Let's talk about yours."
        primaryLabel="Work With Us"
        primaryHref="/contact"
      />
      <InteractiveHeroSection 
        eyebrow="About Us"
        headline={'Specialists, Not Generalists.\nConsider It Solved.'}
        subheadline="ARIOSETECH was founded with one mission: give growing businesses access to the same quality of web development that enterprise brands enjoy, at honest, transparent prices."
        ctaPrimaryLabel="Work With Us"
        ctaPrimaryHref="/contact"
        ctaSecondaryLabel="View Our Services"
        ctaSecondaryHref="/services"
      />

      {/* Story */}
      <section className="section overflow-visible">
        <div className="container">
          <div className="g-2 gap-[80px] items-start">
            {/* Left - Sticky Story */}
            <div className="sr sticky-mobile-fix sticky top-[100px]">
              <p className="eyebrow">Our Story</p>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.04em] mb-[28px]">
                Built from real <span className="bg-brand-gradient bg-clip-text text-transparent">e-commerce experience.</span>
              </h2>
              <div className="flex flex-col gap-[20px]">
                <p className="text-[16px] text-text-2 leading-[1.85]">
                  Since 2017, we've helped 100+ businesses across 40+ industries scale their online presence. From small fashion brands in Lahore to international B2B
                  distributors in Switzerland and the UAE, we've seen what works and what doesn't.
                </p>
                <p className="text-[16px] text-text-2 leading-[1.85]">
                  We don't dabble in everything. <strong className="text-white">WordPress, WooCommerce, and Shopify</strong> are all we do, and we do them
                  exceptionally well. Every project gets our full expertise, not a junior who googled it.
                </p>
                <p className="text-[16px] text-text-2 leading-[1.85]">
                  Based in <strong className="text-white">Lahore, Pakistan</strong>, we serve clients globally across the USA, UAE, Switzerland, and beyond  - 
                  delivering world-class quality at honest prices.
                </p>
              </div>
            </div>

            {/* Right - Stats Grid */}
            <div className="g-2 gap-[16px]">
              {[
                { value: '100+', label: 'Projects Delivered' },
                { value: '7+', label: 'Years Experience' },
                { value: '40+', label: 'Industries Served' },
                { value: '5.0★', label: 'Clutch Rating' },
              ].map((s, i) => (
                <div key={s.label} className="card p-[40px_32px] text-center relative overflow-hidden" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gradient" />
                  <p className="font-display text-[2.5rem] font-extrabold text-primary leading-none mb-[12px]">{s.value}</p>
                  <p className="font-mono text-[10px] text-text-3 uppercase tracking-[0.12em] font-bold">{s.label}</p>
                </div>
              ))}
              
              {/* Extra content for right column to make it longer for sticky effect */}
              <div className="card col-span-2 p-[40px] bg-bg-3 border border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gradient" />
                <h3 className="font-display text-[20px] font-extrabold text-white mb-[16px]">Our Mission</h3>
                <p className="text-[15px] text-text-3 leading-[1.8]">
                  To bridge the gap between expensive Western agencies and low-quality freelance work. We provide high-end, secure, and scalable web solutions that help businesses thrive in the digital economy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--dark overflow-visible">
        <div className="container">
          <div className="g-2 gap-[80px] items-start">
            {/* Left - Sticky Header */}
            <div className="sr sticky-mobile-fix sticky top-[100px]">
              <p className="eyebrow">Our Values</p>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.04em] mb-[24px]">
                What Sets <span className="bg-brand-gradient bg-clip-text text-transparent">Us Apart</span>
              </h2>
              <p className="text-[16px] text-text-2 leading-[1.85] mb-[32px]">
                We believe in long-term relationships built on trust, transparency, and technical excellence.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Start a Partnership <ArrowSVG size={16} /></Link>
            </div>

            {/* Right - Horizontal Cards */}
            <div className="grid grid-cols-1 gap-[16px]">
              {[
                { icon: <ValIcon1 />, title: 'Specialists Only', desc: 'We only work with WordPress, WooCommerce, and Shopify. This focus means deeper expertise and better results for you.' },
                { icon: <ValIcon2 />, title: 'Transparent Communication', desc: "No hidden fees, no surprises. You know exactly what you're getting, when you're getting it, and what it costs." },
                { icon: <ValIcon3 />, title: 'Speed Without Compromise', desc: 'We deliver fast because we\'ve done it before. Our team knows these platforms inside out, no learning on your dime.' },
                { icon: <ValIcon4 />, title: 'Long-term Partnership', desc: 'We don\'t disappear after launch. Ongoing support, maintenance, and growth, we\'re your long-term web partner.' }
              ].map((v, i) => (
                <div key={v.title} className="card card-hover flex gap-[24px] p-[32px] relative overflow-hidden items-start" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gradient" />
                  <div className="w-[56px] h-[56px] rounded-[14px] bg-primary-soft border border-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center text-primary shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-[18px] font-extrabold text-white mb-[8px]">{v.title}</h3>
                    <p className="text-[14px] text-text-3 leading-[1.8]">{v.desc}</p>
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
          <div className="text-center mb-[56px]">
            <p className="eyebrow justify-center">Industries We Serve</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">
              40+ Industries, One <span className="bg-brand-gradient bg-clip-text text-transparent">Expert Team</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-[12px] justify-center max-w-[1000px] mx-auto">
            {['Fashion & Apparel', 'Sports Equipment', 'Beauty & Skincare', 'Fragrances & Perfumes', 'Educational Products', 'Promotional Products', 'Health & Wellness', 'Food & Beverage', 'Electronics', 'Jewelry', 'Home Décor', 'B2B Wholesale', 'SaaS Products', 'Professional Services', 'Real Estate', 'Healthcare', 'Travel & Tourism', 'Non-profits'].map(i => (
              <span key={i} className="card card-hover text-[13px] py-[12px] px-[24px] rounded-[14px] bg-bg-2 border border-border font-semibold text-text-2 transition-all duration-300 ease-[var(--ease)] cursor-default">
                <span className="text-primary mr-[8px] opacity-70">#</span>{i}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Client reviews — real verified data (Clutch 4.9/16 + Google 5.0) */}
      <section className="section section--dark relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] pointer-events-none blur-[30px] bg-[radial-gradient(ellipse,rgba(var(--primary-rgb),0.08)_0%,transparent_65%)]" />
        <div className="container relative z-1">
          <div className="text-center mb-[48px]">
            <p className="eyebrow justify-center">Client Reviews</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.04em] mb-8">
              Trusted by Businesses <span className="bg-brand-gradient bg-clip-text text-transparent">Worldwide</span>
            </h2>
            <div className="flex justify-center"><ReviewsBadge /></div>
          </div>
          <div className="g-3 gap-20 max-w-[1100px] mx-auto">
            {[
              { quote: 'ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth.', name: 'Dr. Fred Sahafi', role: 'Founder of Genovie', initials: 'FS' },
              { quote: 'Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom WooCommerce solution that perfectly fits our business model.', name: 'Michael Chen', role: 'CEO of GeoMag World', initials: 'MC' },
              { quote: 'Fast, reliable, and cost-effective. ARIOSETECH helped us launch our wholesale platform ahead of schedule and under budget.', name: 'Muhammad Hannan', role: 'Director of Janya.pk', initials: 'MH' },
            ].map((t, i) => (
              <div key={i} className="card p-32 flex flex-col bg-bg-3 border border-border rounded-[20px]">
                <div className="flex gap-1 mb-5">
                  {[0,1,2,3,4].map(s => (
                    <svg key={s} width="15" height="15" viewBox="0 0 14 14" fill="var(--primary)"><path d="M7 1l1.5 4.5H13L9.5 8l1.3 4L7 10l-3.8 2 1.3-4L1 5.5h4.5z" /></svg>
                  ))}
                </div>
                <p className="text-gray-2 leading-loose italic mb-7 flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-[14px] pt-5 border-t border-subtle">
                  <div className="w-11 h-11 rounded-xl bg-grad flex items-center justify-center font-display text-sm font-extrabold text-white shrink-0">{t.initials}</div>
                  <div>
                    <p className="font-display text-sm font-bold text-white">{t.name}</p>
                    <p className="font-mono text-gray-3 uppercase tracking-wider font-semibold text-10">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="https://clutch.co/profile/ariosetech" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 font-mono text-11 uppercase tracking-widest font-semibold" style={{ color: 'var(--primary)' }}>
              Read all 16 verified reviews on Clutch →
            </a>
          </div>

          {/* Live Clutch widget. The static badges + cards above always render,
              so if Clutch's script is blocked or slow this section still shows
              real proof instead of an empty box. */}
          <div className="max-w-[1000px] mx-auto mt-12 rounded-[20px] overflow-hidden">
            <ClutchWidget
              widgetType={12}
              height={375}
              reviews="449566,412231,406618,406326,405095,379000,373080,373075,372945,372930,372228,372128"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaSection
        eyebrow="Let's Build Together"
        headline={'Ready to scale your\nonline presence?'}
        subheadline="Join 100+ businesses that trusted us with their web development. Professional results, honest pricing, and support that doesn't disappear after launch."
        ctaLabel="Schedule a Free Strategy Call"
        ctaHref="/contact"
        secondaryLabel="Browse Case Studies"
        secondaryHref="/portfolio"
      />
    </>
  )
}
