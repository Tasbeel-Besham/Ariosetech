/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
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
const ChevSVG = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.25s', flexShrink: 0 }}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ── SERVICES DATA ─────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'development',
    title: 'Shopify Store Development',
    tagline: 'Launch Your Dream E-commerce Store',
    price: '$999',
    time: '2–3 weeks',
    desc: 'Transform your business idea into a profitable Shopify store. Our custom development approach creates unique, high-converting stores that capture your brand essence and drive sales from day one.',
    features: [
      'Custom Shopify theme development',
      'Responsive design across all devices',
      'Product catalog setup and optimization',
      'Payment gateway integration (Stripe, PayPal, etc.)',
      'Shipping configuration and tax setup',
      'SEO optimization and structure',
      'Google Analytics and conversion tracking',
      'Social media integration',
      'Customer account setup',
      '30 days of free support',
    ],
    perfectFor: ['New businesses launching online', 'Brands moving from other platforms', 'Companies needing unique, custom designs', 'Entrepreneurs starting their e-commerce journey'],
    cta: 'Launch My Store',
  },
  {
    id: 'migration',
    title: 'Shopify Migration Services',
    tagline: 'Seamless Migration to Shopify',
    price: '$799',
    time: '1–2 weeks',
    desc: 'Moving your e-commerce store to Shopify? We handle the complete migration process while preserving your SEO rankings, customer data, and sales history. Zero downtime, zero data loss guaranteed.',
    features: [
      'All product data and images transferred',
      'Customer accounts and order history',
      'Blog posts and pages',
      'SEO settings and redirects',
      'Reviews and testimonials',
      'Email subscribers',
      'Analytics tracking setup',
      '30-day post-migration support',
    ],
    supported: ['WooCommerce to Shopify', 'Magento to Shopify', 'BigCommerce to Shopify', 'Custom platforms to Shopify', 'Other e-commerce platforms'],
    perfectFor: ['Brands moving from WooCommerce or Magento', 'Businesses wanting easier store management', 'Stores seeking faster growth on Shopify'],
    cta: 'Migrate to Shopify',
  },
  {
    id: 'performance',
    title: 'Shopify Performance Optimization',
    tagline: 'Maximize Your Store\'s Speed and Conversions',
    price: '$599',
    time: '5–7 days',
    desc: 'Slow Shopify stores lose customers and sales. Our performance optimization service can improve your store speed by 40–60%, leading to higher conversions and better customer experience.',
    features: [
      'Comprehensive speed audit and analysis',
      'Image optimization and compression',
      'Code optimization and cleanup',
      'App performance review and optimization',
      'Theme speed enhancements',
      'CDN implementation',
      'Mobile speed optimization',
      'Core Web Vitals improvement',
    ],
    results: ['40–60% faster loading times', 'Improved Google PageSpeed scores', '15–25% increase in conversions', 'Reduced bounce rates', 'Better search engine rankings'],
    perfectFor: [],
    cta: 'Optimize My Store',
  },
  {
    id: 'integrations',
    title: 'Shopify Integration Services',
    tagline: 'Connect Your Store with Essential Business Tools',
    price: '$399+',
    time: '3–5 days per integration',
    desc: 'Streamline your operations by integrating your Shopify store with essential business tools and third-party services. Automate workflows and improve efficiency across your entire business.',
    features: [
      'Google Analytics 4 & Facebook Pixel setup',
      'Mailchimp / Klaviyo email marketing integration',
      'ShipStation & inventory management systems',
      'QuickBooks & Xero accounting connection',
      'Facebook Shop & Google Shopping setup',
      'Affiliate & loyalty program integration',
      'API development for custom tools',
      'Custom workflow automation',
    ],
    perfectFor: ['Businesses wanting to automate operations', 'Stores expanding to multichannel selling', 'Companies needing CRM or ERP integration'],
    cta: 'Integrate My Tools',
  },
  {
    id: 'maintenance',
    title: 'Shopify Maintenance & Support',
    tagline: 'Keep Your Shopify Store Running Smoothly',
    price: '$99/mo',
    time: 'Ongoing',
    desc: 'Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your Shopify store stays updated, secure, and optimized for peak performance.',
    features: [
      'Regular theme and app updates',
      'Security monitoring and protection',
      'Performance monitoring and optimization',
      'Broken link checks and fixes',
      'Product data backup and security',
      'SEO health checks',
      'Bug fixes and troubleshooting',
      'Emergency support availability',
    ],
    perfectFor: [],
    cta: 'Choose Your Plan',
    plans: [
      { tier: '🥉 Starter Plan', price: '$99/month', features: ['1 Shopify store', 'Monthly updates & checks', 'Basic performance monitoring', 'Email support', '2 hours of modifications'] },
      { tier: '🥈 Growth Plan', price: '$199/month', features: ['Up to 2 Shopify stores', 'Bi-weekly updates & monitoring', 'Advanced performance optimization', 'Priority email & chat support', '5 hours of modifications', 'Monthly performance reports'] },
      { tier: '🥇 Enterprise Plan', price: '$399/month', features: ['Up to 5 Shopify stores', 'Weekly updates & monitoring', 'Real-time performance tracking', '24/7 priority support', '10 hours of modifications', 'Custom feature development', 'Dedicated account manager'] },
    ],
  },
  {
    id: 'plus',
    title: 'Shopify Plus Development',
    tagline: 'Enterprise E-commerce Solutions with Shopify Plus',
    price: '$2,999',
    time: '4–6 weeks',
    desc: 'Scale your high-volume business with Shopify Plus. We specialize in complex enterprise implementations, custom functionality, and advanced integrations that support rapid growth and global expansion.',
    features: [
      'Custom Theme Development for enterprise brands',
      'Advanced Integrations — ERP, CRM, and custom systems',
      'B2B Functionality — Wholesale portals and pricing tiers',
      'Multi-Store Setup — Manage multiple brands/regions',
      'Custom Apps — Develop exclusive functionality',
      'Performance Optimization for high-traffic volumes',
      'Migration Services — Enterprise-level data migration',
      'Advanced security and compliance',
    ],
    perfectFor: ['High-volume merchants (>1M annual sales)', 'Brands with complex requirements', 'International businesses', 'B2B wholesale operations', 'Multi-brand companies'],
    cta: 'Discuss Shopify Plus',
  },
  {
    id: 'redesign',
    title: 'Shopify Store Redesign',
    tagline: 'Transform Your Store for Maximum Conversions',
    price: '$1,499',
    time: '3–4 weeks',
    desc: 'Is your Shopify store underperforming? Our redesign service combines modern design with conversion optimization to create stores that not only look amazing but also drive more sales.',
    features: [
      'Modern, mobile-first design',
      'Conversion rate optimization',
      'User experience improvements',
      'Page speed optimization',
      'SEO structure enhancement',
      'Product page optimization',
      'Checkout process improvement',
      '30 days of support',
    ],
    results: ['20–40% increase in conversions', 'Improved mobile experience', 'Better brand representation', 'Higher average order value'],
    perfectFor: ['Stores with outdated designs', 'Businesses with low conversion rates', 'Brands needing a fresh, modern look'],
    cta: 'Redesign My Store',
  },
  {
    id: 'app-dev',
    title: 'Shopify App Development',
    tagline: 'Custom Apps for Unique Business Needs',
    price: '$1,999',
    time: '4–8 weeks',
    desc: 'Need functionality that doesn\'t exist? We develop custom Shopify apps tailored to your specific requirements, giving you competitive advantages and streamlined operations.',
    features: [
      'Public Apps — For the Shopify App Store',
      'Private Apps — Exclusive to your store',
      'Custom product configurators',
      'Subscription and recurring billing systems',
      'Loyalty and rewards programs',
      'Advanced search and filtering',
      'B2B pricing and catalogs',
      'Multi-vendor marketplaces',
    ],
    perfectFor: ['Businesses needing unique functionality', 'Stores wanting automation tools', 'Brands wanting competitive app-based features'],
    cta: 'Develop My App',
  },
]

const FAQS = [
  { q: 'How long does it take to build a Shopify store?', a: 'Most custom Shopify stores are completed within 2–4 weeks, while Shopify Plus projects typically take 4–6 weeks depending on complexity.' },
  { q: 'Can you migrate my existing store to Shopify?', a: "Yes! We provide complete migration services from all major e-commerce platforms including WooCommerce, Magento, BigCommerce, and custom solutions." },
  { q: 'Do you provide Shopify hosting?', a: 'Shopify includes hosting as part of their platform. We help with setup, optimization, and ongoing management of your Shopify store.' },
  { q: "What's included in the post-launch support?", a: 'All Shopify projects include 30 days of free support covering bug fixes, minor adjustments, training, and guidance on store management.' },
  { q: 'Can you help with Shopify marketing and SEO?', a: 'While we focus on development, we include basic SEO optimization and can recommend trusted partners for advanced marketing services.' },
  { q: 'How much does Shopify maintenance cost?', a: 'Our Shopify maintenance plans start at $99/month and include updates, monitoring, support, and monthly modifications.' },
  { q: 'Do you work with Shopify Plus?', a: "Yes! We're experienced with Shopify Plus implementations for enterprise clients requiring advanced features and higher transaction volumes." },
  { q: 'Can you develop custom Shopify apps?', a: 'Absolutely! We develop both private apps for individual stores and public apps for the Shopify App Store.' },
]

export default async function ShopifyPage() {
  let dbData: Partial<ServicePageDoc> | null = null
  try {
    const col = await getCollection<ServicePageDoc>('services')
    dbData = await col.findOne({ slug: 'shopify' })
  } catch {
    // Fall back to hardcoded data if DB connection fails
  }

  const activeServices = dbData?.services?.length ? dbData.services : SERVICES
  const activeFaqs = dbData?.faqs?.length ? dbData.faqs : FAQS
  const heroData = dbData?.hero || {
    eyebrow: 'Shopify Services',
    headline: 'Professional Shopify',
    subheadline: 'Development Services',
    desc: 'From startup stores to enterprise Shopify Plus platforms, we create high-converting e-commerce experiences that drive sales. Trusted by 30+ Shopify businesses worldwide.',
    bullets: [
      'Custom Development — Unique stores that stand out',
      'Conversion-Focused — Optimized for maximum sales',
      'Shopify Plus Ready — Enterprise solutions available',
      'Mobile-Optimized — Perfect on every device',
      '24/7 Expert Support — Always here to help'
    ],
    ctaPrimary: 'Get Free Shopify Store Audit',
    ctaSecondary: 'View Shopify Portfolio',
    startingPrice: 'Starting at $999 · 30-Day Money-Back Guarantee · Free Post-Launch Training'
  }

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)', paddingTop: '72px', paddingBottom: '64px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '70%', background: 'radial-gradient(ellipse, rgba(118,108,255,0.12) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow">{heroData.eyebrow}</p>
          <h1 style={{ ...hs, fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em', marginBottom: '8px', maxWidth: '800px' }}>
            {heroData.headline}
          </h1>
          <h1 style={{ ...hs, fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em', marginBottom: '20px', maxWidth: '800px', ...P }}>
            {heroData.subheadline}
          </h1>
          <p style={{ ...hs, fontSize: '17px', fontWeight: 600, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '600px', marginBottom: '8px' }}>
            Scale Your E-commerce Business with Expert Shopify Solutions
          </p>
          <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.8, maxWidth: '580px', marginBottom: '24px' }}>
            {heroData.desc}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            {heroData.bullets?.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSVG size={14} />
                <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">{heroData.ctaPrimary} <ArrowSVG size={16} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg">{heroData.ctaSecondary}</Link>
          </div>
          <p style={{ ...hm, fontSize: '12px', color: 'var(--text-3)' }}>{heroData.startingPrice}</p>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section className="section" style={{ padding: '120px 0', background: 'var(--bg)' }}>
        <div className="container">
          <p className="eyebrow sr" style={{ justifyContent: 'center' }}>All Services</p>
          <h2 className="sr" style={{ ...hs, fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '80px', textAlign: 'center', animationDelay: '0.1s' }}>
            Complete Shopify Solutions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
            {activeServices.map((svc: any, i: number) => {
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
                    <div className='card' style={{ padding: '40px' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'var(--grad)' }} />
                      
                      <p style={{ ...hs, fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>What&apos;s Included</p>
                      <ul style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '32px', listStyle: 'none' }}>
                        {svc.features.map((f: string) => (
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
                            {svc.results.map((r: string) => (
                               <span key={r} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px' }}>
                                 <span style={{ color: 'var(--primary)' }}><CheckSVG size={12} /></span> {r}
                               </span>
                             ))}
                          </div>
                        </div>
                      )}

                      {/* Supported Platforms if any */}
                      {'supported' in svc && svc.supported && (
                        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <p style={{ ...hm, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '16px' }}>Supported Platforms</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {svc.supported.map((p: string) => (
                              <span key={p} style={{ ...hm, fontSize: '11px', color: 'var(--text-2)', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px' }}>{p}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Perfect For if any */}
                      {svc.perfectFor && svc.perfectFor.length > 0 && (
                        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <p style={{ ...hm, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '16px' }}>Perfect For</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {svc.perfectFor.map((p: string) => (
                              <span key={p} style={{ ...hm, fontSize: '11px', color: 'var(--text-2)', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px' }}>{p}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Plans if any */}
                      {'plans' in svc && svc.plans && (
                        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                            {svc.plans.map((plan: any) => (
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
            Why Choose ARIOSETECH for Shopify Development?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🏆', title: 'Shopify Partner Excellence', desc: 'Official Shopify Partners with proven expertise in building successful e-commerce stores across various industries.' },
              { icon: '💰', title: 'Conversion-Focused Approach', desc: 'Every store we build is optimized for sales with proven conversion tactics and user experience best practices.' },
              { icon: '🚀', title: 'Shopify Plus Ready', desc: 'Specialized expertise in enterprise-level Shopify Plus implementations for high-growth businesses.' },
              { icon: '📱', title: 'Mobile-Commerce Experts', desc: 'Deep understanding of mobile shopping behaviors ensures your store performs perfectly on all devices.' },
              { icon: '🔧', title: 'Ongoing Partnership', desc: "We're your long-term Shopify growth partner, supporting your business at every stage of expansion." },
              { icon: '⚡', title: 'Performance Obsessed', desc: 'Every Shopify store we develop loads fast and ranks well in search engines.' },
            ].map((r, i) => (
              <div key={r.title} className="card card-hover sr" style={{ padding: '36px', animationDelay: `${i * 0.08}s` }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
                  {r.icon}
                </div>
                <p style={{ ...hs, fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>{r.title}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.8 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO HIGHLIGHTS ──────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p className="eyebrow sr">Our Work</p>
              <h2 className="sr" style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', animationDelay: '0.1s' }}>
                Shopify Portfolio Highlights
              </h2>
            </div>
            <Link href="/portfolio" className="btn btn-outline btn-lg sr" style={{ animationDelay: '0.15s' }}>View Full Shopify Portfolio <ArrowSVG size={15} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }} className="md:grid md:grid-cols-3 md:gap-5">
            {[
              { industry: 'Sports Equipment (USA)', challenge: 'Complex product variations and US market requirements', solution: 'Custom Shopify store with advanced filtering and checkout optimization', result: '250%', resultLabel: 'increase in online sales' },
              { industry: 'Fashion & Lifestyle', challenge: 'High-end brand representation with seamless UX', solution: 'Custom Shopify Plus store with advanced personalization', result: '180%', resultLabel: 'increase in average order value' },
              { industry: 'Wholesale Fashion', challenge: 'B2B wholesale functionality with complex pricing', solution: 'Shopify Plus with custom wholesale portal integration', result: '300%', resultLabel: 'increase in wholesale orders' },
            ].map((cs, i) => (
              <div key={i} className='card card-hover sr' style={{ background: 'var(--bg-3)', transition: 'all 0.3s var(--ease)', animationDelay: `${i * 0.1}s` }}>
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
      <section className="section section--dark" style={{ overflow: 'visible' }}>
        <div className="container">
          <div className="g-2" style={{ gap: '80px', alignItems: 'start' }}>
            <div className="sr sticky-mobile-fix" style={{ position: 'sticky', top: '100px' }}>
              <p className="eyebrow">FAQ</p>
              <h2 style={{ ...hs, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px' }}>
                Shopify Development <span style={P}>FAQ</span>
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>
                Everything you need to know about our Shopify approach and how we help businesses grow online.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Ask Us Anything <ArrowSVG size={15} /></Link>
              <p style={{ ...hm, fontSize: '12px', color: 'var(--text-3)', marginTop: '24px', fontStyle: 'italic', letterSpacing:'0.05em' }}>
                30-day money-back guarantee | Free training
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeFaqs.map(({ q, a }: any, i: number) => (
                <div key={i} className="sr" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s var(--ease)', animationDelay:`${i*0.06}s` }}>
                  <details style={{ width:'100%' }}>
                    <summary style={{ padding: '24px 28px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      <span style={{ ...hs, fontSize: '16px', fontWeight: 700, color: '#fff', flex: 1, lineHeight: 1.4 }}>{q}</span>
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

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(118,108,255,0.1) 0%, transparent 80%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.3 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sr">
            <p className="eyebrow" style={{ justifyContent:'center' }}>Get Started Today</p>
            <h2 style={{ ...hs, fontSize: 'clamp(2.4rem,6vw,4.5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.05em', marginBottom: '24px', color:'#fff' }}>
              Ready to Launch Your<br />
              <span style={P}>Shopify Store?</span>
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.8 }}>
              Whether you are migrating, launching a new store, or scaling with Shopify Plus, Ariosetech is ready to help you succeed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary btn-lg">Start Your Store <ArrowSVG size={15} /></Link>
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
