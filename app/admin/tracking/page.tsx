'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TrackingAdmin() {
  const [config, setConfig] = useState<Record<string, string>>({
    googleAnalyticsId: '', googleTagManagerId: '', metaPixelId: '',
    hotjarId: '', clarityId: '', customHeadScripts: '', customBodyScripts: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/tracking').then(r => r.json()).then(d => setConfig(p => ({ ...p, ...d }))).finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: string) => setConfig(c => ({ ...c, [k]: v }))
  const save = async () => {
    setSaving(true)
    await fetch('/api/tracking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) })
    setSaving(false); toast.success('Tracking saved! Redeploy to apply.')
  }

  const inp = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'var(--font-mono)' }
  const lbl = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }
  const card = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }

  if (loading) return <AdminShell><div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div style={{ padding: '32px', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Tracking & Analytics</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Connect analytics and tracking tools</p>
          </div>
          <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>📊 Analytics IDs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { key: 'googleAnalyticsId',   label: 'Google Analytics 4 ID',  placeholder: 'G-XXXXXXXXXX' },
              { key: 'googleTagManagerId',  label: 'Google Tag Manager ID',   placeholder: 'GTM-XXXXXXX' },
              { key: 'metaPixelId',         label: 'Meta (Facebook) Pixel ID', placeholder: '123456789012345' },
              { key: 'hotjarId',            label: 'Hotjar Site ID',           placeholder: '1234567' },
              { key: 'clarityId',           label: 'Microsoft Clarity ID',     placeholder: 'xxxxxxxxxx' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={lbl}>{label}</label>
                <input value={config[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} style={inp} />
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>📜 Custom Scripts</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px' }}>Add custom HTML/JS scripts (e.g. live chat, CRMs). These require a code update to inject.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={lbl}>Head Scripts (before &lt;/head&gt;)</label>
              <textarea value={config.customHeadScripts || ''} onChange={e => set('customHeadScripts', e.target.value)} rows={4} placeholder="<!-- Your scripts here -->" style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
            </div>
            <div>
              <label style={lbl}>Body Scripts (before &lt;/body&gt;)</label>
              <textarea value={config.customBodyScripts || ''} onChange={e => set('customBodyScripts', e.target.value)} rows={4} placeholder="<!-- Your scripts here -->" style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '16px 20px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>
            ⚠️ <strong>Note:</strong> Tracking IDs require a Vercel redeploy to take effect. Custom scripts need to be injected via your layout.tsx.
          </p>
        </div>
      </div>
    </AdminShell>
  )
}
