import { getCollection } from '@/lib/db/mongodb'

/**
 * Single source of truth for the brand palette.
 * The admin Theme page writes these keys to site_config; the site reads them
 * here on every request and injects derived CSS variables at the root, so a
 * colour change in the admin takes effect on the next page load — no redeploy.
 */

export type SiteTheme = {
  colorPrimary: string
  colorPrimaryDark: string
  colorSecondary: string
  colorBg: string
  colorText: string
  borderRadius: string
}

export const DEFAULT_THEME: SiteTheme = {
  colorPrimary: '#766cff',
  colorPrimaryDark: '#5a50e0',
  colorSecondary: '#9b8fff',
  colorBg: '#050508',
  colorText: '#f0f0ff',
  borderRadius: '12px',
}

/** "#766cff" -> "118, 108, 255"; tolerant of shorthand and missing hash. */
export function hexToRgb(hex: string): string {
  let h = (hex || '').trim().replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return '118, 108, 255' // fallback = brand purple
  const n = parseInt(h, 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

export async function getTheme(): Promise<SiteTheme> {
  try {
    const col = await getCollection('site_config')
    const doc = (await col.findOne({ key: 'theme' })) as Record<string, string> | null
    if (!doc) return DEFAULT_THEME
    return {
      colorPrimary: doc.colorPrimary || DEFAULT_THEME.colorPrimary,
      colorPrimaryDark: doc.colorPrimaryDark || doc.colorSecondary || DEFAULT_THEME.colorPrimaryDark,
      colorSecondary: doc.colorSecondary || DEFAULT_THEME.colorSecondary,
      colorBg: doc.colorBg || DEFAULT_THEME.colorBg,
      colorText: doc.colorText || DEFAULT_THEME.colorText,
      borderRadius: doc.borderRadius || DEFAULT_THEME.borderRadius,
    }
  } catch {
    return DEFAULT_THEME
  }
}

/**
 * Produce the CSS that overrides the static defaults in globals.css.
 * Every brand token is expressed through --primary-rgb so a single colour
 * change cascades everywhere (solids, soft fills, glows, gradients, borders).
 */
export function themeToCss(theme: SiteTheme): string {
  const primaryRgb = hexToRgb(theme.colorPrimary)
  const secondaryRgb = hexToRgb(theme.colorSecondary)
  return `:root{
--primary:${theme.colorPrimary};
--primary-rgb:${primaryRgb};
--primary-dark:${theme.colorPrimaryDark};
--primary-solid:${theme.colorPrimary};
--primary-soft:rgba(${primaryRgb},0.10);
--primary-glow:rgba(${primaryRgb},0.20);
--secondary:${theme.colorSecondary};
--secondary-rgb:${secondaryRgb};
--grad:linear-gradient(135deg, ${theme.colorPrimary} 0%, ${theme.colorSecondary} 100%);
--bg:${theme.colorBg};
--text:${theme.colorText};
--r-md:${theme.borderRadius};
}`
}
