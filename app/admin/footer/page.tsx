'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save, Plus, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type FooterLink = { label: string; href: string }
type FooterCol  = { title: string; links: FooterLink[] }

export default function FooterAdmin() {
  const [config, setConfig] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/footer').then(r => r.json()).then(setConfig).finally(() => setLoading(false))
  }, [])

  const set = (key: string, val: unknown) => setConfig(c => ({ ...c, [key]: val }))
  const cols = ((config.columns || []) as FooterCol[])
  const setCols = (c: FooterCol[]) => set('columns', c)

  const addCol    = () => setCols([...cols, { title: 'New Column', links: [{ label: 'New Link', href: '/' }] }])
  const removeCol = (i: number) => setCols(cols.filter((_, j) => j !== i))
  const updateCol = (i: number, key: string, val: unknown) => setCols(cols.map((c, j) => j === i ? { ...c, [key]: val } : c))
  const addLink   = (ci: number) => updateCol(ci, 'links', [...cols[ci].links, { label: 'New Link', href: '/' }])
  const removeLink = (ci: number, li: number) => updateCol(ci, 'links', cols[ci].links.filter((_, j) => j !== li))
  const updateLink = (ci: number, li: number, key: string, val: string) => updateCol(ci, 'links', cols[ci].links.map((l, j) => j === li ? { ...l, [key]: val } : l))

  const save = async () => {
    setSaving(true)
    await fetch('/api/footer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) })
    setSaving(false); toast.success('Footer saved! Refresh the site to see changes.')
  }

  const inp: React.CSSProperties = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '9px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
  const lbl: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }
  const card: React.CSSProperties = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }

  if (loading) return <AdminShell><div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div style={{ padding: '32px', maxWidth: '960px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="admin-page__title">Footer Builder</h1>
            <p className="admin-page__subtitle">Changes reflect live on the website</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/#footer" target="_blank" className="btn btn-outline btn-md"><Eye size={14} /> Preview</Link>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
              <Save size={14} /> {saving ? 'Saving…' : 'Save Footer'}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>📢 CTA Banner</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div><label style={lbl}>Headline</label><input value={String(config.ctaHeadline || '')} onChange={e => set('ctaHeadline', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Description</label><input value={String(config.ctaDesc || '')} onChange={e => set('ctaDesc', e.target.value)} style={inp} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={lbl}>CTA Button Label</label><input value={String(config.ctaPrimaryLabel || '')} onChange={e => set('ctaPrimaryLabel', e.target.value)} style={inp} /></div>
              <div><label style={lbl}>CTA Button URL</label><input value={String(config.ctaPrimaryHref || '')} onChange={e => set('ctaPrimaryHref', e.target.value)} style={inp} /></div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>✍️ Brand Tagline</h2>
          <div><label style={lbl}>Tagline (shown under logo in footer)</label>
            <textarea value={String(config.tagline || '')} onChange={e => set('tagline', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} />
          </div>
        </div>

        {/* Link Columns */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>🔗 Navigation Columns</h2>
            <button onClick={addCol} className="btn btn-outline btn-sm"><Plus size={12} /> Add Column</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {cols.map((col, ci) => (
              <div key={ci} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <input value={col.title} onChange={e => updateCol(ci, 'title', e.target.value)} style={{ ...inp, width: 'auto', flex: 1, fontWeight: 700, fontSize: '14px', fontFamily: 'var(--font-display)' }} placeholder="Column Title" />
                  <button onClick={() => removeCol(ci)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', flexShrink: 0, padding: '0 4px' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                    <Trash2 size={13} />
                  </button>
                </div>
                {col.links.map((link, li) => (
                  <div key={li} style={{ display: 'flex', gap: '5px', marginBottom: '5px', alignItems: 'center' }}>
                    <input value={link.label} onChange={e => updateLink(ci, li, 'label', e.target.value)} style={{ ...inp, flex: 1, fontSize: '12px', padding: '6px 8px' }} placeholder="Label" />
                    <input value={link.href} onChange={e => updateLink(ci, li, 'href', e.target.value)} style={{ ...inp, flex: 1, fontSize: '11px', padding: '6px 8px', fontFamily: 'var(--font-mono)' }} placeholder="/url" />
                    <button onClick={() => removeLink(ci, li)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '0 2px' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>✕</button>
                  </div>
                ))}
                <button onClick={() => addLink(ci)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px dashed var(--border)', background: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '11px', marginTop: '4px' }}>+ Add Link</button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>⬇️ Bottom Copyright Bar</h2>
          <div><label style={lbl}>Copyright Text</label>
            <input value={String(config.bottomText || '')} onChange={e => set('bottomText', e.target.value)} style={inp} />
          </div>
        </div>

        <div className="info-box">
          💡 The <strong>Contact column</strong> (phone, email, social links) is controlled via <strong>Settings</strong> page — it reads your site-wide contact information automatically.
        </div>
      </div>
    </AdminShell>
  )
}
