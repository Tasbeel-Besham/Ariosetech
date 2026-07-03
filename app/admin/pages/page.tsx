'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Pencil, Trash2, Eye, Settings, Copy, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

type Page = { _id: string; title: string; slug: string; fullPath: string; status: string; updatedAt: string; seo?: { title?: string; description?: string } }

export default function PagesAdmin() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [editSeo, setEditSeo] = useState<Page | null>(null)
  const [seoForm, setSeoForm] = useState({ title: '', description: '', slug: '' })

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/pages')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPages(d); else setPages([]) })
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const runSeed = async () => {
    setSeeding(true)
    const secret = prompt('Enter your ADMIN_JWT_SECRET to seed the database:')
    if (!secret) { setSeeding(false); return }
    const res = await fetch(`/api/seed?secret=${secret}`, { method: 'POST' })
    setSeeding(false)
    if (res.ok) { toast.success('Database seeded! All pages loaded.'); load() }
    else toast.error('Seed failed — check your secret')
  }

  const createPage = async () => {
    if (!newTitle || !newSlug) return
    const res = await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle, slug: newSlug }) })
    if (res.ok) { toast.success('Page created'); setCreating(false); setNewTitle(''); setNewSlug(''); load() }
    else { const { error } = await res.json(); toast.error(error || 'Failed') }
  }

  const duplicatePage = async (page: Page) => {
    const dupSlug = `${page.slug || 'page'}-copy-${Date.now().toString(36)}`
    const res = await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: `${page.title} (Copy)`, slug: dupSlug }) })
    if (res.ok) { toast.success('Page duplicated'); load() }
    else { const { error } = await res.json(); toast.error(error || 'Duplicate failed') }
  }

  const deletePage = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch(`/api/pages/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  const openSeo = (page: Page) => {
    setEditSeo(page)
    setSeoForm({ title: page.seo?.title || '', description: page.seo?.description || '', slug: page.slug || '' })
  }

  const saveSeo = async () => {
    if (!editSeo) return
    const res = await fetch(`/api/pages/${editSeo._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: seoForm.slug, seo: { title: seoForm.title, description: seoForm.description, robots: { index: true, follow: true } } }) })
    if (res.ok) { toast.success('SEO saved'); setEditSeo(null); load() }
    else toast.error('Save failed')
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-md py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"

  return (
    <AdminShell>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Pages</h1>
            <p className="admin-page__subtitle">{pages.length} pages in database · Build layouts with the page builder</p>
          </div>
          <div className="flex gap-2.5">
            <button onClick={runSeed} disabled={seeding} className="btn btn-outline btn-md">
              <RefreshCw size={14} className={seeding ? 'animate-spin' : ''} />
              {seeding ? 'Seeding…' : 'Seed DB'}
            </button>
            <button onClick={() => setCreating(true)} className="btn btn-primary btn-md">
              <Plus size={14} /> New Page
            </button>
          </div>
        </div>

        {/* Create form */}
        {creating && (
          <div className="bg-bg-2 border border-[rgba(118,108,255,0.3)] rounded-2xl p-6 mb-5">
            <h3 className="font-display text-[15px] font-bold text-white mb-4">New Page</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={lblClass}>Title</label>
                <input value={newTitle} onChange={e => { setNewTitle(e.target.value); if (!newSlug) setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) }} placeholder="About Us" className={inpClass} />
              </div>
              <div>
                <label className={lblClass}>Slug</label>
                <input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="about-us" className={`${inpClass} font-mono`} />
              </div>
            </div>
            <div className="flex gap-2.5">
              <button onClick={createPage} className="btn btn-primary btn-md">Create</button>
              <button onClick={() => setCreating(false)} className="btn btn-outline btn-md">Cancel</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-bg-2 border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-text-3">
              <div className="w-8 h-8 rounded-full border-[3px] border-border border-t-primary animate-spin mx-auto mb-3" />
              Loading pages…
            </div>
          ) : pages.length === 0 ? (
            <div className="p-[60px] text-center">
              <p className="text-text-3 mb-4">No pages in database.</p>
              <p className="font-mono text-xs text-text-3 mb-5">Run the seed to populate all pages from the frontend:</p>
              <button onClick={runSeed} disabled={seeding} className="btn btn-primary btn-lg mx-auto">
                <RefreshCw size={15} /> Seed Database
              </button>
            </div>
          ) : (
            <table className="admin-table">
              <thead><tr>
                {['Title', 'Path', 'SEO Title', 'Status', 'Updated', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr></thead>
              <tbody>
                {pages.map(page => (
                  <tr key={page._id}>
                    <td className="font-display font-semibold text-white">{page.title}</td>
                    <td><code className="font-mono text-[11px] text-text-3">{page.fullPath}</code></td>
                    <td className="text-xs">
                      {page.seo?.title ? <span className="text-text-2">{page.seo.title.slice(0, 40)}</span> : <span className="text-amber-400 text-[11px]">⚠ Missing</span>}
                    </td>
                    <td><span className={`status-badge status-badge--${page.status}`}>{page.status}</span></td>
                    <td className="font-mono text-[11px] text-text-3">{new Date(page.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-1 items-center">
                        <Link href={`/admin/builder/${page._id}`} className="btn btn-outline btn-sm"><Pencil size={11} /> Builder</Link>
                        <button onClick={() => openSeo(page)} className="btn btn-ghost btn-sm" title="SEO"><Settings size={13} /></button>
                        <button onClick={() => duplicatePage(page)} className="btn btn-ghost btn-sm" title="Duplicate"><Copy size={13} /></button>
                        <Link href={page.fullPath || '/'} target="_blank" className="btn btn-ghost btn-sm" title="View"><Eye size={13} /></Link>
                        <button onClick={() => deletePage(page._id, page.title)} className="btn btn-ghost btn-sm text-[color:var(--red)]" title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="info-box mt-4">
          💡 <strong>Single source of truth:</strong> All pages are stored in MongoDB. The frontend reads from the same database. Run the seed to populate all 9 default pages: <code className="font-mono text-primary">POST /api/seed?secret=YOUR_JWT_SECRET</code>
        </div>
      </div>

      {/* SEO Modal */}
      {editSeo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200] flex items-center justify-center p-5" onClick={() => setEditSeo(null)}>
          <div className="bg-bg-2 border border-border-2 rounded-[20px] w-full max-w-[560px] max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="py-5 px-6 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="font-display text-[17px] font-extrabold text-white">SEO & URL Settings</h2>
                <p className="font-mono text-[10px] text-text-3 mt-1">{editSeo.fullPath}</p>
              </div>
              <button onClick={() => setEditSeo(null)} className="bg-transparent border-none text-text-3 cursor-pointer text-lg hover:text-white">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div><label className={lblClass}>Slug</label>
                <div className="flex items-center border border-border rounded-md overflow-hidden bg-bg-3">
                  <span className="py-2.5 px-3 font-mono text-[11px] text-text-3 bg-bg-4 border-r border-border whitespace-nowrap">ariosetech.com/</span>
                  <input value={seoForm.slug} onChange={e => setSeoForm(f => ({ ...f, slug: e.target.value }))} className={`${inpClass} border-none bg-transparent font-mono`} />
                </div>
              </div>
              <div><label className={lblClass}>SEO Title <span className="text-text-3">(50-60 chars)</span></label>
                <input value={seoForm.title} onChange={e => setSeoForm(f => ({ ...f, title: e.target.value }))} placeholder={`${editSeo.title} | ARIOSETECH`} className={inpClass} />
                <p className={`font-mono text-[10px] ${seoForm.title.length > 60 ? 'text-[color:var(--red)]' : 'text-text-3'} mt-1`}>{seoForm.title.length}/60</p>
              </div>
              <div><label className={lblClass}>Meta Description <span className="text-text-3">(150-160 chars)</span></label>
                <textarea value={seoForm.description} onChange={e => setSeoForm(f => ({ ...f, description: e.target.value }))} rows={3} className={`${inpClass} resize-y`} />
                <p className={`font-mono text-[10px] ${seoForm.description.length > 160 ? 'text-[color:var(--red)]' : 'text-text-3'} mt-1`}>{seoForm.description.length}/160</p>
              </div>
              {/* Google preview */}
              {(seoForm.title || editSeo.title) && (
                <div className="bg-white rounded-xl p-3.5">
                  <p className="text-[13px] text-[#1a0dab] font-medium mb-0.5 font-[Arial]">{seoForm.title || `${editSeo.title} | ARIOSETECH`}</p>
                  <p className="text-[11px] text-[#006621] mb-1 font-[Arial]">ariosetech.com{editSeo.fullPath}</p>
                  <p className="text-[12px] text-[#545454] font-[Arial] leading-[1.4]">{seoForm.description || 'No meta description set.'}</p>
                </div>
              )}
              <div className="flex gap-2.5 justify-end">
                <button onClick={() => setEditSeo(null)} className="btn btn-outline btn-md">Cancel</button>
                <button onClick={saveSeo} className="btn btn-primary btn-md">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
