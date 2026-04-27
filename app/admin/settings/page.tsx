'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save, Upload, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

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

  const inp: React.CSSProperties = { width:'100%', background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', fontSize:'13px', color:'var(--text)', outline:'none', boxSizing:'border-box', fontFamily:'var(--font-body)', transition:'border-color 0.15s' }
  const lbl: React.CSSProperties = { fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:'6px' }
  const card: React.CSSProperties = { background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'16px', padding:'24px', marginBottom:'16px' }
  const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')
  const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'var(--border)')

  if (loading) return <AdminShell><div style={{ padding:'40px', textAlign:'center', color:'var(--text-3)' }}>Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div style={{ padding:'32px', maxWidth:'820px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
          <div>
            <h1 className="admin-page__title">Settings</h1>
            <p className="admin-page__subtitle">Changes apply sitewide — navbar, footer, SEO, and browser tab</p>
          </div>
          <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
            <Save size={14} /> {saving ? 'Saving…' : 'Save All Settings'}
          </button>
        </div>

        {/* ── LOGO & FAVICON ── */}
        <div style={card}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'15px', fontWeight:700, color:'var(--text)', marginBottom:'20px' }}>🎨 Logo &amp; Favicon</h2>
          <p style={{ fontSize:'13px', color:'var(--text-3)', marginBottom:'20px', lineHeight:1.6 }}>
            Changing the logo here updates it <strong style={{ color:'var(--text-2)' }}>everywhere</strong> — navbar, footer, admin panel, and OG image. Changing the favicon updates the browser tab icon.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
            {/* Logo */}
            <div>
              <label style={lbl}>Site Logo</label>
              <div style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px', marginBottom:'12px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80px' }}>
                {settings.logo_url
                  ? <Image src={settings.logo_url} alt="Logo" width={180} height={45} style={{ maxHeight:'48px', width:'auto', objectFit:'contain' }} />
                  : <span style={{ fontSize:'12px', color:'var(--text-3)' }}>No logo set</span>}
              </div>
              <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
                <label style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'8px', borderRadius:'8px', border:'1px solid var(--border-2)', background:'var(--bg-3)', cursor:'pointer', fontSize:'13px', color:'var(--text-2)', fontFamily:'var(--font-display)', fontWeight:600, transition:'all 0.15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-2)'; e.currentTarget.style.color='var(--text-2)' }}>
                  {uploading==='logo' ? <><RefreshCw size={13} style={{ animation:'spin 1s linear infinite' }} /> Uploading…</> : <><Upload size={13} /> Upload Logo</>}
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => { const f=e.target.files?.[0]; if(f) upload(f,'logo'); e.target.value='' }} />
                </label>
                <button onClick={()=>resetToDefault('logo')} className="btn btn-ghost btn-sm" title="Reset to default" style={{ flexShrink:0 }}>
                  <RefreshCw size={13} />
                </button>
              </div>
              <div>
                <label style={lbl}>Or paste URL</label>
                <input value={settings.logo_url||''} onChange={e=>set('logo_url',e.target.value)} placeholder="https://…" style={inp} onFocus={onF} onBlur={onB} />
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label style={lbl}>Favicon (browser tab icon)</label>
              <div style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px', marginBottom:'12px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80px' }}>
                {settings.favicon_url
                  ? <Image src={settings.favicon_url} alt="Favicon" width={64} height={64} style={{ width:'48px', height:'48px', objectFit:'contain' }} />
                  : <span style={{ fontSize:'12px', color:'var(--text-3)' }}>No favicon set</span>}
              </div>
              <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
                <label style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'8px', borderRadius:'8px', border:'1px solid var(--border-2)', background:'var(--bg-3)', cursor:'pointer', fontSize:'13px', color:'var(--text-2)', fontFamily:'var(--font-display)', fontWeight:600, transition:'all 0.15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-2)'; e.currentTarget.style.color='var(--text-2)' }}>
                  {uploading==='favicon' ? <><RefreshCw size={13} style={{ animation:'spin 1s linear infinite' }} /> Uploading…</> : <><Upload size={13} /> Upload Favicon</>}
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => { const f=e.target.files?.[0]; if(f) upload(f,'favicon'); e.target.value='' }} />
                </label>
                <button onClick={()=>resetToDefault('favicon')} className="btn btn-ghost btn-sm" title="Reset to default" style={{ flexShrink:0 }}>
                  <RefreshCw size={13} />
                </button>
              </div>
              <div>
                <label style={lbl}>Or paste URL</label>
                <input value={settings.favicon_url||''} onChange={e=>set('favicon_url',e.target.value)} placeholder="https://…" style={inp} onFocus={onF} onBlur={onB} />
              </div>
            </div>
          </div>

          <div style={{ marginTop:'16px' }} className="info-box">
            💡 <strong>How logo works:</strong> After saving, the logo updates instantly in the navbar and footer. The admin panel logo is hardcoded for reliability. Favicon updates appear after a browser refresh.
          </div>
        </div>

        {/* ── SITE INFO ── */}
        <div style={card}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'15px', fontWeight:700, color:'var(--text)', marginBottom:'16px' }}>🏢 Site Information</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {[
              { k:'site_name', l:'Site Name',   ph:'ARIOSETECH' },
              { k:'tagline',   l:'Tagline',      ph:'Consider It Solved' },
            ].map(({ k, l, ph }) => (
              <div key={k}><label style={lbl}>{l}</label><input value={settings[k]||''} onChange={e=>set(k,e.target.value)} placeholder={ph} style={inp} onFocus={onF} onBlur={onB} /></div>
            ))}
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div style={card}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'15px', fontWeight:700, color:'var(--text)', marginBottom:'16px' }}>📞 Contact Details</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {[
              { k:'email',    l:'Email',           ph:'info@ariosetech.com' },
              { k:'phone',    l:'Phone',            ph:'+92 300 9484 739' },
              { k:'whatsapp', l:'WhatsApp URL',     ph:'https://wa.me/923009484739' },
              { k:'address',  l:'Office Address',   ph:'95 College Road, Lahore' },
            ].map(({ k, l, ph }) => (
              <div key={k}><label style={lbl}>{l}</label><input value={settings[k]||''} onChange={e=>set(k,e.target.value)} placeholder={ph} style={inp} onFocus={onF} onBlur={onB} /></div>
            ))}
          </div>
        </div>

        {/* ── SOCIAL ── */}
        <div style={card}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'15px', fontWeight:700, color:'var(--text)', marginBottom:'16px' }}>🔗 Social Media</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {[
              { k:'facebook',  l:'Facebook URL',  ph:'https://facebook.com/ariosetech' },
              { k:'instagram', l:'Instagram URL', ph:'https://instagram.com/ariosetech' },
              { k:'linkedin',  l:'LinkedIn URL',  ph:'https://linkedin.com/company/ariosetech' },
            ].map(({ k, l, ph }) => (
              <div key={k}><label style={lbl}>{l}</label><input value={settings[k]||''} onChange={e=>set(k,e.target.value)} placeholder={ph} style={inp} onFocus={onF} onBlur={onB} /></div>
            ))}
          </div>
        </div>

        {/* Save bottom */}
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button onClick={save} disabled={saving} className="btn btn-primary btn-lg">
            <Save size={15} /> {saving ? 'Saving…' : 'Save All Settings'}
          </button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </AdminShell>
  )
}
