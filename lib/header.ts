import { getCollection } from '@/lib/db/mongodb'

export type HeaderSettings = {
  logoUrl: string
  siteName: string
  logoWidth: number
}

export const HEADER_FALLBACK: HeaderSettings = {
  logoUrl: '',
  siteName: 'ARIOSETECH',
  logoWidth: 160,
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
export async function getHeaderSettings(): Promise<HeaderSettings> {
  try {
    const [settingsCol, headerCol] = await Promise.all([
      getCollection('settings'),
      getCollection('header'),
    ])

    const [settings, header] = await Promise.all([
      settingsCol.findOne({} as never).catch(() => null),
      headerCol.findOne({} as never).catch(() => null),
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
    }
  } catch (e) {
    console.error('[header] could not read settings:', e)
    return HEADER_FALLBACK
  }
}
