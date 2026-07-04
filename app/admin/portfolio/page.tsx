'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Pencil, Trash2, Star, ExternalLink } from '@/components/ui/Icons'
import toast from 'react-hot-toast'

type Item = { _id: string; title: string; client: string; category: string; slug: string; featured: boolean; published: boolean; updatedAt: string }

const CAT_COLOR: Record<string, string> = { wordpress: '#4f6ef7', woocommerce: '#9b6dff', shopify: '#00e5a0', seo: '#fbbf24' }

export default function PortfolioAdmin() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => fetch('/api/portfolio?admin=1').then(r => r.json()).then(d => { if (Array.isArray(d)) setItems(d) }).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  const toggle = async (id: string, field: 'published' | 'featured', current: boolean) => {
    await fetch(`/api/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    })
    load()
  }

  return (
    <AdminShell>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Portfolio</h1>
            <p className="admin-page__subtitle">{items.length} projects — click Edit to modify content, results, and images</p>
          </div>
          <Link href="/admin/portfolio/new" className="btn btn-primary btn-md">
            <Plus size={14} /> New Project
          </Link>
        </div>

        <div className="bg-bg-2 border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-text-3">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-[60px] text-center text-text-3">
              <p className="mb-4">No portfolio items. Run the seed or create one.</p>
              <Link href="/admin/portfolio/new" className="btn btn-primary btn-md mx-auto"><Plus size={14} /> Add First Project</Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead><tr>
                {['Project', 'Client', 'Category', 'Status', 'Featured', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr></thead>
              <tbody>
                {items.map(item => {
                  const color = CAT_COLOR[item.category] || '#766cff'
                  return (
                    <tr key={item._id}>
                      <td className="font-display font-semibold text-white">{item.title}</td>
                      <td className="text-text-2 text-[13px]">{item.client}</td>
                      <td>
                        <span className="font-mono text-[10px] py-[3px] px-2.5 rounded-full uppercase tracking-wider border" style={{ background: `${color}15`, borderColor: `${color}35`, color }}>
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => toggle(item._id, 'published', item.published)}
                          className="cursor-pointer bg-transparent border-none p-0">
                          <span className={`status-badge status-badge--${item.published ? 'published' : 'draft'}`}>
                            {item.published ? 'Published' : 'Draft'}
                          </span>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => toggle(item._id, 'featured', item.featured)} className="bg-transparent border-none cursor-pointer p-1">
                          <Star size={16} fill={item.featured ? 'var(--amber)' : 'none'} className={`transition-colors duration-200 ${item.featured ? 'text-amber-400' : 'text-text-3'}`} />
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/portfolio/${item._id}`} className="btn btn-outline btn-sm">
                            <Pencil size={11} /> Edit
                          </Link>
                          <Link href={`/portfolio/${item.slug}`} target="_blank" className="btn btn-ghost btn-sm" title="View live">
                            <ExternalLink size={13} />
                          </Link>
                          <button onClick={() => del(item._id, item.title)} className="btn btn-ghost btn-sm text-[color:var(--red)]">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
