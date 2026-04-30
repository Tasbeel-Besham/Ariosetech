import Link from 'next/link'
import { IconBox, CheckSVG, ArrowSVG } from '@/components/ui/IconBox'

type CheckItem = { value: string }
type Props = { eyebrow?: string; headline?: string; subheadline?: string; subhead?: string; desc?: string; note?: string; guarantee?: string; ctaLabel?: string; ctaHref?: string; items?: CheckItem[] }

const DEFAULT_ITEMS = ['Performance bottleneck analysis','SEO issues & keyword opportunities','Conversion barrier identification','Security vulnerability check','Mobile experience assessment','Detailed action plan — no obligation']

export default function AuditSection({ eyebrow='Free Audit', headline='Get Your Free Website Performance Audit', subheadline, subhead, desc="Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.", note, guarantee, ctaLabel='Get My Free Audit Report', ctaHref='/contact', items=[] }: Props) {
  const F = { fontFamily:'var(--font-display)' } as const
  const M = { fontFamily:'var(--font-mono)' } as const
  const sub = subheadline || subhead || "Discover what's holding your website back from peak performance."
  const noteText = note || guarantee || 'No spam, ever. Detailed report delivered within 24 hours.'
  const checks = items.length ? items.map(i=>i.value).filter(Boolean) : DEFAULT_ITEMS
  return (
    <section className="section">
      <div className="container">
        <div style={{ background:'linear-gradient(135deg, rgba(118,108,255,0.10) 0%, rgba(118,108,255,0.04) 100%)', border:'1px solid rgba(118,108,255,0.20)', borderRadius:'28px', padding:'clamp(40px,6vw,72px)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'56px', alignItems:'center' }}>
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ ...F, fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.04em', marginBottom:'16px' }}>{headline}</h2>
            <p style={{ ...F, fontSize:'17px', fontWeight:600, color:'var(--text-2)', marginBottom:'12px' }}>{sub}</p>
            <p style={{ fontSize:'15px', color:'var(--text-3)', lineHeight:1.8, marginBottom:'14px' }}>{desc}</p>
            <p style={{ ...M, fontSize:'11px', color:'var(--text-3)', fontStyle:'italic' }}>{noteText}</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            {checks.map(item => (
              <div key={item} style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                <IconBox size={32} radius={10}>
                  <CheckSVG size={14} />
                </IconBox>
                <span style={{ fontSize:'15px', color:'var(--text-2)', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
            <Link href={ctaHref} className="btn btn-primary btn-lg" style={{ marginTop:'10px', justifyContent:'center' }}>
              {ctaLabel}
              <ArrowSVG />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
