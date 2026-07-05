"use client";
import Link from 'next/link'

type Props = { eyebrow?: string; headline?: string; subheadline?: string; desc?: string; tags?: string; trust?: string; ctaPrimaryLabel?: string; ctaPrimaryHref?: string; ctaLabel?: string; ctaHref?: string; ctaSecondaryLabel?: string; ctaSecondaryHref?: string; secondaryLabel?: string; secondaryHref?: string }

export default function CtaSection({ eyebrow='Get Started Today', headline='Start Your Success Story Today', subheadline, desc, tags, trust, ctaPrimaryLabel, ctaPrimaryHref, ctaLabel='Schedule Free Consultation', ctaHref='/contact', ctaSecondaryLabel, ctaSecondaryHref, secondaryLabel='View Our Portfolio', secondaryHref='/portfolio' }: Props) {
  const body = subheadline || desc || 'Join 100+ successful businesses that chose ARIOSETECH for their web development needs.'
  const badgeStr = tags || trust || ''
  const badges = badgeStr ? badgeStr.split(',').map(s=>s.trim()).filter(Boolean) : []
  const primaryLabel = ctaPrimaryLabel || ctaLabel
  const primaryHref  = ctaPrimaryHref  || ctaHref
  const secLabel = ctaSecondaryLabel || secondaryLabel
  const secHref  = ctaSecondaryHref  || secondaryHref || '/portfolio'
  const lines = headline.split('\n')
  return (
    <section className="cta-section">
      <div className="cta-glow" />
      <div className="cta-grid-bg" />
      <div className="container cta-inner">
        <p className="eyebrow sr justify-center">{eyebrow}</p>
        <h2 className="sr cta-headline">
          {lines.map((line,i) => (
            <span key={i}>{i===lines.length-1 ? <span className="cta-headline-accent">{line}</span> : <>{line}<br/></>}</span>
          ))}
        </h2>
        <p className="sr cta-body">{body}</p>
        {badges.length > 0 && (
          <div className="sr cta-badges">
            {badges.map(t => <span key={t} className="tag cta-badge inline-flex items-center gap-6"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>{t}</span>)}
          </div>
        )}
        <div className="sr cta-actions">
          <Link href={primaryHref} className="btn btn-primary btn-lg">
            {primaryLabel}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          {secLabel && <Link href={secHref} className="btn btn-outline btn-lg">{secLabel}</Link>}
        </div>
      </div>
    </section>
  )
}
