import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, Calendar, ArrowRight } from '@/components/ui/Icons'
import { getCollection } from '@/lib/db/mongodb'
import type { BlogDoc } from '@/types'
import ReadingProgress from '@/components/ui/ReadingProgress'
import BlogContent from '@/components/blog/BlogContent'

type Props = { params: Promise<{ slug: string }> }

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const col = await getCollection<BlogDoc>('blogs')
  const post = await col.findOne({ slug, published: true })
  if (!post) return {}

  const seo = post.seo || {}
  const img = seo.ogImage || post.featuredImage || post.coverImage
  const desc = seo.description || post.excerpt
  return {
    title: (seo.title || post.title).replace(/\s*[|\u2014-]\s*ARIOSETECH\s*$/i, ''),
    description: desc,
    keywords: seo.keywords?.length ? seo.keywords.join(', ') : post.tags?.join(', '),
    openGraph: {
      type: 'article',
      title: seo.ogTitle || seo.title || post.title,
      description: seo.ogDescription || desc,
      url: `${SITE}/blog/${slug}`,
      publishedTime: post.publishedAt || post.date,
      authors: post.author ? [post.author] : undefined,
      images: img ? [img] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title || post.title,
      description: desc,
      images: img ? [img] : [],
    },
    alternates: { canonical: seo.canonicalUrl || `${SITE}/blog/${slug}` },
  }
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const col = await getCollection<BlogDoc>('blogs')
  const post = await col.findOne({ slug, published: true })
  if (!post) notFound()

  const cover = post.featuredImage || post.coverImage
  const readMins = post.readTime || post.readingTime || 5

  // Related posts: same category first, then most recent, excluding this one.
  let related: BlogDoc[] = []
  try {
    const all = await col.find({ published: true, slug: { $ne: slug } }).sort({ date: -1 }).limit(12).toArray()
    const sameCat = all.filter(p => p.category === post.category)
    related = [...sameCat, ...all.filter(p => p.category !== post.category)].slice(0, 3)
  } catch { /* ignore */ }

  // Resolve the byline to an author profile (if one exists) so the schema can
  // use a Person with a real URL — this is what Google's "Missing field url"
  // warning on the author object is asking for, and it is a stronger EEAT
  // signal than attributing every article to the Organization.
  let authorLd: Record<string, unknown> = {
    '@type': 'Organization', name: post.author || 'ARIOSETECH', url: SITE,
  }
  let authorSlug: string | null = null
  if (post.author) {
    try {
      const aCol = await getCollection('authors')
      const a = await aCol.findOne({ name: post.author, published: { $ne: false } } as never) as Record<string, any> | null
      if (a?.slug) {
        authorSlug = a.slug
        authorLd = {
          '@type': 'Person',
          name: a.name,
          url: `${SITE}/author/${a.slug}`,
          ...(a.role ? { jobTitle: a.role } : {}),
          ...(a.avatar ? { image: a.avatar } : {}),
          ...(a.bio ? { description: a.bio } : {}),
          ...(([a.linkedin, a.twitter, a.website].filter(Boolean).length)
            ? { sameAs: [a.linkedin, a.twitter, a.website].filter(Boolean) } : {}),
          worksFor: { '@type': 'Organization', name: 'ARIOSETECH', url: SITE },
        }
      }
    } catch { /* no authors collection yet — fall back to Organization */ }
  }

  // Article structured data for SEO / rich results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: cover ? [cover] : undefined,
    datePublished: post.publishedAt || post.date,
    author: authorLd,
    publisher: { '@type': 'Organization', name: 'ARIOSETECH', url: SITE },
    dateModified: post.updatedAt || post.publishedAt || post.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${slug}` },
    keywords: post.tags?.join(', '),
    // Extra context Google uses for article understanding and eligibility.
    articleSection: post.category || undefined,
    inLanguage: 'en',
    wordCount: Array.isArray(post.content)
      ? post.content.reduce((n: number, b: Record<string, unknown>) => {
          const t = typeof b.text === 'string' ? b.text : ''
          const items = Array.isArray(b.items) ? (b.items as string[]).join(' ') : ''
          return n + `${t} ${items}`.trim().split(/\s+/).filter(Boolean).length
        }, 0)
      : undefined,
  }

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <article>
        <header className="bp-hero">
          <div className="bp-hero-glow" aria-hidden="true" />
          <div className="container bp-narrow relative z-1">
            <Link href="/blog" className="bp-back">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
            <span className="blog-cat mb-16 inline-block">{post.category}</span>
            <h1 className="bp-title">{post.title}</h1>
            <p className="bp-excerpt">{post.excerpt}</p>
            <div className="bp-meta-row">
              <span className="bp-meta"><Calendar size={13} /> {fmtDate(post.date)}</span>
              <span className="bp-dot" />
              <span className="bp-meta"><Clock size={13} /> {readMins} min read</span>
              {post.author && <><span className="bp-dot" /><span className="bp-meta">{post.author}</span></>}
            </div>
          </div>
        </header>

        {/* Cover */}
        {cover && (
          <div className="container bp-wide">
            <div className="bp-cover">
              <Image src={cover} alt={post.title} fill className="object-cover" sizes="(max-width: 900px) 100vw, 860px" priority />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="bp-content-section">
          <div className="container bp-narrow">
            <BlogContent blocks={post.content} />

            {post.tags.length > 0 && (
              <div className="bp-tags">
                {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            )}

            {/* Author card */}
            <div className="bp-author">
              <div className="bp-author-avatar">{(post.author || 'A').charAt(0)}</div>
              <div>
                <p className="bp-author-name">{post.author || 'ARIOSETECH Team'}</p>
                <p className="bp-author-role">WordPress, Shopify &amp; WooCommerce specialists since 2017</p>
              </div>
              <Link href="/contact" className="btn btn-primary btn-sm bp-author-cta">Work with us</Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="section section--dark">
          <div className="container">
            <p className="eyebrow mb-[28px]">Keep Reading</p>
            <div className="blog-grid">
              {related.map(p => (
                <Link key={String(p._id)} href={`/blog/${p.slug}`} className="blog-card group">
                  <div className="blog-card-media">
                    {(p.featuredImage || p.coverImage) ? (
                      <Image src={(p.featuredImage || p.coverImage)!} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" sizes="(max-width: 700px) 100vw, 360px" />
                    ) : (
                      <div className="blog-card-fallback"><span>{p.category}</span></div>
                    )}
                    <span className="blog-card-cat">{p.category}</span>
                  </div>
                  <div className="blog-card-body">
                    <h3 className="blog-card-title">{p.title}</h3>
                    <p className="blog-card-excerpt">{p.excerpt}</p>
                    <div className="blog-card-foot">
                      <span className="blog-meta">{fmtDate(p.date)} · {p.readTime || p.readingTime || 5} min</span>
                      <ArrowRight size={14} className="text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bp-cta">
        <div className="container bp-narrow text-center">
          <h2 className="bp-cta-title">Need help with your project?</h2>
          <p className="bp-cta-desc">Get a free quote within 24 hours. No commitment required.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">Get Free Quote <ArrowRight size={15} /></Link>
        </div>
      </section>
    </>
  )
}
