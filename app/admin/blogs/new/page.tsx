'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/layout/AdminShell'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const CATEGORIES = ['E-Commerce', 'WordPress', 'WooCommerce', 'Shopify', 'SEO', 'Performance', 'Security', 'General']

export default function NewBlogPost() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'WordPress',
    author: 'ARIOSETECH Team',
    date: new Date().toISOString().split('T')[0],
    readTime: 5,
    tags: '',
    published: false,
    content: [{ type: 'p', text: '' }] as { type: 'h2' | 'p'; text: string }[],
    seo: { title: '', description: '', keywords: '', ogImage: '' },
  })

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))
  const setSeo = (key: string, val: string) => setForm(f => ({ ...f, seo: { ...f.seo, [key]: val } }))

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const addBlock = (type: 'h2' | 'p') => setForm(f => ({ ...f, content: [...f.content, { type, text: '' }] }))
  const updateBlock = (i: number, text: string) => setForm(f => ({ ...f, content: f.content.map((b, j) => j === i ? { ...b, text } : b) }))
  const removeBlock = (i: number) => setForm(f => ({ ...f, content: f.content.filter((_, j) => j !== i) }))

  const save = async (publish = false) => {
    if (!form.title || !form.slug) return toast.error('Title and slug are required')
    setSaving(true)
    const res = await fetch('/api/blogs', {
      method: 'POST',
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
    if (res.ok) {
      toast.success(publish ? 'Published!' : 'Draft saved!')
      router.push('/admin/blogs')
    } else {
      const { error } = await res.json()
      toast.error(error || 'Failed to save')
    }
  }

  const inp = {
    width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--text)',
    outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'var(--font-body)',
    transition: 'border-color 0.15s',
  }
  const lbl = {
    fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)',
    textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '6px',
  }
  const card = {
    background: 'var(--bg-2)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '24px', marginBottom: '20px',
  }

  return (
    <AdminShell>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/admin/blogs" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} className="hover:text-[var(--text)]">
              <ArrowLeft size={14} /> Blogs
            </Link>
            <span style={{ color: 'var(--border-2)' }}>/</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>New Post</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => save(false)} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
              <Save size={14} /> Save Draft
            </button>
            <button onClick={() => save(true)} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)', opacity: saving ? 0.7 : 1 }}>
              <Eye size={14} /> {saving ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>📝 Post Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={lbl}>Title *</label>
              <input value={form.title} onChange={e => { set('title', e.target.value); if (!form.slug) set('slug', autoSlug(e.target.value)) }}
                placeholder="e.g. How to Speed Up Your WordPress Site"
                style={{ ...inp, fontSize: '16px', fontWeight: 600 }}
                onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
              <span style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-3)', background: 'var(--bg-4)', borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>ariosetech.com/blog/</span>
              <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="post-url-slug" style={{ ...inp, border: 'none', borderRadius: 0, background: 'transparent', fontFamily: 'var(--font-mono)' }} />
            </div>
            <div>
              <label style={lbl}>Excerpt (shown on listing pages) *</label>
              <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} placeholder="Brief summary of the post…" style={{ ...inp, resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', gap: '12px' }}>
              <div>
                <label style={lbl}>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} style={inp}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Author</label>
                <input value={form.author} onChange={e => set('author', e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Publish Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Read (min)</label>
                <input type="number" value={form.readTime} onChange={e => set('readTime', e.target.value)} min={1} max={60} style={inp} />
              </div>
            </div>
            <div>
              <label style={lbl}>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="WordPress, Speed, Performance" style={inp} />
            </div>
          </div>
        </div>

        {/* Content editor */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>✍️ Content</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => addBlock('h2')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                + Heading
              </button>
              <button onClick={() => addBlock('p')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                + Paragraph
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {form.content.map((block, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '8px', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: block.type === 'h2' ? 'var(--blue)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', background: block.type === 'h2' ? 'rgba(79,110,247,0.1)' : 'var(--bg-4)', padding: '2px 6px', borderRadius: '4px', border: `1px solid ${block.type === 'h2' ? 'rgba(79,110,247,0.2)' : 'var(--border)'}` }}>
                    {block.type === 'h2' ? 'H2' : 'P'}
                  </span>
                </div>
                <textarea
                  value={block.text}
                  onChange={e => updateBlock(i, e.target.value)}
                  placeholder={block.type === 'h2' ? 'Section heading…' : 'Paragraph text…'}
                  rows={block.type === 'h2' ? 1 : 3}
                  style={{
                    ...inp, flex: 1, resize: 'vertical',
                    fontSize: block.type === 'h2' ? '16px' : '14px',
                    fontWeight: block.type === 'h2' ? 700 : 400,
                    fontFamily: block.type === 'h2' ? 'var(--font-display)' : 'var(--font-body)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
                <button onClick={() => removeBlock(i)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-3)', flexShrink: 0, marginTop: '1px', transition: 'all 0.15s' }} className="hover:border-[rgba(255,77,109,0.4)] hover:text-[#ff4d6d]">
                  ✕
                </button>
              </div>
            ))}
            {form.content.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '13px', padding: '20px' }}>Add blocks above to start writing</p>
            )}
          </div>
        </div>

        {/* SEO */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>🔍 SEO Settings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={lbl}>SEO Title <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(50-60 chars recommended)</span></label>
              <input value={form.seo.title} onChange={e => setSeo('title', e.target.value)} placeholder={form.title || 'Post title'} style={inp}
                onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: form.seo.title.length > 60 ? '#ff4d6d' : 'var(--text-3)', marginTop: '4px' }}>{form.seo.title.length}/60</p>
            </div>
            <div>
              <label style={lbl}>Meta Description <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(150-160 chars recommended)</span></label>
              <textarea value={form.seo.description} onChange={e => setSeo('description', e.target.value)} rows={2} placeholder={form.excerpt || 'Describe this post for search engines…'} style={{ ...inp, resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: form.seo.description.length > 160 ? '#ff4d6d' : 'var(--text-3)', marginTop: '4px' }}>{form.seo.description.length}/160</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Focus Keywords (comma separated)</label>
                <input value={form.seo.keywords} onChange={e => setSeo('keywords', e.target.value)} placeholder="wordpress speed, site optimization" style={inp} />
              </div>
              <div>
                <label style={lbl}>OG Image URL</label>
                <input value={form.seo.ogImage} onChange={e => setSeo('ogImage', e.target.value)} placeholder="https://ariosetech.com/images/post.jpg" style={inp} />
              </div>
            </div>

            {/* Google preview */}
            {(form.seo.title || form.title) && (
              <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Google Preview</p>
                <div style={{ background: '#fff', borderRadius: '8px', padding: '14px' }}>
                  <p style={{ fontSize: '14px', color: '#1a0dab', fontWeight: 500, marginBottom: '2px', fontFamily: 'Arial, sans-serif' }}>
                    {form.seo.title || form.title} | ARIOSETECH
                  </p>
                  <p style={{ fontSize: '12px', color: '#006621', marginBottom: '4px', fontFamily: 'Arial, sans-serif' }}>
                    ariosetech.com/blog/{form.slug || 'post-slug'}
                  </p>
                  <p style={{ fontSize: '13px', color: '#545454', lineHeight: 1.5, fontFamily: 'Arial, sans-serif' }}>
                    {form.seo.description || form.excerpt || 'No description set.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom save */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Link href="/admin/blogs" style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Cancel</Link>
          <button onClick={() => save(false)} disabled={saving} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            Save Draft
          </button>
          <button onClick={() => save(true)} disabled={saving} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Publishing…' : 'Publish Post'}
          </button>
        </div>
      </div>
    </AdminShell>
  )
}
