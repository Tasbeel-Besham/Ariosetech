import type { BlogBlock } from '@/types'

/**
 * Bridges the rich-text editor (TipTap/ProseMirror JSON) and the block array
 * that blog posts are stored in and that BlogContent renders.
 *
 * Why a converter instead of switching storage to HTML: all existing posts are
 * stored as blocks, the renderer reads blocks, and the JSON is also what feeds
 * schema and excerpts. Keeping that contract means the new editor is a drop-in
 * change with zero migration and no risk to published content.
 *
 * Inline marks (bold/italic/links) are intentionally flattened to text, because
 * BlogContent renders block.text as plain text. Anything richer would need the
 * renderer to handle HTML — a separate, larger change.
 */

type PMNode = {
  type: string
  content?: PMNode[]
  text?: string
  attrs?: Record<string, unknown>
}

/** Flatten a ProseMirror node's inline children to plain text. */
function textOf(node?: PMNode): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (!node.content) return ''
  return node.content.map(textOf).join('')
}

/** TipTap document JSON -> blog block array (what we save). */
export function docToBlocks(doc: PMNode | null | undefined): BlogBlock[] {
  const out: BlogBlock[] = []
  if (!doc?.content) return out

  for (const node of doc.content) {
    switch (node.type) {
      case 'heading': {
        const level = Number(node.attrs?.level) || 2
        const text = textOf(node).trim()
        if (!text) break
        // Renderer supports h2/h3; map anything deeper to h3.
        out.push({ type: level <= 2 ? 'h2' : 'h3', text } as BlogBlock)
        break
      }
      case 'paragraph': {
        const text = textOf(node).trim()
        if (text) out.push({ type: 'p', text } as BlogBlock)
        break
      }
      case 'bulletList':
      case 'orderedList': {
        const items = (node.content || [])
          .map(li => textOf(li).trim())
          .filter(Boolean)
        if (items.length) {
          out.push({ type: 'list', ordered: node.type === 'orderedList', items } as BlogBlock)
        }
        break
      }
      case 'blockquote': {
        const text = (node.content || []).map(textOf).join(' ').trim()
        if (text) out.push({ type: 'quote', text } as BlogBlock)
        break
      }
      case 'codeBlock': {
        const text = textOf(node)
        if (text.trim()) {
          out.push({ type: 'code', text, lang: (node.attrs?.language as string) || undefined } as BlogBlock)
        }
        break
      }
      case 'horizontalRule':
        out.push({ type: 'divider' } as BlogBlock)
        break
      case 'image': {
        const url = node.attrs?.src as string | undefined
        if (url) {
          out.push({ type: 'image', url, caption: (node.attrs?.alt as string) || undefined } as BlogBlock)
        }
        break
      }
      // Custom blocks stored as a node with a data payload (callout, button).
      case 'customBlock': {
        const data = node.attrs?.data as BlogBlock | undefined
        if (data && data.type) out.push(data)
        break
      }
      default:
        break
    }
  }
  return out
}

/** Blog block array -> TipTap document JSON (what we load into the editor). */
export function blocksToDoc(blocks: BlogBlock[] | undefined): PMNode {
  const content: PMNode[] = []
  for (const b of blocks || []) {
    switch (b.type) {
      case 'h2':
      case 'h3':
        content.push({
          type: 'heading',
          attrs: { level: b.type === 'h2' ? 2 : 3 },
          content: b.text ? [{ type: 'text', text: b.text }] : [],
        })
        break
      case 'p':
        content.push({ type: 'paragraph', content: b.text ? [{ type: 'text', text: b.text }] : [] })
        break
      case 'list':
        content.push({
          type: b.ordered ? 'orderedList' : 'bulletList',
          content: (b.items || []).map(it => ({
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: it }] }],
          })),
        })
        break
      case 'quote':
        content.push({
          type: 'blockquote',
          content: [{ type: 'paragraph', content: b.text ? [{ type: 'text', text: b.text }] : [] }],
        })
        break
      case 'code':
        content.push({
          type: 'codeBlock',
          attrs: { language: b.lang || null },
          content: b.text ? [{ type: 'text', text: b.text }] : [],
        })
        break
      case 'divider':
        content.push({ type: 'horizontalRule' })
        break
      case 'image':
        if (b.url) content.push({ type: 'image', attrs: { src: b.url, alt: b.caption || '' } })
        break
      // callout / button round-trip through a custom node so they survive edits
      case 'callout':
      case 'button':
        content.push({ type: 'customBlock', attrs: { data: b } })
        break
      default:
        break
    }
  }
  if (content.length === 0) content.push({ type: 'paragraph' })
  return { type: 'doc', content }
}
