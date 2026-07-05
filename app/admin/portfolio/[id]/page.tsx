'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminShell from '@/components/layout/AdminShell'
import { Save, ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from '@/components/ui/Icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MediaPickerModal } from '@/components/ui/MediaPickerModal'

/* ── Types ─────────────────────────────────────────────────────── */
type Result = { label: string; value: string }
type Block  = {
  id: string
  type: 'title' | 'client' | 'summary' | 'challenge' | 'solution' | 'quote' | 'stack'
      | 'results' | 'text' | 'highlights' | 'metrics' | 'image' | 'technology' | 'process'
  value?: string
  items?: Result[] | string[]
  label: string
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
  const [isCustomCat, setIsCustomCat] = useState(false)
  const [blocks, setBlocks]     = useState<Block[]>([])
  const [meta, setMeta]         = useState({ slug: '', clientUrl: '', image: '', category: 'wordpress', featured: false, published: true })
  const [picking, setPicking]   = useState(false)
  const [mediaTarget, setMediaTarget] = useState<string | null>(null)

  /* Load */
  useEffect(() => {
    fetch(`/api/portfolio/${id}`).then(r => r.json()).then(d => {
      const saved: Block[] = Array.isArray(d.blocks) ? d.blocks : []
      if (saved.length > 0) {
        setBlocks(saved.map(b => ({ ...b, open: false })))
      } else {
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
  const toggle = (bid: string) => setBlocks(bs => bs.map(b => b.id === bid ? { ...b, open: !b.open } : b))
  const update = (bid: string, patch: Partial<Block>) => setBlocks(bs => bs.map(b => b.id === bid ? { ...b, ...patch } : b))
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

  /* Result helpers */
  const addResult = (bid: string) => update(bid, { items: [...(blocks.find(b => b.id === bid)?.items as Result[] || []), { label: '', value: '' }] })
  const removeResult = (bid: string, i: number) => update(bid, { items: (blocks.find(b => b.id === bid)?.items as Result[] || []).filter((_, j) => j !== i) })
  const updateResult = (bid: string, i: number, k: keyof Result, v: string) =>
    update(bid, { items: (blocks.find(b => b.id === bid)?.items as Result[] || []).map((r, j) => j === i ? { ...r, [k]: v } : r) })

  /* List-item helpers */
  const addItem = (bid: string) => update(bid, { items: [...(blocks.find(b => b.id === bid)?.items as string[] || []), ''] })
  const removeItem = (bid: string, i: number) => update(bid, { items: (blocks.find(b => b.id === bid)?.items as string[] || []).filter((_, j) => j !== i) })
  const updateItem = (bid: string, i: number, v: string) => update(bid, { items: (blocks.find(b => b.id === bid)?.items as string[] || []).map((x, j) => j === i ? v : x) })

  /* Metric helpers */
  const addMetric = (bid: string) => update(bid, { items: [...(blocks.find(b => b.id === bid)?.items as string[] || []), '::'] })
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
        blocks,
        sections: blocks
          .filter(b => !['title','client','summary','challenge','solution','quote','stack','results'].includes(b.type))
          .map(b => ({ id: b.id, type: b.type, title: b.label, content: b.value || '', items: Array.isArray(b.items) ? b.items as string[] : [] })),
        updatedAt: new Date().toISOString(),
      }),
    })
    setSaving(false)
    if (res.ok) toast.success('Saved!')
    else { const d = await res.json(); toast.error(d.error || 'Failed') }
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-[9px] px-3 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"

  if (loading) return <AdminShell><div className="p-10 text-center text-text-3">Loading…</div></AdminShell>

  const CORE_TYPES = ['title','client','summary','challenge','solution','quote','stack','results']

  return (
    <AdminShell>
      <div className="py-7 px-8 max-w-[820px]">

        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <Link href="/admin/portfolio" className="flex items-center gap-1.5 text-text-3 no-underline text-xs font-mono transition-colors hover:text-white">
              <ArrowLeft size={13} /> Back
            </Link>
            <div>
              <h1 className="admin-page__title">{blocks.find(b => b.type === 'title')?.value || 'Edit Project'}</h1>
              <p className="admin-page__subtitle">Drag blocks to reorder · Add custom sections anywhere</p>
            </div>
          </div>
          <div className="flex gap-2.5 items-center">
            <label className="flex items-center gap-1.5 cursor-pointer text-[13px] text-text-2 transition-colors hover:text-white">
              <input type="checkbox" checked={meta.published} onChange={e => setMeta(m => ({ ...m, published: e.target.checked }))} className="accent-primary" /> Published
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[13px] text-text-2 transition-colors hover:text-white">
              <input type="checkbox" checked={meta.featured} onChange={e => setMeta(m => ({ ...m, featured: e.target.checked }))} className="accent-primary" /> Featured
            </label>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md ml-1">
              <Save size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* ── Meta row ── */}
        <div className="grid grid-cols-4 gap-2.5 mb-5 bg-bg-2 border border-border rounded-xl p-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          <div><label className={lblClass}>Slug</label><input value={meta.slug} onChange={e => setMeta(m => ({ ...m, slug: e.target.value }))} className={`${inpClass} font-mono text-[11px]`} placeholder="project-slug" /></div>
          <div><label className={lblClass}>Client URL</label><input value={meta.clientUrl} onChange={e => setMeta(m => ({ ...m, clientUrl: e.target.value }))} className={inpClass} placeholder="https://…" /></div>
          <div>
            <label className={lblClass}>Cover Image URL</label>
            <div className="flex gap-1.5">
              <input value={meta.image} onChange={e => setMeta(m => ({ ...m, image: e.target.value }))} className={`${inpClass} flex-1`} placeholder="https://…" />
              <button onClick={() => setMediaTarget('meta')} className="px-2.5 bg-bg-3 border border-border rounded-sm text-white cursor-pointer text-[11px] whitespace-nowrap hover:bg-white/5 transition-colors">
                Library
              </button>
            </div>
          </div>
          <div>
            <label className={lblClass}>Category</label>
            <div className="flex gap-1.5">
              <select 
                value={isCustomCat ? 'new' : (CATS.includes(meta.category) ? meta.category : (meta.category ? meta.category : ''))}
                onChange={e => {
                  if (e.target.value === 'new') {
                    setIsCustomCat(true)
                    setMeta(m => ({ ...m, category: '' }))
                  } else {
                    setIsCustomCat(false)
                    setMeta(m => ({ ...m, category: e.target.value }))
                  }
                }}
                className={`${inpClass} ${isCustomCat ? 'flex-none w-[130px]' : 'flex-1 w-auto'}`}
              >
                <option value="" disabled>Select...</option>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                {!CATS.includes(meta.category) && meta.category && !isCustomCat && <option value={meta.category}>{meta.category}</option>}
                <option value="new">+ Custom...</option>
              </select>
              {isCustomCat && (
                <input 
                  value={meta.category} 
                  onChange={e => setMeta(m => ({ ...m, category: e.target.value }))} 
                  className={`${inpClass} flex-1`} 
                  placeholder="Type custom category..." 
                  autoFocus
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Blocks list ── */}
        <div className="flex flex-col gap-2">
          {blocks.map((block, i) => {
            const isCore = CORE_TYPES.includes(block.type)
            const iconMap: Record<string, string> = { title:'✏️', client:'🏢', summary:'📄', challenge:'⚡', solution:'🔧', quote:'💬', stack:'⚙️', results:'📊', text:'📝', highlights:'✅', metrics:'📊', image:'🖼', technology:'🛠', process:'📋' }
            return (
              <div key={block.id} className={`bg-bg-2 border rounded-xl overflow-hidden transition-colors duration-200 ${block.open ? 'border-primary/35' : 'border-border'}`}>

                {/* Block header, click to expand */}
                <div className="flex items-center gap-2 py-2.5 px-3.5 cursor-pointer select-none"
                  onClick={() => toggle(block.id)}>
                  <GripVertical size={14} className="text-text-3 shrink-0" />
                  <span className="text-[15px] shrink-0">{iconMap[block.type] || '📦'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[13px] font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap">
                      {block.label}
                      {block.type === 'title' && block.value && <span className="text-text-3 font-normal ml-2">{block.value.slice(0, 40)}</span>}
                    </p>
                    <p className={`font-mono text-[9px] uppercase tracking-wider ${isCore ? 'text-primary' : 'text-[#00e5a0]'}`}>
                      {isCore ? 'core' : 'custom'}
                    </p>
                  </div>
                  <div className="flex gap-0.5 items-center shrink-0">
                    <button onClick={e => { e.stopPropagation(); move(i, -1) }} disabled={i === 0}
                      className={`bg-transparent border-none p-1 ${i === 0 ? 'cursor-default text-bg-4' : 'cursor-pointer text-text-3 hover:text-white transition-colors'}`}>
                      <ChevronUp size={13} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); move(i, 1) }} disabled={i === blocks.length - 1}
                      className={`bg-transparent border-none p-1 ${i === blocks.length - 1 ? 'cursor-default text-bg-4' : 'cursor-pointer text-text-3 hover:text-white transition-colors'}`}>
                      <ChevronDown size={13} />
                    </button>
                    {!isCore && (
                      <button onClick={e => { e.stopPropagation(); remove(block.id) }}
                        className="bg-transparent border-none cursor-pointer text-text-3 p-1 transition-colors hover:text-[#ff4d6d]">
                        <Trash2 size={13} />
                      </button>
                    )}
                    <span className="font-mono text-[11px] text-text-3 px-1">{block.open ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Block fields */}
                {block.open && (
                  <div className="border-t border-border py-3.5 px-4 flex flex-col gap-2.5">

                    {/* Label rename (custom blocks) */}
                    {!isCore && (
                      <div><label className={lblClass}>Section heading</label>
                        <input value={block.label} onChange={e => update(block.id, { label: e.target.value })} className={inpClass} placeholder="Section title…" />
                      </div>
                    )}

                    {/* Single-value text blocks */}
                    {['title','client','summary','challenge','solution','text'].includes(block.type) && (
                      <div><label className={lblClass}>{block.label}</label>
                        {['summary','challenge','solution','text'].includes(block.type)
                          ? <textarea value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} rows={4} className={`${inpClass} resize-y leading-[1.6]`} />
                          : <input value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} className={inpClass} />}
                      </div>
                    )}

                    {/* Quote */}
                    {block.type === 'quote' && (
                      <div><label className={lblClass}>Quote text</label>
                        <textarea value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} rows={3} className={`${inpClass} resize-y italic`} placeholder="Client quote…" />
                      </div>
                    )}

                    {/* Image */}
                    {block.type === 'image' && (
                      <div><label className={lblClass}>Image URL</label>
                        <div className="flex gap-1.5">
                          <input value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} className={`${inpClass} flex-1`} placeholder="https://… or /image.jpg" />
                          <button onClick={() => setMediaTarget(block.id)} className="px-2.5 bg-bg-3 border border-border rounded-sm text-white cursor-pointer text-xs whitespace-nowrap hover:bg-white/5 transition-colors">
                            Library
                          </button>
                        </div>
                        {block.value && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={block.value} alt="" className="mt-2 h-20 object-cover rounded-md border border-border w-full" />
                        )}
                      </div>
                    )}

                    {/* Tech stack (comma list) */}
                    {block.type === 'stack' && (
                      <div><label className={lblClass}>Technologies (comma separated)</label>
                        <input value={block.value || ''} onChange={e => update(block.id, { value: e.target.value })} className={inpClass} placeholder="WordPress, PHP, ACF, WooCommerce" />
                      </div>
                    )}

                    {/* Results block */}
                    {block.type === 'results' && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className={lblClass}>Stats / Metrics</label>
                          <button onClick={() => addResult(block.id)} className="font-mono text-[10px] text-primary bg-transparent border-none cursor-pointer hover:underline">+ Add</button>
                        </div>
                        {((block.items || []) as Result[]).length === 0
                          ? <p className="text-xs text-text-3 text-center p-3">No stats yet, click + Add</p>
                          : ((block.items || []) as Result[]).map((r, ri) => (
                          <div key={ri} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2 items-center max-sm:grid-cols-[1fr_auto]">
                            <div className="max-sm:col-span-2"><input value={r.value} onChange={e => updateResult(block.id, ri, 'value', e.target.value)} className={`${inpClass} text-xs py-[7px] px-2.5`} placeholder="+300%" /></div>
                            <div className="max-sm:col-span-1"><input value={r.label} onChange={e => updateResult(block.id, ri, 'label', e.target.value)} className={`${inpClass} text-xs py-[7px] px-2.5`} placeholder="Revenue Growth" /></div>
                            <button onClick={() => removeResult(block.id, ri)} className="bg-transparent border-none cursor-pointer text-text-3 p-1 transition-colors hover:text-[#ff4d6d]"></button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* List blocks: highlights, technology, process */}
                    {['highlights','technology','process'].includes(block.type) && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className={lblClass}>{block.type === 'technology' ? 'Technologies' : block.type === 'process' ? 'Steps' : 'Highlights'}</label>
                          <button onClick={() => addItem(block.id)} className="font-mono text-[10px] text-primary bg-transparent border-none cursor-pointer hover:underline">+ Add</button>
                        </div>
                        {((block.items || []) as string[]).map((item, ii) => (
                          <div key={ii} className="flex gap-2 mb-1.5 items-center">
                            <span className="font-mono text-[10px] text-primary min-w-[18px]">{ii+1}.</span>
                            <input value={item} onChange={e => updateItem(block.id, ii, e.target.value)} className={`${inpClass} flex-1 text-xs py-[7px] px-2.5`} placeholder={block.type === 'process' ? 'Step description…' : block.type === 'technology' ? 'Technology name' : 'Highlight point'} />
                            <button onClick={() => removeItem(block.id, ii)} className="bg-transparent border-none cursor-pointer text-text-3 transition-colors hover:text-[#ff4d6d]"></button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Metrics block (value::label pairs) */}
                    {block.type === 'metrics' && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className={lblClass}>Metric Cards</label>
                          <button onClick={() => addMetric(block.id)} className="font-mono text-[10px] text-primary bg-transparent border-none cursor-pointer hover:underline">+ Add</button>
                        </div>
                        {((block.items || []) as string[]).map((item, ii) => {
                          const [val, lbl2] = item.split('::')
                          return (
                            <div key={ii} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-1.5 max-sm:grid-cols-[1fr_auto]">
                              <div className="max-sm:col-span-2"><input value={val || ''} onChange={e => updateMetric(block.id, ii, 0, e.target.value)} className={`${inpClass} text-xs py-[7px] px-2.5`} placeholder="+300%" /></div>
                              <div className="max-sm:col-span-1"><input value={lbl2 || ''} onChange={e => updateMetric(block.id, ii, 1, e.target.value)} className={`${inpClass} text-xs py-[7px] px-2.5`} placeholder="Revenue Growth" /></div>
                              <button onClick={() => removeMetric(block.id, ii)} className="bg-transparent border-none cursor-pointer text-text-3 transition-colors hover:text-[#ff4d6d]"></button>
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
        <div className="mt-3">
          {picking ? (
            <div className="bg-bg-2 border border-primary/30 rounded-[14px] p-4.5">
              <p className="font-display text-[13px] font-bold text-white mb-3">Choose section type to insert at bottom:</p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
                {ADD_TYPES.map(t => (
                  <button key={t.type} onClick={() => addBlock(t.type, t.label)}
                    className="py-3 px-3.5 rounded-lg border border-border bg-bg-3 cursor-pointer text-left transition-all hover:border-primary hover:bg-primary/5">
                    <p className="font-display text-xs font-semibold text-white mb-0.5">{t.icon} {t.label}</p>
                    <p className="text-[11px] text-text-3">{t.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setPicking(false)} className="mt-2.5 bg-transparent border-none text-text-3 cursor-pointer text-xs hover:underline">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setPicking(true)} className="btn btn-outline btn-md w-full justify-center">
              <Plus size={14} /> Add Section Below
            </button>
          )}
        </div>

        <div className="info-box mt-3.5">
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
