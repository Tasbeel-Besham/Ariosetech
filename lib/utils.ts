import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

/**
 * Convert any string into an SEO-safe URL slug, per Google's URL guidelines:
 *  - lowercase (URLs are case-sensitive; mixed case causes duplicate-content
 *    and 404s when users retype them)
 *  - spaces and underscores become hyphens (Google treats hyphens as word
 *    separators; underscores and %20 are not word separators)
 *  - accented characters folded to ASCII (café -> cafe)
 *  - ampersand expanded to "and" before stripping punctuation
 *  - no leading/trailing or repeated hyphens
 */
export function slugify(str: string): string {
  return String(str)
    .normalize('NFKD')                    // split accents from letters
    .replace(/[\u0300-\u036f]/g, '')      // strip the accent marks
    .replace(/&/g, ' and ')               // & -> and (keeps meaning in URL)
    .toLowerCase()
    .replace(/['’`]/g, '')                // drop apostrophes rather than hyphenating
    .replace(/[^a-z0-9\s-]/g, ' ')        // any other punctuation -> space
    .trim()
    .replace(/[\s_]+/g, '-')              // spaces AND underscores -> hyphen
    .replace(/-+/g, '-')                  // collapse repeats
    .replace(/^-|-$/g, '')                // trim stray hyphens
}

/** Slugify a multi-segment path, preserving the "/" separators. */
export function slugifyPath(path: string): string {
  return String(path)
    .split('/')
    .map(seg => (seg ? slugify(seg) : ''))
    .join('/')
    .replace(/\/+/g, '/')
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '...' : str
}
