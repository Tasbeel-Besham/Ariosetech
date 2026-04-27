'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useBuilderStore } from '@/lib/builder/store'
import { initRegistry } from '@/components/builder/sections/registry-init'
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
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--blue)', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-3)', fontSize: '14px', fontFamily: 'var(--font-body)' }}>Loading builder…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Top toolbar */}
      <BuilderToolbar onAddSection={() => setPickerOpen(true)} />

      {/* Three-column layout: section list | canvas | properties */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT: Section list panel */}
        <SectionListPanel onAddSection={() => setPickerOpen(true)} />

        {/* CENTER: Canvas */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', position: 'relative' }}>
          {layout.sections.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80%', gap: 'var(--space-4)', padding: 'var(--space-8)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-xl)', background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={28} style={{ color: 'var(--blue)' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Empty canvas</p>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '24px', maxWidth: '280px', lineHeight: 1.6 }}>Add sections from the left panel or click the button below</p>
                <button onClick={() => setPickerOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: 'var(--radius-lg)', border: 'none', background: 'var(--gradient-primary)', color: '#fff', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)', cursor: 'pointer' }}>
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
              <div style={{ padding: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => setPickerOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-2)', background: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }} className="hover:border-[rgba(79,110,247,0.5)] hover:text-[var(--blue)]">
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
