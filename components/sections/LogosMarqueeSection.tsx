type Props = {
  label?: string
  items?: { value?: string }[] | string[] | string
}

export default function LogosMarqueeSection({ label = 'Trusted by 100+ businesses', items = [] }: Props) {
  const M = { fontFamily: 'var(--font-mono)' } as const
  const list = Array.isArray(items)
    ? items.map((it: unknown) => (typeof it === 'string' ? it : String((it as { value?: unknown })?.value || ''))).map(s => s.trim()).filter(Boolean)
    : String(items || '').split(',').map(s => s.trim()).filter(Boolean)
  const doubled = [...list, ...list]

  if (list.length === 0) return null

  return (
    <div style={{ background: 'var(--bg-3)', borderBottom: '1px solid var(--border)', padding: '20px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...M, fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.14em', flexShrink: 0, paddingLeft: '32px', whiteSpace: 'nowrap', fontWeight: 700 }}>
          {label}
        </p>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '110px', background: 'linear-gradient(to right, var(--bg-3), transparent)', zIndex: 1, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '110px', background: 'linear-gradient(to left, var(--bg-3), transparent)', zIndex: 1, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', gap: '10px', animation: 'marquee 42s linear infinite', width: 'max-content' }}>
            {doubled.map((name, i) => (
              <span key={`${name}-${i}`} style={{ ...M, fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', padding: '5px 16px', borderRadius: 'var(--r-f)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

