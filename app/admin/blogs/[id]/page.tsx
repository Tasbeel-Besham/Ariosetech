'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminShell from '@/components/layout/AdminShell'
import { ArrowLeft, Save, Eye } from '@/components/ui/Icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MediaPickerModal } from '@/components/ui/MediaPickerModal'
import BlogRichEditor from '@/components/admin/BlogRichEditor'
import type { BlogBlock } from '@/types'

const CATEGORIES = ['E-Commerce', 'WordPress', 'WooCommerce', 'Shopify', 'SEO', 'Performance', 'Security', 'General']

export default function EditBlogPost() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', category: 'WordPress',
    author: 'ARIOSETECH Team', date: new Date().toISOString().split('T')[0],
    readTime: 5, tags: '', published: false,
    content: [] as BlogBlock[],
    seo: { title: '', description: '', keywords: '', ogImage: '' },
  })

  useEffect(() => {
    fetch(`/api/blogs/${id}`).then(r => r.json()).then(data => {
      setForm({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        category: data.category || 'WordPress',
        author: data.author || 'ARIOSETECH Team',
        date: data.date || new Date().toISOString().split('T')[0],
        readTime: data.readTime || data.readingTime || 5,
        tags: (data.tags || []).join(', '),
        published: data.published || false,
        content: data.content || [],
        seo: {
          title: data.seo?.title || '',
          description: data.seo?.description || '',
          keywords: (data.seo?.keywords || []).join(', '),
          ogImage: data.seo?.ogImage || '',
        },
      })
    }).finally(() => setLoading(false))
  }, [id])

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))
  const setSeo = (key: string, val: string) => setForm(f => ({ ...f, seo: { ...f.seo, [key]: val } }))

  const save = async (publish: boolean) => {
    setSaving(true)
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        published: publish,
        status: publish ? 'published' : 'draft',
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        readTime: Number(form.readTime),
        seo: {
          ...form.seo,
          keywords: form.seo.keywords.split(',').map(k => k.trim()).filter(Boolean),
          robots: { index: true, follow: true },
        },
        updatedAt: new Date().toISOString(),
      }),
    })
    setSaving(false)
    if (res.ok) { toast.success(publish ? 'Published!' : 'Saved!') }
    else { const { error } = await res.json(); toast.error(error || 'Failed') }
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"
  const cardClass = "bg-bg-2 border border-border rounded-2xl p-6 mb-5"

  if (loading) return <AdminShell><div className="p-10 text-center text-text-3">Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div className="max-w-[900px] mx-auto p-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/blogs" className="flex items-center gap-1.5 text-text-3 no-underline text-[13px] transition-colors hover:text-white">
              <ArrowLeft size={14} /> Blogs
            </Link>
            <span className="text-border-2">/</span>
            <h1 className="font-display text-[20px] font-extrabold text-white tracking-tight">Edit Post</h1>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => save(false)} disabled={saving} className="flex items-center gap-1.5 py-2.5 px-[18px] rounded-lg border border-border bg-transparent text-text-2 text-[13px] font-semibold cursor-pointer font-display transition-colors hover:bg-bg-3">
              <Save size={14} /> Save
            </button>
            <button onClick={() => save(true)} disabled={saving} className="flex items-center gap-1.5 py-2.5 px-[18px] rounded-lg border-none bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90 disabled:opacity-70">
              <Eye size={14} /> {saving ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">Post Details</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={lblClass}>Title</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} className={`${inpClass} text-base font-semibold`} />
            </div>
            <div className="flex items-center bg-bg-3 border border-border rounded-lg overflow-hidden">
              <span className="py-2.5 px-3.5 font-mono text-xs text-text-3 bg-bg-4 border-r border-border whitespace-nowrap">ariosetech.com/blog/</span>
              <input value={form.slug} onChange={e => set('slug', e.target.value)} className={`${inpClass} border-none rounded-none bg-transparent font-mono`} />
            </div>
            <div>
              <label className={lblClass}>Excerpt</label>
              <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} className={`${inpClass} resize-y`} />
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr_80px] gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
              <div><label className={lblClass}>Category</label><select value={form.category} onChange={e => set('category', e.target.value)} className={inpClass}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className={lblClass}>Author</label><input value={form.author} onChange={e => set('author', e.target.value)} className={inpClass} /></div>
              <div><label className={lblClass}>Date</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inpClass} /></div>
              <div><label className={lblClass}>Read (min)</label><input type="number" value={form.readTime} onChange={e => set('readTime', e.target.value)} min={1} className={inpClass} /></div>
            </div>
            <div><label className={lblClass}>Tags</label><input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="WordPress, Speed" className={inpClass} /></div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">Content</h2>
          <BlogRichEditor blocks={form.content} onChange={blocks => set('content', blocks)} />
        </div>

        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">SEO</h2>
          <div className="flex flex-col gap-3.5">
            <div>
              <label className={lblClass}>SEO Title</label>
              <input value={form.seo.title} onChange={e => setSeo('title', e.target.value)} className={inpClass} />
              <p className={`font-mono text-[10px] mt-1 ${form.seo.title.length > 60 ? 'text-[#ff4d6d]' : 'text-text-3'}`}>{form.seo.title.length}/60</p>
            </div>
            <div>
              <label className={lblClass}>Meta Description</label>
              <textarea value={form.seo.description} onChange={e => setSeo('description', e.target.value)} rows={2} className={`${inpClass} resize-y`} />
              <p className={`font-mono text-[10px] mt-1 ${form.seo.description.length > 160 ? 'text-[#ff4d6d]' : 'text-text-3'}`}>{form.seo.description.length}/160</p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
              <div><label className={lblClass}>Keywords</label><input value={form.seo.keywords} onChange={e => setSeo('keywords', e.target.value)} placeholder="wordpress, speed" className={inpClass} /></div>
              <div>
                <label className={lblClass}>OG Image URL</label>
                <div className="flex gap-1.5">
                  <input value={form.seo.ogImage} onChange={e => setSeo('ogImage', e.target.value)} className={`${inpClass} flex-1`} />
                  <button onClick={() => setShowMediaModal(true)} className="px-2.5 bg-bg-3 border border-border rounded-sm text-white cursor-pointer text-[11px] whitespace-nowrap hover:bg-white/5 transition-colors">
                    Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 justify-end">
          <Link href="/admin/blogs" className="py-2.5 px-5 rounded-lg border border-border bg-transparent text-text-3 text-[13px] no-underline flex items-center transition-colors hover:bg-bg-3">Cancel</Link>
          <button onClick={() => save(false)} disabled={saving} className="py-2.5 px-5 rounded-lg border border-border bg-transparent text-text-2 text-[13px] font-semibold cursor-pointer font-display transition-colors hover:bg-bg-3">Save Draft</button>
          <button onClick={() => save(true)} disabled={saving} className="py-2.5 px-6 rounded-lg border-none bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90 disabled:opacity-70">
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>

        {showMediaModal && (
          <MediaPickerModal 
            onClose={() => setShowMediaModal(false)}
            onSelect={(url) => { setSeo('ogImage', url); setShowMediaModal(false) }}
          />
        )}
      </div>
    </AdminShell>
  )
}
