import type { SectionDefinition } from '@/types'

// Central registry — populated by registerSection() calls
const sectionRegistry: Record<string, SectionDefinition> = {}

export function registerSection(def: SectionDefinition): void {
  if (sectionRegistry[def.type]) {
    console.warn(`[Registry] Section "${def.type}" is already registered — overwriting`)
  }
  sectionRegistry[def.type] = def
}

export function getSection(type: string): SectionDefinition | undefined {
  return sectionRegistry[type]
}

export function getAllSections(): SectionDefinition[] {
  return Object.values(sectionRegistry)
}

export function getSectionsByCategory(): Record<string, SectionDefinition[]> {
  return Object.values(sectionRegistry).reduce<Record<string, SectionDefinition[]>>(
    (acc, section) => {
      if (!acc[section.category]) acc[section.category] = []
      acc[section.category].push(section)
      return acc
    },
    {}
  )
}

export { sectionRegistry }
