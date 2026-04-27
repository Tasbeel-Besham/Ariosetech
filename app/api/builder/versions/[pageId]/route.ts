import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

type P = { params: Promise<{ pageId: string }> }

export async function GET(_: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { pageId } = await params
  const col = await getCollection('page_versions')
  const versions = await col.find({ pageId: new ObjectId(pageId) }).sort({ version: -1 }).limit(20).toArray()
  return NextResponse.json(versions)
}
