export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'

export async function GET() {
  const [pagesCol, blogsCol] = await Promise.all([
    getCollection('pages'),
    getCollection('blogs'),
  ])
  const [pages, blogs] = await Promise.all([
    pagesCol.find({ status: 'published' }).toArray(),
    blogsCol.find({ published: true }).toArray(),
  ])

  const urls = [
    ...pages.map(p => ({
      url: (p as unknown as { fullPath: string }).fullPath,
      lastModified: (p as unknown as { updatedAt: Date }).updatedAt,
      type: 'page',
    })),
    ...blogs.map(b => ({
      url: `/blog/${(b as unknown as { slug: string }).slug}`,
      lastModified: (b as unknown as { updatedAt: string }).updatedAt,
      type: 'blog',
    })),
  ]

  return NextResponse.json(urls)
}
