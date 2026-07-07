'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from '@/components/ui/Icons'
import { useFooterCta } from '@/components/layout/FooterCtaContext'

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

  // Per-page CTA override (set by pages via <SetFooterCta/>). Falls back to
  // the global footer config when a page hasn't set its own.
  const { cta: pageCta } = useFooterCta()
  const shownHeadline = pageCta?.headline || ctaHeadline
  const shownDesc     = pageCta?.desc || ctaDesc
  const shownLabel    = pageCta?.primaryLabel || ctaLabel
  const shownHref     = pageCta?.primaryHref || ctaHref

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
    <footer className="site-footer">
      {/* CTA banner */}
      <div className="footer-cta">
        <div className="footer-cta-orb" />
        <div className="container flex flex-col md:flex-row items-center text-center md:text-left justify-between footer-cta-inner">
          <div className="flex-1 w-full">
            <h2 className="footer-cta-headline">
              {shownHeadline}
            </h2>
            <p className="mx-auto md:mx-0 footer-cta-sub">
              {shownDesc}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-[14px] shrink-0">
            <Link href={shownHref} className="btn btn-primary btn-lg">{shownLabel}</Link>
            <a href="https://wa.me/923009484739" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container footer-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 footer-grid">

          {/* Brand column */}
          <div className="col-span-full lg:col-span-1">
            <Link href="/" className="footer-logo-link">
              <div className="footer-wordmark">
                {logoUrl ? <img src={logoUrl} alt={siteName} className="footer-logo-img" /> : siteName}
              </div>
            </Link>
            <p className="footer-about">
              {tagline}
            </p>

            {/* Socials */}
            <div className="flex gap-8">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="footer-social">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col, idx) => (
            <div key={idx}>
              <p className="footer-col-title">{col.title}</p>
              {col.links && col.links.length > 0 && (
                <ul className="footer-col-list">
                  {col.links.map((item: any) => (
                    <li key={item.href}>
                      <Link href={item.href} target={item.target || '_self'} className="footer-link">
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
            <p className="footer-col-title">Contact</p>
            <div className="flex flex-col gap-12">
              <a href="mailto:info@ariosetech.com" className="footer-contact-link">
                <Mail size={16} className="shrink-0" /> info@ariosetech.com
              </a>
              <a href="https://wa.me/923009484739" target="_blank" rel="noopener noreferrer" className="footer-contact-link">
                <Phone size={16} className="shrink-0" /> +92 300 9484 739
              </a>
              <div className="footer-address">
                <MapPin size={16} className="shrink-0 mt-3" />
                <span>95 College Road, Block E, PCSIR<br/>Staff Colony, Lahore, 54770</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between footer-bottom">
          <p className="footer-fineprint">
            {bottomText}
          </p>
          <div className="flex gap-x-6 gap-y-3 flex-wrap items-center">
            {['Privacy Policy','Terms of Service','FAQ'].map(t => (
              <Link key={t} href={`/${t.toLowerCase().replace(/ /g,'-')}`}
                className="footer-legal-link">
                {t}
              </Link>
            ))}
            <a href="https://g.co/kgs/oiGmWD7" target="_blank" rel="noopener noreferrer"
              className="footer-review-link">
              <svg className="footer-review-star" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              5.0 Google Reviews
            </a>
          </div>
          <div className="footer-status">
            <div className="footer-status-dot" />
            <p className="footer-status-text">All systems operational</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
