import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { slugify } from '@/lib/utils'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: P) {
  const { id } = await params
  const col = await getCollection('authors')
  const doc = await col.findOne({ _id: new ObjectId(id) } as never)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(doc)
}

export async function PUT(req: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const col = await getCollection('authors')

  const updates: Record<string, unknown> = { ...body, updatedAt: new Date() }
  if (typeof body.slug === 'string' && body.slug) {
    const clean = slugify(body.slug)
    if (!clean) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    updates.slug = clean
  }
  if (typeof body.expertise === 'string') {
    updates.expertise = body.expertise.split(',').map((s: string) => s.trim()).filter(Boolean)
  }
  delete (updates as Record<string, unknown>)._id

  await col.updateOne({ _id: new ObjectId(id) } as never, { $set: updates } as never)
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const col = await getCollection('authors')
  await col.deleteOne({ _id: new ObjectId(id) } as never)
  return NextResponse.json({ success: true })
}
