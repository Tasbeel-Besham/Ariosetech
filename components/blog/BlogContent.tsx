import Image from 'next/image'
import Link from 'next/link'
import type { BlogBlock } from '@/types'

/** Renders the rich block content of a blog post. */
export default function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="bp-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={i} className="bp-h2">{block.text}</h2>

          case 'h3':
            return <h3 key={i} className="bp-h3">{block.text}</h3>

          case 'p':
            return <p key={i} className="bp-p">{block.text}</p>

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
                <p className="bp-quote-text">{block.text}</p>
                {block.caption && <cite className="bp-quote-cite">— {block.caption}</cite>}
              </blockquote>
            )

          case 'list':
            return block.ordered ? (
              <ol key={i} className="bp-list bp-list-ordered">
                {(block.items || []).map((it, j) => <li key={j}>{it}</li>)}
              </ol>
            ) : (
              <ul key={i} className="bp-list">
                {(block.items || []).map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            )

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
                <p className="bp-callout-text">{block.text}</p>
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

          default:
            return null
        }
      })}
    </div>
  )
}
