'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save, Upload, RefreshCw } from '@/components/ui/Icons'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { MediaPickerModal } from '@/components/ui/MediaPickerModal'

const LOGO_URL    = 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png'
const FAVICON_URL = 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539349/ariosetech/cmeul8vugjeeujikb4e5.png'

type Settings = Record<string, string>

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings>({
    site_name: 'ARIOSETECH', tagline: 'Consider It Solved',
    email: 'info@ariosetech.com', phone: '+92 300 9484 739',
    whatsapp: 'https://wa.me/923009484739',
    address: '95 College Road, Block E, PCSIR Staff Colony, Lahore, 54770',
    facebook: 'https://facebook.com/ariosetech',
    instagram: 'https://instagram.com/ariosetech',
    linkedin: 'https://linkedin.com/company/ariosetech',
    logo_url: LOGO_URL,
    favicon_url: FAVICON_URL,
    logo_alt: 'ARIOSETECH',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [uploading, setUploading] = useState<'logo'|'favicon'|null>(null)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setSettings(prev => ({ ...prev, ...d }))
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: string) => setSettings(s => ({ ...s, [k]: v }))

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    if (res.ok) toast.success('Settings saved! Changes reflect on the live site.')
    else toast.error('Failed to save')
  }

  const upload = async (file: File, type: 'logo' | 'favicon') => {
    setUploading(type)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('alt', type === 'logo' ? 'ARIOSETECH Logo' : 'ARIOSETECH Favicon')
    const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
    setUploading(null)
    if (res.ok) {
      const data = await res.json()
      const url = data.url || data[0]?.url
      if (url) {
        set(type === 'logo' ? 'logo_url' : 'favicon_url', url)
        toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded!`)
      }
    } else {
      const { error } = await res.json()
      toast.error(error || 'Upload failed')
    }
  }

  const resetToDefault = (type: 'logo' | 'favicon') => {
    set(type === 'logo' ? 'logo_url' : 'favicon_url', type === 'logo' ? LOGO_URL : FAVICON_URL)
    toast.success(`Reset to default ${type}`)
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-md py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"
  const cardClass = "bg-bg-2 border border-border rounded-2xl p-6 mb-4"
  const uploadBtnClass = "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-border-2 bg-bg-3 cursor-pointer text-[13px] text-text-2 font-display font-semibold transition-all min-w-[120px] hover:border-primary hover:text-primary"

  if (loading) return <AdminShell><div className="p-10 text-center text-text-3">Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div className="p-8 max-w-[820px]">
        <div className="flex justify-between items-center mb-7">
          <div>
            <h1 className="admin-page__title">Settings</h1>
            <p className="admin-page__subtitle">Changes apply sitewide, navbar, footer, SEO, and browser tab</p>
          </div>
          <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
            <Save size={14} /> {saving ? 'Saving…' : 'Save All Settings'}
          </button>
        </div>

        {/* ── LOGO & FAVICON ── */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">🎨 Logo &amp; Favicon</h2>
          <p className="text-[13px] text-text-3 mb-5 leading-[1.6]">
            Changing the logo here updates it <strong className="text-text-2">everywhere</strong>, navbar, footer, admin panel, and OG image. Changing the favicon updates the browser tab icon.
          </p>

          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {/* Logo */}
            <div>
              <label className={lblClass}>Site Logo</label>
              <div className="bg-bg-3 border border-border rounded-xl p-5 mb-3 flex items-center justify-center min-h-[80px]">
                {settings.logo_url
                  ? <Image src={settings.logo_url} alt="Logo" width={180} height={45} className="max-h-12 w-auto object-contain" />
                  : <span className="text-xs text-text-3">No logo set</span>}
              </div>
              <div className="flex gap-2 mb-2.5 flex-wrap">
                <label className={uploadBtnClass}>
                  {uploading === 'logo' ? <><RefreshCw size={13} className="animate-spin" /> Uploading…</> : <><Upload size={13} /> Upload New</>}
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) upload(f,'logo'); e.target.value='' }} />
                </label>
                <button onClick={() => set('showMediaModal', 'logo')} className="btn btn-outline btn-sm flex-1 p-2 min-w-[120px]">
                  Media Library
                </button>
                <button onClick={() => resetToDefault('logo')} className="btn btn-ghost btn-sm shrink-0" title="Reset to default">
                  <RefreshCw size={13} />
                </button>
              </div>
              <div>
                <label className={lblClass}>Or paste URL</label>
                <input value={settings.logo_url||''} onChange={e=>set('logo_url',e.target.value)} placeholder="https://…" className={inpClass} />
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className={lblClass}>Favicon (browser tab icon)</label>
              <div className="bg-bg-3 border border-border rounded-xl p-5 mb-3 flex items-center justify-center min-h-[80px]">
                {settings.favicon_url
                  ? <Image src={settings.favicon_url} alt="Favicon" width={64} height={64} className="w-12 h-12 object-contain" />
                  : <span className="text-xs text-text-3">No favicon set</span>}
              </div>
              <div className="flex gap-2 mb-2.5 flex-wrap">
                <label className={uploadBtnClass}>
                  {uploading === 'favicon' ? <><RefreshCw size={13} className="animate-spin" /> Uploading…</> : <><Upload size={13} /> Upload New</>}
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) upload(f,'favicon'); e.target.value='' }} />
                </label>
                <button onClick={() => set('showMediaModal', 'favicon')} className="btn btn-outline btn-sm flex-1 p-2 min-w-[120px]">
                  Media Library
                </button>
                <button onClick={() => resetToDefault('favicon')} className="btn btn-ghost btn-sm shrink-0" title="Reset to default">
                  <RefreshCw size={13} />
                </button>
              </div>
              <div>
                <label className={lblClass}>Or paste URL</label>
                <input value={settings.favicon_url||''} onChange={e=>set('favicon_url',e.target.value)} placeholder="https://…" className={inpClass} />
              </div>
            </div>
          </div>

        </div>

        {/* ── SITE INFO ── */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">🏢 Site Information</h2>
          <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            {[
              { k:'site_name', l:'Site Name',   ph:'ARIOSETECH' },
              { k:'tagline',   l:'Tagline',      ph:'Consider It Solved' },
            ].map(({ k, l, ph }) => (
              <div key={k}><label className={lblClass}>{l}</label><input value={settings[k]||''} onChange={e=>set(k,e.target.value)} placeholder={ph} className={inpClass} /></div>
            ))}
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">📞 Contact Details</h2>
          <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            {[
              { k:'email',    l:'Email',           ph:'info@ariosetech.com' },
              { k:'phone',    l:'Phone',            ph:'+92 300 9484 739' },
              { k:'whatsapp', l:'WhatsApp URL',     ph:'https://wa.me/923009484739' },
              { k:'address',  l:'Office Address',   ph:'95 College Road, Lahore' },
            ].map(({ k, l, ph }) => (
              <div key={k}><label className={lblClass}>{l}</label><input value={settings[k]||''} onChange={e=>set(k,e.target.value)} placeholder={ph} className={inpClass} /></div>
            ))}
          </div>
        </div>

        {/* ── SOCIAL ── */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">🔗 Social Media</h2>
          <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            {[
              { k:'facebook',  l:'Facebook URL',  ph:'https://facebook.com/ariosetech' },
              { k:'instagram', l:'Instagram URL', ph:'https://instagram.com/ariosetech' },
              { k:'linkedin',  l:'LinkedIn URL',  ph:'https://linkedin.com/company/ariosetech' },
            ].map(({ k, l, ph }) => (
              <div key={k}><label className={lblClass}>{l}</label><input value={settings[k]||''} onChange={e=>set(k,e.target.value)} placeholder={ph} className={inpClass} /></div>
            ))}
          </div>
        </div>

        {/* Save bottom */}
        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="btn btn-primary btn-lg">
            <Save size={15} /> {saving ? 'Saving…' : 'Save All Settings'}
          </button>
        </div>

        {settings.showMediaModal && (
          <MediaPickerModal 
            onClose={() => set('showMediaModal', '')} 
            onSelect={(url) => { set(settings.showMediaModal === 'logo' ? 'logo_url' : 'favicon_url', url); set('showMediaModal', '') }} 
          />
        )}
      </div>
    </AdminShell>
  )
}
