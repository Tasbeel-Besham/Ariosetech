'use client'
import { useEffect, useState, useRef } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save, Eye, Upload, X } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

import { MediaPickerModal } from '@/components/ui/MediaPickerModal'

type Config = Record<string, unknown>

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

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"
  const cardClass = "bg-bg-2 border border-border rounded-2xl p-6 mb-5"

  const logoUrl = String(config.logo || '').replace(/^\/+/, '')

  if (loading) return <AdminShell><div className="p-10 text-center text-text-3">Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div className="p-8 max-w-[800px]">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight">Header Builder</h1>
            <p className="text-[13px] text-text-3 mt-1">Configure your site header</p>
          </div>
          <div className="flex gap-2.5">
            <a href="/" target="_blank" className="flex items-center gap-1.5 py-2.5 px-4 rounded-lg border border-border text-text-3 no-underline text-[13px] transition-colors hover:bg-bg-3 hover:text-white">
              <Eye size={14} /> Preview
            </a>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 py-2.5 px-[18px] rounded-lg border-none bg-gradient-to-br from-[#4f6ef7] to-[#9b6dff] text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90">
              <Save size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Logo */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">🖼 Logo</h2>

          {/* Upload area */}
          <div className="flex gap-4 items-start mb-4 max-sm:flex-col">

            {/* Preview box */}
            <div className="w-[120px] h-20 bg-bg-3 border border-border rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative">
              {logoUrl && logoUrl.startsWith('http') ? (
                <Image src={logoUrl} alt="Logo preview" fill className="object-contain p-2" unoptimized />
              ) : (
                <span className="font-mono text-[10px] text-text-3">No logo</span>
              )}
            </div>

            {/* Upload controls */}
            <div className="flex-1 w-full">
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { if (e.target.files?.[0]) uploadLogo(e.target.files[0]) }} />

              <div className="flex gap-2 mb-2.5 flex-wrap">
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border-2 bg-bg-3 text-white text-[13px] font-semibold cursor-pointer transition-colors hover:border-[rgba(79,110,247,0.5)] hover:text-primary min-w-[120px]">
                  <Upload size={14} />
                  {uploading ? 'Uploading…' : 'Upload New'}
                </button>
                <button onClick={() => set('showMediaModal', true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border-2 bg-bg-3 text-white text-[13px] font-semibold cursor-pointer transition-colors hover:border-[rgba(79,110,247,0.5)] hover:text-primary min-w-[120px]">
                  <Eye size={14} />
                  Media Library
                </button>
              </div>

              <p className="font-mono text-[10px] text-text-3 mb-2.5">
                PNG, SVG, WebP recommended. Transparent background works best.
              </p>

              {/* Or paste URL */}
              <div>
                <label className={lblClass}>Or paste URL directly</label>
                <div className="flex gap-2">
                  <input value={logoUrl} onChange={e => set('logo', e.target.value)}
                    placeholder="https://..." className={`${inpClass} flex-1`} />
                  {logoUrl && (
                    <button onClick={() => set('logo', '')} className="p-2.5 rounded-lg border border-border bg-bg-3 text-[#ff4d6d] cursor-pointer flex items-center transition-colors hover:border-[#ff4d6d]/40">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_120px] gap-3 max-sm:grid-cols-1">
            <div><label className={lblClass}>Logo Alt Text</label><input value={String(config.logoAlt || '')} onChange={e => set('logoAlt', e.target.value)} className={inpClass} /></div>
            <div><label className={lblClass}>Width (px)</label><input type="number" value={Number(config.logoWidth || 160)} onChange={e => set('logoWidth', Number(e.target.value))} className={inpClass} /></div>
          </div>
        </div>

        {/* Media Modal */}
        {Boolean(config.showMediaModal) && (
          <MediaPickerModal 
            onClose={() => set('showMediaModal', false)} 
            onSelect={(url) => { set('logo', url); set('showMediaModal', false) }} 
          />
        )}

        {/* Top bar */}
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-[15px] font-bold text-white">📢 Top Bar</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={Boolean(config.showTopBar)} onChange={e => set('showTopBar', e.target.checked)} className="accent-primary" />
              <span className="text-[13px] text-text-2">Show top bar</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div><label className={lblClass}>Phone</label><input value={String(config.topBarPhone || '')} onChange={e => set('topBarPhone', e.target.value)} className={inpClass} /></div>
            <div><label className={lblClass}>Email</label><input value={String(config.topBarEmail || '')} onChange={e => set('topBarEmail', e.target.value)} className={inpClass} /></div>
            <div className="col-span-2 max-sm:col-span-1"><label className={lblClass}>Status Text</label><input value={String(config.topBarText || '')} onChange={e => set('topBarText', e.target.value)} placeholder="Available for new projects" className={inpClass} /></div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">🔘 CTA Buttons</h2>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div><label className={lblClass}>Primary Button Label</label><input value={String(config.ctaPrimaryLabel || '')} onChange={e => set('ctaPrimaryLabel', e.target.value)} className={inpClass} /></div>
            <div><label className={lblClass}>Primary Button URL</label><input value={String(config.ctaPrimaryHref || '')} onChange={e => set('ctaPrimaryHref', e.target.value)} className={inpClass} /></div>
            <div><label className={lblClass}>Secondary Button Label</label><input value={String(config.ctaSecondaryLabel || '')} onChange={e => set('ctaSecondaryLabel', e.target.value)} className={inpClass} /></div>
            <div><label className={lblClass}>Secondary Button URL</label><input value={String(config.ctaSecondaryHref || '')} onChange={e => set('ctaSecondaryHref', e.target.value)} className={inpClass} /></div>
          </div>
        </div>

        {/* Options */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">⚙️ Options</h2>
          <div className="flex gap-6 flex-wrap">
            {[
              { key: 'sticky', label: 'Sticky header', desc: 'Header stays on scroll' },
              { key: 'transparent', label: 'Transparent on load', desc: 'Transparent until scrolled' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={Boolean(config[key])} onChange={e => set(key, e.target.checked)} className="w-4 h-4 accent-primary" />
                <div>
                  <p className="text-[13px] font-semibold text-white">{label}</p>
                  <p className="font-mono text-[10px] text-text-3">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
