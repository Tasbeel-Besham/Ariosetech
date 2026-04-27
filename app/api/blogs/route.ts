import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get('admin')
  const col = await getCollection('blogs')
  const filter = admin ? {} : { published: true }
  const blogs = await col.find(filter).sort({ date: -1 }).toArray()
  return NextResponse.json(blogs)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const col = await getCollection('blogs')
  const existing = await col.findOne({ slug: body.slug })
  if (existing) return NextResponse.json({ error: 'Slug exists' }, { status: 409 })
  const doc = {
    ...body,
    status: body.published ? 'published' : 'draft',
    publishedAt: body.published ? new Date().toISOString() : null,
    seo: body.seo || { title: '', description: '', ogImage: '' },
    updatedAt: new Date().toISOString(),
  }
  const result = await col.insertOne(doc as never)
  return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 })
}
