'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function MediaPickerModal({ onClose, onSelect }: { onClose: () => void, onSelect: (url: string) => void }) {
  const [items, setItems] = useState<Array<{_id: string, url: string}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/media').then(r => r.json()).then(data => {
      setItems(Array.isArray(data) ? data : [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Select from Media Library</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>Loading media...</div>
          ) : !items.length ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>No media found. Upload something first!</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {items.map(item => (
                <button key={item._id} onClick={() => onSelect(item.url)} style={{ border: '1px solid var(--border)', background: 'var(--bg-3)', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', width: '100%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt="Media" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
