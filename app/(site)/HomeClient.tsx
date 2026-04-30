'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import ClutchWidget from '@/components/ui/ClutchWidget'
import HeroSection from '@/components/builder/sections/HeroSection'
import ServicesAccordionSection from '@/components/builder/sections/ServicesAccordionSection'

const ArrowSVG = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const CheckSVG = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ChevSVG = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.25s', flexShrink: 0 }}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const StarSVG = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--primary)">
    <path d="M7 1l1.5 4.5H13L9.5 8l1.3 4L7 10l-3.8 2 1.3-4L1 5.5h4.5z"/>
  </svg>
)

const P  = { background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } as const
const F  = { fontFamily:'var(--font-display)' } as const
const M  = { fontFamily:'var(--font-mono)'    } as const

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
    desc:'Business-first SEO built for real growth. From technical fixes to local SEO and content strategy — stronger search presence that drives leads.',
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
  { _id:'1', slug:'thekapra', title:'The Kapra', client:'E-commerce Fashion Store', platform:'Custom WooCommerce', result:'300%', resultLabel:'Increase in online sales', quote:'ARIOSETECH transformed our vision into reality with custom code solutions.' },
  { _id:'2', slug:'drscents', title:'Dr. Scents', client:'International Perfume Online Store', platform:'Multi-site WooCommerce', result:'32', resultLabel:'Countries launched in under 4 months', quote:'Incredible speed and quality. They delivered beyond our expectations.' },
  { _id:'3', slug:'wyox', title:'WYOX Sports', client:'USA-Based Sports Equipment', platform:'Shopify + Custom Solutions', result:'250%', resultLabel:'Business growth', quote:'Professional, reliable, and always available when we need them.' },
]

const TESTIMONIALS = [
  { name:'Dr. Fred Sahafi', role:'Founder of Genovie', initials:'FS', quote:'ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth.' },
  { name:'Michael Chen', role:'CEO of GeoMag World', initials:'MC', quote:'Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom WooCommerce solution that perfectly fits our business model.' },
  { name:'Muhammad Hannan', role:'Director of Janya.pk', initials:'MH', quote:'Fast, reliable, and cost-effective. ARIOSETECH helped us launch our wholesale platform on Shopify ahead of schedule and under budget.' },
]

const IMPACT_METRICS = [
  { value: '150%', label: 'Avg Conversion Lift', desc: 'Our tailored e-commerce strategies and optimized UX consistently drive 150%+ conversion improvements for clients.' },
  { value: '98%',  label: 'Client Satisfaction', desc: 'Every project is delivered with near-perfect precision — on time, on spec, and fully aligned with your business goals.' },
  { value: '40%',  label: 'Site Speed Gain',     desc: 'Performance-first builds mean faster stores, better SEO rankings, and higher revenue from the same traffic.' },
]

const HOW_IT_WORKS = [
  { n:'01', title:'Discovery & Strategy',   sub:'Understand Your Vision',    desc:'We kick off with a deep-dive consultation to understand your business goals, target audience, tech stack, and growth plans — so every decision is rooted in strategy.' },
  { n:'02', title:'Planning & Design',      sub:'Blueprint for Success',     desc:'Detailed project roadmaps, wireframes, and pixel-perfect design mockups that align with your brand identity and maximize conversion at every touchpoint.' },
  { n:'03', title:'Development',            sub:'Bringing Ideas to Life',    desc:'Expert WordPress, Shopify, or WooCommerce development using clean code, reusable components, and scalable architecture built to grow with your business.' },
  { n:'04', title:'Testing & Optimization', sub:'Ensuring Perfection',       desc:'Rigorous cross-device QA, speed optimization via Core Web Vitals, security hardening, and SEO validation — nothing ships until it\'s flawless.' },
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
  'Mobile experience assessment','Detailed action plan — no obligation',
]

const FAQS = [
  { q:'How long does a WordPress website take?', a:'Most WordPress websites are completed within 2-4 weeks, depending on complexity and requirements. Complex projects may take 4-6 weeks.' },
  { q:'What is included in your maintenance plans?', a:'Our maintenance plans include regular updates, security monitoring, performance optimization, backup management, and priority support. Plans start at $79/month.' },
  { q:'Do you offer a money-back guarantee?', a:"Yes. We offer a 30-day money-back guarantee on all our development projects. If you're not satisfied, we'll refund you in full." },
  { q:'Can you work with my existing WordPress site?', a:'Absolutely. We work with existing WordPress sites for redesigns, migrations, speed optimization, security fixes, and feature additions.' },
  { q:'Do you offer ongoing support after launch?', a:'Yes. Every project includes 30 days of free post-launch support. After that, we offer flexible monthly maintenance plans starting at $79/month.' },
  { q:'Can you migrate my existing store to Shopify or WooCommerce?', a:'Yes! We provide complete migration services from all major e-commerce platforms including Shopify, WooCommerce, Magento, BigCommerce, and custom solutions.' },
]

/* ── Scramble Text Component ─────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'

function ScrambleText({ text, delay = 0, className, style }: { text: string; delay?: number; className?: string; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState(text)
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = useCallback(() => {
    let iteration = 0
    const totalFrames = text.length * 4
    clearInterval(frameRef.current!)
    frameRef.current = setInterval(() => {
      setDisplay(
        text.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < Math.floor(iteration / 4)) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      iteration++
      if (iteration >= totalFrames) {
        clearInterval(frameRef.current!)
        setDisplay(text)
      }
    }, 40)
  }, [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !revealed) { setRevealed(true); setTimeout(scramble, delay) } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearInterval(frameRef.current!) }
  }, [scramble, delay, revealed])

  return (
    <span ref={ref} className={className} style={{ fontFamily:'inherit', ...style, display:'inline' }}>
      {display}
    </span>
  )
}

const APPROACH = [
  { n:'01', title:'COST-EFFECTIVE', sub:'Save 60% Without Compromising Quality', desc:'Premium web development at a fraction of US agency costs. Professional results, transparent pricing, zero compromise on quality.' },
  { n:'02', title:'TRANSPARENT', sub:'Open Communication at Every Step', desc:'We share project progress, insights, and feedback in real-time so you always know exactly where your investment stands.' },
  { n:'03', title:'RELIABLE', sub:'Consistently Delivered. Always On-Time.', desc:'100+ projects delivered on time and within budget. Our clients come back because our track record speaks for itself.' },
  { n:'04', title:'SCALABLE', sub:'Built to Grow With Your Business', desc:'Every site we build is architected for scale — whether you launch small or enterprise-level, our code grows seamlessly with your business.' },
  { n:'05', title:'SUPPORTED', sub:'24/7 Expert Assistance, Always On', desc:'Round-the-clock support across time zones. Emergency fixes, proactive monitoring, and regular maintenance included in every plan.' },
]

/* ── Approach sticky-scroll section ───────────────────────── */
function ApproachSection() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stripRef   = useRef<HTMLDivElement>(null)
  const [tx, setTx]             = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)
  const [showHint, setShowHint]   = useState(true)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const strip   = stripRef.current
    if (!wrapper || !strip) return

    const onScroll = () => {
      const rect      = wrapper.getBoundingClientRect()
      const maxScroll = wrapper.offsetHeight - window.innerHeight
      const scrolled  = Math.max(0, -rect.top)
      const progress  = Math.min(1, scrolled / maxScroll)

      const maxTx = strip.scrollWidth - window.innerWidth
      setTx(-(progress * maxTx))
      setActiveIdx(Math.min(APPROACH.length - 1, Math.floor(progress * APPROACH.length)))
      setShowHint(progress < 0.05)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} className="approach-wrapper" style={{ height:`${APPROACH.length * 100 + 60}vh`, position:'relative' }}>
      <div className="approach-sticky" style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', background:'var(--bg)' }}>

        {/* Header */}
        <div className="approach-header" style={{ textAlign:'center', padding:'52px 0 28px', flexShrink:0 }}>
          <p className="eyebrow" style={{ justifyContent:'center' }}>Why We&apos;re Different</p>
          <h2 style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', marginBottom:'20px' }}>
            Our <ScrambleText text="Approach" style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }} />
          </h2>
          {/* Progress dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:'8px' }}>
            {APPROACH.map((_, i) => (
              <div key={i} style={{ width: i === activeIdx ? '24px' : '6px', height:'6px', borderRadius:'9999px', background: i === activeIdx ? 'var(--primary)' : 'rgba(118,108,255,0.25)', transition:'all 0.4s var(--ease)' }} />
            ))}
          </div>
        </div>

        {/* Sliding strip */}
        <div className="approach-strip-container" style={{ flex:1, overflow:'hidden', display:'flex', alignItems:'center', position:'relative' }}>
          {/* Edge fades */}
          <div className="approach-fade" style={{ position:'absolute', left:0, top:0, bottom:0, width:'80px', background:'linear-gradient(to right, var(--bg), transparent)', zIndex:2, pointerEvents:'none' }} />
          <div className="approach-fade" style={{ position:'absolute', right:0, top:0, bottom:0, width:'80px', background:'linear-gradient(to left, var(--bg), transparent)', zIndex:2, pointerEvents:'none' }} />

          <div
            ref={stripRef}
            className="approach-strip"
            style={{
              display:'flex',
              gap:'20px',
              paddingLeft:'8vw',
              paddingRight:'8vw',
              transform:`translateX(${tx}px)`,
              willChange:'transform',
              transition:'transform 0.06s linear',
            }}
          >
            {APPROACH.map((item, i) => {
              const isActive = i === activeIdx
              return (
                <div
                  key={item.n}
                  className={`approach-card ${isActive ? 'active' : ''}`}
                  style={{
                    width:'min(460px, 82vw)',
                    flexShrink:0,
                    background: isActive
                      ? 'linear-gradient(145deg, rgba(118,108,255,0.13) 0%, rgba(10,10,18,0.95) 80%)'
                      : 'var(--bg-2)',
                    border:`1px solid ${isActive ? 'rgba(118,108,255,0.45)' : 'var(--border)'}`,
                    borderRadius:'24px',
                    padding:'44px 40px',
                    position:'relative',
                    overflow:'hidden',
                    transform: isActive ? 'scale(1.02)' : 'scale(0.95)',
                    opacity: isActive ? 1 : 0.45,
                    transition:'all 0.45s var(--ease)',
                    boxShadow: isActive ? '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(118,108,255,0.1)' : 'none',
                  }}
                >
                  {/* Gradient top bar */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'var(--grad)' }} />

                  {/* Ghost number */}
                  <p className="approach-ghost-num" style={{ ...F, fontSize:'clamp(8rem,13vw,14rem)', fontWeight:900, color:'rgba(255,255,255,0.04)', position:'absolute', top:'10px', right:'16px', lineHeight:1, userSelect:'none', letterSpacing:'-0.06em', pointerEvents:'none' }}>
                    {item.n}
                  </p>

                  {/* Step number pill */}
                  <div className="approach-pill" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', borderRadius:'9999px', background:'rgba(118,108,255,0.12)', border:'1px solid rgba(118,108,255,0.25)', marginBottom:'clamp(32px,5vw,64px)' }}>
                    <span style={{ ...M, fontSize:'11px', fontWeight:700, color:'var(--primary)', letterSpacing:'0.14em' }}>{item.n}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{ ...F, fontSize:'clamp(1.8rem, 2.8vw, 2.2rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.02em', lineHeight:1.1, marginBottom:'18px', textTransform:'uppercase', overflowWrap:'anywhere', wordBreak:'break-word' }}>
                    {item.title}
                  </h3>

                  <p style={{ ...M, fontSize:'11px', fontWeight:700, color:'var(--primary)', marginBottom:'14px', textTransform:'uppercase', letterSpacing:'0.12em' }}>
                    {item.sub}
                  </p>
                  <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.85, maxWidth:'340px' }}>
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="approach-hint" style={{ textAlign:'center', padding:'16px 0 20px', flexShrink:0, opacity: showHint ? 1 : 0, transition:'opacity 0.5s', pointerEvents:'none' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            <span style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.14em' }}>Scroll to explore</span>
          </div>
        </div>

        {/* Border bottom */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'var(--border)' }} />
      </div>
    </div>
  )
}

type BlogItem      = { _id:string; slug:string; title:string; excerpt:string; category:string; date:string; readTime:number }
type PortfolioItem = { _id:string; slug:string; title:string; client:string; category:string; summary:string; results:{label:string;value:string}[]; stack:string[]; featured:boolean }

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
      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <HeroSection />



      {/* ══ CLIENT LOGOS MARQUEE ══════════════════════════════════════ */}
      <div style={{ background:'var(--bg-3)', borderBottom:'1px solid var(--border)', padding:'20px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <p style={{ ...M, fontSize:'9px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.14em', flexShrink:0, paddingLeft:'32px', whiteSpace:'nowrap', fontWeight:700 }}>Trusted by 100+ businesses</p>
          <div style={{ flex:1, overflow:'hidden', position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'100px', background:'linear-gradient(to right, var(--bg-3), transparent)', zIndex:1, pointerEvents:'none' }} />
            <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'100px', background:'linear-gradient(to left, var(--bg-3), transparent)', zIndex:1, pointerEvents:'none' }} />
            <div style={{ display:'flex', gap:'10px', animation:'marquee 40s linear infinite', width:'max-content' }}>
              {[...CLIENT_LOGOS,...CLIENT_LOGOS].map((name,i) => (
                <span key={i} style={{ ...M, fontSize:'11px', fontWeight:600, color:'var(--text-3)', padding:'5px 16px', borderRadius:'var(--r-f)', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', whiteSpace:'nowrap' }}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ SERVICES TABS ══════════════════════════════════════════════ */}
      <ServicesAccordionSection 
        eyebrow="All Services"
        headline="Complete Digital Solutions"
        intro="We specialize in custom WordPress, Shopify, and WooCommerce development—delivering high-performance websites that scale with your business."
      />

      {/* ══ WHY CHOOSE US ══════════════════════════════════════════ */}
      <section className="section" style={{ overflow: 'visible' }}>
        <div className="container">
          <div className="g-2" style={{ gap:'80px', alignItems:'start' }}>

            {/* LEFT — sticky */}
            <div style={{ position:'sticky', top:'88px' }}>
              <p className="eyebrow sr">Why Choose Us</p>
              <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.04em', marginBottom:'20px' }}>
                Why 100+ Businesses Trust{' '}
                <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ARIOSETECH</span>
                {' '}for Their Success
              </h2>
              <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.85, marginBottom:'32px' }}>
                We combine world-class expertise with transparent pricing and a genuine commitment to your success. Not just code — business growth.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg sr">Start a Project <ArrowSVG size={16} /></Link>
            </div>

            {/* RIGHT — scrollable vertical cards */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'16px' }}>
              {WHY_US.map((b,i) => (
                <div key={b.title} className="sr card card-hover" style={{ display:'flex', gap:'24px', padding:'32px', animationDelay:`${i*0.08}s`, position:'relative', overflow:'hidden', alignItems:'flex-start' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'var(--grad)' }} />
                  
                  {/* Icon Box */}
                  <div style={{ flexShrink:0, width:'56px', height:'56px', borderRadius:'14px', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)', fontSize:'24px' }}>
                    {b.icon}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 style={{ ...F, fontSize:'18px', fontWeight:800, color:'#fff', marginBottom:'8px', letterSpacing:'-0.02em' }}>{b.title}</h3>
                    <p style={{ ...F, fontSize:'11px', fontWeight:700, color:'var(--primary)', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{b.subhead}</p>
                    <p style={{ fontSize:'14px', color:'var(--text-3)', lineHeight:1.8 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ IMPACT QUANTIFIED ══════════════════════════════════════ */}
      <section className="section section--dark" style={{ position:'relative', overflow:'hidden' }}>
        {/* Ambient glow */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'70%', height:'80%', background:'radial-gradient(ellipse, rgba(118,108,255,0.09) 0%, transparent 65%)', pointerEvents:'none', filter:'blur(30px)' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:'64px' }}>
            <p className="eyebrow sr" style={{ justifyContent:'center' }}>Results That Matter</p>
            <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>
              The Impact,{' '}<span style={P}>Quantified</span>
            </h2>
            <p className="sr" style={{ fontSize:'16px', color:'var(--text-2)', lineHeight:1.8, maxWidth:'520px', margin:'16px auto 0' }}>
              Numbers don&apos;t lie. Here&apos;s what working with ARIOSETECH actually delivers for your business.
            </p>
          </div>

          <div className="g-3" style={{ gap:'24px' }}>
            {IMPACT_METRICS.map((m, i) => (
              <div
                key={m.label}
                className="sr"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  background: 'rgba(10,10,18,0.7)',
                  border: '1px solid rgba(118,108,255,0.18)',
                  borderRadius: '24px',
                  padding: '44px 36px',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s var(--ease)',
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(118,108,255,0.45)'; el.style.transform = 'translateY(-8px)'; el.style.boxShadow = '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(118,108,255,0.08)' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(118,108,255,0.18)'; el.style.transform = ''; el.style.boxShadow = '' }}
              >
                {/* Subtle gradient top-bar */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'var(--grad)' }} />
                {/* Inner glow */}
                <div style={{ position:'absolute', top:'-30%', left:'-10%', width:'60%', height:'60%', background:'radial-gradient(ellipse, rgba(118,108,255,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

                <p style={{ ...F, fontSize:'clamp(3rem,5vw,4.5rem)', fontWeight:800, lineHeight:1, marginBottom:'12px', ...P }}>
                  {m.value}
                </p>
                <p style={{ ...F, fontSize:'16px', fontWeight:700, color:'#fff', marginBottom:'14px' }}>{m.label}</p>
                <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.8 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section className="section" style={{ position:'relative', overflow:'hidden' }}>
        {/* Vertical connector line */}
        <div style={{ position:'absolute', left:'50%', top:'160px', bottom:'80px', width:'1px', background:'linear-gradient(to bottom, transparent, rgba(118,108,255,0.20) 20%, rgba(118,108,255,0.20) 80%, transparent)', pointerEvents:'none' }} className="hidden-mobile" />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:'72px' }}>
            <p className="eyebrow sr" style={{ justifyContent:'center' }}>Our Process</p>
            <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>
              How It Works
            </h2>
            <p className="sr" style={{ fontSize:'16px', color:'var(--text-2)', lineHeight:1.8, maxWidth:'480px', margin:'16px auto 0' }}>
              From setup to scale — a proven 5-step process that takes you from idea to a live, high-performing site.
            </p>
          </div>

          <div className="how-it-works-grid" style={{ display:'flex', flexDirection:'column', gap:'32px', maxWidth:'900px', margin:'0 auto' }}>
            {HOW_IT_WORKS.map((step, i) => {
              const isRight = i % 2 !== 0
              return (
                <div
                  key={step.n}
                  className="sr how-step-row"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 1fr',
                    alignItems: 'center',
                    gap: '0',
                  }}
                >
                  {/* Left slot */}
                  <div className={isRight ? "how-step__empty hidden-mobile" : "how-step__card"}>
                    {!isRight && (
                      <div
                        style={{
                          background: 'var(--bg-2)',
                          border: '1px solid var(--border)',
                          borderRadius: '20px',
                          padding: '32px 36px',
                          transition: 'all 0.3s var(--ease)',
                          position: 'relative', overflow: 'hidden'
                        }}
                        onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(118,108,255,0.35)'; el.style.transform = 'translateX(-6px)' }}
                        onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.transform = '' }}
                      >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)', opacity: 0.5 }} />
                        <p style={{ ...F, fontSize:'clamp(3rem,4vw,3.8rem)', fontWeight:800, color:'rgba(118,108,255,0.15)', lineHeight:1, marginBottom:'16px', userSelect:'none' }}>{step.n}</p>
                        <p style={{ ...F, fontSize:'17px', fontWeight:800, color:'#fff', marginBottom:'6px' }}>{step.title}</p>
                        <p style={{ fontSize:'12px', color:'var(--primary)', fontWeight:600, marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.08em' }}>{step.sub}</p>
                        <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.8 }}>{step.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Centre connector dot */}
                  <div className="how-step__dot hidden-mobile" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0' }}>
                    <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--primary-soft)', border:'2px solid rgba(118,108,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ ...F, fontSize:'12px', fontWeight:800, color:'var(--primary)' }}>{step.n}</span>
                    </div>
                  </div>

                  {/* Right slot */}
                  <div className={!isRight ? "how-step__empty hidden-mobile" : "how-step__card"}>
                    {isRight && (
                      <div
                        style={{
                          background: 'var(--bg-2)',
                          border: '1px solid var(--border)',
                          borderRadius: '20px',
                          padding: '32px 36px',
                          transition: 'all 0.3s var(--ease)',
                          position: 'relative', overflow: 'hidden'
                        }}
                        onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(118,108,255,0.35)'; el.style.transform = 'translateX(6px)' }}
                        onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.transform = '' }}
                      >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)' }} />
                        <p style={{ ...F, fontSize:'clamp(3rem,4vw,3.8rem)', fontWeight:800, color:'rgba(118,108,255,0.15)', lineHeight:1, marginBottom:'16px', userSelect:'none' }}>{step.n}</p>
                        <p style={{ ...F, fontSize:'17px', fontWeight:800, color:'#fff', marginBottom:'6px' }}>{step.title}</p>
                        <p style={{ fontSize:'12px', color:'var(--primary)', fontWeight:600, marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.08em' }}>{step.sub}</p>
                        <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.8 }}>{step.desc}</p>
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
      <ApproachSection />

      {/* ══ PORTFOLIO ═══════════════════════════════════════════════ */}
      <section className="section section--dark">
        <div className="container">
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'56px', flexWrap:'wrap', gap:'20px' }}>
            <div>
              <p className="eyebrow sr">Our Work</p>
              <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>
                Success Stories That Speak for Themselves
              </h2>
              <p className="sr" style={{ fontSize:'16px', color:'var(--text-2)', lineHeight:1.8, marginTop:'14px', maxWidth:'560px' }}>
                Discover how we&apos;ve transformed businesses across industries with custom web solutions that drive growth and maximize ROI.
              </p>
            </div>
            <Link href="/portfolio" className="btn btn-outline btn-lg">Explore All Projects <ArrowSVG size={15} /></Link>
          </div>

          <div className="g-3" style={{ gap:'20px' }}>
            {displayPortfolio.map((p,i) => (
              <Link key={p._id} href={`/portfolio/${p.slug}`} className="sr" style={{ display:'flex', flexDirection:'column', textDecoration:'none', background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:'20px', overflow:'hidden', transition:'all 0.3s var(--ease)', animationDelay:`${i*0.08}s` }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(118,108,255,0.35)'
                  el.style.transform = 'translateY(-6px)'
                  el.style.boxShadow = '0 28px 70px rgba(0,0,0,0.55)'
                  const img = el.querySelector('[data-hp-img]') as HTMLElement | null
                  if (img) img.style.transform = 'translateY(-18%)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--border)'
                  el.style.transform = ''
                  el.style.boxShadow = ''
                  const img = el.querySelector('[data-hp-img]') as HTMLElement | null
                  if (img) img.style.transform = 'translateY(0%)'
                }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'var(--grad)', zIndex:2 }} />
                {/* Image preview (scroll on hover) */}
                <div style={{ height:'190px', overflow:'hidden', position:'relative', borderBottom:'1px solid var(--border)' }}>
                  <div
                    data-hp-img
                    style={{
                      position:'absolute',
                      inset:0,
                      backgroundImage:`radial-gradient(ellipse 60% 60% at 30% 30%, rgba(118,108,255,0.22) 0%, rgba(118,108,255,0) 55%), linear-gradient(145deg, rgba(15,15,26,1) 0%, rgba(5,5,8,1) 100%)`,
                      backgroundSize:'cover',
                      backgroundPosition:'top center',
                      transform:'translateY(0%)',
                      transition:'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                      willChange:'transform',
                    }}
                  />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.0) 65%)' }} />
                  <div style={{ position:'absolute', bottom:'14px', left:'16px', right:'16px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'10px' }}>
                    <span style={{ ...M, fontSize:'9px', color:'rgba(255,255,255,0.68)', textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:700 }}>
                      Hover to preview
                    </span>
                    <span style={{ ...M, fontSize:'9px', color:'var(--primary)', background:'rgba(118,108,255,0.10)', border:'1px solid rgba(118,108,255,0.22)', padding:'3px 10px', borderRadius:'9999px', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:800 }}>
                      {p.platform}
                    </span>
                  </div>
                </div>
                <div style={{ padding:'28px', flex:1, display:'flex', flexDirection:'column' }}>
                  <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'8px' }}>{p.client}</p>
                  <h3 style={{ ...F, fontSize:'22px', fontWeight:800, color:'#fff', marginBottom:'14px' }}>{p.title}</h3>
                  <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:1.75, fontStyle:'italic', flex:1, marginBottom:'20px' }}>&ldquo;{p.quote}&rdquo;</p>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'10px', paddingTop:'18px', borderTop:'1px solid var(--border)' }}>
                    <p style={{ ...F, fontSize:'2.2rem', fontWeight:800, color:'var(--primary)', lineHeight:1 }}>{p.result}</p>
                    <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:700 }}>{p.resultLabel}</p>
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
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'56px', flexWrap:'wrap', gap:'20px' }}>
            <div>
              <p className="eyebrow sr">Client Reviews</p>
              <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>
                What Our Clients Say About Working With Us
              </h2>
            </div>
            <div className="sr"><ClutchWidget widgetType={7} height={65} /></div>
          </div>

          <div className="g-3" style={{ gap:'20px', marginBottom:'40px' }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={t.name} className="card sr" style={{ padding:'32px', animationDelay:`${i*0.08}s` }}>
                <div style={{ display:'flex', gap:'3px', marginBottom:'20px' }}>
                  {[0,1,2,3,4].map(s => <StarSVG key={s} />)}
                </div>
                <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.85, fontStyle:'italic', marginBottom:'28px', flex:1 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display:'flex', alignItems:'center', gap:'14px', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', ...F, fontSize:'14px', fontWeight:800, color:'#fff', flexShrink:0 }}>{t.initials}</div>
                  <div>
                    <p style={{ ...F, fontSize:'14px', fontWeight:700, color:'#fff' }}>{t.name}</p>
                    <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live carousel */}
          <div style={{ borderRadius:'16px', overflow:'hidden', border:'1px solid var(--border)' }}>
            <ClutchWidget widgetType={12} height={375} reviews="449566,412231,406618,406326,405095,379000,373080,373075,372945,372930,372228,372128" />
          </div>
        </div>
      </section>

      {/* ══ PROCESS ════════════════════════════════════════════════ */}
      <section className="section section--dark">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <p className="eyebrow sr" style={{ justifyContent:'center' }}>How We Work</p>
            <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>
              Your Success Journey in 5 Simple Steps
            </h2>
          </div>

          {/* Horizontal steps with large numbers */}
          <div className="process-grid" style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', borderTop:'1px solid var(--border)', paddingTop:'40px' }}>
            {PROCESS.map(({ n, title, sub, desc, time },i) => (
              <div key={n} className="sr process-item" style={{ padding:'0 28px 0 0', borderRight:i<4?'1px solid var(--border)':'none', paddingRight:i<4?'28px':'0', animationDelay:`${i*0.07}s` }}>
                <p style={{ ...F, fontSize:'clamp(3.5rem,5vw,5rem)', fontWeight:800, color:'rgba(118,108,255,0.15)', lineHeight:1, marginBottom:'16px', userSelect:'none' }}>{n}</p>
                <p style={{ ...F, fontSize:'15px', fontWeight:700, color:'#fff', marginBottom:'5px' }}>{title}</p>
                <p style={{ fontSize:'12px', color:'var(--primary)', fontWeight:600, marginBottom:'10px' }}>{sub}</p>
                <p style={{ fontSize:'12px', color:'var(--text-3)', lineHeight:1.8, marginBottom:'14px' }}>{desc}</p>
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
          <div style={{ background:'linear-gradient(135deg, rgba(118,108,255,0.10) 0%, rgba(118,108,255,0.04) 100%)', border:'1px solid rgba(118,108,255,0.20)', borderRadius:'28px', padding:'clamp(40px,6vw,72px)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'56px', alignItems:'center' }}>
            <div>
              <p className="eyebrow">Free Audit</p>
              <h2 style={{ ...F, fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.04em', marginBottom:'16px' }}>
                Get Your Free Website Performance Audit
              </h2>
              <p style={{ ...F, fontSize:'17px', fontWeight:600, color:'var(--text-2)', marginBottom:'12px' }}>
                Discover what&apos;s holding your website back from peak performance.
              </p>
              <p style={{ fontSize:'15px', color:'var(--text-3)', lineHeight:1.8, marginBottom:'14px' }}>
                Find out exactly how to improve your site&apos;s speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.
              </p>
              <p style={{ ...M, fontSize:'11px', color:'var(--text-3)', fontStyle:'italic' }}>No spam, ever. Detailed report delivered within 24 hours.</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {AUDIT_ITEMS.map(item => (
                <div key={item} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <CheckSVG size={12} />
                  </div>
                  <span style={{ fontSize:'15px', color:'var(--text-2)' }}>{item}</span>
                </div>
              ))}
              <Link href="/contact" className="btn btn-primary btn-lg" style={{ marginTop:'10px', justifyContent:'center' }}>
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
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'52px', flexWrap:'wrap', gap:'20px' }}>
              <div>
                <p className="eyebrow sr">Knowledge Base</p>
                <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>Latest Insights &amp; Tutorials</h2>
              </div>
              <Link href="/blog" className="btn btn-outline btn-lg">All Articles <ArrowSVG size={15} /></Link>
            </div>
            <div className="g-3" style={{ gap:'20px' }}>
              {blogs.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="sr" style={{ display:'flex', flexDirection:'column', textDecoration:'none', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'20px', overflow:'hidden', transition:'all 0.25s var(--ease)' }}
                  onMouseEnter={e => { const el=e.currentTarget; el.style.borderColor='rgba(118,108,255,0.3)'; el.style.transform='translateY(-5px)' }}
                  onMouseLeave={e => { const el=e.currentTarget; el.style.borderColor='var(--border)'; el.style.transform='' }}>
                  <div style={{ height:'3px', background:'var(--grad)' }} />
                  <div style={{ padding:'26px', flex:1, display:'flex', flexDirection:'column' }}>
                    <span style={{ ...M, fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.14em', color:'var(--primary)', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', padding:'4px 12px', borderRadius:'var(--r-f)', display:'inline-block', marginBottom:'14px', width:'fit-content', fontWeight:700 }}>{post.category}</span>
                    <h3 style={{ ...F, fontSize:'17px', fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:'10px', flex:1 }}>{post.title}</h3>
                    <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:1.7, marginBottom:'16px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{post.excerpt}</p>
                    <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>
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
      <section className="section section--dark" style={{ overflow: 'visible' }}>
        <div className="container">
          <div className="g-2" style={{ gap:'80px', alignItems:'start' }}>

            {/* LEFT — sticky */}
            <div className="sr sticky-mobile-fix" style={{ position:'sticky', top:'100px' }}>
              <p className="eyebrow">FAQ</p>
              <h2 style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.04em', marginBottom:'24px' }}>
                Frequently Asked{' '}
                <span style={P}>Questions</span>
              </h2>
              <p style={{ fontSize:'16px', color:'var(--text-2)', lineHeight:1.8, marginBottom:'32px' }}>
                Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Ask Us Anything <ArrowSVG size={15} /></Link>
              <p style={{ ...M, fontSize: '12px', color: 'var(--text-3)', marginTop: '24px', fontStyle: 'italic', letterSpacing:'0.05em' }}>
                30-day money-back guarantee | Free training
              </p>
            </div>

            {/* RIGHT — scrollable */}
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {FAQS.map(({ q, a }: any, i: number) => (
                <div key={i} className="sr" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s var(--ease)', animationDelay:`${i*0.06}s` }}>
                  <details style={{ width:'100%' }}>
                    <summary style={{ padding: '24px 28px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      <span style={{ ...F, fontSize: '16px', fontWeight: 700, color: '#fff', flex: 1, lineHeight: 1.4 }}>{q}</span>
                      <div style={{ color:'var(--primary)', flexShrink:0 }}><ChevSVG open={false} /></div>
                    </summary>
                    <div style={{ padding: '0 28px 24px' }}>
                      <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8 }}>{a}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════ */}
      <section className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(79,110,247,0.1) 0%, transparent 80%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.3 }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <p className="eyebrow sr" style={{ justifyContent:'center' }}>Get Started Today</p>
          <h2 className="sr" style={{ ...F, fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:800, letterSpacing:'-0.05em', lineHeight:0.95, color:'#fff', marginBottom:'20px' }}>
            Start Your Success<br />
            <span style={P}>Story Today</span>
          </h2>
          <p className="sr" style={{ fontSize:'18px', color:'var(--text-2)', lineHeight:1.8, maxWidth:'520px', margin:'0 auto 20px' }}>
            Join 100+ successful businesses that chose ARIOSETECH for their web development needs. Professional results, affordable pricing, and ongoing support.
          </p>
          <div className="sr" style={{ display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center', marginBottom:'40px' }}>
            {['No Long-Term Contracts','30-Day Money-Back Guarantee','Free Post-Launch Support','Transparent Pricing'].map(t => (
              <span key={t} className="tag" style={{ color:'var(--text-2)', border:'1px solid var(--border-2)' }}>✓ {t}</span>
            ))}
          </div>
          <div className="sr" style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Schedule Free Consultation <ArrowSVG size={15} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View Our Portfolio</Link>
          </div>
        </div>
      </section>
    </>
  )
}
