import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'
import { getCollection } from '@/lib/db/mongodb'
import type { BlogDoc } from '@/types'

export const metadata: Metadata = { title: 'Blog — ARIOSETECH', description: 'Expert articles on WordPress, Shopify, WooCommerce and e-commerce.' }
export const dynamic = 'force-dynamic'

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const

export default async function BlogPage() {
  let posts: BlogDoc[] = []
  try {
    const col = await getCollection<BlogDoc>('blogs')
    posts = await col.find({ published: true }).sort({ date: -1 }).toArray()
  } catch { /* DB not configured */ }

  const [featured, ...rest] = posts

  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingTop:'120px', paddingBottom:'80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(118,108,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <p className="eyebrow sr">Knowledge Base</p>
          <h1 className="sr" style={{ ...hs, fontSize:'clamp(2.4rem,5vw,4.5rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', marginBottom:'16px' }}>
            Insights & expertise<br />
            <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>from the field.</span>
          </h1>
          <p className="sr" style={{ fontSize:'16px', color:'var(--text-2)', lineHeight:1.75, maxWidth:'500px' }}>
            Expert articles on WordPress, Shopify, WooCommerce, and e-commerce best practices from our team.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="section section--dark">
          <div className="container">
            <p className="eyebrow sr" style={{ marginBottom:'24px' }}>Featured Article</p>
            <Link href={`/blog/${featured.slug}`} className="card card-hover sr"
              style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'center', textDecoration:'none', padding:'48px', transition:'all 0.3s var(--ease)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'var(--grad)' }} />
              <div>
                <span style={{ ...hm, fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.25)', color:'var(--primary)', padding:'4px 12px', borderRadius:'100px', display:'inline-block', marginBottom:'20px' }}>
                  {featured.category}
                </span>
                <h2 style={{ ...hs, fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:800, lineHeight:1.1, letterSpacing:'-0.02em', color:'#fff', marginBottom:'16px' }}>{featured.title}</h2>
                <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.7, marginBottom:'24px' }}>{featured.excerpt}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--primary)', fontSize:'13px', fontWeight:600, fontFamily:'var(--font-display)' }}>
                  Read article <ArrowRight size={14} />
                </div>
              </div>
              <div style={{ background:'var(--bg-3)', borderRadius:'16px', aspectRatio:'16/9', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px', border:'1px solid var(--border)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity:0.6 }}>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <p style={{ ...hm, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{featured.category}</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All Posts */}
      {rest.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="eyebrow sr" style={{ marginBottom:'36px' }}>All Articles</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
              {rest.map((post, i) => (
                <Link key={String(post._id)} href={`/blog/${post.slug}`}
                  className="card card-hover sr"
                  style={{ display:'flex', flexDirection:'column', textDecoration:'none', transition:'all 0.25s var(--ease)', animationDelay:`${i*0.06}s`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'var(--grad)' }} />
                  <div style={{ padding:'26px', flex:1, display:'flex', flexDirection:'column' }}>
                    <span style={{ ...hm, fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.14em', color:'var(--primary)', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', padding:'4px 12px', borderRadius:'var(--r-f)', display:'inline-block', marginBottom:'14px', width:'fit-content', fontWeight:700 }}>
                      {post.category}
                    </span>
                    <h3 style={{ ...hs, fontSize:'17px', fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:'10px', flex:1 }}>{post.title}</h3>
                    <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:1.7, marginBottom:'16px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{post.excerpt}</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <p style={{ ...hm, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>
                        {new Date(post.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · {post.readTime}min
                      </p>
                      <ArrowRight size={14} color="var(--primary)" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section className="section">
          <div className="container" style={{ textAlign:'center', padding:'60px 0' }}>
            <p style={{ fontSize:'15px', color:'var(--text-3)' }}>No posts yet. Check back soon.</p>
          </div>
        </section>
      )}
    </>
  )
}
