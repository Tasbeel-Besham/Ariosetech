/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { getCollection } from '@/lib/db/mongodb'
import { PageDoc } from '@/types'
import { notFound } from 'next/navigation'
import ApproachSection from '@/components/sections/ApproachSection'
import { IconBox, CheckSVG, ArrowSVG, ChevSVG, SecuritySVG, MigrationSVG, SpeedSVG, RedesignSVG, CodeSVG, GlobeSVG } from '@/components/ui/IconBox'

export const dynamic = 'force-dynamic'

// ── INTERFACES ──────────────────────────────────────────────────────

interface Service {
  id: string;
  tagline?: string;
  title: string;
  desc: string;
  features: string[];
  price: string;
  timeline?: string;
  href: string;
  icon?: React.ReactNode;
}

interface Plan {
  tier: string;
  price: string;
  desc?: string;
  features: string[];
  isPopular?: boolean;
}

interface ProcessStep {
  n: string;
  title: string;
  sub: string;
  desc: string;
}

interface FAQItem {
  q: string;
  a: string;
}

interface WhyUsItem {
  title: string;
  subhead: string;
  desc: string;
}

// ── DATA — Verbatim from Google Doc ───────────────────────────────

const HERO_DATA = {
  eyebrow: "WordPress Solutions",
  headline: "Professional WordPress",
  subheadline: "Development Services",
  desc: "From simple business websites to complex enterprise platforms, we build high-performing, secure, and scalable WordPress solutions tailored to your business goals.",
  startingPrice: "Starting at $799",
  ctaPrimary: "Get Free WordPress Consultation",
  ctaSecondary: "View WordPress Portfolio",
  benefits: ["Custom Development", "Lightning Fast", "100% Secure", "SEO-Ready", "24/7 Support"]
}

const FLAGSHIP_SERVICES: Service[] = [
  {
    id: "development",
    tagline: "Enterprise Grade",
    title: "WordPress Website Development",
    desc: "Build your dream website from scratch. Our custom development approach ensures your site stands out while delivering exceptional user experience.",
    features: ["Custom theme development", "Responsive design across all devices", "SEO-optimized structure", "30-day money-back guarantee", "30 days free support"],
    price: "$799",
    timeline: "2-4 weeks",
    href: "/contact",
    icon: <CodeSVG size={24} />
  },
  {
    id: "security",
    tagline: "Cyber Defense",
    title: "WordPress Security Services",
    desc: "Protect your site from hackers and malware. Ideal for e-commerce and sensitive data sites. We ensure absolute security hardening.",
    features: ["24/7 threat monitoring", "Automatic malware removal", "Weekly security reports", "Blacklist monitoring", "Vulnerability assessments"],
    price: "$299",
    timeline: "3-5 days",
    href: "/contact",
    icon: <SecuritySVG size={24} />
  },
  {
    id: "optimization",
    tagline: "Performance First",
    title: "Speed Optimization",
    desc: "Boost your site speed by 40-70%. We optimize images, implement caching, and perform server-level tuning for peak performance.",
    features: ["Image optimization & WebP", "Core Web Vitals improvement", "Database cleanup", "CDN implementation", "Performance report"],
    price: "$399",
    timeline: "24-48 hours",
    href: "/contact",
    icon: <SpeedSVG size={24} />
  }
]

const ADDITIONAL_SERVICES: Service[] = [
  {
    id: "redesign",
    title: "Website Redesign",
    desc: "Give your existing site a modern makeover without losing SEO or content.",
    features: ["Modern UI/UX", "SEO preservation", "Performance boost"],
    price: "$1,299",
    timeline: "3-4 weeks",
    href: "/contact",
    icon: <RedesignSVG size={22} />
  },
  {
    id: "migration",
    title: "Migration Services",
    desc: "Seamless website migration to WordPress with zero data loss and SEO preservation.",
    features: ["Zero data loss", "SEO preservation", "301 redirects"],
    price: "$249",
    timeline: "2-4 days",
    href: "/contact",
    icon: <MigrationSVG size={22} />
  },
  {
    id: "bugfixing",
    title: "Bug Fixing & Support",
    desc: "Quick resolution for critical WordPress issues and plugin conflicts.",
    features: ["WSOD resolution", "Database repair", "Emergency response"],
    price: "$149",
    timeline: "24-48 hours",
    href: "/contact",
    icon: <CodeSVG size={22} />
  }
]

const MAINTENANCE_PLANS: Plan[] = [
  { tier: "Basic", price: "$79/mo", features: ["Monthly Updates", "Uptime Monitoring", "Basic Security", "Email Support"] },
  { tier: "Professional", price: "$149/mo", features: ["Weekly Updates", "Speed Optimization", "Advanced Security", "Priority Support"], isPopular: true },
  { tier: "Enterprise", price: "$299/mo", features: ["Daily Updates", "Emergency Response", "Full Backups", "Dedicated Account Manager"] }
]

const BACKUP_PLANS: Plan[] = [
  { tier: "Basic", price: "$29/mo", features: ["Weekly Backups", "10GB Storage", "Standard Restore"] },
  { tier: "Advanced", price: "$59/mo", features: ["Daily Backups", "50GB Storage", "One-click Recovery"] },
  { tier: "Enterprise", price: "$99/mo", features: ["Hourly Backups", "Unlimited Storage", "Priority Restore"] }
]

const WHY_US_ITEMS: WhyUsItem[] = [
  { title: "7+ Years Expertise", subhead: "Deep Platform Knowledge", desc: "Since 2017, we've specialized exclusively in high-end WordPress solutions for global brands." },
  { title: "Performance-First", subhead: "Optimized for Growth", desc: "Every line of code is written with speed in mind, ensuring 95+ PageSpeed scores and Core Web Vitals pass." },
  { title: "Security-Focused", subhead: "Enterprise-Grade Hardening", desc: "We implement multi-layer security protocols to protect your data and your reputation." },
  { title: "100% Custom", subhead: "No Page Builders", desc: "We build clean, custom themes that are lightweight, scalable, and easy to manage." }
]

const PROCESS_STEPS: ProcessStep[] = [
  { n: "01", title: "Consultation", sub: "3-5 Days", desc: "Deep dive into your requirements, technical audit, and strategic planning." },
  { n: "02", title: "Design & Dev", sub: "1-2 Weeks", desc: "Iterative development with clean code and pixel-perfect design alignment." },
  { n: "03", title: "Testing & Opt", sub: "3-5 Days", desc: "Rigorous cross-device QA, speed tuning, and security hardening." },
  { n: "04", title: "Launch & Support", sub: "Ongoing", desc: "Smooth go-live followed by training and dedicated maintenance." }
]

const FAQS: FAQItem[] = [
  { q: "How long does a full WordPress build take?", a: "Typically 2-4 weeks depending on complexity. We provide a detailed timeline after our initial consultation." },
  { q: "Is the website mobile-friendly?", a: "Yes, 100%. We follow a mobile-first approach to ensure a perfect experience across all devices." },
  { q: "Can I manage the content myself?", a: "Absolutely. We provide a full training session so you can easily update text, images, and blog posts without touching code." },
  { q: "How do you handle website security?", a: "We implement enterprise-grade hardening, including SSL, firewalls, and regular vulnerability scans, included in every build." }
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
    <main className="mesh-bg" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ padding: '160px 0 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(118,108,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow sr-visible" style={{ justifyContent: 'center' }}>{HERO_DATA.eyebrow}</p>
          <h1 className="sr-visible" style={{ ...F, fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.05em', marginBottom: '10px' }}>
            {HERO_DATA.headline}
          </h1>
          <h2 className="sr-visible glow-text" style={{ ...F, fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--primary)', marginBottom: '32px' }}>
            {HERO_DATA.subheadline}
          </h2>
          <p className="sr-visible" style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', color: 'var(--text-2)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 48px' }}>
            {HERO_DATA.desc}
          </p>

          <div className="sr-visible" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link href="/contact" className="btn btn-primary btn-xl">{HERO_DATA.ctaPrimary} <ArrowSVG size={18} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-xl">{HERO_DATA.ctaSecondary}</Link>
          </div>

          <div className="sr-visible" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {HERO_DATA.benefits.map(b => (
              <span key={b} className="tag" style={{ background: 'rgba(118,108,255,0.05)', borderColor: 'rgba(118,108,255,0.15)', color: 'var(--text-2)' }}>✓ {b}</span>
            ))}
          </div>
          
          <p style={{ ...M, fontSize: '12px', color: 'var(--primary)', marginTop: '32px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {HERO_DATA.startingPrice} · 30-Day Money-Back Guarantee
          </p>
        </div>
      </section>

      {/* ── FLAGSHIP SERVICES (Bespoke Showcase) ─────────────────────── */}
      <section className="section" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Flagship Solutions</p>
            <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>Engineered for <span style={P}>Excellence</span></h2>
          </div>

          <div className="g" style={{ gap: '32px' }}>
            {/* 01. Development Bento */}
            <div className="sr tech-card" style={{ borderRadius: '32px', padding: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
               <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <IconBox size={48} radius={14}>
                      {FLAGSHIP_SERVICES[0].icon}
                    </IconBox>
                    <span className="status-badge status-badge--new">{FLAGSHIP_SERVICES[0].tagline}</span>
                  </div>
                  <h3 style={{ ...F, fontSize: '36px', marginBottom: '20px' }}>{FLAGSHIP_SERVICES[0].title}</h3>
                  <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>{FLAGSHIP_SERVICES[0].desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                    {FLAGSHIP_SERVICES[0].features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-3)' }}>
                        <div style={{ color: 'var(--primary)' }}><CheckSVG size={14} /></div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <p style={{ ...F, fontSize: '28px', color: '#fff' }}>{FLAGSHIP_SERVICES[0].price}</p>
                    <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
                    <p style={{ ...M, fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>{FLAGSHIP_SERVICES[0].timeline}</p>
                    <Link href="/contact" className="btn btn-primary btn-md" style={{ marginLeft: 'auto' }}>Get Started</Link>
                  </div>
               </div>
               <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--grad)' }} />
                  <div style={{ ...M, fontSize: '10px', color: 'var(--text-3)', marginBottom: '24px' }}>// PERFORMANCE_TELEMETRY</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                      { label: 'Server Response', val: '0.2s', p: '98%' },
                      { label: 'Core Web Vitals', val: 'Pass', p: '100%' },
                      { label: 'Mobile Score', val: '98/100', p: '98%' }
                    ].map(m => (
                      <div key={m.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{m.label}</span>
                          <span style={{ ...M, fontSize: '12px', color: 'var(--primary)' }}>{m.val}</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: m.p, height: '100%', background: 'var(--grad)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="g-2" style={{ gap: '32px' }}>
              {/* 02. Security Terminal */}
              <div className="sr tech-card" style={{ borderRadius: '32px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 3px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <IconBox size={40} radius={12}>
                      {FLAGSHIP_SERVICES[1].icon}
                    </IconBox>
                    <span className="status-badge status-badge--new">{FLAGSHIP_SERVICES[1].tagline}</span>
                </div>
                <h3 style={{ ...F, fontSize: '28px', marginBottom: '16px' }}>{FLAGSHIP_SERVICES[1].title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '28px' }}>{FLAGSHIP_SERVICES[1].desc}</p>
                <div style={{ background: '#000', borderRadius: '12px', padding: '20px', marginBottom: '28px', border: '1px solid rgba(118,108,255,0.2)' }}>
                   <div style={{ ...M, fontSize: '11px', color: '#0f0', marginBottom: '10px' }}>ariosetech@root:~/security_audit$ scan --all</div>
                   <div style={{ ...M, fontSize: '11px', color: '#fff', opacity: 0.7 }}>
                      {'>'} Firewall: ACTIVE<br />
                      {'>'} Malware: 0 THREATS<br />
                      {'>'} SSL: VALID (2048-bit)<br />
                      {'>'} Status: PROTECTED
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ ...F, fontSize: '24px', color: '#fff' }}>{FLAGSHIP_SERVICES[1].price}</p>
                    <p style={{ ...M, fontSize: '10px', color: 'var(--primary)' }}>{FLAGSHIP_SERVICES[1].timeline}</p>
                  </div>
                  <Link href="/contact" className="btn btn-outline btn-md">Secure Site</Link>
                </div>
              </div>

              {/* 03. Optimization Gauge */}
              <div className="sr tech-card" style={{ borderRadius: '32px', padding: '40px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <IconBox size={40} radius={12}>
                      {FLAGSHIP_SERVICES[2].icon}
                    </IconBox>
                    <span className="status-badge status-badge--new">{FLAGSHIP_SERVICES[2].tagline}</span>
                </div>
                <h3 style={{ ...F, fontSize: '28px', marginBottom: '16px' }}>{FLAGSHIP_SERVICES[2].title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '28px' }}>{FLAGSHIP_SERVICES[2].desc}</p>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
                   <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid rgba(118,108,255,0.1)', borderTopColor: 'var(--primary)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ ...F, fontSize: '32px', fontWeight: 900 }}>99</span>
                      <span style={{ position: 'absolute', bottom: '-20px', ...M, fontSize: '10px', color: 'var(--primary)' }}>SPEED SCORE</span>
                   </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ ...F, fontSize: '24px', color: '#fff' }}>{FLAGSHIP_SERVICES[2].price}</p>
                    <p style={{ ...M, fontSize: '10px', color: 'var(--primary)' }}>{FLAGSHIP_SERVICES[2].timeline}</p>
                  </div>
                  <Link href="/contact" className="btn btn-outline btn-md">Optimize</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SOLUTIONS GRID ────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>More Services</p>
            <h2 style={{ ...F, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>Complete <span style={P}>Ecosystem</span> Support</h2>
          </div>

          <div className="g-3">
            {ADDITIONAL_SERVICES.map((s, i) => (
              <div key={s.id} className="sr card card-hover" style={{ padding: '32px', animationDelay: `${i * 0.05}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                   <IconBox size={44} radius={12}>
                      {s.icon}
                   </IconBox>
                   <span style={{ ...M, fontSize: '13px', color: 'var(--primary)', fontWeight: 800 }}>{s.price}</span>
                </div>
                <h3 style={{ ...F, fontSize: '20px', marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '24px' }}>{s.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
                   {s.features.map(f => (
                     <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-2)' }}>
                        <div style={{ color: 'var(--primary)' }}><CheckSVG size={12} /></div>
                        {f}
                     </div>
                   ))}
                </div>
                <Link href={s.href} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Learn More</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BACKUP & MAINTENANCE PLANS ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="g-2" style={{ gap: '64px' }}>
            {/* Backup Plans */}
            <div className="sr">
              <h3 style={{ ...F, fontSize: '28px', marginBottom: '32px' }}>Backup <span style={P}>Solutions</span></h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {BACKUP_PLANS.map(p => (
                   <div key={p.tier} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--border)' }}>
                      <IconBox size={48} radius={12}>
                         <MigrationSVG size={22} />
                      </IconBox>
                      <div style={{ flex: 1 }}>
                         <p style={{ ...F, fontSize: '16px', color: '#fff', fontWeight: 800 }}>{p.tier}</p>
                         <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>{p.features.join(' · ')}</p>
                      </div>
                      <p style={{ ...M, fontSize: '16px', color: 'var(--primary)', fontWeight: 800 }}>{p.price}</p>
                   </div>
                 ))}
              </div>
            </div>

            {/* Maintenance Plans */}
            <div className="sr">
              <h3 style={{ ...F, fontSize: '28px', marginBottom: '32px' }}>Maintenance <span style={P}>Tiers</span></h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {MAINTENANCE_PLANS.map(p => (
                   <div key={p.tier} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: p.isPopular ? '1px solid var(--primary)' : '1px solid var(--border)', background: p.isPopular ? 'rgba(118,108,255,0.03)' : 'var(--bg-2)' }}>
                      <IconBox size={48} radius={12}>
                         <SecuritySVG size={22} />
                      </IconBox>
                      <div style={{ flex: 1 }}>
                         <p style={{ ...F, fontSize: '16px', color: '#fff', fontWeight: 800 }}>{p.tier} {p.isPopular && <span style={{ fontSize: '10px', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '2px 8px', borderRadius: '999px', marginLeft: '8px' }}>POPULAR</span>}</p>
                         <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>{p.features.join(' · ')}</p>
                      </div>
                      <p style={{ ...M, fontSize: '16px', color: 'var(--primary)', fontWeight: 800 }}>{p.price}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
          <div className="g-2" style={{ gap: '80px', alignItems: 'center' }}>
             <div className="sr">
                <p className="eyebrow">Why Ariosetech</p>
                <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>Standard-Setting <span style={P}>WordPress</span> Expertise</h2>
                <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>We don&apos;t just install plugins. We architect custom solutions that are secure by design, lightning-fast by nature, and scalable by default.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {WHY_US_ITEMS.map(item => (
                     <div key={item.title} style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '4px', height: 'auto', background: 'var(--grad)', borderRadius: '2px' }} />
                        <div>
                           <p style={{ ...F, fontSize: '15px', color: '#fff', fontWeight: 800 }}>{item.title}</p>
                           <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="sr" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(circle, rgba(118,108,255,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
                <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '32px', padding: '48px', position: 'relative', zIndex: 1 }}>
                   <div style={{ textAlign: 'center' }}>
                      <p style={{ ...F, fontSize: '80px', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>99%</p>
                      <p style={{ ...M, fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '10px' }}>AVG PERFORMANCE SCORE</p>
                   </div>
                   <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
                      <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.8, fontStyle: 'italic', textAlign: 'center' }}>
                        &ldquo;ARIOSETECH transformed our legacy WordPress site into a high-performance sales machine. Their technical depth is unmatched.&rdquo;
                      </p>
                      <p style={{ ...F, fontSize: '13px', color: '#fff', fontWeight: 800, textAlign: 'center', marginTop: '16px' }}>— CEO, Dr. Scents</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────────── */}
      <section className="section" style={{ borderBottom: 'none' }}>
        <div className="container">
           <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <p className="eyebrow" style={{ justifyContent: 'center' }}>The Lifecycle</p>
              <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800 }}>Our <span style={P}>Seamless</span> Process</h2>
           </div>

           <div className="g-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '64px' }}>
              {PROCESS_STEPS.map((s, i) => (
                <div key={s.n} className="sr" style={{ animationDelay: `${i * 0.1}s` }}>
                   <p style={{ ...F, fontSize: '72px', fontWeight: 900, color: 'rgba(118,108,255,0.1)', lineHeight: 1, marginBottom: '16px' }}>{s.n}</p>
                   <p style={{ ...F, fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{s.title}</p>
                   <p style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 800, marginBottom: '12px' }}>{s.sub}</p>
                   <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
           <div className="g-2" style={{ gap: '80px' }}>
              <div className="sr">
                 <p className="eyebrow">FAQ</p>
                 <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800 }}>Common <span style={P}>Questions</span></h2>
                 <p style={{ fontSize: '16px', color: 'var(--text-2)', marginTop: '20px' }}>Everything you need to know about our WordPress development services.</p>
                 <Link href="/contact" className="btn btn-primary btn-lg" style={{ marginTop: '40px' }}>Ask a Question</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {FAQS.map((faq, i) => (
                   <div key={i} className="sr" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
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
      <section className="section" style={{ textAlign: 'center' }}>
         <div className="container">
            <h2 className="sr" style={{ ...F, fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.05em' }}>Ready to Scale Your <span style={P}>Business?</span></h2>
            <p className="sr" style={{ fontSize: '18px', color: 'var(--text-2)', maxWidth: '600px', margin: '24px auto 48px' }}>Join 100+ businesses that trust ARIOSETECH for their technical excellence and business growth.</p>
            <Link href="/contact" className="btn btn-primary btn-xl">Get Started Now <ArrowSVG size={18} /></Link>
         </div>
      </section>

    </main>
  )
}
