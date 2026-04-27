type Props = { eyebrow?: string; headline?: string; body?: string; align?: string }
export default function HeadingSection({ eyebrow='', headline='Section Heading', body='', align='left' }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const ta = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left'
  return (
    <section className="section">
      <div className="container" style={{ textAlign: ta }}>
        {eyebrow && <p className="eyebrow" style={{ justifyContent: ta === 'center' ? 'center' : ta === 'right' ? 'flex-end' : undefined }}>{eyebrow}</p>}
        <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff', marginBottom: body ? '16px' : 0 }}>{headline}</h2>
        {body && <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '640px', margin: ta === 'center' ? '0 auto' : undefined }}>{body}</p>}
      </div>
    </section>
  )
}
