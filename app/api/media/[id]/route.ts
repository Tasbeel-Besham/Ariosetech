import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

type P = { params: Promise<{ id: string }> }

export async function DELETE(_: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await (await getCollection('media')).deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ success: true })
}
