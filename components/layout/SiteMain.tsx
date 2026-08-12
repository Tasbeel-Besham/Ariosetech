'use client'
import { usePathname } from 'next/navigation'
import AutoBreadcrumbs from '@/components/ui/AutoBreadcrumbs'

/**
 * The <main> wrapper.
 *
 * This exists only so the site layout can be a SERVER component. The layout
 * previously needed `usePathname` to decide whether to show breadcrumbs, which
 * forced the whole layout — Navbar included — to be client-side, which is why
 * the logo had to be fetched in the browser and flashed on every page load.
 *
 * Isolating the one piece that genuinely needs the pathname keeps that
 * behaviour identical while letting everything above it render on the server.
 */
export default function SiteMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  // No breadcrumb on the homepage — it would only point at itself.
  const hasBreadcrumbs = pathname !== '/'

  return (
    // The class tells the first section below to drop its own header
    // clearance — the breadcrumb bar is carrying it instead. Without that the
    // two offsets stack into ~200px of empty space. A class rather than an
    // adjacent-sibling selector because pages emit <script> tags for their
    // JSON-LD, which would sit between the bar and the section and break
    // `+` matching.
    <main className={hasBreadcrumbs ? 'with-breadcrumbs' : undefined}>
      {hasBreadcrumbs && <AutoBreadcrumbs />}
      {children}
    </main>
  )
}
