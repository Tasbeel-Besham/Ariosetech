import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
type Props = { eyebrow?: string; headline?: string; desc?: string; trust?: string; ctaLabel?: string; ctaHref?: string; secondaryLabel?: string; secondaryHref?: string }
export default function CtaSection({ eyebrow='Get Started', headline='Start Your Success Story Today', desc='Join 100+ successful businesses that chose ARIOSETECH.', trust='', ctaLabel='Schedule Free Consultation', ctaHref='/contact', secondaryLabel='View Our Portfolio', secondaryHref='/portfolio' }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const badges = trust ? trust.split(',').map(s => s.trim()).filter(Boolean) : []
  return (
    <section style={{ padding: '100px 0', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(118,108,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
        <h2 style={{ ...F, fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#fff', marginBottom: '16px' }}>{headline}</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 16px' }}>{desc}</p>
        {badges.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
            {badges.map(t => <span key={t} className="tag">✓ {t}</span>)}
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={ctaHref} className="btn btn-primary btn-xl">{ctaLabel} <ArrowRight size={16} /></Link>
          {secondaryLabel && <Link href={secondaryHref} className="btn btn-outline btn-xl">{secondaryLabel}</Link>}
        </div>
      </div>
    </section>
  )
}
