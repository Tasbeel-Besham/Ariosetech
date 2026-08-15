import type { Metadata } from 'next'
import BlogListing from '@/components/blog/BlogListing'
import { getBlogPage } from '@/lib/blog'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

export const metadata: Metadata = {
  // No brand name here. The root layout's title template already appends
  // " | ARIOSETECH", so spelling it out produced the live title
  // "Blog | WordPress, Shopify & WooCommerce Insights — ARIOSETECH | ARIOSETECH"
  // — the brand twice, and 14 wasted characters in a 60-character budget.
  title: 'Blog — WordPress, Shopify & WooCommerce Insights',
  description: 'Expert articles on WordPress, Shopify, WooCommerce and e-commerce growth from the ARIOSETECH engineering team.',
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    type: 'website',
    title: 'ARIOSETECH Blog — Web Development & E-commerce Insights',
    description: 'Expert articles on WordPress, Shopify, WooCommerce and e-commerce growth.',
    url: `${SITE}/blog`,
  },
}

// Rendered per request, matching the rest of the site.
export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const data = await getBlogPage(1)
  return <BlogListing data={data} />
}
