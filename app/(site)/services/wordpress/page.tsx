/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { getCollection } from '@/lib/db/mongodb'
import { PageDoc } from '@/types'
import { notFound } from 'next/navigation'
import ApproachSection from '@/components/sections/ApproachSection'
import { IconBox, StandardCheck, ArrowSVG, ChevSVG, SecuritySVG, MigrationSVG, SpeedSVG, RedesignSVG, CodeSVG, GlobeSVG } from '@/components/ui/IconBox'

export const dynamic = 'force-dynamic'

// ── DATA ───────────────────────────────────────────────────────────

const HERO_DATA = {
  eyebrow: "Standard-Setting WordPress Expertise",
  headline: "Professional WordPress Development Services",
  subheadline: "Display Your Business Online with a WordPress Website",
  desc: "Ariosetech helps businesses build, scale, and secure their digital presence with custom WordPress solutions. From technical foundations to high-performance e-commerce, we build websites that deliver results.",
  cta: "Book a Free Consultation"
}

// Pixel Perfect Vertical 1: Security (Based on Shopify Screenshot)
const SECURITY_SERVICE = {
  id: "security",
  tagline: "Cyber Defense",
  title: "WORDPRESS SECURITY HARDENING",
  desc: "Protect your store from evolving threats with advanced security configurations and plugin audits.",
  features: ["Security Plugin Audit", "Checkout Hardening", "2FA Implementation", "Fraud Protection Setup"],
  price: "$149",
  timeline: "3-5 days"
}

// Pixel Perfect Vertical 2: Optimization (Based on Shopify Screenshot)
const SPEED_SERVICE = {
  id: "optimization",
  tagline: "Performance Optimization",
  title: "WORDPRESS PERFORMANCE OPTIMIZATION",
  desc: "Improve your store speed by 40-60%. We optimize theme code, audit plugin performance, and tune assets for maximum conversion.",
  features: ["Image optimization", "Advanced Caching", "Server-Level Tuning", "CDN Configuration", "Database Cleaning"],
  price: "$399",
  timeline: "24-48 hours"
}

// Flagship Service 01: Website Development
const DEV_SERVICE = {
  id: "development",
  tagline: "Scalable Solutions",
  title: "Website Development",
  desc: "Build your dream website from scratch. Our custom development approach ensures your site stands out while delivering exceptional user experience.",
  features: ["Custom theme development", "Responsive design", "SEO-optimized structure", "30-day money-back guarantee", "30 days free support"],
  price: "$799",
  timeline: "2-4 weeks"
}

const MAINTENANCE_PLANS = [
  { tier: "Basic", price: "$29/mo", desc: "Essential maintenance for small personal websites and blogs.", features: ["Plugin & theme updates", "Monthly backups", "Core security checks", "Email support"], isPopular: false },
  { tier: "Advanced", price: "$59/mo", desc: "Comprehensive support for growing business websites.", features: ["Weekly updates", "Daily backups", "Uptime monitoring", "Priority support", "Performance reports"], isPopular: true },
  { tier: "Enterprise", price: "$99/mo", desc: "Total peace of mind for high-traffic and e-commerce sites.", features: ["Daily updates", "Hourly backups", "Proactive monitoring", "Staging site access", "Developer hours"], isPopular: false }
]

const ADDITIONAL_GRID = [
  { id: "security-svc", title: "Security Services", price: "$299", desc: "Enterprise-grade security hardening for business sites.", icon: <SecuritySVG /> },
  { id: "redesign", title: "Website Redesign", price: "$599", desc: "Give your site a modern makeover without losing SEO.", icon: <RedesignSVG /> },
  { id: "multilingual", title: "Multilingual Sites", price: "$399", desc: "Expand your reach with global WPML solutions.", icon: <GlobeSVG /> },
  { id: "migration", title: "Migration Services", price: "$199", desc: "Zero-downtime transfers to any hosting provider.", icon: <MigrationSVG /> },
  { id: "bugfixing", title: "Bugs & Errors Fixing", price: "$99", desc: "Quick resolution for WSOD and critical errors.", icon: <CodeSVG /> }
]

// 5-Step Process from Homepage (Replacing 'Our Development Process')
const APPROACH_ITEMS = [
  { n: "01", title: "Discovery & Strategy", sub: "UNDERSTAND YOUR VISION", desc: "We kick off with a deep-dive consultation to understand your business goals, target audience, tech stack, and growth plans — so every decision is rooted in strategy." },
  { n: "02", title: "Planning & Design", sub: "BLUEPRINT FOR SUCCESS", desc: "Detailed project roadmaps, wireframes, and pixel-perfect design mockups that align with your brand identity and maximize conversion at every touchpoint." },
  { n: "03", title: "Development", sub: "BRINGING IDEAS TO LIFE", desc: "Expert WordPress, Shopify, or WooCommerce development using clean code, reusable components, and scalable architecture built to grow with your business." },
  { n: "04", title: "Testing & Optimization", sub: "ENSURING PERFECTION", desc: "Rigorous cross-device QA, speed optimization via Core Web Vitals, security hardening, and SEO validation — nothing ships until it's flawless." },
  { n: "05", title: "Launch & Scale", sub: "YOUR SUCCESS, OUR PRIORITY", desc: "A smooth go-live, comprehensive handover training, and 30 days of free post-launch support. After that, flexible monthly plans keep your site at peak performance." }
]

const FAQS = [
  { q: "How long does a WordPress build take?", a: "Typically 2-4 weeks depending on complexity. We provide a detailed timeline after our initial consultation." },
  { q: "Do you use page builders like Elementor?", a: "We specialize in custom, lightweight development using Gutenberg or custom code for better performance." },
  { q: "Can you migrate my site from another host?", a: "Yes, we handle complete migrations with zero downtime and full SEO preservation." },
  { q: "Is security included in the development?", a: "Every build includes core security hardening, SSL setup, and login protection as standard." }
]

// ── STYLES ─────────────────────────────────────────────────────────

const F = { fontFamily: 'var(--font-display)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const
const P = { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as const

// ── COMPONENT ──────────────────────────────────────────────────────

export default async function WordPressPage() {
  const pagesCol = await getCollection<PageDoc>('pages')
  const page = await pagesCol.findOne({ fullPath: '/services/wordpress' })
  if (!page) notFound()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ padding: '160px 0 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.4 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px 5px 10px', borderRadius: '20px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />
            <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{HERO_DATA.eyebrow}</span>
          </div>

          <h1 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '12px', maxWidth: '1000px', color: '#fff' }}>
            {HERO_DATA.headline}
          </h1>
          <h2 style={{ ...F, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '32px', maxWidth: '1000px', ...P }}>
            {HERO_DATA.subheadline}
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '640px', marginBottom: '48px' }}>
            {HERO_DATA.desc}
          </p>

          <Link href="/contact" className="btn btn-primary btn-xl">{HERO_DATA.cta} <ArrowSVG size={18} /></Link>
        </div>
      </section>

      {/* ── VERTICAL 01: WEBSITE DEVELOPMENT ─────────────────────────── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '40px', padding: 'clamp(32px, 8vw, 80px)', position: 'relative', overflow: 'hidden' }}>
            <div className="g-2" style={{ gap: '80px', alignItems: 'center' }}>
              <div className="sr">
                <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '8px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', marginBottom: '32px' }}>
                  <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800 }}>{DEV_SERVICE.tagline}</span>
                </div>
                <h2 style={{ ...F, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '28px', color: '#fff' }}>{DEV_SERVICE.title}</h2>
                <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '480px' }}>{DEV_SERVICE.desc}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px', marginBottom: '48px' }}>
                  {DEV_SERVICE.features.slice(0, 4).map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff', fontWeight: 500 }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />
                      {f}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <div>
                    <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Starting at</p>
                    <p style={{ ...F, fontSize: '32px', fontWeight: 900, color: '#fff' }}>{DEV_SERVICE.price}</p>
                  </div>
                  <div style={{ height: '40px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <div>
                    <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Execution</p>
                    <p style={{ ...F, fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>{DEV_SERVICE.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Gauge visual */}
              <div className="sr">
                <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '32px', padding: '64px 80px', textAlign: 'center', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto', position: 'relative' }}>
                    <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(118,108,255,0.1)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="28.27" strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ ...F, fontSize: '56px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>99</p>
                      <p style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 800, marginTop: '4px' }}>Avg. Speed Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VERTICAL 02: SECURITY HARDENING (Pixel Perfect Rebuilt) ────── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ background: '#05050a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '40px', padding: 'clamp(32px, 8vw, 80px)', position: 'relative', overflow: 'hidden' }}>
            <div className="g-2" style={{ gap: '80px', alignItems: 'center', flexDirection: 'row-reverse' }}>
              <div className="sr">
                <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,50,100,0.08)', border: '1px solid rgba(255,50,100,0.2)', marginBottom: '32px' }}>
                  <span style={{ ...M, fontSize: '10px', color: '#ff3e60', textTransform: 'uppercase', fontWeight: 800 }}>{SECURITY_SERVICE.tagline}</span>
                </div>
                <h2 style={{ ...F, fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '28px', color: '#fff' }}>{SECURITY_SERVICE.title}</h2>
                <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '480px' }}>{SECURITY_SERVICE.desc}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
                  {SECURITY_SERVICE.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff', fontWeight: 500 }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ff3e60' }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sr" style={{ position: 'relative' }}>
                <div style={{ background: '#080810', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 3px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', opacity: 0.4 }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                    </div>
                    <p style={{ ...M, fontSize: '10px' }}>root@ariosetech:~/wordpress_audit</p>
                  </div>
                  <div style={{ ...M, fontSize: '14px', lineHeight: 2 }}>
                    <p style={{ color: '#00ffa3' }}>{'>'} INIT SCAN...</p>
                    <p style={{ color: '#00ffa3' }}>{'>'} CHECKING /wp-content/plugins...</p>
                    <p style={{ color: '#ff3e60' }}>! ALERT: Trojan.Generic FOUND</p>
                    <p style={{ color: '#00ffa3' }}>{'>'} ISOLATING THREAT...</p>
                    <p style={{ color: '#00ffa3' }}>{'>'} SYSTEM CLEAN. REBOOTING...</p>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#0a0a14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px 32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 2 }}>
                  <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Starting at</p>
                  <p style={{ ...F, fontSize: '32px', fontWeight: 900, color: '#fff' }}>{SECURITY_SERVICE.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VERTICAL 03: PERFORMANCE OPTIMIZATION (Pixel Perfect Rebuilt) ─ */}
      <section className="section" style={{ padding: '80px 0 120px' }}>
        <div className="container">
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '40px', padding: 'clamp(32px, 8vw, 80px)', position: 'relative', overflow: 'hidden' }}>
            <div className="g-2" style={{ gap: '80px', alignItems: 'center' }}>
              <div className="sr">
                <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                  {[1,2,3].map(i => <div key={i} style={{ width: '40px', height: '2px', background: i===3?'var(--primary)':'rgba(255,255,255,0.1)' }} />)}
                </div>
                <h2 style={{ ...F, fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '28px', color: '#fff' }}>{SPEED_SERVICE.title}</h2>
                <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '48px', maxWidth: '500px' }}>{SPEED_SERVICE.desc}</p>
                
                <div style={{ display: 'flex', gap: '64px' }}>
                  <div>
                    <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Mobile Performance</p>
                    <p style={{ ...F, fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>90+</p>
                  </div>
                  <div>
                    <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Desktop Performance</p>
                    <p style={{ ...F, fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>99+</p>
                  </div>
                </div>
              </div>

              <div className="sr" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '32px', padding: '64px 80px', textAlign: 'center', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', width: '100%', maxWidth: '440px' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto', position: 'relative' }}>
                    <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(118,108,255,0.1)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="28.27" strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ ...F, fontSize: '56px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>99</p>
                      <p style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 800, marginTop: '4px' }}>SCORE</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-2)', marginTop: '40px', fontWeight: 500 }}>Performance Rating</p>
                  <div style={{ marginTop: '24px', padding: '10px 20px', borderRadius: '12px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                    <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>Gutenberg Optimized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAINTENANCE PLANS ────────────────────────────────────────── */}
      <section className="section" style={{ padding: '0 0 120px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Managed Hosting & Support</p>
            <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800 }}>Maintenance <span style={P}>Plans</span></h2>
          </div>
          <div className="g-3">
            {MAINTENANCE_PLANS.map((plan) => (
              <div key={plan.tier} className="sr" style={{ 
                padding: '48px 32px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '32px', 
                position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: plan.isPopular ? '0 30px 60px rgba(118,108,255,0.15)' : 'none'
              }}>
                {plan.isPopular && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '4px 12px', borderRadius: '100px', background: 'var(--grad)', fontSize: '10px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ ...F, fontSize: '24px', marginBottom: '8px' }}>{plan.tier}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '32px' }}>{plan.desc}</p>
                <p style={{ ...F, fontSize: '40px', fontWeight: 900, marginBottom: '32px' }}>{plan.price}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                      <StandardCheck size={16} />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/contact" className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'} btn-lg`} style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SOLUTIONS GRID ────────────────────────────────── */}
      <section className="section section--dark" style={{ padding: '120px 0' }}>
        <div className="container">
           <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <p className="eyebrow" style={{ justifyContent: 'center' }}>Tailored Services</p>
              <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800 }}>Additional <span style={P}>Solutions</span></h2>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {ADDITIONAL_GRID.map((s) => (
                <div key={s.id} className="sr" style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start', transition: 'all 0.3s var(--ease)' }}>
                   <IconBox size={52} radius={12}>{s.icon}</IconBox>
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                         <h3 style={{ ...F, fontSize: '18px', color: '#fff' }}>{s.title}</h3>
                         <span style={{ ...M, fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>{s.price}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6 }}>{s.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── OUR APPROACH (Replacing Development Process) ────────────── */}
      <ApproachSection 
        eyebrow="Our Process"
        headline="How It "
        scrambleWord="Works"
        items={APPROACH_ITEMS}
      />

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
           <div className="g-2" style={{ gap: '80px' }}>
              <div className="sr">
                 <p className="eyebrow">Questions</p>
                 <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800 }}>Common <span style={P}>Inquiries</span></h2>
                 <p style={{ fontSize: '16px', color: 'var(--text-2)', marginTop: '20px' }}>Everything you need to know about our WordPress development services.</p>
                 <Link href="/contact" className="btn btn-primary btn-lg" style={{ marginTop: '40px' }}>Contact Support</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {FAQS.map((faq, i) => (
                   <div key={i} className="sr" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                      <details style={{ width: '100%' }}>
                         <summary style={{ padding: '24px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ ...F, fontSize: '16px', fontWeight: 800, color: '#fff' }}>{faq.q}</span>
                            <div style={{ color: 'var(--primary)' }}><ChevSVG open={false} /></div>
                         </summary>
                         <div style={{ padding: '0 24px 24px', fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.7 }}>
                            {faq.a}
                         </div>
                      </details>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center', position: 'relative', padding: '160px 0' }}>
         <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(118,108,255,0.08) 0%, transparent 80%)', pointerEvents: 'none' }} />
         <div className="container">
            <h2 className="sr" style={{ ...F, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900 }}>Ready to Start Your <span style={P}>Project?</span></h2>
            <p className="sr" style={{ fontSize: '18px', color: 'var(--text-2)', maxWidth: '600px', margin: '24px auto 48px' }}>Join dozens of successful businesses that rely on Ariosetech for their high-performance digital presence.</p>
            <Link href="/contact" className="btn btn-primary btn-xl">Get Started Now <ArrowSVG size={18} /></Link>
         </div>
      </section>

    </main>
  )
}
"
,Description:
