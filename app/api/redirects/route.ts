import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'

export async function GET() {
  const col = await getCollection('redirects')
  const redirects = await col.find({}).toArray()
  return NextResponse.json(redirects)
}
