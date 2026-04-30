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
  
  // Footer data states
  const [ctaHeadline, setCtaHeadline] = useState('Ready to grow your business online?')
  const [ctaDesc, setCtaDesc] = useState('Join 100+ successful businesses. Professional results, affordable pricing, and ongoing support.')
  const [ctaLabel, setCtaLabel] = useState('Schedule Free Consultation')
  const [ctaHref, setCtaHref] = useState('/contact')
  const [tagline, setTagline] = useState('Professional WordPress, Shopify & WooCommerce Development since 2017. Trusted by 100+ businesses in the USA, UAE, and Switzerland.')
  const [bottomText, setBottomText] = useState(`© ${new Date().getFullYear()} ARIOSETECH. All rights reserved.`)
  const [columns, setColumns] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/header').then(r => r.json()).catch(() => ({})),
      fetch('/api/settings').then(r => r.json()).catch(() => ({})),
      fetch('/api/footer').then(r => r.json()).catch(() => ({}))
    ]).then(([headerData, settingsData, footerData]) => {
      const logo = String(settingsData.logo_url || headerData.logo || '').trim()
      if (logo && logo.startsWith('http')) setLogoUrl(logo)
      
      const alt = String(settingsData.site_name || headerData.logoAlt || 'ARIOSETECH').trim()
      if (alt) setSiteName(alt)

      if (footerData.ctaHeadline) setCtaHeadline(footerData.ctaHeadline)
      if (footerData.ctaDesc) setCtaDesc(footerData.ctaDesc)
      if (footerData.ctaPrimaryLabel) setCtaLabel(footerData.ctaPrimaryLabel)
      if (footerData.ctaPrimaryHref) setCtaHref(footerData.ctaPrimaryHref)
      if (footerData.tagline) setTagline(footerData.tagline)
      if (footerData.bottomText) setBottomText(footerData.bottomText)

      if (Array.isArray(footerData.columns) && footerData.columns.length > 0) {
        setColumns(footerData.columns)
      } else {
        // Fallback matching default layout
        setColumns([
          { title: 'WordPress', links: [
            { label: 'Website Development', href: '/services/wordpress' },
            { label: 'Migration Services', href: '/services/wordpress#migration' },
            { label: 'Speed Optimization', href: '/services/wordpress#speed' },
            { label: 'Website Redesign', href: '/services/wordpress#redesign' },
          ]},
          { title: 'Shopify', links: [
            { label: 'Store Development', href: '/services/shopify' },
            { label: 'Migration Services', href: '/services/shopify#migration' },
            { label: 'Store Redesign', href: '/services/shopify#redesign' },
            { label: 'App Development', href: '/services/shopify#app-dev' },
          ]},
          { title: 'WooCommerce', links: [
            { label: 'Store Development', href: '/services/woocommerce' },
            { label: 'Theme Customization', href: '/services/woocommerce#theme' },
            { label: 'Payment Gateway', href: '/services/woocommerce#payments' },
            { label: 'Migration Services', href: '/services/woocommerce#migration' },
          ]},
          { title: 'Company', links: [
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
      <div style={{ background:'linear-gradient(135deg, rgba(118,108,255,0.18), rgba(118,108,255,0.06))', borderBottom:'1px solid rgba(118,108,255,0.2)', padding:'64px 0', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-50%', right:'-10%', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(118,108,255,0.15) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', gap:'40px', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:'280px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize:'clamp(1.8rem,4vw,2.4rem)', fontWeight:800, color:'#fff', marginBottom:'12px', letterSpacing:'-0.03em', lineHeight:1.1 }}>
              {ctaHeadline}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize:'16px', color:'var(--text-2)', lineHeight:1.7, fontWeight: 500, maxWidth:'600px' }}>
              {ctaDesc}
            </p>
          </div>
          <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', flexShrink:0 }}>
            <Link href={ctaHref} className="btn btn-primary btn-lg" style={{ padding:'18px 36px' }}>{ctaLabel}</Link>
            <a href="https://wa.me/923009484739" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg" style={{ padding:'18px 36px' }}>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding:'64px 0 40px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'40px', marginBottom:'52px' }}>

          {/* Brand column */}
          <div>
            <Link href="/" style={{ display:'flex', alignItems:'center', textDecoration:'none', flexShrink:0, marginBottom:'20px' }}>
              <div style={{ fontFamily:'var(--font-logo), sans-serif', fontSize:'22px', color:'#fff', letterSpacing:'1px', lineHeight:1 }}>
                {logoUrl ? <img src={logoUrl} alt={siteName} style={{ height:'28px', maxWidth:'160px', width:'auto', objectFit:'contain', display:'block' }} /> : siteName}
              </div>
            </Link>
            <p style={{ fontFamily: 'var(--font-body)', fontSize:'13px', color:'var(--text-3)', lineHeight:1.85, marginBottom:'28px', maxWidth:'300px', fontWeight: 500 }}>
              {tagline}
            </p>

            {/* Socials */}
            <div style={{ display:'flex', gap:'8px' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width:'36px', height:'36px', borderRadius:'8px', background:'var(--bg-3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-3)', textDecoration:'none', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--primary-soft)'; e.currentTarget.style.borderColor='rgba(118,108,255,0.3)'; e.currentTarget.style.color='var(--primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='var(--bg-3)'; e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-3)' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col, idx) => (
            <div key={idx}>
              <p style={{ ...M, fontSize:'13px', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'20px' }}>{col.title}</p>
              {col.links && col.links.length > 0 && (
                <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'12px' }}>
                  {col.links.map((item: any) => (
                    <li key={item.href}>
                      <Link href={item.href} target={item.target || '_self'} style={{ fontFamily: 'var(--font-body)', fontSize:'13px', color:'rgba(255,255,255,0.65)', textDecoration:'none', transition:'color 0.2s', fontWeight: 500 }}
                        onMouseEnter={e => (e.currentTarget.style.color='var(--primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.65)')}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Contact Information Column */}
          <div>
            <p style={{ ...M, fontSize:'13px', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'20px' }}>Contact</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <a href="mailto:info@ariosetech.com" style={{ fontFamily: 'var(--font-body)', display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', color:'rgba(255,255,255,0.65)', textDecoration:'none', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color='var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.65)')}>
                <Mail size={16} style={{ flexShrink:0 }} /> info@ariosetech.com
              </a>
              <a href="https://wa.me/923009484739" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)', display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', color:'rgba(255,255,255,0.65)', textDecoration:'none', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color='var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.65)')}>
                <Phone size={16} style={{ flexShrink:0 }} /> +92 300 9484 739
              </a>
              <div style={{ fontFamily: 'var(--font-body)', display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'13px', color:'rgba(255,255,255,0.65)', margin:0, maxWidth:'240px', lineHeight: 1.6, fontWeight: 500 }}>
                <MapPin size={16} style={{ flexShrink:0, marginTop:'3px' }} />
                <span>95 College Road, Block E, PCSIR<br/>Staff Colony, Lahore, 54770</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'24px', borderTop:'1px solid var(--border)', flexWrap:'wrap', gap:'12px' }}>
          <p style={{ ...M, fontSize:'11px', color:'var(--text-3)' }}>
            {bottomText}
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
