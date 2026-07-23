import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { slugify, slugifyPath } from '@/lib/utils'
import { ObjectId } from 'mongodb'

type P = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: P) {
  const { id } = await params
  const col = await getCollection('pages')
  const page = await col.findOne({ _id: new ObjectId(id) })
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const p = page as unknown as { layout?: unknown }
  return NextResponse.json({ page, layout: p.layout || { sections: [] } })
}

export async function PUT(req: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const col = await getCollection('pages')

  const existing = await col.findOne({ _id: new ObjectId(id) })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const existingDoc = existing as unknown as { slug: string; fullPath: string; slugHistory?: string[] }

  // Handle slug change → add to slugHistory + create redirect
  const updates: Record<string, unknown> = { ...body, updatedAt: new Date() }

  // Enforce SEO-safe URLs on every save: lowercase, spaces/underscores become
  // hyphens, accents folded. Applied server-side so a manually typed slug like
  // "About Us" can never become the URL "/About Us".
  if (typeof body.slug === 'string' && body.slug) {
    const clean = slugify(body.slug)
    if (!clean) return NextResponse.json({ error: 'Slug must contain at least one letter or number' }, { status: 400 })
    body.slug = clean
    updates.slug = clean
  }
  if (typeof body.fullPath === 'string' && body.fullPath) {
    const cleanPath = slugifyPath(body.fullPath)
    body.fullPath = cleanPath
    updates.fullPath = cleanPath
  }

  if (body.slug && body.slug !== existingDoc.slug) {
    const oldSlug = existingDoc.slug
    const oldPath = existingDoc.fullPath
    const newPath = `/${body.slug}`
    updates.fullPath = newPath
    updates.slugHistory = [...(existingDoc.slugHistory || []), oldSlug]

    // Create redirect entry
    const redirectsCol = await getCollection('redirects')
    await redirectsCol.updateOne(
      { from: oldPath },
      { $set: { from: oldPath, to: newPath, type: 301 } } as never,
      { upsert: true }
    )
  }

  await col.updateOne({ _id: new ObjectId(id) }, { $set: updates } as never)
  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await (await getCollection('pages')).deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ success: true })
}
