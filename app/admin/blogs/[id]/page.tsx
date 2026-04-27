'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminShell from '@/components/layout/AdminShell'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const CATEGORIES = ['E-Commerce', 'WordPress', 'WooCommerce', 'Shopify', 'SEO', 'Performance', 'Security', 'General']

export default function EditBlogPost() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', category: 'WordPress',
    author: 'ARIOSETECH Team', date: new Date().toISOString().split('T')[0],
    readTime: 5, tags: '', published: false,
    content: [] as { type: 'h2' | 'p'; text: string }[],
    seo: { title: '', description: '', keywords: '', ogImage: '' },
  })

  useEffect(() => {
    fetch(`/api/blogs/${id}`).then(r => r.json()).then(data => {
      setForm({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        category: data.category || 'WordPress',
        author: data.author || 'ARIOSETECH Team',
        date: data.date || new Date().toISOString().split('T')[0],
        readTime: data.readTime || data.readingTime || 5,
        tags: (data.tags || []).join(', '),
        published: data.published || false,
        content: data.content || [],
        seo: {
          title: data.seo?.title || '',
          description: data.seo?.description || '',
          keywords: (data.seo?.keywords || []).join(', '),
          ogImage: data.seo?.ogImage || '',
        },
      })
    }).finally(() => setLoading(false))
  }, [id])

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))
  const setSeo = (key: string, val: string) => setForm(f => ({ ...f, seo: { ...f.seo, [key]: val } }))
  const addBlock = (type: 'h2' | 'p') => setForm(f => ({ ...f, content: [...f.content, { type, text: '' }] }))
  const updateBlock = (i: number, text: string) => setForm(f => ({ ...f, content: f.content.map((b, j) => j === i ? { ...b, text } : b) }))
  const removeBlock = (i: number) => setForm(f => ({ ...f, content: f.content.filter((_, j) => j !== i) }))

  const save = async (publish: boolean) => {
    setSaving(true)
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        published: publish,
        status: publish ? 'published' : 'draft',
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        readTime: Number(form.readTime),
        seo: {
          ...form.seo,
          keywords: form.seo.keywords.split(',').map(k => k.trim()).filter(Boolean),
          robots: { index: true, follow: true },
        },
        updatedAt: new Date().toISOString(),
      }),
    })
    setSaving(false)
    if (res.ok) { toast.success(publish ? 'Published!' : 'Saved!') }
    else { const { error } = await res.json(); toast.error(error || 'Failed') }
  }

  const inp = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'var(--font-body)', transition: 'border-color 0.15s' }
  const lbl = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }
  const card = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }

  if (loading) return <AdminShell><div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div></AdminShell>

  return (
    <AdminShell>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/admin/blogs" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', textDecoration: 'none', fontSize: '13px' }} className="hover:text-[var(--text)]">
              <ArrowLeft size={14} /> Blogs
            </Link>
            <span style={{ color: 'var(--border-2)' }}>/</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>Edit Post</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => save(false)} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
              <Save size={14} /> Save
            </button>
            <button onClick={() => save(true)} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
              <Eye size={14} /> {saving ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>📝 Post Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={lbl}>Title</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} style={{ ...inp, fontSize: '16px', fontWeight: 600 }} onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
              <span style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-3)', background: 'var(--bg-4)', borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>ariosetech.com/blog/</span>
              <input value={form.slug} onChange={e => set('slug', e.target.value)} style={{ ...inp, border: 'none', borderRadius: 0, background: 'transparent', fontFamily: 'var(--font-mono)' }} />
            </div>
            <div>
              <label style={lbl}>Excerpt</label>
              <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', gap: '12px' }}>
              <div><label style={lbl}>Category</label><select value={form.category} onChange={e => set('category', e.target.value)} style={inp}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label style={lbl}>Author</label><input value={form.author} onChange={e => set('author', e.target.value)} style={inp} /></div>
              <div><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inp} /></div>
              <div><label style={lbl}>Read (min)</label><input type="number" value={form.readTime} onChange={e => set('readTime', e.target.value)} min={1} style={inp} /></div>
            </div>
            <div><label style={lbl}>Tags</label><input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="WordPress, Speed" style={inp} /></div>
          </div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>✍️ Content</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => addBlock('h2')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>+ Heading</button>
              <button onClick={() => addBlock('p')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>+ Paragraph</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {form.content.map((block, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: block.type === 'h2' ? 'var(--blue)' : 'var(--text-3)', background: block.type === 'h2' ? 'rgba(79,110,247,0.1)' : 'var(--bg-4)', padding: '3px 6px', borderRadius: '4px', border: `1px solid ${block.type === 'h2' ? 'rgba(79,110,247,0.2)' : 'var(--border)'}`, marginTop: '10px', flexShrink: 0 }}>{block.type === 'h2' ? 'H2' : 'P'}</span>
                <textarea value={block.text} onChange={e => updateBlock(i, e.target.value)} rows={block.type === 'h2' ? 1 : 3} style={{ ...inp, flex: 1, resize: 'vertical', fontSize: block.type === 'h2' ? '15px' : '13px', fontWeight: block.type === 'h2' ? 700 : 400, fontFamily: block.type === 'h2' ? 'var(--font-display)' : 'var(--font-body)' }} onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                <button onClick={() => removeBlock(i)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-3)', flexShrink: 0, marginTop: '1px' }} className="hover:border-[rgba(255,77,109,0.4)] hover:text-[#ff4d6d]">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>🔍 SEO</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={lbl}>SEO Title</label>
              <input value={form.seo.title} onChange={e => setSeo('title', e.target.value)} style={inp} onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: form.seo.title.length > 60 ? '#ff4d6d' : 'var(--text-3)', marginTop: '4px' }}>{form.seo.title.length}/60</p>
            </div>
            <div>
              <label style={lbl}>Meta Description</label>
              <textarea value={form.seo.description} onChange={e => setSeo('description', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: form.seo.description.length > 160 ? '#ff4d6d' : 'var(--text-3)', marginTop: '4px' }}>{form.seo.description.length}/160</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={lbl}>Keywords</label><input value={form.seo.keywords} onChange={e => setSeo('keywords', e.target.value)} placeholder="wordpress, speed" style={inp} /></div>
              <div><label style={lbl}>OG Image URL</label><input value={form.seo.ogImage} onChange={e => setSeo('ogImage', e.target.value)} style={inp} /></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Link href="/admin/blogs" style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Cancel</Link>
          <button onClick={() => save(false)} disabled={saving} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Save Draft</button>
          <button onClick={() => save(true)} disabled={saving} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>
    </AdminShell>
  )
}
