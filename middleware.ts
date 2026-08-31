import { NextRequest, NextResponse } from 'next/server'
import { isProtectedPath, type RedirectMap } from '@/lib/redirects/shared'

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

/* ────────────────────────────────────────────────────────────────────────────
 * Database-managed redirects
 *
 * The `redirects` collection is edited at /admin/redirects and is also written
 * automatically whenever a page's slug changes. Middleware cannot query Mongo
 * (Edge runtime, no TCP sockets), so it fetches the compact map from
 * /api/redirects/map and holds it in module scope.
 *
 * The cache is stale-while-revalidate on purpose. Only the very first request
 * an edge instance serves waits for the fetch; after that a stale map is used
 * immediately and refreshed in the background, so a visitor never pays for the
 * round trip. A new redirect therefore goes live within about a minute per
 * region rather than instantly — the right trade for a table that changes a
 * few times a month and is read on every request.
 *
 * Note on ordering: `redirects()` in next.config.ts runs BEFORE middleware in
 * Next's routing pipeline, so those code-level rules always win over a row
 * here. The admin screen warns when a new row would be shadowed by one.
 * ──────────────────────────────────────────────────────────────────────────── */

const REDIRECT_TTL_MS = 60_000
let redirectCache: { map: RedirectMap; at: number } | null = null
let redirectInflight: Promise<void> | null = null

function refreshRedirectMap(origin: string): Promise<void> {
  if (redirectInflight) return redirectInflight
  redirectInflight = fetch(`${origin}/api/redirects/map`, { headers: { 'x-redirect-map': '1' } })
    .then(r => (r.ok ? r.json() : {}))
    .then((map: RedirectMap) => { redirectCache = { map: map || {}, at: Date.now() } })
    .catch(() => {
      // Fail open. Keep whatever map we already have and try again next request
      // rather than 500ing the page.
      if (!redirectCache) redirectCache = { map: {}, at: Date.now() }
    })
    .finally(() => { redirectInflight = null })
  return redirectInflight
}

async function getRedirectMap(origin: string): Promise<RedirectMap> {
  const cached = redirectCache
  if (!cached) {
    // Cold instance: nothing to serve, so this one request waits.
    await refreshRedirectMap(origin)
    return redirectCache ? (redirectCache as { map: RedirectMap }).map : {}
  }
  // Warm but stale: serve the old map now, refresh behind the response.
  if (Date.now() - cached.at >= REDIRECT_TTL_MS) void refreshRedirectMap(origin)
  return cached.map
}

async function databaseRedirect(req: NextRequest): Promise<NextResponse | null> {
  const { pathname, search } = req.nextUrl
  if (isProtectedPath(pathname) || pathname === '/') return null

  const key = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const map = await getRedirectMap(req.nextUrl.origin)
  const hit = map[key]
  if (!hit) return null

  const [to, status] = hit
  // Carry the query string through so campaign tags (?utm_source=…) and any
  // other tracking parameters survive the hop.
  const target = /^https?:\/\//i.test(to)
    ? new URL(to)
    : new URL(to, req.nextUrl.origin)
  if (search && !target.search) target.search = search

  if (target.pathname === pathname && target.origin === req.nextUrl.origin) return null
  return NextResponse.redirect(target, status)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Canonicalise case before anything else, so /Admin and /wooCommerce are
  // resolved to their real routes rather than handled as separate URLs.
  const cased = lowercasePathRedirect(req)
  if (cased) return securityHeaders(cased)

  // Then the managed redirect table, so an old URL is resolved before any
  // route tries to render it (and 404s).
  const managed = await databaseRedirect(req)
  if (managed) return securityHeaders(managed)

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
