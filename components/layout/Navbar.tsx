'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const F = { fontFamily:'var(--font-body)' } as const
const M = { fontFamily:'var(--font-mono)' } as const

/* ── Inline SVGs ── */
const ChevronSVG = ({ open }: { open: boolean }) => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.55, transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ArrowSVG = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SERVICE_MENUS = [
  { label:'WordPress', href:'/services/wordpress', items:[
    { label:'Website Development',    href:'/services/wordpress' },
    { label:'Migration Services',     href:'/services/wordpress#migration' },
    { label:'Bug & Error Fixing',     href:'/services/wordpress#bugs' },
    { label:'Maintenance & Support',  href:'/services/wordpress#maintenance' },
    { label:'Speed Optimization',     href:'/services/wordpress#speed' },
    { label:'Security Services',      href:'/services/wordpress#security' },
    { label:'Virus Removal',          href:'/services/wordpress#virus-removal' },
    { label:'Backup Solutions',       href:'/services/wordpress#backup' },
    { label:'Website Redesign',       href:'/services/wordpress#redesign' },
    { label:'Multilingual Websites',  href:'/services/wordpress#multilingual' },
  ]},
  { label:'WooCommerce', href:'/services/woocommerce', items:[
    { label:'Store Development',        href:'/services/woocommerce' },
    { label:'Theme Customization',      href:'/services/woocommerce#theme' },
    { label:'Payment Gateway',          href:'/services/woocommerce#payments' },
    { label:'Performance Optimization', href:'/services/woocommerce#performance' },
    { label:'Maintenance & Support',    href:'/services/woocommerce#maintenance' },
    { label:'Multi-vendor Solutions',   href:'/services/woocommerce#multivendor' },
    { label:'Multilingual Websites',    href:'/services/woocommerce#multilingual' },
    { label:'Migration Services',       href:'/services/woocommerce#migration' },
  ]},
  { label:'Shopify', href:'/services/shopify', items:[
    { label:'Store Development',        href:'/services/shopify' },
    { label:'Migration Services',       href:'/services/shopify#migration' },
    { label:'Performance Optimization', href:'/services/shopify#performance' },
    { label:'Integration Services',     href:'/services/shopify#integrations' },
    { label:'Maintenance & Support',    href:'/services/shopify#maintenance' },
    { label:'Shopify Plus',             href:'/services/shopify#plus' },
    { label:'Store Redesign',           href:'/services/shopify#redesign' },
    { label:'App Development',          href:'/services/shopify#app-dev' },
  ]},
  { label:'SEO', href:'/services/seo', items:[
    { label:'Website SEO',    href:'/services/seo#website-seo' },
    { label:'Local SEO',      href:'/services/seo#local-seo' },
    { label:'Technical SEO',  href:'/services/seo#technical-seo' },
    { label:'SEO Content',    href:'/services/seo#seo-content' },
  ]},
]

const NAV_LINKS = [
  { label:'Home',      href:'/' },
  { label:'Services',  href:'/services/wordpress', hasMega:true },
  { label:'Portfolio', href:'/portfolio' },
  { label:'Tools',     href:'/tools/wordpress-theme-detector', hasTools:true },
  { label:'About',     href:'/about' },
  { label:'Blog',      href:'/blog' },
]

const TOOL_LINKS = [
  { label:'WordPress Theme Detector', href:'/tools/wordpress-theme-detector', desc:'Find any WP theme instantly' },
  { label:'Shopify Theme Detector',   href:'/tools/shopify-theme-detector',   desc:'Detect any Shopify theme' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [logoUrl, setLogoUrl]       = useState('')
  const [siteName, setSiteName]     = useState('ARIOSETECH')
  const [tagline, setTagline]       = useState('Consider It Solved')
  const [megaOpen, setMegaOpen]   = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const pathname = usePathname()
  const timerRef = useRef<ReturnType<typeof setTimeout>|null>(null)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.logo_url) setLogoUrl(d.logo_url)
      if (d.site_name) setSiteName(d.site_name)
      if (d.tagline) setTagline(d.tagline)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setMegaOpen(false); setToolsOpen(false) }, [pathname])

  const isActive  = (href:string) => href==='/' ? pathname==='/' : pathname.startsWith(href)
  const openMega  = () => { if (timerRef.current) clearTimeout(timerRef.current); setMegaOpen(true); setToolsOpen(false) }
  const closeMega = () => { timerRef.current = setTimeout(()=>setMegaOpen(false), 180) }
  const openTools  = () => { if (timerRef.current) clearTimeout(timerRef.current); setToolsOpen(true); setMegaOpen(false) }
  const closeTools = () => { timerRef.current = setTimeout(()=>setToolsOpen(false), 180) }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: scrolled ? 'rgba(5,5,8,0.97)' : 'rgba(5,5,8,0.90)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      transition: 'background 0.3s',
    }}>
      <div className="container" style={{ display:'flex', alignItems:'center', height:'64px', gap:'20px' }}>

        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'center', textDecoration:'none', flexShrink:0 }}>
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} style={{ height:'36px', width:'auto', objectFit:'contain' }} />
          ) : (
            <div style={{ fontFamily:'var(--font-logo), sans-serif', fontSize:'24px', color:'#fff', letterSpacing:'1px', lineHeight:1 }}>
              {siteName}
              <div style={{ ...M, fontSize:'8px', color:'var(--primary)', letterSpacing:'0.05em', textAlign:'right', marginTop:'2px' }}>{tagline}</div>
            </div>
          )}
        </Link>

        {/* Mobile nav */}
        <nav className="flex lg:hidden" style={{ flex:1, alignItems:'center', gap:'4px', overflowX:'auto', WebkitOverflowScrolling:'touch', scrollbarWidth:'none' }}>
          {NAV_LINKS.map(item => (
            <Link key={item.href} href={item.href} style={{
              display:'inline-flex', alignItems:'center', padding:'6px 10px', borderRadius:'8px',
              ...F, fontSize:'13px', fontWeight:500, whiteSpace:'nowrap',
              color: isActive(item.href) ? '#fff' : 'var(--text-2)',
              background: isActive(item.href) ? 'var(--primary-soft)' : 'transparent',
            }}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop nav */}
        <nav className="hidden lg:flex" style={{ flex:1, alignItems:'center', gap:'2px' }}>
          {NAV_LINKS.map(item => (
            <div key={item.href} style={{ position:'relative' }}
              onMouseEnter={item.hasMega ? openMega : item.hasTools ? openTools : undefined}
              onMouseLeave={item.hasMega ? closeMega : item.hasTools ? closeTools : undefined}>
              <Link href={item.href} style={{
                display:'flex', alignItems:'center', gap:'4px', padding:'7px 12px', borderRadius:'8px',
                ...F, fontSize:'14px', fontWeight:500,
                color: isActive(item.href) ? '#fff' : 'var(--text-2)',
                background: isActive(item.href) ? 'var(--primary-soft)' : 'transparent',
                transition:'all 0.2s cubic-bezier(0.22,1,0.36,1)',
              }}
                onMouseEnter={e=>{ if(!isActive(item.href)){ e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}}
                onMouseLeave={e=>{ if(!isActive(item.href)){ e.currentTarget.style.color='var(--text-2)'; e.currentTarget.style.background='transparent' }}}>
                {item.label}
                {(item.hasMega||item.hasTools) && <ChevronSVG open={item.hasMega ? megaOpen : toolsOpen} />}
              </Link>

              {/* Tools dropdown */}
              {item.hasTools && toolsOpen && (
                <div onMouseEnter={openTools} onMouseLeave={closeTools} style={{
                  position:'absolute', top:'calc(100% + 10px)', left:0,
                  background:'rgba(10,10,18,0.98)', backdropFilter:'blur(28px)',
                  border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px',
                  zIndex:300, animation:'slideDown 0.18s var(--ease) both',
                  padding:'10px 12px', minWidth:'260px',
                  boxShadow:'0 24px 80px rgba(0,0,0,0.65)',
                }}>
                  {TOOL_LINKS.map(t => (
                    <Link key={t.href} href={t.href} style={{
                      display:'flex', alignItems:'flex-start', gap:'10px',
                      padding:'10px 8px', borderRadius:'10px', textDecoration:'none',
                      transition:'color 0.15s, transform 0.15s', color:'rgba(255,255,255,0.72)',
                    }}
                      onMouseEnter={e=>{ e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateX(2px)' }}
                      onMouseLeave={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.72)'; e.currentTarget.style.transform='' }}>
                      <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'var(--primary)', flexShrink:0, display:'block', marginTop:'7px' }} />
                      <span>
                        <p style={{ ...F, fontSize:'14px', fontWeight:600, marginBottom:'2px' }}>{t.label}</p>
                        <p style={{ ...M, fontSize:'10px', color:'var(--text-3)' }}>{t.desc}</p>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Mega menu — fixed under header */}
          {megaOpen && (
            <div onMouseEnter={openMega} onMouseLeave={closeMega} style={{
              position:'fixed', top:'65px', left:0, right:0,
              background:'rgba(10,10,18,0.98)', backdropFilter:'blur(28px)',
              borderBottom:'1px solid rgba(255,255,255,0.08)',
              zIndex:300, animation:'slideDown 0.18s var(--ease) both',
              padding:'32px 0', boxShadow:'0 40px 120px rgba(0,0,0,0.70)',
            }}>
              <div className="container">
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'40px' }}>
                  {SERVICE_MENUS.map(menu => (
                    <div key={menu.label}>
                      <Link href={menu.href} style={{
                        display:'flex', alignItems:'center', gap:'6px', ...M,
                        fontSize:'10px', fontWeight:800, color:'var(--primary)',
                        textTransform:'uppercase', letterSpacing:'0.16em', marginBottom:'14px', textDecoration:'none',
                      }}>
                        {menu.label} <ArrowSVG size={10} />
                      </Link>
                      <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'2px' }}>
                        {menu.items.map(it => (
                          <li key={it.href}>
                            <Link href={it.href} style={{
                              ...F, fontSize:'14px', fontWeight:500, color:'rgba(255,255,255,0.72)',
                              transition:'all 0.2s', display:'flex', alignItems:'center', gap:'8px', padding:'6px 0',
                            }}
                              onMouseEnter={e=>{ e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateX(2px)' }}
                              onMouseLeave={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.72)'; e.currentTarget.style.transform='' }}>
                              <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'rgba(118,108,255,0.5)', flexShrink:0, display:'block' }} />
                              {it.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Right side: available pill + CTA */}
        <div className="hidden lg:flex" style={{ marginLeft:'auto', alignItems:'center', gap:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
            <span style={{ position:'relative', display:'flex', width:'7px', height:'7px' }}>
              <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:'var(--primary)', opacity:0.45, animation:'pulse-ring 1.8s ease-out infinite' }} />
              <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'var(--primary)', display:'block', position:'relative' }} />
            </span>
            <span style={{ ...M, fontSize:'11px', color:'var(--text-3)', fontWeight:600, whiteSpace:'nowrap' }}>Available for projects</span>
          </div>
          <Link href="/contact" className="btn btn-primary btn-md">Get Free Quote <ArrowSVG size={14} /></Link>
        </div>
      </div>
    </header>
  )
}
