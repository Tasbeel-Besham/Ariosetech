'use client'
import { initRegistry } from '@/lib/builder/registry-init'
import { sectionRegistry } from '@/lib/builder/registry'
import FallbackSection from '../sections/FallbackSection'
import type { SectionInstance } from '@/types'
import { motion } from 'framer-motion'
import SchemaMarkup from '@/components/ui/SchemaMarkup'

initRegistry()

export function BuilderRenderer({
  sections,
  pageName,
  pageUrl,
}: {
  sections: SectionInstance[]
  pageName?: string
  pageUrl?: string
}) {
  const visible = sections.filter(s => !s.meta?.hidden)

  const faqs: Array<{ q: string; a: string }> = []
  let description = ''

  visible.forEach(s => {
    if (s.type === 'faq' && Array.isArray(s.props?.items)) {
      faqs.push(...(s.props.items as Array<{ q: string; a: string }>))
    }
    // FIX: was 'interactive_hero' (underscore) — correct keys use dashes
    if (
      (s.type === 'hero' || s.type === 'hero-interactive' || s.type === 'hero-classic') &&
      s.props?.desc &&
      !description
    ) {
      description = s.props.desc as string
    }
  })

  return (
    <div>
      {pageUrl && (
        <SchemaMarkup
          type="Service"
          pageUrl={pageUrl}
          pageName={pageName || 'Service Page'}
          pageDescription={description}
          faqs={faqs}
        />
      )}
      {visible.map((section, index) => {
        const def = sectionRegistry[section.type]
        if (!def) return <FallbackSection key={section.id} type={section.type} />
        const Component = def.component

        if (section.type === 'approach') {
          return (
            <div key={section.id}>
              <Component {...section.props} />
            </div>
          )
        }

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: 0.55,
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
