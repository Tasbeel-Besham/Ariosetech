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
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={`nav-chevron${open ? ' open' : ''}`}>
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
  { label: 'Contact',   href: '/contact' },
]

// ICONS mapping for dynamic services
const ICONS: Record<string, React.ReactNode> = {
  wordpress: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  woocommerce: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  shopify: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  seo: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  default: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  )
}

function getIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('wordpress')) return ICONS.wordpress
  if (l.includes('woocommerce')) return ICONS.woocommerce
  if (l.includes('shopify')) return ICONS.shopify
  if (l.includes('seo')) return ICONS.seo
  return ICONS.default
}

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
      animate={{ left }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="mega-nub absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-white/10 bg-[rgba(10,10,18,0.98)]"
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
  tabs
}: {
  selected: number | null
  dir: 'l' | 'r' | null
  onEnter: () => void
  onLeave: () => void
  onTabHover: (tabId: number) => void
  tabs: any[]
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
      className="mega-panel"
    >
      {/* Bridge gap */}
      <div className="mega-bridge" />
      <Nub selected={selected} />

      <div className="mega-inner">
        {/* Tab row */}
        <div className="mega-tabs">
          {tabs.map(t => (
            <a
              key={t.id}
              id={`svc-tab-${t.id}`}
              href={t.href}
              onMouseEnter={() => onTabHover(t.id)}
              className={`mega-tab${selected === t.id ? ' active' : ''}`}
            >
              <span className="mega-tab-icon">{t.icon}</span>
              {t.label}
            </a>
          ))}
        </div>

        {/* Sliding content */}
        <div className="mega-body">
          {tabs.map(t => (
            <div key={t.id} className={selected === t.id ? 'block' : 'hidden'}>
              {selected === t.id && (
                <motion.div
                  initial={{ opacity: 0, x: dir === 'l' ? 60 : dir === 'r' ? -60 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <div className="mega-grid">
                    {t.items.map((item: any) => (
                      <Link key={item.href} href={item.href} className="mega-link">
                        <span className="mega-dot" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mega-footer">
                    <Link href={t.href} className="mega-viewall">
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
function ToolsPanel({ onEnter, onLeave, links }: { onEnter: () => void; onLeave: () => void; links: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="tools-panel"
    >
      <div className="tools-bridge" />
      {links.map(t => (
        <Link key={t.href} href={t.href} className="tools-link">
          <span className="tools-dot" />
          <span>
            <p className="tools-label">{t.label}</p>
            {t.desc && <p className="tools-desc">{t.desc}</p>}
          </span>
        </Link>
      ))}
    </motion.div>
  )
}

/* ── Mobile Drawer ── */
function MobileDrawer({
  open, setOpen, isActive, siteName, tagline, logoUrl, navLinks, serviceTabs
}: {
  open: boolean
  setOpen: (v: boolean) => void
  isActive: (href: string) => boolean
  siteName: string
  tagline: string
  logoUrl: string
  navLinks: any[]
  serviceTabs: any[]
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
      className="drawer-overlay"
    >
      <motion.div
        id="mobile-drawer"
        ref={drawerRef}
        onClick={e => e.stopPropagation()}
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        transition={{ ease: 'easeInOut', duration: 0.32 }}
        className="drawer"
        style={{ y }}
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={() => { if (y.get() >= 100) handleClose() }}
      >
        {/* Drag handle */}
        <div className="drawer-handle-wrap">
          <button
            onPointerDown={e => controls.start(e)}
            className="drawer-handle"
          />
        </div>

        {/* Scrollable content */}
        <div className="drawer-scroll">
          {/* Logo */}
          <div className="mb-32">
            {logoUrl
              ? <img src={logoUrl} alt={siteName} className="drawer-logo-img" />
              : <div className="drawer-wordmark">
                  {siteName}
                  <div className="drawer-tagline">{tagline}</div>
                </div>
            }
          </div>

          {/* Primary links */}
          <nav className="drawer-nav">
            {navLinks.map(item => (
              <Link key={item.href} href={item.href} className={`drawer-link${isActive(item.href) ? ' active' : ''}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Service sub-links */}
          <div className="mb-32">
            <p className="drawer-svc-label">Services</p>
            <div className="drawer-svc-grid">
              {serviceTabs.map(t => (
                <Link key={t.id} href={t.href} className="drawer-svc-link">
                  <span className="drawer-svc-icon">{t.icon}</span>
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link href="/contact" className="btn btn-primary btn-lg w-full justify-center">
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

  // Dynamic state
  const [navLinks, setNavLinks] = useState(NAV_LINKS)
  const [serviceTabs, setServiceTabs] = useState(SERVICE_TABS)
  const [toolLinks, setToolLinks] = useState(TOOL_LINKS)

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
    Promise.all([
      fetch('/api/header').then(r => r.json()).catch(() => ({})),
      fetch('/api/settings').then(r => r.json()).catch(() => ({})),
      fetch('/api/menus?location=header').then(r => r.json()).catch(() => []),
      fetch('/api/menus?location=services_mega').then(r => r.json()).catch(() => []),
      fetch('/api/menus?location=tools').then(r => r.json()).catch(() => [])
    ]).then(([headerData, settingsData, headerMenu, servicesMenu, toolsMenu]) => {
      const logo = String(settingsData.logo_url || headerData.logo || '').trim()
      if (logo) setLogoUrl(logo)
      
      const alt = String(settingsData.site_name || headerData.logoAlt || 'ARIOSETECH').trim()
      if (alt) setSiteName(alt)
      
      if (headerData.logoWidth) setLogoWidth(Number(headerData.logoWidth) || 160)

      if (Array.isArray(headerMenu) && headerMenu.length > 0) {
        setNavLinks(headerMenu[0].items.map((i: any) => ({
          ...i,
          hasMega: i.label.toLowerCase() === 'services',
          hasTools: i.label.toLowerCase() === 'tools',
        })))
      }

      if (Array.isArray(servicesMenu) && servicesMenu.length > 0
          && Array.isArray(servicesMenu[0].items) && servicesMenu[0].items.length > 0) {
        setServiceTabs(servicesMenu[0].items.map((i: any, idx: number) => ({
          id: idx + 1,
          label: i.label,
          href: i.href,
          icon: getIcon(i.label),
          items: i.children || []
        })))
      }

      if (Array.isArray(toolsMenu) && toolsMenu.length > 0) {
        setToolLinks(toolsMenu[0].items.map((i: any) => ({
          label: i.label,
          href: i.href,
          desc: i.desc || ''
        })))
      }
    })
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
      setActiveTab(serviceTabs[0]?.id || 1)
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
      <header className={`nav-header${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-bar">

        {/* Logo */}
        <Link href="/" className="nav-logo-link">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={siteName}
              className="nav-logo-img lg:max-w-[var(--logo-width)]"
              onError={() => setLogoUrl('')}
            />
          ) : (
            <div className="nav-wordmark">
              {siteName}
              <div className="nav-tagline">{tagline}</div>
            </div>
          )}
        </Link>

        {/* Mobile: spacer + hamburger */}
        <div className="flex lg:hidden flex-1" />
        <button
          className="flex lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="nav-burger-line" />
          <span className="nav-burger-line nav-burger-line-mid" />
          <span className="nav-burger-line" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex nav-links">
          {navLinks.map(item => {
            const hasMega = item.hasMega
            const hasTools = item.hasTools
            
            return (
            <div key={item.href} className="relative"
              onMouseEnter={hasMega ? () => openMega() : (hasTools ? openTools : undefined)}
              onMouseLeave={hasMega ? closeMega : (hasTools ? closeTools : undefined)}
            >
              <Link href={item.href} className={`nav-link${isActive(item.href) ? ' active' : ''}${hasMega && megaOpen ? ' open' : ''}`}>
                {item.label}
                {hasMega && <ChevronSVG open={megaOpen} />}
                {hasTools && <ChevronSVG open={toolsOpen} />}
              </Link>

              {/* Tools dropdown */}
              <AnimatePresence>
                {hasTools && toolsOpen && (
                  <ToolsPanel onEnter={openTools} onLeave={closeTools} links={toolLinks} />
                )}
              </AnimatePresence>
            </div>
            )
          })}

          {/* Services mega panel, tab tabs inside it */}
          <AnimatePresence>
            {megaOpen && (
              <ServicesPanel
                tabs={serviceTabs}
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
        <div className="hidden lg:flex nav-right">
          <div className="nav-avail">
            <span className="nav-dot-wrap">
              <span className="nav-dot-ping" />
              <span className="nav-dot" />
            </span>
            <span className="nav-avail-text">Available for projects</span>
          </div>
          <Link href="/contact" className="btn btn-primary btn-md">Get Free Quote <ArrowSVG size={14} /></Link>
        </div>
      </div>
    </header>

    {/* ── Mobile Drawer ── */}
    <MobileDrawer 
      open={mobileOpen} 
      setOpen={setMobileOpen} 
      isActive={isActive} 
      siteName={siteName} 
      tagline={tagline} 
      logoUrl={logoUrl} 
      navLinks={navLinks}
      serviceTabs={serviceTabs}
    />
    </>
  )
}
