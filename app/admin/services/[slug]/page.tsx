'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminShell from '@/components/layout/AdminShell'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ServicePageDoc } from '@/types'

const defaultServicePage: Partial<ServicePageDoc> = {
  slug: '',
  title: '',
  status: 'draft',
  hero: { eyebrow: '', headline: '', subheadline: '', desc: '', bullets: [], ctaPrimary: '', ctaSecondary: '', startingPrice: '' },
  services: [],
  whyUs: [],
  process: [],
  portfolio: [],
  faqs: [],
  seo: {}
}

export default function ServiceEditorPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params?.slug === 'new'
  
  const [data, setData] = useState<Partial<ServicePageDoc>>(defaultServicePage)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    if (isNew) return
    fetch(`/api/services/${params?.slug}`)
      .then(res => res.json())
      .then(doc => {
        if (doc.error) throw new Error(doc.error)
        setData(doc)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load service data')
        router.push('/admin/services')
      })
  }, [isNew, params?.slug, router])

  const handleSave = async () => {
    if (!data.slug || !data.title) return toast.error('Slug and Title are required')
    setSaving(true)
    try {
      const url = isNew ? '/api/services' : `/api/services/${params?.slug}`
      const method = isNew ? 'POST' : 'PUT'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Service page saved successfully')
      
      if (isNew) router.push(`/admin/services/${data.slug}`)
    } catch {
      toast.error('Error saving data')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <AdminShell><div style={{ padding: '32px' }}>Loading...</div></AdminShell>

  const tabs = [
    { id: 'general', label: 'General & Hero' },
    { id: 'services', label: 'Services List' },
    { id: 'faqs', label: 'FAQs' },
  ]

  return (
    <AdminShell>
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin/services" style={{ padding: '10px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-2)' }}>
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>
                {isNew ? 'Create Service Page' : `Edit: ${data.title}`}
              </h1>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--blue)', color: '#fff', borderRadius: '10px', fontWeight: 600, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', background: activeTab === t.id ? 'rgba(79,110,247,0.1)' : 'transparent', color: activeTab === t.id ? 'var(--blue)' : 'var(--text-3)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Page Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Title</label>
                  <input value={data.title || ''} onChange={e => setData({ ...data, title: e.target.value })} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Slug</label>
                  <input value={data.slug || ''} onChange={e => setData({ ...data, slug: e.target.value })} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} disabled={!isNew} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Status</label>
                  <select value={data.status || 'draft'} onChange={e => setData({ ...data, status: e.target.value as any })} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Hero Section</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Headline</label>
                  <input value={data.hero?.headline || ''} onChange={e => setData({ ...data, hero: { ...data.hero!, headline: e.target.value } })} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Subheadline (Gradient)</label>
                  <input value={data.hero?.subheadline || ''} onChange={e => setData({ ...data, hero: { ...data.hero!, subheadline: e.target.value } })} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Description</label>
                  <textarea value={data.hero?.desc || ''} onChange={e => setData({ ...data, hero: { ...data.hero!, desc: e.target.value } })} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff', minHeight: '100px' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.services?.map((svc, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', position: 'relative' }}>
                <button onClick={() => {
                  const newServices = [...(data.services || [])]
                  newServices.splice(i, 1)
                  setData({ ...data, services: newServices })
                }} style={{ position: 'absolute', top: '24px', right: '24px', color: '#ff6b6b' }}><Trash2 size={18} /></button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Service Title</label>
                    <input value={svc.title} onChange={e => {
                      const newServices = [...(data.services || [])]
                      newServices[i].title = e.target.value
                      setData({ ...data, services: newServices })
                    }} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Price</label>
                    <input value={svc.price} onChange={e => {
                      const newServices = [...(data.services || [])]
                      newServices[i].price = e.target.value
                      setData({ ...data, services: newServices })
                    }} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Description</label>
                  <textarea value={svc.desc} onChange={e => {
                    const newServices = [...(data.services || [])]
                    newServices[i].desc = e.target.value
                    setData({ ...data, services: newServices })
                  }} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>
            ))}
            <button onClick={() => setData({ ...data, services: [...(data.services || []), { id: `svc-${Date.now()}`, title: 'New Service', tagline: '', price: '', time: '', desc: '', features: [] }] })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: 'var(--bg-2)', border: '1px dashed var(--border)', borderRadius: '16px', color: 'var(--blue)', fontWeight: 600 }}>
              <Plus size={18} /> Add Service Offering
            </button>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.faqs?.map((faq, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => {
                  const newFaqs = [...(data.faqs || [])]
                  newFaqs.splice(i, 1)
                  setData({ ...data, faqs: newFaqs })
                }} style={{ position: 'absolute', top: '24px', right: '24px', color: '#ff6b6b' }}><Trash2 size={18} /></button>
                <div style={{ paddingRight: '40px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Question</label>
                  <input value={faq.q} onChange={e => {
                    const newFaqs = [...(data.faqs || [])]
                    newFaqs[i].q = e.target.value
                    setData({ ...data, faqs: newFaqs })
                  }} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff', fontWeight: 600 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Answer</label>
                  <textarea value={faq.a} onChange={e => {
                    const newFaqs = [...(data.faqs || [])]
                    newFaqs[i].a = e.target.value
                    setData({ ...data, faqs: newFaqs })
                  }} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff', minHeight: '80px' }} />
                </div>
              </div>
            ))}
            <button onClick={() => setData({ ...data, faqs: [...(data.faqs || []), { q: 'New Question?', a: 'Answer...' }] })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: 'var(--bg-2)', border: '1px dashed var(--border)', borderRadius: '16px', color: 'var(--blue)', fontWeight: 600 }}>
              <Plus size={18} /> Add FAQ
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
