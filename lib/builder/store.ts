import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { PageLayout, SectionInstance } from '@/types'
import {
  addSection,
  removeSection,
  updateSectionProps,
  updateSectionMeta,
  reorderSections,
  duplicateSection,
} from './engine'

interface BuilderState {
  layout:           PageLayout
  selectedId:       string | null
  hoveredId:        string | null
  isDirty:          boolean
  isSaving:         boolean
  isPublishing:     boolean
  pageId:           string | null
  pageTitle:        string
  pageSlug:         string
  history:          PageLayout[]
  historyIndex:     number
  setLayout:        (layout: PageLayout) => void
  setPageMeta:      (id: string, title: string, slug: string) => void
  selectSection:    (id: string | null) => void
  hoverSection:     (id: string | null) => void
  addSection:       (type: string, index?: number) => void
  removeSection:    (id: string) => void
  updateProps:      (id: string, props: Record<string, unknown>) => void
  updateMeta:       (id: string, meta: SectionInstance['meta']) => void
  reorder:          (activeId: string, overId: string) => void
  duplicate:        (id: string) => void
  undo:             () => void
  redo:             () => void
  canUndo:          () => boolean
  canRedo:          () => boolean
  saveDraft:        () => Promise<void>
  publishPage:      () => Promise<void>
}

const EMPTY_LAYOUT: PageLayout = { sections: [] }
const MAX_HISTORY = 50

function pushHistory(history: PageLayout[], index: number, layout: PageLayout) {
  const trimmed = history.slice(0, index + 1)
  const next = [...trimmed, layout].slice(-MAX_HISTORY)
  return { history: next, historyIndex: next.length - 1 }
}

export const useBuilderStore = create<BuilderState>()(
  subscribeWithSelector((set, get) => ({
    layout:         EMPTY_LAYOUT,
    selectedId:     null,
    hoveredId:      null,
    isDirty:        false,
    isSaving:       false,
    isPublishing:   false,
    pageId:         null,
    pageTitle:      '',
    pageSlug:       '',
    history:        [EMPTY_LAYOUT],
    historyIndex:   0,

    setLayout: (layout) => set({
      layout,
      ...pushHistory([layout], 0, layout),
      isDirty: false,
      selectedId: null,
    }),

    setPageMeta: (pageId, pageTitle, pageSlug) => set({ pageId, pageTitle, pageSlug }),

    selectSection: (id) => set({ selectedId: id }),
    hoverSection:  (id) => set({ hoveredId: id }),

    addSection: (type, index) => {
      const newLayout = addSection(get().layout, type, index)
      set({ layout: newLayout, ...pushHistory(get().history, get().historyIndex, newLayout), isDirty: true })
    },

    removeSection: (id) => {
      const newLayout = removeSection(get().layout, id)
      set({ layout: newLayout, ...pushHistory(get().history, get().historyIndex, newLayout), isDirty: true, selectedId: null })
    },

    updateProps: (id, props) => {
      const newLayout = updateSectionProps(get().layout, id, props)
      set({ layout: newLayout, ...pushHistory(get().history, get().historyIndex, newLayout), isDirty: true })
    },

    updateMeta: (id, meta) => {
      const newLayout = updateSectionMeta(get().layout, id, meta)
      set({ layout: newLayout, isDirty: true })
    },

    reorder: (activeId, overId) => {
      const newLayout = reorderSections(get().layout, activeId, overId)
      set({ layout: newLayout, ...pushHistory(get().history, get().historyIndex, newLayout), isDirty: true })
    },

    duplicate: (id) => {
      const newLayout = duplicateSection(get().layout, id)
      set({ layout: newLayout, ...pushHistory(get().history, get().historyIndex, newLayout), isDirty: true })
    },

    undo: () => {
      const { history, historyIndex } = get()
      if (historyIndex <= 0) return
      const newIndex = historyIndex - 1
      set({ layout: history[newIndex], historyIndex: newIndex, isDirty: true })
    },

    redo: () => {
      const { history, historyIndex } = get()
      if (historyIndex >= history.length - 1) return
      const newIndex = historyIndex + 1
      set({ layout: history[newIndex], historyIndex: newIndex, isDirty: true })
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    saveDraft: async () => {
      const { pageId, layout } = get()
      if (!pageId) return
      set({ isSaving: true })
      try {
        await fetch('/api/builder/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId, layout }),
        })
        set({ isDirty: false })
      } finally {
        set({ isSaving: false })
      }
    },

    publishPage: async () => {
      const { pageId, layout } = get()
      if (!pageId) return
      set({ isPublishing: true })
      try {
        await fetch('/api/builder/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId, layout }),
        })
        set({ isDirty: false })
      } finally {
        set({ isPublishing: false })
      }
    },
  }))
)
