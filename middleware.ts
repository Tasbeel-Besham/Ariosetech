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

/**
 * Fold mixed-case paths to lowercase with a 301.
 *
 * Legacy WordPress URLs are still crawled with mixed case — /Wordpress,
 * /wooCommerce and /wooCommerce/ all sit in Search Console's "Crawled,
 * currently not indexed" bucket, because Google treats them as URLs distinct
 * from the lowercase versions. The redirect rules in next.config.ts are
 * lowercase-only, so these fall straight through them.
 *
 * Every route in this app is lowercase, and every portfolio and blog slug in
 * the database is lowercase, so folding case collapses the whole class in one
 * rule instead of adding a redirect per variant as each one is discovered.
 *
 * Two exclusions matter:
 *   /api   — path params carry Mongo ObjectIds, which are case-sensitive hex.
 *            Lowercasing /api/pages/64F3A1... would break every such call.
 *   /_next — build asset hashes are case-sensitive.
 */
function lowercasePathRedirect(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) return null
  if (!/[A-Z]/.test(pathname)) return null

  const url = req.nextUrl.clone()
  url.pathname = pathname.toLowerCase()
  // 301, not the default 307: this is a permanent canonicalisation and we want
  // Google to consolidate the duplicate rather than keep both.
  return NextResponse.redirect(url, 301)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Canonicalise case before anything else, so /Admin and /wooCommerce are
  // resolved to their real routes rather than handled as separate URLs.
  const cased = lowercasePathRedirect(req)
  if (cased) return securityHeaders(cased)

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
