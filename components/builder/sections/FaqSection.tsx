'use client'
import { useState } from 'react'

type Item = { q: string; a: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }

export default function FaqSection({ eyebrow='FAQ', headline='Frequently Asked Questions', items=[] }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const F = { fontFamily: 'var(--font-display)' } as const
  const safeItems: Item[] = Array.isArray(items) ? items : []
  return (
    <section className="section" style={{ overflow: 'visible' }}>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }} className="md:flex-row md:items-start lg:gap-24">
          <div style={{ flex: '1', position: 'sticky', top: '120px' }} className="md:w-1/3 shrink-0">
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>{headline}</h2>
          </div>
          <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '8px' }} className="md:w-2/3">
            {safeItems.map(({ q, a }, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => { if (open !== i) e.currentTarget.style.borderColor = 'rgba(118,108,255,0.3)' }}
                onMouseLeave={e => { if (open !== i) e.currentTarget.style.borderColor = 'var(--border)' }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', gap: '12px', textAlign: 'left' }}>
                  <span style={{ ...F, fontSize: '14px', fontWeight: 600, color: open === i ? 'var(--primary)' : '#fff', flex: 1 }}>{q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open === i ? 'rotate(180deg)' : '', transition: 'transform 0.25s', flexShrink: 0 }}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                {open === i && (
                  <div style={{ padding: '0 20px 18px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.75 }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
