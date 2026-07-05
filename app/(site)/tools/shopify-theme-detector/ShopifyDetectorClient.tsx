'use client'
import { useState } from 'react'
import Link from 'next/link'
import CtaSection from '@/components/sections/CtaSection'

const F = { fontFamily:'var(--font-display)' } as const
const M = { fontFamily:'var(--font-mono)'    } as const

/* ── Inline SVGs ── */
const SearchSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)
const ArrowRight = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const Check = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ExternalLink = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)
const AlertCircle = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const Loader2 = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="anim-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
)
const ShoppingBag = ({ size = 15, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

type ShopifyResult = {
  isShopify: boolean
  theme?: {
    name: string
    id?: number
    version?: string
    themeStore?: boolean
    themeUrl?: string
    screenshot?: string
    author?: string
    isPremium?: boolean
    price?: string
  }
  shop?: {
    name?: string
    domain?: string
    currency?: string
    country?: string
    platform?: string
  }
  apps?: { name: string }[]
  error?: string
}

export default function ShopifyDetectorClient() {
  const [url, setUrl]         = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<ShopifyResult | null>(null)
  const [error, setError]     = useState('')

  const detect = async () => {
    const input = url.trim()
    if (!input) return
    const normalized = input.startsWith('http') ? input : `https://${input}`
    setLoading(true); setResult(null); setError('')
    try {
      const res = await fetch('/api/tools/detect-shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Detection failed')
      else setResult(data)
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
      {/* Hero */}
      <section className="dt-hero">
        <div className="dt-hero-glow dt-hero-glow-soft" />
        <div className="container flex flex-col items-center md:items-start text-center md:text-left relative z-1">
          <div className="dt-badge dt-badge-soft">
            <span className="dt-badge-text">Free Tool</span>
          </div>
          <h1 className="dt-title">
            Shopify Theme Detector
          </h1>
          <p className="dt-lede">
            Instantly find the Shopify theme powering any online store — free, fast, and accurate.
          </p>

          {/* Search */}
          <div className="flex flex-col md:flex-row w-full dt-input-row">
            <div className="flex flex-1 relative">
              <span className="dt-search-icon flex">
                <SearchSVG />
              </span>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && detect()}
                placeholder="Enter Shopify store URL (e.g. mystore.com)"
                className="dt-input"
                onFocus={e => (e.target.style.borderColor = 'rgba(var(--primary-rgb),0.4)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <button onClick={detect} disabled={loading || !url.trim()} className="btn btn-primary btn-lg shrink-0">
              {loading ? <Loader2 size={16} /> : <ShoppingBag size={15} />}
              {loading ? 'Detecting…' : 'Detect Theme'}
            </button>
          </div>
          <p className="text-center md:text-left dt-hint">Works on any public Shopify store</p>
        </div>
      </section>

      {/* Result */}
      <section className="dt-results">
        <div className="container">

          {error && (
            <div className="dt-error">
              <AlertCircle size={18} className="dt-error-icon" />
              <div>
                <p className="dt-error-title">Detection Failed</p>
                <p className="dt-error-desc">{error}</p>
              </div>
            </div>
          )}

          {result && !result.isShopify && (
            <div className="dt-notfound">
              <AlertCircle size={36} className="dt-notfound-icon" />
              <p className="dt-notfound-title">Not a Shopify store</p>
              <p className="dt-error-desc-14">This website doesn&apos;t appear to be powered by Shopify.</p>
            </div>
          )}

          {result?.isShopify && (
            <div>
              <div className="dt-confirm dt-confirm-primary">
                <span className="text-primary flex"><Check size={13} /></span>
                <span className="dt-confirm-text-primary">Shopify Store Confirmed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* Theme */}
                {result.theme && (
                  <div className="dt-card">
                    <div className="dt-card-topline" />
                    <div className="p-24">
                      <p className="dt-card-label">Active Theme</p>

                      {result.theme.screenshot && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.theme.screenshot} alt={result.theme.name} className="dt-shot" />
                      )}

                      <h2 className="dt-theme-name mb-8">{result.theme.name}</h2>

                      <div className="flex gap-8 flex-wrap mb-12">
                        {result.theme.isPremium && (
                          <span className="dt-pill dt-pill-amber">Premium</span>
                        )}
                        {result.theme.themeStore && (
                          <span className="dt-pill dt-pill-primary">Shopify Theme Store</span>
                        )}
                      </div>

                      {result.theme.author    && <p className="dt-meta mb-4">Author: {result.theme.author}</p>}
                      {result.theme.version   && <p className="dt-meta mb-4">Version: {result.theme.version}</p>}
                      {result.theme.price     && <p className="dt-meta mb-4">Price: {result.theme.price}</p>}

                      {result.theme.themeUrl && (
                        <a href={result.theme.themeUrl} target="_blank" rel="noopener noreferrer"
                          className="dt-theme-link">
                          View in Theme Store <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Store info */}
                {result.shop && (
                  <div className="dt-card">
                    <div className="dt-card-topline" />
                    <div className="p-24">
                      <p className="dt-card-label">Store Information</p>
                      <div className="flex flex-col gap-12">
                        {[
                          { label:'Store Name',   value:result.shop.name },
                          { label:'Domain',       value:result.shop.domain },
                          { label:'Currency',     value:result.shop.currency },
                          { label:'Country',      value:result.shop.country },
                          { label:'Platform',     value:result.shop.platform },
                        ].filter(r => r.value).map(({ label, value }) => (
                          <div key={label} className="dt-info-row">
                            <span className="dt-info-label">{label}</span>
                            <span className="dt-info-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!result && !error && !loading && (
            <div className="dt-empty">
              <ShoppingBag size={48} className="dt-empty-icon" />
              <p className="dt-empty-title">Enter a Shopify store URL above</p>
              <p className="text-13">We&apos;ll detect the theme and store details instantly</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CtaSection
        eyebrow="Need a Custom Shopify Store?"
        headline={'We Build Shopify Stores\nThat Scale'}
        subheadline="Like a theme you found? We can build a custom Shopify store inspired by it — or even better. Built to convert and grow with you."
        ctaLabel="Get Free Shopify Consultation"
        ctaHref="/contact"
        secondaryLabel="View Our Work"
        secondaryHref="/portfolio"
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </>
  )
}
