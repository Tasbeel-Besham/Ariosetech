import { nanoid } from 'nanoid'
import { arrayMove } from '@dnd-kit/sortable'
import { sectionRegistry } from './registry'
import type { SectionInstance, PageLayout } from '@/types'

export function generateSectionId(): string {
  return `sec_${nanoid(8)}`
}

export function createSection(type: string): SectionInstance {
  const def = sectionRegistry[type]
  if (!def) throw new Error(`Unknown section type: "${type}"`)

  return {
    id: generateSectionId(),
    type,
    props: structuredClone(def.defaultProps),
    styles: {},
    meta: { locked: false, hidden: false },
  }
}

export function addSection(
  layout: PageLayout,
  type: string,
  index?: number
): PageLayout {
  const newSection = createSection(type)
  const sections = [...layout.sections]

  if (index !== undefined) {
    sections.splice(index, 0, newSection)
  } else {
    sections.push(newSection)
  }

  return { ...layout, sections }
}

export function removeSection(layout: PageLayout, id: string): PageLayout {
  return {
    ...layout,
    sections: layout.sections.filter(s => s.id !== id),
  }
}

export function updateSectionProps(
  layout: PageLayout,
  id: string,
  newProps: Record<string, unknown>
): PageLayout {
  return {
    ...layout,
    sections: layout.sections.map(s =>
      s.id === id
        ? { ...s, props: { ...s.props, ...newProps } }
        : s
    ),
  }
}

export function updateSectionMeta(
  layout: PageLayout,
  id: string,
  meta: SectionInstance['meta']
): PageLayout {
  return {
    ...layout,
    sections: layout.sections.map(s =>
      s.id === id ? { ...s, meta: { ...s.meta, ...meta } } : s
    ),
  }
}

export function reorderSections(
  layout: PageLayout,
  activeId: string,
  overId: string
): PageLayout {
  const sections = layout.sections
  const oldIndex = sections.findIndex(s => s.id === activeId)
  const newIndex = sections.findIndex(s => s.id === overId)

  if (oldIndex === -1 || newIndex === -1) return layout

  return { ...layout, sections: arrayMove(sections, oldIndex, newIndex) }
}

export function duplicateSection(layout: PageLayout, id: string): PageLayout {
  const original = layout.sections.find(s => s.id === id)
  if (!original) return layout

  const copy: SectionInstance = {
    ...structuredClone(original),
    id: generateSectionId(),
    meta: { ...original.meta, locked: false },
  }

  const idx = layout.sections.findIndex(s => s.id === id)
  const sections = [...layout.sections]
  sections.splice(idx + 1, 0, copy)

  return { ...layout, sections }
}

export function validateLayout(layout: PageLayout): boolean {
  return (
    Array.isArray(layout.sections) &&
    layout.sections.every(
      s => typeof s.id === 'string' && typeof s.type === 'string'
    )
  )
}
