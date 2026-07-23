import Link from 'next/link'

export type Crumb = { name: string; url?: string }

/**
 * Visible breadcrumb trail.
 *
 * The site already emits BreadcrumbList schema, but Google's guidance is that
 * structured data should describe content that is actually visible on the page.
 * Breadcrumbs also give users an obvious way up the hierarchy and add internal
 * links from deep pages to their parents, which spreads crawl equity.
 *
 * The last crumb is the current page and is not linked.
 */
export default function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  if (!items || items.length < 2) return null
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs ${className}`.trim()}>
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${c.name}-${i}`}>
              {last || !c.url
                ? <span aria-current="page">{c.name}</span>
                : <Link href={c.url}>{c.name}</Link>}
              {!last && <span className="breadcrumbs-sep" aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
