import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

const DEFAULTS = {
  logo_url: 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png',
  site_name: 'ARIOSETECH', tagline: 'Consider It Solved',
  email: 'info@ariosetech.com', phone: '+92 300 9484 739',
  whatsapp: 'https://wa.me/923009484739',
  address: '95 College Road, Block E, PCSIR Staff Colony, Lahore, 54770',
  facebook: 'https://facebook.com/ariosetech',
  instagram: 'https://instagram.com/ariosetech',
  linkedin: 'https://linkedin.com/company/ariosetech',
}

export async function GET() {
  const col = await getCollection('settings')
  const doc = await col.findOne({ key: 'site_settings' })
  if (!doc) return NextResponse.json(DEFAULTS)
  // Handle both flat and nested {value: {}} formats
  const data = (doc as unknown as { value?: Record<string, unknown> }).value
  if (data && typeof data === 'object') return NextResponse.json(data)
  return NextResponse.json(DEFAULTS)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const col = await getCollection('settings')
  await col.updateOne(
    { key: 'site_settings' },
    { $set: { key: 'site_settings', value: body, updatedAt: new Date() } } as never,
    { upsert: true }
  )
  return NextResponse.json({ success: true })
}
