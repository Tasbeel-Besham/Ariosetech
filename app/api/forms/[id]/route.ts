import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

type P = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  await (await getCollection('forms')).updateOne({ _id: new ObjectId(id) }, { $set: { ...body, updatedAt: new Date() } } as never)
  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await (await getCollection('forms')).deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ success: true })
}
