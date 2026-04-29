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
      <aside style={{ width: '280px', flexShrink: 0, height: '100%', background: 'var(--bg-2)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Properties</p>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>⚙️</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>No section selected</p>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.6 }}>Click a section on the canvas or in the panel to edit its properties</p>
        </div>
      </aside>
    )
  }

  const def = sectionRegistry[section.type]
  const schema: FieldSchema[] = def?.schema || []
  const props = section.props || {}

  const update = (name: string, value: unknown) => updateProps(section.id, { [name]: value })

  const inp: React.CSSProperties = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 10px', fontSize: '12px', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box', transition: 'border-color 0.15s' }
  const lbl: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }

  const renderField = (field: FieldSchema, prefix = '', parentValue?: Record<string, unknown>) => {
    const key = prefix ? `${prefix}.${field.name}` : field.name
    const value = parentValue ? parentValue[field.name] : props[field.name]

    switch (field.type) {
      case 'text':
        return (
          <div key={key}>
            <label style={lbl}>{field.label}</label>
            <input value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} style={inp}
              onFocus={e => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
        )
      case 'textarea':
        return (
          <div key={key}>
            <label style={lbl}>{field.label}</label>
            <textarea value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} rows={3} style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }}
              onFocus={e => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
        )
      case 'select':
        return (
          <div key={key}>
            <label style={lbl}>{field.label}</label>
            <select value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        )
      case 'color':
        return (
          <div key={key}>
            <label style={lbl}>{field.label}</label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input type="color" value={String(value ?? '#766cff')} onChange={e => update(field.name, e.target.value)} style={{ width: '36px', height: '30px', padding: '2px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg-3)', cursor: 'pointer' }} />
              <input value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} style={{ ...inp, flex: 1, fontFamily: 'var(--font-mono)', fontSize: '11px' }} />
            </div>
          </div>
        )
      case 'boolean':
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={Boolean(value)} onChange={e => update(field.name, e.target.checked)} style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
            <label style={{ ...lbl, marginBottom: 0, cursor: 'pointer' }}>{field.label}</label>
          </div>
        )
      case 'number':
        return (
          <div key={key}>
            <label style={lbl}>{field.label}</label>
            <input type="number" value={Number(value ?? 0)} onChange={e => update(field.name, Number(e.target.value))} style={inp} />
          </div>
        )
      case 'image':
        return (
          <div key={key}>
            <label style={lbl}>{field.label}</label>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <input value={String(value ?? '')} onChange={e => update(field.name, e.target.value)} placeholder="https://… or /image.jpg" style={{ ...inp, flex: 1, marginBottom: 0 }} />
              <button onClick={() => updateMeta(section.id, { _mediaField: field.name })} style={{ padding: '0 10px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text)', cursor: 'pointer', fontSize: '11px' }}>
                Library
              </button>
            </div>
            {Boolean(value) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={String(value)} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
            )}
            {section.meta?._mediaField === field.name && (
              <MediaPickerModal 
                onClose={() => updateMeta(section.id, { _mediaField: undefined })} 
                onSelect={(url) => { update(field.name, url); updateMeta(section.id, { _mediaField: undefined }) }} 
              />
            )}
          </div>
        )
      case 'repeater': {
        const items = Array.isArray(value) ? value as Record<string, unknown>[] : []
        return (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={lbl}>{field.label}</label>
              <button onClick={() => {
                const blank: Record<string, unknown> = {}
                ;(field.fields || []).forEach((f) => { blank[f.name] = '' })
                update(field.name, [...items, blank])
              }} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}>+ Add</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((item, i) => (
                <div key={i} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Item {i + 1}</span>
                    <button onClick={() => update(field.name, items.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                            <label style={lbl}>{subField.label}</label>
                            <textarea value={String(subValue ?? '')} onChange={e => updateSub(e.target.value)} rows={2} style={{ ...inp, resize: 'vertical', lineHeight: 1.4 }} />
                          </div>
                        )
                      }
                      return (
                        <div key={subField.name}>
                          <label style={lbl}>{subField.label}</label>
                          <input value={String(subValue ?? '')} onChange={e => updateSub(e.target.value)} style={inp} />
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
    <aside style={{ width: '280px', flexShrink: 0, height: '100%', background: 'var(--bg-2)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>{def?.icon || '⚙️'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{def?.label || section.type}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Edit properties</p>
        </div>
      </div>

      {/* Section label override */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
        <label style={lbl}>Display Name (optional)</label>
        <input value={section.meta?.label || ''} onChange={e => updateMeta(section.id, { label: e.target.value })} placeholder={def?.label || section.type} style={inp}
          onFocus={e => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {schema.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>No editable fields</p>
        ) : schema.map(field => renderField(field))}
      </div>
    </aside>
  )
}
