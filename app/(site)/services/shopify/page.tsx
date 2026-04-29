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
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p className="eyebrow">All Services</p>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '56px' }}>
            Complete Shopify Solutions for E-commerce Success
          </h2>

          {activeServices.map((svc: Record<string, string>) => (
            <div key={svc.id} id={svc.id} style={{ marginBottom: '48px', scrollMarginTop: '90px' }}>
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '3px', background: 'var(--grad)' }} />
                <div style={{ padding: '36px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ ...hs, fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{svc.title}</h3>
                      <p style={{ ...hs, fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>{svc.tagline}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ ...hs, fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{svc.price}</p>
                      <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>{svc.time}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.8, marginBottom: '24px', maxWidth: '780px' }}>{svc.desc}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px 24px', marginBottom: '24px' }}>
                    {svc.features.map((f: Record<string, string>) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '13px', color: 'var(--text-2)' }}>
                        <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px', display:'flex' }}><CheckSVG size={13} /></span> {f}
                      </div>
                    ))}
                  </div>

                  {'results' in svc && svc.results && (
                    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                      <p style={{ ...hm, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '12px' }}>Expected Results</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {svc.results.map((r: Record<string, unknown>) => (
                          <span key={r} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--primary)' }}>
                            <CheckSVG size={12} /> {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {'supported' in svc && svc.supported && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '10px' }}>Supported Platforms</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {svc.supported.map((p: Record<string, string>) => (
                          <span key={p} style={{ ...hm, fontSize: '11px', color: 'var(--text-2)', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px' }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {'plans' in svc && svc.plans && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                      {svc.plans.map((plan: Record<string, string>) => (
                        <div key={plan.tier} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
                          <p style={{ ...hs, fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{plan.tier}</p>
                          <p style={{ ...hs, fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '14px' }}>{plan.price}</p>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {plan.features.map((f: Record<string, string>) => (
                              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: 'var(--text-2)' }}>
                                <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px', display:'flex' }}><CheckSVG size={11} /></span> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {svc.perfectFor && svc.perfectFor.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '10px' }}>Perfect For</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {svc.perfectFor.map((p: Record<string, string>) => (
                          <span key={p} style={{ ...hm, fontSize: '11px', color: 'var(--text-2)', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px' }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', borderRadius: '9px', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.28)', color: 'var(--primary)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                    {svc.cta} <ArrowSVG size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ARIOSETECH ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <p className="eyebrow">Why Choose Us</p>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '48px' }}>
            Why Choose ARIOSETECH for Shopify Development?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🏆', title: 'Shopify Partner Excellence', desc: 'Official Shopify Partners with proven expertise in building successful e-commerce stores across various industries.' },
              { icon: '💰', title: 'Conversion-Focused Approach', desc: 'Every store we build is optimized for sales with proven conversion tactics and user experience best practices.' },
              { icon: '🚀', title: 'Shopify Plus Ready', desc: 'Specialized expertise in enterprise-level Shopify Plus implementations for high-growth businesses.' },
              { icon: '📱', title: 'Mobile-Commerce Experts', desc: 'Deep understanding of mobile shopping behaviors ensures your store performs perfectly on all devices.' },
              { icon: '🔧', title: 'Ongoing Partnership', desc: "We're your long-term Shopify growth partner, supporting your business at every stage of expansion." },
              { icon: '⚡', title: 'Performance Obsessed', desc: 'Every Shopify store we develop loads fast and ranks well in search engines.' },
            ].map(r => (
              <div key={r.title} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', transition: 'border-color 0.2s' }} className="card-hover">
                <p style={{ fontSize: '28px', marginBottom: '12px', lineHeight: 1 }}>{r.icon}</p>
                <p style={{ ...hs, fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{r.title}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.75 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p className="eyebrow">Our Work</p>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '48px' }}>
            Shopify Portfolio Highlights
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }}>
            {[
              { name: 'WYOX Sports', industry: 'Sports Equipment (USA)', challenge: 'Complex product variations and US market requirements', solution: 'Custom Shopify store with advanced filtering and checkout optimization', result: '250%', resultLabel: 'increase in online sales' },
              { name: 'Genovie', industry: 'Fashion & Lifestyle', challenge: 'High-end brand representation with seamless UX', solution: 'Custom Shopify Plus store with advanced personalization', result: '180%', resultLabel: 'increase in average order value' },
              { name: 'Janya.pk', industry: 'Wholesale Fashion', challenge: 'B2B wholesale functionality with complex pricing', solution: 'Shopify Plus with custom wholesale portal integration', result: '300%', resultLabel: 'increase in wholesale orders' },
            ].map((cs, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.25s' }} className="card-hover">
                <div style={{ height: '3px', background: 'var(--grad)' }} />
                <div style={{ padding: '28px' }}>
                  <p style={{ ...hs, fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{cs.name}</p>
                  <p style={{ ...hm, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '12px' }}>{cs.industry}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}><strong style={{ color: 'var(--text-2)' }}>Challenge:</strong> {cs.challenge}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px' }}><strong style={{ color: 'var(--text-2)' }}>Solution:</strong> {cs.solution}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <p style={{ ...hs, fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{cs.result}</p>
                    <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cs.resultLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View Full Shopify Portfolio <ArrowSVG size={15} /></Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div style={{ position: 'sticky', top: '100px' }}>
              <p className="eyebrow">FAQ</p>
              <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                Shopify Development FAQ
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>
                30-day money-back guarantee | Free post-launch training | Ongoing support available
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Ask Us Anything <ArrowSVG size={15} /></Link>
            </div>
            <div>
              {activeFaqs.map(({ q, a }, i) => (
                <details key={i} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '6px' }}>
                  <summary style={{ padding: '18px 22px', cursor: 'pointer', ...hs, fontSize: '15px', fontWeight: 600, color: '#fff', listStyle: 'none', userSelect: 'none' }}>
                    {q}
                  </summary>
                  <div style={{ padding: '0 22px 18px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.85 }}>{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(118,108,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '32px' }}>
            Ready to Launch Your Shopify Store?
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Start Your Store <ArrowSVG size={15} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View Our Work</Link>
          </div>
        </div>
      </section>
    </>
  )
}
