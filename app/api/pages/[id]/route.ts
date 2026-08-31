import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { slugifyPath } from '@/lib/utils'
import { ObjectId } from 'mongodb'
import { revalidateSite } from '@/lib/cache'

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
  //
  // slugifyPath, NOT slugify. Some pages legitimately store a multi-segment
  // slug ("services/wordpress"), and slugify() turns the separator into a
  // hyphen — "services-wordpress". That made the comparison below see a
  // renamed page, rewrite fullPath to "/services-wordpress", and 404 the live
  // URL. slugifyPath cleans each segment and keeps the "/" intact, so a
  // multi-segment slug round-trips unchanged while a single-segment slug is
  // sanitised exactly as before.
  if (typeof body.slug === 'string' && body.slug) {
    const clean = slugifyPath(body.slug).replace(/^\/+|\/+$/g, '')
    if (!clean.replace(/\//g, '')) return NextResponse.json({ error: 'Slug must contain at least one letter or number' }, { status: 400 })
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
    // Keep the page where it lives: swap only the final segment of the current
    // path. Rebuilding as `/${slug}` moved every nested page to the site root
    // on any rename — /services/wordpress would have become /wordpress.
    const parent = (oldPath || '').replace(/\/[^/]*$/, '')
    const lastSegment = body.slug.split('/').filter(Boolean).pop() || body.slug
    const newPath = `${parent}/${lastSegment}`.replace(/\/+/g, '/')
    updates.fullPath = newPath
    updates.slugHistory = [...(existingDoc.slugHistory || []), oldSlug]

    // Record the rename in the redirect table so the old URL keeps working.
    // Until the middleware started reading this collection these rows were
    // inert — a renamed page 404'd at its old address and lost every link and
    // ranking signal pointing at it. They now serve a real 301.
    const redirectsCol = await getCollection('redirects')
    const now = new Date()
    await redirectsCol.updateOne(
      { from: oldPath },
      {
        $set: { from: oldPath, to: newPath, type: 301, enabled: true, updatedAt: now },
        $setOnInsert: { source: 'slug-change', createdAt: now },
      } as never,
      { upsert: true }
    )
    // If anything already redirected *to* the old path, repoint it at the new
    // one rather than leaving a two-hop chain behind.
    await redirectsCol.updateMany(
      { to: oldPath, from: { $ne: oldPath } },
      { $set: { to: newPath, updatedAt: now } } as never,
    )
  }

  await col.updateOne({ _id: new ObjectId(id) }, { $set: updates } as never)
  revalidateSite()
  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await (await getCollection('pages')).deleteOne({ _id: new ObjectId(id) })
  revalidateSite()
  return NextResponse.json({ success: true })
}
