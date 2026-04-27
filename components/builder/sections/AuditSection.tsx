import Link from 'next/link'

type Props = { eyebrow?: string; headline?: string; subhead?: string; desc?: string; ctaLabel?: string; ctaHref?: string; guarantee?: string }

const CHECKS = ['Performance bottleneck analysis', 'SEO issues & keyword opportunities', 'Conversion barrier identification', 'Security vulnerability check', 'Mobile experience assessment', 'Detailed action plan — no obligation']

export default function AuditSection({ eyebrow='Free Audit', headline='Get Your Free Website Performance Audit', subhead="Discover what's holding your website back from peak performance.", desc="Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.", ctaLabel='Get My Free Audit Report', ctaHref='/contact', guarantee='No spam, ever. Detailed report delivered within 24 hours.' }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  return (
    <section className="section">
      <div className="container">
        <div style={{ background: 'linear-gradient(135deg, rgba(118,108,255,0.08), rgba(118,108,255,0.04))', border: '1px solid rgba(118,108,255,0.2)', borderRadius: '24px', padding: 'clamp(32px,5vw,60px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ ...F, fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff', marginBottom: '12px' }}>{headline}</h2>
            <p style={{ ...F, fontSize: '15px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '10px' }}>{subhead}</p>
            <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.75, marginBottom: '10px' }}>{desc}</p>
            <p style={{ ...M, fontSize: '11px', color: 'var(--text-3)', fontStyle: 'italic' }}>{guarantee}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CHECKS.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,229,160,0.12)', border: '1px solid rgba(0,229,160,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-2)' }}>{item}</span>
              </div>
            ))}
            <Link href={ctaHref} className="btn btn-primary btn-lg" style={{ marginTop: '8px', justifyContent: 'center' }}>
              {ctaLabel} 
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
