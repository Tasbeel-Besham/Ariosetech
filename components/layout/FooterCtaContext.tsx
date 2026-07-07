'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type FooterCta = {
  headline?: string
  desc?: string
  primaryLabel?: string
  primaryHref?: string
}

type Ctx = {
  cta: FooterCta | null
  setCta: (cta: FooterCta | null) => void
}

const FooterCtaContext = createContext<Ctx>({ cta: null, setCta: () => {} })

export function FooterCtaProvider({ children }: { children: ReactNode }) {
  const [cta, setCtaState] = useState<FooterCta | null>(null)
  const setCta = useCallback((next: FooterCta | null) => setCtaState(next), [])
  return (
    <FooterCtaContext.Provider value={{ cta, setCta }}>
      {children}
    </FooterCtaContext.Provider>
  )
}

/** Read the current per-page CTA override (null if the page didn't set one). */
export function useFooterCta() {
  return useContext(FooterCtaContext)
}
