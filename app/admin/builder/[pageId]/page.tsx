'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useBuilderStore } from '@/lib/builder/store'
import { initRegistry } from '@/lib/builder/registry-init'
import { SortableSection } from '@/components/builder/canvas/SortableSection'
import { BuilderToolbar } from '@/components/builder/toolbar/BuilderToolbar'
import { SectionPicker } from '@/components/builder/panels/SectionPicker'
import { PropertiesPanel } from '@/components/builder/panels/PropertiesPanel'
import { SectionListPanel } from '@/components/builder/panels/SectionListPanel'
import { Plus } from 'lucide-react'

initRegistry()

export default function BuilderPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const { layout, setLayout, setPageMeta, reorder } = useBuilderStore()
  const [loading, setLoading] = useState(true)
  const [pickerOpen, setPickerOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const loadPage = useCallback(() => {
    fetch(`/api/pages/${pageId}`)
      .then(r => r.json())
      .then(({ page, layout: saved }) => {
        setLayout(saved || { sections: [] })
        setPageMeta(pageId, page.title, page.slug)
      })
      .finally(() => setLoading(false))
  }, [pageId, setLayout, setPageMeta])

  useEffect(() => { loadPage() }, [loadPage])

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    reorder(String(active.id), String(over.id))
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-border border-t-primary animate-spin mx-auto mb-4" />
        <p className="text-text-3 text-sm font-body">Loading builder…</p>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      {/* Top toolbar */}
      <BuilderToolbar onAddSection={() => setPickerOpen(true)} />

      {/* Three-column layout: section list | canvas | properties */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Section list panel */}
        <SectionListPanel onAddSection={() => setPickerOpen(true)} />

        {/* CENTER: Canvas */}
        <div className='builder-canvas flex-1 overflow-y-auto bg-bg relative'>
          {layout.sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[80%] gap-4 p-8">
              <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-[rgba(79,110,247,0.1)] border border-[rgba(79,110,247,0.2)] flex items-center justify-center">
                <Plus size={28} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-display text-[20px] font-bold text-white mb-2">Empty canvas</p>
                <p className="text-sm text-text-3 mb-6 max-w-[280px] leading-[1.6]">Add sections from the left panel or click the button below</p>
                <button onClick={() => setPickerOpen(true)} className="inline-flex items-center gap-2 py-3 px-6 rounded-lg border-none bg-gradient-to-br from-[#4f6ef7] to-[#9b6dff] text-white text-sm font-bold font-display cursor-pointer transition-opacity hover:opacity-90">
                  <Plus size={16} /> Add First Section
                </button>
              </div>
            </div>
          ) : (
            <>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={layout.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  {layout.sections.map(section => (
                    <SortableSection key={section.id} section={section} />
                  ))}
                </SortableContext>
              </DndContext>
              <div className="p-6 flex justify-center">
                <button onClick={() => setPickerOpen(true)} className="flex items-center gap-2 py-2.5 px-5 rounded-md border border-dashed border-border-2 bg-transparent text-text-3 cursor-pointer text-[13px] font-body transition-all hover:border-[rgba(79,110,247,0.5)] hover:text-primary">
                  <Plus size={14} /> Add Section
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Properties panel */}
        <PropertiesPanel />
      </div>

      {pickerOpen && <SectionPicker onClose={() => setPickerOpen(false)} />}

    </div>
  )
}
