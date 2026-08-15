'use client'
import { initRegistry } from '@/lib/builder/registry-init'
import { sectionRegistry } from '@/lib/builder/registry'
import FallbackSection from '@/components/sections/FallbackSection'
import type { SectionInstance } from '@/types'
import { motion } from 'framer-motion'

initRegistry()

/**
 * Renders a builder page's sections.
 *
 * NOTE ON STRUCTURED DATA — deliberately none here.
 *
 * This component used to emit <SchemaMarkup type="Service" faqs={...} /> for
 * every page it rendered. That produced two problems on the live site:
 *
 *   1. DUPLICATES. The route files that render this component
 *      (app/(site)/[...slug]/page.tsx and app/(site)/page.tsx) already emit
 *      Service and FAQPage schema built from the same sections. Every
 *      /services/* URL therefore shipped TWO Service nodes and TWO FAQPage
 *      nodes describing the same thing.
 *
 *   2. UNSUPPORTED CLAIMS. It hardcoded type="Service", so every non-service
 *      builder page — the homepage, /portfolio, /industries/* — claimed to be
 *      a commercial Service offering named after the page. Google's guidance
 *      is that markup must describe what is visibly on the page.
 *
 * Schema now lives in the route files, which know what the page actually is.
 * The `pageName` / `pageUrl` props are kept so existing call sites still
 * type-check; they are no longer used for markup.
 */
export function BuilderRenderer(props: {
  sections: SectionInstance[]
  /** Accepted for call-site compatibility; no longer used for markup. */
  pageName?: string
  /** Accepted for call-site compatibility; no longer used for markup. */
  pageUrl?: string
}) {
  const visible = props.sections.filter(s => !s.meta?.hidden)

  return (
    <div>
      {visible.map((section, index) => {
        const def = sectionRegistry[section.type]
        if (!def) return <FallbackSection key={section.id} type={section.type} />
        const Component = def.component

        if (section.type === 'approach') {
          return (
            <div key={section.id} id={(section.props?.anchor as string) || undefined} style={{ scrollMarginTop: '90px' }}>
              <Component {...section.props} />
            </div>
          )
        }

        return (
          <motion.div
            key={section.id}
            id={(section.props?.anchor as string) || undefined}
            style={{ scrollMarginTop: '90px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.6,
              delay: Math.min(index * 0.07, 0.3),
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Component {...section.props} />
          </motion.div>
        )
      })}
    </div>
  )
}
