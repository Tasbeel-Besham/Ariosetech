"use client";
import React from 'react'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

interface Item {
  icon: string
  title: string
  headline: string
  desc: string
  features: string
  price: string
  href: string
  ctaLabel?: string
}

interface Props {
  eyebrow?: string
  headline?: string
  items?: Item[]
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  wordpress: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>,
  woocommerce: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  shopify: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  seo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  speed: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  security: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  maintenance: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  default: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
}

function getServiceIcon(icon: string, title: string) {
  const t = (title || '').toLowerCase()
  if (t.includes('wordpress') && !t.includes('woo')) return SERVICE_ICONS.wordpress
  if (t.includes('woocommerce') || t.includes('woo')) return SERVICE_ICONS.woocommerce
  if (t.includes('shopify')) return SERVICE_ICONS.shopify
  if (t.includes('seo')) return SERVICE_ICONS.seo
  if (t.includes('speed') || t.includes('performance') || t.includes('optim')) return SERVICE_ICONS.speed
  if (t.includes('security') || t.includes('secure') || t.includes('virus')) return SERVICE_ICONS.security
  if (t.includes('maintenance') || t.includes('support')) return SERVICE_ICONS.maintenance
  return SERVICE_ICONS.default
}

export default function ServicesSection({ eyebrow='What We Offer', headline='Comprehensive Web Development Solutions', items=[] }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safeItems: Item[] = Array.isArray(items) ? items : []
  return (
    <section className="section section--dark">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>{headline}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {safeItems.map((svc, i) => {
            const featureList = (svc.features || '').split(',').map(f => f.trim()).filter(Boolean)
            const icon = getServiceIcon(svc.icon, svc.title)
            return (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '3px', background: 'var(--grad)' }} />
                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '20px', padding: '10px' }}>
                    {icon}
                  </div>
                  <h3 style={{ ...F, fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{svc.title}</h3>
                  <p style={{ ...F, fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '14px' }}>{svc.headline}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.75, flex: 1, marginBottom: '24px' }}>{svc.desc}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                    {featureList.map(f => <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-2)' }}><Check size={11} style={{ color: 'var(--primary)', flexShrink: 0 }} />{f}</li>)}
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ ...M, fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px', fontWeight: 700 }}>Starting at</p>
                      <p style={{ ...F, fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{svc.price}</p>
                    </div>
                    <Link href={svc.href || '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.3)', color: 'var(--primary)', textDecoration: 'none', transition: 'all 0.2s' }}>
                      {svc.ctaLabel || 'Learn More'} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
