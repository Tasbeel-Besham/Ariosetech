/* Deployment Heartbeat: 2026-05-01 18:10:30 */
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
  title: "WordPress Security & Malware Removal",
  desc: "Protect your site from hackers and malware with enterprise-grade security. We provide complete scanning and removal services to ensure your business remains safe.",
  features: ["Malware scanning/removal", "Firewall installation", "Security hardening", "Blacklist removal", "24/7 threat monitoring"],
  price: "$299",
  timeline: "Emergency available"
}

// Pixel Perfect Vertical 2: Optimization (Based on Shopify Screenshot)
const SPEED_SERVICE = {
  id: "optimization",
  tagline: "Performance Optimization",
  title: "WordPress Speed Optimization",
  desc: "Improve Core Web Vitals and loading times by 40-70%. We optimize theme code, audit plugin performance, and tune assets for maximum conversion.",
  features: ["Image compression", "Caching implementation", "Database cleanup", "CSS/JS minification", "CDN setup", "Server optimizations"],
  price: "$399",
  timeline: "5-7 days"
}

// Flagship Service 01: Website Development
const DEV_SERVICE = {
  id: "development",
  tagline: "Scalable Solutions",
  title: "WordPress Website Development",
  desc: "Build Your Dream Website from Scratch. Transform your vision into a stunning, high-performing WordPress website tailored to your exact needs.",
  features: ["Custom theme development", "Responsive design", "SEO-optimized structure", "Lead generation tools", "Social media integration", "Google Analytics setup", "30 days of free support"],
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

// ── COMPONENT ──────────────────────────────────────────────────────

export default async function WordPressPage() {
  const pagesCol = await getCollection<PageDoc>('pages')
  const page = await pagesCol.findOne({ fullPath: '/services/wordpress' })
  if (!page) notFound()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ padding: '180px 0 120px', position: 'relative', overflow: 'hidden' }}>
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
          <div className="g-2 sr" id="development" style={{ gap: '100px', alignItems: 'center', marginBottom: '160px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '32px', padding: '60px', textAlign: 'center', 
                position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', overflow: 'hidden' 
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--grad)' }} />
                <div style={{ width: '180px', height: '180px', margin: '0 auto', position: 'relative' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(118,108,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="276.5" strokeDashoffset="27.65" strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ ...F, fontSize: '56px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>99</p>
                    <p style={{ ...M, fontSize: '10px', color: 'var(--primary)', fontWeight: 800 }}>SPEED</p>
                  </div>
                </div>
                <div style={{ marginTop: '40px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                   {[1,2,3,4].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i===1?'var(--primary)':'var(--border)' }} />)}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 2 }} className="hidden-mobile">
                 <p style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 800, marginBottom: '4px' }}>CORE WEB VITALS</p>
                 <p style={{ ...F, fontSize: '16px', fontWeight: 700, color: '#fff' }}>Passed 100%</p>
              </div>
            </div>

            <div>
              <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '100px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', marginBottom: '32px' }}>
                <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>{DEV_SERVICE.tagline}</span>
              </div>
              <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '32px', color: '#fff', letterSpacing: '-0.04em' }}>
                WordPress <span style={P}>Development</span>
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '48px', maxWidth: '520px' }}>
                {DEV_SERVICE.desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>
                {DEV_SERVICE.features.slice(0, 4).map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--text-3)' }}>
                    <div style={{ color: 'var(--primary)' }}><StandardCheck size={16} /></div>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-primary btn-lg">Get Started <ArrowSVG size={18} /></Link>
            </div>
          </div>

          {/* Vertical 02: Security (Text Left, Visual Right) */}
          <div className="g-2 sr" id="virus-removal" style={{ gap: '100px', alignItems: 'center', marginBottom: '160px', flexDirection: 'row-reverse' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                background: '#080812', border: '1px solid rgba(255,62,96,0.15)', borderRadius: '32px', padding: '48px', 
                position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' 
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #ff3e60, #ff7b91)' }} />
                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <div style={{ ...M, fontSize: '14px', lineHeight: 2.0 }}>
                  <p style={{ color: '#00ffa3', opacity: 0.8 }}>[SCAN] /wp-content/themes/...</p>
                  <p style={{ color: '#ff3e60', fontWeight: 700 }}>[ALERT] Vulnerability Found: CVE-2024</p>
                  <p style={{ color: '#00ffa3', opacity: 0.8 }}>[PATCH] Applying emergency hardening...</p>
                  <p style={{ color: '#fff', fontWeight: 700 }}>[DONE] Site Fully Secured.</p>
                </div>
              </div>
            </div>

            <div id="security">
              <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,62,96,0.08)', border: '1px solid rgba(255,62,96,0.2)', marginBottom: '32px' }}>
                <span style={{ ...M, fontSize: '10px', color: '#ff3e60', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>{SECURITY_SERVICE.tagline}</span>
              </div>
              <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '32px', color: '#fff', letterSpacing: '-0.04em' }}>
                Security & <span style={{ background: 'linear-gradient(135deg, #ff3e60 0%, #ff7b91 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hardening</span>
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '480px' }}>
                {SECURITY_SERVICE.desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                {SECURITY_SERVICE.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-3)' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ff3e60' }} />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,62,96,0.3)', color: '#ff7b91' }}>Request Security Audit</Link>
            </div>
          </div>

          {/* Vertical 03: Speed (Text Right, Visual Left) */}
          <div className="g-2 sr" id="speed" style={{ gap: '100px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '32px', padding: '60px', 
                textAlign: 'center', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' 
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--grad)' }} />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', alignItems: 'flex-end' }}>
                   {[60, 40, 99].map((val, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         <div style={{ width: '40px', height: `${val}px`, background: i===2?'var(--primary)':'rgba(255,255,255,0.05)', borderRadius: '8px', transition: 'height 1s ease' }} />
                         <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)' }}>{i===0?'LCP':i===1?'FID':'WP'}</p>
                      </div>
                   ))}
                </div>
                <p style={{ ...F, fontSize: '48px', fontWeight: 900, color: '#fff', marginTop: '32px' }}>0.8s</p>
                <p style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 800 }}>LOAD TIME</p>
              </div>
            </div>

            <div id="optimization">
              <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '100px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', marginBottom: '32px' }}>
                <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>{SPEED_SERVICE.tagline}</span>
              </div>
              <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '32px', color: '#fff', letterSpacing: '-0.04em' }}>
                Speed & <span style={P}>Optimization</span>
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '48px', maxWidth: '520px' }}>
                {SPEED_SERVICE.desc}
              </p>
              <div style={{ display: 'flex', gap: '40px' }}>
                 <div>
                    <p style={{ ...M, fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Mobile</p>
                    <p style={{ ...F, fontSize: '24px', fontWeight: 900, color: '#fff' }}>90+</p>
                 </div>
                 <div>
                    <p style={{ ...M, fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Desktop</p>
                    <p style={{ ...F, fontSize: '24px', fontWeight: 900, color: '#fff' }}>99+</p>
                 </div>
              </div>
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
                            <div style={{ color: 'var(--primary)' }}><StandardCheck size={14} /></div>
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
                 <div key={s.id} id={mappedId} className="sr" style={{ padding: '32px', background: 'rgba(255,255,255,0.01)', borderLeft: '2px solid rgba(118,108,255,0.1)', borderRadius: '0 16px 16px 0', display: 'flex', gap: '24px', alignItems: 'flex-start', transition: 'all 0.3s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(118,108,255,0.03)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'rgba(118,108,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)' }}
                 >
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
      <section className="section" style={{ padding: '120px 0', background: 'rgba(118,108,255,0.02)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Expertise & Trust</p>
            <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800 }}>Why Choose <span style={P}>ARIOSETECH?</span></h2>
          </div>
          <div className="g-3" style={{ gap: '40px' }}>
            <div className="sr">
              <p style={{ ...F, fontSize: '48px', fontWeight: 900, color: '#fff', marginBottom: '16px', ...P, width: 'fit-content' }}>7+</p>
              <h3 style={{ ...F, fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Years Expertise</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.8 }}>Delivering successful WordPress projects since 2017 with deep technical knowledge.</p>
            </div>
            <div className="sr" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '40px' }}>
              <p style={{ ...F, fontSize: '48px', fontWeight: 900, color: '#fff', marginBottom: '16px', ...P, width: 'fit-content' }}>100%</p>
              <h3 style={{ ...F, fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Performance-First</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.8 }}>Sites built for maximum speed and SEO from day one, ensuring your business stays ahead.</p>
            </div>
            <div className="sr" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '40px' }}>
              <p style={{ ...F, fontSize: '48px', fontWeight: 900, color: '#fff', marginBottom: '16px', ...P, width: 'fit-content' }}>60%</p>
              <h3 style={{ ...F, fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Cost-Effective</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.8 }}>Save up to 60% compared to US agencies while maintaining world-class quality standards.</p>
            </div>
          </div>
        </div>
      </section>

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
