import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const col = await getCollection('forms')
  return NextResponse.json(await col.find({}).sort({ createdAt: -1 }).toArray())
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const col = await getCollection('forms')
  const result = await col.insertOne({ ...body, createdAt: new Date(), updatedAt: new Date() } as never)
  return NextResponse.json({ _id: result.insertedId }, { status: 201 })
}
