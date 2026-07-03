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
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {(['all','new','contacted','closed'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`py-1.5 px-4 rounded-full cursor-pointer font-display text-xs font-semibold transition-all border ${filter===s ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-transparent text-text-3'}`}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
              <span className="font-mono ml-1.5 text-[10px] opacity-70">({counts[s as keyof typeof counts] ?? leads.length})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-[60px] text-center text-text-3">
            <RefreshCw size={24} className="animate-spin mx-auto mb-3 block" />
            Loading leads…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-[60px] text-center bg-bg-2 border border-border rounded-[14px]">
            <Mail size={36} className="text-text-3 mx-auto mb-3.5 block" />
            <p className="font-display text-[15px] font-semibold text-white mb-2">No {filter !== 'all' ? filter : ''} leads yet</p>
            <p className="text-[13px] text-text-3">
              {filter === 'all'
                ? 'When someone submits the contact form, their inquiry appears here.'
                : `No leads with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map(lead => (
              <div key={lead._id} className={`bg-bg-2 border rounded-[14px] overflow-hidden transition-colors duration-200 ${open === lead._id ? 'border-[rgba(118,108,255,0.35)]' : 'border-border'}`}>

                {/* Row summary */}
                <div className="grid grid-cols-[1fr_auto] items-center py-4 px-5 cursor-pointer gap-4 max-md:grid-cols-1"
                  onClick={() => setOpen(open === lead._id ? null : lead._id)}>
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-[rgba(118,108,255,0.2)] flex items-center justify-center font-display text-sm font-extrabold text-primary shrink-0">
                      {lead.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-bold text-white mb-[3px]">{lead.name || 'Unknown'}</p>
                      <div className="flex gap-3.5 flex-wrap">
                        <a href={`mailto:${lead.email}`} className="font-mono text-[11px] text-primary no-underline flex items-center gap-1"
                          onClick={e => e.stopPropagation()}>
                          <Mail size={11} /> {lead.email}
                        </a>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="font-mono text-[11px] text-text-3 no-underline flex items-center gap-1"
                            onClick={e => e.stopPropagation()}>
                            <Phone size={11} /> {lead.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    {lead.service && <span className="tag shrink-0">{lead.service}</span>}
                    {lead.budget  && <span className="tag shrink-0 text-[#00e5a0] border-[rgba(0,229,160,0.2)]">{lead.budget}</span>}
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono text-[10px] text-text-3">
                      {new Date(lead.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}
                    </span>
                    <span className={`status-badge ${STATUS_COLORS[lead.status] || 'status-badge--new'}`}>{lead.status}</span>
                    <span className="font-mono text-xs text-text-3">{open===lead._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded detail */}
                {open === lead._id && (
                  <div className="border-t border-border p-5">
                    {/* Message */}
                    <div className="mb-5">
                      <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider mb-2">Message</p>
                      <p className="text-sm text-text-2 leading-[1.8] bg-bg-3 py-3.5 px-4 rounded-lg border border-border">
                        {lead.message || <em className="text-text-3">No message</em>}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap items-center">
                      <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">Mark as:</p>
                      {['new','contacted','closed','spam'].map(s => (
                        <button key={s} onClick={() => updateStatus(lead._id, s)}
                          className={`py-[5px] px-3.5 rounded-full cursor-pointer font-display text-xs font-semibold transition-all border ${lead.status===s ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-transparent text-text-3'}`}>
                          {s}
                        </button>
                      ))}
                      <div className="ml-auto flex gap-2">
                        <a href={`mailto:${lead.email}?subject=Re: Your inquiry on ARIOSETECH&body=Hi ${lead.name},%0A%0AThank you for reaching out!`}
                          className="btn btn-outline btn-sm no-underline" target="_blank" rel="noopener noreferrer">
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
    </AdminShell>
  )
}
