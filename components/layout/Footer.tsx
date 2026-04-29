'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from '@/components/ui/Icons'




const SOCIALS = [
  { icon:<Facebook  size={16} />, href:'https://www.facebook.com/ArioseTech/', label:'Facebook' },
  { icon:<Instagram size={16} />, href:'https://www.instagram.com/_ariosetech/', label:'Instagram' },
  { icon:<Linkedin  size={16} />, href:'https://linkedin.com/company/ariosetech', label:'LinkedIn' },
  { icon:<Twitter   size={16} />, href:'https://twitter.com/ariosetech', label:'Twitter' },
]

const M = { fontFamily: 'var(--font-mono)' } as const

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState('')
  const [siteName, setSiteName] = useState('ARIOSETECH')
  const [navItems, setNavItems] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/header').then(r => r.json()).catch(() => ({})),
      fetch('/api/settings').then(r => r.json()).catch(() => ({})),
      fetch('/api/menus?location=footer').then(r => r.json()).catch(() => [])
    ]).then(([headerData, settingsData, menusData]) => {
      const logo = String(settingsData.logo_url || headerData.logo || '').trim()
      if (logo && logo.startsWith('http')) setLogoUrl(logo)
      
      const alt = String(settingsData.site_name || headerData.logoAlt || 'ARIOSETECH').trim()
      if (alt) setSiteName(alt)

      if (Array.isArray(menusData) && menusData.length > 0) {
        setNavItems(menusData[0].items || [])
      } else {
        // Fallback matching default layout
        setNavItems([
          { label: 'WordPress', children: [
            { label: 'Website Development', href: '/services/wordpress' },
            { label: 'Migration Services', href: '/services/wordpress#migration' },
            { label: 'Speed Optimization', href: '/services/wordpress#speed' },
            { label: 'Website Redesign', href: '/services/wordpress#redesign' },
          ]},
          { label: 'Shopify', children: [
            { label: 'Store Development', href: '/services/shopify' },
            { label: 'Migration Services', href: '/services/shopify#migration' },
            { label: 'Store Redesign', href: '/services/shopify#redesign' },
            { label: 'App Development', href: '/services/shopify#app-dev' },
          ]},
          { label: 'WooCommerce', children: [
            { label: 'Store Development', href: '/services/woocommerce' },
            { label: 'Theme Customization', href: '/services/woocommerce#theme' },
            { label: 'Payment Gateway', href: '/services/woocommerce#payments' },
            { label: 'Migration Services', href: '/services/woocommerce#migration' },
          ]},
          { label: 'Company', children: [
            { label: 'About Us', href: '/about' },
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Blog', href: '/blog' },
            { label: 'Contact', href: '/contact' },
          ]}
        ])
      }
    })
  }, [])
  return (
    <footer style={{ background:'var(--bg-2)', borderTop:'1px solid var(--border)' }}>
      {/* CTA banner */}
      <div style={{ background:'linear-gradient(135deg, rgba(118,108,255,0.12), rgba(118,108,255,0.05))', borderBottom:'1px solid rgba(118,108,255,0.15)', padding:'48px 0' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'24px', flexWrap:'wrap' }}>
          <div>
            <h2 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:800, color:'#fff', marginBottom:'6px', letterSpacing:'-0.02em' }}>
              Ready to grow your business online?
            </h2>
            <p style={{ fontSize:'14px', color:'var(--text-3)', lineHeight:1.6 }}>
              Join 100+ successful businesses. Professional results, affordable pricing, and ongoing support.
            </p>
          </div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', flexShrink:0 }}>
            <Link href="/contact" className="btn btn-primary btn-md">Schedule Free Consultation</Link>
            <a href="https://wa.me/923009484739" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-md">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding:'64px 0 40px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr 1fr 1fr 0.8fr 0.8fr', gap:'32px', marginBottom:'52px' }}>

          {/* Brand column */}
          <div>
            <Link href="/" style={{ display:'flex', alignItems:'center', textDecoration:'none', flexShrink:0, marginBottom:'16px' }}>
              <div style={{ fontFamily:'var(--font-logo), sans-serif', fontSize:'24px', color:'#fff', letterSpacing:'1px', lineHeight:1 }}>
                {logoUrl ? <img src={logoUrl} alt={siteName} style={{ height:'32px', width:'auto', objectFit:'contain', display:'block' }} /> : siteName}
                <div style={{ ...M, fontSize:'8px', color:'var(--primary)', letterSpacing:'0.05em', textAlign:'right', marginTop:'2px' }}>Consider It Solved</div>
              </div>
            </Link>
            <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:1.8, marginBottom:'20px', maxWidth:'240px' }}>
              Professional WordPress, Shopify &amp; WooCommerce Development since 2017. Trusted by 100+ businesses in the USA, UAE, and Switzerland.
            </p>
            {/* Contact quick links */}
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'22px' }}>
              <a href="mailto:info@ariosetech.com" style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'var(--text-3)', textDecoration:'none' }}
                onMouseEnter={e => (e.currentTarget.style.color='var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color='var(--text-3)')}>
                <Mail size={13} style={{ flexShrink:0 }} /> info@ariosetech.com
              </a>
              <a href="https://wa.me/923009484739" target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'var(--text-3)', textDecoration:'none' }}
                onMouseEnter={e => (e.currentTarget.style.color='var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color='var(--text-3)')}>
                <Phone size={13} style={{ flexShrink:0 }} /> +92 300 9484 739
              </a>
              <p style={{ display:'flex', alignItems:'flex-start', gap:'8px', fontSize:'13px', color:'var(--text-3)', margin:0 }}>
                <MapPin size={13} style={{ flexShrink:0, marginTop:'2px' }} />
                95 College Road, Block E, PCSIR Staff Colony, Lahore, 54770
              </p>
            </div>
            {/* Socials */}
            <div style={{ display:'flex', gap:'8px' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width:'34px', height:'34px', borderRadius:'8px', background:'var(--bg-3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-3)', textDecoration:'none', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--primary-soft)'; e.currentTarget.style.borderColor='rgba(118,108,255,0.3)'; e.currentTarget.style.color='var(--primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='var(--bg-3)'; e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-3)' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {navItems.map((col, idx) => (
            <div key={idx}>
              <p style={{ ...M, fontSize:'9px', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'16px' }}>{col.label}</p>
              {col.children && col.children.length > 0 && (
                <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'9px' }}>
                  {col.children.map((item: any) => (
                    <li key={item.href}>
                      <Link href={item.href} target={item.target || '_self'} style={{ fontSize:'12px', color:'var(--text-3)', textDecoration:'none', transition:'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color='var(--primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color='var(--text-3)')}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'24px', borderTop:'1px solid var(--border)', flexWrap:'wrap', gap:'12px' }}>
          <p style={{ ...M, fontSize:'11px', color:'var(--text-3)' }}>
            © {new Date().getFullYear()} ARIOSETECH. All rights reserved.
          </p>
          <div style={{ display:'flex', gap:'20px' }}>
            {['Privacy Policy','Terms of Service'].map(t => (
              <Link key={t} href={`/${t.toLowerCase().replace(/ /g,'-')}`}
                style={{ ...M, fontSize:'11px', color:'var(--text-3)', textDecoration:'none' }}
                onMouseEnter={e => (e.currentTarget.style.color='var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color='var(--text-3)')}>
                {t}
              </Link>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 6px var(--green)' }} />
            <p style={{ ...M, fontSize:'10px', color:'var(--text-3)' }}>All systems operational</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
