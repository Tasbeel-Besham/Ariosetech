export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

const DEFAULT: Record<string, unknown> = {
  key: 'header', logo: '', logoAlt: 'ARIOSETECH', logoWidth: 160,
  showTopBar: true, topBarPhone: '+92 300 9484 739', topBarEmail: 'info@ariosetech.com',
  topBarText: 'Available for new projects',
  ctaPrimaryLabel: 'Get Free Quote', ctaPrimaryHref: '/contact',
  ctaSecondaryLabel: 'View Work', ctaSecondaryHref: '/portfolio',
  sticky: true, transparent: false,
}

export async function GET() {
  const col = await getCollection('site_config')
  const doc = await col.findOne({ key: 'header' })
  return NextResponse.json(doc ? (doc as unknown as Record<string, unknown>) : DEFAULT)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const col = await getCollection('site_config')
  await col.updateOne({ key: 'header' }, { $set: { ...body, key: 'header', updatedAt: new Date() } } as never, { upsert: true })
  return NextResponse.json({ success: true })
}
