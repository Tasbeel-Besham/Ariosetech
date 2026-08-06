'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { trailFor } from '@/lib/breadcrumb-labels'

/**
 * Site-wide breadcrumb trail.
 *
 * Rendered once from the site layout rather than added page by page. The old
 * approach only ever reached two routes — the catch-all and case studies — so
 * /about, /contact, /blog, /faq, /portfolio/[category], /author/* and the three
 * /tools pages had no breadcrumbs at all, and any new page would have started
 * out missing them too.
 *
 * Derived from the pathname, so it can never fall out of sync with the URL.
 * Labels come from lib/breadcrumb-labels.ts, which the BreadcrumbList schema
 * also uses — Google expects structured data to match visible content.
 *
 * Returns null on the homepage, where a breadcrumb would only point at itself.
 */
export default function AutoBreadcrumbs() {
  const pathname = usePathname() || '/'
  if (pathname === '/') return null

  const trail = trailFor(pathname)
  if (trail.length < 2) return null

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-bar">
      <ol className="bc-list">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1
          return (
            <li key={`${crumb.name}-${i}`} className="bc-item">
              {i === 0 ? (
                <Link href="/" className="bc-link bc-home" aria-label="Home">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                       strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5 9.5V21h14V9.5" />
                  </svg>
                  <span className="bc-home-text">Home</span>
                </Link>
              ) : last || !crumb.href ? (
                <span className="bc-current" aria-current="page">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="bc-link">{crumb.name}</Link>
              )}
              {!last && <span className="bc-sep" aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
