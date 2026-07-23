import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

/**
 * Authors are public profile records (name, bio, photo, social links) used for
 * blog bylines, author pages, and Person schema. Deliberately separate from the
 * `users` collection, which holds login credentials — public profile data and
 * auth data should never live in the same document.
 */

// GET — public (author pages and blog bylines read this)
export async function GET(req: NextRequest) {
  const col = await getCollection('authors')
  const slug = req.nextUrl.searchParams.get('slug')
  if (slug) {
    const one = await col.findOne({ slug } as never)
    return NextResponse.json(one || null)
  }
  const items = await col.find({}).sort({ name: 1 }).toArray()
  return NextResponse.json(items)
}

// POST — admin only
export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const slug = slugify(body.slug || body.name)
  if (!slug) return NextResponse.json({ error: 'Could not derive a slug from the name' }, { status: 400 })

  const col = await getCollection('authors')
  if (await col.findOne({ slug } as never)) {
    return NextResponse.json({ error: 'An author with that slug already exists' }, { status: 409 })
  }

  const doc = {
    name: String(body.name).trim(),
    slug,
    role: body.role || '',
    bio: body.bio || '',
    avatar: body.avatar || '',
    email: body.email || '',
    linkedin: body.linkedin || '',
    twitter: body.twitter || '',
    website: body.website || '',
    expertise: Array.isArray(body.expertise) ? body.expertise
      : String(body.expertise || '').split(',').map(s => s.trim()).filter(Boolean),
    published: body.published !== false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const result = await col.insertOne(doc as never)
  return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 })
}
