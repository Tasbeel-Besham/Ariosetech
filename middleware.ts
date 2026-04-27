import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.ADMIN_JWT_SECRET || 'change-this-in-production'

function b64urlDecode(str: string): ArrayBuffer {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '=='.slice(0, (4 - base64.length % 4) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer as ArrayBuffer
}

async function verifyJWT(token: string): Promise<boolean> {
  try {
    const [header, payload, sig] = token.split('.')
    if (!header || !payload || !sig) return false
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    const valid = await crypto.subtle.verify('HMAC', key, b64urlDecode(sig), new TextEncoder().encode(`${header}.${payload}`))
    if (!valid) return false
    const data = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    if (data.exp && data.exp * 1000 < Date.now()) return false
    return !!data.username
  } catch { return false }
}

function securityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'SAMEORIGIN')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  return res
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('admin_token')?.value
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url))
    if (!await verifyJWT(token)) {
      const res = NextResponse.redirect(new URL('/admin/login', req.url))
      res.cookies.delete('admin_token')
      return res
    }
    return securityHeaders(NextResponse.next())
  }

  return securityHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon|logo|public).*)'],
}
