'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Search, Check, AlertCircle, Loader } from '@/components/ui/Icons'
import toast from 'react-hot-toast'

type Check = { id: string; label: string; status: 'pass' | 'warn' | 'fail'; detail: string; fix?: string }
type Result = {
  url: string
  score: number
  checks: Check[]
  ai: { summary: string; suggestions: string[] } | null
  aiAvailable: boolean
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

const STATUS_STYLE: Record<Check['status'], { color: string; bg: string; label: string }> = {
  pass: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: 'Pass' },
  warn: { color: '#f5a623', bg: 'rgba(245,166,35,0.1)', label: 'Improve' },
  fail: { color: '#ff4d6d', bg: 'rgba(255,77,109,0.1)', label: 'Fix' },
}

export default function SeoAuditPage() {
  const [pages, setPages] = useState<{ label: string; href: string }[]>([])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const STATIC = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/contact' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
    ]
    fetch('/api/pages').then(r => r.ok ? r.json() : []).then((data: unknown) => {
      const dyn = Array.isArray(data)
        ? (data as { title?: string; fullPath?: string; status?: string }[])
            .filter(p => p.fullPath && p.status === 'published')
            .map(p => ({ label: p.title || p.fullPath!, href: p.fullPath! }))
        : []
      const seen = new Set(STATIC.map(s => s.href))
      setPages([...STATIC, ...dyn.filter(d => !seen.has(d.href))])
    }).catch(() => setPages(STATIC))
  }, [])

  const run = async (target?: string) => {
    const full = (target || url).trim()
    if (!full) { toast.error('Enter a URL or pick a page'); return }
    const absolute = full.startsWith('http') ? full : `${SITE}${full.startsWith('/') ? '' : '/'}${full}`
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/seo-audit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: absolute }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Audit failed'); return }
      setResult(data)
    } catch {
      toast.error('Could not run audit')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s: number) => s >= 80 ? '#22c55e' : s >= 55 ? '#f5a623' : '#ff4d6d'
  const cardClass = 'bg-bg-2 border border-border rounded-2xl p-6 mb-5'
  const inpClass = 'w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body focus:border-primary/50 transition-colors'

  return (
    <AdminShell>
      <div className="p-8 max-w-[820px]">
        <div className="mb-7">
          <h1 className="admin-page__title">SEO Auditor</h1>
          <p className="admin-page__subtitle">Check any page against on-page SEO best practices. Read-only — this never changes your site.</p>
        </div>

        {/* Input */}
        <div className={cardClass}>
          <label className="font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-2">Page to audit</label>
          <div className="flex gap-2 max-sm:flex-col">
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              placeholder="/about  or  https://ariosetech.com/about"
              className={`${inpClass} flex-1 font-mono text-xs`}
            />
            <button onClick={() => run()} disabled={loading} className="btn btn-primary btn-md shrink-0 max-sm:w-full justify-center">
              {loading ? <><Loader size={14} className="animate-spin" /> Auditing…</> : <><Search size={14} /> Run Audit</>}
            </button>
          </div>
          {pages.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {pages.map(p => (
                <button key={p.href} onClick={() => { setUrl(p.href); run(p.href) }}
                  className="py-1 px-2.5 rounded-full border border-border bg-transparent text-text-3 text-[11px] font-medium hover:text-primary hover:border-primary/40 transition-colors">
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12 text-text-3">
            <Loader size={26} className="animate-spin mx-auto mb-3 text-primary" />
            <p className="text-[13px]">Fetching and analyzing the page…</p>
          </div>
        )}

        {result && !loading && (
          <>
            {/* Score */}
            <div className={cardClass}>
              <div className="flex items-center gap-5 max-sm:flex-col max-sm:text-center">
                <div className="relative w-[92px] h-[92px] shrink-0">
                  <svg width="92" height="92" viewBox="0 0 92 92" className="-rotate-90">
                    <circle cx="46" cy="46" r="40" fill="none" stroke="var(--border-2)" strokeWidth="7" />
                    <circle cx="46" cy="46" r="40" fill="none" stroke={scoreColor(result.score)} strokeWidth="7"
                      strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.score / 100)}`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-[26px] font-extrabold" style={{ color: scoreColor(result.score) }}>{result.score}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-white mb-1">
                    {result.score >= 80 ? 'Strong SEO health' : result.score >= 55 ? 'Room to improve' : 'Needs attention'}
                  </p>
                  <p className="text-[13px] text-text-3 break-all">{result.url}</p>
                  <p className="text-[12px] text-text-3 mt-1">
                    {result.checks.filter(c => c.status === 'pass').length} passed ·{' '}
                    {result.checks.filter(c => c.status === 'warn').length} to improve ·{' '}
                    {result.checks.filter(c => c.status === 'fail').length} to fix
                  </p>
                </div>
              </div>
            </div>

            {/* Checks */}
            <div className={cardClass}>
              <h2 className="font-display text-[15px] font-bold text-white mb-4">Technical checks</h2>
              <div className="flex flex-col gap-2.5">
                {result.checks.map(c => {
                  const s = STATUS_STYLE[c.status]
                  return (
                    <div key={c.id} className="flex gap-3 items-start p-3 rounded-xl bg-bg-3 border border-border">
                      <span className="shrink-0 mt-0.5 w-[22px] h-[22px] rounded-md flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                        {c.status === 'pass' ? <Check size={13} /> : <AlertCircle size={13} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-display text-[13.5px] font-semibold text-white">{c.label}</p>
                          <span className="font-mono text-[9px] uppercase tracking-wide py-0.5 px-1.5 rounded" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        </div>
                        <p className="text-[12.5px] text-text-2 mt-0.5 break-words">{c.detail}</p>
                        {c.fix && <p className="text-[12px] text-text-3 mt-1 leading-relaxed"><span className="text-primary font-semibold">Fix:</span> {c.fix}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI review */}
            <div className={cardClass}>
              <h2 className="font-display text-[15px] font-bold text-white mb-1">AI content review</h2>
              {result.ai ? (
                <>
                  <p className="text-[13px] text-text-2 leading-relaxed mb-4">{result.ai.summary}</p>
                  <div className="flex flex-col gap-2">
                    {result.ai.suggestions.map((sug, i) => (
                      <div key={i} className="flex gap-2.5 items-start p-3 rounded-xl bg-primary/5 border border-primary/15">
                        <span className="font-mono text-[11px] text-primary font-bold shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-[13px] text-text-2 leading-relaxed">{sug}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-[13px] text-text-3 leading-relaxed">
                  {result.aiAvailable
                    ? 'The AI review could not be generated this time. The technical checks above are still complete.'
                    : 'AI content review is off. Add an ANTHROPIC_API_KEY to your environment to enable AI-powered content suggestions. The technical checks above work without it.'}
                </p>
              )}
            </div>

            <p className="text-[11px] text-text-3 text-center leading-relaxed px-4">
              This tool gives advice only. Review each suggestion and apply the ones that fit — good SEO comes from real, useful content, not automation.
            </p>
          </>
        )}
      </div>
    </AdminShell>
  )
}
