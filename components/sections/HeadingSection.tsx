"use client";
type Props = { eyebrow?: string; headline?: string; body?: string; align?: string }
export default function HeadingSection({ eyebrow='', headline='Section Heading', body='', align='left' }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const ta = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left'
  return (
    <section className="section">
      <div className={`container text-${ta}`}>
        {eyebrow && <p className={`eyebrow${ta === 'center' ? ' justify-center' : ta === 'right' ? ' justify-end' : ''}`}>{eyebrow}</p>}
        <h2 className={`hd-headline${body ? ' mb-16' : ''}`}>{headline}</h2>
        {body && <p className={`hd-body${ta === 'center' ? ' mx-auto' : ''}`}>{body}</p>}
      </div>
    </section>
  )
}
