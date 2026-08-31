'use client'
import { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { shadowedByCodeRule, REDIRECT_TYPES } from '@/lib/redirects/shared'

type Redirect = {
  _id?: string
  from: string
  to: string
  type: number
  enabled?: boolean
  note?: string
  source?: string
  updatedAt?: string
}

const EMPTY: Redirect = { from: '', to: '', type: 301, enabled: true, note: '' }

const inp = 'w-full py-2.5 px-3 rounded-lg border border-border bg-bg-2 text-text text-sm font-body outline-none focus:border-[rgba(var(--primary-rgb),0.5)]'
const lbl = 'block font-mono text-10 uppercase tracking-wider font-semibold text-text-3 mb-1.5'

const TYPE_HELP: Record<number, string> = {
  301: 'Permanent. Passes ranking signal to the destination. Use this for anything you have retired.',
  308: 'Permanent, and keeps the request method. Same SEO effect as 301.',
  302: 'Temporary. Google keeps indexing the old URL. Only for something genuinely coming back.',
  307: 'Temporary, and keeps the request method.',
}

export default function RedirectsAdmin() {
  const [items, setItems]     = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Redirect | null>(null)
  const [saving, setSaving]   = useState(false)
  const [bulk, setBulk]       = useState<string | null>(null)
  const [q, setQ]             = useState('')

  const load = () =>
    fetch('/api/redirects')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d) })
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return items
    return items.filter(r => (r.from + ' ' + r.to + ' ' + (r.note || '')).toLowerCase().includes(needle))
  }, [items, q])

  // Warn before saving rather than after: a row whose source is already handled
  // by a rule in next.config.ts can never fire, because those run earlier in
  // Next's routing pipeline than the middleware that reads this table.
  const shadow = editing ? shadowedByCodeRule(editing.from.trim().toLowerCase()) : null

  const save = async () => {
    if (!editing?.from || !editing?.to) { toast.error('Both the old URL and the destination are required'); return }
    setSaving(true)
    try {
      const res = editing._id
        ? await fetch(`/api/redirects/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
        : await fetch('/api/redirects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        if (data.flattened) toast.success(`Saved as ${data.from} → ${data.to} (the destination was itself redirected, so the chain was collapsed)`, { duration: 7000 })
        else if (data.repointed) toast.success(`Saved. ${data.repointed} existing rule${data.repointed === 1 ? '' : 's'} repointed to avoid a chain.`, { duration: 7000 })
        else toast.success(editing._id ? 'Redirect updated' : 'Redirect created')
        setEditing(null); setLoading(true); load()
      } else {
        toast.error(data.error || 'Save failed')
      }
    } finally { setSaving(false) }
  }

  const remove = async (r: Redirect) => {
    if (!r._id || !confirm(`Delete the redirect for ${r.from}? That URL will start returning 404 again.`)) return
    await fetch(`/api/redirects/${r._id}`, { method: 'DELETE' })
    toast.success('Redirect deleted'); setLoading(true); load()
  }

  const toggle = async (r: Redirect) => {
    await fetch(`/api/redirects/${r._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...r, enabled: r.enabled === false }),
    })
    setLoading(true); load()
  }

  const runBulk = async () => {
    if (!bulk?.trim()) { toast.error('Nothing to import'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/redirects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bulk }) })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast.success(`Imported ${data.created} redirect${data.created === 1 ? '' : 's'}`)
        if (data.errors?.length) toast.error(`${data.errors.length} line(s) skipped:\n${data.errors.slice(0, 4).join('\n')}`, { duration: 10000 })
        setBulk(null); setLoading(true); load()
      } else toast.error(data.error || 'Import failed')
    } finally { setSaving(false) }
  }

  const active = items.filter(r => r.enabled !== false).length

  return (
    <div className="admin-page">
      <Link href="/admin/dashboard" className="inline-flex items-center gap-2 font-mono text-11 uppercase tracking-widest font-semibold mb-6 hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="admin-page__title">URL Redirects</h1>
          <p className="admin-page__subtitle">
            {active} active {items.length !== active ? `· ${items.length - active} disabled ` : ''}·
            Point retired URLs at their replacement so links and rankings follow the move instead of hitting a 404
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setBulk('')} className="btn btn-outline btn-md">Bulk import</button>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn btn-primary btn-md">+ New Redirect</button>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <p className="text-text-2 text-[13px] leading-relaxed">
          A <strong>301</strong> tells Google the page moved for good and hands the old URL&rsquo;s ranking signal to the new one.
          Add one whenever you delete a page, rename a slug, or merge two pages that were competing with each other.
          Renaming a page in the builder writes its redirect here automatically. Changes go live within a couple of minutes.
        </p>
      </div>

      {items.length > 6 && (
        <input className={`${inp} mb-4 max-w-[420px]`} value={q} onChange={e => setQ(e.target.value)} placeholder="Filter by URL or note…" />
      )}

      {loading ? (
        <p className="text-text-3">Loading…</p>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-2 mb-4">
            No redirects yet. If Search Console is reporting 404s, paste the list into Bulk import and every one of those
            URLs starts pointing somewhere useful.
          </p>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn btn-primary btn-md">Add your first redirect</button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-4 font-mono text-10 uppercase tracking-wider text-text-3">Old URL</th>
                <th className="p-4 font-mono text-10 uppercase tracking-wider text-text-3">Goes to</th>
                <th className="p-4 font-mono text-10 uppercase tracking-wider text-text-3">Code</th>
                <th className="p-4 font-mono text-10 uppercase tracking-wider text-text-3">Added by</th>
                <th className="p-4 font-mono text-10 uppercase tracking-wider text-text-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const off = r.enabled === false
                const shadowed = shadowedByCodeRule(r.from)
                return (
                  <tr key={r._id} className="border-b border-border last:border-0" style={off ? { opacity: 0.45 } : undefined}>
                    <td className="p-4 font-mono text-11">
                      <a href={r.from} target="_blank" rel="noopener noreferrer" className="text-primary">{r.from}</a>
                      {shadowed && (
                        <div className="text-text-3 text-[11px] font-body mt-1">
                          Never fires — a rule in the code already sends this to {shadowed}
                        </div>
                      )}
                      {r.note && <div className="text-text-3 text-[11px] font-body mt-1">{r.note}</div>}
                    </td>
                    <td className="p-4 font-mono text-11 text-text-2">{r.to}</td>
                    <td className="p-4">
                      <span className="font-mono text-11" style={{ color: r.type === 301 || r.type === 308 ? 'var(--primary)' : 'var(--text-3)' }}>
                        {r.type}
                      </span>
                    </td>
                    <td className="p-4 text-text-3 text-[12px]">
                      {r.source === 'slug-change' ? 'Page rename' : 'Manual'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => setEditing({ ...r })} className="btn btn-outline btn-sm">Edit</button>
                        <button onClick={() => toggle(r)} className="btn btn-outline btn-sm">{off ? 'Enable' : 'Disable'}</button>
                        <button onClick={() => remove(r)} className="btn btn-outline btn-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6"
             style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setEditing(null)}>
          <div className="card w-full max-w-[620px] p-7 my-8" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold mb-5">{editing._id ? 'Edit Redirect' : 'New Redirect'}</h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={lbl}>Old URL *</label>
                <input className={inp} value={editing.from}
                       onChange={e => setEditing({ ...editing, from: e.target.value })}
                       placeholder="/old-page-that-no-longer-exists" />
                <p className="text-text-3 text-[12px] mt-1.5">
                  Paste the path or the full URL — either works. Query strings and trailing slashes are ignored when matching.
                </p>
              </div>
              <div>
                <label className={lbl}>Goes to *</label>
                <input className={inp} value={editing.to}
                       onChange={e => setEditing({ ...editing, to: e.target.value })}
                       placeholder="/services/wordpress" />
                <p className="text-text-3 text-[12px] mt-1.5">
                  Send it to the closest equivalent page. Dumping everything on the homepage is treated as a soft 404 and passes almost nothing.
                </p>
              </div>
              <div>
                <label className={lbl}>Status code</label>
                <select className={inp} value={editing.type}
                        onChange={e => setEditing({ ...editing, type: Number(e.target.value) })}>
                  {REDIRECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <p className="text-text-3 text-[12px] mt-1.5">{TYPE_HELP[editing.type] || ''}</p>
              </div>
              <div>
                <label className={lbl}>Note (optional)</label>
                <input className={inp} value={editing.note || ''}
                       onChange={e => setEditing({ ...editing, note: e.target.value })}
                       placeholder="Merged into the main WordPress service page, Aug 2026" />
              </div>
            </div>

            {shadow && (
              <p className="text-[12.5px] mt-5 leading-relaxed" style={{ color: 'var(--primary)' }}>
                Heads up: <strong>{editing.from}</strong> is already redirected to <strong>{shadow}</strong> by a rule in the
                site code, and those run before this table. Saving it here will have no effect.
              </p>
            )}

            <label className="flex items-center gap-2 mt-5 text-sm cursor-pointer">
              <input type="checkbox" checked={editing.enabled !== false}
                     onChange={e => setEditing({ ...editing, enabled: e.target.checked })} />
              Active
            </label>

            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
                {saving ? 'Saving…' : 'Save Redirect'}
              </button>
              <button onClick={() => setEditing(null)} className="btn btn-outline btn-md">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk import modal */}
      {bulk !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6"
             style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setBulk(null)}>
          <div className="card w-full max-w-[680px] p-7 my-8" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold mb-2">Bulk import</h2>
            <p className="text-text-2 text-[13px] mb-5 leading-relaxed">
              One rule per line, old URL first: <code className="font-mono text-11">/old-page, /new-page</code>.
              Add a third value to change the status code. Commas or tabs both work, so a column pasted straight out of a
              Search Console 404 export imports as-is. Lines starting with # are ignored.
            </p>
            <textarea className={`${inp} font-mono text-11`} rows={12} value={bulk}
                      onChange={e => setBulk(e.target.value)}
                      placeholder={'/old-wordpress-page, /services/wordpress\n/blog/outdated-post, /blog/the-replacement\n/discontinued-offer, /services, 302'} />
            <div className="flex gap-3 mt-6">
              <button onClick={runBulk} disabled={saving} className="btn btn-primary btn-md">
                {saving ? 'Importing…' : 'Import'}
              </button>
              <button onClick={() => setBulk(null)} className="btn btn-outline btn-md">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
