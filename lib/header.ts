import { getCollection } from '@/lib/db/mongodb'
import { cache } from 'react'

/** Raw menu documents, transformed in the navbar (the transform builds JSX icons). */
export type RawMenus = {
  header: unknown[]
  services: unknown[]
  tools: unknown[]
}

export type HeaderSettings = {
  logoUrl: string
  siteName: string
  logoWidth: number
  menus: RawMenus
}

const EMPTY_MENUS: RawMenus = { header: [], services: [], tools: [] }

export const HEADER_FALLBACK: HeaderSettings = {
  logoUrl: '',
  siteName: 'ARIOSETECH',
  logoWidth: 160,
  menus: EMPTY_MENUS,
}

/**
 * Read the header's branding on the server.
 *
 * The navbar previously started with an empty logo, rendered the text wordmark,
 * then fetched /api/settings on the client and swapped in the real image. That
 * produced a visible flash on every single page load — the placeholder paints
 * first, then jumps to the logo — and it moves layout while doing it, which
 * counts against Cumulative Layout Shift on every page.
 *
 * Reading it here means the correct logo is in the server HTML from the first
 * frame. Nothing to swap, nothing to shift.
 *
 * Fail-safe: any error returns the fallback, so the header still renders (as
 * the wordmark) rather than the page failing.
 */
/* ── Caching ───────────────────────────────────────────────────────────
   Reading this on the server fixes the flash, but it also puts five database
   queries in front of every page render — and the whole site is
   force-dynamic, so every request would pay that.

   Header branding and menus change only when someone saves them in the admin,
   which is rare. A short in-process TTL means a warm serverless instance
   serves them from memory instead. `clearHeaderCache()` is called by the
   admin save routes, so edits still appear immediately rather than up to a
   minute later.
   ──────────────────────────────────────────────────────────────────── */

const TTL_MS = 60_000
let memo: { at: number; value: HeaderSettings } | null = null

/** Called by the header/settings/menus save routes so admin edits show at once. */
export function clearHeaderCache(): void {
  memo = null
}

/**
 * Per-request deduplication on top of the TTL cache. `cache()` guarantees one
 * call per render pass even if several components ask for it.
 */
export const getHeaderSettings = cache(async (): Promise<HeaderSettings> => {
  if (memo && Date.now() - memo.at < TTL_MS) return memo.value
  const value = await readHeaderSettings()
  // Only cache a real read. Caching a fallback would pin the wordmark in place
  // for a minute after a transient database blip.
  if (value !== HEADER_FALLBACK) memo = { at: Date.now(), value }
  return value
})

async function readHeaderSettings(): Promise<HeaderSettings> {
  try {
    const [settingsCol, headerCol, menusCol] = await Promise.all([
      getCollection('settings'),
      getCollection('header'),
      getCollection('menus'),
    ])

    const [settings, header, headerMenu, servicesMenu, toolsMenu] = await Promise.all([
      settingsCol.findOne({} as never).catch(() => null),
      headerCol.findOne({} as never).catch(() => null),
      // Menus too, not just branding. The nav LINKS were also arriving via the
      // client fetch, which is why the link order visibly reshuffles a moment
      // after the logo appears — two separate symptoms of the same cause.
      menusCol.find({ location: 'header' } as never).toArray().catch(() => []),
      menusCol.find({ location: 'services_mega' } as never).toArray().catch(() => []),
      menusCol.find({ location: 'tools' } as never).toArray().catch(() => []),
    ])

    const s = (settings || {}) as Record<string, unknown>
    const h = (header || {}) as Record<string, unknown>

    // Same precedence the client fetch used, so behaviour is unchanged.
    const logoUrl = String(s.logo_url || h.logo || '').trim()
    const siteName = String(s.site_name || h.logoAlt || 'ARIOSETECH').trim()
    const logoWidth = Number(h.logoWidth) || 160

    return {
      logoUrl,
      siteName: siteName || 'ARIOSETECH',
      logoWidth,
      // JSON round-trip: Mongo documents carry ObjectId and Date instances,
      // which React cannot serialize across the server/client boundary. Passing
      // one straight through throws "Only plain objects can be passed to Client
      // Components" and takes down the whole page.
      menus: JSON.parse(JSON.stringify({
        header: headerMenu, services: servicesMenu, tools: toolsMenu,
      })) as RawMenus,
    }
  } catch (e) {
    console.error('[header] could not read settings:', e)
    return HEADER_FALLBACK
  }
}
