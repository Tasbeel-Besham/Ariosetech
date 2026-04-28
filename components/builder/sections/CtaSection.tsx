import Link from 'next/link'

type Props = { eyebrow?: string; headline?: string; subheadline?: string; desc?: string; tags?: string; trust?: string; ctaPrimaryLabel?: string; ctaPrimaryHref?: string; ctaLabel?: string; ctaHref?: string; ctaSecondaryLabel?: string; ctaSecondaryHref?: string; secondaryLabel?: string; secondaryHref?: string }

export default function CtaSection({ eyebrow='Get Started Today', headline='Start Your Success Story Today', subheadline, desc, tags, trust, ctaPrimaryLabel, ctaPrimaryHref, ctaLabel='Schedule Free Consultation', ctaHref='/contact', ctaSecondaryLabel, ctaSecondaryHref, secondaryLabel='View Our Portfolio', secondaryHref='/portfolio' }: Props) {
  const F = { fontFamily:'var(--font-display)' } as const
  const P = { background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } as const
  const body = subheadline || desc || 'Join 100+ successful businesses that chose ARIOSETECH for their web development needs.'
  const badgeStr = tags || trust || ''
  const badges = badgeStr ? badgeStr.split(',').map(s=>s.trim()).filter(Boolean) : []
  const primaryLabel = ctaPrimaryLabel || ctaLabel
  const primaryHref  = ctaPrimaryHref  || ctaHref
  const secLabel = ctaSecondaryLabel || secondaryLabel
  const secHref  = ctaSecondaryHref  || secondaryHref || '/portfolio'
  const lines = headline.split('\n')
  return (
    <section style={{ padding:'120px 0', borderBottom:'1px solid var(--border)', position:'relative', overflow:'hidden', background:'var(--bg-2)' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(118,108,255,0.10) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize:'80px 80px', maskImage:'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)', pointerEvents:'none' }} />
      <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
        <p className="eyebrow sr" style={{ justifyContent:'center' }}>{eyebrow}</p>
        <h2 className="sr" style={{ ...F, fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:800, letterSpacing:'-0.05em', lineHeight:0.95, color:'#fff', marginBottom:'20px' }}>
          {lines.map((line,i) => (
            <span key={i}>{i===lines.length-1 ? <span style={P}>{line}</span> : <>{line}<br/></>}</span>
          ))}
        </h2>
        <p className="sr" style={{ fontSize:'18px', color:'var(--text-2)', lineHeight:1.8, maxWidth:'520px', margin:'0 auto 20px' }}>{body}</p>
        {badges.length > 0 && (
          <div className="sr" style={{ display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center', marginBottom:'40px' }}>
            {badges.map(t => <span key={t} className="tag" style={{ color:'var(--text-2)', border:'1px solid var(--border-2)' }}>✓ {t}</span>)}
          </div>
        )}
        <div className="sr" style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
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
