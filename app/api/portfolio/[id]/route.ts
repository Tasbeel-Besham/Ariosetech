import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

function toOid(id: string) {
  try { return new ObjectId(id) } catch { return null }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const col = await getCollection('portfolio')
  const oid = toOid(id)
  const item = oid
    ? await col.findOne({ _id: oid } as never)
    : await col.findOne({ slug: id } as never)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const col = await getCollection('portfolio')
  const oid = toOid(id)
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const { _id, ...update } = body
  void _id
  await col.updateOne(
    { _id: oid } as never,
    { $set: { ...update, updatedAt: new Date().toISOString() } } as never
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const col = await getCollection('portfolio')
  const oid = toOid(id)
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await col.deleteOne({ _id: oid } as never)
  return NextResponse.json({ success: true })
}
