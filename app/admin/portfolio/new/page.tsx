'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/layout/AdminShell'
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MediaPickerModal } from '@/components/ui/MediaPickerModal'

type Result = { label: string; value: string }

const CATS = ['wordpress', 'woocommerce', 'shopify', 'seo']

export default function NewPortfolio() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [form, setForm] = useState({
    title: '', client: '', clientUrl: '', slug: '', category: 'wordpress',
    summary: '', challenge: '', solution: '', quote: '', stack: '', image: '',
    featured: false, published: true,
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const addResult    = () => setResults(r => [...r, { label: '', value: '' }])
  const removeResult = (i: number) => setResults(r => r.filter((_, j) => j !== i))
  const updateResult = (i: number, k: keyof Result, v: string) =>
    setResults(r => r.map((item, j) => j === i ? { ...item, [k]: v } : item))

  const save = async () => {
    if (!form.title || !form.client) return toast.error('Title and client are required')
    setSaving(true)
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form, slug,
        stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
        results,
        updatedAt: new Date().toISOString(),
      }),
    })
    setSaving(false)
    if (res.ok) { toast.success('Created!'); router.push('/admin/portfolio') }
    else { const d = await res.json(); toast.error(d.error || 'Failed') }
  }

  const inp: React.CSSProperties = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)', transition: 'border-color 0.15s' }
  const lbl: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }
  const card: React.CSSProperties = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }
  const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')
  const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = 'var(--border)')

  return (
    <AdminShell>
      <div style={{ padding: '32px', maxWidth: '860px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link href="/admin/portfolio" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', textDecoration: 'none', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
              <ArrowLeft size={14} /> Back
            </Link>
            <div>
              <h1 className="admin-page__title">New Project</h1>
              <p className="admin-page__subtitle">Add a portfolio case study</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-2)' }}>
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} style={{ width: '14px', height: '14px' }} />
              Published
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-2)' }}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: '14px', height: '14px' }} />
              Featured
            </label>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
              <Save size={14} /> {saving ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '18px' }}>Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div><label style={lbl}>Project Title *</label><input value={form.title} onChange={e => set('title', e.target.value)} style={inp} onFocus={onF} onBlur={onB} placeholder="The Kapra" /></div>
            <div><label style={lbl}>Client Name *</label><input value={form.client} onChange={e => set('client', e.target.value)} style={inp} onFocus={onF} onBlur={onB} placeholder="Client Company" /></div>
            <div><label style={lbl}>Slug</label><input value={form.slug} onChange={e => set('slug', e.target.value)} style={{ ...inp, fontFamily: 'var(--font-mono)', fontSize: '12px' }} onFocus={onF} onBlur={onB} placeholder="auto-generated" /></div>
            <div><label style={lbl}>Client Website</label><input value={form.clientUrl} onChange={e => set('clientUrl', e.target.value)} style={inp} onFocus={onF} onBlur={onB} placeholder="https://client.com" /></div>
            <div>
              <label style={lbl}>Category</label>
              <input list="cat-list" value={form.category} onChange={e => set('category', e.target.value)} style={inp} onFocus={onF} onBlur={onB} placeholder="e.g. ecommerce" />
              <datalist id="cat-list">
                {CATS.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label style={lbl}>Cover Image URL</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input value={form.image} onChange={e => set('image', e.target.value)} style={{...inp, flex: 1}} onFocus={onF} onBlur={onB} placeholder="https://… or /image.jpg" />
                <button onClick={() => setShowMediaModal(true)} style={{ padding: '0 10px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text)', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  Library
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '18px' }}>Content</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div><label style={lbl}>Summary</label><textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} onFocus={onF} onBlur={onB} /></div>
            <div><label style={lbl}>The Challenge</label><textarea value={form.challenge} onChange={e => set('challenge', e.target.value)} rows={4} style={{ ...inp, resize: 'vertical' }} onFocus={onF} onBlur={onB} /></div>
            <div><label style={lbl}>Our Solution</label><textarea value={form.solution} onChange={e => set('solution', e.target.value)} rows={4} style={{ ...inp, resize: 'vertical' }} onFocus={onF} onBlur={onB} /></div>
            <div><label style={lbl}>Client Quote</label><textarea value={form.quote} onChange={e => set('quote', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} onFocus={onF} onBlur={onB} /></div>
            <div><label style={lbl}>Tech Stack (comma separated)</label><input value={form.stack} onChange={e => set('stack', e.target.value)} style={inp} onFocus={onF} onBlur={onB} placeholder="WordPress, WooCommerce, PHP" /></div>
          </div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Results / Stats</h2>
            <button onClick={addResult} className="btn btn-outline btn-sm"><Plus size={12} /> Add Result</button>
          </div>
          {results.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-3)', textAlign: 'center', padding: '16px 0' }}>No results yet. Add stats like &quot;+300% Revenue&quot;.</p>
          ) : results.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'end', marginBottom: '10px' }}>
              <div><label style={lbl}>Value</label><input value={r.value} onChange={e => updateResult(i, 'value', e.target.value)} style={inp} onFocus={onF} onBlur={onB} placeholder="+300%" /></div>
              <div><label style={lbl}>Label</label><input value={r.label} onChange={e => updateResult(i, 'label', e.target.value)} style={inp} onFocus={onF} onBlur={onB} placeholder="Revenue Growth" /></div>
              <button onClick={() => removeResult(i)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '10px 6px' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        {showMediaModal && (
          <MediaPickerModal 
            onClose={() => setShowMediaModal(false)}
            onSelect={(url) => { set('image', url); setShowMediaModal(false) }}
          />
        )}
      </div>
    </AdminShell>
  )
}
