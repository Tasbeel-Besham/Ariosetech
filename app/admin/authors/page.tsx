'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

type Author = {
  _id?: string
  name: string; slug: string; role?: string; bio?: string; avatar?: string
  email?: string; linkedin?: string; twitter?: string; website?: string
  expertise?: string[] | string; published?: boolean
}

const EMPTY: Author = {
  name: '', slug: '', role: '', bio: '', avatar: '',
  email: '', linkedin: '', twitter: '', website: '', expertise: '', published: true,
}

const inp = 'w-full py-2.5 px-3 rounded-lg border border-border bg-bg-2 text-text text-sm font-body outline-none focus:border-[rgba(var(--primary-rgb),0.5)]'
const lbl = 'block font-mono text-10 uppercase tracking-wider font-semibold text-text-3 mb-1.5'

export default function AuthorsAdmin() {
  const [items, setItems]     = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Author | null>(null)
  const [saving, setSaving]   = useState(false)

  const load = () =>
    fetch('/api/authors')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d) })
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing?.name) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const payload = {
        ...editing,
        expertise: typeof editing.expertise === 'string'
          ? editing.expertise.split(',').map(s => s.trim()).filter(Boolean)
          : editing.expertise,
      }
      const res = editing._id
        ? await fetch(`/api/authors/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/authors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        toast.success(editing._id ? 'Author updated' : 'Author created')
        setEditing(null); setLoading(true); load()
      } else {
        const e = await res.json().catch(() => ({}))
        toast.error(e.error || 'Save failed')
      }
    } finally { setSaving(false) }
  }

  const remove = async (id?: string) => {
    if (!id || !confirm('Delete this author? Their posts stay published but lose the profile link.')) return
    await fetch(`/api/authors/${id}`, { method: 'DELETE' })
    toast.success('Author deleted'); setLoading(true); load()
  }

  return (
    <div className="admin-page">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="admin-page__title">Authors</h1>
          <p className="admin-page__subtitle">
            {items.length} author{items.length === 1 ? '' : 's'} · Used for blog bylines, author pages, and Person schema
          </p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn btn-primary btn-md">+ New Author</button>
      </div>

      {loading ? (
        <p className="text-text-3">Loading…</p>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-2 mb-4">No authors yet. Create one to enable author pages and Person schema on your blog posts.</p>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn btn-primary btn-md">Create your first author</button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-4 font-mono text-10 uppercase tracking-wider text-text-3">Author</th>
                <th className="p-4 font-mono text-10 uppercase tracking-wider text-text-3">Role</th>
                <th className="p-4 font-mono text-10 uppercase tracking-wider text-text-3">Page</th>
                <th className="p-4 font-mono text-10 uppercase tracking-wider text-text-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a._id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {a.avatar
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={a.avatar} alt={a.name} className="w-9 h-9 rounded-lg object-cover" />
                        : <div className="w-9 h-9 rounded-lg bg-grad flex items-center justify-center text-white font-bold">{a.name.charAt(0)}</div>}
                      <span className="font-semibold">{a.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-2">{a.role || '—'}</td>
                  <td className="p-4">
                    <a href={`/author/${a.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary font-mono text-11">/author/{a.slug}</a>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing({ ...a, expertise: Array.isArray(a.expertise) ? a.expertise.join(', ') : (a.expertise || '') })}
                              className="btn btn-outline btn-sm">Edit</button>
                      <button onClick={() => remove(a._id)} className="btn btn-outline btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6"
             style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setEditing(null)}>
          <div className="card w-full max-w-[680px] p-7 my-8" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold mb-5">{editing._id ? 'Edit Author' : 'New Author'}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Full name *</label>
                <input className={inp} value={editing.name}
                       onChange={e => setEditing({ ...editing, name: e.target.value, slug: editing._id ? editing.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })}
                       placeholder="Tasbeel Besham" />
              </div>
              <div>
                <label className={lbl}>URL slug</label>
                <input className={inp} value={editing.slug}
                       onChange={e => setEditing({ ...editing, slug: e.target.value })}
                       placeholder="tasbeel-besham" />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Role / job title</label>
                <input className={inp} value={editing.role || ''}
                       onChange={e => setEditing({ ...editing, role: e.target.value })}
                       placeholder="Founder &amp; CEO" />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Bio</label>
                <textarea className={inp} rows={4} value={editing.bio || ''}
                          onChange={e => setEditing({ ...editing, bio: e.target.value })}
                          placeholder="Two or three sentences about their background and expertise. Shown on the author page and used in Person schema." />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Photo URL</label>
                <input className={inp} value={editing.avatar || ''}
                       onChange={e => setEditing({ ...editing, avatar: e.target.value })}
                       placeholder="https://…" />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Areas of expertise (comma separated)</label>
                <input className={inp} value={typeof editing.expertise === 'string' ? editing.expertise : (editing.expertise || []).join(', ')}
                       onChange={e => setEditing({ ...editing, expertise: e.target.value })}
                       placeholder="WooCommerce, Shopify, E-commerce strategy" />
              </div>
              <div>
                <label className={lbl}>LinkedIn URL</label>
                <input className={inp} value={editing.linkedin || ''}
                       onChange={e => setEditing({ ...editing, linkedin: e.target.value })} placeholder="https://linkedin.com/in/…" />
              </div>
              <div>
                <label className={lbl}>X / Twitter URL</label>
                <input className={inp} value={editing.twitter || ''}
                       onChange={e => setEditing({ ...editing, twitter: e.target.value })} placeholder="https://x.com/…" />
              </div>
              <div>
                <label className={lbl}>Website</label>
                <input className={inp} value={editing.website || ''}
                       onChange={e => setEditing({ ...editing, website: e.target.value })} placeholder="https://…" />
              </div>
              <div>
                <label className={lbl}>Email (optional)</label>
                <input className={inp} value={editing.email || ''}
                       onChange={e => setEditing({ ...editing, email: e.target.value })} placeholder="name@ariosetech.com" />
              </div>
            </div>

            <label className="flex items-center gap-2 mt-5 text-sm cursor-pointer">
              <input type="checkbox" checked={editing.published !== false}
                     onChange={e => setEditing({ ...editing, published: e.target.checked })} />
              Published (author page is publicly visible)
            </label>

            <p className="text-text-3 text-[12.5px] mt-5 leading-relaxed">
              The <strong>name</strong> must match the author name saved on blog posts for their articles to appear here
              and for Person schema to attach to those posts.
            </p>

            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
                {saving ? 'Saving…' : 'Save Author'}
              </button>
              <button onClick={() => setEditing(null)} className="btn btn-outline btn-md">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
