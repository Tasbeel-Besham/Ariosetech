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
import Link from 'next/link'
import { Plus, Settings, ArrowRight } from 'lucide-react'

initRegistry()

export default function BuilderPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const { layout, setLayout, setPageMeta, reorder } = useBuilderStore()
  const [loading, setLoading] = useState(true)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [isServicePage, setIsServicePage] = useState(false)
  const [serviceSlug, setServiceSlug] = useState('')

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
        if (page.slug?.startsWith('services/')) {
          setIsServicePage(true)
          setServiceSlug(page.slug.replace('services/', ''))
        }
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
        <div className='builder-canvas' style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', position: 'relative' }}>
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

      {/* Modernized Service Page Overlay */}
      {isServicePage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ background: 'var(--bg-2)', border: '1px solid rgba(118,108,255,0.3)', borderRadius: '32px', padding: '60px', maxWidth: '600px', textAlign: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
             <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(118,108,255,0.1)', border: '1px solid rgba(118,108,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <Settings size={40} style={{ color: 'var(--primary)' }} />
             </div>
             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Modernized Service Page</h2>
             <p style={{ fontSize: '16px', color: 'var(--text-3)', lineHeight: 1.8, marginBottom: '40px' }}>
                This page has been upgraded to the new <strong>Dynamic Service Architecture</strong>. 
                Individual sections like Maintenance Plans, Backups, and Portfolios are now managed via the specialized Service Dashboard.
             </p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href={`/admin/services/${serviceSlug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px 32px', background: 'var(--grad)', color: '#fff', borderRadius: '16px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}>
                   Go to Service Dashboard <ArrowRight size={18} />
                </Link>
                <button onClick={() => setIsServicePage(false)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '13px', cursor: 'pointer', marginTop: '10px' }}>
                   Continue to Builder (Advanced Users Only)
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
