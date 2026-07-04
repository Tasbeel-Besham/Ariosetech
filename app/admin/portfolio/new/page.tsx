'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/layout/AdminShell'
import { Save, ArrowLeft, Plus, Trash2 } from '@/components/ui/Icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MediaPickerModal } from '@/components/ui/MediaPickerModal'

type Result = { label: string; value: string }

const CATS = ['wordpress', 'woocommerce', 'shopify', 'seo']

export default function NewPortfolio() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [isCustomCat, setIsCustomCat] = useState(false)
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

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"
  const cardClass = "bg-bg-2 border border-border rounded-[14px] p-6 mb-5"

  return (
    <AdminShell>
      <div className="p-8 max-w-[860px]">
        <div className="flex justify-between items-center mb-7 flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <Link href="/admin/portfolio" className="flex items-center gap-1.5 text-text-3 no-underline text-[13px] font-mono transition-colors hover:text-white">
              <ArrowLeft size={14} /> Back
            </Link>
            <div>
              <h1 className="admin-page__title">New Project</h1>
              <p className="admin-page__subtitle">Add a portfolio case study</p>
            </div>
          </div>
          <div className="flex gap-2.5 items-center">
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-2 transition-colors hover:text-white">
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="w-3.5 h-3.5 accent-primary" />
              Published
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-2 transition-colors hover:text-white">
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-3.5 h-3.5 accent-primary" />
              Featured
            </label>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md ml-2">
              <Save size={14} /> {saving ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="font-display text-sm font-bold text-white mb-4.5">Basic Information</h2>
          <div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
            <div><label className={lblClass}>Project Title *</label><input value={form.title} onChange={e => set('title', e.target.value)} className={inpClass} placeholder="The Kapra" /></div>
            <div><label className={lblClass}>Client Name *</label><input value={form.client} onChange={e => set('client', e.target.value)} className={inpClass} placeholder="Client Company" /></div>
            <div><label className={lblClass}>Slug</label><input value={form.slug} onChange={e => set('slug', e.target.value)} className={`${inpClass} font-mono text-xs`} placeholder="auto-generated" /></div>
            <div><label className={lblClass}>Client Website</label><input value={form.clientUrl} onChange={e => set('clientUrl', e.target.value)} className={inpClass} placeholder="https://client.com" /></div>
            <div>
              <label className={lblClass}>Category</label>
              <div className="flex gap-1.5">
                <select 
                  value={isCustomCat ? 'new' : (CATS.includes(form.category) ? form.category : (form.category ? form.category : ''))}
                  onChange={e => {
                    if (e.target.value === 'new') {
                      setIsCustomCat(true)
                      set('category', '')
                    } else {
                      setIsCustomCat(false)
                      set('category', e.target.value)
                    }
                  }}
                  className={`${inpClass} ${isCustomCat ? 'flex-none w-[130px]' : 'flex-1 w-auto'}`}
                >
                  <option value="" disabled>Select...</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  {!CATS.includes(form.category) && form.category && !isCustomCat && <option value={form.category}>{form.category}</option>}
                  <option value="new">+ Custom...</option>
                </select>
                {isCustomCat && (
                  <input 
                    value={form.category} 
                    onChange={e => set('category', e.target.value)} 
                    className={`${inpClass} flex-1`} 
                    placeholder="Type custom category..." 
                    autoFocus
                  />
                )}
              </div>
            </div>
            <div>
              <label className={lblClass}>Cover Image URL</label>
              <div className="flex gap-1.5">
                <input value={form.image} onChange={e => set('image', e.target.value)} className={`${inpClass} flex-1`} placeholder="https://… or /image.jpg" />
                <button onClick={() => setShowMediaModal(true)} className="px-2.5 bg-bg-3 border border-border rounded-sm text-white cursor-pointer text-[11px] whitespace-nowrap hover:bg-white/5 transition-colors">
                  Library
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="font-display text-sm font-bold text-white mb-4.5">Content</h2>
          <div className="flex flex-col gap-3.5">
            <div><label className={lblClass}>Summary</label><textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={3} className={`${inpClass} resize-y`} /></div>
            <div><label className={lblClass}>The Challenge</label><textarea value={form.challenge} onChange={e => set('challenge', e.target.value)} rows={4} className={`${inpClass} resize-y`} /></div>
            <div><label className={lblClass}>Our Solution</label><textarea value={form.solution} onChange={e => set('solution', e.target.value)} rows={4} className={`${inpClass} resize-y`} /></div>
            <div><label className={lblClass}>Client Quote</label><textarea value={form.quote} onChange={e => set('quote', e.target.value)} rows={2} className={`${inpClass} resize-y`} /></div>
            <div><label className={lblClass}>Tech Stack (comma separated)</label><input value={form.stack} onChange={e => set('stack', e.target.value)} className={inpClass} placeholder="WordPress, WooCommerce, PHP" /></div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-sm font-bold text-white">Results / Stats</h2>
            <button onClick={addResult} className="btn btn-outline btn-sm"><Plus size={12} /> Add Result</button>
          </div>
          {results.length === 0 ? (
            <p className="text-[13px] text-text-3 text-center py-4">No results yet. Add stats like &quot;+300% Revenue&quot;.</p>
          ) : results.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2.5 items-end mb-2.5 max-sm:grid-cols-[1fr_auto]">
              <div className="max-sm:col-span-2"><label className={lblClass}>Value</label><input value={r.value} onChange={e => updateResult(i, 'value', e.target.value)} className={inpClass} placeholder="+300%" /></div>
              <div className="max-sm:col-span-1"><label className={lblClass}>Label</label><input value={r.label} onChange={e => updateResult(i, 'label', e.target.value)} className={inpClass} placeholder="Revenue Growth" /></div>
              <button onClick={() => removeResult(i)} className="bg-transparent border-none text-text-3 cursor-pointer py-2.5 px-1.5 transition-colors hover:text-[#ff4d6d]">
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
