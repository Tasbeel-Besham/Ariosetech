/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

type ServiceSummary = {
  _id: string
  slug: string
  title: string
  status: string
  updatedAt: string
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setServices(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load services')
        setLoading(false)
      })
  }, [])

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete the ${slug} service page?`)) return
    
    try {
      const res = await fetch(`/api/services/${slug}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete')
      setServices(s => s.filter(x => x.slug !== slug))
      toast.success('Service page deleted')
    } catch (err: any) {
      toast.error(err.message || 'Error deleting service page')
    }
  }

  return (
    <AdminShell>
      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
              Service Pages
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>Manage your service offerings, pricing, and FAQs.</p>
          </div>
          <Link href="/admin/services/new" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--blue)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', transition: 'opacity 0.2s' }} className="hover:opacity-90">
            <Plus size={16} /> New Service Page
          </Link>
        </div>

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-3)' }}>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Slug</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Updated</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)' }}>Loading...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)' }}>No service pages found.</td></tr>
              ) : (
                services.map(svc => (
                  <tr key={svc.slug} style={{ borderBottom: '1px solid var(--border)' }} className="group hover:bg-[var(--bg-3)] transition-colors">
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)' }}>{svc.title}</p>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-2)', fontSize: '14px' }}>/{svc.slug}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', background: svc.status === 'published' ? 'rgba(0, 229, 160, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: svc.status === 'published' ? '#00e5a0' : 'var(--text-3)' }}>
                        {svc.status || 'draft'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-3)', fontSize: '13px' }}>
                      {new Date(svc.updatedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link href={`/admin/services/${svc.slug}`} style={{ padding: '8px', borderRadius: '8px', color: 'var(--text-2)', background: 'var(--bg-3)', border: '1px solid var(--border)', transition: 'all 0.2s' }} className="hover:border-[var(--blue)] hover:color-[var(--blue)]">
                          <Edit3 size={16} />
                        </Link>
                        <button onClick={() => handleDelete(svc.slug)} style={{ padding: '8px', borderRadius: '8px', color: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.2)', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-[rgba(255,107,107,0.2)]">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
