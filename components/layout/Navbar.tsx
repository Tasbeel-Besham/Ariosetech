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

/* ── Dynamic Dropdown ── */
function DynamicDropdown({ items, onEnter, onLeave }: { items: {label:string; href:string}[], onEnter: () => void; onLeave: () => void }) {
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
        minWidth: '220px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
      }}
    >
      <div style={{ position: 'absolute', top: '-12px', left: 0, right: 0, height: '12px' }} />
      {items.map(t => (
        <Link key={t.href} href={t.href} style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          padding: '10px 12px', borderRadius: '10px',
          textDecoration: 'none', color: 'rgba(255,255,255,0.72)',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'transparent' }}
        >
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, display: 'block', marginTop: '8px' }} />
          <span style={{ ...F, fontSize: '14px', fontWeight: 600 }}>{t.label}</span>
        </Link>
      ))}
    </motion.div>
  )
}

/* ── Mobile Drawer ── */
function MobileDrawer({
  open, setOpen, isActive, siteName, tagline, logoUrl, navItems
}: {
  open: boolean
  setOpen: (v: boolean) => void
  isActive: (href: string) => boolean
  siteName: string
  tagline: string
  logoUrl: string
  navItems: any[]
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

          {/* Primary dynamic links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            {navItems.map((item, idx) => (
              <div key={idx}>
                <Link href={item.href} style={{
                  display: 'block', padding: '12px 14px', borderRadius: '12px',
                  ...F, fontSize: '16px', fontWeight: 600, textDecoration: 'none',
                  color: isActive(item.href) ? '#fff' : 'rgba(255,255,255,0.8)',
                  background: isActive(item.href) ? 'var(--primary-soft)' : 'transparent',
                  transition: 'all 0.15s',
                  border: isActive(item.href) ? '1px solid rgba(118,108,255,0.25)' : '1px solid transparent',
                }}>
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div style={{ paddingLeft: '16px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {item.children.map((child: any, cidx: number) => (
                      <Link key={cidx} href={child.href} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px',
                        ...F, fontSize: '14px', fontWeight: 500, textDecoration: 'none',
                        color: 'rgba(255,255,255,0.6)', transition: 'all 0.15s',
                      }}>
                        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--primary)' }} />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

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
  const [navItems, setNavItems]     = useState<any[]>([])
  
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({})
  const dropdownTimers = useRef<Record<number, NodeJS.Timeout>>({})

  const pathname = usePathname()

  useEffect(() => {
    Promise.all([
      fetch('/api/header').then(r => r.json()).catch(() => ({})),
      fetch('/api/settings').then(r => r.json()).catch(() => ({})),
      fetch('/api/menus?location=header').then(r => r.json()).catch(() => [])
    ]).then(([headerData, settingsData, menusData]) => {
      const logo = String(settingsData.logo_url || headerData.logo || '').trim()
      if (logo) setLogoUrl(logo)
      
      const alt = String(settingsData.site_name || headerData.logoAlt || 'ARIOSETECH').trim()
      if (alt) setSiteName(alt)
      
      if (headerData.logoWidth) setLogoWidth(Number(headerData.logoWidth) || 160)

      if (Array.isArray(menusData) && menusData.length > 0) {
        setNavItems(menusData[0].items || [])
      } else {
        // Fallback to default structure
        setNavItems([
          { label: 'Home', href: '/' },
          { label: 'WordPress', href: '/services/wordpress' },
          { label: 'Shopify', href: '/services/shopify' },
          { label: 'WooCommerce', href: '/services/woocommerce' },
          { label: 'Portfolio', href: '/portfolio' },
          { label: 'About Us', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Blog', href: '/blog' },
        ])
      }
    })
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { 
    setOpenDropdowns({})
    setMobileOpen(false) 
  }, [pathname])

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  const openDropdown = (idx: number) => {
    if (dropdownTimers.current[idx]) clearTimeout(dropdownTimers.current[idx])
    setOpenDropdowns(prev => ({ ...prev, [idx]: true }))
  }

  const closeDropdown = (idx: number) => {
    dropdownTimers.current[idx] = setTimeout(() => {
      setOpenDropdowns(prev => ({ ...prev, [idx]: false }))
    }, 150)
  }

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
            {navItems.map((item, idx) => {
              const hasChildren = item.children && item.children.length > 0
              const isOpen = openDropdowns[idx] || false
              
              return (
                <div key={idx} style={{ position: 'relative' }}
                  onMouseEnter={hasChildren ? () => openDropdown(idx) : undefined}
                  onMouseLeave={hasChildren ? () => closeDropdown(idx) : undefined}
                >
                  <Link href={item.href} target={item.target || '_self'} style={{
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 12px', borderRadius: '8px',
                    ...F, fontSize: '14px', fontWeight: 500,
                    color: isActive(item.href) ? '#fff' : 'var(--text-2)',
                    background: isActive(item.href) ? 'var(--primary-soft)' : isOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                    textDecoration: 'none',
                  }}
                    onMouseEnter={e => { if (!isActive(item.href)) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
                    onMouseLeave={e => { if (!isActive(item.href) && !isOpen) { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent' } }}
                  >
                    {item.label}
                    {hasChildren && <ChevronSVG open={isOpen} />}
                  </Link>

                  <AnimatePresence>
                    {hasChildren && isOpen && (
                      <DynamicDropdown items={item.children} onEnter={() => openDropdown(idx)} onLeave={() => closeDropdown(idx)} />
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
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
      <MobileDrawer open={mobileOpen} setOpen={setMobileOpen} isActive={isActive} siteName={siteName} tagline={tagline} logoUrl={logoUrl} navItems={navItems} />
    </>
  )
}
