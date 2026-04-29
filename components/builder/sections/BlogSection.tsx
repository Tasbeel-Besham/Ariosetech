'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

type Post = { _id: string; slug: string; title: string; excerpt: string; category: string; date: string; readTime: number }
type Props = { eyebrow?: string; headline?: string; ctaLabel?: string; ctaHref?: string; limit?: number }

export default function BlogSection({ eyebrow='Knowledge Base', headline='Latest Insights & Tutorials', ctaLabel='All Articles', ctaHref='/blog', limit=3 }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const F = { fontFamily:'var(--font-display)' } as const
  const M = { fontFamily:'var(--font-mono)' } as const

  useEffect(() => {
    fetch(`/api/blogs?limit=${limit}&published=true`)
      .then(r => r.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data.slice(0, limit) : [])
        setLoaded(true)
        // Re-trigger scroll reveal after posts load
        setTimeout(() => {
          if (sectionRef.current) {
            const els = sectionRef.current.querySelectorAll('.sr:not(.sr-visible)')
            const obs = new IntersectionObserver((entries) => {
              entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('sr-visible'); obs.unobserve(e.target) } })
            }, { threshold: 0.05 })
            els.forEach(el => obs.observe(el))
          }
        }, 100)
      })
      .catch(() => { setPosts([]); setLoaded(true) })
  }, [limit])

  if (loaded && posts.length === 0) {
    return (
      <section className="section section--dark">
        <div className="container" style={{ textAlign:'center', padding:'40px 0' }}>
          <p style={{ ...F, fontSize:'14px', color:'var(--text-3)' }}>No blog posts yet — run the seed or add posts in Admin → Blog Posts.</p>
        </div>
      </section>
    )
  }

  if (!loaded) return (
    <section className="section section--dark">
      <div className="container" style={{ textAlign:'center', padding:'40px 0' }}>
        <div style={{ width:'32px', height:'32px', borderRadius:'50%', border:'2px solid var(--border)', borderTopColor:'var(--primary)', animation:'spin 0.8s linear infinite', margin:'0 auto' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </section>
  )

  return (
    <section ref={sectionRef} className="section section--dark">
      <div className="container">
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'52px', flexWrap:'wrap', gap:'20px' }}>
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em' }}>{headline}</h2>
          </div>
          <Link href={ctaHref} className="btn btn-outline btn-lg">
            {ctaLabel}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
          {posts.map((post, i) => (
            <Link key={post._id} href={`/blog/${post.slug}`}
              className="card card-hover"
              style={{ display:'flex', flexDirection:'column', textDecoration:'none', transition:'all 0.25s var(--ease)', animationDelay:`${i*0.08}s` }}
              onMouseEnter={e=>{const el=e.currentTarget;el.style.transform='translateY(-5px)'}}
              onMouseLeave={e=>{const el=e.currentTarget;el.style.transform=''}}>
              <div style={{ padding:'26px', flex:1, display:'flex', flexDirection:'column' }}>
                <span style={{ ...M, fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.14em', color:'var(--primary)', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', padding:'4px 12px', borderRadius:'var(--r-f)', display:'inline-block', marginBottom:'14px', width:'fit-content', fontWeight:700 }}>{post.category}</span>
                <h3 style={{ ...F, fontSize:'17px', fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:'10px', flex:1 }}>{post.title}</h3>
                <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:1.7, marginBottom:'16px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{post.excerpt}</p>
                <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>
                  {new Date(post.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · {post.readTime}min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
