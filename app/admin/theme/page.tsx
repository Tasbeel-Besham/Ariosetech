'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

type Theme = Record<string, string>

const FONTS = ['Plus Jakarta Sans', 'Inter', 'Syne', 'DM Sans', 'Geist', 'Space Grotesk', 'Manrope']
const RADII = ['4px', '8px', '10px', '12px', '16px', '20px', '24px']

export default function ThemeAdmin() {
  const [theme, setTheme] = useState<Theme>({
    colorPrimary: '#4f6ef7', colorSecondary: '#9b6dff', colorAccent: '#00e5a0',
    colorBg: '#060612', colorText: '#f2f2ff',
    fontDisplay: 'Syne', fontBody: 'Plus Jakarta Sans', borderRadius: '12px',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/theme').then(r => r.json()).then(d => setTheme(prev => ({ ...prev, ...d }))).finally(() => setLoading(false))
  }, [])

  const set = (key: string, val: string) => setTheme(t => ({ ...t, [key]: val }))

  const save = async () => {
    setSaving(true)
    await fetch('/api/theme', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(theme) })
    setSaving(false); toast.success('Theme saved! Redeploy to apply font changes.')
  }

  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"
  const cardClass = "bg-bg-2 border border-border rounded-2xl p-6 mb-5"
  const inpClass = "flex-1 bg-bg-3 border border-border rounded-lg py-[9px] px-3 text-[13px] text-white outline-none font-mono focus:border-primary/50 transition-colors w-full box-border"
  const selectClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none font-body focus:border-primary/50 transition-colors"

  const ColorField = ({ k, label }: { k: string; label: string }) => (
    <div>
      <label className={lblClass}>{label}</label>
      <div className="flex gap-2 items-center">
        <input type="color" value={theme[k] || '#000'} onChange={e => set(k, e.target.value)}
          className="w-11 h-9 p-0.5 rounded-lg border border-border bg-bg-3 cursor-pointer shrink-0" />
        <input value={theme[k] || ''} onChange={e => set(k, e.target.value)}
          className={inpClass} />
      </div>
    </div>
  )

  if (loading) return <AdminShell><div className="p-10 text-center text-text-3">Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div className="p-8 max-w-[800px]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight">Theme</h1>
            <p className="text-[13px] text-text-3 mt-1">Brand colors, typography, and spacing</p>
          </div>
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 py-2.5 px-[18px] rounded-lg border-none bg-gradient-to-br from-[#4f6ef7] to-[#9b6dff] text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90 disabled:opacity-60">
            <Save size={14} /> {saving ? 'Saving…' : 'Save Theme'}
          </button>
        </div>

        {/* Colors */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">🎨 Brand Colors</h2>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <ColorField k="colorPrimary"   label="Primary (Blue)" />
            <ColorField k="colorSecondary" label="Secondary (Violet)" />
            <ColorField k="colorAccent"    label="Accent (Green)" />
            <ColorField k="colorBg"        label="Background" />
            <ColorField k="colorText"      label="Text Color" />
          </div>
        </div>

        {/* Live preview */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">👁 Color Preview</h2>
          <div className="flex gap-2.5 flex-wrap">
            {[
              { label: 'Primary', color: theme.colorPrimary },
              { label: 'Secondary', color: theme.colorSecondary },
              { label: 'Accent', color: theme.colorAccent },
            ].map(({ label, color }) => (
              <div key={label} className="flex-1 min-w-[120px] rounded-xl overflow-hidden border border-border">
                <div className="h-16 flex items-center justify-center" style={{ background: color }}>
                  <span className="text-white text-[13px] font-semibold font-display shadow-sm">{label}</span>
                </div>
                <div className="p-2 bg-bg-3 text-center border-t border-border">
                  <span className="font-mono text-[11px] text-text-3">{color}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-5">🔤 Typography</h2>
          <div className="grid grid-cols-[1fr_1fr_120px] gap-4 max-md:grid-cols-1">
            <div>
              <label className={lblClass}>Display / Heading Font</label>
              <select value={theme.fontDisplay} onChange={e => set('fontDisplay', e.target.value)}
                className={selectClass}>
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={lblClass}>Body Font</label>
              <select value={theme.fontBody} onChange={e => set('fontBody', e.target.value)}
                className={selectClass}>
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={lblClass}>Border Radius</label>
              <select value={theme.borderRadius} onChange={e => set('borderRadius', e.target.value)}
                className={selectClass}>
                {RADII.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
