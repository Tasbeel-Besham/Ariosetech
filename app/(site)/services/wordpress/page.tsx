/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { getCollection } from '@/lib/db/mongodb'
import { PageDoc } from '@/types'
import { notFound } from 'next/navigation'
import ApproachSection from '@/components/sections/ApproachSection'
import ServicesAccordionSection from '@/components/builder/sections/ServicesAccordionSection'
import { IconBox, StandardCheck, ArrowSVG, ChevSVG, SecuritySVG, MigrationSVG, SpeedSVG, RedesignSVG, CodeSVG, GlobeSVG } from '@/components/ui/IconBox'

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
  icon: React.ReactNode;
  title: string;
  subhead: string;
  desc: string;
}

// ── DATA — Verbatim from Google Doc ───────────────────────────────

const HERO_DATA = {
  eyebrow: "Standard-Setting WordPress Expertise",
  headline: "Premium WordPress",
  subheadline: "Development Services",
  desc: "Ariosetech helps businesses build, scale, and secure their digital presence with custom WordPress solutions. From technical foundations to high-performance e-commerce, we build websites that deliver results.",
  bullets: ["Website Development", "Speed Optimization", "Security Services", "Migration Support"],
  ctaPrimary: "Book a Free Consultation",
  ctaSecondary: "View Our Portfolio",
}

const WP_FLAGSHIP: Service[] = [
  {
    id: "development",
    tagline: "Custom Theme Development",
    title: "WordPress Development",
    desc: "Build your dream website from scratch. Our custom development approach ensures your site stands out while delivering exceptional user experience.",
    features: ["Custom theme development", "Responsive design", "SEO-optimized structure", "30-day money-back guarantee", "30 days free support"],
    price: "$799",
    timeline: "2-4 weeks",
    href: "/contact",
    icon: <CodeSVG />
  },
  {
    id: "migration",
    tagline: "Seamless Data Transfer",
    title: "Migration Services",
    desc: "Moving to WordPress or changing hosts? We handle the entire migration process ensuring zero data loss and minimal downtime.",
    features: ["Complete data migration", "SEO preservation", "Image & media transfer", "Plugin replication", "Database optimization"],
    price: "$249",
    timeline: "2-4 days",
    href: "/contact",
    icon: <MigrationSVG />
  },
  {
    id: "maintenance",
    tagline: "Ongoing Performance",
    title: "Maintenance & Support",
    desc: "Focus on your business while we handle the technical side. Regular updates, security monitoring, and performance checks.",
    features: ["Plugin & theme updates", "Security monitoring", "Uptime tracking", "Performance optimization", "Technical support"],
    price: "$79/mo",
    timeline: "Ongoing",
    href: "/contact",
    icon: <SecuritySVG />
  },
  {
    id: "backup",
    tagline: "Cloud Redundancy",
    title: "Backup Solutions",
    desc: "Enterprise-grade cloud backup solutions to ensure your data is always safe and recoverable with one click.",
    features: ["Daily/Hourly backups", "Off-site storage", "One-click restore", "Data encryption", "24/7 recovery support"],
    price: "$29/mo",
    timeline: "24/7",
    href: "/contact",
    icon: <MigrationSVG />
  }
]

const SECURITY_SERVICE: Service = {
  id: "security",
  tagline: "Enterprise Security Hardening",
  title: "WordPress Security Services",
  desc: "Protect your site from hackers and malware. Ideal for e-commerce and sensitive data sites. We implement multi-layer security protocols to protect your reputation.",
  features: ["24/7 threat monitoring", "Automatic malware removal", "Firewall & login protection", "SSL certificate setup", "Weekly security reports"],
  price: "$299",
  timeline: "3-5 days",
  href: "/contact",
  icon: <SecuritySVG />
}

const SPEED_SERVICE: Service = {
  id: "optimization",
  tagline: "Performance Optimization",
  title: "WordPress Speed Optimization",
  desc: "Boost your site speed by 40-70%. We optimize images, implement caching, and perform server-level tuning for peak performance that improves rankings.",
  features: ["Core Web Vitals improvement", "Image optimization & WebP", "Database cleanup", "CDN implementation", "Performance report"],
  price: "$399",
  timeline: "24-48 hours",
  href: "/contact",
  icon: <SpeedSVG />
}

const ADDITIONAL_SERVICES: Service[] = [
  { id: "redesign", title: "Website Redesign", desc: "Give your site a modern makeover without losing SEO or content.", features: ["Modern UI/UX", "SEO preservation"], price: "$1,299", href: "/contact", icon: <RedesignSVG /> },
  { id: "bugfixing", title: "Bug Fixing", desc: "Quick resolution for critical issues like WSOD and server errors.", features: ["Critical fixes", "Plugin conflicts"], price: "$149", href: "/contact", icon: <CodeSVG /> },
  { id: "multilingual", title: "Multilingual Setup", desc: "Expand your reach with WPML or Polylang global solutions.", features: ["Global reach", "SEO translation"], price: "Custom", href: "/contact", icon: <GlobeSVG /> }
]

const WHY_US_ITEMS: WhyUsItem[] = [
  { icon: <CodeSVG />, title: "Performance-First Code", subhead: "Speed is our Priority", desc: "Every line of code is written with speed in mind, ensuring 95+ PageSpeed scores." },
  { icon: <SecuritySVG />, title: "Security Hardened", subhead: "Protecting Your Assets", desc: "Multi-layer security protocols included in every build to keep your data safe." },
  { icon: <RedesignSVG />, title: "Custom Solutions", subhead: "No Generic Themes", desc: "We build tailored WordPress themes that align perfectly with your brand identity." },
  { icon: <ArrowSVG />, title: "Supportive Partnership", subhead: "We Grow with You", desc: "Ongoing maintenance and priority support long after your website goes live." }
]

const FAQS: FAQItem[] = [
  { q: "How long does a WordPress build take?", a: "Typically 2-4 weeks depending on complexity. We provide a detailed timeline after our initial consultation." },
  { q: "Do you use page builders like Elementor?", a: "We specialize in custom, lightweight development using Gutenberg or custom code for better performance and long-term stability." },
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

  // Map flagship to accordion format
  const accordionItems = WP_FLAGSHIP.map((svc, i) => ({
    id: svc.id,
    label: svc.title.split(' ')[1] || svc.title,
    title: svc.title,
    sub: svc.tagline || '',
    desc: svc.desc,
    features: svc.features,
    price: svc.price,
    href: svc.href,
    bg: i % 2 === 0 ? 'var(--bg-3)' : 'var(--bg-2)',
    icon: svc.icon
  }))

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ padding: '160px 0 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50%', height: '70%', background: 'radial-gradient(ellipse, rgba(118,108,255,0.08) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px 5px 10px', borderRadius: '20px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />
            <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{HERO_DATA.eyebrow}</span>
          </div>

          <h1 style={{ ...F, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.05em', marginBottom: '8px', maxWidth: '900px' }}>
            {HERO_DATA.headline}
          </h1>
          <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.05em', marginBottom: '32px', maxWidth: '900px', ...P }}>
            {HERO_DATA.subheadline}
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '640px', marginBottom: '40px' }}>
            {HERO_DATA.desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
            {HERO_DATA.bullets.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.2)', borderRadius: '20px', padding: '6px 16px' }}>
                 <StandardCheck size={16} />
                 <span style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.06em' }}>{b}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-xl">{HERO_DATA.ctaPrimary} <ArrowSVG size={18} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-xl">{HERO_DATA.ctaSecondary}</Link>
          </div>
        </div>
      </section>

      {/* ── FLAGSHIP ACCORDION ────────────────────────────────────────── */}
      <ServicesAccordionSection 
        eyebrow="Core Expertise"
        headline="Complete WordPress Solutions"
        intro="We specialize in custom theme development, performance tuning, and enterprise-grade security."
        items={accordionItems}
      />

      {/* ── ZIGZAG 1: SECURITY (Terminal Visual) ─────────────────────── */}
      <section className="section" style={{ padding: '120px 0' }}>
        <div className="container">
           <div className="g-2" style={{ gap: '80px', alignItems: 'center' }}>
              <div className="sr">
                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <IconBox size={44} radius={12}>
                       {SECURITY_SERVICE.icon}
                    </IconBox>
                    <span className="status-badge status-badge--new" style={{ fontSize: '10px' }}>{SECURITY_SERVICE.tagline}</span>
                 </div>
                 <h2 style={{ ...F, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '24px' }}>Bulletproof <span style={P}>Security</span></h2>
                 <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>{SECURITY_SERVICE.desc}</p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                    {SECURITY_SERVICE.features.map(f => (
                       <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-3)' }}>
                          <StandardCheck size={18} />
                          {f}
                       </div>
                    ))}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <p style={{ ...F, fontSize: '24px', color: '#fff' }}>{SECURITY_SERVICE.price}</p>
                    <span className="tag">{SECURITY_SERVICE.timeline}</span>
                    <Link href="/contact" className="btn btn-primary btn-md" style={{ marginLeft: 'auto' }}>Secure My Site</Link>
                 </div>
              </div>
              <div className="sr" style={{ background: '#000', border: '1px solid rgba(118,108,255,0.2)', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
                 <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 3px' }} />
                 <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                    {[1,2,3].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i===1?'#ff5f56':i===2?'#ffbd2e':'#27c93f' }} />)}
                 </div>
                 <div style={{ ...M, fontSize: '13px', color: '#0f0', lineHeight: 1.6 }}>
                    <p>{'>'} arisotech@defender:~$ run security-audit</p>
                    <p style={{ color: '#fff', opacity: 0.7, marginTop: '8px' }}>[SCANNING DATABASE...]</p>
                    <p style={{ color: '#fff', opacity: 0.7 }}>[VULNERABILITY CHECK: 0 ISSUES]</p>
                    <p style={{ color: '#fff', opacity: 0.7 }}>[FIREWALL: ACTIVE]</p>
                    <p style={{ color: '#fff', opacity: 0.7 }}>[SSL HANDSHAKE: SUCCESSFUL]</p>
                    <p style={{ marginTop: '8px', fontWeight: 800 }}>STATUS: PROTECTED ✓</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── ZIGZAG 2: OPTIMIZATION (Gauge Visual) ─────────────────────── */}
      <section className="section section--dark" style={{ padding: '120px 0' }}>
        <div className="container">
           <div className="g-2" style={{ gap: '80px', alignItems: 'center' }}>
              <div className="sr" style={{ position: 'relative' }}>
                 <div style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(circle, rgba(118,108,255,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                 <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '32px', padding: '64px', position: 'relative', textAlign: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
                    <div style={{ width: '160px', height: '160px', borderRadius: '50%', border: '10px solid rgba(118,108,255,0.1)', borderTopColor: 'var(--primary)', position: 'relative', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <p style={{ ...F, fontSize: '48px', fontWeight: 900 }}>99</p>
                       <div style={{ position: 'absolute', bottom: '-24px', ...M, fontSize: '12px', color: 'var(--primary)', fontWeight: 800 }}>SPEED SCORE</div>
                    </div>
                    <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                       <div><p style={{ ...F, fontSize: '20px' }}>0.2s</p><p style={{ ...M, fontSize: '10px', color: 'var(--text-3)' }}>RESPONSE</p></div>
                       <div><p style={{ ...F, fontSize: '20px' }}>Pass</p><p style={{ ...M, fontSize: '10px', color: 'var(--text-3)' }}>VITALS</p></div>
                    </div>
                 </div>
              </div>
              <div className="sr">
                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <IconBox size={44} radius={12}>
                       {SPEED_SERVICE.icon}
                    </IconBox>
                    <span className="status-badge status-badge--new" style={{ fontSize: '10px' }}>{SPEED_SERVICE.tagline}</span>
                 </div>
                 <h2 style={{ ...F, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '24px' }}>Lightning <span style={P}>Fast</span> Speeds</h2>
                 <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>{SPEED_SERVICE.desc}</p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '40px' }}>
                    {SPEED_SERVICE.features.map(f => (
                       <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--text-3)' }}>
                          <StandardCheck size={20} />
                          {f}
                       </div>
                    ))}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <p style={{ ...F, fontSize: '24px', color: '#fff' }}>{SPEED_SERVICE.price}</p>
                    <span className="tag">{SPEED_SERVICE.timeline}</span>
                    <Link href="/contact" className="btn btn-outline btn-md" style={{ marginLeft: 'auto' }}>Optimize My Site</Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── ADDITIONAL SERVICES ───────────────────────────────────────── */}
      <section className="section">
        <div className="container">
           <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <p className="eyebrow" style={{ justifyContent: 'center' }}>Specialized Solutions</p>
              <h2 style={{ ...F, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>More WordPress <span style={P}>Services</span></h2>
           </div>
           <div className="g-3">
              {ADDITIONAL_SERVICES.map((s, i) => (
                <div key={s.id} className="sr" style={{ padding: '32px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '24px', transition: 'all 0.3s var(--ease)', animationDelay: `${i * 0.05}s`, position: 'relative', overflow: 'hidden' }}>
                   <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)', opacity: 0.5 }} />
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <IconBox size={48} radius={12}>
                         {s.icon}
                      </IconBox>
                      <p style={{ ...F, fontSize: '18px', color: 'var(--primary)' }}>{s.price}</p>
                   </div>
                   <h3 style={{ ...F, fontSize: '20px', marginBottom: '12px' }}>{s.title}</h3>
                   <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '24px' }}>{s.desc}</p>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {s.features.map(f => (
                         <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-2)' }}>
                            <StandardCheck size={16} />
                            {f}
                         </div>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US (SEO Style) ────────────────────────────────── */}
      <section className="section section--dark" style={{ overflow: 'visible' }}>
        <div className="container">
           <div className="g-2" style={{ gap: '80px', alignItems: 'start' }}>
              <div className="sr sticky-mobile-fix" style={{ position: 'sticky', top: '100px' }}>
                 <p className="eyebrow">Why Choose Us</p>
                 <h2 style={{ ...F, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '24px' }}>The Ariosetech <span style={P}>Standard</span></h2>
                 <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>We combine technical excellence with a business-first mindset to deliver WordPress sites that don&apos;t just look good, but perform exceptionally.</p>
                 <Link href="/contact" className="btn btn-primary btn-lg">Start Your Project <ArrowSVG size={18} /></Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                 {WHY_US_ITEMS.map((item, i) => (
                   <div key={item.title} className="sr" style={{ display: 'flex', gap: '20px', padding: '28px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '24px', transition: 'all 0.3s var(--ease)', animationDelay: `${i * 0.08}s`, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)', opacity: 0.6 }} />
                      <IconBox size={52} radius={14}>
                         {item.icon}
                      </IconBox>
                      <div>
                         <p style={{ ...F, fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{item.title}</p>
                         <p style={{ ...M, fontSize: '10px', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase' }}>{item.subhead}</p>
                         <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.7 }}>{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── FAQ (Accordion Style) ────────────────────────────────────── */}
      <section className="section">
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
      <section className="section section--dark" style={{ textAlign: 'center', position: 'relative' }}>
         <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(118,108,255,0.08) 0%, transparent 80%)', pointerEvents: 'none' }} />
         <div className="container">
            <h2 className="sr" style={{ ...F, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900 }}>Ready to Scale Your <span style={P}>Business?</span></h2>
            <p className="sr" style={{ fontSize: '18px', color: 'var(--text-2)', maxWidth: '600px', margin: '24px auto 48px' }}>Join 100+ businesses that trust ARIOSETECH for their technical excellence and business growth.</p>
            <Link href="/contact" className="btn btn-primary btn-xl">Get Started Now <ArrowSVG size={18} /></Link>
         </div>
      </section>

    </main>
  )
}
