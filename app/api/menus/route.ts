import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function GET() {
  const col = await getCollection('menus')
  const menus = await col.find({}).toArray()
  return NextResponse.json(menus)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const col = await getCollection('menus')
  await col.updateOne(
    { location: body.location },
    { $set: { ...body, updatedAt: new Date() } } as never,
    { upsert: true }
  )
  return NextResponse.json({ success: true })
}
