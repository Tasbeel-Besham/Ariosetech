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
  eyebrow?: string
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaHref?: string
  tool?: string
  toolLabel?: string
}

export default function ToolHeroSection({
  eyebrow = 'Free Tool',
  headline = 'Powerful WordPress development for your business',
  subheadline = 'Custom themes, speed, and security — built to grow. Check your current site, then let us show you what we would improve.',
  ctaLabel = 'Get a Free Quote',
  ctaHref = '/contact',
  tool = 'wordpress-theme-detector',
  toolLabel = 'Try it now — free, no signup',
}: Props) {
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
            <h1 className="tool-hero-title">{headline}</h1>
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
