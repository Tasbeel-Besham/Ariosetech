'use client'
import { useState } from 'react'
import Link from 'next/link'
import CtaSection from '@/components/sections/CtaSection'
import { Search, Check, ExternalLink, AlertCircle, Loader } from '@/components/ui/Icons'

const F = { fontFamily:'var(--font-display)' } as const
const M = { fontFamily:'var(--font-mono)'    } as const

type WPResult = {
  isWordPress: boolean
  theme?: {
    name: string
    version?: string
    author?: string
    authorUrl?: string
    themeUrl?: string
    screenshot?: string
    description?: string
    isPremium?: boolean
  }
  plugins?: { name: string; slug?: string; version?: string }[]
  wpVersion?: string
  error?: string
}

export default function WordPressDetectorClient() {
  const [url, setUrl]         = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<WPResult | null>(null)
  const [error, setError]     = useState('')

  const detect = async () => {
    const input = url.trim()
    if (!input) return
    // Normalize URL
    const normalized = input.startsWith('http') ? input : `https://${input}`
    setLoading(true); setResult(null); setError('')
    try {
      const res = await fetch('/api/tools/detect-wordpress', {
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
        <div className="dt-hero-glow" />
        <div className="container flex flex-col items-center md:items-start text-center md:text-left relative z-1">
          <div className="dt-badge">
            <span className="dt-badge-text">Free Tool</span>
          </div>
          <h1 className="dt-title">
            WordPress Theme Detector
          </h1>
          <p className="dt-lede">
            Discover the WordPress theme and plugins powering any website — instantly and for free.
          </p>

          {/* Search bar */}
          <div className="flex flex-col md:flex-row w-full dt-input-row">
            <div className="flex flex-1 relative">
              <Search size={16} className="dt-search-icon" />
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && detect()}
                placeholder="Enter website URL (e.g. example.com)"
                className="dt-input"
                onFocus={e => (e.target.style.borderColor = 'rgba(var(--primary-rgb),0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <button onClick={detect} disabled={loading || !url.trim()} className="btn btn-primary btn-lg shrink-0">
              {loading ? <Loader size={16} /> : <Search size={15} />}
              {loading ? 'Detecting…' : 'Detect Theme'}
            </button>
          </div>
          <p className="text-center md:text-left dt-hint">
            Works on any publicly accessible WordPress website
          </p>
        </div>
      </section>

      {/* Result */}
      <section className="dt-results">
        <div className="container">

          {/* Error */}
          {error && (
            <div className="dt-error">
              <AlertCircle size={18} className="dt-error-icon" />
              <div>
                <p className="dt-error-title">Detection Failed</p>
                <p className="dt-error-desc">{error}</p>
              </div>
            </div>
          )}

          {/* Not WordPress */}
          {result && !result.isWordPress && !result.error && (
            <div className="dt-notfound">
              <AlertCircle size={36} className="dt-notfound-icon" />
              <p className="dt-notfound-title">Not a WordPress site</p>
              <p className="dt-error-desc-14">This website doesn&apos;t appear to be built with WordPress.</p>
            </div>
          )}

          {/* WordPress result */}
          {result?.isWordPress && (
            <div>
              {/* Confirmed badge */}
              <div className="dt-confirm">
                <Check size={13} className="text-green" />
                <span className="dt-confirm-text">WordPress Confirmed</span>
                {result.wpVersion && <span className="dt-version">v{result.wpVersion}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* Theme card */}
                {result.theme && (
                  <div className="dt-card">
                    <div className="dt-card-topline" />
                    <div className="p-24">
                      <p className="dt-card-label">Active Theme</p>

                      {result.theme.screenshot && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.theme.screenshot} alt={result.theme.name} className="dt-shot" />
                      )}

                      <h2 className="dt-theme-name">{result.theme.name}</h2>

                      {result.theme.isPremium && (
                        <span className="dt-pill dt-pill-amber">Premium</span>
                      )}

                      {result.theme.version && (
                        <p className="dt-meta mt-8">Version: {result.theme.version}</p>
                      )}
                      {result.theme.author && (
                        <p className="dt-meta mt-4">Author: {result.theme.author}</p>
                      )}
                      {result.theme.description && (
                        <p className="dt-theme-desc">{result.theme.description}</p>
                      )}
                      {result.theme.themeUrl && (
                        <a href={result.theme.themeUrl} target="_blank" rel="noopener noreferrer"
                          className="dt-theme-link">
                          View Theme <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Plugins */}
                {result.plugins && result.plugins.length > 0 && (
                  <div className="dt-card">
                    <div className="dt-card-topline" />
                    <div className="p-24">
                      <p className="dt-card-label">
                        Detected Plugins ({result.plugins.length})
                      </p>
                      <div className="dt-plugin-list">
                        {result.plugins.map((plugin, i) => (
                          <div key={i} className="dt-plugin">
                            <div className="dt-plugin-badge">
                              {plugin.name.charAt(0)}
                            </div>
                            <div className="dt-plugin-body">
                              <p className="dt-plugin-name">{plugin.name}</p>
                              {plugin.version && <p className="dt-version">v{plugin.version}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && !error && !loading && (
            <div className="dt-empty">
              <Search size={48} className="dt-empty-icon" />
              <p className="dt-empty-title">Enter a URL above to detect the theme</p>
              <p className="text-13">Works with any public WordPress website</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CtaSection
        eyebrow="Need a Custom WordPress Site?"
        headline={'We Build WordPress Sites\nThat Convert'}
        subheadline="Like a theme you found? We can build a custom WordPress site inspired by it — or better. Faster, safer, and fully yours."
        ctaLabel="Get Free Consultation"
        ctaHref="/contact"
        secondaryLabel="View Our Work"
        secondaryHref="/portfolio"
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </>
  )
}
