import { getCollection } from '@/lib/db/mongodb'
import type { BlogDoc } from '@/types'

/** Posts per listing page. */
export const POSTS_PER_PAGE = 12

export type BlogPageData = {
  posts: BlogDoc[]
  total: number
  totalPages: number
  page: number
}

/**
 * One published page of posts, newest first.
 *
 * Counting and slicing happen in MongoDB rather than in the page, so a growing
 * blog never means a growing query result. The old listing pulled every
 * published post and rendered them all on one URL.
 *
 * Fail-safe: a database error returns an empty page rather than throwing. The
 * listing renders its empty state instead of the route 500ing.
 */
export async function getBlogPage(page: number): Promise<BlogPageData> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1

  try {
    const col = await getCollection<BlogDoc>('blogs')
    const filter = { published: true }

    const total = await col.countDocuments(filter as never)
    const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE))

    const posts = await col
      .find(filter as never)
      .sort({ date: -1 })
      .skip((safePage - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .toArray()

    return { posts, total, totalPages, page: safePage }
  } catch (e) {
    console.error('[blog] listing query failed:', e)
    return { posts: [], total: 0, totalPages: 1, page: safePage }
  }
}
