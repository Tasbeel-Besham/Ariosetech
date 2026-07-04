'use client'
import { useState, useEffect } from 'react'
import { X } from '@/components/ui/Icons'

export function MediaPickerModal({ onClose, onSelect }: { onClose: () => void, onSelect: (url: string) => void }) {
  const [items, setItems] = useState<Array<{_id: string, url: string}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/media').then(r => r.json()).then(data => {
      setItems(Array.isArray(data) ? data : [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-5">
      <div className="bg-bg-2 border border-subtle rounded-2xl w-full max-w-[800px] max-h-[80vh] flex flex-col">
        <div className="p-5 border-b border-subtle flex justify-between items-center">
          <h3 className="font-display text-lg font-bold">Select from Media Library</h3>
          <button onClick={onClose} className="bg-transparent border-none text-gray-2 cursor-pointer hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center p-10 text-gray-3">Loading media...</div>
          ) : !items.length ? (
            <div className="text-center p-10 text-gray-3">No media found. Upload something first!</div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
              {items.map(item => (
                <button key={item._id} onClick={() => onSelect(item.url)} className="border border-subtle bg-bg-3 rounded-lg p-2 cursor-pointer flex items-center justify-center h-[100px] w-full hover:border-primary transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt="Media" className="max-w-full max-h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
