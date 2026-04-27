import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function GET() {
  const col = await getCollection('media')
  const items = await col.find({}).sort({ createdAt: -1 }).limit(100).toArray()
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.url) return NextResponse.json({ error: 'url required' }, { status: 400 })
  const col = await getCollection('media')
  const result = await col.insertOne({
    url: body.url, alt: body.alt || '', title: body.title || '',
    mimeType: body.mimeType || 'image/jpeg', size: body.size || 0,
    width: body.width || 0, height: body.height || 0,
    createdAt: new Date(),
  } as never)
  return NextResponse.json({ _id: result.insertedId }, { status: 201 })
}
