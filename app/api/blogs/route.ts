export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { slugify } from '@/lib/utils'
import { revalidateSite } from '@/lib/cache'
import { sanitizeBlocks } from '@/lib/blog/editor-convert'
import { liveFilter, normalizeStatus } from '@/lib/blog/status'

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get('admin')
  const col = await getCollection('blogs')
  const filter = admin ? {} : liveFilter()
  const blogs = await col.find(filter).sort({ date: -1 }).toArray()
  return NextResponse.json(blogs)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (typeof body.slug === 'string' && body.slug) body.slug = slugify(body.slug)
  const col = await getCollection('blogs')
  const existing = await col.findOne({ slug: body.slug })
  if (existing) return NextResponse.json({ error: 'Slug exists' }, { status: 409 })
  const doc = {
    ...body,
    // Block text may carry inline markup (bold, links) from the editor, so it
    // is filtered through the allowlist before it is ever stored. The renderer
    // sanitises again, but nothing unsafe should reach the database at all.
    ...(Array.isArray(body.content) ? { content: sanitizeBlocks(body.content) } : {}),
    // status / published / scheduledFor / publishedAt are all derived together
    // so the record cannot contradict itself — published with a future date, or
    // scheduled with no date. See lib/blog/status.ts.
    ...normalizeStatus(body),
    seo: body.seo || { title: '', description: '', ogImage: '' },
    updatedAt: new Date().toISOString(),
  }
  const result = await col.insertOne(doc as never)
  revalidateSite()
  return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 })
}
