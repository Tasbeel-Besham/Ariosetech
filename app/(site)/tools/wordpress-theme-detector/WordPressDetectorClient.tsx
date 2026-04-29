'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, Check, ExternalLink, AlertCircle, Loader } from '@/components/ui/Icons'

const F = { fontFamily:'var(--font-display)' } as const
const M = { fontFamily:'var(--font-mono)'    } as const

type WPResult = {
  isWordPress: boolean
  theme?: {
    name: string
    version?: string
    author?: string
    authorUrl?: string
    themeUrl?: string
    screenshot?: string
    description?: string
    isPremium?: boolean
  }
  plugins?: { name: string; slug?: string; version?: string }[]
  wpVersion?: string
  error?: string
}

export default function WordPressDetectorClient() {
  const [url, setUrl]         = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<WPResult | null>(null)
  const [error, setError]     = useState('')

  const detect = async () => {
    const input = url.trim()
    if (!input) return
    // Normalize URL
    const normalized = input.startsWith('http') ? input : `https://${input}`
    setLoading(true); setResult(null); setError('')
    try {
      const res = await fetch('/api/tools/detect-wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Detection failed')
      else setResult(data)
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = { flex:1, background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'13px 18px', fontSize:'15px', color:'var(--text)', outline:'none', fontFamily:'var(--font-body)', transition:'border-color 0.15s' }

  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop:'100px', paddingBottom:'60px', borderBottom:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(118,108,255,0.10) 0%, transparent 60%)', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'4px 14px', borderRadius:'var(--r-f)', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.25)', marginBottom:'20px' }}>
            <span style={{ ...M, fontSize:'10px', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:700 }}>Free Tool</span>
          </div>
          <h1 style={{ ...F, fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.04em', color:'#fff', marginBottom:'16px' }}>
            WordPress Theme Detector
          </h1>
          <p style={{ fontSize:'17px', color:'var(--text-2)', lineHeight:1.8, maxWidth:'560px', marginBottom:'36px' }}>
            Discover the WordPress theme and plugins powering any website — instantly and for free.
          </p>

          {/* Search bar */}
          <div style={{ display:'flex', gap:'10px', maxWidth:'640px', marginBottom:'16px' }}>
            <div style={{ display:'flex', flex:1, position:'relative' }}>
              <Search size={16} style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && detect()}
                placeholder="Enter website URL (e.g. example.com)"
                style={{ ...inp, paddingLeft:'42px', width:'100%', boxSizing:'border-box' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(118,108,255,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <button onClick={detect} disabled={loading || !url.trim()} className="btn btn-primary btn-lg" style={{ flexShrink:0 }}>
              {loading ? <Loader size={16} /> : <Search size={15} />}
              {loading ? 'Detecting…' : 'Detect Theme'}
            </button>
          </div>
          <p style={{ ...M, fontSize:'11px', color:'var(--text-3)' }}>
            Works on any publicly accessible WordPress website
          </p>
        </div>
      </section>

      {/* Result */}
      <section style={{ padding:'60px 0', borderBottom:'1px solid var(--border)', minHeight:'300px' }}>
        <div className="container">

          {/* Error */}
          {error && (
            <div style={{ display:'flex', gap:'12px', padding:'16px 20px', background:'rgba(255,77,109,0.08)', border:'1px solid rgba(255,77,109,0.25)', borderRadius:'14px', marginBottom:'24px' }}>
              <AlertCircle size={18} style={{ color:'var(--red)', flexShrink:0, marginTop:'1px' }} />
              <div>
                <p style={{ ...F, fontSize:'14px', fontWeight:600, color:'var(--red)', marginBottom:'4px' }}>Detection Failed</p>
                <p style={{ fontSize:'13px', color:'var(--text-2)' }}>{error}</p>
              </div>
            </div>
          )}

          {/* Not WordPress */}
          {result && !result.isWordPress && !result.error && (
            <div style={{ padding:'40px', textAlign:'center', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'20px' }}>
              <AlertCircle size={36} style={{ color:'var(--amber)', margin:'0 auto 14px', display:'block' }} />
              <p style={{ ...F, fontSize:'18px', fontWeight:700, color:'#fff', marginBottom:'8px' }}>Not a WordPress site</p>
              <p style={{ fontSize:'14px', color:'var(--text-2)' }}>This website doesn&apos;t appear to be built with WordPress.</p>
            </div>
          )}

          {/* WordPress result */}
          {result?.isWordPress && (
            <div>
              {/* Confirmed badge */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', borderRadius:'var(--r-f)', background:'rgba(0,229,160,0.08)', border:'1px solid rgba(0,229,160,0.22)', marginBottom:'28px' }}>
                <Check size={13} style={{ color:'var(--green)' }} />
                <span style={{ ...M, fontSize:'11px', color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700 }}>WordPress Confirmed</span>
                {result.wpVersion && <span style={{ ...M, fontSize:'10px', color:'var(--text-3)' }}>v{result.wpVersion}</span>}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                {/* Theme card */}
                {result.theme && (
                  <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'20px', overflow:'hidden' }}>
                    <div style={{ height:'3px', background:'var(--grad)' }} />
                    <div style={{ padding:'24px' }}>
                      <p style={{ ...M, fontSize:'10px', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:700, marginBottom:'16px' }}>Active Theme</p>

                      {result.theme.screenshot && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.theme.screenshot} alt={result.theme.name} style={{ width:'100%', height:'160px', objectFit:'cover', borderRadius:'10px', marginBottom:'16px', border:'1px solid var(--border)' }} />
                      )}

                      <h2 style={{ ...F, fontSize:'22px', fontWeight:800, color:'#fff', marginBottom:'6px' }}>{result.theme.name}</h2>

                      {result.theme.isPremium && (
                        <span style={{ ...M, fontSize:'9px', color:'var(--amber)', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)', padding:'3px 10px', borderRadius:'var(--r-f)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}>Premium</span>
                      )}

                      {result.theme.version && (
                        <p style={{ ...M, fontSize:'11px', color:'var(--text-3)', marginTop:'8px' }}>Version: {result.theme.version}</p>
                      )}
                      {result.theme.author && (
                        <p style={{ ...M, fontSize:'11px', color:'var(--text-3)', marginTop:'4px' }}>Author: {result.theme.author}</p>
                      )}
                      {result.theme.description && (
                        <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:1.7, marginTop:'12px' }}>{result.theme.description}</p>
                      )}
                      {result.theme.themeUrl && (
                        <a href={result.theme.themeUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'14px', fontSize:'13px', color:'var(--primary)', fontWeight:600 }}>
                          View Theme <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Plugins */}
                {result.plugins && result.plugins.length > 0 && (
                  <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'20px', overflow:'hidden' }}>
                    <div style={{ height:'3px', background:'var(--grad)' }} />
                    <div style={{ padding:'24px' }}>
                      <p style={{ ...M, fontSize:'10px', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:700, marginBottom:'16px' }}>
                        Detected Plugins ({result.plugins.length})
                      </p>
                      <div style={{ display:'flex', flexDirection:'column', gap:'8px', maxHeight:'380px', overflowY:'auto' }}>
                        {result.plugins.map((plugin, i) => (
                          <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', background:'var(--bg-3)', borderRadius:'10px', border:'1px solid var(--border)' }}>
                            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'var(--primary-soft)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, ...F, fontSize:'12px', fontWeight:800, color:'var(--primary)' }}>
                              {plugin.name.charAt(0)}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ ...F, fontSize:'13px', fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{plugin.name}</p>
                              {plugin.version && <p style={{ ...M, fontSize:'10px', color:'var(--text-3)' }}>v{plugin.version}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && !error && !loading && (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-3)' }}>
              <Search size={48} style={{ margin:'0 auto 16px', display:'block', opacity:0.3 }} />
              <p style={{ ...F, fontSize:'16px', fontWeight:600, color:'var(--text-2)', marginBottom:'8px' }}>Enter a URL above to detect the theme</p>
              <p style={{ fontSize:'13px' }}>Works with any public WordPress website</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 0' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <p className="eyebrow" style={{ justifyContent:'center' }}>Need a Custom WordPress Site?</p>
          <h2 style={{ ...F, fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:800, letterSpacing:'-0.04em', color:'#fff', marginBottom:'16px' }}>
            We Build WordPress Sites That Convert
          </h2>
          <p style={{ fontSize:'16px', color:'var(--text-2)', maxWidth:'480px', margin:'0 auto 28px', lineHeight:1.8 }}>
            Like a theme you found? We can build a custom WordPress site inspired by it — or better.
          </p>
          <Link href="/contact" className="btn btn-primary btn-lg">Get Free Consultation <ArrowRight size={15} /></Link>
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </>
  )
}
