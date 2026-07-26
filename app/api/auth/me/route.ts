import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** Returns the currently logged-in admin (username + role), or null. Used by the
 *  blog editor to default the Author field to whoever is signed in. */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 200 })
  return NextResponse.json({ username: session.username, role: session.role })
}
