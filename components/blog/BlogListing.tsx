import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from '@/components/ui/Icons'
import SetFooterCta from '@/components/layout/SetFooterCta'
import type { BlogPageData } from '@/lib/blog'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Page 1 is /blog, not /blog/page/1 — one canonical URL per page of results. */
function hrefFor(page: number) {
  return page <= 1 ? '/blog' : `/blog/page/${page}`
}

/**
 * Which page numbers to show. Always first and last, plus a window around the
 * current page, with gaps marked. Rendering 40 numbered links on a long blog
 * would be its own crawl problem.
 */
function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out = new Set<number>([1, total, current])
  if (current - 1 > 1) out.add(current - 1)
  if (current + 1 < total) out.add(current + 1)
  const sorted = [...out].sort((a, b) => a - b)
  const withGaps: (number | '…')[] = []
  sorted.forEach((n, i) => {
    if (i > 0 && n - (sorted[i - 1] as number) > 1) withGaps.push('…')
    withGaps.push(n)
  })
  return withGaps
}

export default function BlogListing({ data }: { data: BlogPageData }) {
  const { posts, page, totalPages } = data

  // The oversized featured card only makes sense on page 1. On later pages
  // every post gets an equal card.
  const showFeatured = page === 1 && posts.length > 0
  const featured = showFeatured ? posts[0] : null
  const rest = showFeatured ? posts.slice(1) : posts

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
          <h1 className="blog-head-title">
            Insights &amp; Expertise{page > 1 ? <span className="blog-head-page"> — Page {page}</span> : null}
          </h1>
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
            <p className="eyebrow mb-[28px]">{page > 1 ? `Articles — Page ${page}` : 'All Articles'}</p>
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

            {/* Pagination — real <a href> links, so crawlers can follow them.
                This is why it's numbered links rather than a "load more"
                button: content behind a click is content Google may never see. */}
            {totalPages > 1 && (
              <nav className="blog-pager" aria-label="Blog pages">
                {page > 1 ? (
                  <Link href={hrefFor(page - 1)} className="blog-pager-arrow" rel="prev">← Previous</Link>
                ) : <span className="blog-pager-arrow is-disabled" aria-hidden="true">← Previous</span>}

                <div className="blog-pager-nums">
                  {pageWindow(page, totalPages).map((n, i) =>
                    n === '…'
                      ? <span key={`gap-${i}`} className="blog-pager-gap" aria-hidden="true">…</span>
                      : n === page
                        ? <span key={n} className="blog-pager-num is-current" aria-current="page">{n}</span>
                        : <Link key={n} href={hrefFor(n)} className="blog-pager-num">{n}</Link>
                  )}
                </div>

                {page < totalPages ? (
                  <Link href={hrefFor(page + 1)} className="blog-pager-arrow" rel="next">Next →</Link>
                ) : <span className="blog-pager-arrow is-disabled" aria-hidden="true">Next →</span>}
              </nav>
            )}
          </div>
        </section>
      )}
    </>
  )
}
