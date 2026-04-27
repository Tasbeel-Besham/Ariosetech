import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

function toOid(id: string) { try { return new ObjectId(id) } catch { return null } }

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const oid  = toOid(id)
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const col = await getCollection('leads')
  await col.updateOne({ _id: oid } as never, { $set: { ...body, updatedAt: new Date() } } as never)
  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const oid = toOid(id)
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const col = await getCollection('leads')
  await col.deleteOne({ _id: oid } as never)
  return NextResponse.json({ success: true })
}
