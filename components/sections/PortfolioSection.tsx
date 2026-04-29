import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'

type Item = { title: string; client: string; platform: string; result: string; resultLabel: string; quote: string; image?: string }
type Props = { eyebrow?: string; headline?: string; intro?: string; items?: Item[]; ctaLabel?: string; ctaHref?: string }

export default function PortfolioSection({ eyebrow='Our Work', headline='Success Stories That Speak for Themselves', intro='', items=[], ctaLabel='Explore All Projects', ctaHref='/portfolio' }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safeItems: Item[] = Array.isArray(items) ? items : []

  const placeholder = (title: string) =>
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0f0f1a"/>
            <stop offset="1" stop-color="#050508"/>
          </linearGradient>
          <radialGradient id="r" cx="30%" cy="35%" r="70%">
            <stop offset="0" stop-color="rgba(118,108,255,0.25)"/>
            <stop offset="1" stop-color="rgba(118,108,255,0)"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="900" fill="url(#g)"/>
        <rect width="1200" height="900" fill="url(#r)"/>
        <text x="70" y="120" fill="rgba(255,255,255,0.75)" font-family="Arial, sans-serif" font-weight="800" font-size="56">${title}</text>
        <text x="70" y="170" fill="rgba(255,255,255,0.35)" font-family="Arial, sans-serif" font-weight="600" font-size="20">Project preview</text>
        <rect x="70" y="220" width="1060" height="610" rx="26" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
      </svg>`
    )}`

  return (
    <section className="section section--dark">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff' }}>{headline}</h2>
            {intro && <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7, marginTop: '8px', maxWidth: '540px' }}>{intro}</p>}
          </div>
          <Link href={ctaHref} className="btn btn-outline btn-md">{ctaLabel} <ArrowRight size={14} /></Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {safeItems.map((p, i) => (
            <div
              key={i}
              style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.35s var(--ease), border-color 0.2s var(--ease)', cursor: 'pointer' }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(118,108,255,0.35)'
                el.style.transform = 'translateY(-6px)'
                const img = el.querySelector('[data-ps-img]') as HTMLElement | null
                if (img) img.style.transform = 'translateY(-18%)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--border)'
                el.style.transform = ''
                const img = el.querySelector('[data-ps-img]') as HTMLElement | null
                if (img) img.style.transform = 'translateY(0%)'
              }}
            >
              <div style={{ height: '3px', background: 'var(--grad)' }} />
              {/* Image preview (scroll on hover) */}
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid var(--border)' }}>
                <div
                  data-ps-img
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url("${p.image || placeholder(p.title)}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    transform: 'translateY(0%)',
                    transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                    willChange: 'transform',
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.1) 60%)' }} />
              </div>
              <div style={{ padding: '26px' }}>
                <p style={{ ...M, fontSize: '9px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{p.client}</p>
                <h3 style={{ ...F, fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>{p.title}</h3>
                <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', marginBottom: '12px' }}>{p.platform}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '18px' }}>&ldquo;{p.quote}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ ...F, fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{p.result}</p>
                  <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.resultLabel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
