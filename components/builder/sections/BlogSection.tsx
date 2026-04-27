import Link from 'next/link'

type Post = { title: string; excerpt: string; href: string; category?: string; meta?: string }
type Props = { eyebrow?: string; headline?: string; intro?: string; ctaLabel?: string; ctaHref?: string; posts?: Post[] }

export default function BlogSection({
  eyebrow = 'Knowledge Base',
  headline = 'Latest Insights & Tutorials',
  intro = 'Practical guides, growth insights, and platform-specific tips from our team.',
  ctaLabel = 'All Articles',
  ctaHref = '/blog',
  posts = [],
}: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safe = Array.isArray(posts) ? posts : []

  return (
    <section className="section section--dark">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '52px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ ...F, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em' }}>{headline}</h2>
            {intro && <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginTop: '14px', maxWidth: '560px' }}>{intro}</p>}
          </div>
          <Link href={ctaHref} className="btn btn-outline btn-lg">
            {ctaLabel} 
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {safe.map(p => (
            <Link key={p.href} href={p.href} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.25s var(--ease)' }} className="card-hover">
              <div style={{ height: '3px', background: 'var(--grad)' }} />
              <div style={{ padding: '26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {p.category && (
                  <span style={{ ...M, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--primary)', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.2)', padding: '4px 12px', borderRadius: 'var(--r-f)', display: 'inline-block', marginBottom: '14px', width: 'fit-content', fontWeight: 700 }}>
                    {p.category}
                  </span>
                )}
                <h3 style={{ ...F, fontSize: '17px', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '10px', flex: 1 }}>{p.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.7, marginBottom: '16px' }}>{p.excerpt}</p>
                {p.meta && <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{p.meta}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

