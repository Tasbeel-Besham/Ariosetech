import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url param required' }, { status: 400 })

  const col = await getCollection('pages')
  const page = await col.findOne({ fullPath: url })
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(page)
}
