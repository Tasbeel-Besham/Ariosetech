'use client'

import type { BlogBlock, BlogBlockType } from '@/types'

const BLOCK_TYPES: { type: BlogBlockType; label: string }[] = [
  { type: 'h2', label: 'Heading' },
  { type: 'h3', label: 'Subheading' },
  { type: 'p', label: 'Paragraph' },
  { type: 'image', label: 'Image' },
  { type: 'quote', label: 'Quote' },
  { type: 'list', label: 'List' },
  { type: 'code', label: 'Code' },
  { type: 'callout', label: 'Callout' },
  { type: 'button', label: 'Button' },
  { type: 'divider', label: 'Divider' },
]

const TAG_LABEL: Record<BlogBlockType, string> = {
  h2: 'H2', h3: 'H3', p: 'P', image: 'IMG', quote: '“ ”',
  list: 'LIST', code: '</>', callout: '!', divider: '—', button: 'BTN',
}

const inp = 'w-full bg-bg-3 border border-border rounded-lg py-2 px-3 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50'

export default function BlogBlockEditor({
  blocks, onChange,
}: {
  blocks: BlogBlock[]
  onChange: (blocks: BlogBlock[]) => void
}) {
  const add = (type: BlogBlockType) => {
    const base: BlogBlock = { type }
    if (type === 'list') { base.items = ['']; base.ordered = false }
    onChange([...blocks, base])
  }
  const update = (i: number, patch: Partial<BlogBlock>) =>
    onChange(blocks.map((b, j) => j === i ? { ...b, ...patch } : b))
  const remove = (i: number) => onChange(blocks.filter((_, j) => j !== i))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      {/* Add-block toolbar */}
      <div className="flex flex-wrap gap-2 mb-5">
        {BLOCK_TYPES.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => add(type)}
            className="py-1.5 px-3 rounded-lg border border-border bg-transparent text-text-3 cursor-pointer text-xs font-display font-semibold hover:text-white hover:bg-bg-3 hover:border-primary/40 transition-colors"
          >
            + {label}
          </button>
        ))}
      </div>

      {/* Blocks */}
      <div className="flex flex-col gap-3">
        {blocks.map((block, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            {/* Tag + move controls */}
            <div className="flex flex-col gap-1 items-center pt-1 shrink-0 w-[42px]">
              <span className="font-mono text-[9px] uppercase tracking-wider py-0.5 px-1.5 rounded border text-primary bg-primary/10 border-primary/20 w-full text-center">
                {TAG_LABEL[block.type]}
              </span>
              <div className="flex gap-0.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                  className="w-5 h-5 rounded border border-border text-text-3 text-[10px] leading-none disabled:opacity-30 hover:text-white hover:bg-bg-3 transition-colors">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1}
                  className="w-5 h-5 rounded border border-border text-text-3 text-[10px] leading-none disabled:opacity-30 hover:text-white hover:bg-bg-3 transition-colors">↓</button>
              </div>
            </div>

            {/* Editor for this block */}
            <div className="flex-1 min-w-0">
              {(block.type === 'h2' || block.type === 'h3') && (
                <input value={block.text || ''} onChange={e => update(i, { text: e.target.value })}
                  placeholder={block.type === 'h2' ? 'Section heading…' : 'Subheading…'}
                  className={`${inp} font-bold font-display ${block.type === 'h2' ? 'text-base' : 'text-sm'}`} />
              )}

              {block.type === 'p' && (
                <textarea value={block.text || ''} onChange={e => update(i, { text: e.target.value })}
                  placeholder="Paragraph text…" rows={3} className={`${inp} resize-y text-sm`} />
              )}

              {block.type === 'image' && (
                <div className="flex flex-col gap-2">
                  <input value={block.url || ''} onChange={e => update(i, { url: e.target.value })}
                    placeholder="Image URL (https://…)" className={`${inp} font-mono text-xs`} />
                  <input value={block.caption || ''} onChange={e => update(i, { caption: e.target.value })}
                    placeholder="Caption / alt text (good for SEO)" className={`${inp} text-xs`} />
                  {block.url && <img src={block.url} alt="" className="rounded-lg border border-border max-h-40 object-cover w-full" />}
                </div>
              )}

              {block.type === 'quote' && (
                <div className="flex flex-col gap-2">
                  <textarea value={block.text || ''} onChange={e => update(i, { text: e.target.value })}
                    placeholder="Quote text…" rows={2} className={`${inp} resize-y italic`} />
                  <input value={block.caption || ''} onChange={e => update(i, { caption: e.target.value })}
                    placeholder="Attribution (e.g. Jane Doe, CEO)" className={`${inp} text-xs`} />
                </div>
              )}

              {block.type === 'list' && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <label className="flex items-center gap-1.5 text-[11px] text-text-3 cursor-pointer">
                      <input type="checkbox" checked={!!block.ordered} onChange={e => update(i, { ordered: e.target.checked })} />
                      Numbered list
                    </label>
                  </div>
                  <textarea
                    value={(block.items || []).join('\n')}
                    onChange={e => update(i, { items: e.target.value.split('\n') })}
                    placeholder="One item per line"
                    rows={Math.max(3, (block.items || []).length)}
                    className={`${inp} resize-y text-sm`}
                  />
                  <p className="text-[10px] text-text-3">One line = one list item.</p>
                </div>
              )}

              {block.type === 'code' && (
                <div className="flex flex-col gap-2">
                  <input value={block.lang || ''} onChange={e => update(i, { lang: e.target.value })}
                    placeholder="Language label (e.g. php, js) — optional" className={`${inp} font-mono text-xs w-[240px]`} />
                  <textarea value={block.text || ''} onChange={e => update(i, { text: e.target.value })}
                    placeholder="Code…" rows={4} className={`${inp} resize-y font-mono text-xs`} spellCheck={false} />
                </div>
              )}

              {block.type === 'callout' && (
                <textarea value={block.text || ''} onChange={e => update(i, { text: e.target.value })}
                  placeholder="Callout / highlight text…" rows={2} className={`${inp} resize-y text-sm`} />
              )}

              {block.type === 'button' && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input value={block.text || ''} onChange={e => update(i, { text: e.target.value })}
                    placeholder="Button label" className={`${inp} text-sm`} />
                  <input value={block.url || ''} onChange={e => update(i, { url: e.target.value })}
                    placeholder="/contact or https://…" className={`${inp} font-mono text-xs`} />
                </div>
              )}

              {block.type === 'divider' && (
                <div className="h-px bg-border-2 my-3" />
              )}
            </div>

            {/* Remove */}
            <button type="button" onClick={() => remove(i)}
              className="p-2 rounded-lg border border-border bg-transparent cursor-pointer text-text-3 shrink-0 transition-colors hover:border-[rgba(255,77,109,0.4)] hover:text-[#ff4d6d]">
              ✕
            </button>
          </div>
        ))}

        {blocks.length === 0 && (
          <p className="text-center text-text-3 text-[13px] p-5">Add blocks above to start writing</p>
        )}
      </div>
    </div>
  )
}
