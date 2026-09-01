'use client'
import { useEditor, EditorContent, Node, mergeAttributes, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback, useState } from 'react'
import type { BlogBlock } from '@/types'
import { docToBlocks, blocksToDoc } from '@/lib/blog/editor-convert'
import { transformPastedHTML } from '@/lib/blog/paste-transform'

/* ── Custom node: callout / button ──
   These aren't standard rich text, so they live as an atomic node holding a
   data payload. They round-trip through the converter untouched. */
const BLOCK_LABEL: Record<string, string> = { button: 'Button', cta: 'Call to action', callout: 'Callout', table: 'Table' }

/** Grid editor for a table block. Blog tables are simple comparison grids —
 *  no merged cells — so a plain grid of inputs is easier to drive than a
 *  ProseMirror table, and it keeps the stored shape a clean string[][]. */
function TableBlockEditor({ data, set }: { data: BlogBlock; set: (patch: Partial<BlogBlock>) => void }) {
  const rows: string[][] = data.rows?.length ? data.rows : [['', ''], ['', '']]
  const width = Math.max(...rows.map(r => r.length), 1)
  const hasHeader = data.hasHeader !== false

  // Every edit rewrites the whole grid, which also normalises ragged rows.
  const commit = (next: string[][]) => {
    const w = Math.max(...next.map(r => r.length), 1)
    set({ rows: next.map(r => { const c = [...r]; while (c.length < w) c.push(''); return c }), rowsHtml: undefined })
  }
  const setCell = (r: number, c: number, v: string) =>
    commit(rows.map((row, ri) => ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row))
  const addRow = () => commit([...rows, Array(width).fill('')])
  const addCol = () => commit(rows.map(r => [...r, '']))
  const delRow = (r: number) => rows.length > 1 && commit(rows.filter((_, i) => i !== r))
  const delCol = (c: number) => width > 1 && commit(rows.map(r => r.filter((_, i) => i !== c)))

  const cellCls = 'w-full py-1.5 px-2 rounded-md border border-border bg-bg text-text text-[13px] outline-none focus:border-[rgba(var(--primary-rgb),0.5)]'
  const mini = 'px-1.5 text-text-3 hover:text-red-400 text-[11px] leading-none'

  return (
    <div>
      <label className="flex items-center gap-2 mb-2 text-[12px] text-text-2 cursor-pointer">
        <input type="checkbox" checked={hasHeader} onChange={e => set({ hasHeader: e.target.checked })} />
        First row is a header
      </label>

      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-1">
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="align-top">
                    {r === 0 && (
                      <div className="flex justify-end">
                        <button type="button" onClick={() => delCol(c)} className={mini} title="Delete this column">&times; col</button>
                      </div>
                    )}
                    <input
                      value={cell}
                      onChange={e => setCell(r, c, e.target.value)}
                      placeholder={r === 0 && hasHeader ? `Header ${c + 1}` : ''}
                      className={cellCls}
                      style={r === 0 && hasHeader ? { fontWeight: 700 } : undefined}
                    />
                  </td>
                ))}
                <td className="align-bottom">
                  <button type="button" onClick={() => delRow(r)} className={mini} title="Delete this row">&times; row</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-2">
        <button type="button" onClick={addRow} className="btn btn-outline btn-sm">+ Row</button>
        <button type="button" onClick={addCol} className="btn btn-outline btn-sm">+ Column</button>
      </div>
    </div>
  )
}

function CustomBlockView({ node, updateAttributes, deleteNode }: any) {
  const data: BlogBlock = node.attrs.data || { type: 'callout', text: '' }
  const set = (patch: Partial<BlogBlock>) =>
    updateAttributes({ data: { ...data, ...patch } })

  const field = 'w-full py-2 px-3 rounded-lg border border-border bg-bg text-text text-sm outline-none mb-2'

  return (
    <NodeViewWrapper>
      <div contentEditable={false} className="my-4 rounded-xl border border-border bg-bg-2 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-10 uppercase tracking-wider font-bold text-primary">
            {BLOCK_LABEL[data.type] || 'Callout'}
          </span>
          <button type="button" onClick={deleteNode}
                  className="text-text-3 hover:text-red-400 text-xs">Remove</button>
        </div>

        {data.type === 'table' ? (
          <TableBlockEditor data={data} set={set} />
        ) : (
          <input
            value={data.text || ''}
            onChange={e => set({ text: e.target.value })}
            placeholder={
              data.type === 'button' ? 'Button label'
                : data.type === 'cta' ? 'Headline — e.g. Need this done properly?'
                : 'Callout text'
            }
            className={field}
          />
        )}

        {data.type === 'cta' && (
          <>
            <textarea
              value={data.caption || ''}
              onChange={e => set({ caption: e.target.value })}
              rows={2}
              placeholder="Supporting line — one sentence on what they get."
              className={field}
            />
            <input
              value={data.label || ''}
              onChange={e => set({ label: e.target.value })}
              placeholder="Button label — e.g. Get a free quote"
              className={field}
            />
          </>
        )}

        {(data.type === 'button' || data.type === 'cta') && (
          <input
            value={data.url || ''}
            onChange={e => set({ url: e.target.value })}
            placeholder="/contact"
            className="w-full py-2 px-3 rounded-lg border border-border bg-bg text-text text-sm outline-none"
          />
        )}
      </div>
    </NodeViewWrapper>
  )
}

const CustomBlock = Node.create({
  name: 'customBlock',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      data: {
        default: { type: 'callout', text: '' },
        // The payload has to survive a round trip through HTML, because that is
        // how pasted content reaches the editor: transformPastedHTML rewrites a
        // <table> into <div data-custom-block data-payload="…"> and TipTap then
        // parses that back into this node. Without these two, a pasted table
        // would arrive as an empty block.
        parseHTML: (el: HTMLElement) => {
          const raw = el.getAttribute('data-payload')
          if (!raw) return { type: 'callout', text: '' }
          try { return JSON.parse(raw) } catch { return { type: 'callout', text: '' } }
        },
        renderHTML: (attrs: Record<string, unknown>) => ({ 'data-payload': JSON.stringify(attrs.data ?? {}) }),
      },
    }
  },
  parseHTML() { return [{ tag: 'div[data-custom-block]' }] },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-custom-block': '' })] },
  addNodeView() { return ReactNodeViewRenderer(CustomBlockView) },
})

const btn = 'px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors border border-border hover:border-[rgba(var(--primary-rgb),0.5)]'
const btnOn = 'px-2.5 py-1.5 rounded-md text-xs font-semibold border border-[rgba(var(--primary-rgb),0.6)] text-primary bg-[rgba(var(--primary-rgb),0.08)]'

export default function BlogRichEditor({
  blocks,
  onChange,
}: {
  blocks: BlogBlock[]
  onChange: (blocks: BlogBlock[]) => void
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: 'Start writing your article… Press Enter for a new paragraph.' }),
      CustomBlock,
    ],
    content: blocksToDoc(blocks),
    editorProps: {
      attributes: {
        class: 'blog-editor-surface focus:outline-none',
      },
      /**
       * Normalise pasted HTML before TipTap parses it.
       *
       * Lives in lib/blog/paste-transform.ts so the rules can be unit-tested
       * against real Google Docs markup — the ordering inside it is subtle and
       * getting it wrong is what silently destroyed pasted tables.
       */
      transformPastedHTML,
    },
    onUpdate: ({ editor }) => {
      onChange(docToBlocks(editor.getJSON() as never))
    },
  })

  // Load content when switching posts (edit page hydrates async).
  useEffect(() => {
    if (!editor) return
    const incoming = JSON.stringify(blocksToDoc(blocks))
    const current = JSON.stringify(editor.getJSON())
    if (incoming !== current && blocks && blocks.length > 0) {
      editor.commands.setContent(blocksToDoc(blocks), false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, JSON.stringify(blocks?.map(b => b.type))])

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL')
    if (url && editor) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const addLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Link URL', prev || 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  const insertCustom = (type: 'callout' | 'button' | 'cta' | 'table') => {
    const data: BlogBlock =
      type === 'button' ? { type: 'button', text: '', url: '' }
        : type === 'cta' ? { type: 'cta', text: '', caption: '', label: '', url: '/contact' }
        : type === 'table' ? { type: 'table', rows: [['', '', ''], ['', '', '']], hasHeader: true }
        : { type: 'callout', text: '' }
    editor?.chain().focus().insertContent({ type: 'customBlock', attrs: { data } }).run()
  }

  // ── HTML source mode ──
  // Lets you paste or hand-write HTML directly. On apply, TipTap parses it back
  // into the document, which then converts to blocks on save as usual — so the
  // stored format never changes and existing posts stay compatible.
  const [htmlMode, setHtmlMode] = useState(false)
  const [htmlDraft, setHtmlDraft] = useState('')

  const openHtml = () => {
    if (!editor) return
    setHtmlDraft(editor.getHTML())
    setHtmlMode(true)
  }
  const applyHtml = () => {
    if (!editor) return
    editor.commands.setContent(htmlDraft, true)
    onChange(docToBlocks(editor.getJSON() as never))
    setHtmlMode(false)
  }

  if (!editor) return <div className="text-text-3 text-sm p-4">Loading editor…</div>

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-bg-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1.5 p-2.5 border-b border-border bg-bg-3 sticky top-0 z-10">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? btnOn : btn}><strong>B</strong></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? btnOn : btn}><em>I</em></button>
        <button type="button" onClick={addLink}
                className={editor.isActive('link') ? btnOn : btn}>Link</button>

        <span className="w-px bg-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? btnOn : btn}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? btnOn : btn}>H3</button>
        <button type="button" onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive('paragraph') ? btnOn : btn}>Text</button>

        <span className="w-px bg-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? btnOn : btn}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? btnOn : btn}>1. List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? btnOn : btn}
                title="Turn the selected paragraph into a quote (click again to remove it)">
          &ldquo; Quote
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? btnOn : btn}>Code</button>

        <span className="w-px bg-border mx-1" />

        <button type="button" onClick={addImage} className={btn}>+ Image</button>
        <button type="button" onClick={() => insertCustom('callout')} className={btn}>+ Callout</button>
        <button type="button" onClick={() => insertCustom('button')} className={btn}>+ Button</button>
        <button type="button" onClick={() => insertCustom('table')} className={btn}
                title="Insert a table — pasting one from Google Docs or Word also works now">+ Table</button>
        <button type="button" onClick={() => insertCustom('cta')} className={btn}
                title="Headline, supporting line and a button — the mid-article conversion block">+ CTA</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn}>+ Divider</button>

        <span className="flex-1" />

        <button type="button" onClick={htmlMode ? () => setHtmlMode(false) : openHtml}
                className={htmlMode ? btnOn : btn}
                title="Edit the raw HTML of this article">
          {htmlMode ? 'Visual' : '</> HTML'}
        </button>
      </div>

      {/* Writing surface — visual or HTML source */}
      {htmlMode ? (
        <div className="p-4">
          <textarea
            value={htmlDraft}
            onChange={e => setHtmlDraft(e.target.value)}
            spellCheck={false}
            className="w-full h-[460px] p-4 rounded-lg border border-border bg-bg text-text font-mono text-[13px] leading-relaxed outline-none resize-y"
            placeholder="<h2>Heading</h2>&#10;<p>Paragraph…</p>"
          />
          <div className="flex gap-3 mt-3 items-center">
            <button type="button" onClick={applyHtml} className="btn btn-primary btn-sm">Apply HTML</button>
            <button type="button" onClick={() => setHtmlMode(false)} className="btn btn-outline btn-sm">Cancel</button>
            <span className="text-text-3 text-[11.5px]">
              Blocks: h2, h3, p, ul/ol, blockquote, pre/code, img, hr &middot;
              Inline: strong, em, u, s, code, a, br &mdash; these are kept when you apply.
            </span>
          </div>
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}

      <div className="px-4 py-2 border-t border-border text-text-3 text-[11px] font-mono">
        Type naturally · Enter = new paragraph · Paste from Google Docs keeps headings, tables, links &amp; formatting · &lt;/&gt; HTML for source editing
      </div>
    </div>
  )
}
