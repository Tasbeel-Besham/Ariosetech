'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Trash2, Copy } from '@/components/ui/Icons'
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

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"

  return (
    <AdminShell>
      <div className="p-8 max-w-[900px]">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight">Contact Forms</h1>
            <p className="text-[13px] text-text-3 mt-1">Build forms that capture leads</p>
          </div>
          <button onClick={() => setCreating(true)} className="flex items-center gap-2 py-2.5 px-[18px] rounded-lg border-none bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90">
            <Plus size={15} /> New Form
          </button>
        </div>

        {/* Create form */}
        {creating && (
          <div className="bg-bg-2 border border-primary/30 rounded-2xl p-7 mb-6">
            <h3 className="font-display text-base font-bold text-white mb-5">New Form</h3>
            <div className="grid grid-cols-2 gap-3.5 mb-3.5 max-sm:grid-cols-1">
              <div><label className={lblClass}>Form Name</label><input value={newForm.name} onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))} className={inpClass} /></div>
              <div><label className={lblClass}>Send Emails To</label><input value={newForm.emailTo} onChange={e => setNewForm(f => ({ ...f, emailTo: e.target.value }))} className={inpClass} /></div>
              <div><label className={lblClass}>Email Subject</label><input value={newForm.emailSubject} onChange={e => setNewForm(f => ({ ...f, emailSubject: e.target.value }))} className={inpClass} /></div>
              <div><label className={lblClass}>Success Message</label><input value={newForm.successMessage} onChange={e => setNewForm(f => ({ ...f, successMessage: e.target.value }))} className={inpClass} /></div>
            </div>

            {/* Fields */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <label className={`${lblClass} mb-0`}>Form Fields</label>
                <button onClick={addField} className="flex items-center gap-1 py-1.5 px-2.5 rounded-md border border-border bg-transparent text-text-3 cursor-pointer text-xs transition-colors hover:text-white hover:bg-bg-3">
                  <Plus size={11} /> Add Field
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {newForm.fields.map((field, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_120px_100px_auto] gap-2 items-center bg-bg-3 p-2.5 rounded-lg max-md:grid-cols-[1fr_1fr] max-sm:grid-cols-1">
                    <input value={field.label} onChange={e => updateField(i, 'label', e.target.value)} placeholder="Label" className={`${inpClass} text-xs py-[7px] px-2.5`} />
                    <input value={field.name} onChange={e => updateField(i, 'name', e.target.value)} placeholder="field_name" className={`${inpClass} text-xs py-[7px] px-2.5 font-mono`} />
                    <select value={field.type} onChange={e => updateField(i, 'type', e.target.value)} className={`${inpClass} text-xs py-[7px] px-2.5`}>
                      {['text', 'email', 'phone', 'textarea', 'select'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-text-2">
                      <input type="checkbox" checked={field.required} onChange={e => updateField(i, 'required', e.target.checked)} className="accent-primary" />
                      Required
                    </label>
                    <button onClick={() => removeField(i)} className="p-2 rounded-md border-none bg-transparent cursor-pointer text-text-3 transition-colors hover:text-[#ff4d6d]">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {newForm.fields.length === 0 && (
                  <p className="text-center text-text-3 text-[13px] p-4">Add fields above</p>
                )}
              </div>
            </div>

            <div className="flex gap-2.5">
              <button onClick={save} className="py-2.5 px-6 rounded-lg border-none bg-[color:var(--blue)] text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90">Create Form</button>
              <button onClick={() => setCreating(false)} className="py-2.5 px-[18px] rounded-lg border border-border bg-transparent text-text-3 text-[13px] cursor-pointer transition-colors hover:bg-bg-3">Cancel</button>
            </div>
          </div>
        )}

        {/* Forms list */}
        <div className="flex flex-col gap-3">
          {loading ? <div className="p-10 text-center text-text-3">Loading…</div> :
          forms.length === 0 ? <div className="p-[60px] text-center bg-bg-2 border border-dashed border-border rounded-2xl text-text-3">No forms yet. Create one above.</div> :
          forms.map(form => (
            <div key={form._id} className="bg-bg-2 border border-border rounded-[14px] p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-display text-[15px] font-bold text-white mb-1">{form.name}</p>
                <div className="flex gap-3 items-center">
                  <span className="font-mono text-[11px] text-text-3">{form.fields?.length || 0} fields</span>
                  <span className="font-mono text-[11px] text-text-3">→ {form.emailTo}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copyEmbedCode(form._id)} title="Copy embed code" className="flex items-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-transparent text-text-3 cursor-pointer text-xs font-display transition-colors hover:text-white hover:bg-bg-3">
                  <Copy size={12} /> Embed Code
                </button>
                <button onClick={() => del(form._id)} className="py-2 px-2.5 rounded-lg border border-border bg-transparent cursor-pointer text-text-3 flex items-center transition-colors hover:border-[rgba(255,77,109,0.4)] hover:text-[#ff4d6d]">
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
