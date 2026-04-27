'use client'
import { useState } from 'react'
import Link from 'next/link'

const F = { fontFamily:'var(--font-display)' } as const
const M = { fontFamily:'var(--font-mono)'    } as const

/* ── Inline SVGs ── */
const SearchSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)
const ArrowRight = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const Check = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ExternalLink = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)
const AlertCircle = ({ size = 18, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const Loader2 = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation:'spin 0.7s linear infinite' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
)
const ShoppingBag = ({ size = 15, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

type ShopifyResult = {
  isShopify: boolean
  theme?: {
    name: string
    id?: number
    version?: string
    themeStore?: boolean
    themeUrl?: string
    screenshot?: string
    author?: string
    isPremium?: boolean
    price?: string
  }
  shop?: {
    name?: string
    domain?: string
    currency?: string
    country?: string
    platform?: string
  }
  apps?: { name: string }[]
  error?: string
}

export default function ShopifyDetectorClient() {
  const [url, setUrl]         = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<ShopifyResult | null>(null)
  const [error, setError]     = useState('')

  const detect = async () => {
    const input = url.trim()
    if (!input) return
    const normalized = input.startsWith('http') ? input : `https://${input}`
    setLoading(true); setResult(null); setError('')
    try {
      const res = await fetch('/api/tools/detect-shopify', {
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
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(118,108,255,0.08) 0%, transparent 60%)', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'4px 14px', borderRadius:'var(--r-f)', background:'rgba(118,108,255,0.07)', border:'1px solid rgba(118,108,255,0.2)', marginBottom:'20px' }}>
            <span style={{ ...M, fontSize:'10px', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:700 }}>Free Tool</span>
          </div>
          <h1 style={{ ...F, fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.04em', color:'#fff', marginBottom:'16px' }}>
            Shopify Theme Detector
          </h1>
          <p style={{ fontSize:'17px', color:'var(--text-2)', lineHeight:1.8, maxWidth:'560px', marginBottom:'36px' }}>
            Instantly find the Shopify theme powering any online store — free, fast, and accurate.
          </p>

          {/* Search */}
          <div style={{ display:'flex', gap:'10px', maxWidth:'640px', marginBottom:'16px' }}>
            <div style={{ display:'flex', flex:1, position:'relative' }}>
              <span style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none', display:'flex' }}>
                <SearchSVG />
              </span>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && detect()}
                placeholder="Enter Shopify store URL (e.g. mystore.com)"
                style={{ ...inp, paddingLeft:'42px', width:'100%', boxSizing:'border-box' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(118,108,255,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <button onClick={detect} disabled={loading || !url.trim()} className="btn btn-primary btn-lg" style={{ flexShrink:0 }}>
              {loading ? <Loader2 size={16} /> : <ShoppingBag size={15} />}
              {loading ? 'Detecting…' : 'Detect Theme'}
            </button>
          </div>
          <p style={{ ...M, fontSize:'11px', color:'var(--text-3)' }}>Works on any public Shopify store</p>
        </div>
      </section>

      {/* Result */}
      <section style={{ padding:'60px 0', borderBottom:'1px solid var(--border)', minHeight:'300px' }}>
        <div className="container">

          {error && (
            <div style={{ display:'flex', gap:'12px', padding:'16px 20px', background:'rgba(255,77,109,0.08)', border:'1px solid rgba(255,77,109,0.25)', borderRadius:'14px', marginBottom:'24px' }}>
              <AlertCircle size={18} style={{ color:'var(--red)', flexShrink:0, marginTop:'1px' } as React.CSSProperties} />
              <div>
                <p style={{ ...F, fontSize:'14px', fontWeight:600, color:'var(--red)', marginBottom:'4px' }}>Detection Failed</p>
                <p style={{ fontSize:'13px', color:'var(--text-2)' }}>{error}</p>
              </div>
            </div>
          )}

          {result && !result.isShopify && (
            <div style={{ padding:'40px', textAlign:'center', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'20px' }}>
              <AlertCircle size={36} style={{ color:'var(--amber)', margin:'0 auto 14px', display:'block' } as React.CSSProperties} />
              <p style={{ ...F, fontSize:'18px', fontWeight:700, color:'#fff', marginBottom:'8px' }}>Not a Shopify store</p>
              <p style={{ fontSize:'14px', color:'var(--text-2)' }}>This website doesn&apos;t appear to be powered by Shopify.</p>
            </div>
          )}

          {result?.isShopify && (
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', borderRadius:'var(--r-f)', background:'rgba(118,108,255,0.08)', border:'1px solid rgba(118,108,255,0.22)', marginBottom:'28px' }}>
                <span style={{ color:'var(--primary)', display:'flex' }}><Check size={13} /></span>
                <span style={{ ...M, fontSize:'11px', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700 }}>Shopify Store Confirmed</span>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                {/* Theme */}
                {result.theme && (
                  <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'20px', overflow:'hidden' }}>
                    <div style={{ height:'3px', background:'var(--grad)' }} />
                    <div style={{ padding:'24px' }}>
                      <p style={{ ...M, fontSize:'10px', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:700, marginBottom:'16px' }}>Active Theme</p>

                      {result.theme.screenshot && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.theme.screenshot} alt={result.theme.name} style={{ width:'100%', height:'160px', objectFit:'cover', borderRadius:'10px', marginBottom:'16px', border:'1px solid var(--border)' }} />
                      )}

                      <h2 style={{ ...F, fontSize:'22px', fontWeight:800, color:'#fff', marginBottom:'8px' }}>{result.theme.name}</h2>

                      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px' }}>
                        {result.theme.isPremium && (
                          <span style={{ ...M, fontSize:'9px', color:'var(--amber)', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)', padding:'3px 10px', borderRadius:'var(--r-f)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}>Premium</span>
                        )}
                        {result.theme.themeStore && (
                          <span style={{ ...M, fontSize:'9px', color:'var(--primary)', background:'rgba(118,108,255,0.08)', border:'1px solid rgba(118,108,255,0.2)', padding:'3px 10px', borderRadius:'var(--r-f)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}>Shopify Theme Store</span>
                        )}
                      </div>

                      {result.theme.author    && <p style={{ ...M, fontSize:'11px', color:'var(--text-3)', marginBottom:'4px' }}>Author: {result.theme.author}</p>}
                      {result.theme.version   && <p style={{ ...M, fontSize:'11px', color:'var(--text-3)', marginBottom:'4px' }}>Version: {result.theme.version}</p>}
                      {result.theme.price     && <p style={{ ...M, fontSize:'11px', color:'var(--text-3)', marginBottom:'4px' }}>Price: {result.theme.price}</p>}

                      {result.theme.themeUrl && (
                        <a href={result.theme.themeUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'14px', fontSize:'13px', color:'var(--primary)', fontWeight:600 }}>
                          View in Theme Store <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Store info */}
                {result.shop && (
                  <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'20px', overflow:'hidden' }}>
                    <div style={{ height:'3px', background:'var(--grad)' }} />
                    <div style={{ padding:'24px' }}>
                      <p style={{ ...M, fontSize:'10px', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:700, marginBottom:'16px' }}>Store Information</p>
                      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                        {[
                          { label:'Store Name',   value:result.shop.name },
                          { label:'Domain',       value:result.shop.domain },
                          { label:'Currency',     value:result.shop.currency },
                          { label:'Country',      value:result.shop.country },
                          { label:'Platform',     value:result.shop.platform },
                        ].filter(r => r.value).map(({ label, value }) => (
                          <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 14px', background:'var(--bg-3)', borderRadius:'10px', border:'1px solid var(--border)' }}>
                            <span style={{ ...M, fontSize:'11px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</span>
                            <span style={{ ...F, fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!result && !error && !loading && (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-3)' }}>
              <ShoppingBag size={48} style={{ margin:'0 auto 16px', display:'block', opacity:0.3 }} />
              <p style={{ ...F, fontSize:'16px', fontWeight:600, color:'var(--text-2)', marginBottom:'8px' }}>Enter a Shopify store URL above</p>
              <p style={{ fontSize:'13px' }}>We&apos;ll detect the theme and store details instantly</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 0' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <p className="eyebrow" style={{ justifyContent:'center' }}>Need a Custom Shopify Store?</p>
          <h2 style={{ ...F, fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:800, letterSpacing:'-0.04em', color:'#fff', marginBottom:'16px' }}>
            We Build Shopify Stores That Scale
          </h2>
          <p style={{ fontSize:'16px', color:'var(--text-2)', maxWidth:'480px', margin:'0 auto 28px', lineHeight:1.8 }}>
            Like a theme you found? We can build a custom Shopify store inspired by it — or even better.
          </p>
          <Link href="/contact" className="btn btn-primary btn-lg">Get Free Shopify Consultation <ArrowRight size={15} /></Link>
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </>
  )
}
