import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCollection } from '@/lib/db/mongodb'

export const metadata: Metadata = {
  title: 'Portfolio — Our Work | ARIOSETECH',
  description: 'Case studies of 100+ WordPress, WooCommerce, and Shopify projects we have delivered.',
}
export const revalidate = 60

type Item = { _id: unknown; slug: string; title: string; client: string; category: string; summary: string; results: { label: string; value: string }[]; featured: boolean }
const CAT_COLOR: Record<string,string> = { wordpress:'#4f6ef7', woocommerce:'#9b6dff', shopify:'#766cff', seo:'#fbbf24' }

async function getPortfolio(): Promise<Item[]> {
  try {
    const col = await getCollection<Item>('portfolio')
    return await col.find({ published: true }).sort({ featured: -1, updatedAt: -1 }).toArray()
  } catch { return [] }
}

export default async function PortfolioPage() {
  const items = await getPortfolio()
  const F = { fontFamily:'var(--font-display)' } as React.CSSProperties
  const M = { fontFamily:'var(--font-mono)' } as React.CSSProperties
  const P = { background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } as React.CSSProperties

  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingTop:'120px', paddingBottom:'80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 20% 60%, rgba(118,108,255,0.10) 0%, transparent 60%)', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <p className="eyebrow sr">Our Work</p>
          <h1 className="sr" style={{ ...F, fontSize:'clamp(2.4rem,5vw,4rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', color:'#fff', marginBottom:'16px', maxWidth:'700px' }}>
            Success Stories That <span style={P}>Speak for Themselves</span>
          </h1>
          <p className="sr" style={{ fontSize:'17px', color:'var(--text-2)', lineHeight:1.8, maxWidth:'540px', marginBottom:'8px' }}>
            Discover how we&apos;ve transformed businesses across industries with custom web solutions that drive growth and maximize ROI.
          </p>
          <p style={{ ...M, fontSize:'12px', color:'var(--text-3)' }}>{items.length} projects delivered</p>
        </div>
      </section>

      {/* Grid */}
      <section className="section section--dark">
        <div className="container">
          {items.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-3)' }}>
              <p style={{ marginBottom:'16px' }}>No portfolio items yet.</p>
              <Link href="/contact" className="btn btn-primary btn-md">Start a Project <ArrowRight size={14} /></Link>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
              {items.map((item, i) => {
                const color = CAT_COLOR[item.category] || '#766cff'
                return (
                  <Link key={String(item._id)} href={`/portfolio/${item.slug}`}
                    className="card card-hover sr"
                    style={{ display:'flex', flexDirection:'column', textDecoration:'none', transition:'all 0.3s var(--ease)', animationDelay:`${i*0.06}s` }}>
                    <div style={{ padding:'26px', flex:1, display:'flex', flexDirection:'column' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                        <span style={{ ...M, fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.1em', color, background:`${color}18`, border:`1px solid ${color}35`, padding:'3px 10px', borderRadius:'100px' }}>
                          {item.category}
                        </span>
                        {item.featured && (
                          <span style={{ ...M, fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--amber)', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)', padding:'3px 10px', borderRadius:'100px' }}>
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>{item.client}</p>
                      <h2 style={{ ...F, fontSize:'20px', fontWeight:800, color:'#fff', marginBottom:'10px', lineHeight:1.2 }}>{item.title}</h2>
                      <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:1.75, flex:1, marginBottom:'20px' }}>{item.summary}</p>
                      {item.results?.length > 0 && (
                        <div style={{ display:'flex', gap:'20px', paddingTop:'16px', borderTop:'1px solid var(--border)', flexWrap:'wrap' }}>
                          {item.results.slice(0,2).map(r => (
                            <div key={r.label}>
                              <p style={{ ...F, fontSize:'1.2rem', fontWeight:800, color, lineHeight:1 }}>{r.value}</p>
                              <p style={{ ...M, fontSize:'9px', color:'var(--text-3)', marginTop:'3px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{r.label}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'16px', ...M, fontSize:'11px', color, fontWeight:600 }}>
                        View Case Study <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background:'var(--bg-2)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(118,108,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <p className="eyebrow sr" style={{ justifyContent:'center' }}>Start a Project</p>
          <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, letterSpacing:'-0.03em', color:'#fff', marginBottom:'16px' }}>
            Ready to be our next success story?
          </h2>
          <div className="sr" style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Start a Project <ArrowRight size={16} /></Link>
            <Link href="/contact" className="btn btn-outline btn-lg">Get Free Quote</Link>
          </div>
        </div>
      </section>
    </>
  )
}
