'use client'

import { useEffect } from 'react'
import { useFooterCta, type FooterCta } from './FooterCtaContext'

/**
 * Drop this anywhere in a page to override the pre-footer CTA for that page.
 * Server pages can render it too (it's a client component). On unmount it
 * clears the override so the next page falls back to the global default.
 *
 *   <SetFooterCta headline="Ready to secure your store?" desc="…" primaryLabel="Get a Quote" primaryHref="/contact" />
 */
export default function SetFooterCta(props: FooterCta) {
  const { setCta } = useFooterCta()
  const { headline, desc, primaryLabel, primaryHref } = props
  useEffect(() => {
    setCta({ headline, desc, primaryLabel, primaryHref })
    return () => setCta(null)
  }, [headline, desc, primaryLabel, primaryHref, setCta])
  return null
}
