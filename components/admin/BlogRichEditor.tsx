'use client'
import { useEditor, EditorContent, Node, mergeAttributes, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback } from 'react'
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
      </div>

      {/* Writing surface */}
      <EditorContent editor={editor} />

      <div className="px-4 py-2 border-t border-border text-text-3 text-[11px] font-mono">
        Type naturally · Enter = new paragraph · Select text to format · Use + buttons to insert elements
      </div>
    </div>
  )
}
