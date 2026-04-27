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

  const lbl = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }
  const card = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }

  const ColorField = ({ k, label }: { k: string; label: string }) => (
    <div>
      <label style={lbl}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type="color" value={theme[k] || '#000'} onChange={e => set(k, e.target.value)}
          style={{ width: '44px', height: '36px', padding: '2px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-3)', cursor: 'pointer' }} />
        <input value={theme[k] || ''} onChange={e => set(k, e.target.value)}
          style={{ flex: 1, background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-mono)' }} />
      </div>
    </div>
  )

  if (loading) return <AdminShell><div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div style={{ padding: '32px', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Theme</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Brand colors, typography, and spacing</p>
          </div>
          <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save Theme'}
          </button>
        </div>

        {/* Colors */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>🎨 Brand Colors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <ColorField k="colorPrimary"   label="Primary (Blue)" />
            <ColorField k="colorSecondary" label="Secondary (Violet)" />
            <ColorField k="colorAccent"    label="Accent (Green)" />
            <ColorField k="colorBg"        label="Background" />
            <ColorField k="colorText"      label="Text Color" />
          </div>
        </div>

        {/* Live preview */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>👁 Color Preview</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Primary', color: theme.colorPrimary },
              { label: 'Secondary', color: theme.colorSecondary },
              { label: 'Accent', color: theme.colorAccent },
            ].map(({ label, color }) => (
              <div key={label} style={{ flex: 1, minWidth: '120px', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ height: '64px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{label}</span>
                </div>
                <div style={{ padding: '8px', background: 'var(--bg-3)', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>{color}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>🔤 Typography</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '16px' }}>
            <div>
              <label style={lbl}>Display / Heading Font</label>
              <select value={theme.fontDisplay} onChange={e => set('fontDisplay', e.target.value)}
                style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)' }}>
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Body Font</label>
              <select value={theme.fontBody} onChange={e => set('fontBody', e.target.value)}
                style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)' }}>
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Border Radius</label>
              <select value={theme.borderRadius} onChange={e => set('borderRadius', e.target.value)}
                style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)' }}>
                {RADII.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
