'use client'
import { useEffect, useState, useRef } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save, Eye, Upload, X } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

type Config = Record<string, unknown>

function MediaGrid({ onSelect }: { onSelect: (url: string) => void }) {
  const [items, setItems] = useState<Array<{_id: string, url: string}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/media').then(r => r.json()).then(data => {
      setItems(Array.isArray(data) ? data : [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>Loading media...</div>
  if (!items.length) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>No media found. Upload something first!</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
      {items.map(item => (
        <button key={item._id} onClick={() => onSelect(item.url)} style={{ border: '1px solid var(--border)', background: 'var(--bg-3)', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', width: '100%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt="Media" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </button>
      ))}
    </div>
  )
}

export default function HeaderAdmin() {
  const [config, setConfig] = useState<Config>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/header').then(r => r.json()).then(setConfig).finally(() => setLoading(false))
  }, [])

  const set = (key: string, val: unknown) => setConfig(c => ({ ...c, [key]: val }))

  const save = async () => {
    setSaving(true)
    await fetch('/api/header', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) })
    setSaving(false)
    toast.success('Header saved! Refresh the site to see changes.')
  }

  const uploadLogo = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('alt', String(config.logoAlt || 'ARIOSETECH Logo'))
    try {
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
      const data = await res.json()
      const url = data.url || data[0]?.url
      if (url) {
        set('logo', url)
        toast.success('Logo uploaded!')
      } else {
        toast.error('Upload failed')
      }
    } catch {
      toast.error('Upload failed')
    }
    setUploading(false)
  }

  const inp = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'var(--font-body)' }
  const lbl = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }
  const card = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }

  const logoUrl = String(config.logo || '').replace(/^\/+/, '')

  if (loading) return <AdminShell><div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div style={{ padding: '32px', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Header Builder</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Configure your site header</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text-3)', textDecoration: 'none', fontSize: '13px' }}>
              <Eye size={14} /> Preview
            </a>
            <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
              <Save size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Logo */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>🖼 Logo</h2>

          {/* Upload area */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>

            {/* Preview box */}
            <div style={{ width: '120px', height: '80px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
              {logoUrl && logoUrl.startsWith('http') ? (
                <Image src={logoUrl} alt="Logo preview" fill style={{ objectFit: 'contain', padding: '8px' }} unoptimized />
              ) : (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)' }}>No logo</span>
              )}
            </div>

            {/* Upload controls */}
            <div style={{ flex: 1 }}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) uploadLogo(e.target.files[0]) }} />

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: '1px solid var(--border-2)', background: 'var(--bg-3)', color: 'var(--text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', justifyContent: 'center' }}>
                  <Upload size={14} />
                  {uploading ? 'Uploading…' : 'Upload New'}
                </button>
                <button onClick={() => set('showMediaModal', true)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: '1px solid var(--border-2)', background: 'var(--bg-3)', color: 'var(--text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', justifyContent: 'center' }}>
                  <Eye size={14} />
                  Media Library
                </button>
              </div>

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', marginBottom: '10px' }}>
                PNG, SVG, WebP recommended. Transparent background works best.
              </p>

              {/* Or paste URL */}
              <div>
                <label style={lbl}>Or paste URL directly</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={logoUrl} onChange={e => set('logo', e.target.value)}
                    placeholder="https://..." style={{ ...inp, flex: 1 }} />
                  {logoUrl && (
                    <button onClick={() => set('logo', '')} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px' }}>
            <div><label style={lbl}>Logo Alt Text</label><input value={String(config.logoAlt || '')} onChange={e => set('logoAlt', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Width (px)</label><input type="number" value={Number(config.logoWidth || 160)} onChange={e => set('logoWidth', Number(e.target.value))} style={inp} /></div>
          </div>
        </div>

        {/* Media Modal */}
        {config.showMediaModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Select from Media Library</h3>
                <button onClick={() => set('showMediaModal', false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                <MediaGrid onSelect={(url) => { set('logo', url); set('showMediaModal', false) }} />
              </div>
            </div>
          </div>
        )}

        {/* Top bar */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>📢 Top Bar</h2>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={Boolean(config.showTopBar)} onChange={e => set('showTopBar', e.target.checked)} />
              <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Show top bar</span>
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={lbl}>Phone</label><input value={String(config.topBarPhone || '')} onChange={e => set('topBarPhone', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Email</label><input value={String(config.topBarEmail || '')} onChange={e => set('topBarEmail', e.target.value)} style={inp} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Status Text</label><input value={String(config.topBarText || '')} onChange={e => set('topBarText', e.target.value)} placeholder="Available for new projects" style={inp} /></div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>🔘 CTA Buttons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={lbl}>Primary Button Label</label><input value={String(config.ctaPrimaryLabel || '')} onChange={e => set('ctaPrimaryLabel', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Primary Button URL</label><input value={String(config.ctaPrimaryHref || '')} onChange={e => set('ctaPrimaryHref', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Secondary Button Label</label><input value={String(config.ctaSecondaryLabel || '')} onChange={e => set('ctaSecondaryLabel', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Secondary Button URL</label><input value={String(config.ctaSecondaryHref || '')} onChange={e => set('ctaSecondaryHref', e.target.value)} style={inp} /></div>
          </div>
        </div>

        {/* Options */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>⚙️ Options</h2>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { key: 'sticky', label: 'Sticky header', desc: 'Header stays on scroll' },
              { key: 'transparent', label: 'Transparent on load', desc: 'Transparent until scrolled' },
            ].map(({ key, label, desc }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={Boolean(config[key])} onChange={e => set(key, e.target.checked)} style={{ width: '16px', height: '16px' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)' }}>{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
