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

/* ── Static tab data ───────────────────────────────────────── */
const TABS: TabItem[] = [
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

function renderFormattedContent(text: string) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: { type: 'ol' | 'ul'; items: string[] } | null = null;

  const flushList = (key: string | number) => {
    if (!currentList) return;
    const ListTag = currentList.type;
    
    if (currentList.type === 'ul') {
      elements.push(
        <ul 
          key={`list-${key}`} 
          className="sa-ul"
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} className="sa-uli">
              <span className="sa-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ListTag 
          key={`list-${key}`} 
          className="sa-ol"
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} className="sa-oli">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ListTag>
      );
    }
    currentList = null;
  };

  const parseInlineMarkdown = (str: string) => {
    const parts = str.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="sa-strong">{part}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentList) flushList(i);
      return;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    const bulletMatch = trimmed.match(/^([•\*\-])\s+(.*)$/);

    if (numMatch) {
      if (currentList && currentList.type !== 'ol') {
        flushList(i);
      }
      if (!currentList) {
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numMatch[2]);
    } else if (bulletMatch) {
      if (currentList && currentList.type !== 'ul') {
        flushList(i);
      }
      if (!currentList) {
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[2]);
    } else {
      if (currentList) flushList(i);

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const headerText = trimmed.replace(/\*\*/g, '');
        elements.push(
          <h4 key={i} className="sa-h4">
            {headerText.endsWith(':') ? headerText.slice(0, -1) : headerText}
          </h4>
        );
      } else {
        elements.push(
          <p key={i} className="sa-para">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      }
    }
  });

  if (currentList) flushList(lines.length);

  return <div className="flex flex-col">{elements}</div>;
}

interface Props {
  eyebrow?: string
  headline?: string
  intro?: string
  items?: TabItem[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (!hash) return;
      
      const foundIndex = items.findIndex(t => {
        const labelPart = slugify(t.label || '');
        const titlePart = slugify(t.title || '');
        const hashWord = hash.toLowerCase();
        
        return (
          labelPart.includes(hashWord) || 
          hashWord.includes(labelPart) ||
          titlePart.includes(hashWord) ||
          hashWord.includes(titlePart)
        );
      });
      
      if (foundIndex !== -1) {
        setActive(foundIndex);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [items]);

  const tab = items[active] || items[0]
  const dir = active - prev
  const go  = (i: number) => { setPrev(active); setActive(i) }

  // Parse features safely whether string or array
  const featuresList: string[] = Array.isArray(tab?.features) 
    ? (tab.features as string[])
    : (typeof tab?.features === 'string' ? tab.features.split(',').map((f: string) => f.trim()) : [])

  return (
    <section className="section section--dark">
      <div className="container">

        {/* Header */}
        <div className="svc-header">
          <div>
            <p className="eyebrow sr">{eyebrow}</p>
            <h2 className="sr svc-headline">
              {headline}
            </h2>
          </div>
          <p className="sr svc-intro">
            {intro}
          </p>
        </div>

        {/* Accordion shell */}
        <div className="svc-shell">

          {/* ── Tab strip ── */}
          <div className="svc-tabstrip">
            {items.map((t, i) => {
              const isActive = i === active
              const labelSlug = slugify(t.label || '');
              const titleSlug = slugify(t.title || '');
              const getHashId = (title: string) => {
                const lower = (title || '').toLowerCase();
                if (lower.includes('speed') || lower.includes('performance')) return 'speed';
                if (lower.includes('theme') || lower.includes('customization')) return 'theme';
                if (lower.includes('payment')) return 'payments';
                return null;
              };
              const mappedId = getHashId(t.title);

              return (
                <div key={t.id || i} className="relative w-full">
                  <div id={labelSlug} className="svc-anchor" />
                  {labelSlug !== titleSlug && (
                    <div id={titleSlug} className="svc-anchor" />
                  )}
                  {mappedId && mappedId !== labelSlug && mappedId !== titleSlug && (
                    <div id={mappedId} className="svc-anchor" />
                  )}
                  {t.title.toLowerCase().includes('performance') && (
                    <div id="performance" className="svc-anchor" />
                  )}
                  {labelSlug.includes('bugs') && (
                    <div id="bugs" className="svc-anchor" />
                  )}
                  {labelSlug.includes('maintenance') && (
                    <div id="maintenance" className="svc-anchor" />
                  )}
                  <button
                    onClick={() => go(i)}
                    className={`svc-tab${isActive ? ' active' : ''}`}
                  >
                    <div className="svc-tab-icon">
                      {typeof t.icon === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: t.icon }} className="svc-tab-icon-svg" />
                      ) : (
                        t.icon
                      )}
                    </div>
                    <span className="svc-tab-label">
                      {t.label}
                    </span>
                    {!isMd && (
                      <div className="svc-tab-chevron ml-auto">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* ── Content panel ── */}
          <div className="svc-panel">
            <div className="svc-panel-bg" style={{ background: tab?.bg || '#05050a' }} />
            <div className="svc-panel-grid" />
            <div className="svc-panel-orb" />

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
                  className="svc-content"
                >
                  <div className="svc-topline" />
                  <div className="svc-content-inner">
                    <p className="svc-sub">
                      {tab.sub}
                    </p>
                    <h3 className="svc-title">
                      {tab.title}
                    </h3>
                    <div className="svc-desc">
                      {renderFormattedContent(tab.desc)}
                    </div>
                    <div className="svc-features">
                      {featuresList.map(f => (
                        <div key={f} className="svc-feature">
                          <span className="svc-feature-check">
                            <Check />
                          </span>
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="svc-cta">
                      <div>
                        <p className="svc-price-label">Starting at</p>
                        <p className="svc-price">{(tab.price || '').replace(/\$\$+/g, '$')}</p>
                      </div>
                      <Link href={tab.href || '#'} className="btn btn-primary btn-md">
                        Learn More <Arrow />
                      </Link>
                    </div>
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
