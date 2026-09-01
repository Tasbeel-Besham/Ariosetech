import type { BlogBlock } from '@/types'

/**
 * Normalise pasted HTML before TipTap parses it.
 *
 * Google Docs (and Word) don't paste semantic tags — a heading arrives as
 * <p style="font-weight:700;font-size:20pt"> and bold text as
 * <span style="font-weight:700">. Without this, everything lands as plain
 * paragraphs and you'd re-format the whole article by hand.
 *
 * We rewrite those styled elements into real <h2>/<h3>/<strong>/<em> tags and
 * lift tables out into custom-block payloads, then let TipTap's normal parser
 * take over.
 *
 * Browser-only: it needs DOMParser, and it is called from the editor's paste
 * handler, which never runs on the server.
 */
export function transformPastedHTML(html: string): string {
  if (!html) return html
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')

    // Google Docs wraps everything in <b id="docs-internal-guid-…"> with
    // no semantic meaning — unwrap it so its children are read directly.
    doc.querySelectorAll('b[id^="docs-internal-guid"]').forEach(b => {
      const parent = b.parentNode
      if (!parent) return
      while (b.firstChild) parent.insertBefore(b.firstChild, b)
      parent.removeChild(b)
    })

    const fontSize = (el: Element): number => {
      const s = el.getAttribute('style') || ''
      const m = s.match(/font-size:\s*([\d.]+)\s*(pt|px)/i)
      if (!m) return 0
      const v = parseFloat(m[1])
      return m[2].toLowerCase() === 'px' ? v * 0.75 : v // px → pt
    }
    const isBoldish = (el: Element): boolean => {
      const s = el.getAttribute('style') || ''
      const m = s.match(/font-weight:\s*(\d{3}|bold)/i)
      if (!m) return false
      return m[1].toLowerCase() === 'bold' || parseInt(m[1], 10) >= 600
    }

    /* Order matters here, and getting it wrong is what mangled the
       pasted pricing tables: spans first so cell contents become real
       <strong>/<em>, then tables so their cells are lifted out of the
       document, and only then the heading heuristic — which would
       otherwise see a bold <p> inside a <th> and promote it to an <h3>,
       scattering the table across the article as loose headings. */

    // Inline styled spans → real <strong>/<em> so marks survive.
    doc.querySelectorAll('span').forEach(sp => {
      const style = sp.getAttribute('style') || ''
      const bold = isBoldish(sp)
      const italic = /font-style:\s*italic/i.test(style)
      if (!bold && !italic) return
      let node: globalThis.Node = doc.createTextNode(sp.textContent || '')
      if (italic) { const em = doc.createElement('em'); em.appendChild(node); node = em }
      if (bold)   { const st = doc.createElement('strong'); st.appendChild(node); node = st }
      sp.replaceWith(node as ChildNode)
    })

    /* Tables.
       Without this a pasted table is destroyed: the parser has no table
       node, so every <th> becomes a heading and every <td> becomes its
       own paragraph, leaving the cells strewn down the page in row order.
       Convert each one into a custom-block payload the editor understands
       before that can happen. Nested tables are handled innermost-first
       so an outer layout table cannot swallow a real one. */
    const tables = Array.from(doc.querySelectorAll('table')).reverse()
    tables.forEach(table => {
      const rowEls = Array.from(table.querySelectorAll('tr'))
      if (!rowEls.length) return
      const rows: string[][] = []
      const rowsHtml: string[][] = []
      let headerFromMarkup = false
      rowEls.forEach((tr, rowIndex) => {
  const cells = Array.from(tr.children).filter(c => /^(td|th)$/i.test(c.tagName))
  if (!cells.length) return
  if (rowIndex === 0 && cells.some(c => c.tagName.toLowerCase() === 'th')) headerFromMarkup = true
  rows.push(cells.map(c => (c.textContent || '').replace(/\s+/g, ' ').trim()))
  rowsHtml.push(cells.map(c => (c.innerHTML || '').trim()))
      })
      if (!rows.length) return
      const width = Math.max(...rows.map(r => r.length))
      const pad = (r: string[]) => { while (r.length < width) r.push(''); return r }
      const payload: BlogBlock = {
  type: 'table',
  rows: rows.map(pad),
  rowsHtml: rowsHtml.map(pad),
  // Google Docs often emits a plain <td> header row rather than <th>,
  // so fall back to treating the first row as the header — that is
  // what it looks like in the document the author copied from.
  hasHeader: headerFromMarkup || rows.length > 1,
      }
      const holder = doc.createElement('div')
      holder.setAttribute('data-custom-block', '')
      holder.setAttribute('data-payload', JSON.stringify(payload))
      table.replaceWith(holder)
    })

    // Paragraphs that are visually headings → real heading tags.
    doc.querySelectorAll('p').forEach(p => {
      const size = fontSize(p)
      const inner = p.querySelector('span, b, strong')
      const size2 = inner ? fontSize(inner) : 0
      const s = Math.max(size, size2)
      const bold = isBoldish(p) || (inner ? isBoldish(inner) : false)
      const text = (p.textContent || '').trim()
      if (!text) return
      // Heading heuristics: large text, or bold + short line.
      let tag: string | null = null
      if (s >= 18) tag = 'h2'
      else if (s >= 14 && bold) tag = 'h3'
      else if (bold && text.length < 90 && !/[.!?]$/.test(text)) tag = 'h3'
      if (tag) {
  const h = doc.createElement(tag)
  h.textContent = text
  p.replaceWith(h)
      }
    })

    // Strip Google's styling wrappers and empty paragraphs.
    doc.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))
    doc.querySelectorAll('p').forEach(p => { if (!(p.textContent || '').trim() && !p.querySelector('img')) p.remove() })

    return doc.body.innerHTML
  } catch {
    return html
  }
}
