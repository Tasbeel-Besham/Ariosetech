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
  { id: "bugfixing", title: "Bugs & Errors Fixing", price: "$149", desc: "Quick resolution for WSOD and critical errors within 24-48h.", icon: <CodeSVG /> }
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

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
            <Link href="/contact" className="btn btn-primary btn-xl">{HERO_DATA.ctaPrimary} <ArrowSVG size={18} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-xl">{HERO_DATA.ctaSecondary}</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '24px', maxWidth: '640px' }}>
            <div style={{ ...M, fontSize: '12px', color: 'var(--text-3)', letterSpacing: '0.05em' }}>
              {HERO_DATA.trust}
            </div>
          </div>
        </div>
      </section>

      {/* ── VERTICAL 01: WEBSITE DEVELOPMENT ─────────────────────────── */}
      <section className="section" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%)', border: '1px solid var(--border)', borderRadius: '48px', padding: 'clamp(40px, 10vw, 100px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle at 70% 30%, rgba(118,108,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <div className="g-2" style={{ gap: '100px', alignItems: 'center' }}>
              <div className="sr">
                <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '100px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', marginBottom: '32px' }}>
                  <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>{DEV_SERVICE.tagline}</span>
                </div>
                
                <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1, marginBottom: '32px', color: '#fff', letterSpacing: '-0.04em' }}>
                  WordPress <span style={P}>Development</span>
                </h2>
                
                <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '48px', maxWidth: '520px' }}>
                  {DEV_SERVICE.desc}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '64px' }}>
                  {DEV_SERVICE.features.slice(0, 6).map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--text)', fontWeight: 500 }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(118,108,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(118,108,255,0.2)' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px', padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px' }}>
                  <div>
                    <p style={{ ...M, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Project Investment</p>
                    <p style={{ ...F, fontSize: '36px', fontWeight: 900, color: '#fff' }}>{DEV_SERVICE.price}</p>
                  </div>
                  <div style={{ width: '1px', height: '48px', background: 'var(--border)' }} />
                  <div>
                    <p style={{ ...M, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Average Execution</p>
                    <p style={{ ...F, fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{DEV_SERVICE.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Performance Dashboard Visual */}
              <div className="sr">
                <div style={{ 
                  background: 'var(--bg-3)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '40px', 
                  padding: '60px', 
                  textAlign: 'center', 
                  position: 'relative', 
                  boxShadow: '0 40px 120px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(20px)'
                }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '40px', padding: '1px', background: 'linear-gradient(135deg, rgba(118,108,255,0.2), transparent, rgba(118,108,255,0.2))', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', pointerEvents: 'none' }} />
                  
                  <div style={{ width: '220px', height: '220px', margin: '0 auto', position: 'relative' }}>
                    <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#766cff" />
                          <stop offset="100%" stopColor="#9b8fff" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="44" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeDasharray="276.5" strokeDashoffset="27.65" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 12px rgba(118,108,255,0.5))' }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ ...F, fontSize: '64px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>99</p>
                      <p style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 800, marginTop: '4px', letterSpacing: '0.1em' }}>SPEED SCORE</p>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: '32px' }}>
                    <div>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', marginBottom: '8px' }}>SEO</p>
                      <p style={{ ...F, fontSize: '20px', fontWeight: 800, color: '#fff' }}>100</p>
                    </div>
                    <div>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', marginBottom: '8px' }}>ACCESSIBILITY</p>
                      <p style={{ ...F, fontSize: '20px', fontWeight: 800, color: '#fff' }}>100</p>
                    </div>
                    <div>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', marginBottom: '8px' }}>BEST PRACTICES</p>
                      <p style={{ ...F, fontSize: '20px', fontWeight: 800, color: '#fff' }}>100</p>
                    </div>
                  </div>

                  <div style={{ marginTop: '40px', padding: '12px 24px', borderRadius: '100px', background: 'rgba(118,108,255,0.05)', border: '1px solid rgba(118,108,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
                    <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>Gutenberg & Core Web Vitals Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VERTICAL 02: SECURITY HARDENING ─────────────────────────── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ background: '#05050a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '48px', padding: 'clamp(40px, 8vw, 100px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '400px', height: '400px', background: 'radial-gradient(circle at 30% 30%, rgba(255,62,96,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <div className="g-2" style={{ gap: '80px', alignItems: 'center', flexDirection: 'row-reverse' }}>
              <div className="sr">
                <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,62,96,0.08)', border: '1px solid rgba(255,62,96,0.2)', marginBottom: '32px' }}>
                  <span style={{ ...M, fontSize: '10px', color: '#ff3e60', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>{SECURITY_SERVICE.tagline}</span>
                </div>
                
                <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1, marginBottom: '32px', color: '#fff', letterSpacing: '-0.04em' }}>
                  Security & <span style={{ background: 'linear-gradient(135deg, #ff3e60 0%, #ff7b91 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hardening</span>
                </h2>
                
                <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '480px' }}>
                  {SECURITY_SERVICE.desc}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px', marginBottom: '48px' }}>
                  {SECURITY_SERVICE.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff', fontWeight: 500 }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ff3e60' }} />
                      {f}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '24px', padding: '20px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px' }}>
                   <div>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Emergency Price</p>
                      <p style={{ ...F, fontSize: '24px', fontWeight: 900 }}>{SECURITY_SERVICE.price}</p>
                   </div>
                   <div style={{ width: '1px', height: '32px', background: 'var(--border)' }} />
                   <p style={{ ...M, fontSize: '11px', color: '#ff3e60', fontWeight: 700 }}>{SECURITY_SERVICE.timeline}</p>
                </div>
              </div>

              <div className="sr" style={{ position: 'relative' }}>
                <div style={{ 
                  background: '#080812', 
                  border: '1px solid rgba(255,62,96,0.15)', 
                  borderRadius: '32px', 
                  padding: '48px', 
                  position: 'relative', 
                  overflow: 'hidden', 
                  boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                    </div>
                    <p style={{ ...M, fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>ariosetech_security_v3.0</p>
                  </div>
                  <div style={{ ...M, fontSize: '14px', lineHeight: 2.2 }}>
                    <p style={{ color: '#00ffa3', opacity: 0.8 }}>[SYSTEM] Initializing WP_Hardening_Protocol...</p>
                    <p style={{ color: '#00ffa3', opacity: 0.8 }}>[SCAN] Scanning /wp-content/uploads/...</p>
                    <p style={{ color: '#ff3e60', fontWeight: 700 }}>[ALERT] MALWARE DETECTED: PHP.Shell.Backdoor.Gen</p>
                    <p style={{ color: '#00ffa3', opacity: 0.8 }}>[ACTION] Isolating infected files...</p>
                    <p style={{ color: '#766cff', fontWeight: 700 }}>[DONE] 4.9/5 Security Rating Restored.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VERTICAL 03: PERFORMANCE OPTIMIZATION ──────────────────── */}
      <section className="section" style={{ padding: '100px 0 160px' }}>
        <div className="container">
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '48px', padding: 'clamp(40px, 8vw, 100px)', position: 'relative', overflow: 'hidden' }}>
            <div className="g-2" style={{ gap: '100px', alignItems: 'center' }}>
              <div className="sr">
                <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                  {[1,2,3].map(i => <div key={i} style={{ width: '40px', height: '2px', background: i===3?'var(--primary)':'rgba(255,255,255,0.1)' }} />)}
                </div>
                
                <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1, marginBottom: '32px', color: '#fff', letterSpacing: '-0.04em' }}>
                  Speed & <span style={P}>Optimization</span>
                </h2>
                
                <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '48px', maxWidth: '520px' }}>
                  {SPEED_SERVICE.desc}
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', marginBottom: '64px' }}>
                  <div>
                    <p style={{ ...M, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Mobile Perf.</p>
                    <p style={{ ...F, fontSize: '36px', fontWeight: 900, color: 'var(--primary)' }}>90+</p>
                  </div>
                  <div style={{ width: '1px', height: '60px', background: 'var(--border)' }} />
                  <div>
                    <p style={{ ...M, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Desktop Perf.</p>
                    <p style={{ ...F, fontSize: '36px', fontWeight: 900, color: 'var(--primary)' }}>99+</p>
                  </div>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '24px', padding: '20px 32px', background: 'rgba(118,108,255,0.05)', border: '1px solid rgba(118,108,255,0.2)', borderRadius: '20px' }}>
                   <div>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Service Price</p>
                      <p style={{ ...F, fontSize: '24px', fontWeight: 900 }}>{SPEED_SERVICE.price}</p>
                   </div>
                   <div style={{ width: '1px', height: '32px', background: 'var(--border)' }} />
                   <p style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>{SPEED_SERVICE.timeline}</p>
                </div>
              </div>

              <div className="sr" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ 
                  background: 'var(--bg-3)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '40px', 
                  padding: '80px', 
                  textAlign: 'center', 
                  position: 'relative', 
                  boxShadow: '0 60px 120px rgba(0,0,0,0.5)',
                  width: '100%', 
                  maxWidth: '480px' 
                }}>
                  <div style={{ width: '200px', height: '200px', margin: '0 auto', position: 'relative' }}>
                    <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(118,108,255,0.05)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="44" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="276.5" strokeDashoffset="27.65" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 10px rgba(118,108,255,0.4))' }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ ...F, fontSize: '64px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>99</p>
                      <p style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 800, marginTop: '4px' }}>SCORE</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '48px', padding: '12px 24px', borderRadius: '12px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                    <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>Optimized for Conversions</span>
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

      {/* ── WHY CHOOSE ARIOSETECH? ────────────────────────────────────── */}
      <section className="section" style={{ padding: '120px 0', background: 'rgba(118,108,255,0.02)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Expertise & Trust</p>
            <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800 }}>Why Choose <span style={P}>ARIOSETECH?</span></h2>
          </div>
          <div className="g-3">
            <div className="sr" style={{ padding: '40px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '24px' }}>
              <div style={{ ...F, fontSize: '40px', fontWeight: 900, color: 'var(--primary)', marginBottom: '16px' }}>7+</div>
              <h3 style={{ ...F, fontSize: '20px', marginBottom: '12px' }}>Years Expertise</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.6 }}>Delivering successful WordPress projects since 2017 with deep technical knowledge.</p>
            </div>
            <div className="sr" style={{ padding: '40px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '24px' }}>
              <div style={{ ...F, fontSize: '40px', fontWeight: 900, color: 'var(--primary)', marginBottom: '16px' }}>100%</div>
              <h3 style={{ ...F, fontSize: '20px', marginBottom: '12px' }}>Performance-First</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.6 }}>Sites built for maximum speed and SEO from day one, ensuring your business stays ahead.</p>
            </div>
            <div className="sr" style={{ padding: '40px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '24px' }}>
              <div style={{ ...F, fontSize: '40px', fontWeight: 900, color: 'var(--primary)', marginBottom: '16px' }}>60%</div>
              <h3 style={{ ...F, fontSize: '20px', marginBottom: '12px' }}>Cost-Effective</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.6 }}>Save up to 60% compared to US agencies while maintaining world-class quality standards.</p>
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
