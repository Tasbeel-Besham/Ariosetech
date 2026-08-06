import { getCollection } from '@/lib/db/mongodb'
import type { SectionInstance } from '@/types'

/**
 * Server-side data hydration for sections that would otherwise fetch on the client.
 *
 * WHY THIS EXISTS
 * ---------------
 * BuilderRenderer is a client component, so every registered section is a
 * client component too. PortfolioSection and BlogSection therefore fetched
 * their own data from /api/* inside a useEffect, which meant the server HTML
 * for /portfolio contained the literal string "No projects to show yet." and
 * nothing else. Your case studies — the strongest commercial proof on the
 * site — were absent from the initial crawl entirely.
 *
 * Google does render JavaScript, but rendering is a deferred second pass: it
 * is slower, not guaranteed for every page, and other crawlers (and the
 * pipelines feeding AI answers) frequently do not run it at all.
 *
 * Rather than restructure the whole builder into server components, this fills
 * the data in on the server *before* BuilderRenderer runs. The sections receive
 * it as ordinary props and skip their client fetch, so the content lands in the
 * initial HTML with no change to how the builder works.
 *
 * Every read is fail-safe: on error the section falls back to its old
 * client-side fetch rather than breaking the page or the build.
 */

type Props = Record<string, unknown>

/** Map a portfolio document to the shape PortfolioSection expects. */
function toPortfolioItem(doc: Record<string, any>) {
  const results = Array.isArray(doc.results) ? doc.results : []
  // Every field forced to a primitive — see toBlogPost for why.
  return {
    title: String(doc.title || ''),
    client: String(doc.client || ''),
    platform: String(doc.category || 'other'),
    cat: String(doc.category || 'other'),
    result: String(results[0]?.value || ''),
    resultLabel: String(results[0]?.label || ''),
    quote: String(doc.quote || doc.summary || ''),
    image: String(doc.image || ''),
    screenshot: String(doc.screenshot || ''),
    url: String(doc.clientUrl || ''),
    slug: String(doc.slug || ''),
  }
}

async function fetchPortfolioItems() {
  try {
    const col = await getCollection('portfolio')
    const docs = await col
      .find({ published: true } as never)
      .sort({ featured: -1, updatedAt: -1 })
      .limit(60)
      .toArray()
    return (docs as Record<string, any>[]).map(toPortfolioItem)
  } catch (e) {
    console.error('[server-data] portfolio read failed:', e)
    return []
  }
}

/**
 * Map a blog document to the plain shape BlogSection expects.
 *
 * This must not return the raw document. BuilderRenderer is a Client
 * Component, and a Mongo doc carries an ObjectId `_id` and Date fields —
 * class instances, which React cannot serialize across the server/client
 * boundary. Passing one through throws "Only plain objects can be passed to
 * Client Components", which takes down the whole page, not just the section.
 */
function toBlogPost(doc: Record<string, any>) {
  return {
    _id: String(doc._id ?? ''),
    slug: String(doc.slug ?? ''),
    title: String(doc.title ?? ''),
    excerpt: String(doc.excerpt ?? ''),
    category: String(doc.category ?? ''),
    date: doc.date instanceof Date ? doc.date.toISOString() : String(doc.date ?? ''),
    readTime: Number(doc.readTime ?? 0),
  }
}

async function fetchBlogPosts(limit: number) {
  try {
    const col = await getCollection('blogs')
    const docs = await col
      .find({ published: true } as never)
      .sort({ date: -1 })
      .limit(Math.max(1, Math.min(limit || 3, 24)))
      .toArray()
    return (docs as Record<string, any>[]).map(toBlogPost)
  } catch (e) {
    console.error('[server-data] blog read failed:', e)
    return []
  }
}

/**
 * Return a copy of `sections` with data-driven sections pre-filled.
 * Sections that already carry explicit items from the page builder are left
 * alone — a hand-picked list always wins over the full collection.
 */
export async function withServerData(sections: SectionInstance[]): Promise<SectionInstance[]> {
  if (!Array.isArray(sections) || sections.length === 0) return sections

  const needsPortfolio = sections.some(
    s => s.type === 'portfolio' && !(Array.isArray((s.props as Props)?.items) && ((s.props as Props).items as unknown[]).length)
  )
  const blogSections = sections.filter(s => s.type === 'blog')

  const [portfolioItems, blogPosts] = await Promise.all([
    needsPortfolio ? fetchPortfolioItems() : Promise.resolve([]),
    blogSections.length
      ? fetchBlogPosts(Number((blogSections[0].props as Props)?.limit) || 3)
      : Promise.resolve([]),
  ])

  return sections.map(section => {
    const props = (section.props || {}) as Props

    if (section.type === 'portfolio') {
      const explicit = Array.isArray(props.items) ? (props.items as unknown[]) : []
      if (explicit.length === 0 && portfolioItems.length > 0) {
        return { ...section, props: { ...props, items: portfolioItems } }
      }
    }

    if (section.type === 'blog' && blogPosts.length > 0) {
      return { ...section, props: { ...props, posts: blogPosts } }
    }

    return section
  })
}

/** Standalone portfolio items, for routes that render PortfolioSection directly. */
export async function getPortfolioItems() {
  return fetchPortfolioItems()
}
