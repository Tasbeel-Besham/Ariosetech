import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import BlogListing from '@/components/blog/BlogListing'
import { getBlogPage } from '@/lib/blog'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ page: string }> }

/** Whole positive integers only — "abc", "2.5" and "-1" are not pages. */
function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null
  const n = Number(raw)
  return n > 0 ? n : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: raw } = await params
  const page = parsePage(raw)
  if (!page) return { robots: 'noindex,nofollow' }

  const { totalPages } = await getBlogPage(page)
  if (page > totalPages) return { robots: 'noindex,nofollow' }

  return {
    // Distinct title per page. Identical titles across paginated URLs is one of
    // the most common ways a blog generates its own duplicate-content problem.
    title: `Blog — Page ${page} | WordPress, Shopify & WooCommerce Insights — ARIOSETECH`,
    description: `Page ${page} of articles on WordPress, Shopify, WooCommerce and e-commerce growth from the ARIOSETECH engineering team.`,
    // Self-referencing. Paginated pages should NOT canonicalise to /blog —
    // that tells Google the posts listed here are duplicates of page 1, and
    // anything only reachable from page 3 stops being discovered.
    alternates: { canonical: `${SITE}/blog/page/${page}` },
    openGraph: {
      type: 'website',
      title: `ARIOSETECH Blog — Page ${page}`,
      description: 'Expert articles on WordPress, Shopify, WooCommerce and e-commerce growth.',
      url: `${SITE}/blog/page/${page}`,
    },
  }
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page: raw } = await params
  const page = parsePage(raw)
  if (!page) notFound()

  // /blog/page/1 duplicates /blog. Redirect rather than serve both.
  if (page === 1) redirect('/blog')

  const data = await getBlogPage(page)

  // Past the last page there is nothing to show. A 404 is correct here — an
  // empty 200 is a soft-404, which Google reports as an error and which would
  // otherwise let a crawler wander through unlimited empty pages.
  if (data.posts.length === 0) notFound()

  return <BlogListing data={data} />
}
