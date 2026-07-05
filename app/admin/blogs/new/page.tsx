'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/layout/AdminShell'
import { ArrowLeft, Save, Eye } from '@/components/ui/Icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MediaPickerModal } from '@/components/ui/MediaPickerModal'
import BlogBlockEditor from '@/components/admin/BlogBlockEditor'
import type { BlogBlock } from '@/types'

const CATEGORIES = ['E-Commerce', 'WordPress', 'WooCommerce', 'Shopify', 'SEO', 'Performance', 'Security', 'General']

export default function NewBlogPost() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'WordPress',
    author: 'ARIOSETECH Team',
    date: new Date().toISOString().split('T')[0],
    readTime: 5,
    tags: '',
    published: false,
    content: [{ type: 'p', text: '' }] as BlogBlock[],
    seo: { title: '', description: '', keywords: '', ogImage: '' },
  })

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))
  const setSeo = (key: string, val: string) => setForm(f => ({ ...f, seo: { ...f.seo, [key]: val } }))

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const save = async (publish = false) => {
    if (!form.title || !form.slug) return toast.error('Title and slug are required')
    setSaving(true)
    const res = await fetch('/api/blogs', {
      method: 'POST',
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
    if (res.ok) {
      toast.success(publish ? 'Published!' : 'Draft saved!')
      router.push('/admin/blogs')
    } else {
      const { error } = await res.json()
      toast.error(error || 'Failed to save')
    }
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"
  const cardClass = "bg-bg-2 border border-border rounded-2xl p-6 mb-5"

  return (
    <AdminShell>
      <div className="max-w-[900px] mx-auto p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/blogs" className="flex items-center gap-1.5 text-text-3 no-underline text-[13px] transition-colors hover:text-white">
              <ArrowLeft size={14} /> Blogs
            </Link>
            <span className="text-border-2">/</span>
            <h1 className="font-display text-[20px] font-extrabold text-white tracking-tight">New Post</h1>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => save(false)} disabled={saving} className="flex items-center gap-1.5 py-2.5 px-[18px] rounded-lg border border-border bg-transparent text-text-2 text-[13px] font-semibold cursor-pointer font-display transition-colors hover:bg-bg-3">
              <Save size={14} /> Save Draft
            </button>
            <button onClick={() => save(true)} disabled={saving} className="flex items-center gap-1.5 py-2.5 px-[18px] rounded-lg border-none bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90 disabled:opacity-70">
              <Eye size={14} /> {saving ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">Post Details</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={lblClass}>Title *</label>
              <input value={form.title} onChange={e => { set('title', e.target.value); if (!form.slug) set('slug', autoSlug(e.target.value)) }}
                placeholder="e.g. How to Speed Up Your WordPress Site"
                className={`${inpClass} text-base font-semibold`} />
            </div>
            <div className="flex items-center bg-bg-3 border border-border rounded-lg overflow-hidden">
              <span className="py-2.5 px-3.5 font-mono text-xs text-text-3 bg-bg-4 border-r border-border whitespace-nowrap">ariosetech.com/blog/</span>
              <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="post-url-slug" className={`${inpClass} border-none rounded-none bg-transparent font-mono`} />
            </div>
            <div>
              <label className={lblClass}>Excerpt (shown on listing pages) *</label>
              <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} placeholder="Brief summary of the post…" className={`${inpClass} resize-y`} />
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr_80px] gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
              <div>
                <label className={lblClass}>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className={inpClass}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lblClass}>Author</label>
                <input value={form.author} onChange={e => set('author', e.target.value)} className={inpClass} />
              </div>
              <div>
                <label className={lblClass}>Publish Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inpClass} />
              </div>
              <div>
                <label className={lblClass}>Read (min)</label>
                <input type="number" value={form.readTime} onChange={e => set('readTime', e.target.value)} min={1} max={60} className={inpClass} />
              </div>
            </div>
            <div>
              <label className={lblClass}>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="WordPress, Speed, Performance" className={inpClass} />
            </div>
          </div>
        </div>

        {/* Content editor */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">Content</h2>
          <BlogBlockEditor blocks={form.content} onChange={blocks => set('content', blocks)} />
        </div>

        {/* SEO */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">SEO Settings</h2>
          <div className="flex flex-col gap-3.5">
            <div>
              <label className={lblClass}>SEO Title <span className="text-text-3 font-normal">(50-60 chars recommended)</span></label>
              <input value={form.seo.title} onChange={e => setSeo('title', e.target.value)} placeholder={form.title || 'Post title'} className={inpClass} />
              <p className={`font-mono text-[10px] mt-1 ${form.seo.title.length > 60 ? 'text-[#ff4d6d]' : 'text-text-3'}`}>{form.seo.title.length}/60</p>
            </div>
            <div>
              <label className={lblClass}>Meta Description <span className="text-text-3 font-normal">(150-160 chars recommended)</span></label>
              <textarea value={form.seo.description} onChange={e => setSeo('description', e.target.value)} rows={2} placeholder={form.excerpt || 'Describe this post for search engines…'} className={`${inpClass} resize-y`} />
              <p className={`font-mono text-[10px] mt-1 ${form.seo.description.length > 160 ? 'text-[#ff4d6d]' : 'text-text-3'}`}>{form.seo.description.length}/160</p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
              <div>
                <label className={lblClass}>Focus Keywords (comma separated)</label>
                <input value={form.seo.keywords} onChange={e => setSeo('keywords', e.target.value)} placeholder="wordpress speed, site optimization" className={inpClass} />
              </div>
              <div>
                <label className={lblClass}>OG Image URL</label>
                <div className="flex gap-1.5">
                  <input value={form.seo.ogImage} onChange={e => setSeo('ogImage', e.target.value)} placeholder="https://ariosetech.com/images/post.jpg" className={`${inpClass} flex-1`} />
                  <button onClick={() => setShowMediaModal(true)} className="px-2.5 bg-bg-3 border border-border rounded-sm text-white cursor-pointer text-[11px] whitespace-nowrap hover:bg-white/5 transition-colors">
                    Library
                  </button>
                </div>
              </div>
            </div>

            {/* Google preview */}
            {(form.seo.title || form.title) && (
              <div className="bg-bg-3 border border-border rounded-lg p-4">
                <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider mb-2.5">Google Preview</p>
                <div className="bg-white rounded-lg p-3.5">
                  <p className="text-[14px] text-[#1a0dab] font-medium mb-0.5 font-[Arial,sans-serif]">
                    {form.seo.title || form.title} | ARIOSETECH
                  </p>
                  <p className="text-[12px] text-[#006621] mb-1 font-[Arial,sans-serif]">
                    ariosetech.com/blog/{form.slug || 'post-slug'}
                  </p>
                  <p className="text-[13px] text-[#545454] leading-[1.5] font-[Arial,sans-serif]">
                    {form.seo.description || form.excerpt || 'No description set.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom save */}
        <div className="flex gap-2.5 justify-end">
          <Link href="/admin/blogs" className="py-2.5 px-5 rounded-lg border border-border bg-transparent text-text-3 text-[13px] no-underline flex items-center transition-colors hover:bg-bg-3">Cancel</Link>
          <button onClick={() => save(false)} disabled={saving} className="py-2.5 px-5 rounded-lg border border-border bg-transparent text-text-2 text-[13px] font-semibold cursor-pointer font-display transition-colors hover:bg-bg-3">
            Save Draft
          </button>
          <button onClick={() => save(true)} disabled={saving} className="py-2.5 px-6 rounded-lg border-none bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90 disabled:opacity-70">
            {saving ? 'Publishing…' : 'Publish Post'}
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
