'use client'
import Link from 'next/link'

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
    title: 'WooCommerce Website Development',
    tagline: 'Launch Your Ultimate E-commerce Store',
    price: '$1,299',
    time: '3–4 weeks',
    desc: 'Build a powerful online store that leverages the best of WordPress and WooCommerce. Our custom development creates unique, high-converting stores that perfectly match your brand and business requirements.',
    features: [
      'Custom WooCommerce theme development',
      'Responsive design across all devices',
      'Complete product catalog setup',
      'Payment gateway integration (Stripe, PayPal, Bank transfers)',
      'Shipping zones and tax configuration',
      'Inventory management system',
      'Customer account functionality',
      'Order management and tracking',
      'SEO optimization for products and pages',
      'Google Analytics and conversion tracking',
      'Email automation setup',
      '30 days of free support',
    ],
    perfectFor: ['Businesses wanting WordPress + e-commerce', 'Companies needing content marketing integration', 'Brands requiring extensive customization', 'Businesses planning to scale significantly'],
    cta: 'Launch My Store',
  },
  {
    id: 'theme',
    title: 'WooCommerce Theme Customization',
    tagline: 'Transform Your Store with Custom Design',
    price: '$899',
    time: '2–3 weeks',
    desc: 'Make your WooCommerce store stand out with completely custom theme development or extensive customization of existing themes. We create unique shopping experiences that reflect your brand and drive conversions.',
    features: [
      'Complete theme redesign and development',
      'Custom homepage and product page layouts',
      'Brand-specific color schemes and typography',
      'Custom icons and graphics integration',
      'Advanced product display options',
      'Custom checkout process design',
      'Mobile-first responsive design',
      'Speed and performance optimization',
    ],
    perfectFor: ['Stores wanting unique brand representation', 'Businesses with existing WooCommerce sites', 'Companies needing design improvements', 'Brands wanting to improve conversions'],
    cta: 'Customize My Theme',
  },
  {
    id: 'payments',
    title: 'WooCommerce Payment Gateway Integration',
    tagline: 'Secure, Seamless Payment Processing',
    price: '$299/gateway',
    time: '3–5 days',
    desc: 'Offer your customers the payment methods they prefer with secure, reliable payment gateway integrations. We implement and optimize payment systems that reduce cart abandonment and increase conversions.',
    features: [
      'Stripe (credit cards, digital wallets)',
      'PayPal (Standard, Pro, Express Checkout)',
      'Apple Pay and Google Pay',
      'Razorpay, Paytm & international gateways',
      'PCI DSS compliance assistance',
      'SSL certificate implementation',
      'Fraud protection setup',
      '3D Secure authentication',
    ],
    perfectFor: ['Stores expanding payment options', 'International e-commerce businesses', 'Companies wanting to reduce cart abandonment', 'Stores targeting mobile customers'],
    cta: 'Setup Payments',
  },
  {
    id: 'performance',
    title: 'WooCommerce Performance Optimization',
    tagline: 'Maximize Speed, Sales, and Search Rankings',
    price: '$699',
    time: '5–7 days',
    desc: 'Slow e-commerce sites lose customers and sales. Our comprehensive optimization service can improve your WooCommerce store speed by 50–70%, leading to higher conversions, better user experience, and improved search rankings.',
    features: [
      'Database query optimization',
      'Image compression and optimization',
      'Caching implementation (page, object, browser)',
      'CDN setup and configuration',
      'Server-level optimizations',
      'Plugin performance review',
      'Checkout process speedup',
      'Mobile-first performance tuning',
    ],
    results: ['50–70% faster loading times', 'Improved Google PageSpeed scores (90+)', 'Better Core Web Vitals', '20–35% increase in conversions', 'Reduced bounce rates', 'Higher search engine rankings'],
    perfectFor: [],
    cta: 'Speed Up My Store',
  },
  {
    id: 'maintenance',
    title: 'WooCommerce Maintenance & Support',
    tagline: 'Keep Your Store Running Smoothly',
    price: '$129/mo',
    time: 'Ongoing',
    desc: 'Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your WooCommerce store stays updated, secure, and optimized for peak performance.',
    features: [
      'WordPress and WooCommerce core updates',
      'Plugin and theme updates',
      'Security monitoring and hardening',
      'Performance monitoring and optimization',
      'Database optimization and cleanup',
      'Inventory monitoring and alerts',
      'Order system monitoring',
      'Backup management and testing',
    ],
    perfectFor: [],
    cta: 'Choose Your Plan',
    plans: [
      { tier: '🥉 Essential Plan', price: '$129/month', features: ['1 WooCommerce store', 'Monthly updates & security checks', 'Basic performance monitoring', 'Email support (48-hour response)', '2 hours of modifications', 'Monthly backup verification'] },
      { tier: '🥈 Professional Plan', price: '$249/month', features: ['Up to 2 WooCommerce stores', 'Bi-weekly updates & monitoring', 'Advanced security features', 'Priority support (24-hour response)', '5 hours of modifications', 'Weekly backup management', 'Monthly performance reports'] },
      { tier: '🥇 Enterprise Plan', price: '$499/month', features: ['Up to 5 WooCommerce stores', 'Weekly updates & monitoring', 'Real-time security monitoring', '24/7 priority support', '10 hours of modifications', 'Daily backup management', 'Custom feature development', 'Dedicated account manager'] },
    ],
  },
  {
    id: 'multivendor',
    title: 'WooCommerce Multi-vendor Solutions',
    tagline: 'Create Your Own E-commerce Marketplace',
    price: '$1,999',
    time: '4–6 weeks',
    desc: 'Transform your WooCommerce store into a thriving multi-vendor marketplace where multiple sellers can list and sell their products. Perfect for creating Amazon-like platforms or expanding your business model.',
    features: [
      'Vendor registration and approval system',
      'Individual vendor dashboards',
      'Commission management system',
      'Payment splitting and payouts',
      'Vendor ratings and reviews',
      'Advanced search and filtering',
      'Single checkout for multiple vendors',
      'Admin management dashboard',
      'Mobile-optimized vendor interface',
      '30 days of marketplace support',
    ],
    perfectFor: ['Entrepreneurs creating marketplaces', 'Businesses wanting to expand product range', 'Companies with multiple suppliers', 'Platforms connecting buyers and sellers'],
    cta: 'Build My Marketplace',
  },
  {
    id: 'multilingual',
    title: 'WooCommerce Multilingual Websites',
    tagline: 'Expand Globally with Multilingual E-commerce',
    price: '$1,499',
    time: '3–4 weeks',
    desc: 'Reach international customers with professionally developed multilingual WooCommerce stores. We create seamless multi-language shopping experiences that engage global audiences and drive international sales.',
    features: [
      'Multiple language setup (unlimited languages)',
      'Professional translation workflow',
      'Language switcher integration',
      'Automatic language detection',
      'RTL (right-to-left) language support',
      'Multi-currency and automatic conversion',
      'Location-based pricing',
      'Country-specific payment methods',
      'Translated product catalogs',
      'International SEO configuration',
    ],
    perfectFor: ['Stores expanding internationally', 'Businesses targeting specific regions', 'Companies with multilingual customers', 'Global brands launching online'],
    cta: 'Go Global',
  },
  {
    id: 'migration',
    title: 'WooCommerce Migration Services',
    tagline: 'Seamless Migration to WooCommerce',
    price: '$999',
    time: '1–3 weeks',
    desc: 'Moving your e-commerce store to WooCommerce? We handle the complete migration process while preserving your SEO rankings, customer data, order history, and ensuring zero downtime.',
    features: [
      'Product catalog with all variations and attributes',
      'Customer accounts and order history',
      'Reviews and testimonials',
      'Blog posts and content pages',
      'SEO settings and URL redirects',
      'Payment and shipping configurations',
      'Email subscribers and marketing lists',
      'Analytics tracking setup',
      '30-day dedicated post-migration support',
    ],
    supported: ['Shopify to WooCommerce', 'Magento to WooCommerce', 'OpenCart to WooCommerce', 'PrestaShop to WooCommerce', 'BigCommerce to WooCommerce', 'Custom Platforms'],
    perfectFor: ['Stores wanting lower ongoing costs', 'Businesses needing complete customization freedom', 'Stores wanting better SEO control'],
    cta: 'Migrate My Store',
  },
]

const FAQS = [
  { q: 'How much does a WooCommerce store cost?', a: 'Custom WooCommerce development starts at $1,299 for basic stores. Complex stores with advanced features range from $2,000–$5,000+. We provide detailed quotes based on your specific requirements.' },
  { q: 'How long does WooCommerce development take?', a: 'Most custom WooCommerce stores are completed within 3–5 weeks. Complex stores with extensive customization may take 6–8 weeks. We provide realistic timelines during consultation.' },
  { q: 'Can you migrate my existing store to WooCommerce?', a: 'Yes! We provide complete migration services from Shopify, Magento, and other platforms. Migration typically takes 1–3 weeks depending on store complexity.' },
  { q: 'Is WooCommerce better than Shopify?', a: 'WooCommerce offers more customization freedom and lower long-term costs, while Shopify provides easier management. We help you choose based on your specific needs.' },
  { q: 'Do you provide WooCommerce hosting?', a: 'We recommend reliable WordPress hosting providers and assist with setup and optimization. We focus on development while partnering with trusted hosting companies.' },
  { q: "What's included in post-launch support?", a: 'All WooCommerce projects include 30 days of free support covering bug fixes, minor adjustments, training, and guidance on store management.' },
  { q: 'Can WooCommerce handle large product catalogs?', a: 'Absolutely! WooCommerce can handle thousands of products when properly optimized. We implement performance optimizations for large-scale e-commerce operations.' },
  { q: 'Do you develop custom WooCommerce plugins?', a: "Yes! We develop custom plugins and extensions to add unique functionality to your WooCommerce store that isn't available in existing plugins." },
]

export default function WooCommercePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)', paddingTop: '72px', paddingBottom: '64px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '70%', background: 'radial-gradient(ellipse, rgba(155,109,255,0.12) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow">WooCommerce Services</p>
          <h1 style={{ ...hs, fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em', marginBottom: '8px', maxWidth: '800px' }}>
            Custom WooCommerce
          </h1>
          <h1 style={{ ...hs, fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em', marginBottom: '20px', maxWidth: '800px', ...P }}>
            Development Services
          </h1>
          <p style={{ ...hs, fontSize: '17px', fontWeight: 600, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '600px', marginBottom: '8px' }}>
            Build Powerful E-commerce Stores with WordPress &amp; WooCommerce
          </p>
          <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.8, maxWidth: '580px', marginBottom: '24px' }}>
            Transform your WordPress site into a powerful online store that drives sales. We create custom WooCommerce solutions that combine the flexibility of WordPress with robust e-commerce functionality. Trusted by 40+ businesses worldwide.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            {['Custom Development — Tailored to your exact needs', 'WordPress Integration — Seamless blend of content and commerce', 'Scalable Solutions — Grow from startup to enterprise', 'Mobile-Optimized — Perfect shopping experience on all devices', '24/7 Expert Support — Always here when you need us'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--primary)', flexShrink: 0, display:'flex' }}><CheckSVG size={14} /></span>
                <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Get Free WooCommerce Consultation <ArrowSVG size={16} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View WooCommerce Portfolio</Link>
          </div>
          <p style={{ ...hm, fontSize: '12px', color: 'var(--text-3)' }}>Starting at $1,299 · 30-Day Money-Back Guarantee · Free Post-Launch Training</p>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p className="eyebrow">All Services</p>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '56px' }}>
            Complete WooCommerce Solutions for E-commerce Success
          </h2>

          {SERVICES.map((svc) => (
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
                    {svc.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '13px', color: 'var(--text-2)' }}>
                        <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px', display:'flex' }}><CheckSVG size={13} /></span> {f}
                      </div>
                    ))}
                  </div>

                  {'results' in svc && svc.results && (
                    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                      <p style={{ ...hm, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '12px' }}>Expected Results</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {svc.results.map(r => (
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
                        {svc.supported.map(p => (
                          <span key={p} style={{ ...hm, fontSize: '11px', color: 'var(--text-2)', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px' }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {'plans' in svc && svc.plans && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                      {svc.plans.map(plan => (
                        <div key={plan.tier} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
                          <p style={{ ...hs, fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{plan.tier}</p>
                          <p style={{ ...hs, fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '14px' }}>{plan.price}</p>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {plan.features.map(f => (
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
                        {svc.perfectFor.map(p => (
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
            Why Choose ARIOSETECH for WooCommerce Development?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🏆', title: 'WordPress + WooCommerce Expertise', desc: 'Deep understanding of both WordPress and WooCommerce ensures seamless integration and optimal performance for your online store.' },
              { icon: '🛒', title: 'E-commerce Focus', desc: 'Specialized in e-commerce development with proven strategies for increasing conversions, average order value, and customer retention.' },
              { icon: '🎨', title: 'Custom Solutions', desc: 'Every WooCommerce store we build is uniquely tailored to your business needs, brand identity, and growth objectives.' },
              { icon: '⚡', title: 'Performance Obsessed', desc: 'We optimize every aspect of your store for speed, ensuring fast loading times that keep customers engaged and improve search rankings.' },
              { icon: '🔒', title: 'Security First', desc: 'Enterprise-grade security measures protect your store and customer data from threats, ensuring trust and compliance.' },
              { icon: '📈', title: 'Growth Partnership', desc: "We don't just build stores; we create growth-focused solutions that scale with your business and support long-term success." },
            ].map(r => (
              <div key={r.title} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(155,109,255,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
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
            WooCommerce Portfolio Highlights
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }}>
            {[
              { name: 'The Kapra', industry: 'Fashion E-commerce', challenge: 'Complex inventory management and custom features', solution: 'Custom WooCommerce with advanced product variations', result: '300%', resultLabel: 'increase in online sales' },
              { name: 'Dr. Scents International', industry: 'Perfume & Cosmetics', challenge: '32 different country-specific websites', solution: 'Multi-site WooCommerce with localization', result: '32', resultLabel: 'countries launched in under 4 months' },
              { name: 'GeoMag World', industry: 'Educational Toys', challenge: 'Complex product catalog with learning resources', solution: 'WooCommerce with custom product configurator', result: '200%', resultLabel: 'increase in average order value' },
            ].map((cs, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.25s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(118,108,255,0.35)'; el.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.transform = '' }}>
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
            <Link href="/portfolio" className="btn btn-outline btn-lg">View Full WooCommerce Portfolio <ArrowSVG size={15} /></Link>
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
                WooCommerce Development FAQ
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>
                30-day money-back guarantee | Free post-launch training | Ongoing support available
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Ask Us Anything <ArrowSVG size={15} /></Link>
            </div>
            <div>
              {FAQS.map(({ q, a }, i) => (
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
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(155,109,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Ready to Launch Your WooCommerce Store?
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Get a free quote within 24 hours. No commitment required.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Start Your Store <ArrowSVG size={15} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View Our Work</Link>
          </div>
        </div>
      </section>
    </>
  )
}
