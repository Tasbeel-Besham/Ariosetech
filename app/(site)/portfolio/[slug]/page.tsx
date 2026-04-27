import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react'
import { getCollection } from '@/lib/db/mongodb'

type Props = { params: Promise<{ slug: string }> }

type PortfolioSection = { id: string; type: string; title: string; content: string; items?: string[] }

type PortfolioItem = {
  _id: unknown; slug: string; title: string; client: string; clientUrl?: string
  category: string; summary: string; challenge: string; solution: string; quote: string
  results: { label: string; value: string }[]; stack: string[]; image?: string
  sections?: PortfolioSection[]
  featured: boolean; published: boolean; updatedAt: string
}

const CAT_COLOR: Record<string, string> = {
  wordpress: '#4f6ef7', woocommerce: '#9b6dff', shopify: '#766cff', seo: '#fbbf24'
}

async function getItem(slug: string) {
  try {
    const col = await getCollection<PortfolioItem>('portfolio')
    return await col.findOne({ slug, published: true })
  } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) return {}
  return {
    title: `${item.title} — Case Study`,
    description: item.summary,
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) notFound()

  const color = CAT_COLOR[item.category] || '#766cff'
  const F = { fontFamily: 'var(--font-display)' } as React.CSSProperties
  const M = { fontFamily: 'var(--font-mono)' } as React.CSSProperties

  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: '100px', paddingBottom: '72px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 50% at 20% 60%, ${color}18 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', ...M, fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none', marginBottom: '28px', transition: 'color 0.2s' }}
            onMouseEnter={undefined} className="hover:text-[var(--text-2)]">
            <ArrowLeft size={13} /> Back to Portfolio
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ ...M, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color, background: `${color}15`, border: `1px solid ${color}30`, padding: '4px 12px', borderRadius: '100px' }}>
              {item.category}
            </span>
          </div>

          <h1 style={{ ...F, fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#fff', marginBottom: '12px' }}>{item.title}</h1>
          <p style={{ ...M, fontSize: '14px', color: 'var(--text-3)', marginBottom: '20px' }}>{item.client}</p>
          <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '680px', marginBottom: '32px' }}>{item.summary}</p>

          {item.clientUrl && (
            <a href={item.clientUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}35`, color, textDecoration: 'none', ...F, fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}>
              Visit Live Site <ExternalLink size={14} />
            </a>
          )}
        </div>
      </section>

      {/* Results stats */}
      {item.results && item.results.length > 0 && (
        <section style={{ padding: '56px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
          <div className="container">
            <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '28px', textAlign: 'center' }}>Results Achieved</p>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(item.results.length, 4)}, 1fr)`, gap: '20px' }}>
              {item.results.map((r) => (
                <div key={r.label} style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px' }}>
                  <p style={{ ...F, fontSize: '2.4rem', fontWeight: 800, color, lineHeight: 1, marginBottom: '8px' }}>{r.value}</p>
                  <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Challenge + Solution */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            {item.challenge && (
              <div>
                <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>The Challenge</p>
                <h2 style={{ ...F, fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>What problem did we solve?</h2>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.85 }}>{item.challenge}</p>
              </div>
            )}
            {item.solution && (
              <div>
                <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>Our Solution</p>
                <h2 style={{ ...F, fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>How we built it</h2>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.85 }}>{item.solution}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quote */}
      {item.quote && (
        <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
          <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color, marginBottom: '20px', lineHeight: 1 }}>&ldquo;</div>
            <p style={{ ...F, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 600, color: '#fff', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>{item.quote}</p>
            <p style={{ ...M, fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.client}</p>
          </div>
        </section>
      )}

      {/* Tech stack */}
      {item.stack && item.stack.length > 0 && (
        <section style={{ padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px', textAlign: 'center' }}>Technologies Used</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {item.stack.map(tech => (
                <div key={tech} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}>
                  <Check size={12} style={{ color }} /> {tech}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Extra sections */}
      {item.sections && item.sections.length > 0 && item.sections.map(sec => (
        <section key={sec.id} style={{ padding: '72px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            {sec.title && (
              <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>{sec.title}</p>
            )}

            {sec.type === 'text' && (
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.9, maxWidth: '720px', whiteSpace: 'pre-wrap' }}>{sec.content}</p>
            )}

            {sec.type === 'quote' && (
              <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', color, lineHeight: 1, marginBottom: '16px' }}>&ldquo;</div>
                <p style={{ ...F, fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 600, color: '#fff', lineHeight: 1.65, fontStyle: 'italic' }}>{sec.content}</p>
              </div>
            )}

            {sec.type === 'image' && sec.content && (
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sec.content} alt={sec.title || 'Project image'} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}

            {sec.type === 'highlights' && sec.items && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {sec.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `${color}15`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {sec.type === 'metrics' && sec.items && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(sec.items.length, 4)}, 1fr)`, gap: '20px' }}>
                {sec.items.map((item, i) => {
                  const [val, lbl] = item.split('::')
                  return (
                    <div key={i} style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                      <p style={{ ...F, fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1, marginBottom: '8px' }}>{val}</p>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lbl}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {sec.type === 'technology' && sec.items && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {sec.items.map((tech, i) => (
                  <span key={i} style={{ padding: '8px 16px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}>
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {sec.type === 'process' && sec.items && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '680px' }}>
                {sec.items.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${color}15`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...F, fontSize: '12px', fontWeight: 800, color }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.7, paddingTop: '5px' }}>{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ padding: '100px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Start Your Project</p>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: '16px' }}>
            Ready for results like these?
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.75 }}>
            Get a free consultation and let&apos;s discuss how we can deliver similar results for your business.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-xl">Start a Project <ArrowRight size={16} /></Link>
            <Link href="/portfolio" className="btn btn-outline btn-xl">View More Work</Link>
          </div>
        </div>
      </section>
    </>
  )
}
