'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBuilderStore } from '@/lib/builder/store'
import { sectionRegistry } from '@/lib/builder/registry'
import FallbackSection from '../sections/FallbackSection'
import { GripVertical, Copy, Trash2, EyeOff, Eye, Settings2 } from 'lucide-react'
import type { SectionInstance } from '@/types'
import React from 'react'

// Error boundary to prevent one broken section from crashing the whole canvas
class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; type: string },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode; type: string }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: 'rgba(255,77,109,0.06)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '12px', margin: '8px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--red)', marginBottom: '4px', fontWeight: 700 }}>
            ⚠ Section render error: {this.props.type}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>{this.state.error}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export function SortableSection({ section }: { section: SectionInstance }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const { selectedId, selectSection, removeSection, duplicate, updateMeta } = useBuilderStore()

  const isSelected = selectedId === section.id
  const isHidden   = section.meta?.hidden
  const def        = sectionRegistry[section.type]

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition: [transition, 'outline 150ms ease'].filter(Boolean).join(', '),
    opacity: isDragging ? 0.45 : isHidden ? 0.35 : 1,
    position: 'relative',
    outline: isSelected ? '2px solid rgba(79,110,247,0.7)' : '2px solid transparent',
    outlineOffset: '0px',
  }

  return (
    <div ref={setNodeRef} style={style} onClick={e => { e.stopPropagation(); selectSection(isSelected ? null : section.id) }}>

      {/* Toolbar — top right, visible when selected */}
      <div style={{
        position: 'absolute', top: '10px', right: '10px', zIndex: 20,
        display: 'flex', gap: '4px', alignItems: 'center',
        opacity: isSelected ? 1 : 0,
        transform: isSelected ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 0.15s, transform 0.15s',
        pointerEvents: isSelected ? 'auto' : 'none',
      }}>
        {/* Drag handle */}
        <div {...attributes} {...listeners}
          style={{ cursor: 'grab', padding: '6px', borderRadius: '6px', background: 'rgba(6,6,18,0.92)', border: '1px solid var(--border-2)', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}
          title="Drag to reorder">
          <GripVertical size={13} />
        </div>

        {/* Section type label */}
        <div style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(79,110,247,0.85)', color: '#fff', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.04em' }}>
          {def?.label || section.type}
        </div>

        {/* Actions */}
        {[
          { Icon: isHidden ? Eye : EyeOff, fn: () => updateMeta(section.id, { hidden: !isHidden }), title: isHidden ? 'Show' : 'Hide', color: 'var(--text-3)' },
          { Icon: Copy, fn: () => { duplicate(section.id); selectSection(section.id + '_copy') }, title: 'Duplicate', color: 'var(--text-3)' },
          { Icon: Settings2, fn: () => selectSection(section.id), title: 'Edit properties', color: 'var(--blue)' },
        ].map(({ Icon, fn, title, color }) => (
          <button key={title} onClick={e => { e.stopPropagation(); fn() }} title={title}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-2)', background: 'rgba(6,6,18,0.92)', color, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}>
            <Icon size={13} />
          </button>
        ))}

        <button onClick={e => { e.stopPropagation(); removeSection(section.id) }} title="Delete section"
          style={{ padding: '6px', borderRadius: '6px', border: '1px solid rgba(255,77,109,0.35)', background: 'rgba(6,6,18,0.92)', color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Trash2 size={13} />
        </button>
      </div>

      {/* Section content */}
      <SectionErrorBoundary type={section.type}>
        {def ? (
          <def.component {...section.props as Record<string, unknown>} />
        ) : (
          <FallbackSection type={section.type} />
        )}
      </SectionErrorBoundary>
    </div>
  )
}
