import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

const DEFAULT = {
  key: 'theme', colorPrimary: '#766cff', colorSecondary: '#9b8fff',
  colorPrimaryDark: '#5a50e0', colorBg: '#050508', colorText: '#f0f0ff',
  fontDisplay: 'Manrope', fontBody: 'Inter', borderRadius: '12px',
}

export async function GET() {
  const col = await getCollection('site_config')
  const doc = await col.findOne({ key: 'theme' })
  return NextResponse.json(doc ? (doc as unknown as Record<string, unknown>) : DEFAULT)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const col = await getCollection('site_config')
  await col.updateOne({ key: 'theme' }, { $set: { ...body, key: 'theme', updatedAt: new Date() } } as never, { upsert: true })
  return NextResponse.json({ success: true })
}
