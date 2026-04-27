'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Trash2, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

type FormField = { name: string; label: string; type: string; required: boolean; options?: string }
type Form = { _id: string; name: string; fields: FormField[]; emailTo: string; emailSubject: string; successMessage: string }

export default function FormsAdmin() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newForm, setNewForm] = useState({ name: 'Contact Form', emailTo: 'info@ariosetech.com', emailSubject: 'New Contact Form Submission', successMessage: 'Thank you! We will get back to you within 24 hours.', fields: [] as FormField[] })

  const load = () => fetch('/api/forms').then(r => r.json()).then(setForms).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const addField = () => setNewForm(f => ({ ...f, fields: [...f.fields, { name: `field_${f.fields.length + 1}`, label: 'New Field', type: 'text', required: false }] }))
  const removeField = (i: number) => setNewForm(f => ({ ...f, fields: f.fields.filter((_, j) => j !== i) }))
  const updateField = (i: number, key: string, val: unknown) => setNewForm(f => ({ ...f, fields: f.fields.map((field, j) => j === i ? { ...field, [key]: val } : field) }))

  const save = async () => {
    const res = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newForm) })
    if (res.ok) { toast.success('Form created!'); setCreating(false); load() }
    else toast.error('Failed')
  }

  const del = async (id: string) => {
    if (!confirm('Delete this form?')) return
    await fetch(`/api/forms/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  const copyEmbedCode = (id: string) => {
    navigator.clipboard.writeText(`<FormEmbed formId="${id}" />`)
    toast.success('Embed code copied!')
  }

  const inp = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'var(--font-body)' }
  const lbl = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }

  return (
    <AdminShell>
      <div style={{ padding: '32px', maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Contact Forms</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Build forms that capture leads</p>
          </div>
          <button onClick={() => setCreating(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            <Plus size={15} /> New Form
          </button>
        </div>

        {/* Create form */}
        {creating && (
          <div style={{ background: 'var(--bg-2)', border: '1px solid rgba(79,110,247,0.3)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>New Form</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div><label style={lbl}>Form Name</label><input value={newForm.name} onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Send Emails To</label><input value={newForm.emailTo} onChange={e => setNewForm(f => ({ ...f, emailTo: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Email Subject</label><input value={newForm.emailSubject} onChange={e => setNewForm(f => ({ ...f, emailSubject: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Success Message</label><input value={newForm.successMessage} onChange={e => setNewForm(f => ({ ...f, successMessage: e.target.value }))} style={inp} /></div>
            </div>

            {/* Fields */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ ...lbl, marginBottom: 0 }}>Form Fields</label>
                <button onClick={addField} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '12px' }}>
                  <Plus size={11} /> Add Field
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {newForm.fields.map((field, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 100px auto', gap: '8px', alignItems: 'center', background: 'var(--bg-3)', padding: '10px', borderRadius: '10px' }}>
                    <input value={field.label} onChange={e => updateField(i, 'label', e.target.value)} placeholder="Label" style={{ ...inp, fontSize: '12px', padding: '7px 10px' }} />
                    <input value={field.name} onChange={e => updateField(i, 'name', e.target.value)} placeholder="field_name" style={{ ...inp, fontSize: '12px', padding: '7px 10px', fontFamily: 'var(--font-mono)' }} />
                    <select value={field.type} onChange={e => updateField(i, 'type', e.target.value)} style={{ ...inp, fontSize: '12px', padding: '7px 10px' }}>
                      {['text', 'email', 'phone', 'textarea', 'select'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-2)' }}>
                      <input type="checkbox" checked={field.required} onChange={e => updateField(i, 'required', e.target.checked)} />
                      Required
                    </label>
                    <button onClick={() => removeField(i)} style={{ padding: '7px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-3)' }} className="hover:text-[#ff4d6d]">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {newForm.fields.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '13px', padding: '16px' }}>Add fields above</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={save} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'var(--blue)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Create Form</button>
              <button onClick={() => setCreating(false)} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Forms list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div> :
          forms.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-2)', border: '1px dashed var(--border)', borderRadius: '16px', color: 'var(--text-3)' }}>No forms yet. Create one above.</div> :
          forms.map(form => (
            <div key={form._id} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{form.name}</p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>{form.fields?.length || 0} fields</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>→ {form.emailTo}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => copyEmbedCode(form._id)} title="Copy embed code" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-display)' }}>
                  <Copy size={12} /> Embed Code
                </button>
                <button onClick={() => del(form._id)} style={{ padding: '7px 8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }} className="hover:border-[rgba(255,77,109,0.4)] hover:text-[#ff4d6d]">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
