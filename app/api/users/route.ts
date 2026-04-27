import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { hashPassword } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const col = await getCollection('users')
  const users = await col.find({}, { projection: { password: 0 } }).toArray()
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { username, password, role } = await req.json()
  if (!username || !password) return NextResponse.json({ error: 'Username and password required' }, { status: 400 })

  const col = await getCollection('users')
  const existing = await col.findOne({ username })
  if (existing) return NextResponse.json({ error: 'Username already exists' }, { status: 409 })

  await col.insertOne({ username, password: hashPassword(password), role: role || 'editor', createdAt: new Date() } as never)
  return NextResponse.json({ success: true }, { status: 201 })
}
