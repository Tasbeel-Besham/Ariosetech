'use client'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'
import WordPressDetectorClient from '@/app/(site)/tools/wordpress-theme-detector/WordPressDetectorClient'
import ShopifyDetectorClient from '@/app/(site)/tools/shopify-theme-detector/ShopifyDetectorClient'
import SeoAuditClient from '@/components/tools/SeoAuditClient'

/**
 * A hero with a tool built directly into it. Left side carries the headline,
 * subtitle and CTA; right side carries the live tool widget. Designed for
 * service pages (WordPress / Shopify / SEO) so the visitor lands and can use
 * the relevant tool immediately — without the tall animated homepage hero
 * pushing the rest of the page down.
 */

const TOOLS: Record<string, { widget: React.ReactNode }> = {
  'wordpress-theme-detector': { widget: <WordPressDetectorClient compact /> },
  'shopify-theme-detector': { widget: <ShopifyDetectorClient compact /> },
  'seo-audit': { widget: <SeoAuditClient /> },
}

type Props = {
  eyebrow?: string
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaHref?: string
  tool?: string
  toolLabel?: string   // small caption above the tool widget
}

export default function ToolHeroSection({
  eyebrow = 'Free Tool',
  headline = 'Powerful WordPress development for your business',
  subheadline = 'Custom themes, speed, and security — built to grow. Check your current site below, then let us show you what we would improve.',
  ctaLabel = 'Get a Free Quote',
  ctaHref = '/contact',
  tool = 'wordpress-theme-detector',
  toolLabel = 'Try it now — free, no signup',
}: Props) {
  const t = TOOLS[tool]

  return (
    <section className="tool-hero">
      <div className="tool-hero-glow" aria-hidden="true" />
      <div className="container relative z-1">
        <div className="tool-hero-grid">
          {/* Left: message */}
          <div className="tool-hero-copy">
            {eyebrow && (
              <div className="tool-hero-badge"><span>{eyebrow}</span></div>
            )}
            <h1 className="tool-hero-title">{headline}</h1>
            {subheadline && <p className="tool-hero-sub">{subheadline}</p>}
            {ctaLabel && (
              <Link href={ctaHref} className="btn btn-primary btn-lg tool-hero-cta">
                {ctaLabel} <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {/* Right: the tool */}
          {t && (
            <div className="tool-hero-toolwrap">
              {toolLabel && <p className="tool-hero-toollabel">{toolLabel}</p>}
              <div className="tool-hero-tool">
                {t.widget}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
