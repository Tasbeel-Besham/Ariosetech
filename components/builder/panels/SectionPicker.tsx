'use client'
import { useState } from 'react'
import { getSectionsByCategory } from '@/lib/builder/registry'
import { useBuilderStore } from '@/lib/builder/store'
import { X, Search } from 'lucide-react'

export function SectionPicker({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('')
  const { addSection } = useBuilderStore()
  const byCategory = getSectionsByCategory()

  const add = (type: string) => {
    addSection(type)
    onClose()
  }

  const allSections = Object.values(byCategory).flat()
  const filtered = search
    ? allSections.filter(s => s.label.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))
    : null

  const categories = filtered
    ? { 'Search Results': filtered }
    : byCategory

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-2)', borderRadius: '20px', width: '560px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 20px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>Add Section</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}>
              <X size={18} />
            </button>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search sections…" autoFocus
              style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '9px 12px 9px 34px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }}
            />
          </div>
        </div>

        {/* Sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {Object.entries(categories).map(([cat, sections]) => (
            <div key={cat} style={{ marginBottom: '20px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{cat}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {sections.map(def => (
                  <button key={def.type} onClick={() => add(def.type)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border)',
                    background: 'var(--bg-3)', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }} className="hover:border-[rgba(79,110,247,0.4)] hover:bg-[rgba(79,110,247,0.08)]">
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>{def.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>{def.label}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>{def.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(categories).length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '13px', padding: '40px 0' }}>No sections found for &ldquo;{search}&rdquo;</p>
          )}
        </div>
      </div>
    </div>
  )
}
