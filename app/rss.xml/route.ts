// Rendered per request from the live database.
export const dynamic = 'force-dynamic'

import { getCollection } from '@/lib/db/mongodb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'
const TITLE = 'ARIOSETECH Blog'
const DESCRIPTION = 'WordPress, WooCommerce and Shopify engineering notes from the ARIOSETECH team.'
const MAX_ITEMS = 30

/**
 * RSS 2.0 feed at /rss.xml
 *
 * Worth having for three separate reasons:
 *
 * 1. Perplexity and similar answer engines weight freshness heavily, and a feed
 *    is the cheapest signal that new content exists.
 * 2. Feed readers and aggregators (Feedly, Inoreader, newsletter tools) cannot
 *    subscribe to a site without one.
 * 3. Other people's automation — roundup newsletters, Slack bots, "best posts
 *    this week" lists — consumes feeds. Those are brand mentions you don't have
 *    to ask for.
 *
 * Not a ranking factor. A distribution channel.
 */

/**
 * Escape XML entities.
 *
 * One unescaped `&` in a post title makes the document malformed, and feed
 * readers reject the whole file rather than skipping the bad item.
 */
function xml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** RFC-822 date, which is what RSS requires — not ISO. */
function rfc822(value: unknown): string {
  const d = new Date((value as string) || Date.now())
  return (isNaN(d.getTime()) ? new Date() : d).toUTCString()
}

export async function GET() {
  let posts: Record<string, any>[] = []
  try {
    const col = await getCollection('blogs')
    posts = await col
      .find({ published: true } as never)
      .sort({ date: -1 })
      .limit(MAX_ITEMS)
      .toArray() as Record<string, any>[]
  } catch (e) {
    // An empty feed is a valid feed. Never fail the request over this.
    console.error('[rss] could not read blogs:', e)
  }

  const items = posts
    .filter(p => p?.slug)
    .map(p => {
      // encodeURI on the slug: a stray space or non-ASCII character makes the
      // <link> invalid, and strict feed readers reject the whole document.
      const url = `${SITE_URL}/blog/${encodeURIComponent(String(p.slug))}`
      return `    <item>
      <title>${xml(p.title || 'Untitled')}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <pubDate>${rfc822(p.date || p.createdAt)}</pubDate>
      <description>${xml(p.excerpt || '')}</description>${p.category ? `
      <category>${xml(p.category)}</category>` : ''}${p.author ? `
      <dc:creator>${xml(p.author)}</dc:creator>` : ''}
    </item>`
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${xml(DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(posts[0]?.date)}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
