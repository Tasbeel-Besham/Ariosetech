import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get('admin')
  const col = await getCollection('portfolio')
  const filter = admin ? {} : { published: true }
  const items = await col.find(filter).sort({ featured: -1, updatedAt: -1 }).toArray()
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const col = await getCollection('portfolio')
  const result = await col.insertOne({ ...body, updatedAt: new Date().toISOString() } as never)
  return NextResponse.json({ _id: result.insertedId, ...body }, { status: 201 })
}
