'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Trash2, Mail, Phone, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

type Lead = {
  _id: string; name: string; email: string; phone?: string
  service?: string; budget?: string; message: string
  source?: string; status: string; createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  new:       'status-badge--new',
  contacted: 'status-badge--published',
  closed:    'status-badge--archived',
  spam:      'status-badge--draft',
}

export default function LeadsAdmin() {
  const [leads, setLeads]     = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [open, setOpen]       = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/leads').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setLeads(d)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLeads(l => l.map(lead => lead._id === id ? { ...lead, status } : lead))
    toast.success(`Marked as ${status}`)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)
  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed: leads.filter(l => l.status === 'closed').length,
  }

  const M = { fontFamily:'var(--font-mono)' } as const
  const F = { fontFamily:'var(--font-display)' } as const

  return (
    <AdminShell>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Leads &amp; Inquiries</h1>
            <p className="admin-page__subtitle">{leads.length} total submissions from the contact form</p>
          </div>
          <button onClick={load} className="btn btn-outline btn-md">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Status filter tabs */}
        <div style={{ display:'flex', gap:'6px', marginBottom:'20px', flexWrap:'wrap' }}>
          {(['all','new','contacted','closed'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding:'6px 16px', borderRadius:'var(--r-f)', cursor:'pointer',
              border: `1px solid ${filter===s ? 'var(--primary)' : 'var(--border)'}`,
              background: filter===s ? 'var(--primary-soft)' : 'transparent',
              color: filter===s ? 'var(--primary)' : 'var(--text-3)',
              ...F, fontSize:'12px', fontWeight:600, transition:'all 0.15s',
            }}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
              <span style={{ ...M, marginLeft:'6px', fontSize:'10px', opacity:0.7 }}>({counts[s as keyof typeof counts] ?? leads.length})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding:'60px', textAlign:'center', color:'var(--text-3)' }}>
            <RefreshCw size={24} style={{ animation:'spin 1s linear infinite', margin:'0 auto 12px', display:'block' }} />
            Loading leads…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:'60px', textAlign:'center', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'14px' }}>
            <Mail size={36} style={{ color:'var(--text-3)', margin:'0 auto 14px', display:'block' }} />
            <p style={{ ...F, fontSize:'15px', fontWeight:600, color:'var(--text)', marginBottom:'8px' }}>No {filter !== 'all' ? filter : ''} leads yet</p>
            <p style={{ fontSize:'13px', color:'var(--text-3)' }}>
              {filter === 'all'
                ? 'When someone submits the contact form, their inquiry appears here.'
                : `No leads with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {filtered.map(lead => (
              <div key={lead._id} style={{ background:'var(--bg-2)', border:`1px solid ${open===lead._id ? 'rgba(118,108,255,0.35)' : 'var(--border)'}`, borderRadius:'14px', overflow:'hidden', transition:'border-color 0.2s' }}>

                {/* Row summary */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', padding:'16px 20px', cursor:'pointer', gap:'16px' }}
                  onClick={() => setOpen(open === lead._id ? null : lead._id)}>
                  <div style={{ display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap' }}>
                    {/* Avatar */}
                    <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', ...F, fontSize:'14px', fontWeight:800, color:'var(--primary)', flexShrink:0 }}>
                      {lead.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ ...F, fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'3px' }}>{lead.name || 'Unknown'}</p>
                      <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
                        <a href={`mailto:${lead.email}`} style={{ ...M, fontSize:'11px', color:'var(--primary)', textDecoration:'none', display:'flex', alignItems:'center', gap:'4px' }}
                          onClick={e => e.stopPropagation()}>
                          <Mail size={11} /> {lead.email}
                        </a>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} style={{ ...M, fontSize:'11px', color:'var(--text-3)', textDecoration:'none', display:'flex', alignItems:'center', gap:'4px' }}
                            onClick={e => e.stopPropagation()}>
                            <Phone size={11} /> {lead.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    {lead.service && <span className="tag" style={{ flexShrink:0 }}>{lead.service}</span>}
                    {lead.budget  && <span className="tag" style={{ flexShrink:0, color:'var(--green)', borderColor:'rgba(0,229,160,0.2)' }}>{lead.budget}</span>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
                    <span style={{ ...M, fontSize:'10px', color:'var(--text-3)' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}
                    </span>
                    <span className={`status-badge ${STATUS_COLORS[lead.status] || 'status-badge--new'}`}>{lead.status}</span>
                    <span style={{ ...M, fontSize:'12px', color:'var(--text-3)' }}>{open===lead._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded detail */}
                {open === lead._id && (
                  <div style={{ borderTop:'1px solid var(--border)', padding:'20px' }}>
                    {/* Message */}
                    <div style={{ marginBottom:'20px' }}>
                      <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>Message</p>
                      <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.8, background:'var(--bg-3)', padding:'14px 16px', borderRadius:'10px', border:'1px solid var(--border)' }}>
                        {lead.message || <em style={{ color:'var(--text-3)' }}>No message</em>}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
                      <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Mark as:</p>
                      {['new','contacted','closed','spam'].map(s => (
                        <button key={s} onClick={() => updateStatus(lead._id, s)}
                          style={{ padding:'5px 14px', borderRadius:'var(--r-f)', cursor:'pointer', border:`1px solid ${lead.status===s ? 'var(--primary)' : 'var(--border)'}`, background:lead.status===s ? 'var(--primary-soft)' : 'transparent', color:lead.status===s ? 'var(--primary)' : 'var(--text-3)', ...F, fontSize:'12px', fontWeight:600, transition:'all 0.15s' }}>
                          {s}
                        </button>
                      ))}
                      <div style={{ marginLeft:'auto', display:'flex', gap:'8px' }}>
                        <a href={`mailto:${lead.email}?subject=Re: Your inquiry on ARIOSETECH&body=Hi ${lead.name},%0A%0AThank you for reaching out!`}
                          className="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">
                          <Mail size={12} /> Reply
                        </a>
                        <button onClick={() => del(lead._id)} className="btn btn-danger btn-sm">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AdminShell>
  )
}
