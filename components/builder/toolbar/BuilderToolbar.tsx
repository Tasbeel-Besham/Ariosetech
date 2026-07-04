'use client'
import Link from 'next/link'
import { useBuilderStore } from '@/lib/builder/store'
import { Undo2, Redo2, Eye, Save, Globe, ArrowLeft, Plus } from '@/components/ui/Icons'
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

  const btnBase = "flex items-center justify-center gap-1.5 py-1.5 px-3.5 rounded-lg border-none text-[13px] font-semibold font-display cursor-pointer transition-all duration-150"

  return (
    <div className="h-14 bg-bg-2 border-b border-border flex items-center justify-between px-4 gap-3 sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link href="/admin/pages" className="flex items-center gap-1.5 text-text-3 no-underline text-[13px] transition-colors duration-150 hover:text-white">
          <ArrowLeft size={14} /> Pages
        </Link>

        <div className="w-[1px] h-5 bg-border" />

        <div>
          <p className="font-display text-sm font-bold text-white leading-none">{pageTitle || 'Untitled Page'}</p>
          {pageSlug && <p className="font-mono text-[10px] text-text-3 mt-0.5">/{pageSlug}</p>}
        </div>

        {isDirty && (
          <span className="font-mono text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/30 py-0.5 px-2 rounded-full">
            Unsaved
          </span>
        )}
      </div>

      {/* Center: undo/redo + add */}
      <div className="flex items-center gap-1.5">
        <button onClick={undo} disabled={!canUndo()} title="Undo" className={`${btnBase} bg-bg-3 border border-border px-2.5 ${canUndo() ? 'text-text-2 opacity-100' : 'text-text-3 opacity-40'}`}>
          <Undo2 size={14} />
        </button>
        <button onClick={redo} disabled={!canRedo()} title="Redo" className={`${btnBase} bg-bg-3 border border-border px-2.5 ${canRedo() ? 'text-text-2 opacity-100' : 'text-text-3 opacity-40'}`}>
          <Redo2 size={14} />
        </button>

        <div className="w-[1px] h-5 bg-border mx-1" />

        <button onClick={onAddSection} className={`${btnBase} bg-primary/10 text-[color:var(--blue)] border border-[rgba(79,110,247,0.3)]`}>
          <Plus size={14} /> Add Section
        </button>
      </div>

      {/* Right: save + publish + preview */}
      <div className="flex items-center gap-2">
        <Link href={`/${pageSlug}`} target="_blank" className={`${btnBase} bg-bg-3 text-text-3 border border-border no-underline`}>
          <Eye size={14} /> Preview
        </Link>
        <button onClick={save} disabled={isSaving} className={`${btnBase} bg-bg-3 text-text-2 border border-border ${isSaving ? 'opacity-60' : 'opacity-100'}`}>
          <Save size={14} /> {isSaving ? 'Saving…' : 'Save Draft'}
        </button>
        <button onClick={publish} disabled={isPublishing} className={`${btnBase} bg-gradient-to-br from-[#4f6ef7] to-[#9b6dff] text-white ${isPublishing ? 'opacity-60' : 'opacity-100'}`}>
          <Globe size={14} /> {isPublishing ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
