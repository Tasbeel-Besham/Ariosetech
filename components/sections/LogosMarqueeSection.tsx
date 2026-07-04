"use client";
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
    <div className="logos-strip">
      <div className="flex items-center gap-16">
        <p className="logos-label">
          {label}
        </p>
        <div className="logos-track">
          <div className="logos-fade logos-fade-l" />
          <div className="logos-fade logos-fade-r" />
          <div className="logos-marquee">
            {doubled.map((name, i) => (
              <span key={`${name}-${i}`} className="logos-chip">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

