'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Pencil, Trash2, Star, ExternalLink } from 'lucide-react'
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

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-3)' }}>
              <p style={{ marginBottom: '16px' }}>No portfolio items. Run the seed or create one.</p>
              <Link href="/admin/portfolio/new" className="btn btn-primary btn-md"><Plus size={14} /> Add First Project</Link>
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
                      <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)' }}>{item.title}</td>
                      <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{item.client}</td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 10px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.08em', background: `${color}15`, border: `1px solid ${color}35`, color }}>
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => toggle(item._id, 'published', item.published)}
                          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                          <span className={`status-badge status-badge--${item.published ? 'published' : 'draft'}`}>
                            {item.published ? 'Published' : 'Draft'}
                          </span>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => toggle(item._id, 'featured', item.featured)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                          <Star size={16} fill={item.featured ? 'var(--amber)' : 'none'} style={{ color: item.featured ? 'var(--amber)' : 'var(--text-3)', transition: 'all 0.2s' }} />
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <Link href={`/admin/portfolio/${item._id}`} className="btn btn-outline btn-sm">
                            <Pencil size={11} /> Edit
                          </Link>
                          <Link href={`/portfolio/${item.slug}`} target="_blank" className="btn btn-ghost btn-sm" title="View live">
                            <ExternalLink size={13} />
                          </Link>
                          <button onClick={() => del(item._id, item.title)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>
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
