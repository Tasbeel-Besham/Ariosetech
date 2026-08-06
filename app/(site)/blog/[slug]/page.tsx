import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, Calendar, ArrowRight } from '@/components/ui/Icons'
import { getCollection } from '@/lib/db/mongodb'
import type { BlogDoc } from '@/types'
import ReadingProgress from '@/components/ui/ReadingProgress'
import BlogContent from '@/components/blog/BlogContent'
import TableOfContents from '@/components/blog/TableOfContents'

type Props = { params: Promise<{ slug: string }> }

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

// Cached and regenerated on demand. Previously force-dynamic, which meant
// every visitor and every crawl paid a full MongoDB round trip. Admin saves
// call revalidateSite() so published changes still appear immediately.
export const revalidate = 3600

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
    related = [...sameCat, ...all.filter(p => p.category !== post.category)].slice(0, 9)
  } catch { /* ignore */ }

  // Resolve the byline to an author profile (if one exists) so the schema can
  // use a Person with a real URL — this is what Google's "Missing field url"
  // warning on the author object is asking for, and it is a stronger EEAT
  // signal than attributing every article to the Organization.
  let authorLd: Record<string, unknown> = {
    '@type': 'Organization', name: post.author || 'ARIOSETECH', url: SITE,
  }
  let authorSlug: string | null = null
  let authorRec: Record<string, any> | null = null
  let reviewerRec: Record<string, any> | null = null
  let reviewedByLd: Record<string, unknown> | null = null
  try {
    const aCol = await getCollection('authors')
    // Author (writer)
    if (post.author) {
      authorRec = await aCol.findOne({ name: post.author, published: { $ne: false } } as never) as Record<string, any> | null
      if (authorRec?.slug) {
        authorSlug = authorRec.slug
        authorLd = {
          '@type': 'Person',
          name: authorRec.name,
          url: `${SITE}/author/${authorRec.slug}`,
          ...(authorRec.role ? { jobTitle: authorRec.role } : {}),
          ...(authorRec.avatar ? { image: authorRec.avatar } : {}),
          ...(authorRec.bio ? { description: authorRec.bio } : {}),
          ...(([authorRec.linkedin, authorRec.twitter, authorRec.website].filter(Boolean).length)
            ? { sameAs: [authorRec.linkedin, authorRec.twitter, authorRec.website].filter(Boolean) } : {}),
          worksFor: { '@type': 'Organization', name: 'ARIOSETECH', url: SITE },
        }
      }
    }
    // Reviewer (medical/technical reviewer) — an optional second author record.
    const reviewerName = (post as Record<string, any>).reviewedBy
    if (reviewerName) {
      reviewerRec = await aCol.findOne({ name: reviewerName, published: { $ne: false } } as never) as Record<string, any> | null
      if (reviewerRec) {
        reviewedByLd = {
          '@type': 'Person',
          name: reviewerRec.name,
          ...(reviewerRec.slug ? { url: `${SITE}/author/${reviewerRec.slug}` } : {}),
          ...(reviewerRec.role ? { jobTitle: reviewerRec.role } : {}),
          ...(reviewerRec.avatar ? { image: reviewerRec.avatar } : {}),
        }
      }
    }
  } catch { /* no authors collection yet — fall back to Organization */ }

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
    ...(reviewedByLd ? { reviewedBy: reviewedByLd } : {}),
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
            <h1 className="bp-title">{post.title}</h1>
            <p className="bp-excerpt">{post.excerpt}</p>
            <div className="bp-meta-row">
              <span className="bp-meta"><Calendar size={13} /> {fmtDate(post.date)}</span>
              <span className="bp-dot" />
              <span className="bp-meta"><Clock size={13} /> {readMins} min read</span>
              {post.author && <><span className="bp-dot" /><span className="bp-meta">By {post.author}</span></>}
            </div>

            {/* Reviewed By / Written By card — shows the expert behind the post.
                Renders a reviewer if set, otherwise the author, when a matching
                author record with a photo/role exists. Strong EEAT signal. */}
            {(reviewerRec || authorRec) && (() => {
              const person = reviewerRec || authorRec!
              const label = reviewerRec ? 'Reviewed By' : 'Written By'
              return (
                <div className="bp-reviewer">
                  {person.avatar ? (
                    <Image src={person.avatar} alt={person.name} width={62} height={62} className="bp-reviewer-photo" />
                  ) : (
                    <div className="bp-reviewer-photo bp-reviewer-initial">{person.name.charAt(0)}</div>
                  )}
                  <div className="bp-reviewer-body">
                    <p className="bp-reviewer-label">{label}</p>
                    <p className="bp-reviewer-name">{person.name}</p>
                    {person.role && <p className="bp-reviewer-role">{person.role}</p>}
                    {person.bio && <p className="bp-reviewer-bio">{person.bio}</p>}
                    {person.slug && (
                      <Link href={`/author/${person.slug}`} className="bp-reviewer-link">View Bio →</Link>
                    )}
                  </div>
                </div>
              )
            })()}
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

        {/* Body — two-column on desktop: sticky TOC sidebar (left) + article */}
        <div className="bp-content-section">
          <div className="container bp-layout">
            <aside className="bp-toc-col">
              <TableOfContents blocks={post.content} />
              {/* Compact reviewer/author card — stays visible in the sticky
                  sidebar as the reader scrolls, so the expert behind the piece
                  is always in view (reinforces EEAT throughout the article). */}
              {(reviewerRec || authorRec) && (() => {
                const person = reviewerRec || authorRec!
                const label = reviewerRec ? 'Reviewed By' : 'Written By'
                return (
                  <div className="bp-side-expert">
                    <div className="bp-side-expert-head">
                      {person.avatar ? (
                        <Image src={person.avatar} alt={person.name} width={46} height={46} className="bp-side-expert-photo" />
                      ) : (
                        <div className="bp-side-expert-photo bp-reviewer-initial">{person.name.charAt(0)}</div>
                      )}
                      <div className="min-w-0">
                        <p className="bp-reviewer-label">{label}</p>
                        <p className="bp-side-expert-name">{person.name}</p>
                      </div>
                    </div>
                    {person.role && <p className="bp-side-expert-role">{person.role}</p>}
                    {person.slug && (
                      <Link href={`/author/${person.slug}`} className="bp-reviewer-link">View Bio →</Link>
                    )}
                  </div>
                )
              })()}
            </aside>
            <div className="bp-article-col">
              <BlogContent blocks={post.content} />

            {post.tags.length > 0 && (
              <div className="bp-tags">
                {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            )}

            {/* Why trust our experts — EEAT trust block. Always renders; uses
                the matched author/reviewer record when available, otherwise a
                team fallback so the section is never missing. */}
            <div className="bp-trust">
              <div className="bp-trust-text">
                <h2 className="bp-trust-title">Why trust our experts?</h2>
                <p className="bp-trust-desc">
                  At ARIOSETECH, every article is written by specialists who build and operate
                  real e-commerce stores &mdash; not generalists. Our content is grounded in
                  hands-on experience across WordPress, WooCommerce and Shopify, and reflects
                  what actually works for stores in live markets. We keep it practical, current,
                  and honest so you always get reliable, actionable guidance.
                </p>
              </div>
              {(() => {
                const person = reviewerRec || authorRec
                const label = reviewerRec ? 'Reviewed By' : 'Written By'
                const name = person?.name || post.author || 'ARIOSETECH Team'
                const role = person?.role || 'WordPress, Shopify & WooCommerce specialists since 2017'
                const bio = person?.bio
                const avatar = person?.avatar
                const slug = person?.slug
                return (
                  <div className="bp-trust-card">
                    <div className="bp-trust-card-head">
                      {avatar ? (
                        <Image src={avatar} alt={name} width={58} height={58} className="bp-trust-photo" />
                      ) : (
                        <div className="bp-trust-photo bp-reviewer-initial">{name.charAt(0)}</div>
                      )}
                      <div>
                        <p className="bp-reviewer-label">{label}</p>
                        <p className="bp-trust-name">{name}</p>
                      </div>
                    </div>
                    {role && <p className="bp-trust-role">{role}</p>}
                    {bio && <p className="bp-trust-bio">{bio}</p>}
                    <div className="bp-trust-actions">
                      {slug && <Link href={`/author/${slug}`} className="bp-reviewer-link">View Bio →</Link>}
                      <Link href="/contact" className="btn btn-primary btn-sm">Work with us</Link>
                    </div>
                  </div>
                )
              })()}
            </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related — horizontal scroll so more than 3 posts are reachable */}
      {related.length > 0 && (
        <section className="section section--dark">
          <div className="container">
            <div className="flex items-center justify-between mb-[28px]">
              <p className="eyebrow">Keep Reading</p>
              {related.length > 3 && (
                <span className="font-mono text-10 uppercase tracking-wider text-text-3">Scroll for more →</span>
              )}
            </div>
            <div className="blog-scroll">
              {related.map(p => (
                <Link key={String(p._id)} href={`/blog/${p.slug}`} className="blog-card group blog-scroll-card">
                  <div className="blog-card-media">
                    {(p.featuredImage || p.coverImage) ? (
                      <Image src={(p.featuredImage || p.coverImage)!} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" sizes="360px" />
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
    </>
  )
}
