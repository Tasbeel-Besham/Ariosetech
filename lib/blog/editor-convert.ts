import type { BlogBlock } from '@/types'
import { sanitizeInlineHtml, stripInlineHtml, hasMarkup } from '@/lib/blog/inline-html'

/**
 * Bridges the rich-text editor (TipTap/ProseMirror JSON) and the block array
 * that blog posts are stored in and that BlogContent renders.
 *
 * Why a converter instead of switching storage to HTML: all existing posts are
 * stored as blocks, the renderer reads blocks, and the JSON is also what feeds
 * schema and excerpts. Keeping that contract means the editor stays a drop-in
 * change with zero migration and no risk to published content.
 *
 * Inline marks used to be flattened to plain text here, which quietly threw
 * away every bold run, italic and link — so anything typed in HTML mode or
 * pasted with formatting looked right in the editor and then lost its markup
 * the moment it was saved. Marks now survive as a sanitised `html` string
 * alongside the plain `text`, and `text` stays authoritative for excerpts,
 * schema and heading anchors.
 */

type PMMark = { type: string; attrs?: Record<string, unknown> }

type PMNode = {
  type: string
  content?: PMNode[]
  text?: string
  marks?: PMMark[]
  attrs?: Record<string, unknown>
}

/** Flatten a ProseMirror node's inline children to plain text. */
function textOf(node?: PMNode): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (node.type === 'hardBreak') return ' '
  if (!node.content) return ''
  return node.content.map(textOf).join('')
}

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * ProseMirror marks, innermost last, so the wrapping order is stable and the
 * output round-trips back to the same marks when reloaded.
 */
const MARK_TAG: Record<string, string> = {
  bold: 'strong',
  italic: 'em',
  underline: 'u',
  strike: 's',
  code: 'code',
}

/** Render a node's inline children as sanitised HTML, preserving marks. */
function htmlOf(node?: PMNode): string {
  if (!node) return ''
  if (node.type === 'hardBreak') return '<br />'
  if (node.type === 'text') {
    let out = escapeText(node.text || '')
    // Apply in reverse so the first mark in the list ends up outermost.
    for (const mark of [...(node.marks || [])].reverse()) {
      if (mark.type === 'link') {
        const href = String(mark.attrs?.href || '')
        if (href) out = `<a href="${href.replace(/"/g, '&quot;')}">${out}</a>`
        continue
      }
      const tag = MARK_TAG[mark.type]
      if (tag) out = `<${tag}>${out}</${tag}>`
    }
    return out
  }
  if (!node.content) return ''
  return node.content.map(htmlOf).join('')
}

/**
 * Build the { text, html } pair for a block.
 *
 * `html` is omitted entirely when the content is unformatted, which keeps
 * plain posts byte-identical to how they were stored before and avoids
 * doubling the size of every paragraph for nothing.
 */
function inlineOf(node: PMNode | PMNode[]): { text: string; html?: string } {
  const nodes = Array.isArray(node) ? node : [node]
  const rawHtml = nodes.map(htmlOf).join(' ').trim()
  const html = sanitizeInlineHtml(rawHtml)
  const text = nodes.map(textOf).join(' ').replace(/\s+/g, ' ').trim()
  if (!hasMarkup(html)) return { text }
  return { text: stripInlineHtml(html) || text, html }
}

/** TipTap document JSON -> blog block array (what we save). */
export function docToBlocks(doc: PMNode | null | undefined): BlogBlock[] {
  const out: BlogBlock[] = []
  if (!doc?.content) return out

  for (const node of doc.content) {
    switch (node.type) {
      case 'heading': {
        const level = Number(node.attrs?.level) || 2
        const { text, html } = inlineOf(node)
        if (!text) break
        // Renderer supports h2/h3; map anything deeper to h3.
        out.push({ type: level <= 2 ? 'h2' : 'h3', text, ...(html ? { html } : {}) } as BlogBlock)
        break
      }
      case 'paragraph': {
        const { text, html } = inlineOf(node)
        if (text) out.push({ type: 'p', text, ...(html ? { html } : {}) } as BlogBlock)
        break
      }
      case 'bulletList':
      case 'orderedList': {
        const entries = (node.content || []).map(li => inlineOf(li)).filter(e => e.text)
        if (entries.length) {
          const block: BlogBlock = {
            type: 'list',
            ordered: node.type === 'orderedList',
            items: entries.map(e => e.text),
          }
          // Only carry per-item markup when at least one item actually has any.
          if (entries.some(e => e.html)) {
            block.itemsHtml = entries.map((e, i) => e.html || escapeText(block.items![i]))
          }
          out.push(block)
        }
        break
      }
      case 'blockquote': {
        const { text, html } = inlineOf(node.content || [])
        if (text) out.push({ type: 'quote', text, ...(html ? { html } : {}) } as BlogBlock)
        break
      }
      case 'codeBlock': {
        // Code is deliberately plain: markup inside a code sample is content,
        // not formatting, and must render literally.
        const text = textOf(node)
        if (text.trim()) {
          out.push({ type: 'code', text, lang: (node.attrs?.language as string) || undefined } as BlogBlock)
        }
        break
      }
      case 'horizontalRule':
        out.push({ type: 'divider' } as BlogBlock)
        break
      case 'image': {
        const url = node.attrs?.src as string | undefined
        if (url) {
          out.push({ type: 'image', url, caption: (node.attrs?.alt as string) || undefined } as BlogBlock)
        }
        break
      }
      // Custom blocks stored as a node with a data payload (callout, button, cta).
      case 'customBlock': {
        const data = node.attrs?.data as BlogBlock | undefined
        if (data && data.type) out.push(data)
        break
      }
      default:
        break
    }
  }
  return out
}

/**
 * Inline HTML string -> ProseMirror inline nodes.
 *
 * Runs in the browser only (the editor is a client component), so DOMParser is
 * available; on the server it falls back to a single plain-text node, which is
 * exactly what the old behaviour produced.
 */
function inlineToPM(html: string | undefined, fallback: string): PMNode[] {
  const plain = (t: string): PMNode[] => (t ? [{ type: 'text', text: t }] : [])
  if (!html || typeof DOMParser === 'undefined') return plain(fallback)

  try {
    const doc = new DOMParser().parseFromString(sanitizeInlineHtml(html), 'text/html')
    const nodes: PMNode[] = []

    const walk = (el: globalThis.Node, marks: PMMark[]) => {
      for (const child of Array.from(el.childNodes)) {
        if (child.nodeType === 3) {
          const text = child.textContent || ''
          if (text) nodes.push({ type: 'text', text, ...(marks.length ? { marks: [...marks] } : {}) })
          continue
        }
        if (child.nodeType !== 1) continue
        const tag = (child as Element).tagName.toLowerCase()
        if (tag === 'br') { nodes.push({ type: 'hardBreak' }); continue }

        const next = [...marks]
        if (tag === 'a') {
          const href = (child as Element).getAttribute('href') || ''
          if (href) next.push({ type: 'link', attrs: { href } })
        } else {
          const markType = Object.keys(MARK_TAG).find(k => MARK_TAG[k] === tag)
          if (markType) next.push({ type: markType })
        }
        walk(child, next)
      }
    }

    walk(doc.body, [])
    return nodes.length ? nodes : plain(fallback)
  } catch {
    return plain(fallback)
  }
}

/** Blog block array -> TipTap document JSON (what we load into the editor). */
export function blocksToDoc(blocks: BlogBlock[] | undefined): PMNode {
  const content: PMNode[] = []
  for (const b of blocks || []) {
    switch (b.type) {
      case 'h2':
      case 'h3':
        content.push({
          type: 'heading',
          attrs: { level: b.type === 'h2' ? 2 : 3 },
          content: inlineToPM(b.html, b.text || ''),
        })
        break
      case 'p':
        content.push({ type: 'paragraph', content: inlineToPM(b.html, b.text || '') })
        break
      case 'list':
        content.push({
          type: b.ordered ? 'orderedList' : 'bulletList',
          content: (b.items || []).map((it, i) => ({
            type: 'listItem',
            content: [{ type: 'paragraph', content: inlineToPM(b.itemsHtml?.[i], it) }],
          })),
        })
        break
      case 'quote':
        content.push({
          type: 'blockquote',
          content: [{ type: 'paragraph', content: inlineToPM(b.html, b.text || '') }],
        })
        break
      case 'code':
        content.push({
          type: 'codeBlock',
          attrs: { language: b.lang || null },
          content: b.text ? [{ type: 'text', text: b.text }] : [],
        })
        break
      case 'divider':
        content.push({ type: 'horizontalRule' })
        break
      case 'image':
        if (b.url) content.push({ type: 'image', attrs: { src: b.url, alt: b.caption || '' } })
        break
      // callout / button / cta round-trip through a custom node so they survive edits
      case 'callout':
      case 'button':
      case 'cta':
      case 'table':
        content.push({ type: 'customBlock', attrs: { data: b } })
        break
      default:
        break
    }
  }
  if (content.length === 0) content.push({ type: 'paragraph' })
  return { type: 'doc', content }
}

/**
 * Clean every stored string on a set of blocks.
 *
 * Called by the blog API before anything is written, so the database only ever
 * holds markup that has already passed the allowlist — the renderer sanitises
 * again, but nothing unsafe should reach it in the first place.
 */
export function sanitizeBlocks(blocks: BlogBlock[] | undefined): BlogBlock[] {
  return (blocks || []).map(b => {
    const out: BlogBlock = { ...b }

    if (out.html) {
      const html = sanitizeInlineHtml(out.html)
      // `html` is the richer source of truth, so `text` is always re-derived
      // from it — including when sanitising removed the markup entirely. A
      // stripped `<a href="javascript:…">Click here</a>` still leaves the words
      // "Click here", and keeping a stale `text` would silently drop them.
      out.text = stripInlineHtml(html) || out.text
      if (hasMarkup(html)) out.html = html
      else delete out.html
    }

    if (out.itemsHtml) {
      const cleaned = out.itemsHtml.map(h => sanitizeInlineHtml(h))
      out.items = cleaned.map((h, i) => stripInlineHtml(h) || out.items?.[i] || '')
      if (cleaned.some(hasMarkup)) out.itemsHtml = cleaned
      else delete out.itemsHtml
    }

    if (out.rowsHtml) {
      const cleaned = out.rowsHtml.map(row => row.map(c => sanitizeInlineHtml(c)))
      out.rows = cleaned.map((row, r) => row.map((c, i) => stripInlineHtml(c) || out.rows?.[r]?.[i] || ''))
      if (cleaned.some(row => row.some(hasMarkup))) out.rowsHtml = cleaned
      else delete out.rowsHtml
    }

    // Square off any ragged rows so the renderer never has to guess. A pasted
    // table with a merged cell arrives short a column; padding here means the
    // stored shape is always a clean rectangle.
    if (out.rows?.length) {
      const width = Math.max(...out.rows.map(r => r.length), 1)
      const pad = (row: string[]) => { const c = [...row]; while (c.length < width) c.push(''); return c }
      out.rows = out.rows.map(pad)
      if (out.rowsHtml) out.rowsHtml = out.rowsHtml.map(pad)
    }

    return out
  })
}
