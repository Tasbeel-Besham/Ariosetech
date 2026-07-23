"use client";
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'

type Post = { _id: string; slug: string; title: string; excerpt: string; category: string; date: string; readTime: number }
type Props = {
  headingTag?: string;
  eyebrow?: string; headline?: string; ctaLabel?: string; ctaHref?: string; limit?: number }

export default function BlogSection({ headingTag='h2', eyebrow='Knowledge Base', headline='Latest Insights & Tutorials', ctaLabel='All Articles', ctaHref='/blog', limit=3 }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
        <div className="container text-center py-[40px]">
          <p className="font-display text-gray-3 text-sm">No blog posts yet, run the seed or add posts in Admin → Blog Posts.</p>
        </div>
      </section>
    )
  }

  if (!loaded) return (
    <section className="section section--dark">
      <div className="container text-center py-[40px]">
        <div className="rounded-full mx-auto w-[32px] h-[32px] border-2 border-solid border-[var(--border)] border-t-[var(--primary)] animate-[spin_0.8s_linear_infinite]" />
      </div>
    </section>
  )

  return (
    <section ref={sectionRef} className="section section--dark">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-20 mb-64">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <SectionHeading as={headingTag} className="font-display font-extrabold leading-none tracking-tighter text-[clamp(2rem,4vw,3rem)]">{headline}</SectionHeading>
          </div>
          <Link href={ctaHref} className="btn btn-outline btn-lg shrink-0">
            {ctaLabel}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
        <div className="g-3 gap-24">
          {posts.map((post, i) => (
            <Link key={post._id} href={`/blog/${post.slug}`}
              className="card card-hover flex flex-col no-underline"
              style={{ animationDelay:`${i*0.08}s` }}>
              <div className="flex flex-col flex-1 p-32">
                <span className="font-mono font-bold text-primary bg-soft uppercase tracking-widest px-[12px] py-[4px] rounded-full border border-subtle-primary mb-16 w-fit text-[9px]">{post.category}</span>
                <h3 className="font-display font-bold text-white leading-tight mb-12 flex-1 text-lg">{post.title}</h3>
                <p className="text-gray-3 leading-loose mb-20 text-sm overflow-hidden line-clamp-2">{post.excerpt}</p>
                <p className="font-mono font-semibold text-gray-3 uppercase tracking-wider text-[10px]">
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
