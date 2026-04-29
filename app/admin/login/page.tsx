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
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.logo_url) setLogoUrl(d.logo_url)
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(79,110,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          {logoUrl ? (<img src={logoUrl} alt="ARIOSETECH" style={{ height: '40px', width: 'auto', objectFit: 'contain', margin: '0 auto', display: 'block' }} />) : (<div style={{ fontFamily: 'var(--font-logo)', fontSize: '28px', color: '#fff', textAlign: 'center' }}>ARIOSETECH</div>)}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Sign in
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '28px' }}>
            Enter your credentials to continue
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                Username
              </label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="admin" autoComplete="username" required
                style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password" required
                style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(79,110,247,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ff4d6d', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)',
              color: '#fff', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)',
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-3)' }}>
          <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>← Back to website</Link>
        </p>
      </div>
    </div>
  )
}
