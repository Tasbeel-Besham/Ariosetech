'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save } from '@/components/ui/Icons'
import toast from 'react-hot-toast'

type Theme = Record<string, string>

const FONTS = ['Plus Jakarta Sans', 'Inter', 'Syne', 'DM Sans', 'Geist', 'Space Grotesk', 'Manrope']
const RADII = ['4px', '8px', '10px', '12px', '16px', '20px', '24px']

// Module scope on purpose: defining this inside ThemeAdmin makes React remount the
// inputs on every change, which breaks dragging in the colour picker and limits
// typing to one character before focus is lost.
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'}
          onChange={e => onChange(e.target.value)}
          className="w-11 h-9 p-0.5 rounded-lg border border-border bg-bg-3 cursor-pointer shrink-0"
        />
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-bg-3 border border-border rounded-lg py-[9px] px-3 text-[13px] text-white outline-none font-mono focus:border-primary/50 transition-colors w-full box-border"
        />
      </div>
    </div>
  )
}

export default function ThemeAdmin() {
  const [theme, setTheme] = useState<Theme>({
    colorPrimary: '#766cff', colorSecondary: '#9b8fff', colorPrimaryDark: '#5a50e0',
    colorBg: '#050508', colorText: '#f0f0ff',
    fontDisplay: 'Manrope', fontBody: 'Inter', borderRadius: '12px',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/theme').then(r => r.json()).then(d => setTheme(prev => ({ ...prev, ...d }))).finally(() => setLoading(false))
  }, [])

  const set = (key: string, val: string) => setTheme(t => ({ ...t, [key]: val }))

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/theme', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(theme) })
    setSaving(false)
    if (!res.ok) { toast.error('Could not save, are you logged in?'); return }
    toast.success('Theme saved. Applying…')
    // Colours are injected server-side at the root, so a full reload shows the change everywhere.
    setTimeout(() => window.location.reload(), 700)
  }

  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"
  const cardClass = "bg-bg-2 border border-border rounded-2xl p-6 mb-5"
  const selectClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none font-body focus:border-primary/50 transition-colors"

  if (loading) return <AdminShell><div className="p-10 text-center text-text-3">Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div className="p-8 max-w-[800px]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight">Theme</h1>
            <p className="text-[13px] text-text-3 mt-1">Brand colors, typography, and spacing</p>
          </div>
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 py-2.5 px-[18px] rounded-lg border-none bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90 disabled:opacity-60">
            <Save size={14} /> {saving ? 'Saving…' : 'Save Theme'}
          </button>
        </div>

        {/* Colors */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-1.5">Brand Colors</h2>
          <p className="text-[11px] text-text-3 mb-5">Primary drives the whole site, buttons, links, gradients, glows. Changes apply after saving and reloading the page.</p>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <ColorField label="Primary" value={theme.colorPrimary || ''} onChange={v => set('colorPrimary', v)} />
            <ColorField label="Secondary (gradient end)" value={theme.colorSecondary || ''} onChange={v => set('colorSecondary', v)} />
            <ColorField label="Primary Dark (hover/deep)" value={theme.colorPrimaryDark || ''} onChange={v => set('colorPrimaryDark', v)} />
          </div>
        </div>

        {/* Live preview */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">Color Preview</h2>
          <div className="flex gap-2.5 flex-wrap mb-4">
            {[
              { label: 'Primary', color: theme.colorPrimary },
              { label: 'Secondary', color: theme.colorSecondary },
              { label: 'Primary Dark', color: theme.colorPrimaryDark },
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
          {/* Gradient + button preview so you see the real combination */}
          <div className="rounded-xl h-12 mb-3" style={{ background: `linear-gradient(135deg, ${theme.colorPrimary} 0%, ${theme.colorSecondary} 100%)` }} />
          <div className="flex gap-3">
            <span className="inline-flex items-center px-5 py-2.5 rounded-[10px] text-white text-[13px] font-semibold" style={{ background: `linear-gradient(180deg, ${theme.colorSecondary} 0%, ${theme.colorPrimary} 100%)` }}>Primary Button</span>
            <span className="inline-flex items-center px-5 py-2.5 rounded-[10px] text-[13px] font-semibold border" style={{ color: theme.colorPrimary, borderColor: theme.colorPrimary, background: `${theme.colorPrimary}1a` }}>Outline</span>
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
