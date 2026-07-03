'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    fetch('/api/header').then(r => r.json()).then(d => {
      if (d.logo) setLogoUrl(String(d.logo).replace(/^\/+/, ''))
    }).catch(() => {})
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) { router.push('/admin/dashboard') }
    else { setError('Invalid username or password'); setLoading(false) }
  }

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-[11px] px-3.5 text-sm text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-2"

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-5">
      {/* Background glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(79,110,247,0.1)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[400px] relative">
        {/* Logo */}
        <div className="text-center mb-10">
          {logoUrl ? (<img src={logoUrl} alt="ARIOSETECH" className="h-10 w-auto object-contain mx-auto block" />) : (<div className="font-logo text-[28px] text-white text-center">ARIOSETECH</div>)}
          <p className="font-mono text-[11px] text-text-3 mt-2 uppercase tracking-[0.12em]">
            Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-bg-2 border border-border rounded-[20px] p-9">
          <h1 className="font-display text-[22px] font-extrabold text-white mb-1.5 tracking-[-0.02em]">
            Sign in
          </h1>
          <p className="text-[13px] text-text-3 mb-7">
            Enter your credentials to continue
          </p>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className={lblClass}>
                Username
              </label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="admin" autoComplete="username" required
                className={inpClass}
              />
            </div>

            <div>
              <label className={lblClass}>
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password" required
                className={inpClass}
              />
            </div>

            {error && (
              <div className="bg-[rgba(255,77,109,0.1)] border border-[rgba(255,77,109,0.3)] rounded-lg py-2.5 px-3.5 text-[13px] text-[#ff4d6d] text-center">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg border-none cursor-pointer bg-gradient-to-br from-[#4f6ef7] to-[#9b6dff] text-white text-sm font-bold font-display transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-xs text-text-3">
          <Link href="/" className="text-text-3 no-underline transition-colors hover:text-white">← Back to website</Link>
        </p>
      </div>
    </div>
  )
}
