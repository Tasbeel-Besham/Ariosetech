'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useDragControls, useMotionValue, useAnimate } from 'framer-motion'
import useMeasure from 'react-use-measure'

const F = { fontFamily: 'var(--font-body)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const

/* ── Inline SVGs ── */
const ChevronSVG = ({ open }: { open: boolean }) => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.55, transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.25s' }}>
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ArrowSVG = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ── Data ── */
const SERVICE_TABS = [
  {
    id: 1, label: 'WordPress', href: '/services/wordpress',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    items: [
      { label: 'Website Development',   href: '/services/wordpress' },
      { label: 'Migration Services',    href: '/services/wordpress#migration' },
      { label: 'Bug & Error Fixing',    href: '/services/wordpress#bugs' },
      { label: 'Maintenance & Support', href: '/services/wordpress#maintenance' },
      { label: 'Speed Optimization',    href: '/services/wordpress#speed' },
      { label: 'Security Services',     href: '/services/wordpress#security' },
      { label: 'Virus Removal',         href: '/services/wordpress#virus-removal' },
      { label: 'Backup Solutions',      href: '/services/wordpress#backup' },
      { label: 'Website Redesign',      href: '/services/wordpress#redesign' },
      { label: 'Multilingual Websites', href: '/services/wordpress#multilingual' },
    ],
  },
  {
    id: 2, label: 'WooCommerce', href: '/services/woocommerce',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    items: [
      { label: 'Store Development',        href: '/services/woocommerce' },
      { label: 'Theme Customization',      href: '/services/woocommerce#theme' },
      { label: 'Payment Gateway',          href: '/services/woocommerce#payments' },
      { label: 'Performance Optimization', href: '/services/woocommerce#performance' },
      { label: 'Maintenance & Support',    href: '/services/woocommerce#maintenance' },
      { label: 'Multi-vendor Solutions',   href: '/services/woocommerce#multivendor' },
      { label: 'Multilingual Websites',    href: '/services/woocommerce#multilingual' },
      { label: 'Migration Services',       href: '/services/woocommerce#migration' },
    ],
  },
  {
    id: 3, label: 'Shopify', href: '/services/shopify',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    items: [
      { label: 'Store Development',        href: '/services/shopify' },
      { label: 'Migration Services',       href: '/services/shopify#migration' },
      { label: 'Performance Optimization', href: '/services/shopify#performance' },
      { label: 'Integration Services',     href: '/services/shopify#integrations' },
      { label: 'Maintenance & Support',    href: '/services/shopify#maintenance' },
      { label: 'Shopify Plus',             href: '/services/shopify#plus' },
      { label: 'Store Redesign',           href: '/services/shopify#redesign' },
      { label: 'App Development',          href: '/services/shopify#app-dev' },
    ],
  },
  {
    id: 4, label: 'SEO', href: '/services/seo',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    items: [
      { label: 'Website SEO',   href: '/services/seo#website-seo' },
      { label: 'Local SEO',     href: '/services/seo#local-seo' },
      { label: 'Technical SEO', href: '/services/seo#technical-seo' },
      { label: 'SEO Content',   href: '/services/seo#seo-content' },
    ],
  },
]

const TOOL_LINKS = [
  { label: 'WordPress Theme Detector', href: '/tools/wordpress-theme-detector', desc: 'Find any WP theme instantly' },
  { label: 'Shopify Theme Detector',   href: '/tools/shopify-theme-detector',   desc: 'Detect any Shopify theme' },
]

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Services',  href: '/services/wordpress', hasMega: true },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Tools',     href: '/tools/wordpress-theme-detector', hasTools: true },
  { label: 'About',     href: '/about' },
  { label: 'Blog',      href: '/blog' },
]

/* ── Nub pointer ── */
function Nub({ selected }: { selected: number | null }) {
  const [left, setLeft] = useState(0)
  useEffect(() => {
    if (!selected) return
    const tab = document.getElementById(`svc-tab-${selected}`)
    const overlay = document.getElementById('svc-overlay')
    if (!tab || !overlay) return
    const tr = tab.getBoundingClientRect()
    const or = overlay.getBoundingClientRect()
    setLeft(tr.left + tr.width / 2 - or.left)
  }, [selected])
  return (
    <motion.span
      style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%, 0% 100%)' }}
      animate={{ left }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-white/10 bg-[rgba(10,10,18,0.98)]"
    />
  )
}

/* ── Services tab panel ── */
function ServicesPanel({
  selected,
  dir,
  onEnter,
  onLeave,
  onTabHover,
}: {
  selected: number | null
  dir: 'l' | 'r' | null
  onEnter: () => void
  onLeave: () => void
  onTabHover: (tabId: number) => void
}) {
  return (
    <motion.div
      id="svc-overlay"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'fixed', top: '65px', left: 0, right: 0,
        background: 'rgba(10,10,18,0.98)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        zIndex: 300,
        boxShadow: '0 40px 120px rgba(0,0,0,0.70)',
      }}
    >
      {/* Bridge gap */}
      <div style={{ position: 'absolute', top: '-24px', left: 0, right: 0, height: '24px' }} />
      <Nub selected={selected} />

      <div className="container" style={{ padding: '28px 0 32px' }}>
        {/* Tab row */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px' }}>
          {SERVICE_TABS.map(t => (
            <a
              key={t.id}
              id={`svc-tab-${t.id}`}
              href={t.href}
              onMouseEnter={() => onTabHover(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '10px',
                ...F, fontSize: '13px', fontWeight: 600,
                transition: 'all 0.18s',
                textDecoration: 'none',
                background: selected === t.id ? 'rgba(118,108,255,0.14)' : 'transparent',
                color: selected === t.id ? 'var(--primary)' : 'rgba(255,255,255,0.55)',
                border: selected === t.id ? '1px solid rgba(118,108,255,0.3)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ color: selected === t.id ? 'var(--primary)' : 'rgba(255,255,255,0.35)' }}>{t.icon}</span>
              {t.label}
            </a>
          ))}
        </div>

        {/* Sliding content */}
        <div style={{ overflow: 'hidden', minHeight: '180px' }}>
          {SERVICE_TABS.map(t => (
            <div key={t.id} style={{ display: selected === t.id ? 'block' : 'none' }}>
              {selected === t.id && (
                <motion.div
                  initial={{ opacity: 0, x: dir === 'l' ? 60 : dir === 'r' ? -60 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                    {t.items.map(item => (
                      <Link key={item.href} href={item.href} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 12px', borderRadius: '8px',
                        ...F, fontSize: '13px', fontWeight: 500,
                        color: 'rgba(255,255,255,0.65)',
                        textDecoration: 'none',
                        transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#fff'
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                          e.currentTarget.style.transform = 'translateX(3px)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.transform = ''
                        }}
                      >
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(118,108,255,0.6)', flexShrink: 0, display: 'block' }} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link href={t.href} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      ...M, fontSize: '11px', fontWeight: 700,
                      color: 'var(--primary)', textDecoration: 'none',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                      View all {t.label} services <ArrowSVG size={10} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Tools mini dropdown ── */
function ToolsPanel({ onEnter, onLeave }: { onEnter: () => void; onLeave: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'absolute', top: 'calc(100% + 12px)', left: 0,
        background: 'rgba(10,10,18,0.98)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        zIndex: 300,
        padding: '10px 12px',
        minWidth: '260px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
      }}
    >
      <div style={{ position: 'absolute', top: '-12px', left: 0, right: 0, height: '12px' }} />
      {TOOL_LINKS.map(t => (
        <Link key={t.href} href={t.href} style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          padding: '10px 8px', borderRadius: '10px',
          textDecoration: 'none', color: 'rgba(255,255,255,0.72)',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(2px)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; e.currentTarget.style.transform = '' }}
        >
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, display: 'block', marginTop: '7px' }} />
          <span>
            <p style={{ ...F, fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{t.label}</p>
            <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)' }}>{t.desc}</p>
          </span>
        </Link>
      ))}
    </motion.div>
  )
}

/* ── Mobile Drawer ── */
function MobileDrawer({
  open, setOpen, isActive, siteName, tagline, logoUrl
}: {
  open: boolean
  setOpen: (v: boolean) => void
  isActive: (href: string) => boolean
  siteName: string
  tagline: string
  logoUrl: string
}) {
  const [scope, animate] = useAnimate()
  const [drawerRef, { height }] = useMeasure()
  const y = useMotionValue(0)
  const controls = useDragControls()

  const handleClose = async () => {
    animate(scope.current, { opacity: [1, 0] })
    const yStart = typeof y.get() === 'number' ? y.get() : 0
    await animate('#mobile-drawer', { y: [yStart, height] })
    setOpen(false)
  }

  if (!open) return null

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(5,5,8,0.75)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <motion.div
        id="mobile-drawer"
        ref={drawerRef}
        onClick={e => e.stopPropagation()}
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        transition={{ ease: 'easeInOut', duration: 0.32 }}
        style={{
          y,
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '80vh',
          background: 'rgba(10,10,18,0.98)',
          backdropFilter: 'blur(28px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
        }}
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={() => { if (y.get() >= 100) handleClose() }}
      >
        {/* Drag handle */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          display: 'flex', justifyContent: 'center', padding: '16px',
          background: 'rgba(10,10,18,0.98)',
        }}>
          <button
            onPointerDown={e => controls.start(e)}
            style={{
              width: '48px', height: '5px', borderRadius: '100px',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              cursor: 'grab', touchAction: 'none',
            }}
          />
        </div>

        {/* Scrollable content */}
        <div style={{ height: '100%', overflowY: 'auto', padding: '64px 24px 40px' }}>
          {/* Logo */}
          <div style={{ marginBottom: '32px' }}>
            {logoUrl
              ? <img src={logoUrl} alt={siteName} style={{ height: '32px', width: 'auto' }} />
              : <div style={{ fontFamily: 'var(--font-logo), sans-serif', fontSize: '22px', color: '#fff', letterSpacing: '1px', lineHeight: 1 }}>
                  {siteName}
                  <div style={{ ...M, fontSize: '8px', color: 'var(--primary)', letterSpacing: '0.05em', marginTop: '2px' }}>{tagline}</div>
                </div>
            }
          </div>

          {/* Primary links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '28px' }}>
            {NAV_LINKS.map(item => (
              <Link key={item.href} href={item.href} style={{
                display: 'block', padding: '12px 14px', borderRadius: '12px',
                ...F, fontSize: '16px', fontWeight: 600, textDecoration: 'none',
                color: isActive(item.href) ? '#fff' : 'rgba(255,255,255,0.6)',
                background: isActive(item.href) ? 'var(--primary-soft)' : 'transparent',
                transition: 'all 0.15s',
                border: isActive(item.href) ? '1px solid rgba(118,108,255,0.25)' : '1px solid transparent',
              }}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Service sub-links */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ ...M, fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '12px', paddingLeft: '14px' }}>Services</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {SERVICE_TABS.map(t => (
                <Link key={t.id} href={t.href} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  ...F, fontSize: '13px', fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                }}>
                  <span style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}>{t.icon}</span>
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link href="/contact" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
            Get Free Quote
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Main Navbar ── */
export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [logoUrl, setLogoUrl]       = useState('')
  const [logoWidth, setLogoWidth]   = useState(160)
  const [siteName, setSiteName]     = useState('ARIOSETECH')
  const [tagline]                   = useState('Consider It Solved')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Services shifting state
  const [megaOpen, setMegaOpen]   = useState(false)
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const [tabDir, setTabDir]       = useState<'l' | 'r' | null>(null)

  // Tools state
  const [toolsOpen, setToolsOpen] = useState(false)

  const pathname   = usePathname()
  const megaTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toolsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch('/api/header').then(r => r.json()).then(d => {
      const logo = String(d.logo || '').trim()
      if (logo) setLogoUrl(logo)
      if (d.logoAlt)   setSiteName(String(d.logoAlt))
      if (d.logoWidth) setLogoWidth(Number(d.logoWidth) || 160)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMegaOpen(false); setToolsOpen(false); setActiveTab(null); setMobileOpen(false) }, [pathname])

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  /* Mega handlers */
  const openMega = (tabId?: number) => {
    if (megaTimer.current) clearTimeout(megaTimer.current)
    if (toolsTimer.current) clearTimeout(toolsTimer.current)
    setToolsOpen(false)
    setMegaOpen(true)
    if (tabId !== undefined) {
      setTabDir(activeTab !== null && activeTab !== tabId ? (activeTab > tabId ? 'r' : 'l') : null)
      setActiveTab(tabId)
    } else if (activeTab === null) {
      setActiveTab(SERVICE_TABS[0].id)
    }
  }
  const closeMega = () => {
    megaTimer.current = setTimeout(() => { setMegaOpen(false); setActiveTab(null) }, 180)
  }

  /* Tools handlers */
  const openTools = () => {
    if (toolsTimer.current) clearTimeout(toolsTimer.current)
    if (megaTimer.current) clearTimeout(megaTimer.current)
    setMegaOpen(false)
    setActiveTab(null)
    setToolsOpen(true)
  }
  const closeTools = () => { toolsTimer.current = setTimeout(() => setToolsOpen(false), 180) }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
      background: scrolled ? 'rgba(5,5,8,0.97)' : 'rgba(5,5,8,0.90)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      transition: 'background 0.3s',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '20px' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={siteName}
              style={{ height: '36px', maxWidth: `${logoWidth}px`, width: 'auto', objectFit: 'contain' }}
              onError={() => setLogoUrl('')}
            />
          ) : (
            <div style={{ fontFamily: 'var(--font-logo), sans-serif', fontSize: '24px', color: '#fff', letterSpacing: '1px', lineHeight: 1 }}>
              {siteName}
              <div style={{ ...M, fontSize: '8px', color: 'var(--primary)', letterSpacing: '0.05em', textAlign: 'right', marginTop: '2px' }}>{tagline}</div>
            </div>
          )}
        </Link>

        {/* Mobile: spacer + hamburger */}
        <div className="flex lg:hidden" style={{ flex: 1 }} />
        <button
          className="flex lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-2)', flexDirection: 'column', gap: '5px' }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor', borderRadius: '2px', transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: '16px', height: '2px', background: 'currentColor', borderRadius: '2px', transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor', borderRadius: '2px', transition: 'all 0.2s' }} />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex" style={{ flex: 1, alignItems: 'center', gap: '2px' }}>

          {/* Services trigger — lives outside the tab tabs */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => openMega()}
            onMouseLeave={closeMega}
          >
            <Link href="/services/wordpress" style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 12px', borderRadius: '8px',
              ...F, fontSize: '14px', fontWeight: 500,
              color: isActive('/services') ? '#fff' : 'var(--text-2)',
              background: isActive('/services') ? 'var(--primary-soft)' : megaOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
              transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
              textDecoration: 'none',
            }}
              onMouseEnter={e => { if (!isActive('/services')) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
              onMouseLeave={e => { if (!isActive('/services') && !megaOpen) { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent' } }}
            >
              Services
              <ChevronSVG open={megaOpen} />
            </Link>
          </div>

          {/* Other nav items */}
          {NAV_LINKS.filter(i => !i.hasMega).map(item => (
            <div key={item.href} style={{ position: 'relative' }}
              onMouseEnter={item.hasTools ? openTools : undefined}
              onMouseLeave={item.hasTools ? closeTools : undefined}
            >
              <Link href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 12px', borderRadius: '8px',
                ...F, fontSize: '14px', fontWeight: 500,
                color: isActive(item.href) ? '#fff' : 'var(--text-2)',
                background: isActive(item.href) ? 'var(--primary-soft)' : 'transparent',
                transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                textDecoration: 'none',
              }}
                onMouseEnter={e => { if (!isActive(item.href)) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
                onMouseLeave={e => { if (!isActive(item.href)) { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent' } }}
              >
                {item.label}
                {item.hasTools && <ChevronSVG open={toolsOpen} />}
              </Link>

              {/* Tools dropdown */}
              <AnimatePresence>
                {item.hasTools && toolsOpen && (
                  <ToolsPanel onEnter={openTools} onLeave={closeTools} />
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Services mega panel — tab tabs inside it */}
          <AnimatePresence>
            {megaOpen && (
              <ServicesPanel
                selected={activeTab}
                dir={tabDir}
                onTabHover={(tabId) => {
                  setTabDir(activeTab !== null && activeTab !== tabId ? (activeTab > tabId ? 'r' : 'l') : null)
                  setActiveTab(tabId)
                }}
                onEnter={() => {
                  if (megaTimer.current) clearTimeout(megaTimer.current)
                }}
                onLeave={closeMega}
              />
            )}
          </AnimatePresence>
        </nav>

        {/* Right side: available pill + CTA */}
        <div className="hidden lg:flex" style={{ marginLeft: 'auto', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ position: 'relative', display: 'flex', width: '7px', height: '7px' }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--primary)', opacity: 0.45, animation: 'pulse-ring 1.8s ease-out infinite' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', display: 'block', position: 'relative' }} />
            </span>
            <span style={{ ...M, fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, whiteSpace: 'nowrap' }}>Available for projects</span>
          </div>
          <Link href="/contact" className="btn btn-primary btn-md">Get Free Quote <ArrowSVG size={14} /></Link>
        </div>
      </div>
    </header>

    {/* ── Mobile Drawer ── */}
    <MobileDrawer open={mobileOpen} setOpen={setMobileOpen} isActive={isActive} siteName={siteName} tagline={tagline} logoUrl={logoUrl} />
    </>
  )
}
