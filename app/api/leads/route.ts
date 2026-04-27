import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

// GET — admin only
export async function GET(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formId  = req.nextUrl.searchParams.get('formId')
  const status  = req.nextUrl.searchParams.get('status')
  const col     = await getCollection('leads')
  const filter: Record<string, string> = {}
  if (formId)  filter.formId = formId
  if (status)  filter.status = status
  const leads = await col.find(filter).sort({ createdAt: -1 }).toArray()
  return NextResponse.json(leads)
}

// POST — public (contact form, no auth required)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.email && !body.name) {
      return NextResponse.json({ error: 'Name or email required' }, { status: 400 })
    }
    const col = await getCollection('leads')
    const lead = {
      ...body,
      status: body.status || 'new',
      source: body.source || 'Website',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await col.insertOne(lead as never)
    return NextResponse.json({ success: true, _id: result.insertedId }, { status: 201 })
  } catch (err) {
    console.error('[leads POST]', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
