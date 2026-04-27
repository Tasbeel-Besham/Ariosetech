import crypto from 'crypto'
import { cookies } from 'next/headers'
import { getCollection } from '@/lib/db/mongodb'
import type { AdminUser } from '@/types'

const SECRET = process.env.ADMIN_JWT_SECRET || 'change-this-in-production'

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  if (stored.includes(':')) {
    const [salt, hash] = stored.split(':')
    const attempt = crypto.createHmac('sha256', salt).update(password).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(attempt, 'hex'), Buffer.from(hash, 'hex'))
  }
  return stored === password
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function signToken(username: string, role: string): string {
  const header  = b64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const payload = b64url(Buffer.from(JSON.stringify({
    username, role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    iat: Math.floor(Date.now() / 1000),
  })))
  const sig = crypto.createHmac('sha256', SECRET).update(`${header}.${payload}`).digest()
  return `${header}.${payload}.${b64url(sig)}`
}

export function verifyToken(token: string): { username: string; role: string } | null {
  try {
    const [header, payload, sig] = token.split('.')
    if (!header || !payload || !sig) return null
    const expected = b64url(crypto.createHmac('sha256', SECRET).update(`${header}.${payload}`).digest())
    const sigBuf = Buffer.from(sig.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
    const expBuf = Buffer.from(expected.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
    if (sigBuf.length !== expBuf.length) return null
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
    if (data.exp * 1000 < Date.now()) return null
    return data
  } catch { return null }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth() {
  const session = await getSession()
  return session !== null
}

export async function checkCredentials(username: string, password: string): Promise<boolean> {
  try {
    const col = await getCollection<AdminUser>('users')
    const user = await col.findOne({ username })
    if (!user) return false
    return verifyPassword(password, user.password)
  } catch { return false }
}
