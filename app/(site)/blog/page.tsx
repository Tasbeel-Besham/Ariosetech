import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCollection } from '@/lib/db/mongodb'
import type { BlogDoc } from '@/types'

export const metadata: Metadata = { title: 'Blog', description: 'Expert articles on WordPress, Shopify, WooCommerce and e-commerce.' }
export const dynamic = 'force-dynamic'

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const

export default async function BlogPage() {
  let posts: BlogDoc[] = []
  try {
    const col = await getCollection<BlogDoc>('blogs')
    posts = await col.find({ published: true }).sort({ date: -1 }).toArray()
  } catch {
    // DB not configured — render empty state
  }

  const [featured, ...rest] = posts

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '80px 0' }}>
        <div className="container">
          <p className="eyebrow">Blog</p>
          <h1 style={{ ...hs, fontSize: 'clamp(2.4rem,5vw,4.5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '16px' }}>
            Insights & expertise<br />
            <span style={{ color: 'var(--text-3)' }}>from the field.</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: '500px' }}>
            Expert articles on WordPress, Shopify, WooCommerce, and e-commerce best practices from our team.
          </p>
        </div>
      </section>

      {featured && (
        <section style={{ borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
          <div className="container">
            <Link href={`/blog/${featured.slug}`} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center',
              background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '24px',
              overflow: 'hidden', textDecoration: 'none', padding: '48px',
              transition: 'border-color 0.2s',
            }} className="hover:border-[var(--border-2)]">
              <div>
                <span style={{ ...hm, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '100px', display: 'inline-block', marginBottom: '20px' }}>
                  {featured.category}
                </span>
                <h2 style={{ ...hs, fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '16px' }}>{featured.title}</h2>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '24px' }}>{featured.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--blue)', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                  Read article <ArrowRight size={14} />
                </div>
              </div>
              <div style={{ background: 'var(--bg-3)', borderRadius: '16px', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '64px' }}>📝</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section style={{ borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {rest.map(post => (
              <Link key={String(post._id)} href={`/blog/${post.slug}`}
                style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.25s ease' }}
                className="hover:border-[var(--border-2)] hover:-translate-y-1">
                <div style={{ height: '4px', background: 'var(--grad-primary)' }} />
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ ...hm, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)', color: 'var(--blue)', padding: '3px 10px', borderRadius: '100px', display: 'inline-block', marginBottom: '14px' }}>
                    {post.category}
                  </span>
                  <h3 style={{ ...hs, fontSize: '15px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: '10px', flex: 1 }}>{post.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.65, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                  <div style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {post.readTime} min read
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
