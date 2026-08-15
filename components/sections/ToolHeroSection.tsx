'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Search } from '@/components/ui/Icons'

/**
 * A compact service-page hero with just a tool INPUT BAR on the right (not the
 * full tool). Submitting the bar sends the user to the dedicated tool page with
 * their URL as a query param, where the tool auto-runs and shows results. This
 * keeps the hero clean and short — no tall empty results area — while still
 * giving the visitor a one-field entry point to the relevant tool.
 */

const TOOLS: Record<string, { path: string; placeholder: string; button: string; hint: string }> = {
  'wordpress-theme-detector': {
    path: '/tools/wordpress-theme-detector',
    placeholder: 'Enter website URL (e.g. example.com)',
    button: 'Detect Theme',
    hint: 'Works on any public WordPress website',
  },
  'shopify-theme-detector': {
    path: '/tools/shopify-theme-detector',
    placeholder: 'Enter Shopify store URL (e.g. mystore.com)',
    button: 'Detect Theme',
    hint: 'Works on any public Shopify store',
  },
  'seo-audit': {
    path: '/tools/seo-audit',
    placeholder: 'Enter a website URL (e.g. example.com)',
    button: 'Run Free Audit',
    hint: 'Instant on-page SEO score — no signup',
  },
}

type Props = {
  /**
   * Heading level. Defaults to h2, NOT h1.
   *
   * This section hard-coded an <h1>. On /services/shopify it sits alongside a
   * hero-interactive section that also renders an h1 — two h1s on one page,
   * with the tool's headline competing against the page's real subject.
   * Defaulting to h2 means dropping this section onto an existing page can no
   * longer break the heading order; set it to h1 explicitly only on the
   * standalone /tools/* pages where this IS the page heading.
   */
  headingTag?: string
  eyebrow?: string
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaHref?: string
  tool?: string
  toolLabel?: string
}

export default function ToolHeroSection({
  headingTag = 'h2',
  eyebrow = 'Free Tool',
  // Platform-neutral by default.
  //
  // This used to default to "Powerful WordPress development for your business".
  // A section saved without an explicit headline therefore advertised WordPress
  // wherever it was dropped — which is exactly what happened on
  // /services/shopify, where this section renders above the real Shopify hero
  // and put WordPress copy in the page's opening heading. A default that names
  // one platform cannot be correct on a page about another; this one is safe
  // anywhere and still reads as a real headline if nobody overrides it.
  headline = 'See what your site is running — then see what it could be',
  subheadline = 'Run the free check below, then talk to us about what we would improve.',
  ctaLabel = 'Get a Free Quote',
  ctaHref = '/contact',
  tool = 'wordpress-theme-detector',
  toolLabel = 'Try it now — free, no signup',
}: Props) {
  const Heading = (headingTag || 'h2') as 'h1' | 'h2' | 'h3'
  const router = useRouter()
  const [url, setUrl] = useState('')
  const t = TOOLS[tool] || TOOLS['wordpress-theme-detector']

  const go = () => {
    const v = url.trim()
    if (!v) { router.push(t.path); return }
    // Send the URL to the tool page, where it auto-runs and shows results.
    router.push(`${t.path}?url=${encodeURIComponent(v)}`)
  }

  return (
    <section className="tool-hero">
      <div className="tool-hero-glow" aria-hidden="true" />
      <div className="container relative z-1">
        <div className="tool-hero-grid">
          {/* Left: message */}
          <div className="tool-hero-copy">
            {eyebrow && <div className="tool-hero-badge"><span>{eyebrow}</span></div>}
            <Heading className="tool-hero-title">{headline}</Heading>
            {subheadline && <p className="tool-hero-sub">{subheadline}</p>}
            {ctaLabel && (
              <Link href={ctaHref} className="btn btn-primary btn-lg tool-hero-cta">
                {ctaLabel} <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {/* Right: just the input bar (redirects to the tool page on submit) */}
          <div className="tool-hero-barwrap">
            {toolLabel && <p className="tool-hero-toollabel">{toolLabel}</p>}
            <div className="tool-hero-bar">
              <div className="tool-hero-bar-field">
                <Search size={16} className="tool-hero-bar-icon" />
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') go() }}
                  placeholder={t.placeholder}
                  className="tool-hero-bar-input"
                />
              </div>
              <button onClick={go} className="tool-hero-bar-btn">
                {t.button} <ArrowRight size={15} />
              </button>
            </div>
            <p className="tool-hero-bar-hint">{t.hint}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
