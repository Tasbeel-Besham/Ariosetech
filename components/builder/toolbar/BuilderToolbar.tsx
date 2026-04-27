'use client'
import Link from 'next/link'
import { useBuilderStore } from '@/lib/builder/store'
import { Undo2, Redo2, Eye, Save, Globe, ArrowLeft, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export function BuilderToolbar({ onAddSection }: { onAddSection: () => void }) {
  const { isDirty, isSaving, isPublishing, pageTitle, pageSlug, canUndo, canRedo, undo, redo, saveDraft, publishPage } = useBuilderStore()

  const save = async () => {
    await saveDraft()
    toast.success('Draft saved!')
  }

  const publish = async () => {
    await publishPage()
    toast.success('Page published!')
  }

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: '8px', border: 'none',
    fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)',
    cursor: 'pointer', transition: 'all 0.15s',
  }

  return (
    <div style={{
      height: '56px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', gap: '12px', position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/admin/pages" style={{
          display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)',
          textDecoration: 'none', fontSize: '13px', transition: 'color 0.15s',
        }} className="hover:text-[var(--text)]">
          <ArrowLeft size={14} /> Pages
        </Link>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{pageTitle || 'Untitled Page'}</p>
          {pageSlug && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>/{pageSlug}</p>}
        </div>

        {isDirty && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--amber)', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', padding: '2px 8px', borderRadius: '20px' }}>
            Unsaved
          </span>
        )}
      </div>

      {/* Center: undo/redo + add */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button onClick={undo} disabled={!canUndo()} title="Undo" style={{ ...btnBase, background: 'var(--bg-3)', color: canUndo() ? 'var(--text-2)' : 'var(--text-3)', border: '1px solid var(--border)', opacity: canUndo() ? 1 : 0.4, padding: '7px 10px' }}>
          <Undo2 size={14} />
        </button>
        <button onClick={redo} disabled={!canRedo()} title="Redo" style={{ ...btnBase, background: 'var(--bg-3)', color: canRedo() ? 'var(--text-2)' : 'var(--text-3)', border: '1px solid var(--border)', opacity: canRedo() ? 1 : 0.4, padding: '7px 10px' }}>
          <Redo2 size={14} />
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />

        <button onClick={onAddSection} style={{ ...btnBase, background: 'rgba(79,110,247,0.12)', color: 'var(--blue)', border: '1px solid rgba(79,110,247,0.3)' }}>
          <Plus size={14} /> Add Section
        </button>
      </div>

      {/* Right: save + publish + preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href={`/${pageSlug}`} target="_blank" style={{ ...btnBase, background: 'var(--bg-3)', color: 'var(--text-3)', border: '1px solid var(--border)', textDecoration: 'none' }}>
          <Eye size={14} /> Preview
        </Link>
        <button onClick={save} disabled={isSaving} style={{ ...btnBase, background: 'var(--bg-3)', color: 'var(--text-2)', border: '1px solid var(--border)', opacity: isSaving ? 0.6 : 1 }}>
          <Save size={14} /> {isSaving ? 'Saving…' : 'Save Draft'}
        </button>
        <button onClick={publish} disabled={isPublishing} style={{ ...btnBase, background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', opacity: isPublishing ? 0.6 : 1 }}>
          <Globe size={14} /> {isPublishing ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
