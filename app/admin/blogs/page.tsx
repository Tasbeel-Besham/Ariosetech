'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Pencil, Trash2, Eye } from '@/components/ui/Icons'
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
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight">Blog Posts</h1>
            <p className="text-[13px] text-text-3 mt-1">{blogs.length} posts</p>
          </div>
          <Link href="/admin/blogs/new" className="flex items-center gap-2 py-2.5 px-[18px] rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white no-underline text-[13px] font-bold font-display transition-opacity hover:opacity-90">
            <Plus size={15} /> New Post
          </Link>
        </div>

        <div className="bg-bg-2 border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-text-3">Loading…</div>
          ) : blogs.length === 0 ? (
            <div className="p-[60px] text-center text-text-3">
              <p className="mb-4">No blog posts yet</p>
              <Link href="/admin/blogs/new" className="text-[color:var(--blue)] no-underline font-display font-semibold hover:underline">Create your first post →</Link>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Title', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="py-3 px-4 text-left font-mono text-[10px] text-text-3 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blogs.map((b, i) => (
                  <tr key={b._id} className={`hover:bg-bg-3 ${i < blogs.length - 1 ? 'border-b border-border' : ''}`}>
                    <td className="py-3.5 px-4 text-sm font-semibold text-white font-display max-w-[280px]">
                      <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{b.title}</span>
                    </td>
                    <td className="py-3.5 px-4"><span className="tag">{b.category}</span></td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono text-[10px] py-1 px-2.5 rounded-full uppercase tracking-wider border ${
                        b.published ? 'bg-[#00e5a0]/10 border-[#00e5a0]/30 text-[#00e5a0]' : 'bg-[#fbbf24]/10 border-[#fbbf24]/30 text-[#fbbf24]'
                      }`}>
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-text-3">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1.5">
                        <Link href={`/admin/blogs/${b._id}`} className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg no-underline bg-[rgba(var(--primary-rgb),0.1)] border border-[rgba(var(--primary-rgb),0.2)] text-[color:var(--blue)] text-xs font-semibold font-display transition-colors hover:bg-[rgba(var(--primary-rgb),0.2)]">
                          <Pencil size={12} /> Edit
                        </Link>
                        <Link href={`/blog/${b.slug}`} target="_blank" className="py-1.5 px-2 rounded-lg border border-border text-text-3 flex items-center no-underline transition-colors hover:text-white hover:border-border-2">
                          <Eye size={13} />
                        </Link>
                        <button onClick={() => del(b._id)} className="py-1.5 px-2 rounded-lg border border-border bg-transparent cursor-pointer text-text-3 flex items-center transition-colors hover:border-[rgba(255,77,109,0.4)] hover:text-[#ff4d6d]">
                          <Trash2 size={13} />
                        </button>
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
