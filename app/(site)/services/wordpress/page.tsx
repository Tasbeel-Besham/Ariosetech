/* Deployment Heartbeat: 2026-05-01 18:10:30 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { getCollection } from '@/lib/db/mongodb'
import { PageDoc } from '@/types'
import { notFound } from 'next/navigation'
import ApproachSection from '@/components/sections/ApproachSection'
import WhyUsSection from '@/components/sections/WhyUsSection'
import FaqSection from '@/components/sections/FaqSection'
import CtaSection from '@/components/sections/CtaSection'
import { IconBox, StandardCheck, ArrowSVG, ChevSVG, SecuritySVG, MigrationSVG, SpeedSVG, RedesignSVG, CodeSVG, GlobeSVG } from '@/components/ui/IconBox'

export const dynamic = 'force-dynamic'

// ── DATA ───────────────────────────────────────────────────────────

const HERO_DATA = {
  eyebrow: "ELEVATE YOUR ONLINE PRESENCE",
  headline: "Professional WordPress Development Services",
  subheadline: "Empower Your Business Online with a WordPress Website. Elevate Your Online Presence.",
  desc: "From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability.",
  ctaPrimary: "Get Free WordPress Consultation",
  ctaSecondary: "View WordPress Portfolio",
  trust: "4.9/5 Rating | 50+ Projects | 30-Day Money-Back Guarantee | Free Post-Launch Support"
}

// Pixel Perfect Vertical 1: Security (Based on Shopify Screenshot)
const SECURITY_SERVICE = {
  id: "security",
  tagline: "Cyber Defense",
  title: "Security & Hardening",
  desc: "Protect your digital assets with kernel-level hardening. We provide real-time malware monitoring, WAF rule injection, and proactive vulnerability patching to ensure total peace of mind.",
  features: ["Real-time Malware Shield", "Advanced WAF Configuration", "Vulnerability Patching", "SSL/TLS Handshake Audit", "24/7 Threat Monitoring"],
  price: "$299",
  timeline: "Emergency available"
}

// Pixel Perfect Vertical 2: Optimization (Based on Shopify Screenshot)
const SPEED_SERVICE = {
  id: "optimization",
  tagline: "Extreme Performance",
  title: "Performance Optimization",
  desc: "Dominate Core Web Vitals with 99+ scores. We implement edge caching, database query optimization, and advanced asset delivery to ensure your site loads in under 1 second.",
  features: ["Edge Caching (Cloudflare)", "Redis Object Caching", "Gzip/Brotli Compression", "Critical CSS Generation", "Database Indexing & Cleanup", "Server-Level Optimization"],
  price: "$399",
  timeline: "5-7 days"
}

// Flagship Service 01: Website Development
const DEV_SERVICE = {
  id: "development",
  tagline: "Advanced Architecture",
  title: "Bespoke WordPress Development",
  desc: "Engineered for speed and built for scale. We specialize in high-performance Headless WordPress, custom API integrations, and enterprise-grade themes tailored to your specific business logic.",
  features: ["Headless WordPress (React/Next)", "Custom API & CRM Integration", "ACF & Gutenberg Custom Blocks", "Scalable Multi-site Networks", "High-Performance Theme Design", "Advanced Security Protocols", "30 Days Post-Launch Support"],
  price: "$799",
  timeline: "2-3 weeks"
}

const MAINTENANCE_PLANS = [
  { tier: "Basic", price: "$79/mo", desc: "Essential maintenance for small personal websites and blogs.", features: ["1 site", "Monthly updates/backups", "Basic security", "Email support"], isPopular: false },
  { tier: "Professional", price: "$149/mo", desc: "Comprehensive support for growing business websites.", features: ["Up to 3 sites", "Weekly updates", "Performance optimization", "Priority support"], isPopular: true },
  { tier: "Enterprise", price: "$299/mo", desc: "Total peace of mind for high-traffic and e-commerce sites.", features: ["Up to 10 sites", "Real-time monitoring", "Advanced security", "Malware removal", "24/7 support"], isPopular: false }
]

const ADDITIONAL_GRID = [
  { id: "security-svc", title: "Security Services", price: "$299", desc: "Enterprise-grade security hardening and malware removal.", icon: <SecuritySVG /> },
  { id: "redesign", title: "Website Redesign", price: "$599", desc: "Modern aesthetics, improved UX, and mobile-first approach.", icon: <RedesignSVG /> },
  { id: "multilingual", title: "Multilingual Sites", price: "$399", desc: "Integration with WPML, Polylang, or TranslatePress.", icon: <GlobeSVG /> },
  { id: "migration", title: "Migration Services", price: "$299", desc: "Zero-downtime transfers from any hosting provider.", icon: <MigrationSVG /> },
  { id: "bugfixing", title: "Bugs & Errors Fixing", price: "$149", desc: "Quick resolution for WSOD and critical errors within 24-48h.", icon: <CodeSVG /> },
  { id: "backup", title: "Backup Solutions", price: "$199", desc: "Automated daily backups and 1-click restoration.", icon: <SecuritySVG /> }
]

// 5-Step Process from Homepage (Replacing 'Our Development Process')
const APPROACH_ITEMS = [
  { n: "01", title: "Discovery & Planning", sub: "2-3 DAYS", desc: "Requirement analysis and technical specs. We define the project roadmap and success criteria." },
  { n: "02", title: "Design & Development", sub: "1-2 WEEKS", desc: "Custom theme creation and responsive implementation. Bringing your vision to life with clean code." },
  { n: "03", title: "Testing & Optimization", sub: "3-5 DAYS", desc: "Cross-browser testing, speed checks, and security hardening to ensure a flawless launch." },
  { n: "04", title: "Launch & Support", sub: "ONGOING", desc: "Going live and providing ongoing monitoring and maintenance to keep your site at peak performance." }
]

const FAQS = [
  { q: "How long does a WordPress build take?", a: "Most projects take 2-3 weeks depending on complexity. We provide a detailed timeline after our initial consultation." },
  { q: "Do you use page builders like Elementor?", a: "We prefer custom development for performance but can use Elementor or Gutenberg if requested by the client." },
  { q: "Can you migrate my site from another host?", a: "Yes, we handle complete migrations with zero downtime and full SEO preservation from any platform." },
  { q: "Is security included in the development?", a: "All projects include at least 30 days of post-launch support and initial security hardening as standard." }
]

// ── STYLES ─────────────────────────────────────────────────────────

const F = { fontFamily: 'var(--font-display)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const
const P = { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as const

import TypingTerminal from '@/components/ui/TypingTerminal'

export default async function WordPressPage() {
  const pagesCol = await getCollection<PageDoc>('pages')
  const page = await pagesCol.findOne({ fullPath: '/services/wordpress' })
  if (!page) notFound()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ padding: '140px 0 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background Grid & Glows */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 70% at 30% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.2 }} />
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(118,108,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sr" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '6px 16px', borderRadius: 'var(--r-f)', background: 'rgba(118,108,255,0.06)', border: '1px solid rgba(118,108,255,0.15)', marginBottom: '32px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
            <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 800 }}>{HERO_DATA.eyebrow}</span>
          </div>

          <h1 style={{ ...F, fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.05em', marginBottom: '24px', maxWidth: '1100px', color: '#fff' }}>
            {HERO_DATA.headline}
          </h1>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '32px', maxWidth: '900px', ...P }}>
            {HERO_DATA.subheadline}
          </h2>
          <p style={{ fontSize: '19px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '680px', marginBottom: '56px' }}>
            {HERO_DATA.desc}
          </p>

          <div className="sr" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '64px' }}>
            <Link href="/contact" className="btn btn-primary btn-xl">{HERO_DATA.ctaPrimary} <ArrowSVG size={18} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-xl">{HERO_DATA.ctaSecondary}</Link>
          </div>

          <div className="sr" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '32px', maxWidth: '720px' }}>
             <div style={{ display:'flex', gap:'3px' }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="16" height="16" viewBox="0 0 14 14" fill="var(--primary)"><path d="M7 1l1.5 4.5H13L9.5 8l1.3 4L7 10l-3.8 2 1.3-4L1 5.5h4.5z"/></svg>
                ))}
             </div>
             <p style={{ ...M, fontSize: '12px', color: 'var(--text-3)', letterSpacing: '0.04em', fontWeight: 600 }}>
               {HERO_DATA.trust}
             </p>
          </div>
        </div>
      </section>

      {/* ── FLAGSHIP VERTICALS (Zig-Zag Layout) ─────────────────────── */}
      <section className="section" style={{ padding: '60px 0 100px' }}>
        <div className="container">
          
          {/* Vertical 01: Development (Text Right, Visual Left) */}
          <div className="g-2 sr" id="development" style={{ gap: '160px', alignItems: 'center', marginBottom: '200px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '40px', padding: '140px 60px', textAlign: 'center', 
                position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', overflow: 'hidden' 
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--grad)' }} />
                
                {/* Floating Code Card */}
                <div style={{ position: 'absolute', top: '40px', left: '-40px', background: '#0a0a0f', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'left', transform: 'rotate(-5deg)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', opacity: 0.8, zIndex: 3 }} className="hidden-mobile">
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ffbd2e' }} />
                  </div>
                  <code style={{ fontSize: '10px', color: 'var(--primary)', opacity: 0.7 }}>&lt;wp:custom-theme /&gt;</code>
                </div>

                <div style={{ width: '220px', height: '220px', margin: '0 auto', position: 'relative' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(118,108,255,0.05)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="6" strokeDasharray="282.7" strokeDashoffset="28.27" strokeLinecap="round" />
                    {/* Inner dash */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(118,108,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ ...F, fontSize: '64px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>99</p>
                    <p style={{ ...M, fontSize: '10px', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.1em' }}>SCORE</p>
                  </div>
                </div>
                
                <div style={{ marginTop: '48px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                   {[1,2,3,4].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i===1?'var(--primary)':'var(--border)' }} />)}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '20px', right: '-40px', background: 'rgba(10,10,20,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(118,108,255,0.2)', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 4 }} className="hidden-mobile">
                 <p style={{ ...M, fontSize: '10px', color: 'var(--primary)', fontWeight: 800, marginBottom: '6px' }}>VITAL CHECK</p>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffa3' }} />
                    <p style={{ ...F, fontSize: '15px', fontWeight: 800, color: '#fff' }}>PASSED 100%</p>
                 </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '100px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', marginBottom: '32px' }}>
                <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>{DEV_SERVICE.tagline}</span>
              </div>
              <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', color: '#fff', letterSpacing: '-0.04em' }}>
                Bespoke <span style={P}>WordPress</span> Dev
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '480px' }}>
                {DEV_SERVICE.desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {DEV_SERVICE.features.slice(0, 4).map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '15px', color: 'var(--text-2)', fontWeight: 500 }}>
                    <StandardCheck size={32} />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-primary btn-lg">Get Started <ArrowSVG size={18} /></Link>
            </div>
          </div>

          {/* Vertical 02: Security (Zig-Zag: Text Left, Visual Right) */}
          <div className="g-2 sr" id="virus-removal" style={{ gap: '160px', alignItems: 'center', marginBottom: '200px' }}>
            <div id="security">
              <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '100px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', marginBottom: '32px' }}>
                <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>{SECURITY_SERVICE.tagline}</span>
              </div>
              <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', color: '#fff', letterSpacing: '-0.04em' }}>
                Security & <span style={P}>Hardening</span>
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '480px' }}>
                {SECURITY_SERVICE.desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                {SECURITY_SERVICE.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '15px', color: 'var(--text-2)', fontWeight: 500 }}>
                    <StandardCheck size={32} />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-primary btn-lg">Request Security Audit <ArrowSVG size={18} /></Link>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ 
                background: '#080812', border: '1px solid rgba(118,108,255,0.15)', borderRadius: '32px', padding: '100px 48px', 
                position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' 
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--grad)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
                  </div>
                </div>
                <div style={{ height: '160px' }}>
                  <TypingTerminal />
                </div>
                {/* Progress Indicator */}
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ ...M, fontSize: '9px', color: 'var(--text-3)' }}>SECURE_PROTOCOL_SCAN</span>
                    <span style={{ ...M, fontSize: '9px', color: 'var(--primary)' }}>92%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                    <div style={{ width: '92%', height: '100%', background: 'var(--primary)', borderRadius: '2px', boxShadow: '0 0 10px var(--primary)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical 03: Speed (Zig-Zag: Visual Left, Text Right) */}
          <div className="g-2 sr" id="speed" style={{ gap: '160px', alignItems: 'center', marginBottom: '100px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '40px', padding: '140px 60px', 
                textAlign: 'center', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--grad)' }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
                  <div style={{ width: '100%', maxWidth: '320px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                       <span style={{ ...M, fontSize: '10px', color: 'var(--text-3)', fontWeight: 800 }}>PERFORMANCE INDEX</span>
                       <span style={{ ...M, fontSize: '10px', color: '#00ffa3', fontWeight: 800 }}>99/100</span>
                    </div>
                    <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '7px', overflow: 'hidden', padding: '3px' }}>
                       <div style={{ width: '99%', height: '100%', background: 'var(--grad)', borderRadius: '4px', boxShadow: '0 0 20px rgba(118,108,255,0.4)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '48px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', marginBottom: '6px' }}>FCP</p>
                      <p style={{ ...F, fontSize: '28px', fontWeight: 900, color: '#00ffa3' }}>0.4s</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', marginBottom: '6px' }}>LCP</p>
                      <p style={{ ...F, fontSize: '28px', fontWeight: 900, color: '#00ffa3' }}>0.8s</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', marginBottom: '6px' }}>CLS</p>
                      <p style={{ ...F, fontSize: '28px', fontWeight: 900, color: '#00ffa3' }}>0.01</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '56px', padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ ...M, fontSize: '11px', color: 'var(--text-2)', fontWeight: 700 }}>CORE WEB VITALS</span>
                    <span style={{ ...M, fontSize: '11px', color: '#00ffa3', fontWeight: 800 }}>OPTIMIZED</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} style={{ flex: 1, height: '8px', background: i < 6 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="optimization">
              <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '100px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', marginBottom: '32px' }}>
                <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>{SPEED_SERVICE.tagline}</span>
              </div>
              <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', color: '#fff', letterSpacing: '-0.04em' }}>
                Extreme <span style={P}>Performance</span>
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '480px' }}>
                {SPEED_SERVICE.desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                {SPEED_SERVICE.features.slice(0, 4).map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '15px', color: 'var(--text-2)', fontWeight: 500 }}>
                    <StandardCheck size={32} />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-primary btn-lg">Optimize My Site <ArrowSVG size={18} /></Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── MAINTENANCE PLANS (Unified Grid Style) ────────────────── */}
      <section id="maintenance" className="section" style={{ padding: '100px 0 140px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <p className="eyebrow sr" style={{ justifyContent: 'center' }}>Managed Excellence</p>
            <h2 className="sr" style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em' }}>
               Maintenance <span style={P}>Plans</span>
            </h2>
          </div>

          <div className="g-3 sr" style={{ gap: '1px', background: 'var(--border)', borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
             {MAINTENANCE_PLANS.map((plan) => (
                <div key={plan.tier} style={{ background: 'var(--bg-2)', padding: '60px 40px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', position: 'relative' }}>
                   {plan.isPopular && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--grad)' }} />}
                   <div style={{ marginBottom: '40px' }}>
                      <h3 style={{ ...F, fontSize: '24px', fontWeight: 800, color: plan.isPopular ? 'var(--primary)' : '#fff', marginBottom: '8px' }}>{plan.tier}</h3>
                      <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>{plan.desc}</p>
                   </div>
                   <div style={{ marginBottom: '40px' }}>
                      <p style={{ ...F, fontSize: '48px', fontWeight: 900, color: '#fff' }}>{plan.price}</p>
                      <p style={{ ...M, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Monthly</p>
                   </div>
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
                      {plan.features.map(f => (
                         <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-2)' }}>
                            <StandardCheck size={24} />
                            {f}
                         </div>
                      ))}
                   </div>
                   <Link href="/contact" className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'} btn-lg`} style={{ width: '100%', justifyContent: 'center' }}>Select Plan</Link>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SOLUTIONS GRID ────────────────────────────────── */}
      <section className="section section--dark" style={{ padding: '120px 0', position: 'relative' }}>
         <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(118,108,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
         <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
               <p className="eyebrow sr" style={{ justifyContent: 'center' }}>Tailored Services</p>
               <h2 className="sr" style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>Additional <span style={P}>Solutions</span></h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
               {ADDITIONAL_GRID.map((s) => {
                 const mappedId = s.id === 'security-svc' ? 'security' : (s.id === 'bugfixing' ? 'bugs' : s.id)
                 return (
                 <div key={s.id} id={mappedId} className="sr card card-hover" style={{ padding: '32px', background: 'rgba(255,255,255,0.01)', borderLeft: '2px solid rgba(118,108,255,0.1)', borderRadius: '0 16px 16px 0', display: 'flex', gap: '24px', alignItems: 'flex-start', transition: 'all 0.3s ease' }}>
                    <IconBox size={48} radius={12}>{s.icon}</IconBox>
                    <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h3 style={{ ...F, fontSize: '18px', fontWeight: 800, color: '#fff' }}>{s.title}</h3>
                          <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', fontWeight: 800 }}>{s.price}</span>
                       </div>
                       <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                 </div>
               )})}
            </div>
         </div>
      </section>

      {/* ── OUR APPROACH ──────────────────────────────────────────────── */}
      <ApproachSection 
        eyebrow="Our Process"
        headline="How It "
        scrambleWord="Works"
        items={APPROACH_ITEMS}
      />

      {/* ── WHY CHOOSE ARIOSETECH? ────────────────────────────────────── */}
      <WhyUsSection 
        eyebrow="Expertise & Trust"
        headline="Why Choose\nARIOSETECH?"
        items={[
          { icon: 'results', title: '7+ Years Expertise', subhead: '', desc: 'Delivering successful WordPress projects since 2017 with deep technical knowledge.' },
          { icon: 'speed', title: '100% Performance-First', subhead: '', desc: 'Sites built for maximum speed and SEO from day one, ensuring your business stays ahead.' },
          { icon: 'cost', title: '60% Cost-Effective', subhead: '', desc: 'Save up to 60% compared to US agencies while maintaining world-class quality standards.' }
        ]}
      />

      {/* ── PORTFOLIO & CASE STUDIES ─────────────────────────────────── */}
      <section className="section" style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '600px' }}>
              <p className="eyebrow">Proven Results</p>
              <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800 }}>Portfolio & <span style={P}>Case Studies</span></h2>
            </div>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View All Projects</Link>
          </div>
          <div className="g-3">
            {[
              { title: "The Kapra", desc: "E-commerce fashion store with 150% increase in leads.", site: "thekapra.com" },
              { title: "Dr. Scents", desc: "International perfume store with 200% increase in sales.", site: "drscents.com" },
              { title: "WYOX Sports", desc: "USA-based sports equipment site with custom features.", site: "wyoxsports.com" }
            ].map((item, i) => (
              <div key={i} className="sr" style={{ group: 'true', cursor: 'pointer' }}>
                <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px', aspectRatio: '16/10', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--grad)', opacity: 0.1 }} />
                  <span style={{ ...F, fontSize: '24px', fontWeight: 900, color: 'var(--primary)', opacity: 0.5 }}>{item.title}</span>
                </div>
                <h3 style={{ ...F, fontSize: '20px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '16px', lineHeight: 1.6 }}>{item.desc}</p>
                <p style={{ ...M, fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>{item.site}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '80px', padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', textAlign: 'center' }}>
            {['snapglammedspa.com', 'ctvpromo.com', 'usbiddingestimatings.com'].map(url => (
              <span key={url} style={{ ...M, fontSize: '14px', color: 'var(--text-3)' }}>{url}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <FaqSection 
        eyebrow="Questions"
        headline="Common\nInquiries"
        subheadline="Everything you need to know about our WordPress development services."
        ctaLabel="Contact Support"
        ctaHref="/contact"
        items={FAQS}
      />

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <CtaSection 
        eyebrow="Get Started Today"
        headline="Ready to Start Your\nProject?"
        desc="Join dozens of successful businesses that rely on Ariosetech for their high-performance digital presence."
        ctaPrimaryLabel="Get Started Now"
        ctaPrimaryHref="/contact"
        ctaSecondaryLabel=""
        ctaSecondaryHref=""
      />

    </main>
  )
}
