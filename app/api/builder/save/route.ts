import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { validateLayout } from '@/lib/builder/engine'

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { pageId, layout } = await req.json()
  if (!pageId || !layout) return NextResponse.json({ error: 'pageId and layout required' }, { status: 400 })
  if (!validateLayout(layout)) return NextResponse.json({ error: 'Invalid layout' }, { status: 400 })

  const col = await getCollection('pages')
  await col.updateOne(
    { _id: new ObjectId(pageId) },
    { $set: { layout, status: 'draft', updatedAt: new Date() } } as never
  )
  return NextResponse.json({ success: true })
}
