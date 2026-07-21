'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  
  const pathname = usePathname()
  const [dbItems, setDbItems] = useState<Item[]>([])
  
  // Set default filter if pathname is /portfolio/[category]
  const defaultFilter = pathname?.match(/^\/portfolio\/([^/]+)\/?$/) ? pathname.split('/')[2].toLowerCase() : 'all'
  const [filter, setFilter] = useState(defaultFilter)
  
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
      let pos = 0, dir = 1
      const speed = 0.6
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

  // Priority: if this section was given explicit items (e.g. a hand-picked set
  // on an industry page), always use those. Only fall back to the full DB
  // collection when the section left its items empty (the main /portfolio page).
  const displayItems = safeItems.length > 0 ? safeItems : dbItems
  const displayCats = Array.from(new Set(displayItems.map(item => (item.cat || 'other').toLowerCase())))
  const filtered = filter === 'all' ? displayItems : displayItems.filter(p => (p.cat || '').toLowerCase() === filter)

  // Styles mapping to Ariosetech system
  const F = { fontFamily: 'var(--font-display)' } as const
  const B = { fontFamily: 'var(--font-body)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .ptag { background: rgba(var(--ink-rgb),.08); border: 1px solid rgba(var(--ink-rgb),.22); color: rgba(var(--ink-rgb),0.7); }
        .ptag.woocommerce { background: rgba(155,109,255,.1); border: 1px solid rgba(155,109,255,.22); color: #b49bff; }
        .ptag.shopify { background: rgba(79,186,124,.08); border: 1px solid rgba(79,186,124,.22); color: #4fba7c; }
        .ptag.wordpress { background: rgba(79,110,247,.1); border: 1px solid rgba(79,110,247,.22); color: #6b8ff7; }
        .fb { padding: 7px 16px; border-radius: 100px; border: 1px solid rgba(var(--ink-rgb),0.13); background: transparent; color: rgba(var(--ink-rgb),0.4); font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; font-weight: 600; }
        .fb.on, .fb:hover { border-color: rgba(var(--primary-rgb),.45); background: rgba(var(--primary-rgb),.12); color: var(--primary); }
        .pi { display: grid; grid-template-columns: 60px 1fr auto 36px; align-items: center; gap: 20px; padding: 24px 0; border-top: 1px solid var(--border); cursor: pointer; position: relative; transition: background .2s; text-decoration: none; }
        .pi:last-child { border-bottom: 1px solid var(--border); }
        .pi::before { content: ''; position: absolute; inset: 0 -16px; background: rgba(var(--primary-rgb),.03); opacity: 0; transition: opacity .2s; border-radius: 6px; }
        .pi:hover::before { opacity: 1; }
        .pnum { font-family: var(--font-mono); font-size: 12px; color: rgba(var(--ink-rgb),0.28); transition: color .2s; font-weight: 700; }
        .pi:hover .pnum { color: var(--primary); }
        .pname { font-family: var(--font-display); font-size: clamp(1.2rem, 2vw, 1.5rem); font-weight: 900; color: var(--heading); letter-spacing: -0.03em; transition: all .2s; margin-bottom: 7px; }
        .pi:hover .pname { background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .pdesc { font-size: 14px; color: rgba(var(--ink-rgb),0.4); line-height: 1.55; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; max-width: 380px; transition: color .2s; }
        .pi:hover .pdesc { color: rgba(var(--ink-rgb),0.7); }
        .parr { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(var(--ink-rgb),0.13); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: rgba(var(--ink-rgb),0.4); transition: all .3s; transform: rotate(-45deg); font-weight: 600; }
        .pi:hover .parr { border-color: rgba(var(--primary-rgb),.4); background: rgba(var(--primary-rgb),.12); color: var(--primary); transform: rotate(0); }
        
        .spin { width: 24px; height: 24px; border: 2px solid rgba(var(--primary-rgb),.2); border-top-color: var(--primary); border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .pi { grid-template-columns: 40px 1fr 36px; gap: 12px; padding: 20px 0; }
          .pnum { font-size: 11px; }
          .pname { fontSize: 1.15rem; }
          .pdesc { -webkit-line-clamp: 2; max-width: 100%; font-size: 13px; }
          .parr { width: 30px; height: 30px; transform: rotate(0); }
          .portfolio-popup { display: none !important; }
        }
      `}} />

      {/* Grid */}
      <section id="projects" className="section section--dark pf-section">
        <div className="container">
          
          <div className="flex items-end justify-between gap-20 flex-wrap mb-40">
            <div>
              <p className="eyebrow font-mono text-primary uppercase tracking-widest flex items-center gap-8 mb-14 font-bold text-10">
                <span className="opacity-50"> - </span> {eyebrow}
              </p>
              <h2 className="font-display font-extrabold leading-none tracking-tighter text-white max-w-[700px] pf-headline">
                {headline}
              </h2>
            </div>
            {intro && (
              <div className="text-right">
                <p className="text-base text-gray-2 max-w-[340px] leading-relaxed ml-auto">
                  {intro}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-10 pb-[32px] flex-wrap">
            <button className={`fb ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All Projects</button>
            {displayCats.map(c => (
              <button key={c} className={`fb ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-col pb-[40px]">
            {filtered.map((item, i) => {
              const catClass = (item.cat || 'other').toLowerCase()
              const itemUrl = item.slug ? `/portfolio/${catClass}/${item.slug}` : (item.url || '#')
              
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
                    <div className="flex gap-6 flex-wrap mb-8 items-center">
                      <span className={`ptag ${catClass} font-mono px-[12px] py-[3px] rounded-full font-bold uppercase tracking-widest text-10`}>
                        {item.platform || catClass}
                      </span>
                      {/* Result stat inline on mobile (hidden on desktop, which has its own column) */}
                      {item.result && (
                        <span className="md:hidden font-mono text-10 font-bold uppercase tracking-wider">
                          <span className="text-gradient font-display font-black">{item.result}</span>
                          <span className="text-gray-3 ml-1.5">{item.resultLabel}</span>
                        </span>
                      )}
                    </div>
                    <div className="pdesc">{item.quote}</div>
                  </div>
                  
                  {/* Stats desktop only to match HTML layout cleanly */}
                  <div className="hidden md:flex shrink-0 gap-24">
                    <div className="text-right">
                      <div className="font-display font-black leading-none text-gradient pf-result">{item.result}</div>
                      <div className="font-mono text-gray-3 uppercase tracking-wider mt-4 font-semibold text-9">{item.resultLabel}</div>
                    </div>
                  </div>
                  
                  <div className="parr">→</div>
                </Link>
              )
            })}
          </div>
          
          <div className="text-center">
             <Link href={ctaHref} className="btn btn-outline btn-md">{ctaLabel}</Link>
          </div>
        </div>
      </section>

      {/* POPUP */}
      <div ref={wrapRef} className={`portfolio-popup fixed w-[300px] h-[220px] rounded-2xl overflow-hidden pointer-events-none z-[9999]${hovered ? ' visible' : ''}`}>
        <div className="absolute top-0 left-0 right-0 h-[28px] flex items-center gap-6 px-[12px] z-[3] pf-popup-bar">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-grad" />
          <div className="w-[8px] h-[8px] rounded-full dot-red" />
          <div className="w-[8px] h-[8px] rounded-full dot-yellow" />
          <div className="w-[8px] h-[8px] rounded-full dot-green" />
          <div className="font-mono ml-[8px] flex-1 overflow-hidden whitespace-nowrap text-ellipsis font-semibold pf-popup-url">
            {hovered && hovered.url ? hovered.url.replace(/https?:\/\//, '') : 'Preview'}
          </div>
        </div>
        
        <div className="absolute top-[28px] left-0 right-0 bottom-0 overflow-hidden bg-subtle-2">
          {loadingImg && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 z-[4] bg-subtle-2">
              <div className="spin" />
              <div className="font-mono tracking-widest pf-popup-loading">Loading preview...</div>
            </div>
          )}
          {imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-[4] bg-subtle-2">
              <div className="font-mono tracking-widest pf-popup-error">Preview unavailable</div>
            </div>
          )}
          
          <img ref={imgRef} src="" alt="" draggable="false" className="w-full block absolute top-0 left-0" />
          
          <div className="absolute inset-0 z-[2] pointer-events-none pf-popup-shade" />
          
          {hovered && (
            <div className="absolute bottom-[10px] left-[10px] right-[10px] z-[3] flex gap-6 flex-wrap">
              <div className="font-mono font-bold text-white px-[10px] py-[4px] rounded-md backdrop-blur-sm pf-popup-badge">
                <span className="text-primary">{hovered.result}</span> {hovered.resultLabel}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
