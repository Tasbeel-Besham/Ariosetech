'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import ClutchWidget from '@/components/ui/ClutchWidget'
import InteractiveHeroSection from '@/components/sections/InteractiveHeroSection'
import ServicesAccordionSection from '@/components/sections/ServicesAccordionSection'
import ApproachSection from '@/components/sections/ApproachSection'
import SchemaMarkup from '@/components/ui/SchemaMarkup'
import { IconBox, CheckSVG, ArrowSVG, ChevSVG } from '@/components/ui/IconBox'
const StarSVG = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--primary)">
    <path d="M7 1l1.5 4.5H13L9.5 8l1.3 4L7 10l-3.8 2 1.3-4L1 5.5h4.5z"/>
  </svg>
)

/* ── Content — verbatim from Google Doc ─────────────────────── */

const CLIENT_LOGOS = [
  'The Kapra','Dr. Scents','Janya.pk','GeoMag World','Genovie',
  'WYOX Sports','Snap Glam Spa','CTV Promo','US Bidding Estimating',
  'CMA Digital','Zoom PC Hire','Ocean Tech BPO','Staffing Ocean',
  'BGMG Cosmetics','Accident Law','Fabric Wholesale',
]

const SERVICES = [
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>, title:'WordPress Development', headline:'Build Powerful, Scalable Websites',
    desc:'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.',
    features:['Custom Development','Speed Optimization','Maintenance & Support','Migration Services'], price:'$799', href:'/services/wordpress' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>, title:'WooCommerce Development', headline:'Launch Your Dream E-commerce Store',
    desc:'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.',
    features:['Store Setup & Customization','Payment Gateway Integration','Multi-vendor Solutions','Performance Optimization'], price:'$1,299', href:'/services/woocommerce' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>, title:'Shopify Development', headline:'Scale Your Business with Shopify',
    desc:'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.',
    features:['Custom Store Development','Shopify Plus Solutions','App Integration','Conversion Optimization'], price:'$999', href:'/services/shopify' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>, title:'SEO Services', headline:'Rank Higher, Get Found Faster',
    desc:'Business-first SEO built for real growth. From technical fixes to local SEO and content strategy, stronger search presence that drives leads.',
    features:['Website SEO','Local SEO','Technical SEO','SEO Content Strategy'], price:'Custom', href:'/services/seo' },
]

const WHY_US = [
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, title:'Cost-Effective Excellence', subhead:'Save 60% Without Compromising Quality',
    desc:'Get premium web development at a fraction of US agency costs. Professional results, affordable pricing, transparent communication.' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>, title:'Lightning-Fast Delivery', subhead:'From Concept to Launch in 30 Days',
    desc:'Our streamlined process and dedicated team ensure rapid turnaround without cutting corners. Most projects completed ahead of schedule.' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>, title:'Professional Support', subhead:'24/7 Expert Assistance When You Need It',
    desc:'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included.' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>, title:'Proven Results', subhead:'Track Record of Growing Businesses',
    desc:'Our clients see average 150% increase in conversions and 40% improvement in site speed. Real results, measurable impact.' },
]

const PORTFOLIO_STATIC = [
  { _id:'1', slug:'thekapra-woocommerce', title:'The Kapra', client:'E-commerce Fashion Store', platform:'Custom WooCommerce', result:'300%', resultLabel:'Increase in online sales', quote:'ARIOSETECH transformed our vision into reality with custom code solutions.' },
  { _id:'2', slug:'drscents-woocommerce', title:'Dr. Scents', client:'International Perfume Online Store', platform:'Multi-site WooCommerce', result:'32', resultLabel:'Countries launched in under 4 months', quote:'Incredible speed and quality. They delivered beyond our expectations.' },
  { _id:'3', slug:'wyox-shopify', title:'WYOX Sports', client:'USA-Based Sports Equipment', platform:'Shopify + Custom Solutions', result:'250%', resultLabel:'Business growth', quote:'Professional, reliable, and always available when we need them.' },
]

const TESTIMONIALS = [
  { name:'Dr. Fred Sahafi', role:'Founder of Genovie', initials:'FS', quote:'ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth.' },
  { name:'Michael Chen', role:'CEO of GeoMag World', initials:'MC', quote:'Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom WooCommerce solution that perfectly fits our business model.' },
  { name:'Muhammad Hannan', role:'Director of Janya.pk', initials:'MH', quote:'Fast, reliable, and cost-effective. ARIOSETECH helped us launch our wholesale platform on Shopify ahead of schedule and under budget.' },
]

const IMPACT_METRICS = [
  { value: '150%', label: 'Avg Conversion Lift', desc: 'Our tailored e-commerce strategies and optimized UX consistently drive 150%+ conversion improvements for clients.' },
  { value: '98%',  label: 'Client Satisfaction', desc: 'Every project is delivered with near-perfect precision, on time, on spec, and fully aligned with your business goals.' },
  { value: '40%',  label: 'Site Speed Gain',     desc: 'Performance-first builds mean faster stores, better SEO rankings, and higher revenue from the same traffic.' },
]

const HOW_IT_WORKS = [
  { n:'01', title:'Discovery & Strategy',   sub:'Understand Your Vision',    desc:'We kick off with a deep-dive consultation to understand your business goals, target audience, tech stack, and growth plans, so every decision is rooted in strategy.' },
  { n:'02', title:'Planning & Design',      sub:'Blueprint for Success',     desc:'Detailed project roadmaps, wireframes, and pixel-perfect design mockups that align with your brand identity and maximize conversion at every touchpoint.' },
  { n:'03', title:'Development',            sub:'Bringing Ideas to Life',    desc:'Expert WordPress, Shopify, or WooCommerce development using clean code, reusable components, and scalable architecture built to grow with your business.' },
  { n:'04', title:'Testing & Optimization', sub:'Ensuring Perfection',       desc:'Rigorous cross-device QA, speed optimization via Core Web Vitals, security hardening, and SEO validation, nothing ships until it\'s flawless.' },
  { n:'05', title:'Launch & Scale',         sub:'Your Success, Our Priority', desc:'A smooth go-live, comprehensive handover training, and 30 days of free post-launch support. After that, flexible monthly plans keep your site at peak performance.' },
]

const PROCESS = [
  { n:'01', title:'Discovery & Strategy', sub:'Understand Your Vision', desc:'We start with a comprehensive consultation to understand your business goals, target audience, and technical requirements.', time:'1-2 days' },
  { n:'02', title:'Planning & Design', sub:'Blueprint for Success', desc:'Detailed project planning, wireframing, and design mockups that align with your brand and conversion goals.', time:'3-5 days' },
  { n:'03', title:'Development', sub:'Bringing Ideas to Life', desc:'Expert development using best practices, clean code, and scalable architecture that grows with your business.', time:'15-20 days' },
  { n:'04', title:'Testing & Optimization', sub:'Ensuring Perfection', desc:'Rigorous testing across devices, speed optimization, and security checks before launch.', time:'3-5 days' },
  { n:'05', title:'Launch & Support', sub:"Your Success, Our Priority", desc:'Smooth launch with comprehensive training and ongoing support to ensure continuous success.', time:'Ongoing' },
]

const AUDIT_ITEMS = [
  'Performance bottleneck analysis','SEO issues & keyword opportunities',
  'Conversion barrier identification','Security vulnerability check',
  'Mobile experience assessment','Detailed action plan, no obligation',
]

const FAQS = [
  { q:'How long does a WordPress website take?', a:'Most WordPress websites are completed within 2-4 weeks, depending on complexity and requirements. Complex projects may take 4-6 weeks.' },
  { q:'What is included in your maintenance plans?', a:'Our maintenance plans include regular updates, security monitoring, performance optimization, backup management, and priority support. Plans start at $79/month.' },
  { q:'Do you offer a money-back guarantee?', a:"Yes. We offer a 30-day money-back guarantee on all our development projects. If you're not satisfied, we'll refund you in full." },
  { q:'Can you work with my existing WordPress site?', a:'Absolutely. We work with existing WordPress sites for redesigns, migrations, speed optimization, security fixes, and feature additions.' },
  { q:'Do you offer ongoing support after launch?', a:'Yes. Every project includes 30 days of free post-launch support. After that, we offer flexible monthly maintenance plans starting at $79/month.' },
  { q:'Can you migrate my existing store to Shopify or WooCommerce?', a:'Yes! We provide complete migration services from all major e-commerce platforms including Shopify, WooCommerce, Magento, BigCommerce, and custom solutions.' },
]

const APPROACH_DATA = [
  { n:'01', title:'COST-EFFECTIVE', sub:'Save 60% Without Compromising Quality', desc:'Premium web development at a fraction of US agency costs. Professional results, transparent pricing, zero compromise on quality.' },
  { n:'02', title:'TRANSPARENT', sub:'Open Communication at Every Step', desc:'We share project progress, insights, and feedback in real-time so you always know exactly where your investment stands.' },
  { n:'03', title:'RELIABLE', sub:'Consistently Delivered. Always On-Time.', desc:'100+ projects delivered on time and within budget. Our clients come back because our track record speaks for itself.' },
  { n:'04', title:'SCALABLE', sub:'Built to Grow With Your Business', desc:'Every site we build is architected for scale, whether you launch small or enterprise-level, our code grows seamlessly with your business.' },
  { n:'05', title:'SUPPORTED', sub:'24/7 Expert Assistance, Always On', desc:'Round-the-clock support across time zones. Emergency fixes, proactive monitoring, and regular maintenance included in every plan.' },
]

type BlogItem      = { _id:string; slug:string; title:string; excerpt:string; category:string; date:string; readTime:number }
type PortfolioItem = { _id:string; slug:string; title:string; client:string; category:string; summary:string; results:{label:string;value:string}[]; stack:string[]; featured:boolean }

interface WhyUsItem {
  icon: React.ReactNode;
  title: string;
  subhead: string;
  desc: string;
}

interface ImpactMetric {
  value: string;
  label: string;
  desc: string;
}

interface Step {
  n: string;
  title: string;
  sub: string;
  desc: string;
}

interface ProcessStep {
  n: string;
  title: string;
  sub: string;
  desc: string;
  time: string;
}

interface FAQItem {
  q: string;
  a: string;
}

interface Testimonial {
  name: string;
  role: string;
  initials: string;
  quote: string;
}

export default function HomeClient({ blogs, portfolio }: { blogs:BlogItem[]; portfolio:PortfolioItem[] }) {

  const displayPortfolio = portfolio.length > 0
    ? portfolio.slice(0,3).map((p,i) => ({
        _id:p._id, slug:p.slug, title:p.title, client:p.client,
        platform:p.category,
        result:p.results[0]?.value || PORTFOLIO_STATIC[i]?.result || '',
        resultLabel:p.results[0]?.label || PORTFOLIO_STATIC[i]?.resultLabel || '',
        quote:PORTFOLIO_STATIC[i]?.quote || '',
      }))
    : PORTFOLIO_STATIC

  return (
    <>
      <SchemaMarkup
        type="Organization"
        pageUrl="/"
        pageName="Ariosetech"
        pageDescription="Ariosetech is a premium web development agency specializing in WordPress, Shopify, and WooCommerce development for businesses."
        faqs={FAQS}
      />
      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <InteractiveHeroSection />



      {/* ══ CLIENT LOGOS MARQUEE ══════════════════════════════════════ */}
      <div className="bg-bg-3 border-b border-border py-5 overflow-hidden">
        <div className="flex items-center gap-4">
          <p className="font-mono text-[9px] text-text-3 uppercase tracking-[0.14em] shrink-0 pl-8 whitespace-nowrap font-bold">Trusted by 100+ businesses</p>
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-[100px] bg-gradient-to-r from-bg-3 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-[100px] bg-gradient-to-l from-bg-3 to-transparent z-10 pointer-events-none" />
            <div className="flex gap-2.5 animate-[marquee_40s_linear_infinite] w-max">
              {[...CLIENT_LOGOS,...CLIENT_LOGOS].map((name,i) => (
                <span key={i} className="font-mono text-[11px] font-semibold text-text-3 py-1.5 px-4 rounded-full bg-white/5 border border-border whitespace-nowrap">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ SERVICES TABS ══════════════════════════════════════════════ */}
      <ServicesAccordionSection 
        eyebrow="What We Offer"
        headline="Comprehensive Web Development Solutions for Your Business Growth"
        intro="We specialize in custom WordPress, Shopify, and WooCommerce development - delivering high-performance websites that scale with your business."
      />

      {/* ══ WHY CHOOSE US ══════════════════════════════════════════ */}
      <section className="section overflow-visible">
        <div className="container">
          <div className="g-2 gap-20 max-md:gap-8 items-start">

            {/* LEFT, sticky */}
            <div className="sticky-mobile-fix sticky top-[88px]">
              <p className="eyebrow sr">Why Choose Us</p>
              <h2 className="sr font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-tight mb-5">
                Why 100+ Businesses Trust{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">ARIOSETECH</span>
                {' '}for Their Success
              </h2>
              <p className="text-[15px] text-text-2 leading-[1.85] mb-8">
                We combine world-class expertise with transparent pricing and a genuine commitment to your success. Not just code, business growth.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg sr">Start a Project <ArrowSVG size={16} /></Link>
            </div>

            {/* RIGHT, scrollable vertical cards */}
            <div className="grid grid-cols-1 gap-4">
              {WHY_US.map((b: WhyUsItem, i: number) => (
                <div key={b.title} className="sr card card-hover relative overflow-hidden flex gap-6 p-8 items-start" style={{ animationDelay:`${i*0.08}s` }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gradient" />
                  
                  {/* Icon Box */}
                  <IconBox size={56} radius={14}>
                    {b.icon}
                  </IconBox>

                  {/* Content */}
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-white mb-2 tracking-tight">{b.title}</h3>
                    <p className="font-display text-[11px] font-bold text-primary mb-3 uppercase tracking-wider">{b.subhead}</p>
                    <p className="text-sm text-text-3 leading-[1.8]">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ IMPACT QUANTIFIED ══════════════════════════════════════ */}
      <section className="section section--dark relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] pointer-events-none blur-[30px] bg-[radial-gradient(ellipse,rgba(var(--primary-rgb),0.09)_0%,transparent_65%)]" />
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <p className="eyebrow sr justify-center">Results That Matter</p>
            <h2 className="sr font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">
              The Impact,{' '}<span className="bg-brand-gradient bg-clip-text text-transparent">Quantified</span>
            </h2>
            <p className="sr text-base text-text-2 leading-[1.8] max-w-[520px] mx-auto mt-4">
              Numbers don&apos;t lie. Here&apos;s what working with ARIOSETECH actually delivers for your business.
            </p>
          </div>

          <div className="g-3 gap-6">
            {IMPACT_METRICS.map((m: ImpactMetric, i: number) => (
              <div
                key={m.label}
                className="sr relative overflow-hidden transition-all duration-300 bg-bg-2/70 border border-border rounded-3xl p-11 backdrop-blur-md hover:-translate-y-2 hover:border-primary/45 hover:shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(var(--primary-rgb),0.08)]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Subtle gradient top-bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gradient" />
                {/* Inner glow */}
                <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] pointer-events-none bg-[radial-gradient(ellipse,rgba(var(--primary-rgb),0.12)_0%,transparent_70%)]" />

                <p className="font-display text-[clamp(3rem,5vw,4.5rem)] font-extrabold leading-none mb-3 bg-brand-gradient bg-clip-text text-transparent">
                  {m.value}
                </p>
                <p className="font-display text-base font-bold text-white mb-3.5">{m.label}</p>
                <p className="text-sm text-text-2 leading-[1.8]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section className="section relative overflow-hidden">
        {/* Vertical connector line */}
        <div className="hidden-mobile absolute left-1/2 top-[160px] bottom-[80px] w-[1px] pointer-events-none bg-[linear-gradient(to_bottom,transparent,rgba(var(--primary-rgb),0.20)_20%,rgba(var(--primary-rgb),0.20)_80%,transparent)]" />
        <div className="container relative z-10">
          <div className="text-center mb-[72px] max-md:mb-10">
            <p className="eyebrow sr justify-center">Our Process</p>
            <h2 className="sr font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">
              How It Works
            </h2>
            <p className="sr text-base text-text-2 leading-[1.8] max-w-[480px] mx-auto mt-4">
              From setup to scale, a proven 5-step process that takes you from idea to a live, high-performing site.
            </p>
          </div>

          <div className="how-it-works-grid flex flex-col gap-8 max-w-[900px] mx-auto">
            {HOW_IT_WORKS.map((step: Step, i: number) => {
              const isRight = i % 2 !== 0
              return (
                <div
                  key={step.n}
                  className="sr how-step-row grid grid-cols-[1fr_80px_1fr] items-center gap-0"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Left slot */}
                  <div className={isRight ? "how-step__empty hidden-mobile" : "how-step__card"}>
                    {!isRight && (
                      <div className="relative overflow-hidden bg-bg-2 border border-border rounded-[20px] py-8 px-9 transition-all duration-300 hover:border-primary/35 hover:-translate-x-1.5">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gradient opacity-50" />
                        <p className="font-display text-[clamp(3rem,4vw,3.8rem)] font-extrabold text-primary/15 leading-none mb-4 select-none">{step.n}</p>
                        <p className="font-display text-[17px] font-extrabold text-white mb-1.5">{step.title}</p>
                        <p className="text-xs text-primary font-semibold mb-3 uppercase tracking-wider">{step.sub}</p>
                        <p className="text-sm text-text-2 leading-[1.8]">{step.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Centre connector dot */}
                  <div className="how-step__dot hidden-mobile flex flex-col items-center gap-0">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border-2 border-primary/35 flex items-center justify-center shrink-0">
                      <span className="font-display text-xs font-extrabold text-primary">{step.n}</span>
                    </div>
                  </div>

                  {/* Right slot */}
                  <div className={!isRight ? "how-step__empty hidden-mobile" : "how-step__card"}>
                    {isRight && (
                      <div className="relative overflow-hidden bg-bg-2 border border-border rounded-[20px] py-8 px-9 transition-all duration-300 hover:border-primary/35 hover:translate-x-1.5">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gradient" />
                        <p className="font-display text-[clamp(3rem,4vw,3.8rem)] font-extrabold text-primary/15 leading-none mb-4 select-none">{step.n}</p>
                        <p className="font-display text-[17px] font-extrabold text-white mb-1.5">{step.title}</p>
                        <p className="text-xs text-primary font-semibold mb-3 uppercase tracking-wider">{step.sub}</p>
                        <p className="text-sm text-text-2 leading-[1.8]">{step.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ OUR APPROACH ════════════════════════════════════════════ */}
      <ApproachSection items={APPROACH_DATA} />

      {/* ══ PORTFOLIO ═══════════════════════════════════════════════ */}
      <section className="section section--dark">
        <div className="container">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-5">
            <div>
              <p className="eyebrow sr">Our Work</p>
              <h2 className="sr font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">
                Success Stories That Speak for Themselves
              </h2>
              <p className="sr text-base text-text-2 leading-[1.8] mt-3.5 max-w-[560px]">
                Discover how we&apos;ve transformed businesses across industries with custom web solutions that drive growth and maximize ROI.
              </p>
            </div>
            <Link href="/portfolio" className="btn btn-outline btn-lg">Explore All Projects <ArrowSVG size={15} /></Link>
          </div>

          <div className="g-3 gap-5">
            {displayPortfolio.map((p,i) => (
              <Link key={p._id} href={`/portfolio/${p.slug}`} className="sr group flex flex-col no-underline bg-bg-3 border border-border rounded-[20px] overflow-hidden transition-all duration-300 hover:border-primary/35 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(0,0,0,0.55)]" style={{ animationDelay:`${i*0.08}s` }}>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gradient z-10" />
                {/* Image preview (scroll on hover) */}
                <div className="h-[190px] overflow-hidden relative border-b border-border">
                  <div
                    data-hp-img
                    className="absolute inset-0 bg-cover bg-top transform transition-transform duration-[1200ms] ease-in-out will-change-transform group-hover:-translate-y-[18%] bg-[radial-gradient(ellipse_60%_60%_at_30%_30%,rgba(var(--primary-rgb),0.22)_0%,rgba(var(--primary-rgb),0)_55%),linear-gradient(145deg,rgba(15,15,26,1)_0%,rgba(5,5,8,1)_100%)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/95 to-bg/0" />
                  <div className="absolute bottom-3.5 left-4 right-4 flex justify-between items-center gap-2.5">
                    <span className="font-mono text-[9px] text-white/70 uppercase tracking-[0.14em] font-bold">
                      Hover to preview
                    </span>
                    <span className="font-mono text-[9px] text-primary bg-primary/10 border border-primary/20 py-[3px] px-2.5 rounded-full uppercase tracking-wider font-extrabold">
                      {p.platform}
                    </span>
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider mb-2">{p.client}</p>
                  <h3 className="font-display text-[22px] font-extrabold text-white mb-3.5">{p.title}</h3>
                  <p className="text-[13px] text-text-3 leading-[1.75] italic flex-1 mb-5">&ldquo;{p.quote}&rdquo;</p>
                  <div className="flex items-baseline gap-2.5 pt-[18px] border-t border-border">
                    <p className="font-display text-[2.2rem] font-extrabold text-primary leading-none">{p.result}</p>
                    <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider font-bold">{p.resultLabel}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-5">
            <div>
              <p className="eyebrow sr">Client Reviews</p>
              <h2 className="sr font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">
                What Our Clients Say About Working With Us
              </h2>
            </div>
            <div className="sr"><ClutchWidget widgetType={7} height={65} /></div>
          </div>

          <div className="g-3 gap-5 mb-10">
            {TESTIMONIALS.map((t: Testimonial, i: number) => (
              <div key={t.name} className="card sr p-8 flex flex-col" style={{ animationDelay:`${i*0.08}s` }}>
                <div className="flex gap-[3px] mb-5">
                  {[0,1,2,3,4].map(s => <StarSVG key={s} />)}
                </div>
                <p className="text-[15px] text-text-2 leading-[1.85] italic mb-7 flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3.5 pt-5 border-t border-border">
                  <div className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center font-display text-sm font-extrabold text-white shrink-0">{t.initials}</div>
                  <div>
                    <p className="font-display text-sm font-bold text-white">{t.name}</p>
                    <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider font-semibold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live carousel */}
          <div className="rounded-2xl overflow-hidden border border-border">
            <ClutchWidget widgetType={12} height={375} reviews="449566,412231,406618,406326,405095,379000,373080,373075,372945,372930,372228,372128" />
          </div>
        </div>
      </section>

      {/* ══ PROCESS ════════════════════════════════════════════════ */}
      <section className="section section--dark">
        <div className="container">
          <div className="text-center mb-[60px]">
            <p className="eyebrow sr justify-center">How We Work</p>
            <h2 className="sr font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">
              Your Success Journey in 5 Simple Steps
            </h2>
          </div>

          {/* Horizontal steps with large numbers */}
          <div className="process-grid grid grid-cols-5 border-t border-border pt-10">
            {PROCESS.map(({ n, title, sub, desc, time }: ProcessStep, i: number) => (
              <div key={n} className={`sr process-item ${i<4 ? 'border-r border-border pr-7' : 'pr-0'}`} style={{ animationDelay:`${i*0.07}s` }}>
                <p className="font-display text-[clamp(3.5rem,5vw,5rem)] font-extrabold text-primary/15 leading-none mb-4 select-none">{n}</p>
                <p className="font-display text-[15px] font-bold text-white mb-1.5">{title}</p>
                <p className="text-xs text-primary font-semibold mb-2.5">{sub}</p>
                <p className="text-xs text-text-3 leading-[1.8] mb-3.5">{desc}</p>
                <span className="tag">{time}</span>
              </div>
            ))}
          </div>
          <style>{`
            @media (max-width: 1024px) {
              .process-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 40px 20px; }
              .process-item { border-right: none !important; padding-right: 0 !important; }
            }
            @media (max-width: 768px) {
              .how-step-row { grid-template-columns: 1fr !important; }
              .process-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ══ FREE AUDIT ════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="audit-card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-[28px] p-[clamp(40px,6vw,72px)] grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div className="min-w-0">
              <p className="eyebrow">Free Audit</p>
              <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-[1.05] tracking-tight mb-4">
                Get Your Free Website Performance Audit
              </h2>
              <p className="font-display text-[17px] font-semibold text-text-2 mb-3">
                Discover what&apos;s holding your website back from peak performance.
              </p>
              <p className="text-[15px] text-text-3 leading-[1.8] mb-3.5">
                Find out exactly how to improve your site&apos;s speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.
              </p>
              <p className="font-mono text-[11px] text-text-3 italic">No spam, ever. Detailed report delivered within 24 hours.</p>
            </div>
            <div className="flex flex-col gap-3 min-w-0">
              {AUDIT_ITEMS.map(item => (
                <div key={item} className="flex items-center gap-4 min-w-0">
                  <IconBox size={32} radius={10}>
                    <CheckSVG size={14} />
                  </IconBox>
                  <span className="text-[15px] text-text-2 font-medium min-w-0">{item}</span>
                </div>
              ))}
              <Link href="/contact" className="btn btn-primary btn-lg mt-2.5 justify-center">
                Get My Free Audit Report <ArrowSVG size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BLOG ════════════════════════════════════════════════════ */}
      {blogs.length > 0 && (
        <section className="section section--dark">
          <div className="container">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-5">
              <div>
                <p className="eyebrow sr">Knowledge Base</p>
                <h2 className="sr font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">Latest Insights &amp; Tutorials</h2>
              </div>
              <Link href="/blog" className="btn btn-outline btn-lg">All Articles <ArrowSVG size={15} /></Link>
            </div>
            <div className="g-3 gap-5">
              {blogs.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="sr flex flex-col no-underline bg-bg-2 border border-border rounded-[20px] overflow-hidden transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
                  <div className="h-[3px] bg-brand-gradient" />
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary bg-primary/10 border border-primary/20 py-1 px-3 rounded-full inline-block mb-3.5 w-fit font-bold">{post.category}</span>
                    <h3 className="font-display text-[17px] font-bold text-white leading-snug mb-2.5 flex-1">{post.title}</h3>
                    <p className="text-[13px] text-text-3 leading-[1.7] mb-4 line-clamp-2 overflow-hidden">{post.excerpt}</p>
                    <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider font-semibold">
                      {new Date(post.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · {post.readTime}min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FAQ ═════════════════════════════════════════════════════ */}
      <section className="section section--dark overflow-visible">
        <div className="container">
          <div className="g-2 gap-20 max-md:gap-8 items-start max-md:grid-cols-1">

            {/* LEFT, sticky */}
            <div className="sr sticky-mobile-fix sticky top-[100px]">
              <p className="eyebrow">FAQ</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-tight mb-6">
                Frequently Asked{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="text-base text-text-2 leading-[1.8] mb-8">
                Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Ask Us Anything <ArrowSVG size={15} /></Link>
              <p className="font-mono text-xs text-text-3 mt-6 italic tracking-wider">
                30-day money-back guarantee | Free training
              </p>
            </div>

            {/* RIGHT, scrollable */}
            <div className="flex flex-col gap-2.5">
              {FAQS.map(({ q, a }: FAQItem, i: number) => (
                <div key={i} className="sr bg-bg-3 border border-border rounded-2xl overflow-hidden transition-all duration-300" style={{ animationDelay:`${i*0.06}s` }}>
                  <details className="w-full">
                    <summary className="p-6 px-7 cursor-pointer list-none flex justify-between items-center gap-4">
                      <span className="font-display text-base font-bold text-white flex-1 leading-[1.4]">{q}</span>
                      <div className="text-primary shrink-0"><ChevSVG open={false} /></div>
                    </summary>
                    <div className="px-7 pb-6">
                      <p className="text-[15px] text-text-2 leading-[1.8]">{a}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════ */}
      <section className="section text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(79,110,247,0.1)_0%,transparent_80%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_20%,transparent_100%)]" />
        <div className="container relative z-10">
          <p className="eyebrow sr justify-center">Get Started Today</p>
          <h2 className="sr font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold tracking-tight leading-[0.95] text-white mb-5">
            Start Your Success<br />
            <span className="bg-brand-gradient bg-clip-text text-transparent">Story Today</span>
          </h2>
          <p className="sr text-lg text-text-2 leading-[1.8] max-w-[520px] mx-auto mb-5">
            Join 100+ successful businesses that chose ARIOSETECH for their web development needs. Professional results, affordable pricing, and ongoing support.
          </p>
          <div className="sr flex gap-2.5 flex-wrap justify-center mb-10">
            {['No Long-Term Contracts','30-Day Money-Back Guarantee','Free Post-Launch Support','Transparent Pricing'].map(t => (
              <span key={t} className="tag text-text-2 border-border-2 inline-flex items-center gap-6"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>{t}</span>
            ))}
          </div>
          <div className="sr flex gap-3.5 justify-center flex-wrap">
            <Link href="/contact" className="btn btn-primary btn-lg">Schedule Free Consultation <ArrowSVG size={15} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View Our Portfolio</Link>
          </div>
        </div>
      </section>
    </>
  )
}
