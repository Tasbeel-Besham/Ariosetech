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

  const inp: React.CSSProperties = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
  const lbl: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }

  return (
    <AdminShell>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Pages</h1>
            <p className="admin-page__subtitle">{pages.length} pages in database · Build layouts with the page builder</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {pages.length === 0 && (
              <button onClick={runSeed} disabled={seeding} className="btn btn-outline btn-md">
                <RefreshCw size={14} style={{ animation: seeding ? 'spin 1s linear infinite' : 'none' }} />
                {seeding ? 'Seeding…' : 'Seed DB'}
              </button>
            )}
            <button onClick={() => setCreating(true)} className="btn btn-primary btn-md">
              <Plus size={14} /> New Page
            </button>
          </div>
        </div>

        {/* Create form */}
        {creating && (
          <div style={{ background: 'var(--bg-2)', border: '1px solid rgba(118,108,255,0.3)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>New Page</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div><label style={lbl}>Title</label><input value={newTitle} onChange={e => { setNewTitle(e.target.value); if (!newSlug) setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) }} placeholder="About Us" style={inp} /></div>
              <div><label style={lbl}>Slug</label><input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="about-us" style={{ ...inp, fontFamily: 'var(--font-mono)' }} /></div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={createPage} className="btn btn-primary btn-md">Create</button>
              <button onClick={() => setCreating(false)} className="btn btn-outline btn-md">Cancel</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              Loading pages…
            </div>
          ) : pages.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-3)', marginBottom: '16px' }}>No pages in database.</p>
              <p style={{ ...{ fontFamily: 'var(--font-mono)' }, fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px' }}>Run the seed to populate all pages from the frontend:</p>
              <button onClick={runSeed} disabled={seeding} className="btn btn-primary btn-lg">
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
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)' }}>{page.title}</td>
                    <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>{page.fullPath}</code></td>
                    <td style={{ fontSize: '12px' }}>
                      {page.seo?.title ? <span style={{ color: 'var(--text-2)' }}>{page.seo.title.slice(0, 40)}</span> : <span style={{ color: 'var(--amber)', fontSize: '11px' }}>⚠ Missing</span>}
                    </td>
                    <td><span className={`status-badge status-badge--${page.status}`}>{page.status}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>{new Date(page.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <Link href={`/admin/builder/${page._id}`} className="btn btn-outline btn-sm"><Pencil size={11} /> Builder</Link>
                        <button onClick={() => openSeo(page)} className="btn btn-ghost btn-sm" title="SEO"><Settings size={13} /></button>
                        <button onClick={() => duplicatePage(page)} className="btn btn-ghost btn-sm" title="Duplicate"><Copy size={13} /></button>
                        <Link href={page.fullPath || '/'} target="_blank" className="btn btn-ghost btn-sm" title="View"><Eye size={13} /></Link>
                        <button onClick={() => deletePage(page._id, page.title)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="info-box" style={{ marginTop: '16px' }}>
          💡 <strong>Single source of truth:</strong> All pages are stored in MongoDB. The frontend reads from the same database. Run the seed to populate all 9 default pages: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>POST /api/seed?secret=YOUR_JWT_SECRET</code>
        </div>
      </div>

      {/* SEO Modal */}
      {editSeo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setEditSeo(null)}>
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-2)', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 800, color: 'var(--text)' }}>SEO & URL Settings</h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>{editSeo.fullPath}</p>
              </div>
              <button onClick={() => setEditSeo(null)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={lbl}>Slug</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--bg-3)' }}>
                  <span style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-4)', borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>ariosetech.com/</span>
                  <input value={seoForm.slug} onChange={e => setSeoForm(f => ({ ...f, slug: e.target.value }))} style={{ ...inp, border: 'none', background: 'transparent', fontFamily: 'var(--font-mono)' }} />
                </div>
              </div>
              <div><label style={lbl}>SEO Title <span style={{ color: 'var(--text-3)' }}>(50-60 chars)</span></label>
                <input value={seoForm.title} onChange={e => setSeoForm(f => ({ ...f, title: e.target.value }))} placeholder={`${editSeo.title} | ARIOSETECH`} style={inp} />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: seoForm.title.length > 60 ? 'var(--red)' : 'var(--text-3)', marginTop: '4px' }}>{seoForm.title.length}/60</p>
              </div>
              <div><label style={lbl}>Meta Description <span style={{ color: 'var(--text-3)' }}>(150-160 chars)</span></label>
                <textarea value={seoForm.description} onChange={e => setSeoForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: seoForm.description.length > 160 ? 'var(--red)' : 'var(--text-3)', marginTop: '4px' }}>{seoForm.description.length}/160</p>
              </div>
              {/* Google preview */}
              {(seoForm.title || editSeo.title) && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '14px' }}>
                  <p style={{ fontSize: '13px', color: '#1a0dab', fontWeight: 500, marginBottom: '2px', fontFamily: 'Arial' }}>{seoForm.title || `${editSeo.title} | ARIOSETECH`}</p>
                  <p style={{ fontSize: '11px', color: '#006621', marginBottom: '3px', fontFamily: 'Arial' }}>ariosetech.com{editSeo.fullPath}</p>
                  <p style={{ fontSize: '12px', color: '#545454', fontFamily: 'Arial', lineHeight: 1.4 }}>{seoForm.description || 'No meta description set.'}</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setEditSeo(null)} className="btn btn-outline btn-md">Cancel</button>
                <button onClick={saveSeo} className="btn btn-primary btn-md">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AdminShell>
  )
}
