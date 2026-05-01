/* eslint-disable @typescript-eslint/no-explicit-any */
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
      .catch((err: any) => {
        toast.error(err.message || 'Failed to load service data')
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
    { id: 'plans', label: 'Plans (Maint/Backup)' },
    { id: 'why-process', label: 'Why & Process' },
    { id: 'portfolio', label: 'Portfolio Highlights' },
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
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
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
                  <select value={data.status || 'draft'} onChange={e => setData({ ...data, status: e.target.value as 'draft' | 'published' })} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Service Title</label>
                    <input value={svc.title} onChange={e => {
                      const newServices = [...(data.services || [])]
                      newServices[i].title = e.target.value
                      setData({ ...data, services: newServices })
                    }} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Section ID (Anchor Tag)</label>
                    <input value={svc.id} placeholder="e.g. migration" onChange={e => {
                      const newServices = [...(data.services || [])]
                      newServices[i].id = e.target.value.toLowerCase().replace(/\s+/g, '-')
                      setData({ ...data, services: newServices })
                    }} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: 'var(--blue)', fontWeight: 600 }} />
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

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Maintenance Plans */}
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Maintenance Plans</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(data.maintenancePlans || []).map((p, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-3)', borderRadius: '12px', position: 'relative' }}>
                    <button onClick={() => {
                      const plans = [...(data.maintenancePlans || [])]
                      plans.splice(i, 1)
                      setData({ ...data, maintenancePlans: plans })
                    }} style={{ position: 'absolute', top: '12px', right: '12px', color: '#ff6b6b' }}><Trash2 size={16} /></button>
                    <input value={p.tier} onChange={e => {
                      const plans = [...(data.maintenancePlans || [])]
                      plans[i].tier = e.target.value
                      setData({ ...data, maintenancePlans: plans })
                    }} placeholder="Tier Name" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', color: '#fff', fontWeight: 700, marginBottom: '8px' }} />
                    <input value={p.price} onChange={e => {
                      const plans = [...(data.maintenancePlans || [])]
                      plans[i].price = e.target.value
                      setData({ ...data, maintenancePlans: plans })
                    }} placeholder="Price (e.g. $79/mo)" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-3)', fontSize: '13px' }} />
                  </div>
                ))}
                <button onClick={() => setData({ ...data, maintenancePlans: [...(data.maintenancePlans || []), { tier: 'New Tier', price: '', features: [] }] })} style={{ padding: '12px', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--blue)', fontSize: '13px' }}>+ Add Maintenance Plan</button>
              </div>
            </div>

            {/* Backup Plans */}
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Backup Plans</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(data.backupPlans || []).map((p, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-3)', borderRadius: '12px', position: 'relative' }}>
                    <button onClick={() => {
                      const plans = [...(data.backupPlans || [])]
                      plans.splice(i, 1)
                      setData({ ...data, backupPlans: plans })
                    }} style={{ position: 'absolute', top: '12px', right: '12px', color: '#ff6b6b' }}><Trash2 size={16} /></button>
                    <input value={p.tier} onChange={e => {
                      const plans = [...(data.backupPlans || [])]
                      plans[i].tier = e.target.value
                      setData({ ...data, backupPlans: plans })
                    }} placeholder="Tier Name" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', color: '#fff', fontWeight: 700, marginBottom: '8px' }} />
                    <input value={p.price} onChange={e => {
                      const plans = [...(data.backupPlans || [])]
                      plans[i].price = e.target.value
                      setData({ ...data, backupPlans: plans })
                    }} placeholder="Price (e.g. $29/mo)" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-3)', fontSize: '13px' }} />
                  </div>
                ))}
                <button onClick={() => setData({ ...data, backupPlans: [...(data.backupPlans || []), { tier: 'New Tier', price: '', features: [] }] })} style={{ padding: '12px', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--blue)', fontSize: '13px' }}>+ Add Backup Plan</button>
              </div>
            </div>
          </div>
        )}

        {/* Why & Process Tab */}
        {activeTab === 'why-process' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Why Choose Us</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(data.whyUs || []).map((w, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-3)', borderRadius: '12px' }}>
                    <input value={w.title} onChange={e => {
                      const items = [...(data.whyUs || [])]
                      items[i].title = e.target.value
                      setData({ ...data, whyUs: items })
                    }} placeholder="Title" style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontWeight: 600, marginBottom: '4px' }} />
                    <textarea value={w.desc} onChange={e => {
                      const items = [...(data.whyUs || [])]
                      items[i].desc = e.target.value
                      setData({ ...data, whyUs: items })
                    }} placeholder="Description" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-3)', fontSize: '12px', minHeight: '60px' }} />
                  </div>
                ))}
                <button onClick={() => setData({ ...data, whyUs: [...(data.whyUs || []), { icon: '🏆', title: 'New Item', desc: '' }] })} style={{ padding: '12px', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--blue)', fontSize: '13px' }}>+ Add Why Us Item</button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Our Process</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(data.process || []).map((p, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-3)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input value={p.n} onChange={e => {
                        const items = [...(data.process || [])]
                        items[i].n = e.target.value
                        setData({ ...data, process: items })
                      }} placeholder="01" style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--blue)', fontWeight: 800 }} />
                      <input value={p.title} onChange={e => {
                        const items = [...(data.process || [])]
                        items[i].title = e.target.value
                        setData({ ...data, process: items })
                      }} placeholder="Title" style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontWeight: 600 }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => setData({ ...data, process: [...(data.process || []), { n: '01', title: 'New Step', sub: '', desc: '', time: '' }] })} style={{ padding: '12px', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--blue)', fontSize: '13px' }}>+ Add Process Step</button>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(data.portfolio || []).map((p, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Industry / Name</label>
                  <input value={p.name} onChange={e => {
                    const items = [...(data.portfolio || [])]
                    items[i].name = e.target.value
                    setData({ ...data, portfolio: items })
                  }} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Result Description</label>
                  <input value={p.result} onChange={e => {
                    const items = [...(data.portfolio || [])]
                    items[i].result = e.target.value
                    setData({ ...data, portfolio: items })
                  }} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>
            ))}
            <button onClick={() => setData({ ...data, portfolio: [...(data.portfolio || []), { name: 'Retail', industry: '', challenge: '', solution: '', result: '200% increase', resultLabel: '' }] })} style={{ padding: '16px', background: 'var(--bg-2)', border: '1px dashed var(--border)', borderRadius: '16px', color: 'var(--blue)', fontWeight: 600 }}>+ Add Portfolio Highlight</button>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
