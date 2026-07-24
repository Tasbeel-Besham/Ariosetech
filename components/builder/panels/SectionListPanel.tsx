'use client'
import { useBuilderStore } from '@/lib/builder/store'
import { sectionRegistry } from '@/lib/builder/registry'
import { Plus, Eye, EyeOff, Copy, Trash2, GripVertical } from '@/components/ui/Icons'
import type { SectionInstance } from '@/types'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/**
 * One row in the section list. The grip is the drag handle; clicks still select
 * and the action buttons still work — @dnd-kit only starts a drag after a small
 * movement threshold, so taps aren't swallowed.
 */
function SortableRow({ section, index }: { section: SectionInstance; index: number }) {
  const { selectedId, selectSection, removeSection, duplicate, updateMeta } = useBuilderStore()
  const def = sectionRegistry[section.type]
  const isSelected = selectedId === section.id
  const isHidden = section.meta?.hidden

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : (isHidden ? 0.45 : 1),
    zIndex: isDragging ? 20 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectSection(isSelected ? null : section.id)}
      className={`group flex items-center gap-2 py-[9px] px-3 cursor-pointer border-b border-border border-l-2 transition-colors duration-150 ${
        isSelected ? 'bg-primary/10 border-l-[color:var(--blue)]' : 'border-l-transparent hover:bg-bg-3'
      }`}
    >
      {/* Drag handle — grab this to reorder */}
      <button
        {...attributes}
        {...listeners}
        onClick={e => e.stopPropagation()}
        className="shrink-0 cursor-grab active:cursor-grabbing text-text-3 hover:text-primary p-0 bg-transparent border-none"
        title="Drag to reorder"
        aria-label="Drag to reorder section"
      >
        <GripVertical size={13} />
      </button>

      <span className="text-sm shrink-0">{def?.icon || '📦'}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-display text-xs leading-[1.2] overflow-hidden text-ellipsis whitespace-nowrap ${
          isSelected ? 'font-semibold text-[color:var(--blue)]' : 'font-medium text-text-2'
        }`}>
          {section.meta?.label || def?.label || section.type}
        </p>
        <p className="font-mono text-[9px] text-text-3 mt-[1px]">
          #{index + 1} · {section.type}
        </p>
      </div>

      <div className={`flex gap-[2px] shrink-0 transition-opacity duration-150 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button onClick={e => { e.stopPropagation(); updateMeta(section.id, { hidden: !isHidden }) }}
          className="w-5 h-5 rounded border-none bg-transparent cursor-pointer text-text-3 flex items-center justify-center hover:bg-white/5"
          title={isHidden ? 'Show' : 'Hide'}>
          {isHidden ? <Eye size={11} /> : <EyeOff size={11} />}
        </button>
        <button onClick={e => { e.stopPropagation(); duplicate(section.id) }}
          className="w-5 h-5 rounded border-none bg-transparent cursor-pointer text-text-3 flex items-center justify-center hover:bg-white/5"
          title="Duplicate">
          <Copy size={11} />
        </button>
        <button onClick={e => { e.stopPropagation(); removeSection(section.id) }}
          className="w-5 h-5 rounded border-none bg-transparent cursor-pointer text-[color:var(--danger)] flex items-center justify-center hover:bg-white/5"
          title="Delete">
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  )
}

export function SectionListPanel({ onAddSection }: { onAddSection: () => void }) {
  const { layout, reorder } = useBuilderStore()

  const sensors = useSensors(
    // A small drag distance so a click still selects rather than starting a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) reorder(String(active.id), String(over.id))
  }

  return (
    <div className="w-[220px] shrink-0 h-full bg-bg-2 border-r border-border flex flex-col overflow-hidden">
      <div className="py-3 px-3.5 border-b border-border flex items-center justify-between">
        <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">
          Sections ({layout.sections.length})
        </p>
        <button onClick={onAddSection} className="w-6 h-6 rounded-md border border-border bg-transparent cursor-pointer text-text-3 flex items-center justify-center transition-all duration-150 hover:border-primary/50 hover:text-primary" title="Add section">
          <Plus size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {layout.sections.length === 0 ? (
          <div className="py-6 px-3.5 text-center">
            <p className="font-mono text-[10px] text-text-3 leading-[1.6]">No sections yet.<br />Click + to add one.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layout.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {layout.sections.map((section: SectionInstance, i: number) => (
                <SortableRow key={section.id} section={section} index={i} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
