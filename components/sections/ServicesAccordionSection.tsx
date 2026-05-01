'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

/* ── Tiny helpers ──────────────────────────────────────────── */
function useW() {
  const [w, setW] = useState(1280)
  useEffect(() => {
    const s = () => setW(window.innerWidth)
    s()
    window.addEventListener('resize', s)
    return () => window.removeEventListener('resize', s)
  }, [])
  return w
}

const Check = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const F = { fontFamily: 'var(--font-display)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const

/* ── Static tab data ───────────────────────────────────────── */
const TABS = [
  {
    id: 1, label: 'WordPress', title: 'WordPress Development', sub: 'Build Powerful, Scalable Websites',
    desc: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.',
    features: ['Custom Development', 'Speed Optimization', 'Maintenance & Support', 'Migration Services', 'Security Hardening', 'SEO-Ready Builds'],
    price: '$799', href: '/services/wordpress',
    bg: 'radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 90% 10%, rgba(80,60,220,0.18) 0%, transparent 50%), linear-gradient(160deg,#0c0a1c,#05050a)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  },
  {
    id: 2, label: 'WooCommerce', title: 'WooCommerce Development', sub: 'Launch Your Dream E-commerce Store',
    desc: 'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.',
    features: ['Store Setup & Customization', 'Payment Gateway Integration', 'Multi-vendor Solutions', 'Performance Optimization', 'Inventory Management', 'Mobile-Optimized'],
    price: '$1,299', href: '/services/woocommerce',
    bg: 'radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 10%, rgba(60,50,200,0.18) 0%, transparent 50%), linear-gradient(160deg,#08081a,#05050a)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  },
  {
    id: 3, label: 'Shopify', title: 'Shopify Development', sub: 'Scale Your Business with Shopify',
    desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.',
    features: ['Custom Store Development', 'Shopify Plus Solutions', 'App Integration', 'Conversion Optimization', 'Theme Customization', 'Migration Services'],
    price: '$999', href: '/services/shopify',
    bg: 'radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% -10%, rgba(90,80,240,0.16) 0%, transparent 50%), linear-gradient(160deg,#0a0818,#05050a)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    id: 4, label: 'SEO', title: 'SEO Services', sub: 'Rank Higher, Get Found Faster',
    desc: 'Business-first SEO built for real growth. From technical fixes to local SEO and content strategy — stronger search presence that drives leads.',
    features: ['Website SEO', 'Local SEO', 'Technical SEO', 'SEO Content Strategy', 'Core Web Vitals', 'Competitor Analysis'],
    price: 'Custom', href: '/services/seo',
    bg: 'radial-gradient(ellipse 70% 70% at 20% 20%, rgba(118,108,255,0.30) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(80,70,220,0.18) 0%, transparent 50%), linear-gradient(160deg,#08081a,#05050a)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
]

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
}

/* ── Builder-compatible component (accepts editable header props) */
interface TabItem {
  id?: string | number
  label: string
  title: string
  sub: string
  desc: string
  features: string | string[]
  price: string
  href: string
  bg: string
  icon: string | React.ReactNode
}

interface Props {
  eyebrow?: string
  headline?: string
  intro?: string
  items?: TabItem[]
  [key: string]: unknown
}

export default function ServicesAccordionSection({
  eyebrow  = 'What We Offer',
  headline = 'Comprehensive Web Development Solutions',
  intro    = "Three core platforms. One expert team. We don't dabble — we specialise so you get the best results every time.",
  items    = TABS,
}: Props) {
  const [active, setActive] = useState(0)
  const [prev, setPrev]     = useState(0)
  const w   = useW()
  const isMd = w >= 768

  const tab = items[active] || items[0]
  const dir = active - prev
  const go  = (i: number) => { setPrev(active); setActive(i) }

  // Parse features safely whether string or array
  const featuresList = Array.isArray(tab?.features) 
    ? tab.features 
    : (typeof tab?.features === 'string' ? tab.features.split(',').map(f => f.trim()) : [])

  return (
    <section className="section section--dark">
      <div className="container">

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: isMd ? '1fr 1fr' : '1fr', gap: '40px', alignItems: 'end', marginBottom: '48px' }}>
          <div>
            <p className="eyebrow sr">{eyebrow}</p>
            <h2 className="sr" style={{ ...F, fontSize: 'clamp(1.9rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em' }}>
              {headline}
            </h2>
          </div>
          <p className="sr" style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8 }}>
            {intro}
          </p>
        </div>

        {/* Accordion shell */}
        <div style={{
          display: 'flex', flexDirection: isMd ? 'row' : 'column',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden', background: 'rgba(8,8,18,0.85)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.55)',
          minHeight: isMd ? '440px' : undefined,
        }}>

          {/* ── Tab strip ── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            borderRight: isMd ? '1px solid rgba(255,255,255,0.07)' : 'none',
            background: 'rgba(5,5,10,0.6)',
          }}>
            {items.map((t, i) => {
              const isActive = i === active
              return (
                <button
                  key={t.id || i}
                  onClick={() => go(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isMd ? '24px 16px' : '16px 16px',
                    background: isActive ? 'rgba(118,108,255,0.10)' : 'transparent',
                    border: 'none',
                    borderLeft: isMd ? `2px solid ${isActive ? 'var(--primary)' : 'transparent'}` : 'none',
                    borderRadius: !isMd && isActive ? '12px' : '0',
                    margin: !isMd ? '2px 0' : '0',
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s var(--ease)',
                    textAlign: 'left',
                    color: isActive ? (isMd ? '#fff' : 'var(--primary)') : 'rgba(255,255,255,0.45)',
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                    background: isActive ? 'var(--primary)' : 'rgba(118,108,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isActive ? '#fff' : 'var(--primary)',
                    transition: 'all 0.2s',
                  }}>
                    {typeof t.icon === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: t.icon }} style={{ display: 'flex', width: '20px', height: '20px' }} />
                    ) : (
                      t.icon
                    )}
                  </div>
                  <span style={{ 
                    ...F, 
                    fontSize: isMd ? '11px' : '14px', 
                    fontWeight: 700, 
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                    writingMode: isMd ? 'vertical-lr' : undefined,
                    transform: isMd ? 'rotate(180deg)' : undefined,
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    {t.label}
                  </span>
                  {!isMd && (
                    <div style={{ marginLeft: 'auto', opacity: isActive ? 1 : 0.2 }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Content panel ── */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: isMd ? '440px' : 'auto' }}>
            <div style={{ position: 'absolute', inset: 0, background: tab?.bg || '#05050a', transition: 'background 0.4s' }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.045, backgroundImage: 'linear-gradient(rgba(118,108,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(118,108,255,1) 1px,transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '-20%', right: '5%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(118,108,255,0.18) 0%,transparent 70%)', filter: 'blur(24px)', pointerEvents: 'none' }} />

            <AnimatePresence mode="wait" custom={dir}>
              {tab && (
                <motion.div
                  key={active}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
                  style={{
                    position: isMd ? 'absolute' : 'relative', 
                    inset: isMd ? 0 : 'auto',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    background: 'rgba(5,5,8,0.72)',
                    padding: isMd ? '36px 40px' : '32px 20px',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)' }} />
                  <p style={{ ...M, fontSize: '9px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700, marginBottom: '6px' }}>
                    {tab.sub}
                  </p>
                  <h3 style={{ ...F, fontSize: isMd ? 'clamp(1.5rem,2.5vw,2.1rem)' : '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '12px' }}>
                    {tab.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: '18px', maxWidth: '520px' }}>
                    {tab.desc}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: isMd ? 'repeat(3,1fr)' : 'repeat(2,1fr)', gap: '7px 16px', marginBottom: '22px' }}>
                    {featuresList.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
                        <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: 'rgba(118,108,255,0.2)', border: '1px solid rgba(118,108,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                          <Check />
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
                    <div>
                      <p style={{ ...M, fontSize: '8px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>Starting at</p>
                      <p style={{ ...F, fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{tab.price}</p>
                    </div>
                    <Link href={tab.href || '#'} className="btn btn-primary btn-md">
                      Learn More <Arrow />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
