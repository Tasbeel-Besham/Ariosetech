/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link'
import ApproachSection from '@/components/sections/ApproachSection'
import { getCollection } from '@/lib/db/mongodb'
import { ServicePageDoc } from '@/types'

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const
const P  = { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as const

const ArrowSVG = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const CheckSVG = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ICONS = {
  expertise: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  performance: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  security: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  mobile: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
  support: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 19a6 6 0 0 0-12 0"/><circle cx="8" cy="9" r="4"/><path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8"/></svg>,
  pricing: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
}

/* ── SERVICES DATA ─────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'development',
    title: 'WordPress Website Development',
    tagline: 'Build Your Dream Website from Scratch',
    price: '$799',
    time: '2–3 weeks',
    desc: 'Transform your vision into a stunning, high-performing WordPress website. Our custom development approach ensures your site stands out from the competition while delivering exceptional user experience.',
    features: ['Custom theme development from your designs', 'Responsive design across all devices', 'SEO-optimized structure and content', 'Contact forms and lead generation tools', 'Social media integration', 'Google Analytics setup', 'Basic on-page SEO optimization', '30 days of free support'],
    perfectFor: ['New businesses launching online', 'Companies needing complete website overhaul', 'Brands requiring unique, custom designs', 'Businesses with specific functionality requirements'],
    cta: 'Get Started',
  },
  {
    id: 'migration',
    title: 'WordPress Migration Services',
    tagline: 'Seamless Migration Without Downtime',
    price: '$299',
    time: '3–5 days',
    desc: 'Moving to WordPress or changing hosts? We handle the entire migration process while ensuring zero data loss and minimal downtime. Your SEO rankings and user experience remain intact.',
    features: ['Complete site backup and migration', 'Domain and hosting setup assistance', 'SSL certificate installation', 'Email migration (if required)', 'Speed and performance optimization', 'SEO preservation techniques', 'Testing across all devices', '14 days of post-migration support'],
    perfectFor: ['Sites moving from Wix, Squarespace, etc.', 'WordPress to WordPress migrations', 'Hosting provider changes', 'Development to live site transfers'],
    cta: 'Migrate My Site',
  },
  {
    id: 'bugs',
    title: 'WordPress Bug & Error Fixing',
    tagline: 'Quick Resolution for WordPress Issues',
    price: '$149',
    time: '24–48 hours',
    desc: 'Is your WordPress site showing errors, broken pages, or strange behavior? Our experts diagnose and fix issues quickly, getting your site back to peak performance.',
    features: ['White screen of death & 500 error fixes', 'Database connection error resolution', 'Plugin conflicts and compatibility fixes', 'Theme-related problem solving', 'Broken layouts and design fixes', 'Login and admin access restoration', 'Email functionality fixes', '7 days of post-fix monitoring'],
    perfectFor: ['Sites experiencing sudden errors', 'Businesses losing revenue due to downtime', 'WordPress sites with plugin conflicts', 'Emergency fixes needed urgently'],
    cta: 'Fix My Site Now',
  },
  {
    id: 'maintenance',
    title: 'WordPress Maintenance & Support',
    tagline: 'Keep Your WordPress Site Running Smoothly',
    price: '$79/mo',
    time: 'Ongoing',
    desc: 'Regular maintenance is crucial for WordPress security, performance, and reliability. Our comprehensive maintenance plans ensure your site stays updated, secure, and optimized.',
    features: ['WordPress core, theme & plugin updates', 'Security monitoring and malware scans', 'Database optimization and cleanup', 'Broken link checks and fixes', 'Performance monitoring and reporting', 'Regular backups (stored securely)', 'Uptime monitoring', 'Priority support for issues'],
    perfectFor: [],
    cta: 'Choose Your Plan',
    plans: [
      { tier: 'Basic Plan', price: '$79/month', features: ['1 WordPress site', 'Monthly updates and backups', 'Basic security monitoring', 'Email support'] },
      { tier: 'Professional Plan', price: '$149/month', features: ['Up to 3 WordPress sites', 'Weekly updates and backups', 'Advanced security features', 'Performance optimization', 'Priority email & chat support'] },
      { tier: 'Enterprise Plan', price: '$299/month', features: ['Up to 10 WordPress sites', 'Real-time monitoring', 'Advanced security & malware removal', 'Speed optimization', '24/7 priority support', 'Monthly performance reports'] },
    ],
  },
  {
    id: 'speed',
    title: 'WordPress Speed Optimization',
    tagline: 'Make Your WordPress Site Lightning Fast',
    price: '$399',
    time: '5–7 days',
    desc: 'Slow websites lose customers and hurt search rankings. Our speed optimization service can improve your site speed by 40–70%, leading to better user experience and higher conversions.',
    features: ['Comprehensive speed audit and analysis', 'Image optimization and compression', 'Caching implementation and configuration', 'Database optimization and cleanup', 'CSS and JavaScript minification', 'CDN setup and configuration', 'Core Web Vitals optimization', 'Mobile speed improvements'],
    results: ['40–70% faster loading times', 'Improved Google PageSpeed scores', 'Better Core Web Vitals', 'Enhanced user experience', 'Higher search engine rankings'],
    perfectFor: [],
    cta: 'Speed Up My Site',
  },
  {
    id: 'security',
    title: 'WordPress Security Services',
    tagline: 'Protect Your WordPress Site from Threats',
    price: '$299',
    time: '3–5 days',
    desc: 'WordPress security is not optional. Our comprehensive security service protects your site from hackers, malware, and other threats while ensuring compliance with security best practices.',
    features: ['Malware scanning and removal', 'Firewall installation and configuration', 'Security plugin setup and optimization', 'Login security enhancements', 'File permission optimization', 'Database security improvements', 'SSL certificate installation', 'Security headers implementation'],
    perfectFor: ['E-commerce websites', 'Sites handling sensitive data', 'Businesses requiring compliance', 'Sites previously hacked', 'High-traffic WordPress sites'],
    cta: 'Secure My Site',
  },
  {
    id: 'virus-removal',
    title: 'WordPress Virus Removal',
    tagline: 'Fast and Complete Malware Removal',
    price: '$199',
    time: '24–48 hours',
    desc: 'Is your WordPress site infected with malware or viruses? We provide emergency malware removal services to get your site clean and secure quickly.',
    features: ['Complete malware scan and removal', 'Infected file cleaning or replacement', 'Database cleanup and optimization', 'Security plugin installation', 'Firewall configuration', 'Google Safe Browsing removal', 'Security recommendations', '30-day monitoring period'],
    perfectFor: ['Sites flagged by Google as dangerous', 'Hacked WordPress websites', 'Sites with unknown malware', 'Emergency malware removal'],
    cta: 'Remove Malware Now',
  },
  {
    id: 'backup',
    title: 'WordPress Backup Solutions',
    tagline: 'Never Lose Your WordPress Data Again',
    price: '$29/mo',
    time: 'Ongoing',
    desc: 'Protect your valuable content and data with automated, reliable backup solutions. Our backup service ensures you can restore your site quickly in case of any emergency.',
    features: ['Automated daily backups', 'Multiple backup storage locations', 'One-click restore functionality', 'Database and file backups', 'Incremental backup options', 'Encrypted secure storage', 'Easy backup management', 'Email notifications'],
    perfectFor: [],
    cta: 'Setup Backups',
    plans: [
      { tier: 'Basic Backup', price: '$29/month', features: ['Daily automated backups', '30-day backup retention', 'One-click restore', 'Email notifications'] },
      { tier: 'Advanced Backup', price: '$59/month', features: ['Real-time backups', '90-day backup retention', 'Multiple restore points', 'Priority restoration support', 'Multiple storage locations'] },
      { tier: 'Enterprise Backup', price: '$99/month', features: ['Continuous backups', '1-year backup retention', 'Instant recovery options', 'Dedicated backup support', 'Custom backup schedules'] },
    ],
  },
  {
    id: 'redesign',
    title: 'WordPress Website Redesign',
    tagline: 'Give Your WordPress Site a Fresh New Look',
    price: '$1,299',
    time: '3–4 weeks',
    desc: 'Is your WordPress site looking outdated? Our redesign service transforms your existing site with modern design, improved functionality, and a better user experience.',
    features: ['Modern, responsive design', 'Improved user experience', 'SEO optimization & speed improvement', 'Mobile-first approach', 'Content migration', 'Competitor analysis included', 'User experience audit', '30 days of support'],
    perfectFor: ['Businesses with outdated websites', 'Companies wanting better conversions', 'Brands needing a modern refresh', 'Sites with poor mobile experience'],
    cta: 'Redesign My Site',
  },
  {
    id: 'multilingual',
    title: 'WordPress Multilingual Websites',
    tagline: 'Reach Global Audiences with Multilingual WordPress',
    price: '$899',
    time: '2–3 weeks',
    desc: 'Expand your business globally with professionally developed multilingual WordPress websites. We create seamless multi-language experiences that engage international audiences.',
    features: ['Multiple language setup and configuration', 'Professional translation management', 'SEO optimization for each language', 'Currency switcher integration', 'Language-specific content management', 'Automatic language detection', 'Multilingual menu and navigation', 'International SEO setup'],
    perfectFor: ['International businesses', 'E-commerce stores selling globally', 'Service providers with global clientele', 'Organizations serving diverse communities'],
    cta: 'Go Multilingual',
  },
]

const PROCESS = [
  { n: '01', title: 'Discovery & Planning', sub: 'Understand Your Vision', desc: 'Detailed requirement analysis, technical specifications, design wireframes, and project timeline.', time: '2–3 days' },
  { n: '02', title: 'Design & Development', sub: 'Blueprint for Success', desc: 'Custom theme creation, functionality development, responsive design, and content integration.', time: '1–2 weeks' },
  { n: '03', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Cross-browser testing, mobile responsiveness check, speed optimization, and security testing.', time: '3–5 days' },
  { n: '04', title: 'Launch & Support', sub: 'Your Success, Our Priority', desc: 'Live deployment, training session, 30-day support period, and maintenance planning.', time: 'Ongoing' },
]

const FAQS = [
  { q: 'How long does WordPress development take?', a: 'Most WordPress projects are completed within 2–4 weeks, depending on complexity and requirements.' },
  { q: 'Do you provide WordPress hosting?', a: 'We can recommend reliable hosting providers and assist with setup, but we focus on development rather than hosting services.' },
  { q: 'Can you work with existing WordPress sites?', a: 'Absolutely! We provide maintenance, optimization, and enhancement services for existing WordPress websites.' },
  { q: "What's included in post-launch support?", a: 'All WordPress projects include 30 days of free support covering bug fixes, minor adjustments, and training.' },
  { q: 'Do you use WordPress page builders?', a: 'We prefer custom development for better performance, but can work with page builders like Elementor or Gutenberg when requested.' },
  { q: 'How much does WordPress maintenance cost?', a: 'Our maintenance plans start at $79/month and include updates, backups, security monitoring, and support.' },
]

export default async function WordPressPage() {
  let dbData: Partial<ServicePageDoc> | null = null
  try {
    const col = await getCollection<ServicePageDoc>('services')
    dbData = await col.findOne({ slug: 'wordpress' })
  } catch {}

  const activeServices = dbData?.services?.length ? dbData.services : SERVICES
  const activeProcess = dbData?.process?.length ? dbData.process : PROCESS
  const activeFaqs = dbData?.faqs?.length ? dbData.faqs : FAQS
  const activeWhyUs = dbData?.whyUs?.length ? dbData.whyUs : [
    { icon: 'expertise', title: '7+ Years WordPress Expertise', desc: "We've been perfecting WordPress development since 2017, delivering 50+ successful WordPress projects across various industries." },
    { icon: 'performance', title: 'Performance-First Approach', desc: 'Every WordPress site we build is optimized for speed, security, and search engines from day one.' },
    { icon: 'security', title: 'Security-Focused Development', desc: 'We implement enterprise-grade security measures to protect your WordPress site from threats.' },
    { icon: 'mobile', title: 'Mobile-First Design', desc: 'All our WordPress sites are built with mobile users in mind, ensuring perfect performance across all devices.' },
    { icon: 'support', title: 'Ongoing Support', desc: "We don't just build and leave. Our team provides continuous support to ensure your WordPress site thrives." },
    { icon: 'pricing', title: 'Transparent Pricing', desc: 'No hidden costs or surprise fees. Our WordPress development pricing is upfront and honest.' },
  ]
  const heroData = dbData?.hero || {
    eyebrow: 'WordPress Services',
    headline: 'Professional WordPress',
    subheadline: 'Development Services',
    desc: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability.',
    bullets: [
      'Custom Development — Tailored to your exact needs',
      'Lightning Fast — Optimized for Core Web Vitals',
      '100% Secure — Enterprise-grade security',
      'SEO-Ready — Built for search engine success',
      '24/7 Support — Always here when you need us'
    ],
    ctaPrimary: 'Get Free WordPress Consultation',
    ctaSecondary: 'View WordPress Portfolio',
    startingPrice: 'Starting at $799 · 30-Day Money-Back Guarantee · Free Post-Launch Support'
  }
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ borderBottom: '1px solid var(--border)', paddingTop: '72px', paddingBottom: '64px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '70%', background: 'radial-gradient(ellipse, rgba(79,110,247,0.14) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow sr">{heroData.eyebrow}</p>
          <h1 className="sr" style={{ ...hs, fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em', marginBottom: '8px', maxWidth: '800px' }}>
            {heroData.headline}
          </h1>
          <h1 className="sr" style={{ ...hs, fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em', marginBottom: '20px', maxWidth: '800px', ...P, animationDelay: '0.1s' }}>
            {heroData.subheadline}
          </h1>
          <p className="sr" style={{ ...hs, fontSize: '17px', fontWeight: 600, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '600px', marginBottom: '8px', animationDelay: '0.15s' }}>
            Display Your Business Online with a WordPress Website
          </p>
          <p className="sr" style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.8, maxWidth: '580px', marginBottom: '24px', animationDelay: '0.2s' }}>
            {heroData.desc}
          </p>
          <div className="sr" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px', animationDelay: '0.25s' }}>
            {heroData.bullets?.map((b: string) => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--primary)', flexShrink: 0, display:'flex' }}><CheckSVG size={14} /></span>
                <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{b}</span>
              </div>
            ))}
          </div>
          <div className="sr" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', animationDelay: '0.3s' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">{heroData.ctaPrimary} <ArrowSVG size={16} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg">{heroData.ctaSecondary}</Link>
          </div>
          <p className="sr" style={{ ...hm, fontSize: '12px', color: 'var(--text-3)', animationDelay: '0.35s' }}>{heroData.startingPrice}</p>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section className="section" style={{ padding: '120px 0', background: 'var(--bg)' }}>
        <div className="container">
          <p className="eyebrow sr" style={{ justifyContent: 'center' }}>All Services</p>
          <h2 className="sr" style={{ ...hs, fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '80px', textAlign: 'center', animationDelay: '0.1s' }}>
            Complete WordPress Solutions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
            {activeServices.map((svc: unknown, i: number) => {
              const isEven = i % 2 === 0;
              return (
                <div key={svc.id} id={svc.id} className="sr grid grid-cols-1 lg:grid-cols-2 lg:gap-24 items-center" style={{ animationDelay: '0.1s' }}>
                  
                  {/* Text Content */}
                  <div style={{ order: isEven ? 1 : 2 }} className={isEven ? "lg:order-1" : "lg:order-2"}>
                    <p style={{ ...hm, fontSize: '12px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>{svc.tagline}</p>
                    <h3 style={{ ...hs, fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{svc.title}</h3>
                    <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>{svc.desc}</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Starting at</p>
                        <p style={{ ...hs, fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{svc.price}</p>
                      </div>
                      <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Timeline</p>
                        <p style={{ ...hs, fontSize: '1.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{svc.time}</p>
                      </div>
                    </div>

                    <Link href="/contact" className="btn btn-primary btn-lg">
                      {svc.cta} <ArrowSVG size={15} />
                    </Link>
                  </div>

                  {/* Feature Card */}
                  <div style={{ order: isEven ? 2 : 1 }} className={isEven ? "lg:order-2" : "lg:order-1"}>
                    <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'var(--grad)' }} />
                      
                      <p style={{ ...hs, fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>What&apos;s Included</p>
                      <ul style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '32px', listStyle: 'none' }}>
                        {svc.features.map((f) => (
                          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.5 }}>
                            <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '4px', background: 'rgba(118,108,255,0.15)', borderRadius: '50%', padding: '2px' }}><CheckSVG size={12} /></span>
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Results if any */}
                      {'results' in svc && svc.results && (
                        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <p style={{ ...hm, fontSize: '11px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '16px' }}>Expected Results</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {svc.results.map((r: Record<string, unknown>) => (
                               <span key={r} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px' }}>
                                 <span style={{ color: 'var(--primary)' }}><CheckSVG size={12} /></span> {r}
                               </span>
                             ))}
                          </div>
                        </div>
                      )}

                      {/* Plans if any */}
                      {'plans' in svc && svc.plans && (
                        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                            {svc.plans.map((plan) => (
                              <div key={plan.tier} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                                <p style={{ ...hs, fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>{plan.tier}</p>
                                <p style={{ ...hs, fontSize: '20px', fontWeight: 800, color: '#fff' }}>{plan.price}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {activeWhyUs.map((r: unknown, i: number) => {
              const Icon = typeof r.icon === 'string' ? ICONS[r.icon as keyof typeof ICONS] : r.icon
              return (
              <div key={r.title} className="card card-hover sr" style={{ padding: '36px', animationDelay: `${i * 0.08}s` }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '20px' }}>
                  {Icon || ICONS.expertise}
                </div>
                <p style={{ ...hs, fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>{r.title}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.8 }}>{r.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ── PROCESS ────────────────────────────────────────────────── */}
      <ApproachSection processItems={activeProcess} title="WordPress Development Process" />

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }} className="md:grid md:grid-cols-3 md:gap-5">
            {[
              { industry: 'Professional Services', challenge: 'Modern design with complex functionality', solution: 'Custom WordPress theme with advanced features', result: '200%', resultLabel: 'increase in lead generation' },
              { industry: 'Retail', challenge: 'WordPress with e-commerce functionality', solution: 'WooCommerce integration with custom features', result: '150%', resultLabel: 'increase in online sales' },
              { industry: 'International Business', challenge: '5-language website with complex navigation', solution: 'WPML-powered multilingual WordPress site', result: '300%', resultLabel: 'increase in international inquiries' },
            ].map((cs, i) => (
              <div key={i} className="sr card-hover" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s var(--ease)', animationDelay: `${i * 0.1}s` }}>
                <div style={{ height: '3px', background: 'var(--grad)' }} />
                <div style={{ padding: '36px' }}>
                  <p style={{ ...hm, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '16px' }}>{cs.industry}</p>
                  
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
      <section className="section" style={{ overflow: 'visible' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-start gap-12 lg:gap-24">
            <div style={{ flex: '1', position: 'sticky', top: '120px' }} className="md:w-1/3 shrink-0">
              <p className="eyebrow sr">FAQ</p>
              <h2 className="sr" style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px', animationDelay: '0.1s' }}>
                WordPress FAQ
              </h2>
              <p className="sr" style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px', animationDelay: '0.15s' }}>
                30-day money-back guarantee on all WordPress development services.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg sr" style={{ animationDelay: '0.2s' }}>Ask Us Anything <ArrowSVG size={15} /></Link>
            </div>
            <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '8px' }} className="md:w-2/3">
              {activeFaqs.map(({ q, a }: unknown, i: number) => (
                <details key={i} className="sr" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', animationDelay: `${i * 0.08}s` }}>
                  <summary style={{ padding: '22px 28px', cursor: 'pointer', ...hs, fontSize: '16px', fontWeight: 700, color: '#fff', listStyle: 'none', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {q}
                    <span style={{ color: 'var(--primary)' }}>+</span>
                  </summary>
                  <div style={{ padding: '0 28px 22px' }}>
                    <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8 }}>{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="section section--dark" style={{ textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(118,108,255,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="sr" style={{ ...hs, fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '20px' }}>
            Ready to Build Your WordPress Site?
          </h2>
          <p className="sr" style={{ fontSize: '16px', color: 'var(--text-2)', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7, animationDelay: '0.1s' }}>
            Get a free consultation and project quote within 24 hours. No commitment required.
          </p>
          <div className="sr" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', animationDelay: '0.2s' }}>
            <Link href="/contact" className="btn btn-primary btn-xl">Get Free Consultation <ArrowSVG size={16} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-xl">View Our Work</Link>
          </div>
        </div>
      </section>
    </>
  )
}
