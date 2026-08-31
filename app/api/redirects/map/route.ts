import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { normalizeFrom, normalizeTo, isProtectedPath, type RedirectMap } from '@/lib/redirects/shared'

export const dynamic = 'force-dynamic'

/**
 * Public, deliberately minimal: the lookup table the middleware uses.
 *
 * Middleware runs on the Edge runtime and cannot open a MongoDB connection, so
 * it fetches this instead and caches the result in module scope. That makes
 * this route hot — it is read once per edge instance per minute, not once per
 * visitor — so it returns the smallest possible shape ({ '/old': ['/new', 301] })
 * and sets CDN cache headers on top of the middleware's own cache.
 *
 * It exposes only paths that are already public redirects, so there is nothing
 * to authenticate.
 */
export async function GET() {
  const map: RedirectMap = {}
  try {
    const col = await getCollection('redirects')
    const rows = await col.find({}).toArray() as unknown as { from?: string; to?: string; type?: number; enabled?: boolean }[]
    for (const r of rows) {
      // Rows written automatically on a page rename predate the `enabled`
      // field, so absent means enabled.
      if (r.enabled === false) continue
      const from = normalizeFrom(r.from || '')
      const to = normalizeTo(r.to || '')
      if (!from || !to || from === to || from === '/') continue
      if (isProtectedPath(from)) continue
      map[from] = [to, Number(r.type) || 301]
    }
  } catch (e) {
    // Fail open with an empty map: a database blip must not take the site down.
    console.error('[redirects/map] lookup failed:', e)
  }

  return NextResponse.json(map, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
