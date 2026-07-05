'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Save, Plus, Trash2, Eye } from '@/components/ui/Icons'
import Link from 'next/link'
import toast from 'react-hot-toast'

type FooterLink = { label: string; href: string }
type FooterCol  = { title: string; links: FooterLink[] }

export default function FooterAdmin() {
  const [config, setConfig] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/footer').then(r => r.json()).then(setConfig).finally(() => setLoading(false))
  }, [])

  const set = (key: string, val: unknown) => setConfig(c => ({ ...c, [key]: val }))
  const cols = ((config.columns || []) as FooterCol[])
  const setCols = (c: FooterCol[]) => set('columns', c)

  const addCol    = () => setCols([...cols, { title: 'New Column', links: [{ label: 'New Link', href: '/' }] }])
  const removeCol = (i: number) => setCols(cols.filter((_, j) => j !== i))
  const updateCol = (i: number, key: string, val: unknown) => setCols(cols.map((c, j) => j === i ? { ...c, [key]: val } : c))
  const addLink   = (ci: number) => updateCol(ci, 'links', [...cols[ci].links, { label: 'New Link', href: '/' }])
  const removeLink = (ci: number, li: number) => updateCol(ci, 'links', cols[ci].links.filter((_, j) => j !== li))
  const updateLink = (ci: number, li: number, key: string, val: string) => updateCol(ci, 'links', cols[ci].links.map((l, j) => j === li ? { ...l, [key]: val } : l))

  const populateMegaMenu = () => {
    if (confirm('This will replace your current columns with the WordPress, WooCommerce, and Shopify mega menu columns. Continue?')) {
      setCols([
        {
          title: 'WordPress',
          links: [
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
          title: 'WooCommerce',
          links: [
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
          title: 'Shopify',
          links: [
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
          title: 'Company',
          links: [
            { label: 'About Us',  href: '/about' },
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Blog',      href: '/blog' },
            { label: 'Contact',   href: '/contact' },
          ]
        }
      ]);
      toast.success('Columns populated! Remember to click Save Footer.');
    }
  }

  const save = async () => {
    setSaving(true)
    await fetch('/api/footer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) })
    setSaving(false); toast.success('Footer saved! Refresh the site to see changes.')
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"
  const cardClass = "bg-bg-2 border border-border rounded-2xl p-6 mb-5"

  if (loading) return <AdminShell><div className="p-10 text-center text-text-3">Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div className="p-8 max-w-[960px]">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="admin-page__title">Footer Builder</h1>
            <p className="admin-page__subtitle">Changes reflect live on the website</p>
          </div>
          <div className="flex gap-2.5">
            <Link href="/#footer" target="_blank" className="btn btn-outline btn-md no-underline"><Eye size={14} /> Preview</Link>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
              <Save size={14} /> {saving ? 'Saving…' : 'Save Footer'}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">📢 CTA Banner</h2>
          <div className="flex flex-col gap-3">
            <div><label className={lblClass}>Headline</label><input value={String(config.ctaHeadline || '')} onChange={e => set('ctaHeadline', e.target.value)} className={inpClass} /></div>
            <div><label className={lblClass}>Description</label><input value={String(config.ctaDesc || '')} onChange={e => set('ctaDesc', e.target.value)} className={inpClass} /></div>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <div><label className={lblClass}>CTA Button Label</label><input value={String(config.ctaPrimaryLabel || '')} onChange={e => set('ctaPrimaryLabel', e.target.value)} className={inpClass} /></div>
              <div><label className={lblClass}>CTA Button URL</label><input value={String(config.ctaPrimaryHref || '')} onChange={e => set('ctaPrimaryHref', e.target.value)} className={inpClass} /></div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-[14px]">✍️ Brand Tagline</h2>
          <div><label className={lblClass}>Tagline (shown under logo in footer)</label>
            <textarea value={String(config.tagline || '')} onChange={e => set('tagline', e.target.value)} rows={2} className={`${inpClass} resize-y`} />
          </div>
        </div>

        {/* Link Columns */}
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <h2 className="font-display text-[15px] font-bold text-white">🔗 Navigation Columns</h2>
            <div className="flex gap-2">
              <button onClick={populateMegaMenu} className="btn btn-outline btn-sm border-primary/40 text-primary hover:border-primary hover:bg-primary/5">Populate Mega Menu</button>
              <button onClick={addCol} className="btn btn-outline btn-sm"><Plus size={12} /> Add Column</button>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {cols.map((col, ci) => (
              <div key={ci} className="bg-bg-3 border border-border rounded-xl p-4">
                <div className="flex justify-between mb-3 gap-2">
                  <input value={col.title} onChange={e => updateCol(ci, 'title', e.target.value)} className={`${inpClass} flex-1 w-auto font-bold text-sm font-display`} placeholder="Column Title" />
                  <button onClick={() => removeCol(ci)} className="bg-transparent border-none cursor-pointer text-text-3 shrink-0 px-1 transition-colors hover:text-[#ff4d6d]">
                    <Trash2 size={13} />
                  </button>
                </div>
                {col.links.map((link, li) => (
                  <div key={li} className="flex gap-[5px] mb-[5px] items-center">
                    <input value={link.label} onChange={e => updateLink(ci, li, 'label', e.target.value)} className={`${inpClass} flex-1 text-xs py-1.5 px-2`} placeholder="Label" />
                    <input value={link.href} onChange={e => updateLink(ci, li, 'href', e.target.value)} className={`${inpClass} flex-1 text-[11px] py-1.5 px-2 font-mono`} placeholder="/url" />
                    <button onClick={() => removeLink(ci, li)} className="bg-transparent border-none cursor-pointer text-text-3 px-[2px] transition-colors hover:text-[#ff4d6d]">✕</button>
                  </div>
                ))}
                <button onClick={() => addLink(ci)} className="w-full py-1.5 rounded-md border border-dashed border-border bg-transparent text-text-3 cursor-pointer text-[11px] mt-1 hover:text-white hover:border-text-3">+ Add Link</button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-[14px]">⬇️ Bottom Copyright Bar</h2>
          <div><label className={lblClass}>Copyright Text</label>
            <input value={String(config.bottomText || '')} onChange={e => set('bottomText', e.target.value)} className={inpClass} />
          </div>
        </div>

        <div className="info-box">
          💡 The <strong>Contact column</strong> (phone, email, social links) is controlled via <strong>Settings</strong> page, it reads your site-wide contact information automatically.
        </div>
      </div>
    </AdminShell>
  )
}
