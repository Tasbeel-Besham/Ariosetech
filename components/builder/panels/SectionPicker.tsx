'use client'
import { useState } from 'react'
import { getSectionsByCategory } from '@/lib/builder/registry'
import { useBuilderStore } from '@/lib/builder/store'
import { X, Search } from '@/components/ui/Icons'

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-bg-2 border border-border-2 rounded-[20px] w-[560px] max-h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="pt-5 px-5 pb-0 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-extrabold text-white">Add Section</h2>
            <button onClick={onClose} className="bg-transparent border-none text-text-3 cursor-pointer p-1 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          {/* Search */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search sections…" autoFocus
              className="w-full bg-bg-3 border border-border rounded-xl py-[9px] pr-3 pl-[34px] text-[13px] text-white outline-none font-body focus:border-primary/50 transition-colors box-border"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {Object.entries(categories).map(([cat, sections]) => (
            <div key={cat} className="mb-5">
              <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider mb-2">{cat}</p>
              <div className="grid grid-cols-2 gap-2">
                {sections.map(def => (
                  <button key={def.type} onClick={() => add(def.type)} className="flex items-center gap-3 py-3 px-3.5 rounded-xl border border-border bg-bg-3 cursor-pointer text-left transition-all duration-150 hover:border-primary/40 hover:bg-primary/10">
                    <span className="text-[22px] shrink-0">{def.icon}</span>
                    <div>
                      <p className="font-display text-[13px] font-semibold text-white leading-[1.2]">{def.label}</p>
                      <p className="font-mono text-[10px] text-text-3 mt-0.5">{def.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(categories).length === 0 && (
            <p className="text-center text-text-3 text-[13px] py-10">No sections found for &ldquo;{search}&rdquo;</p>
          )}
        </div>
      </div>
    </div>
  )
}
