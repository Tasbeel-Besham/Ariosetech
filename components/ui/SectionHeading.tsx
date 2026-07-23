import type { ReactNode } from 'react'

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/**
 * Renders a section headline with a configurable HTML heading level while
 * keeping the visual styling identical.
 *
 * Why this exists: heading tags carry SEO meaning (document outline), but the
 * right level depends on where a section sits on the page — a section nested
 * under another should be h3, not h2. Hardcoding <h2> everywhere produces an
 * invalid outline on pages that stack sections. This lets an editor set the
 * level per section from the page builder without changing how it looks.
 *
 * Default stays "h2", which is correct for a top-level section beneath the
 * page's single h1.
 */
export default function SectionHeading({
  as = 'h2',
  className,
  style,
  children,
  id,
}: {
  as?: HeadingLevel | string
  className?: string
  style?: React.CSSProperties
  children: ReactNode
  id?: string
}) {
  const valid: HeadingLevel[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  const Tag = (valid.includes(as as HeadingLevel) ? as : 'h2') as HeadingLevel
  return <Tag id={id} className={className} style={style}>{children}</Tag>
}
