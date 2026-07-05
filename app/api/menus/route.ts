import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function GET(req: NextRequest) {
  const col = await getCollection('menus')
  const location = req.nextUrl.searchParams.get('location')
  if (location) {
    // Return only the requested location's menu (still as an array, so callers
    // that read [0] keep working). Without this filter every dropdown received
    // the full menu list and picked whichever menu happened to be first.
    const menu = await col.findOne({ location })
    return NextResponse.json(menu ? [menu] : [])
  }
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
