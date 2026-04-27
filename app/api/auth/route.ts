import { NextRequest, NextResponse } from 'next/server'
import { checkCredentials, signToken } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import type { AdminUser } from '@/types'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  // First-time setup: if no users exist, create default admin
  const col = await getCollection<AdminUser>('users')
  const count = await col.countDocuments()
  if (count === 0) {
    const { hashPassword } = await import('@/lib/auth')
    await col.insertOne({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashPassword(process.env.ADMIN_PASSWORD || 'changeme'),
      role: 'admin',
      createdAt: new Date(),
    } as never)
  }

  const valid = await checkCredentials(username, password)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const user = await col.findOne({ username })
  const token = signToken(username, user?.role || 'admin')

  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('admin_token')
  return res
}
