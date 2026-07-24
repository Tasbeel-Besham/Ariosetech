'use client'
import { useEffect, useState } from 'react'
import type { BlogBlock } from '@/types'
import { headingId } from './BlogContent'

type Heading = { id: string; text: string; level: 2 | 3 }

/**
 * Table of contents built from the post's h2/h3 blocks.
 *
 * Auto-generated from content (no manual upkeep), links to the anchor ids that
 * BlogContent assigns to each heading, and highlights the section currently in
 * view as the reader scrolls. Renders nothing if a post has fewer than two
 * headings, since a TOC adds no value there.
 */
export default function TableOfContents({ blocks }: { blocks: BlogBlock[] }) {
  const headings: Heading[] = (blocks || [])
    .filter(b => (b.type === 'h2' || b.type === 'h3') && (b.text || '').trim())
    .map(b => ({ id: headingId(b.text || ''), text: b.text || '', level: b.type === 'h2' ? 2 : 3 }))

  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return
    const els = headings
      .map(h => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el)

    const observer = new IntersectionObserver(
      entries => {
        // Pick the topmost heading currently intersecting the upper part of the
        // viewport as the "active" one.
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-90px 0px -70% 0px', threshold: 0 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headings.map(h => h.id).join('|')])

  if (headings.length < 2) return null

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' })
      history.replaceState(null, '', `#${id}`)
    }
  }

  return (
    <nav className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc-title">On this page</p>
      <ul>
        {headings.map(h => (
          <li key={h.id} className={h.level === 3 ? 'blog-toc-sub' : ''}>
            <a
              href={`#${h.id}`}
              onClick={e => jump(e, h.id)}
              className={active === h.id ? 'is-active' : ''}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
