'use client'
import { useBuilderStore } from '@/lib/builder/store'
import { sectionRegistry } from '@/lib/builder/registry'
import { MediaPickerModal } from '@/components/ui/MediaPickerModal'
import type { FieldSchema } from '@/types'

export function PropertiesPanel() {
  const { layout, selectedId, updateProps, updateMeta } = useBuilderStore()
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

  const inpClass = "w-full bg-bg-3 border border-border rounded-sm py-2 px-2.5 text-xs text-white outline-none font-body box-border transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[9px] text-text-3 uppercase tracking-wider block mb-1"

  const renderField = (field: FieldSchema, prefix = '', parentValue?: Record<string, unknown>) => {
    const key = prefix ? `${prefix}.${field.name}` : field.name
    const value = parentValue ? parentValue[field.name] : props[field.name]

    switch (field.type) {
      case 'text':
        return (
          <div key={key}>
            <label className={lblClass}>{field.label}</label>
            <input value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} className={inpClass} />
          </div>
        )
      case 'textarea':
        return (
          <div key={key}>
            <label className={lblClass}>{field.label}</label>
            <textarea value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} rows={3} className={`${inpClass} resize-y leading-[1.5]`} />
          </div>
        )
      case 'select':
        return (
          <div key={key}>
            <label className={lblClass}>{field.label}</label>
            <select value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} className={`${inpClass} cursor-pointer`}>
              {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        )
      case 'color':
        return (
          <div key={key}>
            <label className={lblClass}>{field.label}</label>
            <div className="flex gap-1.5 items-center">
              <input type="color" value={String(value ?? '#766cff')} onChange={e => update(field.name, e.target.value)} className="w-9 h-[30px] p-0.5 border border-border rounded-md bg-bg-3 cursor-pointer" />
              <input value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} className={`${inpClass} flex-1 font-mono text-[11px]`} />
            </div>
          </div>
        )
      case 'boolean':
        return (
          <div key={key} className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(value)} onChange={e => update(field.name, e.target.checked)} className="w-3.5 h-3.5 cursor-pointer" />
            <label className={`${lblClass} mb-0 cursor-pointer`}>{field.label}</label>
          </div>
        )
      case 'number':
        return (
          <div key={key}>
            <label className={lblClass}>{field.label}</label>
            <input type="number" value={Number(value ?? 0)} onChange={e => update(field.name, Number(e.target.value))} className={inpClass} />
          </div>
        )
      case 'image':
        return (
          <div key={key}>
            <label className={lblClass}>{field.label}</label>
            <div className="flex gap-1.5 mb-1.5">
              <input value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} placeholder="https://… or /image.jpg" className={`${inpClass} flex-1 mb-0`} />
              <button onClick={() => updateMeta(section.id, { _mediaField: field.name } as any)} className="px-2.5 bg-bg-3 border border-border rounded-sm text-white cursor-pointer text-[11px] hover:bg-white/5 transition-colors">
                Library
              </button>
            </div>
            {Boolean(value) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={String(value)} alt="" className="w-full h-20 object-cover rounded-md border border-border" />
            )}
            {(section.meta as any)?._mediaField === field.name && (
              <MediaPickerModal 
                onClose={() => updateMeta(section.id, { _mediaField: undefined } as any)} 
                onSelect={(url) => { update(field.name, url); updateMeta(section.id, { _mediaField: undefined } as any) }} 
              />
            )}
          </div>
        )
      case 'repeater': {
        const items = Array.isArray(value) ? value as Record<string, unknown>[] : []
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1.5">
              <label className={lblClass}>{field.label}</label>
              <button onClick={() => {
                const blank: Record<string, unknown> = {}
                ;(field.fields || []).forEach((f) => { blank[f.name] = '' })
                update(field.name, [...items, blank])
              }} className="font-mono text-[10px] text-primary bg-transparent border-none cursor-pointer p-0 hover:underline">+ Add</button>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((item, i) => (
                <div key={i} className="bg-bg-3 border border-border rounded-lg p-2.5">
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-[9px] text-text-3 uppercase">Item {i + 1}</span>
                    <button onClick={() => update(field.name, items.filter((_, j) => j !== i))} className="bg-transparent border-none text-[color:var(--red)] cursor-pointer text-xs hover:text-red-400">✕</button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {(field.fields || []).map(subField => {
                      const subValue = item[subField.name]
                      const updateSub = (v: unknown) => {
                        const next = [...items]
                        next[i] = { ...item, [subField.name]: v }
                        update(field.name, next)
                      }
                      if (subField.type === 'textarea') {
                        return (
                          <div key={subField.name}>
                            <label className={lblClass}>{subField.label}</label>
                            <textarea value={String(subValue ?? '')} onChange={e => updateSub(e.target.value)} rows={2} className={`${inpClass} resize-y leading-[1.4]`} />
                          </div>
                        )
                      }
                      return (
                        <div key={subField.name}>
                          <label className={lblClass}>{subField.label}</label>
                          <input value={String(subValue ?? '')} onChange={e => updateSub(e.target.value)} className={inpClass} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
      default: return null
    }
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
    </aside>
  )
}
