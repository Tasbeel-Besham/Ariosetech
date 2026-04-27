'use client'
import { initRegistry } from '@/components/builder/sections/registry-init'
import { sectionRegistry } from '@/lib/builder/registry'
import FallbackSection from '../sections/FallbackSection'
import type { SectionInstance } from '@/types'
import { motion } from 'framer-motion'

initRegistry()

export function BuilderRenderer({ sections }: { sections: SectionInstance[] }) {
  const visible = sections.filter(s => !s.meta?.hidden)

  return (
    <div>
      {visible.map((section, index) => {
        const def = sectionRegistry[section.type]
        if (!def) return <FallbackSection key={section.id} type={section.type} />
        const Component = def.component
        const isSticky = section.type === 'approach'

        if (isSticky) {
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
            transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.3), ease: [0.22, 1, 0.36, 1] }}
          >
            <Component {...section.props} />
          </motion.div>
        )
      })}
    </div>
  )
}
