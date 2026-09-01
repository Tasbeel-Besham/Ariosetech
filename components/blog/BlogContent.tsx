import Image from 'next/image'
import Link from 'next/link'
import type { BlogBlock } from '@/types'
import { sanitizeInlineHtml } from '@/lib/blog/inline-html'

/**
 * Turn a heading's text into a stable URL-fragment id so the table of contents
 * (and deep links / shares) can jump to it. Kept in sync with the same helper
 * used by the TOC component so anchors always match.
 */
export function headingId(text: string): string {
  return String(text || '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Render a block's text, keeping inline formatting when the block carries any.
 *
 * `block.html` only exists when the author actually applied bold, italic, a
 * link or inline code, so unformatted posts take the plain-text path exactly as
 * they always did. The string was sanitised when the post was saved and is
 * sanitised again here — the render pass is what makes this safe regardless of
 * how the row got into the database.
 */
function Inline({ html, text }: { html?: string; text?: string }) {
  if (!html) return <>{text}</>
  return <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(html) }} />
}

/** Renders the rich block content of a blog post. */
export default function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="bp-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} id={headingId(block.text || '')} className="bp-h2 scroll-mt-[100px]">
                <Inline html={block.html} text={block.text} />
              </h2>
            )

          case 'h3':
            return (
              <h3 key={i} id={headingId(block.text || '')} className="bp-h3 scroll-mt-[100px]">
                <Inline html={block.html} text={block.text} />
              </h3>
            )

          case 'p':
            return <p key={i} className="bp-p"><Inline html={block.html} text={block.text} /></p>

          case 'image':
            return block.url ? (
              <figure key={i} className="bp-figure">
                <div className="bp-figure-media">
                  <Image src={block.url} alt={block.caption || ''} fill className="object-cover" sizes="(max-width: 760px) 100vw, 760px" />
                </div>
                {block.caption && <figcaption className="bp-figcaption">{block.caption}</figcaption>}
              </figure>
            ) : null

          case 'quote':
            return (
              <blockquote key={i} className="bp-quote">
                <p className="bp-quote-text"><Inline html={block.html} text={block.text} /></p>
                {block.caption && <cite className="bp-quote-cite">— {block.caption}</cite>}
              </blockquote>
            )

          case 'list': {
            const items = (block.items || []).map((it, j) => (
              <li key={j}><Inline html={block.itemsHtml?.[j]} text={it} /></li>
            ))
            return block.ordered ? (
              <ol key={i} className="bp-list bp-list-ordered">{items}</ol>
            ) : (
              <ul key={i} className="bp-list">{items}</ul>
            )
          }

          case 'code':
            return (
              <pre key={i} className="bp-code">
                {block.lang && <span className="bp-code-lang">{block.lang}</span>}
                <code>{block.text}</code>
              </pre>
            )

          case 'callout':
            return (
              <div key={i} className="bp-callout">
                <div className="bp-callout-bar" />
                <p className="bp-callout-text"><Inline html={block.html} text={block.text} /></p>
              </div>
            )

          case 'divider':
            return <hr key={i} className="bp-divider" />

          case 'button':
            return block.url ? (
              <div key={i} className="bp-btn-wrap">
                <Link href={block.url} className="btn btn-primary btn-lg">{block.text || 'Learn more'}</Link>
              </div>
            ) : null

          /**
           * Call to action — a headline, a supporting line and a button in one
           * boxed unit. The plain `button` block above is just a link; this is
           * the mid-article conversion block, so it carries its own framing and
           * does not depend on the surrounding copy to make the offer.
           */
          case 'cta':
            return (
              <aside key={i} className="bp-ctablock">
                <div className="bp-ctablock-body">
                  {block.text && <p className="bp-ctablock-title">{block.text}</p>}
                  {/* Plain text on purpose: a CTA's headline and supporting
                      line are typed into simple fields, so there is no inline
                      markup to carry — and `html` here would belong to `text`,
                      not to `caption`. */}
                  {block.caption && <p className="bp-ctablock-text">{block.caption}</p>}
                </div>
                {block.url && (
                  <Link href={block.url} className="btn btn-primary btn-lg bp-ctablock-btn">
                    {block.label || 'Get started'}
                  </Link>
                )}
              </aside>
            )

          /**
           * Tables come from pasted Google Docs content and from the grid
           * editor. Wrapped in an overflow container so a wide comparison table
           * scrolls inside its own box instead of forcing the whole article to
           * scroll sideways on a phone.
           */
          case 'table': {
            const rows = block.rows || []
            if (!rows.length) return null
            const hasHeader = block.hasHeader !== false
            const body = hasHeader ? rows.slice(1) : rows
            const width = Math.max(...rows.map(r => r.length), 1)
            const cells = (row: string[], r: number) =>
              Array.from({ length: width }, (_, c) => ({ text: row[c] ?? '', html: block.rowsHtml?.[r]?.[c] }))

            return (
              <div key={i} className="bp-table-wrap">
                <table className="bp-table">
                  {hasHeader && (
                    <thead>
                      <tr>
                        {cells(rows[0], 0).map((cell, c) => (
                          <th key={c} scope="col"><Inline html={cell.html} text={cell.text} /></th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {body.map((row, r) => (
                      <tr key={r}>
                        {cells(row, hasHeader ? r + 1 : r).map((cell, c) => (
                          <td key={c}><Inline html={cell.html} text={cell.text} /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }

          default:
            return null
        }
      })}
    </div>
  )
}
