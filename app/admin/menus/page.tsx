'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save, Plus, Trash2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

type NavItem = { label: string; href: string; target?: string; children?: NavItem[] }
type Menu    = { _id?: string; location: string; name: string; items: NavItem[] }

const LOCATIONS = [
  { value: 'header', label: 'Header Navigation' },
  { value: 'footer', label: 'Footer Navigation' },
  { value: 'mobile', label: 'Mobile Menu' },
]

// Default menus pre-populated so the UI is never blank
const DEFAULTS: Record<string, NavItem[]> = {
  header: [
    { label: 'Home',      href: '/' },
    { label: 'WordPress', href: '/services/wordpress' },
    { label: 'Shopify',   href: '/services/shopify' },
    { label: 'WooCommerce', href: '/services/woocommerce' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'About Us',  href: '/about' },
    { label: 'Contact',   href: '/contact' },
    { label: 'Blog',      href: '/blog' },
  ],
  footer: [
    { 
      label: 'WordPress', 
      href: '#',
      children: [
        { label: 'Website Development',   href: '/services/wordpress' },
        { label: 'Migration Services',    href: '/services/wordpress#migration' },
        { label: 'Speed Optimization',    href: '/services/wordpress#speed' },
        { label: 'Website Redesign',      href: '/services/wordpress#redesign' },
      ]
    },
    { 
      label: 'Shopify', 
      href: '#',
      children: [
        { label: 'Store Development',        href: '/services/shopify' },
        { label: 'Migration Services',       href: '/services/shopify#migration' },
        { label: 'Store Redesign',           href: '/services/shopify#redesign' },
        { label: 'App Development',          href: '/services/shopify#app-dev' },
      ]
    },
    { 
      label: 'WooCommerce', 
      href: '#',
      children: [
        { label: 'Store Development',        href: '/services/woocommerce' },
        { label: 'Theme Customization',      href: '/services/woocommerce#theme' },
        { label: 'Payment Gateway',          href: '/services/woocommerce#payments' },
        { label: 'Migration Services',       href: '/services/woocommerce#migration' },
      ]
    },
    { 
      label: 'Company', 
      href: '#',
      children: [
        { label: 'About Us',          href: '/about' },
        { label: 'Portfolio',         href: '/portfolio' },
        { label: 'Blog',              href: '/blog' },
        { label: 'Contact',           href: '/contact' },
      ]
    },
  ],
  mobile: [
    { label: 'Home',      href: '/' },
    { label: 'WordPress', href: '/services/wordpress' },
    { label: 'Shopify',   href: '/services/shopify' },
    { label: 'WooCommerce', href: '/services/woocommerce' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact',   href: '/contact' },
  ],
}

export default function MenusAdmin() {
  const [menus, setMenus]   = useState<Menu[]>([])
  const [active, setActive] = useState('header')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  const load = () => {
    fetch('/api/menus')
      .then(r => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setMenus(data as Menu[])
        else setMenus([])
      })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  // Get current menu — fall back to defaults if DB is empty
  const dbMenu = menus.find(m => m.location === active)
  const currentItems: NavItem[] = (dbMenu && dbMenu.items && dbMenu.items.length > 0)
    ? dbMenu.items
    : DEFAULTS[active] || []

  const setItems = (newItems: NavItem[]) => {
    setMenus(prev => {
      const existing = prev.find(m => m.location === active)
      if (existing) return prev.map(m => m.location === active ? { ...m, items: newItems } : m)
      return [...prev, { location: active, name: active, items: newItems }]
    })
  }

  const addItem    = () => setItems([...currentItems, { label: 'New Item', href: '/' }])
  const removeItem = (i: number) => setItems(currentItems.filter((_, j) => j !== i))
  const updateItem = (i: number, key: string, val: string) =>
    setItems(currentItems.map((item, j) => j === i ? { ...item, [key]: val } : item))
  const addChild   = (i: number) =>
    setItems(currentItems.map((item, j) => j === i ? { ...item, children: [...(item.children || []), { label: 'Sub Item', href: '/' }] } : item))
  const removeChild = (i: number, ci: number) =>
    setItems(currentItems.map((item, j) => j === i ? { ...item, children: (item.children || []).filter((_, k) => k !== ci) } : item))
  const updateChild = (i: number, ci: number, key: string, val: string) =>
    setItems(currentItems.map((item, j) => j === i ? { ...item, children: (item.children || []).map((c, k) => k === ci ? { ...c, [key]: val } : c) } : item))

  const save = async () => {
    setSaving(true)
    const menuToSave = { location: active, name: active, items: currentItems }
    const res = await fetch('/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuToSave),
    })
    setSaving(false)
    if (res.ok) { toast.success('Menu saved!'); load() }
    else toast.error('Failed to save')
  }

  const resetToDefault = () => {
    setItems(DEFAULTS[active] || [])
    toast.success('Reset to defaults — click Save to apply')
  }

  const inp: React.CSSProperties = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '8px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)', transition: 'border-color 0.15s' }

  return (
    <AdminShell>
      <div style={{ padding: '32px', maxWidth: '860px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="admin-page__title">Menus</h1>
            <p className="admin-page__subtitle">Manage navigation menus for header, footer, and mobile</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={resetToDefault} className="btn btn-outline btn-md">Reset to Default</button>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
              <Save size={14} /> {saving ? 'Saving…' : 'Save Menu'}
            </button>
          </div>
        </div>

        {/* Location tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          {LOCATIONS.map(loc => (
            <button key={loc.value} onClick={() => setActive(loc.value)} style={{
              padding: '8px 18px', borderRadius: '100px', cursor: 'pointer',
              border: `1px solid ${active === loc.value ? 'rgba(118,108,255,0.5)' : 'var(--border)'}`,
              background: active === loc.value ? 'var(--primary-soft)' : 'transparent',
              color: active === loc.value ? 'var(--primary)' : 'var(--text-3)',
              fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)', transition: 'all 0.2s',
            }}>
              {loc.label}
              <span style={{ marginLeft: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.7 }}>
                ({menus.find(m => m.location === loc.value)?.items.length ?? `${DEFAULTS[loc.value]?.length} default`})
              </span>
            </button>
          ))}
        </div>

        {/* Note if using defaults */}
        {!menus.find(m => m.location === active) && (
          <div className="info-box" style={{ marginBottom: '16px' }}>
            📋 Showing <strong>default menu items</strong> — click <strong>Save Menu</strong> to save these to your database, or edit and save your custom menu.
          </div>
        )}

        {/* Items editor */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
              {LOCATIONS.find(l => l.value === active)?.label} ({currentItems.length} items)
            </p>
            <button onClick={addItem} className="btn btn-outline btn-sm"><Plus size={12} /> Add Item</button>
          </div>

          {/* Items list */}
          <div style={{ padding: '12px' }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div>
            ) : currentItems.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-3)', fontSize: '13px', marginBottom: '12px' }}>No items yet.</p>
                <button onClick={addItem} className="btn btn-primary btn-md"><Plus size={13} /> Add First Item</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {currentItems.map((item, i) => (
                  <div key={i} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                    {/* Main item row */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 12px' }}>
                      <GripVertical size={14} style={{ color: 'var(--text-3)', flexShrink: 0, cursor: 'grab' }} />
                      <input value={item.label} onChange={e => updateItem(i, 'label', e.target.value)}
                        style={{ ...inp, flex: '0 0 160px', fontWeight: 600 }} placeholder="Label"
                        onFocus={e => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                      <input value={item.href} onChange={e => updateItem(i, 'href', e.target.value)}
                        style={{ ...inp, flex: 1, fontFamily: 'var(--font-mono)', fontSize: '12px' }} placeholder="/url"
                        onFocus={e => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                      <select value={item.target || '_self'} onChange={e => updateItem(i, 'target', e.target.value)}
                        style={{ ...inp, width: '100px', cursor: 'pointer', fontSize: '12px' }}>
                        <option value="_self">Same tab</option>
                        <option value="_blank">New tab</option>
                      </select>
                      <button onClick={() => addChild(i)}
                        style={{ padding: '7px 10px', borderRadius: '7px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '11px', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>
                        + Sub
                      </button>
                      <button onClick={() => removeItem(i)}
                        style={{ padding: '7px', borderRadius: '7px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Sub-items */}
                    {item.children && item.children.length > 0 && (
                      <div style={{ borderTop: '1px solid var(--border)', padding: '8px 12px 10px 36px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {item.children.map((child, ci) => (
                          <div key={ci} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary)', flexShrink: 0 }}>↳</span>
                            <input value={child.label} onChange={e => updateChild(i, ci, 'label', e.target.value)}
                              style={{ ...inp, flex: '0 0 140px', fontSize: '12px', padding: '6px 10px' }} placeholder="Sub label"
                              onFocus={e => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')}
                              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                            <input value={child.href} onChange={e => updateChild(i, ci, 'href', e.target.value)}
                              style={{ ...inp, flex: 1, fontSize: '11px', padding: '6px 10px', fontFamily: 'var(--font-mono)' }} placeholder="/url"
                              onFocus={e => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')}
                              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                            <button onClick={() => removeChild(i, ci)}
                              style={{ padding: '5px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '13px' }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="warn-box" style={{ marginTop: '16px' }}>
          ⚠️ <strong>Note:</strong> The Navbar and Footer currently use hardcoded navigation links. After saving menus here, connect them to the database by updating the Navbar component to fetch from <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>/api/menus?location=header</code>. This is the data store for future dynamic navigation.
        </div>
      </div>
    </AdminShell>
  )
}
