'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminShell from '@/components/layout/AdminShell'
import { Save, ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MediaPickerModal } from '@/components/ui/MediaPickerModal'

/* ── Types ─────────────────────────────────────────────────────── */
type Result = { label: string; value: string }
type Block  = {
  id: string
  type: 'title' | 'client' | 'summary' | 'challenge' | 'solution' | 'quote' | 'stack'
      | 'results' | 'text' | 'highlights' | 'metrics' | 'image' | 'technology' | 'process'
  // core fields (used by built-in blocks)
  value?: string
  items?: Result[] | string[]
  // shared label shown in header
  label: string
  // expandable
  open: boolean
}

/* ── Available new section types ──────────────────────────────── */
const ADD_TYPES = [
  { type: 'text',       icon: '📝', label: 'Text Block',       desc: 'Custom paragraph' },
  { type: 'highlights', icon: '✅', label: 'Highlights',       desc: 'Checkmark bullets' },
  { type: 'metrics',    icon: '📊', label: 'Metrics',          desc: 'Big numbers row' },
  { type: 'quote',      icon: '💬', label: 'Quote',            desc: 'Pull quote' },
  { type: 'image',      icon: '🖼',  label: 'Image',            desc: 'Full-width image' },
  { type: 'technology', icon: '⚙️',  label: 'Tech Stack',       desc: 'Technology tags' },
  { type: 'process',    icon: '📋', label: 'Process Steps',    desc: 'Numbered list' },
] as const

const CATS = ['wordpress', 'woocommerce', 'shopify', 'seo']
const uid  = () => `b_${Math.random().toString(36).slice(2, 9)}`

/* ── Helpers ───────────────────────────────────────────────────── */
function coreBlock(type: Block['type'], label: string, value = '', items?: Result[] | string[]): Block {
  return { id: uid(), type, label, value, items, open: true }
}
function newBlock(type: string, label: string): Block {
  const hasItems = ['highlights', 'metrics', 'technology', 'process'].includes(type)
  return { id: uid(), type: type as Block['type'], label, value: '', items: hasItems ? [] : undefined, open: true }
}

/* ── Component ─────────────────────────────────────────────────── */
export default function EditPortfolio() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [blocks, setBlocks]     = useState<Block[]>([])
  const [meta, setMeta]         = useState({ slug: '', clientUrl: '', image: '', category: 'wordpress', featured: false, published: true })
  const [picking, setPicking]   = useState(false)
  const [mediaTarget, setMediaTarget] = useState<string | null>(null)

  /* Load */
  useEffect(() => {
    fetch(`/api/portfolio/${id}`).then(r => r.json()).then(d => {
      // Build ordered blocks from saved data
      const saved: Block[] = Array.isArray(d.blocks) ? d.blocks : []
      if (saved.length > 0) {
        setBlocks(saved.map(b => ({ ...b, open: false })))
      } else {
        // First load — build default order from legacy fields
        setBlocks([
          coreBlock('title',     'Project Title',   d.title     || ''),
          coreBlock('client',    'Client Name',     d.client    || ''),
          coreBlock('summary',   'Summary',         d.summary   || ''),
          coreBlock('challenge', 'The Challenge',   d.challenge || ''),
          coreBlock('solution',  'Our Solution',    d.solution  || ''),
          coreBlock('quote',     'Client Quote',    d.quote     || ''),
          coreBlock('stack',     'Tech Stack',      Array.isArray(d.stack) ? d.stack.join(', ') : (d.stack || '')),
          coreBlock('results',   'Results / Stats', '', Array.isArray(d.results) ? d.results : []),
        ])
      }
      setMeta({
        slug:      d.slug      || '',
        clientUrl: d.clientUrl || '',
        image:     d.image     || '',
        category:  d.category  || 'wordpress',
        featured:  d.featured  || false,
        published: d.published !== false,
      })
    }).finally(() => setLoading(false))
  }, [id])

  /* Block helpers */
  const toggle = (bid: string) =>
    setBlocks(bs => bs.map(b => b.id === bid ? { ...b, open: !b.open } : b))
  const update = (bid: string, patch: Partial<Block>) =>
    setBlocks(bs => bs.map(b => b.id === bid ? { ...b, ...patch } : b))
  const remove = (bid: string) => setBlocks(bs => bs.filter(b => b.id !== bid))
  const move   = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    const arr = [...blocks]; [arr[i], arr[j]] = [arr[j], arr[i]]
    setBlocks(arr)
  }
  const addBlock = (type: string, label: string) => {
    setBlocks(bs => [...bs, { ...newBlock(type, label), open: true }])
    setPicking(false)
  }

  /* Result helpers (for results block) */
  const addResult    = (bid: string) => update(bid, { items: [...(blocks.find(b => b.id === bid)?.items as Result[] || []), { label: '', value: '' }] })
  const removeResult = (bid: string, i: number) => update(bid, { items: (blocks.find(b => b.id === bid)?.items as Result[] || []).filter((_, j) => j !== i) })
  const updateResult = (bid: string, i: number, k: keyof Result, v: string) =>
    update(bid, { items: (blocks.find(b => b.id === bid)?.items as Result[] || []).map((r, j) => j === i ? { ...r, [k]: v } : r) })

  /* List-item helpers (for highlights, technology, process) */
  const addItem    = (bid: string) => update(bid, { items: [...(blocks.find(b => b.id === bid)?.items as string[] || []), ''] })
  const removeItem = (bid: string, i: number) => update(bid, { items: (blocks.find(b => b.id === bid)?.items as string[] || []).filter((_, j) => j !== i) })
  const updateItem = (bid: string, i: number, v: string) =>
    update(bid, { items: (blocks.find(b => b.id === bid)?.items as string[] || []).map((x, j) => j === i ? v : x) })

  /* Metric helpers (value::label pairs stored as strings) */
  const addMetric    = (bid: string) => update(bid, { items: [...(blocks.find(b => b.id === bid)?.items as string[] || []), '::'] })
  const removeMetric = (bid: string, i: number) => update(bid, { items: (blocks.find(b => b.id === bid)?.items as string[] || []).filter((_, j) => j !== i) })
  const updateMetric = (bid: string, i: number, part: 0 | 1, v: string) => {
    const cur = (blocks.find(b => b.id === bid)?.items as string[] || [])[i] || '::'
    const parts = cur.split('::')
    parts[part] = v
    update(bid, { items: (blocks.find(b => b.id === bid)?.items as string[] || []).map((x, j) => j === i ? parts.join('::') : x) })
  }

  /* Save */
  const save = async () => {
    setSaving(true)
    // Derive legacy top-level fields for backward compatibility with the detail page
    const get = (type: string) => blocks.find(b => b.type === type)?.value || ''
    const getItems = (type: string) => blocks.find(b => b.type === type)?.items || []
    const res = await fetch(`/api/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...meta,
        title:     get('title'),
        client:    get('client'),
        summary:   get('summary'),
        challenge: get('challenge'),
        solution:  get('solution'),
        quote:     get('quote'),
        stack:     get('stack').split(',').map((s: string) => s.trim()).filter(Boolean),
        results:   getItems('results'),
        blocks,                    // full ordered block list
        sections: blocks           // also save as sections for detail page renderer
          .filter(b => !['title','client','summary','challenge','solution','quote','stack','results'].includes(b.type))
          .map(b => ({ id: b.id, type: b.type, title: b.label, content: b.value || '', items: Array.isArray(b.items) ? b.items as string[] : [] })),
        updatedAt: new Date().toISOString(),
      }),
    })
    setSaving(false)
    if (res.ok) toast.success('Saved!')
    else { const d = await res.json(); toast.error(d.error || 'Failed') }
  }

  /* Styles */
  const inp: React.CSSProperties  = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)', transition: 'border-color 0.15s' }
  const lbl: React.CSSProperties  = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '5px' }
  const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')
  const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = 'var(--border)')

  if (loading) return <AdminShell><div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div></AdminShell>

  const CORE_TYPES = ['title','client','summary','challenge','solution','quote','stack','results']

  return (
    <AdminShell>
      <div style={{ padding: '28px 32px', maxWidth: '820px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link href="/admin/portfolio" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-3)', textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <ArrowLeft size={13} /> Back
            </Link>
            <div>
              <h1 className="admin-page__title">{blocks.find(b => b.type === 'title')?.value || 'Edit Project'}</h1>
              <p className="admin-page__subtitle">Drag blocks to reorder · Add custom sections anywhere</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-2)' }}>
              <input type="checkbox" checked={meta.published} onChange={e => setMeta(m => ({ ...m, published: e.target.checked }))} /> Published
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-2)' }}>
              <input type="checkbox" checked={meta.featured} onChange={e => setMeta(m => ({ ...m, featured: e.target.checked }))} /> Featured
            </label>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
              <Save size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* ── Meta row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
          <div><label style={lbl}>Slug</label><input value={meta.slug} onChange={e => setMeta(m => ({ ...m, slug: e.target.value }))} style={{ ...inp, fontFamily: 'var(--font-mono)', fontSize: '11px' }} onFocus={onF} onBlur={onB} placeholder="project-slug" /></div>
          <div><label style={lbl}>Client URL</label><input value={meta.clientUrl} onChange={e => setMeta(m => ({ ...m, clientUrl: e.target.value }))} style={inp} onFocus={onF} onBlur={onB} placeholder="https://…" /></div>
          <div>
            <label style={lbl}>Cover Image URL</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input value={meta.image} onChange={e => setMeta(m => ({ ...m, image: e.target.value }))} style={{...inp, flex: 1}} onFocus={onF} onBlur={onB} placeholder="https://…" />
              <button onClick={() => setMediaTarget('meta')} style={{ padding: '0 10px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text)', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap' }}>
                Library
              </button>
            </div>
          </div>
          <div>
            <label style={lbl}>Category</label>
            <select value={meta.category} onChange={e => setMeta(m => ({ ...m, category: e.target.value }))} style={{ ...inp, cursor: 'pointer' }} onFocus={onF} onBlur={onB}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* ── Blocks list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {blocks.map((block, i) => {
            const isCore = CORE_TYPES.includes(block.type)
            const iconMap: Record<string, string> = { title:'✏️', client:'🏢', summary:'📄', challenge:'⚡', solution:'🔧', quote:'💬', stack:'⚙️', results:'📊', text:'📝', highlights:'✅', metrics:'📊', image:'🖼', technology:'🛠', process:'📋' }
            return (
              <div key={block.id} style={{ background: 'var(--bg-2)', border: `1px solid ${block.open ? 'rgba(118,108,255,0.35)' : 'var(--border)'}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>

                {/* Block header — click to expand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => toggle(block.id)}>
                  <GripVertical size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', flexShrink: 0 }}>{iconMap[block.type] || '📦'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {block.label}
                      {block.type === 'title' && block.value && <span style={{ color: 'var(--text-3)', fontWeight: 400, marginLeft: '8px' }}>{block.value.slice(0, 40)}</span>}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: isCore ? 'var(--primary)' : 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {isCore ? 'core' : 'custom'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center', flexShrink: 0 }}>
                    <button onClick={e => { e.stopPropagation(); move(i, -1) }} disabled={i === 0}
                      style={{ background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? 'var(--bg-4)' : 'var(--text-3)', padding: '4px' }}>
                      <ChevronUp size={13} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); move(i, 1) }} disabled={i === blocks.length - 1}
                      style={{ background: 'none', border: 'none', cursor: i === blocks.length - 1 ? 'default' : 'pointer', color: i === blocks.length - 1 ? 'var(--bg-4)' : 'var(--text-3)', padding: '4px' }}>
                      <ChevronDown size={13} />
                    </button>
                    {!isCore && (
                      <button onClick={e => { e.stopPropagation(); remove(block.id) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '4px' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                        <Trash2 size={13} />
                      </button>
                    )}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', padding: '0 4px' }}>{block.open ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Block fields */}
                {block.open && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                    {/* Label rename (custom blocks) */}
                    {!isCore && (
                      <div><label style={lbl}>Section heading</label>
                        <input value={block.label} onChange={e => update(block.id, { label: e.target.value })} style={inp} onFocus={onF} onBlur={onB} placeholder="Section title…" />
                      </div>
                    )}

                    {/* Single-value text blocks */}
                    {['title','client','summary','challenge','solution','text'].includes(block.type) && (
                      <div><label style={lbl}>{block.label}</label>
                        {['summary','challenge','solution','text'].includes(block.type)
                          ? <textarea value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} onFocus={onF} onBlur={onB} />
                          : <input value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} style={inp} onFocus={onF} onBlur={onB} />}
                      </div>
                    )}

                    {/* Quote */}
                    {block.type === 'quote' && (
                      <div><label style={lbl}>Quote text</label>
                        <textarea value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} rows={3} style={{ ...inp, resize: 'vertical', fontStyle: 'italic' }} onFocus={onF} onBlur={onB} placeholder="Client quote…" />
                      </div>
                    )}

                    {/* Image */}
                    {block.type === 'image' && (
                      <div><label style={lbl}>Image URL</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} style={{...inp, flex: 1}} onFocus={onF} onBlur={onB} placeholder="https://… or /image.jpg" />
                          <button onClick={() => setMediaTarget(block.id)} style={{ padding: '0 10px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text)', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
                            Library
                          </button>
                        </div>
                        {block.value && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={block.value} alt="" style={{ marginTop: '8px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)', width: '100%' }} />
                        )}
                      </div>
                    )}

                    {/* Tech stack (comma list) */}
                    {block.type === 'stack' && (
                      <div><label style={lbl}>Technologies (comma separated)</label>
                        <input value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} style={inp} onFocus={onF} onBlur={onB} placeholder="WordPress, PHP, ACF, WooCommerce" />
                      </div>
                    )}

                    {/* Results block */}
                    {block.type === 'results' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <label style={lbl}>Stats / Metrics</label>
                          <button onClick={() => addResult(block.id)} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
                        </div>
                        {((block.items || []) as Result[]).length === 0
                          ? <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '12px' }}>No stats yet — click + Add</p>
                          : ((block.items || []) as Result[]).map((r, ri) => (
                          <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '7px', alignItems: 'center' }}>
                            <input value={r.value} onChange={e => updateResult(block.id, ri, 'value', e.target.value)} style={{ ...inp, fontSize: '12px', padding: '7px 10px' }} onFocus={onF} onBlur={onB} placeholder="+300%" />
                            <input value={r.label} onChange={e => updateResult(block.id, ri, 'label', e.target.value)} style={{ ...inp, fontSize: '12px', padding: '7px 10px' }} onFocus={onF} onBlur={onB} placeholder="Revenue Growth" />
                            <button onClick={() => removeResult(block.id, ri)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '4px' }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* List blocks: highlights, technology, process */}
                    {['highlights','technology','process'].includes(block.type) && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <label style={lbl}>{block.type === 'technology' ? 'Technologies' : block.type === 'process' ? 'Steps' : 'Highlights'}</label>
                          <button onClick={() => addItem(block.id)} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
                        </div>
                        {((block.items || []) as string[]).map((item, ii) => (
                          <div key={ii} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary)', minWidth: '18px' }}>{ii+1}.</span>
                            <input value={item} onChange={e => updateItem(block.id, ii, e.target.value)} style={{ ...inp, flex: 1, fontSize: '12px', padding: '7px 10px' }} onFocus={onF} onBlur={onB} placeholder={block.type === 'process' ? 'Step description…' : block.type === 'technology' ? 'Technology name' : 'Highlight point'} />
                            <button onClick={() => removeItem(block.id, ii)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Metrics block (value::label pairs) */}
                    {block.type === 'metrics' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <label style={lbl}>Metric Cards</label>
                          <button onClick={() => addMetric(block.id)} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
                        </div>
                        {((block.items || []) as string[]).map((item, ii) => {
                          const [val, lbl2] = item.split('::')
                          return (
                            <div key={ii} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '6px' }}>
                              <input value={val || ''} onChange={e => updateMetric(block.id, ii, 0, e.target.value)} style={{ ...inp, fontSize: '12px', padding: '7px 10px' }} onFocus={onF} onBlur={onB} placeholder="+300%" />
                              <input value={lbl2 || ''} onChange={e => updateMetric(block.id, ii, 1, e.target.value)} style={{ ...inp, fontSize: '12px', padding: '7px 10px' }} onFocus={onF} onBlur={onB} placeholder="Revenue Growth" />
                              <button onClick={() => removeMetric(block.id, ii)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>✕</button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Add section picker ── */}
        <div style={{ marginTop: '12px' }}>
          {picking ? (
            <div style={{ background: 'var(--bg-2)', border: '1px solid rgba(118,108,255,0.3)', borderRadius: '14px', padding: '18px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>Choose section type to insert at bottom:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                {ADD_TYPES.map(t => (
                  <button key={t.type} onClick={() => addBlock(t.type, t.label)}
                    style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-3)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-soft)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-3)' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{t.icon} {t.label}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>{t.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setPicking(false)} style={{ marginTop: '10px', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setPicking(true)} className="btn btn-outline btn-md" style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={14} /> Add Section Below
            </button>
          )}
        </div>

        <div className="info-box" style={{ marginTop: '14px' }}>
          💡 Use ▲ ▼ arrows to reorder any block. Core blocks (blue) can be reordered but not deleted. Custom blocks (green) can be removed. All blocks render in order on the live case study page.
        </div>

        {mediaTarget && (
          <MediaPickerModal 
            onClose={() => setMediaTarget(null)}
            onSelect={(url) => {
              if (mediaTarget === 'meta') {
                setMeta(m => ({ ...m, image: url }))
              } else {
                update(mediaTarget, { value: url })
              }
              setMediaTarget(null)
            }}
          />
        )}
      </div>
    </AdminShell>
  )
}
