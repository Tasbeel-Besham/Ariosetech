/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link'
import ApproachSection from '@/components/sections/ApproachSection'
import { getCollection } from '@/lib/db/mongodb'
import { ServicePageDoc } from '@/types'

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const
const P  = { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as const

import { IconBox, CheckSVG, ArrowSVG, ChevSVG } from '@/components/ui/IconBox'

const ICONS: Record<string, React.ReactNode> = {
  expertise: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  performance: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  security: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  mobile: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
  support: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 19a6 6 0 0 0-12 0"/><circle cx="8" cy="9" r="4"/><path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8"/></svg>,
  pricing: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
}

interface Service {
  id: string;
  tagline: string;
  title: string;
  desc: string;
  price: string;
  time: string;
  cta: string;
  features: string[];
}

interface BackupPlan {
  tier: string;
  price: string;
  desc: string;
  features: string[];
}

interface WhyUsItem {
  title: string;
  desc: string;
  icon: string | React.ReactNode;
}

/* ── HERO DATA ────────────────────────────────────────────────────── */
const heroData = {
  eyebrow: "WordPress Solutions",
  headline: "Professional WordPress Development Services",
  subheadline: "Display Your Business Online with a WordPress Website",
  desc: "From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability.",
  bullets: ["Custom Development", "Lightning Fast (Core Web Vitals)", "100% Secure", "SEO-Ready", "24/7 Support"],
  ctaPrimary: "Get Free WordPress Consultation",
  ctaSecondary: "View WordPress Portfolio",
  startingPrice: "Starting at $799 · 30-Day Money-Back Guarantee · Free Post-Launch Support"
}

/* ── SERVICES DATA ─────────────────────────────────────────────────── */
const SERVICES: Service[] = [
  {
    id: "development",
    tagline: "Custom Architecture",
    title: "Website Development",
    desc: "Build your dream website from scratch with custom theme development, responsive design, and SEO-optimized structure designed to convert.",
    price: "$799",
    time: "2-3 Weeks",
    cta: "Start Your Project",
    features: ["Custom Theme Development", "Fully Responsive Design", "SEO-Optimized Structure", "Lead Generation Tools", "Post-Launch Support"]
  },
  {
    id: "migration",
    tagline: "Safe Transition",
    title: "Migration Services",
    desc: "Seamless migration with zero data loss or downtime. We handle the technical heavy lifting, including SSL installation and SEO preservation.",
    price: "$249",
    time: "2-3 Days",
    cta: "Migrate Now",
    features: ["Zero Data Loss Guarantee", "SSL Installation", "Database Optimization", "SEO Preservation", "DNS Configuration"]
  },
  {
    id: "bugs",
    tagline: "Priority Repair",
    title: "Bugs & Errors Fixing",
    desc: "Rapid resolution for 'White Screen of Death', 500 errors, database issues, and plugin conflicts that threaten your business continuity.",
    price: "$149",
    time: "24-48 Hours",
    cta: "Fix My Site",
    features: ["Critical Error Resolution", "Plugin Conflicts", "Database Repair", "Theme Bug Fixing", "Security Hardening"]
  },
  {
    id: "speed",
    tagline: "Core Web Vitals",
    title: "Speed Optimization",
    desc: "Improve site speed by 40-70%. We optimize images, configure CDNs, and perform server-level tuning for peak performance.",
    price: "$399",
    time: "5-7 Days",
    cta: "Boost My Speed",
    features: ["Image Optimization", "Advanced Caching", "CDN Configuration", "Database Cleaning", "Core Web Vitals Pass"]
  },
  {
    id: "security",
    tagline: "Cyber Defense",
    title: "Security Services",
    desc: "Protect your site from evolving threats with 24/7 threat monitoring, malware scanning, and proactive vulnerability assessments.",
    price: "$299",
    time: "3-5 Days",
    cta: "Secure My Site",
    features: ["24/7 Threat Monitoring", "Malware Scanning", "Vulnerability Assessment", "Firewall Configuration", "Security Auditing"]
  },
  {
    id: "redesign",
    tagline: "Conversion Focused",
    title: "Website Redesign",
    desc: "Modern, high-performance redesigns that transform outdated sites into lead-generation machines with improved UX/UI.",
    price: "$1,299",
    time: "3-4 Weeks",
    cta: "Redesign My Site",
    features: ["Modern UI/UX Design", "Performance Overhaul", "Mobile Optimization", "Content Migration", "Conversion Tracking"]
  },
  {
    id: "multilingual",
    tagline: "Global Reach",
    title: "Multilingual Sites",
    desc: "Reach international markets with WPML-powered multilingual WordPress solutions. Setup includes international SEO and language management.",
    price: "$899",
    time: "2-3 Weeks",
    cta: "Go Global",
    features: ["WPML/Polylang Setup", "International SEO", "Hreflang Implementation", "Multi-Currency Setup", "Translation Management"]
  },
  {
    id: "virus-removal",
    tagline: "Emergency Response",
    title: "Virus Removal",
    desc: "Emergency 24-48 hour service for infected sites. Complete malware scan, file cleaning, and Google Blacklist removal.",
    price: "$199",
    time: "24-48 Hours",
    cta: "Clean My Site",
    features: ["Malware Identification", "Infected File Cleaning", "Blacklist Removal", "Security Hardening", "30-Day Monitoring"]
  }
]

const backupPlans: BackupPlan[] = [
  {
    tier: "Basic Backup",
    price: "$29/mo",
    desc: "Daily automated protection",
    features: ["Daily Automated Backups", "30-Day Retention", "5GB Cloud Storage", "One-Click Restore", "Email Alerts"]
  },
  {
    tier: "Advanced Backup",
    price: "$59/mo",
    desc: "Real-time enterprise safety",
    features: ["Real-time Backups", "90-Day Retention", "50GB Cloud Storage", "Priority Restore", "Multiple Locations"]
  },
  {
    tier: "Enterprise Backup",
    price: "$99/mo",
    desc: "Custom infrastructure backup",
    features: ["Continuous Backups", "1-Year Retention", "Unlimited Storage", "Instant Recovery", "Dedicated Support"]
  }
]

const activeWhyUs: WhyUsItem[] = [
  {
    title: "7+ Years Expertise",
    desc: "Perfecting WordPress since 2017 with 50+ successful enterprise projects delivered globally.",
    icon: "expertise"
  },
  {
    title: "Custom Performance",
    desc: "Clean code and high-impact optimization without heavy page builders or bloated plugins.",
    icon: "performance"
  },
  {
    title: "Enterprise Security",
    desc: "Strict protocols from server-level hardening to application-layer protection and monitoring.",
    icon: "security"
  },
  {
    title: "SEO-First Architecture",
    desc: "Clean URL structures, metadata optimization, and schema markup built into the core.",
    icon: "mobile"
  },
  {
    title: "Dedicated Support",
    desc: "A long-term partnership with ongoing maintenance, scaling advice, and priority assistance.",
    icon: "support"
  }
]

const activeProcess = [
  { n: "01", title: "Discovery & Planning", sub: "2-3 Days", desc: "Detailed requirement analysis, technical specifications, and user-experience wireframes." },
  { n: "02", title: "Design & Development", sub: "1-2 Weeks", desc: "Custom theme creation, functionality coding, and seamless content integration." },
  { n: "03", title: "Testing & Optimization", sub: "3-5 Days", desc: "Exhaustive cross-browser testing, security auditing, and speed performance tuning." },
  { n: "04", title: "Launch & Support", sub: "Ongoing", desc: "Deployment, client training, and 30-day post-launch emergency support." }
]

const activeFaq = [
  { q: "How long does WordPress development take?", a: "Most projects are completed within 2-4 weeks, depending on complexity." },
  { q: "Do you provide WordPress hosting?", a: "We assist with setup and recommend the best providers optimized for WordPress performance." },
  { q: "Can I update the site myself?", a: "Yes, we provide full training and a user-friendly CMS interface for your team." },
  { q: "Is WordPress secure?", a: "Absolutely. With our hardening protocols and maintenance plans, your site remains enterprise-grade secure." },
  { q: "Will it be mobile-friendly?", a: "Yes, we use a mobile-first responsive approach for all WordPress developments." },
  { q: "Do you offer SEO services?", a: "Yes, all sites follow SEO best practices, with dedicated SEO growth services available." },
  { q: "Can you redesign my existing WordPress site?", a: "Yes, we specialize in high-performance redesigns that modernize your brand while preserving your SEO and content data." },
  { q: "What's included in post-launch support?", a: "Every project includes 30 days of free emergency support. Long-term maintenance plans are also available for ongoing growth." },
  { q: "Which page builders do you use?", a: "We prefer Gutenberg or Elementor for their flexibility and performance, depending on your project requirements." },
  { q: "How much do your maintenance plans cost?", a: "Our plans start at $79/mo for basic protection and go up to $299/mo for full enterprise infrastructure management." }
]

export default async function WordPressPage() {
  const dbData = await getCollection<ServicePageDoc>('services').then(col => col?.findOne({ slug: 'wordpress' }))
  
  const activeServices    = dbData?.services?.length ? dbData.services : SERVICES
  const activeFaqs        = dbData?.faqs?.length ? dbData.faqs : activeFaq
  const activeWhyUsData   = dbData?.whyUs?.length ? dbData.whyUs : activeWhyUs
  const activeProcessData = dbData?.process?.length ? dbData.process : activeProcess
  const activeMaintenance = dbData?.maintenancePlans?.length ? dbData.maintenancePlans : backupPlans // Fallback to backupPlans since I used that name in hardcoded
  const activeBackups     = dbData?.backupPlans?.length ? dbData.backupPlans : backupPlans
  const activePortfolio   = dbData?.portfolio?.length ? dbData.portfolio : [
    { industry: 'Professional Services', challenge: 'Modern design with complex functionality', solution: 'Custom WordPress theme with advanced features', result: '200%', resultLabel: 'increase in lead generation' },
    { industry: 'Retail', challenge: 'WordPress with e-commerce functionality', solution: 'WooCommerce integration with custom features', result: '150%', resultLabel: 'increase in online sales' },
    { industry: 'International Business', challenge: '5-language website with complex navigation', solution: 'WPML-powered multilingual WordPress site', result: '300%', resultLabel: 'increase in international inquiries' },
  ]
  
  const currentHeroData = dbData?.hero || heroData
  
  return (
    <>
      <section className="hero section--dark" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '120px 0 80px' }}>
        {/* Background Accents */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(118,108,255,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(79,110,247,0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="eyebrow sr" style={{ justifyContent: 'center', marginBottom: '24px' }}>{currentHeroData.eyebrow}</p>
            <h1 className="sr" style={{ ...hs, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.05em', marginBottom: '32px', color: '#fff' }}>
              {currentHeroData.headline} <br />
              <span style={P}>{currentHeroData.subheadline}</span>
            </h1>
            <p className="sr" style={{ fontSize: '20px', color: 'var(--text-2)', maxWidth: '800px', margin: '0 auto 48px', lineHeight: 1.7, animationDelay: '0.15s' }}>
              {currentHeroData.desc}
            </p>
            
            <div className="sr" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginBottom: '64px', animationDelay: '0.25s' }}>
              {(currentHeroData.bullets || []).map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconBox size={20} radius={6} style={{ border: 'none', background: 'rgba(118,108,255,0.15)' }}>
                    <CheckSVG size={10} />
                  </IconBox>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b}</span>
                </div>
              ))}
            </div>

            <div className="sr" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '40px', animationDelay: '0.3s' }}>
              <Link href="/contact" className="btn btn-primary btn-xl" style={{ boxShadow: '0 0 40px rgba(118,108,255,0.4)', borderRadius: '14px' }}>{currentHeroData.ctaPrimary} <ArrowSVG size={20} /></Link>
              <Link href="/portfolio" className="btn btn-outline btn-xl" style={{ borderRadius: '14px', backdropFilter: 'blur(10px)' }}>{currentHeroData.ctaSecondary}</Link>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--border)' }} />
              <p className="sr" style={{ ...hm, fontSize: '12px', color: 'var(--text-3)', animationDelay: '0.35s', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{currentHeroData.startingPrice?.split(' · ')[0]}</p>
              <div style={{ width: '40px', height: '1px', background: 'var(--border)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES SHOWCASE ─────────────────────────────────────────── */}
      <section className="section" style={{ padding: '160px 0', background: 'var(--bg)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <p className="eyebrow sr" style={{ justifyContent: 'center' }}>Tailored Expertise</p>
            <h2 className="sr glow-text" style={{ ...hs, fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.0, marginBottom: '24px' }}>
              Specialized <span style={P}>Verticals</span>
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>Beyond generic templates. We build bespoke digital infrastructures engineered for your specific objectives.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
            
            {/* 01. FLAGSHIP: CUSTOM DEVELOPMENT (Bento Grid Style) */}
            <div id={activeServices[0]?.id || "development"} className="sr">
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', alignItems: 'stretch' }}>
                  {/* Left: Main Content (8 cols) */}
                  <div className="tech-card shimmer-border" style={{ gridColumn: 'span 8', borderRadius: '32px', padding: '64px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--grad)' }} />
                    <div style={{ marginBottom: '40px' }}>
                      <span style={{ ...hm, fontSize: '11px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>01 / FLAGSHIP SERVICE</span>
                      <h3 style={{ ...hs, fontSize: '42px', fontWeight: 900, color: '#fff', marginTop: '16px', lineHeight: 1 }}>{activeServices[0]?.title}</h3>
                    </div>
                    <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '48px', maxWidth: '500px' }}>
                      {activeServices[0]?.desc}
                    </p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                       <Link href="/contact" className="btn btn-primary btn-lg" style={{ borderRadius: '12px' }}>{activeServices[0]?.cta || 'Get Started'} <ArrowSVG size={18}/></Link>
                       <div style={{ padding: '0 24px', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                         <span style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Starting at</span>
                         <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{activeServices[0]?.price}</span>
                       </div>
                    </div>
                  </div>

                  {/* Right: Tech Stack & Score (4 cols) */}
                  <div className="tech-card" style={{ gridColumn: 'span 4', borderRadius: '32px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                       <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '20px' }}>Engineered Stack</p>
                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                         {(activeServices[0]?.features || []).map(f => (
                           <span key={f} style={{ fontSize: '10px', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>{f}</span>
                         ))}
                       </div>
                    </div>
                    <div style={{ marginTop: 'auto', textAlign: 'center', padding: '32px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(118,108,255,0.1)' }}>
                       <div style={{ position: 'relative', display: 'inline-block' }}>
                          <svg width="100" height="100" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                             <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="283" strokeDashoffset="28" />
                          </svg>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px', fontWeight: 900, color: '#fff' }}>99</div>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '16px', fontWeight: 700 }}>Avg. Speed Score</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* 02. EMERGENCY: MALWARE REMOVAL (Cyber Terminal Style) */}
            <div id={activeServices[7]?.id || "virus-removal"} className="sr">
               <div style={{ background: '#08080c', border: '1px solid #1a1a25', borderRadius: '32px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: '#12121a', borderBottom: '1px solid #1a1a25', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4d6d' }} />
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5a0' }} />
                     <span style={{ fontSize: '10px', color: '#55557a', fontFamily: 'var(--font-mono)', marginLeft: '12px' }}>root@ariosetech:~/malware_scanner</span>
                  </div>
                  
                  <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
                     <div style={{ padding: '20px' }}>
                        <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '4px', marginBottom: '24px' }}>
                           <span style={{ fontSize: '10px', color: '#ff4d6d', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>EMERGENCY RESPONSE</span>
                        </div>
                        <h3 style={{ ...hs, fontSize: '36px', color: '#fff', marginBottom: '24px' }}>{activeServices[7]?.title || 'Virus Removal'}</h3>
                        <p style={{ color: '#7a7a9a', fontSize: '16px', lineHeight: 1.8, marginBottom: '40px' }}>
                           {activeServices[7]?.desc}
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                           {(activeServices[7]?.features || []).map(f => (
                              <li key={f} style={{ fontSize: '13px', color: '#b0b0cc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                 <div style={{ width: '4px', height: '4px', background: '#ff4d6d', borderRadius: '50%' }} /> {f}
                              </li>
                           ))}
                        </ul>
                     </div>

                     <div style={{ position: 'relative' }}>
                        <div style={{ background: '#0a0a0f', border: '1px solid #1a1a25', borderRadius: '20px', padding: '32px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#00e5a0', height: '280px', overflow: 'hidden' }}>
                           <div style={{ animation: 'scan 8s infinite linear' }}>
                              <p>&gt; INIT SCAN...</p>
                              <p>&gt; CHECKING /wp-content/plugins...</p>
                              <p style={{ color: '#ff4d6d' }}>! ALERT: Trojan.Generic FOUND</p>
                              <p>&gt; ISOLATING THREAT...</p>
                              <p>&gt; DECRYPTING PAYLOAD...</p>
                              <p>&gt; REMOVING INJECTED SQL...</p>
                              <p style={{ color: '#00e5a0' }}>&gt; SYSTEM CLEAN. REBOOTING...</p>
                           </div>
                           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,229,160,0.02) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', padding: '24px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                           <p style={{ fontSize: '10px', color: '#7a7a9a', textTransform: 'uppercase' }}>Starting At</p>
                           <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>{activeServices[7]?.price}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 03. PERFORMANCE: OPTIMIZATION (Sleek Data Style) */}
            <div id={activeServices[3]?.id || "speed"} className="sr">
               <div className="tech-card" style={{ borderRadius: '32px', padding: '64px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                     <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                        {[1,2,3].map(i => <div key={i} style={{ width: '40px', height: '4px', background: i === 3 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />)}
                     </div>
                     <h3 style={{ ...hs, fontSize: '38px', color: '#fff', marginBottom: '24px' }}>{activeServices[3]?.title || 'Speed Optimization'}</h3>
                     <p style={{ color: 'var(--text-2)', fontSize: '17px', lineHeight: 1.8, marginBottom: '40px' }}>
                        {activeServices[3]?.desc}
                     </p>
                     <div style={{ display: 'flex', gap: '32px' }}>
                        <div>
                           <p style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Investment</p>
                           <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{activeServices[3]?.price}</p>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border)' }} />
                        <div>
                           <p style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Execution</p>
                           <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{activeServices[3]?.time}</p>
                        </div>
                     </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(activeServices[3]?.features || []).map((f, idx) => (
                           <div key={f} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                 <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>{f}</span>
                                 <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 800 }}>{95 + idx}%</span>
                              </div>
                              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                 <div style={{ width: `${95 + idx}%`, height: '100%', background: 'var(--grad)', borderRadius: '2px' }} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* 04. MAINTENANCE PLANS (Pricing Grid) */}
            <div id="maintenance" className="sr">
               <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                  <h3 style={{ ...hs, fontSize: '32px', color: '#fff', marginBottom: '16px' }}>Maintenance & Support Plans</h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '15px' }}>Proactive care for your WordPress infrastructure.</p>
               </div>
               <div className="g-3">
                  {activeMaintenance.map((plan, i) => (
                     <div key={plan.tier} className="tech-card shimmer-border" style={{ padding: '40px', borderRadius: '24px', position: 'relative' }}>
                        {i === 1 && <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--grad)', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 800 }}>MOST POPULAR</div>}
                        <p style={{ ...hs, fontSize: '14px', color: 'var(--primary)', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>{plan.tier}</p>
                        <p style={{ ...hs, fontSize: '32px', color: '#fff', fontWeight: 900, marginBottom: '16px' }}>{plan.price}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '32px' }}>{/* @ts-ignore */ plan.desc || 'Optimized performance and security'}</p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                           {(plan.features || []).map(f => (
                              <li key={f} style={{ fontSize: '14px', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                 <IconBox size={18} radius={4} style={{ border: 'none', background: 'rgba(118,108,255,0.1)' }}>
                                    <CheckSVG size={8} />
                                 </IconBox>
                                 {f}
                              </li>
                           ))}
                        </ul>
                        <Link href="/contact" className={`btn ${i === 1 ? 'btn-primary' : 'btn-outline'} btn-lg`} style={{ width: '100%', justifyContent: 'center', borderRadius: '12px' }}>Subscribe Now</Link>
                     </div>
                  ))}
               </div>
            </div>

            {/* 05. ADDITIONAL SOLUTIONS GRID */}
            <div id="additional-services" className="sr" style={{ marginTop: '40px' }}>
               <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                  <h3 style={{ ...hs, fontSize: '32px', color: '#fff', marginBottom: '16px' }}>Additional WordPress Solutions</h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '15px' }}>Specific technical solutions for every stage of your site&apos;s lifecycle.</p>
               </div>
               <div className="g-2" style={{ gap: '24px' }}>
                  {[activeServices[4], activeServices[5], activeServices[6], activeServices[1], activeServices[2]].map((s: Service) => {
                    const iconMap: Record<string, React.ReactNode> = {
                      security: ICONS.security,
                      redesign: ICONS.expertise,
                      multilingual: ICONS.mobile,
                      migration: ICONS.support,
                      bugs: ICONS.security
                    }
                    if (!s) return null;
                    return (
                    <div key={s.id} id={s.id} className="tech-card" style={{ padding: '32px', borderRadius: '24px', display: 'flex', gap: '24px', alignItems: 'start' }}>
                       <IconBox size={40} radius={12} style={{ border: 'none', background: 'rgba(255,255,255,0.03)', flexShrink: 0 }}>
                          {iconMap[s.id] || ICONS.expertise}
                       </IconBox>
                       <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                             <h4 style={{ ...hs, fontSize: '18px', color: '#fff', fontWeight: 700 }}>{s.title}</h4>
                             <span style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 800 }}>{s.price}</span>
                          </div>
                          <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '16px' }}>{s.desc}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                             {(s.features || []).slice(0, 3).map(f => (
                               <span key={f} style={{ fontSize: '10px', color: 'var(--text-3)', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>{f}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                  )})}
               </div>
            </div>

            {/* 06. BACKUP SOLUTIONS */}
            <div id="backup" className="sr" style={{ marginTop: '40px' }}>
               <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                  <h3 style={{ ...hs, fontSize: '32px', color: '#fff', marginBottom: '16px' }}>Backup Solutions</h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '15px' }}>Never lose your data again with automated cloud recovery.</p>
               </div>
               <div className="g-3">
                  {activeBackups.map((plan, i) => (
                     <div key={plan.tier} className="tech-card" style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <p style={{ ...hs, fontSize: '13px', color: 'var(--text-3)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>{plan.tier}</p>
                        <p style={{ ...hs, fontSize: '28px', color: '#fff', fontWeight: 900, marginBottom: '16px' }}>{plan.price}</p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                           {(plan.features || []).map(f => (
                              <li key={f} style={{ fontSize: '13px', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                 <div style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%' }} />
                                 {f}
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── WHY ARIOSETECH ──────────────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
          <p className="eyebrow sr">Why Choose Us</p>
          <h2 className="sr" style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '48px', animationDelay: '0.1s' }}>
            Why Choose ARIOSETECH for WordPress Development?
          </h2>
          <div className="g-3" style={{ gap: '20px' }}>
            {activeWhyUsData.map((r: WhyUsItem, i: number) => {
              const Icon = typeof r.icon === 'string' ? ICONS[r.icon] : r.icon
              return (
              <div key={r.title} className="card card-hover sr" style={{ padding: '36px', animationDelay: `${i * 0.08}s`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)' }} />
                <IconBox size={48} radius={14} style={{ marginBottom: '20px' }}>
                  {Icon || ICONS.expertise}
                </IconBox>
                <p style={{ ...hs, fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>{r.title}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.8 }}>{r.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ── PROCESS ────────────────────────────────────────────────── */}
      <ApproachSection processItems={activeProcessData} title="WordPress Development Process" />

      {/* ── PORTFOLIO HIGHLIGHTS ──────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p className="eyebrow sr">Our Work</p>
              <h2 className="sr" style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', animationDelay: '0.1s' }}>
                WordPress Portfolio Highlights
              </h2>
            </div>
            <Link href="/portfolio" className="btn btn-outline btn-lg sr" style={{ animationDelay: '0.15s' }}>View Full WordPress Portfolio <ArrowSVG size={15} /></Link>
          </div>
          <div className="g-3" style={{ gap: '20px', marginBottom: '36px' }}>
            {activePortfolio.map((cs, i) => (
              <div key={i} className='card card-hover sr' style={{ background: 'var(--bg-3)', transition: 'all 0.3s var(--ease)', animationDelay: `${i * 0.1}s`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--grad)' }} />
                <div style={{ padding: '36px' }}>
                  <p style={{ ...hm, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '16px' }}>{cs.industry || cs.name}</p>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Challenge</p>
                    <p style={{ ...hs, fontSize: '15px', color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>{cs.challenge}</p>
                  </div>
                  
                  <div style={{ marginBottom: '32px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Solution</p>
                    <p style={{ ...hs, fontSize: '15px', color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>{cs.solution}</p>
                  </div>
 
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                    <p style={{ ...hs, fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{cs.result}</p>
                    <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{cs.resultLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="section section--dark" style={{ overflow: 'visible' }}>
        <div className="container">
          <div className="g-2" style={{ gap: '80px', alignItems: 'start' }}>
            <div className="sr sticky-mobile-fix" style={{ position: 'sticky', top: '100px' }}>
              <p className="eyebrow">FAQ</p>
              <h2 style={{ ...hs, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px' }}>
                WordPress Development <span style={P}>FAQ</span>
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>
                Everything you need to know about our WordPress approach and how we help businesses grow online.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Ask Us Anything <ArrowSVG size={15} /></Link>
              <p style={{ ...hm, fontSize: '12px', color: 'var(--text-3)', marginTop: '24px', fontStyle: 'italic', letterSpacing:'0.05em' }}>
                30-day money-back guarantee | Free training
              </p>
            </div>
 
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeFaqs.map((faq, i) => (
                <div key={i} className="sr" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s var(--ease)', animationDelay:`${i*0.06}s` }}>
                  <details style={{ width:'100%' }}>
                    <summary style={{ padding: '24px 28px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      <span style={{ ...hs, fontSize: '16px', fontWeight: 700, color: '#fff', flex: 1, lineHeight: 1.4 }}>{faq.q}</span>
                      <div style={{ color:'var(--primary)', flexShrink:0 }}><ChevSVG size={14} /></div>
                    </summary>
                    <div style={{ padding: '0 28px 24px' }}>
                      <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8 }}>{faq.a}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(79,110,247,0.1) 0%, transparent 80%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.3 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sr">
            <p className="eyebrow" style={{ justifyContent:'center' }}>Get Started Today</p>
            <h2 style={{ ...hs, fontSize: 'clamp(2.4rem,6vw,4.5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.05em', marginBottom: '24px', color:'#fff' }}>
              Ready to Build Your<br />
              <span style={P}>WordPress Site?</span>
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.8 }}>
              Whether you are migrating, launching a new site, or needing ongoing support, Ariosetech is ready to help you succeed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary btn-lg">Start Your Project <ArrowSVG size={15} /></Link>
              <Link href="/portfolio" className="btn btn-outline btn-lg">View Our Work</Link>
            </div>
            <p style={{ ...hm, fontSize: '12px', color: 'var(--text-3)', marginTop: '32px', fontStyle: 'italic', letterSpacing:'0.05em' }}>
              Tell us your vision, and we&apos;ll help you map the next move.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
