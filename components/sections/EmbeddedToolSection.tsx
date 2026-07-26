'use client'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'
import SectionHeading from '@/components/ui/SectionHeading'
import WordPressDetectorClient from '@/app/(site)/tools/wordpress-theme-detector/WordPressDetectorClient'
import ShopifyDetectorClient from '@/app/(site)/tools/shopify-theme-detector/ShopifyDetectorClient'
import SeoAuditClient from '@/components/tools/SeoAuditClient'

/**
 * Embeds a free tool's interactive widget inside another page (e.g. a service
 * page). Only the widget is embedded — the full, SEO-optimised tool page stays
 * canonical at /tools/... so we don't create duplicate content. The section
 * links out to that full page, which also reinforces internal linking.
 *
 * Goals served: value-first (a working tool on the sales page), lead capture
 * (a warm research moment), and SEO (contextual internal links between a
 * service and its related tool).
 */

const TOOLS: Record<string, { label: string; href: string; widget: React.ReactNode }> = {
  'wordpress-theme-detector': {
    label: 'WordPress Theme Detector',
    href: '/tools/wordpress-theme-detector',
    widget: <WordPressDetectorClient />,
  },
  'shopify-theme-detector': {
    label: 'Shopify Theme Detector',
    href: '/tools/shopify-theme-detector',
    widget: <ShopifyDetectorClient />,
  },
  'seo-audit': {
    label: 'SEO Audit Tool',
    href: '/tools/seo-audit',
    widget: <SeoAuditClient />,
  },
}

type Props = {
  headingTag?: string
  eyebrow?: string
  headline?: string
  intro?: string
  tool?: string          // key into TOOLS
  showFullLink?: boolean
}

export default function EmbeddedToolSection({
  headingTag = 'h2',
  eyebrow = 'Free Tool',
  headline = 'Try it yourself',
  intro,
  tool = 'wordpress-theme-detector',
  showFullLink = true,
}: Props) {
  const t = TOOLS[tool]
  if (!t) return null

  return (
    <section className="section section--dark embed-tool">
      <div className="embed-tool-glow" aria-hidden="true" />
      <div className="container relative z-1">
        <div className="embed-tool-head">
          <p className="eyebrow">{eyebrow}</p>
          <SectionHeading as={headingTag} className="embed-tool-headline">{headline}</SectionHeading>
          {intro && <p className="embed-tool-intro">{intro}</p>}
        </div>

        <div className="embed-tool-widget">
          {t.widget}
        </div>

        {showFullLink && (
          <div className="embed-tool-foot">
            <Link href={t.href} className="embed-tool-link">
              Open the full {t.label} <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
