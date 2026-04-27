import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const col = await getCollection('pages')
  const pages = await col.find({}).sort({ updatedAt: -1 }).toArray()
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { title, slug, parentId } = await req.json()
  if (!title || !slug) return NextResponse.json({ error: 'title and slug required' }, { status: 400 })

  const col = await getCollection('pages')
  const existing = await col.findOne({ slug })
  if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

  const page = {
    title, slug, parentId: parentId || null,
    fullPath: slug === '' ? '/' : `/${slug}`,
    layout: { sections: [] },
    status: 'draft',
    seo: { title: '', description: '', keywords: [], canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', twitterTitle: '', twitterDescription: '', twitterImage: '', robots: { index: true, follow: true } },
    schema: null, relatedPages: [], relatedBlogs: [], slugHistory: [],
    createdAt: new Date(), updatedAt: new Date(),
  }
  const result = await col.insertOne(page as never)
  return NextResponse.json({ ...page, _id: result.insertedId }, { status: 201 })
}
