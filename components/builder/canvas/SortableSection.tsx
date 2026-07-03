'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBuilderStore } from '@/lib/builder/store'
import { sectionRegistry } from '@/lib/builder/registry'
import FallbackSection from '@/components/sections/FallbackSection'
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
        <div className="p-6 bg-[rgba(255,77,109,0.06)] border border-[rgba(255,77,109,0.2)] rounded-xl m-2">
          <p className="font-mono text-xs text-[color:var(--red)] mb-1 font-bold">
            ⚠ Section render error: {this.props.type}
          </p>
          <p className="text-[11px] text-text-3">{this.state.error}</p>
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
    outline: isSelected ? '2px solid rgba(79,110,247,0.7)' : '2px solid transparent',
    outlineOffset: '0px',
  }

  return (
    <div ref={setNodeRef} style={style} className="relative" onClick={e => { e.stopPropagation(); selectSection(isSelected ? null : section.id) }}>

      {/* Toolbar — top right, visible when selected */}
      <div 
        className="absolute top-2.5 right-2.5 z-20 flex gap-1 items-center transition-all duration-150"
        style={{
          opacity: isSelected ? 1 : 0,
          transform: isSelected ? 'translateY(0)' : 'translateY(-4px)',
          pointerEvents: isSelected ? 'auto' : 'none',
        }}
      >
        {/* Drag handle */}
        <div {...attributes} {...listeners}
          className="cursor-grab p-1.5 rounded-md bg-[rgba(6,6,18,0.92)] border border-border-2 text-text-3 flex items-center"
          title="Drag to reorder">
          <GripVertical size={13} />
        </div>

        {/* Section type label */}
        <div className="py-1 px-2.5 rounded-md bg-[rgba(79,110,247,0.85)] text-white text-[11px] font-mono font-semibold tracking-wider">
          {def?.label || section.type}
        </div>

        {/* Actions */}
        {[
          { Icon: isHidden ? Eye : EyeOff, fn: () => updateMeta(section.id, { hidden: !isHidden }), title: isHidden ? 'Show' : 'Hide', colorClass: 'text-text-3' },
          { Icon: Copy, fn: () => { duplicate(section.id); selectSection(section.id + '_copy') }, title: 'Duplicate', colorClass: 'text-text-3' },
          { Icon: Settings2, fn: () => selectSection(section.id), title: 'Edit properties', colorClass: 'text-[color:var(--blue)]' },
        ].map(({ Icon, fn, title, colorClass }) => (
          <button key={title} onClick={e => { e.stopPropagation(); fn() }} title={title}
            className={`p-1.5 rounded-md border border-border-2 bg-[rgba(6,6,18,0.92)] ${colorClass} cursor-pointer flex items-center transition-all duration-150`}>
            <Icon size={13} />
          </button>
        ))}

        <button onClick={e => { e.stopPropagation(); removeSection(section.id) }} title="Delete section"
          className="p-1.5 rounded-md border border-[rgba(255,77,109,0.35)] bg-[rgba(6,6,18,0.92)] text-[color:var(--red)] cursor-pointer flex items-center">
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
