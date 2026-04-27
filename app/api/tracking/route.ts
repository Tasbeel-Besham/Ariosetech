import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function GET() {
  const col = await getCollection('site_config')
  const doc = await col.findOne({ key: 'tracking' })
  const data = doc ? (doc as unknown as Record<string, unknown>) : {}
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const col = await getCollection('site_config')
  await col.updateOne({ key: 'tracking' }, { $set: { ...body, key: 'tracking', updatedAt: new Date() } } as never, { upsert: true })
  return NextResponse.json({ success: true })
}
