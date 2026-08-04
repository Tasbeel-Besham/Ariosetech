'use client'
import { useState } from 'react'
import { useBuilderStore } from '@/lib/builder/store'
import { sectionRegistry } from '@/lib/builder/registry'
import { MediaPickerModal } from '@/components/ui/MediaPickerModal'
import type { FieldSchema } from '@/types'

/**
 * Which image field the media picker is currently open for.
 *  - 'field'    → a top-level field on the section (e.g. `bgImage`)
 *  - 'repeater' → an image field inside one row of a repeater
 *                 (e.g. Projects → item 3 → screenshot)
 */
type PickerTarget =
  | { kind: 'field'; name: string }
  | { kind: 'repeater'; name: string; index: number; sub: string }

export function PropertiesPanel() {
  const { layout, selectedId, updateProps, updateMeta } = useBuilderStore()
  // Picker state lives here rather than being stashed on section.meta, so it
  // never gets written into the saved layout document.
  const [picker, setPicker] = useState<PickerTarget | null>(null)
  const section = layout.sections.find(s => s.id === selectedId)

  if (!section) {
    return (
      <aside className="w-[280px] shrink-0 h-full bg-bg-2 border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">Properties</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-bg-3 border border-border flex items-center justify-center text-[22px] mb-3">⚙️</div>
          <p className="font-display text-[13px] font-semibold text-white mb-1.5">No section selected</p>
          <p className="text-xs text-text-3 leading-[1.6]">Click a section on the canvas or in the panel to edit its properties</p>
        </div>
      </aside>
    )
  }

  const def = sectionRegistry[section.type]
  const schema: FieldSchema[] = def?.schema || []
  const props = section.props || {}

  const update = (name: string, value: unknown) => updateProps(section.id, { [name]: value })

  /** Write the URL chosen in the media modal back to whichever field opened it. */
  const applyPicked = (url: string) => {
    if (!picker) return
    if (picker.kind === 'field') {
      update(picker.name, url)
    } else {
      const list = Array.isArray(props[picker.name])
        ? [...(props[picker.name] as Record<string, unknown>[])]
        : []
      list[picker.index] = { ...(list[picker.index] || {}), [picker.sub]: url }
      update(picker.name, list)
    }
    setPicker(null)
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-sm py-2 px-2.5 text-xs text-white outline-none font-body box-border transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[9px] text-text-3 uppercase tracking-wider block mb-1"
  const libBtnClass = "px-2.5 bg-bg-3 border border-border rounded-sm text-white cursor-pointer text-[11px] whitespace-nowrap hover:bg-white/5 transition-colors"

  /**
   * One editor input. Used for both top-level fields and repeater sub-fields —
   * `value` and `onChange` are passed in so the caller decides where the value
   * is read from and written to. This is what makes an `image` sub-field inside
   * a repeater behave exactly like a top-level one (preview + Library button),
   * which previously was not the case: every non-textarea sub-field fell
   * through to a bare text input.
   */
  const renderInput = (
    field: FieldSchema,
    value: unknown,
    onChange: (v: unknown) => void,
    openPicker: () => void,
    keyPrefix: string,
  ) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div key={`${keyPrefix}-${field.name}`}>
            <label className={lblClass}>{field.label}</label>
            <textarea value={String(value ?? '')} onChange={e => onChange(e.target.value)} rows={3} className={`${inpClass} resize-y leading-[1.5]`} />
          </div>
        )

      case 'select':
        return (
          <div key={`${keyPrefix}-${field.name}`}>
            <label className={lblClass}>{field.label}</label>
            <select value={String(value ?? '')} onChange={e => onChange(e.target.value)} className={`${inpClass} cursor-pointer`}>
              {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        )

      case 'color':
        return (
          <div key={`${keyPrefix}-${field.name}`}>
            <label className={lblClass}>{field.label}</label>
            <div className="flex gap-1.5 items-center">
              <input type="color" value={String(value || '#766cff')} onChange={e => onChange(e.target.value)} className="w-9 h-[30px] p-0.5 border border-border rounded-md bg-bg-3 cursor-pointer" />
              <input value={String(value ?? '')} onChange={e => onChange(e.target.value)} className={`${inpClass} flex-1 font-mono text-[11px]`} />
            </div>
          </div>
        )

      case 'boolean':
        return (
          <div key={`${keyPrefix}-${field.name}`} className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(value)} onChange={e => onChange(e.target.checked)} className="w-3.5 h-3.5 cursor-pointer" />
            <label className={`${lblClass} mb-0 cursor-pointer`}>{field.label}</label>
          </div>
        )

      case 'number':
        return (
          <div key={`${keyPrefix}-${field.name}`}>
            <label className={lblClass}>{field.label}</label>
            <input type="number" value={Number(value ?? 0)} onChange={e => onChange(Number(e.target.value))} className={inpClass} />
          </div>
        )

      case 'image':
        return (
          <div key={`${keyPrefix}-${field.name}`}>
            <label className={lblClass}>{field.label}</label>
            <div className="flex gap-1.5 mb-1.5">
              <input value={String(value ?? '')} onChange={e => onChange(e.target.value)} placeholder="https://… or /image.jpg" className={`${inpClass} flex-1 mb-0`} />
              <button type="button" onClick={openPicker} className={libBtnClass}>Library</button>
            </div>
            {Boolean(value) && (
              <div className="relative">
                {/* Capped height with object-top so a tall full-page screenshot
                    shows its header rather than its middle. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={String(value)} alt="" className="w-full max-h-28 object-cover object-top rounded-md border border-border" />
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 border border-border text-white text-[11px] leading-none cursor-pointer hover:bg-black/90 transition-colors"
                  aria-label="Remove image"
                >×</button>
              </div>
            )}
          </div>
        )

      case 'text':
      default:
        return (
          <div key={`${keyPrefix}-${field.name}`}>
            <label className={lblClass}>{field.label}</label>
            <input value={String(value ?? '')} onChange={e => onChange(e.target.value)} className={inpClass} />
          </div>
        )
    }
  }

  const renderField = (field: FieldSchema) => {
    const value = props[field.name]

    if (field.type === 'repeater') {
      const items = Array.isArray(value) ? value as Record<string, unknown>[] : []
      const subFields = field.fields || []

      const moveItem = (from: number, to: number) => {
        if (to < 0 || to >= items.length) return
        const next = [...items]
        const [row] = next.splice(from, 1)
        next.splice(to, 0, row)
        update(field.name, next)
      }

      return (
        <div key={field.name}>
          <div className="flex justify-between items-center mb-1.5">
            <label className={lblClass}>{field.label}</label>
            <button
              type="button"
              onClick={() => {
                const blank: Record<string, unknown> = {}
                subFields.forEach(f => { blank[f.name] = f.type === 'boolean' ? false : '' })
                update(field.name, [...items, blank])
              }}
              className="font-mono text-[10px] text-primary bg-transparent border-none cursor-pointer p-0 hover:underline"
            >+ Add</button>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <div key={i} className="bg-bg-3 border border-border rounded-lg p-2.5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[9px] text-text-3 uppercase">
                    Item {i + 1}
                    {typeof item.title === 'string' && item.title ? ` · ${String(item.title).slice(0, 18)}` : ''}
                  </span>
                  <div className="flex gap-1 items-center">
                    <button type="button" onClick={() => moveItem(i, i - 1)} disabled={i === 0}
                      className={`bg-transparent border-none text-[11px] p-0 px-1 ${i === 0 ? 'text-bg-4 cursor-default' : 'text-text-3 hover:text-white cursor-pointer'}`}
                      aria-label="Move up">▲</button>
                    <button type="button" onClick={() => moveItem(i, i + 1)} disabled={i === items.length - 1}
                      className={`bg-transparent border-none text-[11px] p-0 px-1 ${i === items.length - 1 ? 'text-bg-4 cursor-default' : 'text-text-3 hover:text-white cursor-pointer'}`}
                      aria-label="Move down">▼</button>
                    <button type="button" onClick={() => update(field.name, items.filter((_, j) => j !== i))}
                      className="bg-transparent border-none text-[color:var(--red)] cursor-pointer text-xs hover:text-red-400"
                      aria-label="Remove item">✕</button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  {subFields.map(subField => {
                    // Nested repeaters are not supported by this panel.
                    if (subField.type === 'repeater') return null

                    const updateSub = (v: unknown) => {
                      const next = [...items]
                      next[i] = { ...item, [subField.name]: v }
                      update(field.name, next)
                    }

                    return renderInput(
                      subField,
                      item[subField.name],
                      updateSub,
                      () => setPicker({ kind: 'repeater', name: field.name, index: i, sub: subField.name }),
                      `${field.name}-${i}`,
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return renderInput(
      field,
      value,
      v => update(field.name, v),
      () => setPicker({ kind: 'field', name: field.name }),
      'root',
    )
  }

  return (
    <aside className="w-[280px] shrink-0 h-full bg-bg-2 border-l border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="py-3 px-3.5 border-b border-border flex items-center gap-2">
        <span className="text-base">{def?.icon || '⚙️'}</span>
        <div className="flex-1 min-w-0">
          <p className="font-display text-[13px] font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap">{def?.label || section.type}</p>
          <p className="font-mono text-[9px] text-text-3 uppercase tracking-wider">Edit properties</p>
        </div>
      </div>

      {/* Section label override */}
      <div className="py-3 px-3.5 border-b border-border">
        <label className={lblClass}>Display Name (optional)</label>
        <input value={section.meta?.label || ''} onChange={e => updateMeta(section.id, { label: e.target.value })} placeholder={def?.label || section.type} className={inpClass} />
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3.5">
        {schema.length === 0 ? (
          <p className="font-mono text-[11px] text-text-3 text-center py-5">No editable fields</p>
        ) : schema.map(field => renderField(field))}
      </div>

      {/* One modal for the whole panel, wherever the request came from. */}
      {picker && (
        <MediaPickerModal
          onClose={() => setPicker(null)}
          onSelect={applyPicked}
        />
      )}
    </aside>
  )
}
