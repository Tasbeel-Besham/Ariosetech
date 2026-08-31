/**
 * Pure helpers shared by the redirect API, the admin screen and the middleware.
 *
 * Nothing here may import MongoDB or any Node built-in: middleware runs on the
 * Edge runtime, so this file has to stay dependency-free.
 */

export type RedirectDoc = {
  _id?: string
  from: string
  to: string
  type: 301 | 302 | 307 | 308
  enabled?: boolean
  note?: string
  /** 'manual' = created in the admin, 'slug-change' = written automatically when a page was renamed. */
  source?: 'manual' | 'slug-change'
  createdAt?: string | Date
  updatedAt?: string | Date
}

/** Compact wire format for the edge map: { '/old': ['/new', 301] }. */
export type RedirectMap = Record<string, [string, number]>

export const REDIRECT_TYPES = [301, 302, 307, 308] as const

/**
 * Paths the middleware must never redirect, because doing so would break the
 * app itself rather than an old marketing URL.
 *
 *   /api    — the redirect map is served from here; redirecting it would loop.
 *   /_next  — build assets.
 *   /admin  — locking yourself out of the admin with a bad row is unrecoverable
 *             without database access.
 */
export const PROTECTED_PREFIXES = ['/api', '/_next', '/admin']

export function isProtectedPath(path: string): boolean {
  return PROTECTED_PREFIXES.some(p => path === p || path.startsWith(p + '/'))
}

/**
 * Canonical form of a source path.
 *
 * Lowercase because `lowercasePathRedirect()` in middleware.ts already folds
 * mixed-case URLs to lowercase before the redirect lookup runs — a row stored
 * as "/OldPage" could therefore never match. Trailing slash stripped because
 * Next already redirects "/path/" to "/path" before middleware sees it.
 */
export function normalizeFrom(input: string): string {
  let p = String(input || '').trim()
  if (!p) return ''
  // Accept a full URL pasted from the browser or from Search Console.
  if (/^https?:\/\//i.test(p)) {
    try { p = new URL(p).pathname } catch { /* fall through and treat as a path */ }
  }
  p = p.split('#')[0].split('?')[0]
  if (!p.startsWith('/')) p = '/' + p
  p = p.replace(/\/{2,}/g, '/')
  if (p.length > 1) p = p.replace(/\/+$/, '')
  return p.toLowerCase()
}

/**
 * Canonical form of a destination. External destinations keep their case and
 * their query string; internal ones are normalised like a source path.
 */
export function normalizeTo(input: string): string {
  const p = String(input || '').trim()
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  return normalizeFrom(p)
}

export function isExternal(to: string): boolean {
  return /^https?:\/\//i.test(to)
}

export type ValidationResult = { ok: true; from: string; to: string; type: number } | { ok: false; error: string }

export function validateRedirect(rawFrom: string, rawTo: string, rawType: unknown): ValidationResult {
  const from = normalizeFrom(rawFrom)
  const to = normalizeTo(rawTo)
  const type = Number(rawType) || 301

  if (!from || from === '/') return { ok: false, error: 'Source path is required and cannot be the homepage.' }
  if (!to) return { ok: false, error: 'Destination is required.' }
  if (!(REDIRECT_TYPES as readonly number[]).includes(type)) {
    return { ok: false, error: `Status code must be one of ${REDIRECT_TYPES.join(', ')}.` }
  }
  if (isProtectedPath(from)) {
    return { ok: false, error: `Cannot redirect ${from} — ${PROTECTED_PREFIXES.join(', ')} are reserved by the application.` }
  }
  if (from === to) return { ok: false, error: 'Source and destination are the same — that would loop forever.' }
  if (!isExternal(to) && !to.startsWith('/')) {
    return { ok: false, error: 'Destination must be a path starting with / or a full https:// URL.' }
  }
  return { ok: true, from, to, type }
}

/**
 * Follow a destination through any existing rows so the stored rule points at
 * the final URL rather than at another redirect.
 *
 * Chains cost real ranking signal — every extra hop is another round trip for
 * the crawler and another place for authority to leak — so the table is kept
 * flat at write time instead of being resolved at request time.
 *
 * Returns null when following the chain leads back to `from` (a loop).
 */
export function resolveChain(from: string, to: string, existing: Pick<RedirectDoc, 'from' | 'to' | 'enabled'>[]): string | null {
  const byFrom = new Map<string, string>()
  for (const r of existing) {
    if (r.enabled === false) continue
    if (r.from === from) continue // the row being written is about to be replaced
    // A row whose source equals its destination is a no-op — the map route
    // drops it and it never fires. Following it here would make the walk below
    // revisit the same path twice and report a loop that does not exist, which
    // is exactly what a stale self-referential row left behind by a renamed
    // page did: it blocked every new redirect pointing at that page.
    if (r.from === r.to) continue
    byFrom.set(r.from, r.to)
  }
  let current = to
  const seen = new Set<string>([from])
  for (let hop = 0; hop < 10; hop++) {
    if (isExternal(current)) return current
    if (seen.has(current)) return null
    const next = byFrom.get(current)
    if (!next) return current
    seen.add(current)
    current = next
  }
  return current
}

/**
 * Source patterns that are already redirected by `redirects()` in
 * next.config.ts. Those rules run *before* middleware in Next's routing order,
 * so a database row covering the same path can never take effect — the admin
 * warns instead of silently saving something inert.
 */
export function shadowedByCodeRule(from: string): string | null {
  const rules: [RegExp, string][] = [
    [/^\/contact-us(\/|$)/, '/contact'],
    [/^\/about-us$/, '/about'],
    [/^\/our-services$/, '/services'],
    [/^\/privacy$/, '/privacy-policy'],
    [/^\/terms$/, '/terms-of-service'],
    [/^\/category(\/|$)/, '/blog or /portfolio'],
    [/^\/laprima(\/|$)/, '/portfolio'],
    [/^\/tag(\/|$)/, '/blog'],
    [/^\/wp-content(\/|$)/, '/'],
    [/^\/wp-admin(\/|$)/, '/'],
    [/^\/wp-includes(\/|$)/, '/'],
    [/^\/wp-login\.php$/, '/'],
    [/^\/xmlrpc\.php$/, '/'],
    [/^\/wordpress(\/|$)/, '/services/wordpress'],
    [/^\/woocommerce(\/|$)/, '/services/woocommerce'],
    [/^\/shopify(\/|$)/, '/services/shopify'],
    [/^\/seo(\/|$)/, '/services/seo'],
    [/^\/wordpress-theme-detector(\/|$)/, '/tools/wordpress-theme-detector'],
    [/^\/shopify-theme-detector(\/|$)/, '/tools/shopify-theme-detector'],
    [/-ariosetech$/, '/services'],
    [/^\/\d{4}(\/|$)/, '/blog'],
    [/^\/feed(\/|$)/, '/blog'],
    [/^\/comments\/feed$/, '/blog'],
    [/^\/page\/\d+$/, '/blog'],
    [/^\/sample-page$/, '/'],
    [/^\/hello-world$/, '/blog'],
    [/^\/portfolio-item(\/|$)/, '/portfolio'],
  ]
  for (const [re, dest] of rules) if (re.test(from)) return dest
  return null
}
