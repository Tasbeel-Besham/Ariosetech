import { Star } from 'lucide-react'
type Item = { name: string; role: string; initials: string; quote: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }
export default function TestimonialsSection({ eyebrow='Client Reviews', headline='What Our Clients Say About Working With Us', items=[] }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safeItems: Item[] = Array.isArray(items) ? items : []
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>{headline}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(safeItems.length || 3, 3)}, 1fr)`, gap: '20px' }}>
          {safeItems.map(({ name, role, initials, quote }, i) => (
            <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>{[0,1,2,3,4].map(s => <Star key={s} size={13} fill="var(--amber)" style={{ color: 'var(--amber)' }} />)}</div>
              <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '20px' }}>&ldquo;{quote}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...F, fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
                <div>
                  <p style={{ ...F, fontSize: '13px', fontWeight: 700, color: '#fff' }}>{name}</p>
                  <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
