'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

type Blog = { _id: string; title: string; slug: string; category: string; published: boolean; date: string }

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => fetch('/api/blogs?admin=1').then(r => r.json()).then(setBlogs).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  return (
    <AdminShell>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Blog Posts</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>{blogs.length} posts</p>
          </div>
          <Link href="/admin/blogs/new" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            <Plus size={15} /> New Post
          </Link>
        </div>

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div>
          ) : blogs.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-3)' }}>
              <p style={{ marginBottom: '16px' }}>No blog posts yet</p>
              <Link href="/admin/blogs/new" style={{ color: 'var(--blue)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Create your first post →</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blogs.map((b, i) => (
                  <tr key={b._id} style={{ borderBottom: i < blogs.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-[var(--bg-3)]">
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)', maxWidth: '280px' }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}><span className="tag">{b.category}</span></td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em', background: b.published ? 'rgba(0,229,160,0.12)' : 'rgba(251,191,36,0.12)', border: b.published ? '1px solid rgba(0,229,160,0.3)' : '1px solid rgba(251,191,36,0.3)', color: b.published ? '#00e5a0' : '#fbbf24' }}>
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link href={`/admin/blogs/${b._id}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)', color: 'var(--blue)', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                          <Pencil size={12} /> Edit
                        </Link>
                        <Link href={`/blog/${b.slug}`} target="_blank" style={{ padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-3)', display: 'flex', alignItems: 'center', textDecoration: 'none' }} className="hover:text-[var(--text)]"><Eye size={13} /></Link>
                        <button onClick={() => del(b._id)} style={{ padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }} className="hover:border-[rgba(255,77,109,0.4)] hover:text-[#ff4d6d]"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
