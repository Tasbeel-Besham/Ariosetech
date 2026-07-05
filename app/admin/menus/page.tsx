'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save, Plus, Trash2, GripVertical } from '@/components/ui/Icons'
import toast from 'react-hot-toast'

type NavItem = { label: string; href: string; target?: string; children?: NavItem[] }
type Menu    = { _id?: string; location: string; name: string; items: NavItem[] }

const LOCATIONS = [
  { value: 'header', label: 'Header Navigation' },
  { value: 'services_mega', label: 'Services Mega Menu' },
  { value: 'tools', label: 'Tools Dropdown' },
  { value: 'mobile', label: 'Mobile Menu' },
]

// Default menus pre-populated so the UI is never blank
const DEFAULTS: Record<string, NavItem[]> = {
  header: [
    { label: 'Home',      href: '/' },
    { label: 'Services',  href: '/services/wordpress' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Tools',     href: '/tools/wordpress-theme-detector' },
    { label: 'About',     href: '/about' },
    { label: 'Blog',      href: '/blog' },
  ],
  services_mega: [
    {
      label: 'WordPress', href: '/services/wordpress',
      children: [
        { label: 'Website Development',   href: '/services/wordpress' },
        { label: 'Migration Services',    href: '/services/wordpress#migration' },
        { label: 'Bug & Error Fixing',    href: '/services/wordpress#bugs' },
        { label: 'Maintenance & Support', href: '/services/wordpress#maintenance' },
        { label: 'Speed Optimization',    href: '/services/wordpress#speed' },
        { label: 'Security Services',     href: '/services/wordpress#security' },
        { label: 'Virus Removal',         href: '/services/wordpress#virus-removal' },
        { label: 'Backup Solutions',      href: '/services/wordpress#backup' },
        { label: 'Website Redesign',      href: '/services/wordpress#redesign' },
        { label: 'Multilingual Websites', href: '/services/wordpress#multilingual' },
      ]
    },
    {
      label: 'WooCommerce', href: '/services/woocommerce',
      children: [
        { label: 'Store Development',        href: '/services/woocommerce' },
        { label: 'Theme Customization',      href: '/services/woocommerce#theme' },
        { label: 'Payment Gateway',          href: '/services/woocommerce#payments' },
        { label: 'Performance Optimization', href: '/services/woocommerce#performance' },
        { label: 'Maintenance & Support',    href: '/services/woocommerce#maintenance' },
        { label: 'Multi-vendor Solutions',   href: '/services/woocommerce#multivendor' },
        { label: 'Multilingual Websites',    href: '/services/woocommerce#multilingual' },
        { label: 'Migration Services',       href: '/services/woocommerce#migration' },
      ]
    },
    {
      label: 'Shopify', href: '/services/shopify',
      children: [
        { label: 'Store Development',        href: '/services/shopify' },
        { label: 'Migration Services',       href: '/services/shopify#migration' },
        { label: 'Performance Optimization', href: '/services/shopify#performance' },
        { label: 'Integration Services',     href: '/services/shopify#integrations' },
        { label: 'Maintenance & Support',    href: '/services/shopify#maintenance' },
        { label: 'Shopify Plus',             href: '/services/shopify#plus' },
        { label: 'Store Redesign',           href: '/services/shopify#redesign' },
        { label: 'App Development',          href: '/services/shopify#app-dev' },
      ]
    },
    {
      label: 'SEO', href: '/services/seo',
      children: [
        { label: 'Website SEO',   href: '/services/seo#website-seo' },
        { label: 'Local SEO',     href: '/services/seo#local-seo' },
        { label: 'Technical SEO', href: '/services/seo#technical-seo' },
        { label: 'SEO Content',   href: '/services/seo#seo-content' },
      ]
    }
  ],
  tools: [
    { label: 'WordPress Theme Detector', href: '/tools/wordpress-theme-detector' },
    { label: 'Shopify Theme Detector',   href: '/tools/shopify-theme-detector' },
  ],
  mobile: [
    { label: 'Home',      href: '/' },
    { label: 'Services',  href: '/services/wordpress' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog',      href: '/blog' },
    { label: 'About',     href: '/about' },
    { label: 'Contact',   href: '/contact' },
  ],
}

export default function MenusAdmin() {
  const [menus, setMenus]   = useState<Menu[]>([])
  const [active, setActive] = useState('header')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [pageOptions, setPageOptions] = useState<{ label: string; href: string }[]>([])

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

  // Build the page picker: real CMS pages + the built-in static routes,
  // so menu items can point at a page without hand-typing the URL.
  useEffect(() => {
    const STATIC: { label: string; href: string }[] = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
      { label: 'WordPress Services', href: '/services/wordpress' },
      { label: 'WooCommerce Services', href: '/services/woocommerce' },
      { label: 'Shopify Services', href: '/services/shopify' },
      { label: 'SEO Services', href: '/services/seo' },
      { label: 'WordPress Theme Detector', href: '/tools/wordpress-theme-detector' },
      { label: 'Shopify Theme Detector', href: '/tools/shopify-theme-detector' },
    ]
    fetch('/api/pages')
      .then(r => r.ok ? r.json() : [])
      .then((pages: unknown) => {
        const dynamic = Array.isArray(pages)
          ? (pages as { title?: string; fullPath?: string; status?: string }[])
              .filter(p => p.fullPath && p.status === 'published')
              .map(p => ({ label: p.title || p.fullPath || '', href: p.fullPath as string }))
          : []
        // Merge, de-duplicating by href (static first so their nicer labels win).
        const seen = new Set(STATIC.map(s => s.href))
        setPageOptions([...STATIC, ...dynamic.filter(d => !seen.has(d.href))])
      })
      .catch(() => setPageOptions(STATIC))
  }, [])

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
    toast.success('Reset to defaults, click Save to apply')
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2 px-3 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"

  return (
    <AdminShell>
      <div className="p-8 max-w-[860px]">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="admin-page__title">Menus</h1>
            <p className="admin-page__subtitle">Manage navigation menus for header, footer, and mobile</p>
          </div>
          <div className="flex gap-2.5">
            <button onClick={resetToDefault} className="btn btn-outline btn-md">Reset to Default</button>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
              <Save size={14} /> {saving ? 'Saving…' : 'Save Menu'}
            </button>
          </div>
        </div>

        {/* Location tabs */}
        <div className="flex gap-1.5 mb-6 border-b border-border pb-4 flex-wrap">
          {LOCATIONS.map(loc => (
            <button key={loc.value} onClick={() => setActive(loc.value)} className={`py-2 px-[18px] rounded-full cursor-pointer text-[13px] font-semibold font-display transition-all border ${active === loc.value ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border bg-transparent text-text-3'}`}>
              {loc.label}
              <span className="ml-1.5 font-mono text-[10px] opacity-70">
                ({menus.find(m => m.location === loc.value)?.items.length ?? `${DEFAULTS[loc.value]?.length} default`})
              </span>
            </button>
          ))}
        </div>

        {/* Note if using defaults */}
        {!menus.find(m => m.location === active) && (
          <div className="info-box mb-4">
            📋 Showing <strong>default menu items</strong>, click <strong>Save Menu</strong> to save these to your database, or edit and save your custom menu.
          </div>
        )}

        {/* Items editor */}
        <div className="bg-bg-2 border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="py-3.5 px-[18px] border-b border-border flex justify-between items-center flex-wrap gap-3">
            <p className="font-display text-sm font-bold text-white">
              {LOCATIONS.find(l => l.value === active)?.label} ({currentItems.length} items)
            </p>
            <button onClick={addItem} className="btn btn-outline btn-sm"><Plus size={12} /> Add Item</button>
          </div>

          {/* Items list */}
          <div className="p-3">
            {loading ? (
              <div className="p-8 text-center text-text-3">Loading…</div>
            ) : currentItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-text-3 text-[13px] mb-3">No items yet.</p>
                <button onClick={addItem} className="btn btn-primary btn-md"><Plus size={13} /> Add First Item</button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {currentItems.map((item, i) => (
                  <div key={i} className="bg-bg-3 border border-border rounded-[10px] overflow-hidden">
                    {/* Main item row */}
                    <div className="flex gap-2 items-center p-2.5 flex-wrap max-md:flex-col max-md:items-start">
                      <div className="flex gap-2 items-center w-full max-md:w-auto">
                        <GripVertical size={14} className="text-text-3 shrink-0 cursor-grab" />
                        <input value={item.label} onChange={e => updateItem(i, 'label', e.target.value)}
                          className={`${inpClass} flex-none w-[160px] font-semibold max-sm:w-full`} placeholder="Label" />
                        <input value={item.href} onChange={e => updateItem(i, 'href', e.target.value)}
                          className={`${inpClass} flex-1 font-mono text-xs`} placeholder="/url" />
                        <select
                          value=""
                          onChange={e => { if (e.target.value) updateItem(i, 'href', e.target.value) }}
                          className={`${inpClass} w-[130px] cursor-pointer text-xs shrink-0`}
                          title="Pick a page to fill the URL"
                        >
                          <option value="">Pick page…</option>
                          {pageOptions.map(p => <option key={p.href} value={p.href}>{p.label}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-2 items-center w-full max-md:w-auto md:w-auto">
                        <select value={item.target || '_self'} onChange={e => updateItem(i, 'target', e.target.value)}
                          className={`${inpClass} w-[100px] cursor-pointer text-xs`}>
                          <option value="_self">Same tab</option>
                          <option value="_blank">New tab</option>
                        </select>
                        <button onClick={() => addChild(i)}
                          className="py-[7px] px-2.5 rounded-[7px] border border-border bg-transparent cursor-pointer text-text-3 text-[11px] whitespace-nowrap font-display transition-colors hover:text-white hover:border-text-3">
                          + Sub
                        </button>
                        <button onClick={() => removeItem(i)}
                          className="p-[7px] rounded-[7px] border border-border bg-transparent cursor-pointer text-text-3 flex items-center transition-colors hover:border-[#ff4d6d]/40 hover:text-[#ff4d6d]">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Sub-items */}
                    {item.children && item.children.length > 0 && (
                      <div className="border-t border-border py-2 px-3 pl-9 flex flex-col gap-[5px]">
                        {item.children.map((child, ci) => (
                          <div key={ci} className="flex gap-2 items-center flex-wrap">
                            <span className="font-mono text-[10px] text-primary shrink-0">↳</span>
                            <input value={child.label} onChange={e => updateChild(i, ci, 'label', e.target.value)}
                              className={`${inpClass} flex-none w-[140px] text-xs py-1.5 px-2.5`} placeholder="Sub label" />
                            <input value={child.href} onChange={e => updateChild(i, ci, 'href', e.target.value)}
                              className={`${inpClass} flex-1 text-[11px] py-1.5 px-2.5 font-mono`} placeholder="/url" />
                            <select
                              value=""
                              onChange={e => { if (e.target.value) updateChild(i, ci, 'href', e.target.value) }}
                              className={`${inpClass} w-[120px] text-[11px] py-1.5 px-2 cursor-pointer shrink-0`}
                              title="Pick a page"
                            >
                              <option value="">Pick page…</option>
                              {pageOptions.map(p => <option key={p.href} value={p.href}>{p.label}</option>)}
                            </select>
                            <button onClick={() => removeChild(i, ci)}
                              className="p-[5px] rounded-md border-none bg-transparent cursor-pointer text-text-3 text-[13px] transition-colors hover:text-[#ff4d6d]"></button>
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

        <div className="warn-box mt-4">
          <strong>Tip:</strong> The <strong>Services Mega Menu</strong> location powers the Services dropdown in the navbar. Each top-level item there (WordPress, WooCommerce, Shopify, SEO) is a column, and its <em>sub-items</em> are the links inside that column. If the dropdown ever looks empty, open the <strong>Services Mega Menu</strong> tab and use <strong>Reset to defaults</strong>, then Save. Changes apply on the next page load.
        </div>
      </div>
    </AdminShell>
  )
}
