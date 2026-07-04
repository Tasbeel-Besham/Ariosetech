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
      <section className="bp-hero">
        <div className="bp-hero-glow" />
        <div className="container bp-narrow relative z-1">
          <Link href="/blog" className="bp-back hover:text-[var(--text)]">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <span className="bp-cat">
            {post.category}
          </span>
          <h1 className="bp-title">{post.title}</h1>
          <p className="bp-excerpt">{post.excerpt}</p>
          <div className="bp-meta-row">
            <span className="bp-meta flex items-center gap-6">
              <Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="bp-meta flex items-center gap-6">
              <Clock size={12} /> {post.readTime} min read
            </span>
            <span className="bp-meta">{post.author}</span>
          </div>
        </div>
      </section>

      {/* Featured image */}
      {(post.featuredImage || post.coverImage) && (
        <section className="border-b-subtle">
          <div className="container bp-narrow pt-40 pb-0">
            <div className="bp-cover">
              <Image src={(post.featuredImage || post.coverImage)!} alt={post.title} fill className="object-cover" sizes="780px" />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="bp-content-section">
        <div className="container bp-narrow">
          {post.content.map((block, i) =>
            block.type === 'h2' ? (
              <h2 key={i} className="bp-h2">{block.text}</h2>
            ) : (
              <p key={i} className="bp-p">{block.text}</p>
            )
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="bp-tags">
              <p className="bp-tags-label">Tags</p>
              <div className="flex flex-wrap gap-6">
                {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bp-cta">
        <div className="container bp-narrow text-center">
          <h2 className="bp-cta-title">
            Need help with your project?
          </h2>
          <p className="bp-cta-desc">
            Get a free quote within 24 hours. No commitment required.
          </p>
          <Link href="/contact" className="btn btn-primary btn-lg">
            Get Free Quote →
          </Link>
        </div>
      </section>
    </>
  )
}
