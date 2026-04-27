import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

type P = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: P) {
  const { id } = await params
  const col = await getCollection('blogs')
  const blog = await col.findOne({ _id: new ObjectId(id) })
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(blog)
}

export async function PUT(req: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const col = await getCollection('blogs')
  await col.updateOne({ _id: new ObjectId(id) }, { $set: { ...body, updatedAt: new Date().toISOString() } })
  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await (await getCollection('blogs')).deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ success: true })
}
