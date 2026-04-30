'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'

type Item = { 
  title: string; client: string; platform: string; result: string; resultLabel: string; quote: string; 
  image?: string; url?: string; slug?: string; cat?: string 
}

type Props = { eyebrow?: string; headline?: string; intro?: string; items?: Item[]; ctaLabel?: string; ctaHref?: string }

export default function PortfolioSection({ 
  eyebrow='Our Work', 
  headline='Success Stories That Speak for Themselves', 
  intro='', 
  items=[], 
  ctaLabel='Start a Project', 
  ctaHref='/contact' 
}: Props) {
  
  const safeItems: Item[] = Array.isArray(items) ? items : []
  
  const [dbItems, setDbItems] = useState<Item[]>([])
  const [filter, setFilter] = useState('all')
  const [hovered, setHovered] = useState<Item | null>(null)
  
  // Popup refs
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(undefined)
  const scrollIntRef = useRef<NodeJS.Timeout>(undefined)
  const tx = useRef(0)
  const ty = useRef(0)
  const cache = useRef<Record<string, string>>({})
  const [loadingImg, setLoadingImg] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Fetch complete DB portfolio
  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return
        const mapped = data.map((item: any) => {
          const result = item.results && item.results[0] ? item.results[0].value : ''
          const resultLabel = item.results && item.results[0] ? item.results[0].label : ''
          return {
            title: item.title,
            client: item.client,
            platform: item.category || 'other',
            cat: item.category || 'other',
            result,
            resultLabel,
            quote: item.quote || item.summary || '',
            image: item.image,
            url: item.clientUrl,
            slug: item.slug
          }
        })
        setDbItems(mapped)
      })
      .catch(console.error)
  }, [])

  // Track mouse
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // Animation loop
  useEffect(() => {
    if (!hovered) {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
      return
    }
    // initialize position if we just showed up
    if (tx.current === 0 && ty.current === 0) {
      tx.current = mousePos.current.x
      ty.current = mousePos.current.y
    }
    
    const loop = () => {
      tx.current += (mousePos.current.x - tx.current) * 0.1
      ty.current += (mousePos.current.y - ty.current) * 0.1
      
      const pw = 304, ph = 224, vw = window.innerWidth, vh = window.innerHeight
      let left = tx.current + 22
      let top = ty.current - ph - 12
      
      if (left + pw > vw - 8) left = tx.current - pw - 16
      if (top < 8) top = ty.current + 22
      if (top + ph > vh - 8) top = vh - ph - 8
      
      if (wrapRef.current) {
        wrapRef.current.style.left = Math.round(left) + 'px'
        wrapRef.current.style.top = Math.round(top) + 'px'
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [hovered])

  // Image load & scroll
  useEffect(() => {
    if (scrollIntRef.current) clearInterval(scrollIntRef.current)
    if (!hovered) return

    const url = hovered.url || ''
    const ssUrl = hovered.image || (url ? `https://image.thum.io/get/width/600/crop/1200/noanimate/${url}` : '')
    setImgError(false)

    if (!ssUrl) {
      setImgError(true)
      return
    }

    const startScroll = () => {
      if (scrollIntRef.current) clearInterval(scrollIntRef.current)
      let pos = 0, dir = 1, speed = 0.6
      const imgEl = imgRef.current
      if (!imgEl) return
      
      const imgNatH = imgEl.naturalHeight || 1200
      const displayW = 300
      const scale = displayW / (imgEl.naturalWidth || 600)
      const displayH = imgNatH * scale
      const visH = 192 // viewport height roughly
      const range = displayH - visH
      
      if (range <= 0) return
      
      let pauseFrames = 0
      scrollIntRef.current = setInterval(() => {
        if (pauseFrames > 0) { pauseFrames--; return }
        pos += speed * dir
        if (pos >= range) { pos = range; dir = -1; pauseFrames = 80 }
        if (pos <= 0) { pos = 0; dir = 1; pauseFrames = 80 }
        if (imgRef.current) imgRef.current.style.marginTop = `-${pos.toFixed(1)}px`
      }, 16)
    }

    if (cache.current[url]) {
      setLoadingImg(false)
      if (imgRef.current) {
        imgRef.current.src = cache.current[url]
        imgRef.current.style.marginTop = '0'
      }
      startScroll()
    } else {
      setLoadingImg(true)
      const tmpImg = new Image()
      tmpImg.onload = () => {
        cache.current[url] = ssUrl
        setLoadingImg(false)
        if (imgRef.current && hovered?.url === url) {
          imgRef.current.src = ssUrl
          imgRef.current.style.marginTop = '0'
          setTimeout(startScroll, 100)
        }
      }
      tmpImg.onerror = () => {
        setLoadingImg(false)
        setImgError(true)
      }
      tmpImg.src = ssUrl
    }

    return () => {
      if (scrollIntRef.current) clearInterval(scrollIntRef.current)
    }
  }, [hovered])

  const displayItems = dbItems.length > 0 ? dbItems : safeItems
  const displayCats = Array.from(new Set(displayItems.map(item => (item.cat || 'other').toLowerCase())))
  const filtered = filter === 'all' ? displayItems : displayItems.filter(p => (p.cat || '').toLowerCase() === filter)

  // Styles mapping to Ariosetech system
  const F = { fontFamily: 'var(--font-display)' } as const
  const B = { fontFamily: 'var(--font-body)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .ptag { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.22); color: rgba(255,255,255,0.7); }
        .ptag.woocommerce { background: rgba(155,109,255,.1); border: 1px solid rgba(155,109,255,.22); color: #b49bff; }
        .ptag.shopify { background: rgba(79,186,124,.08); border: 1px solid rgba(79,186,124,.22); color: #4fba7c; }
        .ptag.wordpress { background: rgba(79,110,247,.1); border: 1px solid rgba(79,110,247,.22); color: #6b8ff7; }
        .fb { padding: 7px 16px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.13); background: transparent; color: rgba(255,255,255,0.4); font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; font-weight: 600; }
        .fb.on, .fb:hover { border-color: rgba(118,108,255,.45); background: rgba(118,108,255,.12); color: var(--primary); }
        .pi { display: grid; grid-template-columns: 60px 1fr auto 36px; align-items: center; gap: 20px; padding: 24px 0; border-top: 1px solid var(--border); cursor: pointer; position: relative; transition: background .2s; text-decoration: none; }
        .pi:last-child { border-bottom: 1px solid var(--border); }
        .pi::before { content: ''; position: absolute; inset: 0 -16px; background: rgba(118,108,255,.03); opacity: 0; transition: opacity .2s; border-radius: 6px; }
        .pi:hover::before { opacity: 1; }
        .pnum { font-family: var(--font-mono); font-size: 12px; color: rgba(255,255,255,0.28); transition: color .2s; font-weight: 700; }
        .pi:hover .pnum { color: var(--primary); }
        .pname { font-family: var(--font-display); font-size: clamp(1.2rem, 2vw, 1.5rem); font-weight: 900; color: #fff; letter-spacing: -0.03em; transition: all .2s; margin-bottom: 7px; }
        .pi:hover .pname { background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .pdesc { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.55; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; max-width: 380px; transition: color .2s; }
        .pi:hover .pdesc { color: rgba(255,255,255,0.7); }
        .parr { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.13); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: rgba(255,255,255,0.4); transition: all .3s; transform: rotate(-45deg); font-weight: 600; }
        .pi:hover .parr { border-color: rgba(118,108,255,.4); background: rgba(118,108,255,.12); color: var(--primary); transform: rotate(0); }
        
        .spin { width: 24px; height: 24px; border: 2px solid rgba(118,108,255,.2); border-top-color: var(--primary); border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />

      {/* Grid */}
      <section id="projects" className="section section--dark" style={{ paddingTop: '80px' }}>
        <div className="container">
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <div>
              <p className="eyebrow" style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontWeight: 700 }}>
                <span style={{ opacity: 0.5 }}>—</span> {eyebrow}
              </p>
              <h2 style={{ ...F, fontSize:'clamp(2.4rem,4vw,3.5rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', color:'#fff', maxWidth:'700px' }}>
                {headline}
              </h2>
            </div>
            {intro && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '340px', lineHeight: 1.75, marginLeft: 'auto' }}>
                  {intro}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', paddingBottom: '32px', flexWrap: 'wrap' }}>
            <button className={`fb ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All Projects</button>
            {displayCats.map(c => (
              <button key={c} className={`fb ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
            {filtered.map((item, i) => {
              const itemUrl = item.slug ? `/portfolio/${item.slug}` : (item.url || '#')
              const catClass = (item.cat || 'other').toLowerCase()
              
              return (
                <Link key={i} href={itemUrl} className="pi" style={{ animationDelay: `${i * 0.05}s` }}
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
                      e.preventDefault()
                    }
                  }}
                >
                  <div className="pnum">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div className="pname">{item.title}</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span className={`ptag ${catClass}`} style={{ ...M, fontSize: '10px', padding: '3px 12px', borderRadius: '100px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {item.platform || catClass}
                      </span>
                    </div>
                    <div className="pdesc">{item.quote}</div>
                  </div>
                  
                  {/* Stats desktop only to match HTML layout cleanly */}
                  <div className="hidden md:flex" style={{ gap: '24px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ ...F, fontSize: '1.25rem', fontWeight: 900, background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{item.result}</div>
                      <div style={{ ...M, fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', fontWeight: 600 }}>{item.resultLabel}</div>
                    </div>
                  </div>
                  
                  <div className="parr">→</div>
                </Link>
              )
            })}
          </div>
          
          <div style={{ textAlign: 'center' }}>
             <Link href={ctaHref} className="btn btn-outline btn-md">{ctaLabel}</Link>
          </div>
        </div>
      </section>

      {/* POPUP */}
      <div ref={wrapRef} style={{
        position: 'fixed', width: '300px', height: '220px', borderRadius: '16px', overflow: 'hidden', pointerEvents: 'none', zIndex: 9999,
        opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(8px)',
        transition: 'opacity .22s cubic-bezier(.16,1,.3,1), transform .22s cubic-bezier(.16,1,.3,1)',
        border: '1px solid rgba(118,108,255,.35)', boxShadow: '0 32px 80px rgba(0,0,0,.85), 0 0 0 1px rgba(118,108,255,.1)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '28px', background: 'rgba(6,6,18,.98)', display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', zIndex: 3, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--grad)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
          <div style={{ ...M, fontSize: '9px', color: 'rgba(240,240,255,.3)', marginLeft: '8px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
            {hovered && hovered.url ? hovered.url.replace(/https?:\/\//, '') : 'Preview'}
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: '28px', left: 0, right: 0, bottom: 0, overflow: 'hidden', background: 'var(--bg-2)' }}>
          {loadingImg && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', zIndex: 4, background: 'var(--bg-2)' }}>
              <div className="spin" />
              <div style={{ ...M, fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>Loading preview...</div>
            </div>
          )}
          {imgError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 4, background: 'var(--bg-2)' }}>
              <div style={{ ...M, fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>Preview unavailable</div>
            </div>
          )}
          
          <img ref={imgRef} src="" alt="" draggable="false" style={{ width: '100%', display: 'block', position: 'absolute', top: 0, left: 0 }} />
          
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,8,.8) 0%, transparent 40%)', zIndex: 2, pointerEvents: 'none' }} />
          
          {hovered && (
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', zIndex: 3, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <div style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(6,6,18,.88)', border: '1px solid rgba(118,108,255,.25)', ...M, fontSize: '9px', fontWeight: 700, color: '#fff', backdropFilter: 'blur(8px)' }}>
                <span style={{ color: 'var(--primary)' }}>{hovered.result}</span> {hovered.resultLabel}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
