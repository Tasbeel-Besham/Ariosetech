'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Upload, Copy, Trash2, Check } from '@/components/ui/Icons'
import toast from 'react-hot-toast'

type MediaItem = { _id: string; url: string; alt: string; width?: number; height?: number; size?: number; createdAt: string }

export default function MediaAdmin() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [urlInput, setUrlInput] = useState('')
  const [tab, setTab] = useState<'upload' | 'url'>('upload')
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(() => {
    fetch('/api/media').then(r => r.json()).then(d => { if (Array.isArray(d)) setItems(d) }).finally(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return
    setUploading(true)
    let done = 0
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt', file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
      if (res.ok) { done++ }
      else {
        const { error } = await res.json()
        toast.error(error || `Failed: ${file.name}`)
      }
      setProgress(Math.round((done / files.length) * 100))
    }
    if (done > 0) toast.success(`${done} file${done > 1 ? 's' : ''} uploaded!`)
    setUploading(false)
    setProgress(0)
    load()
  }

  const addByUrl = async () => {
    if (!urlInput) return
    setUploading(true)
    const fd = new FormData()
    fd.append('url', urlInput)
    fd.append('alt', urlInput.split('/').pop()?.replace(/[?#].*/, '') || 'image')
    const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
    setUploading(false)
    if (res.ok) { toast.success('Image added!'); setUrlInput(''); load() }
    else { const { error } = await res.json(); toast.error(error || 'Failed') }
  }

  const copy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    toast.success('URL copied!')
    setTimeout(() => setCopied(null), 2000)
  }

  const del = async (id: string) => {
    await fetch(`/api/media/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length) uploadFiles(files)
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"

  return (
    <AdminShell>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Media Library</h1>
            <p className="admin-page__subtitle">{items.length} files · Supports multiple file upload</p>
          </div>
        </div>

        {/* Upload area */}
        <div className="bg-bg-2 border border-border rounded-2xl overflow-hidden mb-6">
          <div className="flex border-b border-border">
            {([['upload', '⬆ Upload Files'], ['url', '🔗 Add by URL']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={`flex-1 py-3 bg-transparent border-none border-b-2 cursor-pointer text-[13px] font-semibold font-display transition-all ${tab === id ? 'border-b-primary text-white bg-bg-3' : 'border-b-transparent text-text-3'}`}>{label}</button>
            ))}
          </div>

          <div className="p-5">
            {tab === 'upload' ? (
              <>
                <div
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl py-12 px-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-primary bg-primary/10' : 'border-border-2 bg-transparent'}`}>
                  {uploading ? (
                    <>
                      <div className="w-9 h-9 rounded-full border-[3px] border-border border-t-primary animate-spin mx-auto mb-3" />
                      <p className="text-sm text-text-3 mb-2.5">Uploading… {progress}%</p>
                      <div className="w-[200px] h-1 bg-bg-4 rounded-sm mx-auto overflow-hidden">
                        <div className="h-full bg-gradient-to-br from-primary to-primary-dark rounded-sm transition-[width] duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={36} className="text-text-3 mx-auto mb-3 block" />
                      <p className="font-display font-bold text-white mb-1.5">Drag & drop multiple files here</p>
                      <p className="font-mono text-[11px] text-text-3 mb-4">JPG, PNG, WebP, GIF, SVG · Max 10MB each</p>
                      <span className="btn btn-outline btn-md pointer-events-none">Browse Files</span>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { const files = Array.from(e.target.files || []); if (files.length) uploadFiles(files); e.target.value = '' }} />
                <div className="info-box mt-3">
                  <strong>Setup required:</strong> Add one of these to Vercel env vars:
                  <br />• <code className="font-mono text-primary">IMGBB_API_KEY</code> — free at <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">imgbb.com</a>
                  <br />• <code className="font-mono text-primary">CLOUDINARY_CLOUD_NAME</code> + <code className="font-mono text-primary">CLOUDINARY_UPLOAD_PRESET</code>
                </div>
              </>
            ) : (
              <div>
                <label className="font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-2">Image URL</label>
                <div className="flex gap-2.5">
                  <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://example.com/image.jpg" className={`${inpClass} font-mono text-xs flex-1`} onKeyDown={e => e.key === 'Enter' && addByUrl()} />
                  <button onClick={addByUrl} disabled={!urlInput || uploading} className="btn btn-primary btn-md">{uploading ? 'Adding…' : 'Add'}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="p-10 text-center text-text-3">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-[60px] text-center bg-bg-2 border border-dashed border-border rounded-2xl">
            <Upload size={36} className="text-text-3 mx-auto mb-3.5 block" />
            <p className="text-sm text-text-3">No media yet. Upload images above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
            {items.map(item => (
              <div key={item._id} className="bg-bg-2 border border-border rounded-xl overflow-hidden transition-colors hover:border-primary/30 group">
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="block h-[110px] bg-bg-3 overflow-hidden cursor-zoom-in"
                  title="Click to view full size">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.alt} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                </a>
                <div className="p-2.5">
                  <p className="text-[11px] text-text-2 mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap" title={item.alt}>{item.alt || 'Untitled'}</p>
                  {item.width && <p className="font-mono text-[9px] text-text-3 mb-2">{item.width}×{item.height}</p>}
                  <div className="flex gap-1">
                    <button onClick={() => copy(item.url)} className={`flex-1 py-[5px] rounded-md border border-border bg-transparent cursor-pointer flex items-center justify-center gap-1 text-[11px] transition-colors ${copied === item.url ? 'text-[#00e5a0]' : 'text-text-3 hover:text-white'}`}>
                      {copied === item.url ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                    </button>
                    <button onClick={() => del(item._id)} className="py-[5px] px-2 rounded-md border border-border bg-transparent cursor-pointer text-text-3 flex items-center transition-colors hover:border-[#ff4d6d]/40 hover:text-[#ff4d6d]">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
