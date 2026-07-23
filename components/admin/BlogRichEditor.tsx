'use client'
import { useEditor, EditorContent, Node, mergeAttributes, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback, useState } from 'react'
import type { BlogBlock } from '@/types'
import { docToBlocks, blocksToDoc } from '@/lib/blog/editor-convert'

/* ── Custom node: callout / button ──
   These aren't standard rich text, so they live as an atomic node holding a
   data payload. They round-trip through the converter untouched. */
function CustomBlockView({ node, updateAttributes, deleteNode }: any) {
  const data: BlogBlock = node.attrs.data || { type: 'callout', text: '' }
  const set = (patch: Partial<BlogBlock>) =>
    updateAttributes({ data: { ...data, ...patch } })

  return (
    <NodeViewWrapper>
      <div contentEditable={false} className="my-4 rounded-xl border border-border bg-bg-2 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-10 uppercase tracking-wider font-bold text-primary">
            {data.type === 'button' ? 'Button' : 'Callout'}
          </span>
          <button type="button" onClick={deleteNode}
                  className="text-text-3 hover:text-red-400 text-xs">Remove</button>
        </div>
        <input
          value={data.text || ''}
          onChange={e => set({ text: e.target.value })}
          placeholder={data.type === 'button' ? 'Button label' : 'Callout text'}
          className="w-full py-2 px-3 rounded-lg border border-border bg-bg text-text text-sm outline-none mb-2"
        />
        {data.type === 'button' && (
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
    return { data: { default: { type: 'callout', text: '' } } }
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
       * Google Docs (and Word) don't paste semantic tags — a heading arrives as
       * <p style="font-weight:700;font-size:20pt"> and bold text as
       * <span style="font-weight:700">. Without this, everything lands as plain
       * paragraphs and you'd re-format the whole article by hand.
       *
       * We rewrite those styled elements into real <h2>/<h3>/<strong>/<em>
       * tags, then let TipTap's normal parser take over.
       */
      transformPastedHTML(html: string) {
        if (!html) return html
        try {
          const doc = new DOMParser().parseFromString(html, 'text/html')

          // Google Docs wraps everything in <b id="docs-internal-guid-…"> with
          // no semantic meaning — unwrap it so its children are read directly.
          doc.querySelectorAll('b[id^="docs-internal-guid"]').forEach(b => {
            const parent = b.parentNode
            if (!parent) return
            while (b.firstChild) parent.insertBefore(b.firstChild, b)
            parent.removeChild(b)
          })

          const fontSize = (el: Element): number => {
            const s = el.getAttribute('style') || ''
            const m = s.match(/font-size:\s*([\d.]+)\s*(pt|px)/i)
            if (!m) return 0
            const v = parseFloat(m[1])
            return m[2].toLowerCase() === 'px' ? v * 0.75 : v // px → pt
          }
          const isBoldish = (el: Element): boolean => {
            const s = el.getAttribute('style') || ''
            const m = s.match(/font-weight:\s*(\d{3}|bold)/i)
            if (!m) return false
            return m[1].toLowerCase() === 'bold' || parseInt(m[1], 10) >= 600
          }

          // Paragraphs that are visually headings → real heading tags.
          doc.querySelectorAll('p').forEach(p => {
            const size = fontSize(p)
            const inner = p.querySelector('span, b, strong')
            const size2 = inner ? fontSize(inner) : 0
            const s = Math.max(size, size2)
            const bold = isBoldish(p) || (inner ? isBoldish(inner) : false)
            const text = (p.textContent || '').trim()
            if (!text) return
            // Heading heuristics: large text, or bold + short line.
            let tag: string | null = null
            if (s >= 18) tag = 'h2'
            else if (s >= 14 && bold) tag = 'h3'
            else if (bold && text.length < 90 && !/[.!?]$/.test(text)) tag = 'h3'
            if (tag) {
              const h = doc.createElement(tag)
              h.textContent = text
              p.replaceWith(h)
            }
          })

          // Inline styled spans → real <strong>/<em> so marks survive.
          doc.querySelectorAll('span').forEach(sp => {
            const style = sp.getAttribute('style') || ''
            const bold = isBoldish(sp)
            const italic = /font-style:\s*italic/i.test(style)
            if (!bold && !italic) return
            let node: globalThis.Node = doc.createTextNode(sp.textContent || '')
            if (italic) { const em = doc.createElement('em'); em.appendChild(node); node = em }
            if (bold)   { const st = doc.createElement('strong'); st.appendChild(node); node = st }
            sp.replaceWith(node as ChildNode)
          })

          // Strip Google's styling wrappers and empty paragraphs.
          doc.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))
          doc.querySelectorAll('p').forEach(p => { if (!(p.textContent || '').trim() && !p.querySelector('img')) p.remove() })

          return doc.body.innerHTML
        } catch {
          return html
        }
      },
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

  const insertCustom = (type: 'callout' | 'button') => {
    editor?.chain().focus().insertContent({
      type: 'customBlock',
      attrs: { data: type === 'button' ? { type: 'button', text: '', url: '' } : { type: 'callout', text: '' } },
    }).run()
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
                className={editor.isActive('blockquote') ? btnOn : btn}>Quote</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? btnOn : btn}>Code</button>

        <span className="w-px bg-border mx-1" />

        <button type="button" onClick={addImage} className={btn}>+ Image</button>
        <button type="button" onClick={() => insertCustom('callout')} className={btn}>+ Callout</button>
        <button type="button" onClick={() => insertCustom('button')} className={btn}>+ Button</button>
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
              Supported tags: h2, h3, p, ul/ol, blockquote, pre/code, img, hr, strong, em, a
            </span>
          </div>
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}

      <div className="px-4 py-2 border-t border-border text-text-3 text-[11px] font-mono">
        Type naturally · Enter = new paragraph · Paste from Google Docs keeps headings &amp; formatting · &lt;/&gt; HTML for source editing
      </div>
    </div>
  )
}
