'use client'
import { useState, useEffect } from 'react'
import { Search } from '@/components/ui/Icons'
import Link from 'next/link'

type Check = {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
  category: string
}
type Result = {
  url: string
  score: number
  summary: { passes: number; warns: number; fails: number; total: number }
  title: string
  description: string
  checks: Check[]
}

const STATUS_META: Record<string, { icon: string; color: string; label: string }> = {
  pass: { icon: '✓', color: 'var(--success, #22c55e)', label: 'Pass' },
  warn: { icon: '!', color: '#f59e0b', label: 'Improve' },
  fail: { icon: '✕', color: 'var(--danger, #ef4444)', label: 'Fix' },
}

export default function SeoAuditClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const run = async (override?: string) => {
    const input = (override ?? url).trim()
    if (!input) return
    setLoading(true); setResult(null); setError('')
    try {
      const res = await fetch('/api/tools/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Audit failed')
      else setResult(data)
    } catch {
      setError('Network error, please try again')
    } finally {
      setLoading(false)
    }
  }

  // Auto-run when a ?url= param is present (arriving from a service-page bar).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initial = params.get('url')
    if (initial) {
      setUrl(initial)
      run(initial)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scoreColor = (s: number) => (s >= 80 ? 'var(--success, #22c55e)' : s >= 55 ? '#f59e0b' : 'var(--danger, #ef4444)')

  return (
    <div className="seo-audit">
      {/* Input */}
      <div className="seo-audit-input-row">
        <div className="seo-audit-field">
          <Search size={16} className="seo-audit-search-icon" />
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') run() }}
            placeholder="Enter a website URL, e.g. example.com"
            className="seo-audit-input"
          />
        </div>
        <button onClick={() => run()} disabled={loading} className="seo-audit-btn">
          {loading ? 'Auditing…' : 'Run Free Audit'}
        </button>
      </div>

      {error && <p className="seo-audit-error">{error}</p>}

      {result && (
        <div className="seo-audit-result">
          {/* Score + summary */}
          <div className="seo-audit-scorecard">
            <div className="seo-audit-score" style={{ borderColor: scoreColor(result.score) }}>
              <span className="seo-audit-score-num" style={{ color: scoreColor(result.score) }}>{result.score}</span>
              <span className="seo-audit-score-label">/ 100</span>
            </div>
            <div className="seo-audit-score-meta">
              <p className="seo-audit-score-url">{result.url}</p>
              <div className="seo-audit-tallies">
                <span className="seo-audit-tally" style={{ color: 'var(--success, #22c55e)' }}>{result.summary.passes} passed</span>
                <span className="seo-audit-tally" style={{ color: '#f59e0b' }}>{result.summary.warns} to improve</span>
                <span className="seo-audit-tally" style={{ color: 'var(--danger, #ef4444)' }}>{result.summary.fails} to fix</span>
              </div>
            </div>
          </div>

          {/* Checks */}
          <div className="seo-audit-checks">
            {result.checks.map(c => {
              const m = STATUS_META[c.status]
              return (
                <div key={c.id} className="seo-audit-check">
                  <span className="seo-audit-check-icon" style={{ background: m.color }}>{m.icon}</span>
                  <div className="seo-audit-check-body">
                    <div className="seo-audit-check-head">
                      <span className="seo-audit-check-label">{c.label}</span>
                      <span className="seo-audit-check-cat">{c.category}</span>
                    </div>
                    <p className="seo-audit-check-detail">{c.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Honest scope note + CTA */}
          <p className="seo-audit-note">
            This checks on-page technical SEO from your page&apos;s HTML. A full audit also covers site speed,
            backlinks, and a complete crawl &mdash; <Link href="/contact">get a complete SEO audit from our team →</Link>
          </p>
        </div>
      )}
    </div>
  )
}
