import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from '@/components/ui/Icons'
import SetFooterCta from '@/components/layout/SetFooterCta'
import { getCollection } from '@/lib/db/mongodb'
import type { BlogDoc } from '@/types'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

export const metadata: Metadata = {
  title: 'Blog | WordPress, Shopify & WooCommerce Insights — ARIOSETECH',
  description: 'Expert articles on WordPress, Shopify, WooCommerce and e-commerce growth from the ARIOSETECH engineering team.',
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    type: 'website',
    title: 'ARIOSETECH Blog — Web Development & E-commerce Insights',
    description: 'Expert articles on WordPress, Shopify, WooCommerce and e-commerce growth.',
    url: `${SITE}/blog`,
  },
}
export const dynamic = 'force-dynamic'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function BlogPage() {
  let posts: BlogDoc[] = []
  try {
    const col = await getCollection<BlogDoc>('blogs')
    posts = await col.find({ published: true }).sort({ date: -1 }).toArray()
  } catch { /* DB not configured */ }

  const [featured, ...rest] = posts

  return (
    <>
      <SetFooterCta
        headline="Got a project instead of just a question?"
        desc="Reading up is smart. When you're ready to build, fix, or grow your site, we're here."
        primaryLabel="Get a Free Quote"
        primaryHref="/contact"
      />
      {/* Header */}
      <section className="blog-head">
        <div className="blog-head-glow" aria-hidden="true" />
        <div className="container relative z-1">
          <p className="eyebrow mb-16">Knowledge Base</p>
          <h1 className="blog-head-title">Insights &amp; Expertise</h1>
          <p className="blog-head-sub">
            Practical articles on WordPress, Shopify, WooCommerce and e-commerce growth, written by the engineers who build them.
          </p>
        </div>
      </section>

      {posts.length === 0 && (
        <section className="section">
          <div className="container text-center py-[60px]">
            <p className="text-text-3 text-[15px]">No posts yet. Check back soon.</p>
          </div>
        </section>
      )}

      {/* Featured */}
      {featured && (
        <section className="section section--no-border pt-[56px] pb-[32px]">
          <div className="container">
            <Link href={`/blog/${featured.slug}`} className="blog-feature group">
              <div className="blog-feature-media">
                {(featured.featuredImage || featured.coverImage) ? (
                  <Image
                    src={(featured.featuredImage || featured.coverImage)!}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 900px) 100vw, 560px"
                    priority
                  />
                ) : (
                  <div className="blog-feature-fallback"><span>{featured.category}</span></div>
                )}
              </div>
              <div className="blog-feature-body">
                <div className="blog-badges">
                  <span className="blog-cat">{featured.category}</span>
                  <span className="blog-featured-flag">Featured</span>
                </div>
                <h2 className="blog-feature-title">{featured.title}</h2>
                <p className="blog-feature-excerpt">{featured.excerpt}</p>
                <div className="blog-feature-foot">
                  <span className="blog-meta">{fmtDate(featured.date)} · {featured.readTime || featured.readingTime || 5} min read</span>
                  <span className="blog-readmore">Read article <ArrowRight size={14} /></span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <section className="section pt-[24px]">
          <div className="container">
            <p className="eyebrow mb-[28px]">All Articles</p>
            <div className="blog-grid">
              {rest.map((post) => (
                <Link key={String(post._id)} href={`/blog/${post.slug}`} className="blog-card group">
                  <div className="blog-card-media">
                    {(post.featuredImage || post.coverImage) ? (
                      <Image
                        src={(post.featuredImage || post.coverImage)!}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 700px) 100vw, 360px"
                      />
                    ) : (
                      <div className="blog-card-fallback"><span>{post.category}</span></div>
                    )}
                    <span className="blog-card-cat">{post.category}</span>
                  </div>
                  <div className="blog-card-body">
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-foot">
                      <span className="blog-meta">{fmtDate(post.date)} · {post.readTime || post.readingTime || 5} min</span>
                      <ArrowRight size={14} className="text-primary transition-transform group-hover:translate-x-0.5" />
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
