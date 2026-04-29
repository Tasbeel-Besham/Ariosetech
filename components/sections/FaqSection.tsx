'use client'
import { useState } from 'react'
import { ChevronDown } from '@/components/ui/Icons'

type Item = { q: string; a: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }

export default function FaqSection({ eyebrow='FAQ', headline='Frequently Asked Questions', items=[] }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const F = { fontFamily: 'var(--font-display)' } as const
  const safeItems: Item[] = Array.isArray(items) ? items : []
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>{headline}</h2>
        </div>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {safeItems.map(({ q, a }, i) => (
            <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}
              onMouseEnter={e => { if (open !== i) e.currentTarget.style.borderColor = 'rgba(118,108,255,0.3)' }}
              onMouseLeave={e => { if (open !== i) e.currentTarget.style.borderColor = 'var(--border)' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', gap: '12px', textAlign: 'left' }}>
                <span style={{ ...F, fontSize: '14px', fontWeight: 600, color: open === i ? 'var(--primary)' : '#fff', flex: 1 }}>{q}</span>
                <ChevronDown size={16} style={{ color: 'var(--text-3)', transform: open === i ? 'rotate(180deg)' : '', transition: 'transform 0.25s', flexShrink: 0 }} />
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
    </section>
  )
}
