import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, Calendar } from '@/components/ui/Icons'
import { getCollection } from '@/lib/db/mongodb'
import type { BlogDoc } from '@/types'

type Props = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const col = await getCollection<BlogDoc>('blogs')
  const post = await col.findOne({ slug, published: true })
  if (!post) return {}

  const seo = post.seo || {}
  return {
    title: seo.title || post.title,
    description: seo.description || post.excerpt,
    openGraph: {
      title: seo.title || post.title,
      description: seo.description || post.excerpt,
      images: seo.ogImage ? [seo.ogImage] : post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${slug}`,
    },
  }
}

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const col = await getCollection<BlogDoc>('blogs')
  const post = await col.findOne({ slug, published: true })
  if (!post) notFound()

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(79,110,247,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', textDecoration: 'none', fontSize: '13px', marginBottom: '32px', transition: 'color 0.2s' }} className="hover:text-[var(--text)]">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <span style={{ ...hm, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '100px', display: 'inline-block', marginBottom: '20px' }}>
            {post.category}
          </span>
          <h1 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '16px' }}>{post.title}</h1>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '24px' }}>{post.excerpt}</p>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', ...hm, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', ...hm, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <Clock size={12} /> {post.readTime} min read
            </span>
            <span style={{ ...hm, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{post.author}</span>
          </div>
        </div>
      </section>

      {/* Featured image */}
      {(post.featuredImage || post.coverImage) && (
        <section style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: '780px', paddingTop: '40px', paddingBottom: '0' }}>
            <div style={{ position: 'relative', height: '400px', borderRadius: '16px', overflow: 'hidden' }}>
              <Image src={(post.featuredImage || post.coverImage)!} alt={post.title} fill className="object-cover" sizes="780px" />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          {post.content.map((block, i) =>
            block.type === 'h2' ? (
              <h2 key={i} style={{ ...hs, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginTop: '48px', marginBottom: '16px', letterSpacing: '-0.02em' }}>{block.text}</h2>
            ) : (
              <p key={i} style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '20px' }}>{block.text}</p>
            )
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Tags</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '80px 0', background: 'var(--bg-2)' }}>
        <div className="container" style={{ maxWidth: '780px', textAlign: 'center' }}>
          <h2 style={{ ...hs, fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Need help with your project?
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', marginBottom: '24px', lineHeight: 1.7 }}>
            Get a free quote within 24 hours. No commitment required.
          </p>
          <Link href="/contact" className="btn-primary btn-lg" style={{ ...hs, fontWeight: 700 }}>
            Get Free Quote →
          </Link>
        </div>
      </section>
    </>
  )
}
