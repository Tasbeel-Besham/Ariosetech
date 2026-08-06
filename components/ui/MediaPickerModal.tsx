'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { X } from '@/components/ui/Icons'
import { uploadImageFiles } from '@/lib/media/upload'

type MediaItem = { _id: string; url: string; alt?: string }

type Props = {
  onClose: () => void
  /** Single-select: fires on click and the modal closes. */
  onSelect: (url: string) => void
  /**
   * Multi-select. Clicking toggles a selection instead of closing, and
   * `onSelectMany` fires once with everything chosen. For galleries, where
   * picking eight images one modal-open at a time is miserable.
   */
  multiple?: boolean
  onSelectMany?: (urls: string[]) => void
}

/**
 * Media library picker.
 *
 * Now uploads as well as browses — previously it could only show what was
 * already in the library, so adding a new image meant leaving the builder,
 * going to /admin/media, uploading, then coming back. Uploading a single file
 * selects it immediately; uploading several just refreshes the grid so you can
 * choose.
 *
 * Props are unchanged, so every existing call site keeps working.
 */
export function MediaPickerModal({ onClose, onSelect, multiple = false, onSelectMany }: Props) {
  const [items, setItems]         = useState<MediaItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [progress, setProgress]   = useState('')
  const [query, setQuery]         = useState('')
  const [picked, setPicked]       = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(() => {
    return fetch('/api/media')
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load the media library.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  // Esc closes — the modal sits above the builder canvas, so a keyboard exit matters.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const confirm = () => {
    if (picked.length === 0) return
    if (onSelectMany) onSelectMany(picked)
    else picked.forEach(onSelect)
  }

  // Order matters — a gallery renders in the order images were picked.
  const toggle = (url: string) =>
    setPicked(p => (p.includes(url) ? p.filter(u => u !== url) : [...p, url]))

  const handleFiles = async (files: File[]) => {
    if (!files.length) return
    setUploading(true)
    setError('')
    setProgress('')
    try {
      // Large images are downscaled in the browser first. Without this a
      // full-page screenshot (typically 4-8 MB) is rejected by the host's
      // 4.5 MB request-body cap before the upload route ever runs.
      const { urls, errors } = await uploadImageFiles(files, (done, total, name) => {
        setProgress(total > 1 ? `Uploading ${done + 1} of ${total}…` : `Preparing ${name}…`)
      })

      if (errors.length) setError(errors.join(' · '))
      if (urls.length) await load()

      if (multiple) {
        // Freshly uploaded images join the selection rather than closing the
        // modal — you're usually mid-way through building a gallery.
        setPicked(p => [...p, ...urls.filter(u => !p.includes(u))])
        return
      }
      // One file in, one field to fill — select it and get out of the way.
      if (urls.length === 1 && !errors.length) { onSelect(urls[0]); return }
    } catch (e) {
      // Nothing should reach here, but a stuck spinner is the worst outcome.
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setUploading(false)
      setProgress('')
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const visible = query.trim()
    ? items.filter(i => `${i.url} ${i.alt || ''}`.toLowerCase().includes(query.trim().toLowerCase()))
    : items

  return (
    <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-5" onClick={onClose}>
      <div className="bg-bg-2 border border-subtle rounded-2xl w-full max-w-[800px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="p-5 border-b border-subtle flex justify-between items-center gap-3">
          <h3 className="font-display text-lg font-bold shrink-0">Select Image</h3>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search…"
              className="bg-bg-3 border border-border rounded-md py-1.5 px-2.5 text-xs text-white outline-none w-[140px] focus:border-primary/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-semibold cursor-pointer border-none disabled:opacity-60 disabled:cursor-default hover:opacity-90 transition-opacity"
            >
              {uploading ? (progress || 'Uploading…') : '↑ Upload'}
            </button>
            <button onClick={onClose} className="bg-transparent border-none text-gray-2 cursor-pointer hover:text-white transition-colors"><X size={20} /></button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={e => handleFiles(Array.from(e.target.files || []))}
          />
        </div>

        {error && (
          <div className="mx-5 mt-4 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/30 text-[11px] text-red-300">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="p-5 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center p-10 text-gray-3">Loading media…</div>
          ) : !visible.length ? (
            <div className="text-center p-10 text-gray-3">
              {query ? 'Nothing matches that search.' : 'No media yet — hit Upload to add your first image.'}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
              {visible.map(item => {
                const order = picked.indexOf(item.url)
                const isPicked = order !== -1
                return (
                  <button
                    key={item._id}
                    onClick={() => (multiple ? toggle(item.url) : onSelect(item.url))}
                    className={`relative bg-bg-3 rounded-lg p-2 cursor-pointer flex items-center justify-center h-[100px] w-full overflow-hidden border transition-colors ${
                      isPicked ? 'border-primary ring-1 ring-primary' : 'border-subtle hover:border-primary'
                    }`}
                    title={item.alt || item.url}
                  >
                    {/* object-top so tall full-page screenshots show their header,
                        which is how you recognise which site it is. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.alt || 'Media'} className="max-w-full max-h-full object-contain object-top" />
                    {isPicked && (
                      // The number, not a tick — in a gallery, pick order is
                      // render order.
                      <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {order + 1}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer — multi-select only */}
        {multiple && (
          <div className="p-4 border-t border-subtle flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-text-3">
              {picked.length === 0 ? 'Nothing selected' : `${picked.length} selected`}
            </span>
            <div className="flex items-center gap-2">
              {picked.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPicked([])}
                  className="px-3 py-2 rounded-md bg-transparent border border-border text-text-3 text-xs cursor-pointer hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={confirm}
                disabled={picked.length === 0}
                className="px-4 py-2 rounded-md bg-primary text-white text-xs font-semibold border-none cursor-pointer disabled:opacity-40 disabled:cursor-default hover:opacity-90 transition-opacity"
              >
                Add {picked.length > 0 ? picked.length : ''} {picked.length === 1 ? 'image' : 'images'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
