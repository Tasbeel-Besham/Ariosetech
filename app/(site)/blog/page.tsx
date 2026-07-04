import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'
import { getCollection } from '@/lib/db/mongodb'
import type { BlogDoc } from '@/types'
import InteractiveHeroSection from '@/components/sections/InteractiveHeroSection'

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
      <InteractiveHeroSection 
        eyebrow="Knowledge Base"
        headline="Insights & Expertise\nFrom the Field."
        subheadline="Expert articles on WordPress, Shopify, WooCommerce, and e-commerce best practices from our engineering team."
        ctaPrimaryLabel="Get Free Strategy Call"
        ctaPrimaryHref="/contact"
      />

      {/* Featured */}
      {featured && (
        <section className="section section--dark">
          <div className="container">
            <p className="eyebrow sr mb-24">Featured Article</p>
            <Link href={`/blog/${featured.slug}`} className="card card-hover sr featured-blog-card bl-featured">
              <div className="bl-topline" />
              <div>
                <span className="bl-cat">
                  {featured.category}
                </span>
                <h2 className="bl-featured-title">{featured.title}</h2>
                <p className="bl-featured-excerpt">{featured.excerpt}</p>
                <div className="bl-readmore">
                  Read article <ArrowRight size={14} />
                </div>
              </div>
              <div className="bl-featured-art">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="op-60">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <p className="bl-art-cat">{featured.category}</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All Posts */}
      {rest.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="eyebrow sr mb-[36px]">All Articles</p>
            <div className="g-3">
              {rest.map((post, i) => (
                <Link key={String(post._id)} href={`/blog/${post.slug}`}
                  className="card card-hover sr bl-card" style={{ animationDelay:`${i*0.06}s` }}>
                  <div className="bl-topline" />
                  <div className="bl-card-body">
                    <span className="bl-card-cat">
                      {post.category}
                    </span>
                    <h3 className="bl-card-title">{post.title}</h3>
                    <p className="bl-card-excerpt">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <p className="bl-card-meta">
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

      <style>{`
        .featured-blog-card { padding: 48px; }
        @media (max-width: 768px) {
          .featured-blog-card { padding: 32px 24px !important; gap: 32px !important; }
        }
      `}</style>

      {posts.length === 0 && (
        <section className="section">
          <div className="container text-center py-[60px]">
            <p className="bl-empty">No posts yet. Check back soon.</p>
          </div>
        </section>
      )}
    </>
  )
}
