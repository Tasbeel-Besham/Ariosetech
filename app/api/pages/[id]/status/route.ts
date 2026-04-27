import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

type P = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { status } = await req.json()
  if (!['draft', 'published'].includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  await (await getCollection('pages')).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } } as never
  )
  return NextResponse.json({ success: true })
}
