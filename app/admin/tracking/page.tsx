'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save } from '@/components/ui/Icons'
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

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-mono transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"
  const cardClass = "bg-bg-2 border border-border rounded-2xl p-6 mb-5"

  if (loading) return <AdminShell><div className="p-10 text-center text-text-3">Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div className="p-8 max-w-[800px]">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight">Tracking & Analytics</h1>
            <p className="text-[13px] text-text-3 mt-1">Connect analytics and tracking tools</p>
          </div>
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 py-2.5 px-[18px] rounded-lg border-none bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90 disabled:opacity-70">
            <Save size={14} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">📊 Analytics IDs</h2>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {[
              { key: 'googleAnalyticsId',   label: 'Google Analytics 4 ID',  placeholder: 'G-XXXXXXXXXX' },
              { key: 'googleTagManagerId',  label: 'Google Tag Manager ID',   placeholder: 'GTM-XXXXXXX' },
              { key: 'metaPixelId',         label: 'Meta (Facebook) Pixel ID', placeholder: '123456789012345' },
              { key: 'hotjarId',            label: 'Hotjar Site ID',           placeholder: '1234567' },
              { key: 'clarityId',           label: 'Microsoft Clarity ID',     placeholder: 'xxxxxxxxxx' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className={lblClass}>{label}</label>
                <input value={config[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} className={inpClass} />
              </div>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-2">📜 Custom Scripts</h2>
          <p className="text-xs text-text-3 mb-5">Add custom HTML/JS scripts (e.g. live chat, CRMs). These require a code update to inject.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className={lblClass}>Head Scripts (before &lt;/head&gt;)</label>
              <textarea value={config.customHeadScripts || ''} onChange={e => set('customHeadScripts', e.target.value)} rows={4} placeholder="<!-- Your scripts here -->" className={`${inpClass} resize-y leading-[1.6]`} />
            </div>
            <div>
              <label className={lblClass}>Body Scripts (before &lt;/body&gt;)</label>
              <textarea value={config.customBodyScripts || ''} onChange={e => set('customBodyScripts', e.target.value)} rows={4} placeholder="<!-- Your scripts here -->" className={`${inpClass} resize-y leading-[1.6]`} />
            </div>
          </div>
        </div>

        <div className="bg-[rgba(251,191,36,0.06)] border border-[rgba(251,191,36,0.2)] rounded-xl py-4 px-5">
          <p className="text-[13px] text-text-2">
            ⚠️ <strong className="text-white">Note:</strong> Tracking IDs require a Vercel redeploy to take effect. Custom scripts need to be injected via your layout.tsx.
          </p>
        </div>
      </div>
    </AdminShell>
  )
}
