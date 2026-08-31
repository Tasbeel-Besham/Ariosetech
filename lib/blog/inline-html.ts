/**
 * Strict allowlist sanitiser for the inline HTML stored on blog blocks.
 *
 * Blog body text keeps its bold, italic, links and inline code, which means the
 * renderer has to inject markup with dangerouslySetInnerHTML. That is only safe
 * if the stored string is known-clean, so everything is filtered through here —
 * once when the post is saved and again when it is rendered. Sanitising twice
 * is deliberate: the save-time pass keeps the database clean, and the render
 * pass means a row written by any other path (a script, a restored backup, an
 * older API version) still cannot inject anything.
 *
 * No DOM is used. BlogContent is a server component and Node has no DOMParser,
 * so this walks the string directly rather than depending on a browser API or
 * pulling in a sanitiser library.
 */

/**
 * Tags that may appear in block text. Deliberately inline-only — block
 * structure comes from the block array, never from the stored string.
 */
const ALLOWED = new Set(['b', 'strong', 'i', 'em', 'u', 's', 'code', 'br', 'a'])

/** Tags that never have a closing partner. */
const VOID = new Set(['br'])

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);?/gi, (_, h) => {
      const n = parseInt(h, 16)
      return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ''
    })
    .replace(/&#(\d+);?/g, (_, d) => {
      const n = parseInt(d, 10)
      return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ''
    })
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
}

/**
 * A URL is safe if it is relative, or absolute with a scheme we expect.
 * Rejects javascript:, data:, vbscript: and anything else exotic.
 *
 * Entities are decoded and whitespace/control characters stripped before the
 * check, because browsers ignore both inside a scheme — `java&#115;cript:` and
 * `java\tscript:` both execute, so both have to be caught here.
 */
function safeHref(raw: string): string | null {
  const url = decodeEntities(raw).trim()
  if (!url) return null
  const probe = url.split('').filter(c => c.charCodeAt(0) > 32 && c.charCodeAt(0) !== 0xa0 && c.charCodeAt(0) !== 0xfeff).join('').toLowerCase()
  if (/^(?:javascript|data|vbscript|file|blob):/.test(probe)) return null
  // Unknown scheme: allow only the ones a blog link legitimately uses.
  if (/^[a-z][a-z0-9+.-]*:/.test(probe) && !/^(?:https?|mailto|tel):/.test(probe)) return null
  return url
}

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeAttr(s: string): string {
  return escapeText(s).replace(/"/g, '&quot;')
}

/**
 * Return `html` with every disallowed tag and attribute removed and all tags
 * balanced. Text content is preserved even when its wrapper is dropped, so
 * stripping a tag never loses a word of the article.
 */
export function sanitizeInlineHtml(html: string | undefined | null): string {
  const input = String(html ?? '')
  if (!input) return ''

  // Remove whole elements whose content is dangerous too, not just their tags.
  const cleaned = input
    .replace(/<script[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style[\s\S]*?<\/style\s*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  let out = ''
  const open: string[] = []
  let i = 0

  while (i < cleaned.length) {
    const lt = cleaned.indexOf('<', i)
    if (lt === -1) { out += escapeText(decodeEntities(cleaned.slice(i))); break }
    if (lt > i) out += escapeText(decodeEntities(cleaned.slice(i, lt)))

    const gt = cleaned.indexOf('>', lt)
    if (gt === -1) { out += escapeText(decodeEntities(cleaned.slice(lt))); break }

    const raw = cleaned.slice(lt + 1, gt)
    i = gt + 1

    const closing = raw.startsWith('/')
    const body = closing ? raw.slice(1) : raw
    const name = (body.match(/^([a-zA-Z][a-zA-Z0-9]*)/)?.[1] || '').toLowerCase()

    // Not a tag at all, just prose that happens to contain angle brackets
    // ("a < b and c > d"). Emit it as literal text rather than swallowing the
    // words between the brackets.
    if (!name) { out += escapeText(decodeEntities(cleaned.slice(lt, gt + 1))); continue }

    // A real tag, but not one we allow: drop the tag, keep the text around it.
    if (!ALLOWED.has(name)) continue

    if (closing) {
      // Only close a tag we actually opened, and unwind anything still open
      // inside it, so the output can never be unbalanced.
      const at = open.lastIndexOf(name)
      if (at === -1) continue
      for (let k = open.length - 1; k >= at; k--) out += `</${open[k]}>`
      open.length = at
      continue
    }

    if (VOID.has(name)) { out += '<br />'; continue }

    if (name === 'a') {
      const href =
        body.match(/href\s*=\s*"([^"]*)"/i)?.[1] ??
        body.match(/href\s*=\s*'([^']*)'/i)?.[1] ??
        body.match(/href\s*=\s*([^\s"'>]+)/i)?.[1] ??
        ''
      const safe = safeHref(href)
      // Keep the link text, drop the unsafe anchor.
      if (!safe) continue
      const external = /^https?:\/\//i.test(safe)
      out += `<a href="${escapeAttr(safe)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>`
      open.push('a')
      continue
    }

    out += `<${name}>`
    open.push(name)
  }

  for (let k = open.length - 1; k >= 0; k--) out += `</${open[k]}>`
  return out
}

/**
 * Plain-text version of an inline HTML string — used for excerpts, schema,
 * heading anchors and anywhere else markup would be noise.
 */
export function stripInlineHtml(html: string | undefined | null): string {
  return decodeEntities(String(html ?? '').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim()
}

/** True when the string carries formatting worth storing alongside the text. */
export function hasMarkup(html: string | undefined | null): boolean {
  return /<[a-zA-Z]/.test(String(html ?? ''))
}
