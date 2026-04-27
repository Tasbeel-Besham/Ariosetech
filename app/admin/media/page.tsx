'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Upload, Copy, Trash2, Check } from 'lucide-react'
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

  const inp: React.CSSProperties = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }

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
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {([['upload', '⬆ Upload Files'], ['url', '🔗 Add by URL']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: '12px', background: tab === id ? 'var(--bg-3)' : 'none', border: 'none', borderBottom: tab === id ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', color: tab === id ? '#fff' : 'var(--text-3)', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)', transition: 'all 0.15s' }}>{label}</button>
            ))}
          </div>

          <div style={{ padding: '20px' }}>
            {tab === 'upload' ? (
              <>
                <div
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                  style={{ border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border-2)'}`, borderRadius: '12px', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'var(--primary-soft)' : 'transparent', transition: 'all 0.2s' }}>
                  {uploading ? (
                    <>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                      <p style={{ color: 'var(--text-3)', fontSize: '14px', marginBottom: '10px' }}>Uploading… {progress}%</p>
                      <div style={{ width: '200px', height: '4px', background: 'var(--bg-4)', borderRadius: '2px', margin: '0 auto', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--grad)', borderRadius: '2px', transition: 'width 0.3s' }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={36} style={{ color: 'var(--text-3)', margin: '0 auto 12px', display: 'block' }} />
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Drag & drop multiple files here</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', marginBottom: '16px' }}>JPG, PNG, WebP, GIF, SVG · Max 10MB each</p>
                      <span className="btn btn-outline btn-md" style={{ pointerEvents: 'none' }}>Browse Files</span>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => { const files = Array.from(e.target.files || []); if (files.length) uploadFiles(files); e.target.value = '' }} />
                <div className="info-box" style={{ marginTop: '12px' }}>
                  <strong>Setup required:</strong> Add one of these to Vercel env vars:
                  <br />• <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>IMGBB_API_KEY</code> — free at <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>imgbb.com</a>
                  <br />• <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>CLOUDINARY_CLOUD_NAME</code> + <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>CLOUDINARY_UPLOAD_PRESET</code>
                </div>
              </>
            ) : (
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Image URL</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://example.com/image.jpg" style={{ ...inp, fontFamily: 'var(--font-mono)', fontSize: '12px', flex: 1 }} onKeyDown={e => e.key === 'Enter' && addByUrl()} />
                  <button onClick={addByUrl} disabled={!urlInput || uploading} className="btn btn-primary btn-md">{uploading ? 'Adding…' : 'Add'}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-2)', border: '1px dashed var(--border)', borderRadius: '16px' }}>
            <Upload size={36} style={{ color: 'var(--text-3)', margin: '0 auto 14px', display: 'block' }} />
            <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>No media yet. Upload images above.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {items.map(item => (
              <div key={item._id} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(118,108,255,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ display:'block', height:'110px', background:'var(--bg-3)', overflow:'hidden', cursor:'zoom-in' }}
                  title="Click to view full size">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.alt} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.2s' }}
                    onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.05)')}
                    onMouseLeave={e=>(e.currentTarget.style.transform='')} />
                </a>
                <div style={{ padding: '10px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-2)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.alt}>{item.alt || 'Untitled'}</p>
                  {item.width && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-3)', marginBottom: '8px' }}>{item.width}×{item.height}</p>}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => copy(item.url)} style={{ flex: 1, padding: '5px', borderRadius: '6px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: copied === item.url ? 'var(--green)' : 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', transition: 'all 0.15s' }}>
                      {copied === item.url ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                    </button>
                    <button onClick={() => del(item._id)} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AdminShell>
  )
}
