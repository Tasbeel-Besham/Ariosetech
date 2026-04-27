'use client'
import { useBuilderStore } from '@/lib/builder/store'
import { sectionRegistry } from '@/lib/builder/registry'
import { Plus, Eye, EyeOff, Copy, Trash2, GripVertical } from 'lucide-react'
import type { SectionInstance } from '@/types'

export function SectionListPanel({ onAddSection }: { onAddSection: () => void }) {
  const { layout, selectedId, selectSection, removeSection, duplicate, updateMeta } = useBuilderStore()

  return (
    <div style={{
      width: '220px', flexShrink: 0, height: '100%',
      background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Sections ({layout.sections.length})
        </p>
        <button onClick={onAddSection} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }} className="hover:border-[var(--blue)] hover:text-[var(--blue)]" title="Add section">
          <Plus size={13} />
        </button>
      </div>

      {/* Section list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {layout.sections.length === 0 ? (
          <div style={{ padding: '24px 14px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', lineHeight: 1.6 }}>No sections yet.<br />Click + to add one.</p>
          </div>
        ) : (
          layout.sections.map((section: SectionInstance, i: number) => {
            const def = sectionRegistry[section.type]
            const isSelected = selectedId === section.id
            const isHidden = section.meta?.hidden

            return (
              <div
                key={section.id}
                onClick={() => selectSection(isSelected ? null : section.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 12px', cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  background: isSelected ? 'rgba(79,110,247,0.1)' : 'transparent',
                  borderLeft: isSelected ? '2px solid var(--blue)' : '2px solid transparent',
                  opacity: isHidden ? 0.45 : 1,
                  transition: 'all 0.15s',
                }}
                className={!isSelected ? 'hover:bg-[var(--bg-3)]' : ''}
              >
                {/* Drag indicator */}
                <GripVertical size={12} style={{ color: 'var(--text-3)', flexShrink: 0, cursor: 'grab' }} />

                {/* Icon + label */}
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{def?.icon || '📦'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: isSelected ? 600 : 500, color: isSelected ? 'var(--blue)' : 'var(--text-2)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {section.meta?.label || def?.label || section.type}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-3)', marginTop: '1px' }}>
                    #{i + 1} · {section.type}
                  </p>
                </div>

                {/* Actions (show on hover/selected) */}
                <div style={{ display: 'flex', gap: '2px', flexShrink: 0, opacity: isSelected ? 1 : 0, transition: 'opacity 0.15s' }} className="group-hover:opacity-100">
                  <button onClick={e => { e.stopPropagation(); updateMeta(section.id, { hidden: !isHidden }) }}
                    style={{ width: '20px', height: '20px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title={isHidden ? 'Show' : 'Hide'}>
                    {isHidden ? <Eye size={11} /> : <EyeOff size={11} />}
                  </button>
                  <button onClick={e => { e.stopPropagation(); duplicate(section.id) }}
                    style={{ width: '20px', height: '20px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Duplicate">
                    <Copy size={11} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); removeSection(section.id) }}
                    style={{ width: '20px', height: '20px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Delete">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
