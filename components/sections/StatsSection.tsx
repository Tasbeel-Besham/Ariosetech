type Item = { value: string; label: string }
type Props = { items?: Item[] }
export default function StatsSection({ items = [] }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safeItems: Item[] = Array.isArray(items) ? items : []
  return (
    <section className="section section--dark">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(safeItems.length || 4, 4)}, 1fr)`, gap: '24px' }}>
          {safeItems.map(({ value, label }, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '28px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '18px' }}>
              <p style={{ ...F, fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: '8px' }}>{value}</p>
              <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
