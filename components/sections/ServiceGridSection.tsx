'use client'
import React from 'react'
import { IconBox } from '@/components/ui/IconBox'

interface ServiceItem {
  title: string
  price: string
  desc: string
  icon: string // Emoji or SVG string
}

interface ServiceGridSectionProps {
  eyebrow: string
  headline: string
  items: ServiceItem[]
}

const F = { fontFamily: 'var(--font-display)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const
const P = { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as const

export default function ServiceGridSection({
  eyebrow = "Tailored Services",
  headline = "Additional Solutions",
  items = []
}: ServiceGridSectionProps) {
  const safeItems = Array.isArray(items) ? items : []

  return (
    <section className="section section--dark" style={{ padding: '120px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          {eyebrow && <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>}
          <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800 }}>
            {headline.includes('Solutions') ? (
              <>Additional <span style={P}>Solutions</span></>
            ) : headline}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {safeItems.map((s, i) => (
            <div key={i} className="sr" style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start', transition: 'all 0.3s var(--ease)' }}>
              <IconBox size={52} radius={12}>
                <div dangerouslySetInnerHTML={{ __html: s.icon }} style={{ display: 'flex' }} />
              </IconBox>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ ...F, fontSize: '18px', color: '#fff' }}>{s.title}</h3>
                  <span style={{ ...M, fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>{s.price}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
