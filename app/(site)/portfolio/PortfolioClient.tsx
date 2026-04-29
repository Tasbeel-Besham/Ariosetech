'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'

const PROJECTS = [
  { num: '01', cat: 'woocommerce', url: 'https://thekapra.com', name: 'The Kapra', tags: [{ lbl: 'WooCommerce', cls: 'twoo' }, { lbl: '★ Featured', cls: 'tfeat' }], desc: 'Premium Pakistani fashion brand with custom product configurator and complex inventory management.', s1: '+300%', l1: 'Revenue', s2: '4.2%', l2: 'Conversion' },
  { num: '02', cat: 'woocommerce', url: 'https://drscents.com', name: 'Dr. Scents', tags: [{ lbl: 'WooCommerce', cls: 'twoo' }, { lbl: '★ Featured', cls: 'tfeat' }], desc: 'International luxury fragrance brand launched across 32 countries with multi-site WooCommerce.', s1: '32', l1: 'Countries', s2: '4mo', l2: 'Launch' },
  { num: '03', cat: 'shopify', url: 'https://wyoxsports.com', name: 'WYOX Sports', tags: [{ lbl: 'Shopify', cls: 'tshop' }, { lbl: '★ Featured', cls: 'tfeat' }], desc: 'USA-based sports equipment brand with B2B wholesale portal and custom product builder.', s1: '+250%', l1: 'Intl Sales', s2: '+150%', l2: 'B2B Orders' },
  { num: '04', cat: 'shopify', url: 'https://genovie.com', name: 'Genovie', tags: [{ lbl: 'Shopify', cls: 'tshop' }], desc: 'Premium skincare brand with AI-powered quiz converting at 38%.', s1: '38%', l1: 'Quiz Conv.', s2: '+85%', l2: 'Revenue' },
  { num: '05', cat: 'woocommerce', url: 'https://geomagworld.com', name: 'GeoMag World', tags: [{ lbl: 'WooCommerce', cls: 'twoo' }], desc: 'Global educational toy brand with 15 languages and multi-currency across 30+ markets.', s1: '15', l1: 'Languages', s2: '30+', l2: 'Markets' },
  { num: '06', cat: 'shopify', url: 'https://janya.pk', name: 'Janya.pk', tags: [{ lbl: 'Shopify', cls: 'tshop' }], desc: 'Pakistani fashion marketplace with 50+ vendors and JazzCash/EasyPaisa integration.', s1: '50+', l1: 'Vendors', s2: '2k+', l2: 'Orders/mo' },
  { num: '07', cat: 'wordpress', url: 'https://snapglammedspa.com', name: 'Snap Glammed Spa', tags: [{ lbl: 'WordPress', cls: 'twp' }], desc: 'Luxury spa with online booking, gift cards, and client loyalty program.', s1: '+400%', l1: 'Bookings', s2: '+200%', l2: 'Gift Cards' },
  { num: '08', cat: 'wordpress', url: 'https://ctvpromo.com', name: 'CTV Promo', tags: [{ lbl: 'WordPress', cls: 'twp' }], desc: 'Promotional products company with custom quote system and HubSpot CRM integration.', s1: '-80%', l1: 'Time Saved', s2: '+120%', l2: 'Lead Quality' },
]

export default function PortfolioClient() {
  const [filter, setFilter] = useState('all')
  const [hovered, setHovered] = useState<any>(null)
  
  // Popup refs
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>()
  const scrollIntRef = useRef<NodeJS.Timeout>()
  const tx = useRef(0)
  const ty = useRef(0)
  const cache = useRef<Record<string, string>>({})
  const [loadingImg, setLoadingImg] = useState(false)
  const [imgError, setImgError] = useState(false)

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
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [hovered])

  // Image load & scroll
  useEffect(() => {
    if (scrollIntRef.current) clearInterval(scrollIntRef.current)
    if (!hovered) return

    const url = hovered.url
    const ssUrl = `https://image.thum.io/get/width/600/crop/1200/noanimate/${url}`
    setImgError(false)

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

  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === filter)

  // Styles mapping to Ariosetech system
  const F = { fontFamily: 'var(--font-display)' } as const
  const B = { fontFamily: 'var(--font-body)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .ptag.twoo { background: rgba(155,109,255,.1); border: 1px solid rgba(155,109,255,.22); color: #b49bff; }
        .ptag.tshop { background: rgba(79,186,124,.08); border: 1px solid rgba(79,186,124,.22); color: #4fba7c; }
        .ptag.twp { background: rgba(79,110,247,.1); border: 1px solid rgba(79,110,247,.22); color: #6b8ff7; }
        .ptag.tfeat { background: rgba(251,191,36,.08); border: 1px solid rgba(251,191,36,.22); color: var(--amber); }
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

      {/* Hero */}
      <section className="section" style={{ paddingTop:'120px', paddingBottom:'40px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 20% 60%, rgba(118,108,255,0.10) 0%, transparent 60%)', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow sr" style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontWeight: 700 }}>
                <span style={{ opacity: 0.5 }}>—</span> Our Work
              </p>
              <h1 className="sr" style={{ ...F, fontSize:'clamp(2.4rem,4.5vw,4rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', color:'#fff', maxWidth:'700px' }}>
                Success Stories That<br/>
                <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Speak for Themselves</span>
              </h1>
            </div>
            <div className="head-r sr" style={{ textAlign: 'right', animationDelay: '0.1s' }}>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '340px', lineHeight: 1.75, marginBottom: '16px', marginLeft: 'auto' }}>
                8 projects across fashion, beauty, sports & more. Hover to preview. Click to visit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section id="projects" className="section section--dark" style={{ paddingTop: '20px' }}>
        <div className="container">
          
          <div style={{ display: 'flex', gap: '10px', paddingBottom: '32px', flexWrap: 'wrap' }} className="sr">
            <button className={`fb ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All Projects</button>
            <button className={`fb ${filter === 'woocommerce' ? 'on' : ''}`} onClick={() => setFilter('woocommerce')}>WooCommerce</button>
            <button className={`fb ${filter === 'shopify' ? 'on' : ''}`} onClick={() => setFilter('shopify')}>Shopify</button>
            <button className={`fb ${filter === 'wordpress' ? 'on' : ''}`} onClick={() => setFilter('wordpress')}>WordPress</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
            {filtered.map((item, i) => (
              <a key={item.num} href={item.url} target="_blank" rel="noopener noreferrer" className="pi sr" style={{ animationDelay: `${i * 0.05}s` }}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="pnum">{item.num}</div>
                <div>
                  <div className="pname">{item.name}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {item.tags.map(t => (
                      <span key={t.lbl} className={`ptag ${t.cls}`} style={{ ...M, fontSize: '10px', padding: '3px 12px', borderRadius: '100px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {t.lbl}
                      </span>
                    ))}
                  </div>
                  <div className="pdesc">{item.desc}</div>
                </div>
                
                {/* Stats desktop only to match HTML layout cleanly */}
                <div className="hidden md:flex" style={{ gap: '24px', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...F, fontSize: '1.25rem', fontWeight: 900, background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{item.s1}</div>
                    <div style={{ ...M, fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', fontWeight: 600 }}>{item.l1}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...F, fontSize: '1.25rem', fontWeight: 900, background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{item.s2}</div>
                    <div style={{ ...M, fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', fontWeight: 600 }}>{item.l2}</div>
                  </div>
                </div>
                
                <div className="parr">→</div>
              </a>
            ))}
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
            {hovered ? hovered.url.replace(/https?:\/\//, '') : ''}
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
                <span style={{ color: 'var(--primary)' }}>{hovered.s1}</span> {hovered.l1}
              </div>
              <div style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(6,6,18,.88)', border: '1px solid rgba(118,108,255,.25)', ...M, fontSize: '9px', fontWeight: 700, color: '#fff', backdropFilter: 'blur(8px)' }}>
                <span style={{ color: 'var(--primary)' }}>{hovered.s2}</span> {hovered.l2}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section className="section" style={{ background:'var(--bg-2)', position:'relative', overflow:'hidden', borderTop: '1px solid var(--border)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(118,108,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <p className="eyebrow sr" style={{ justifyContent:'center', ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '14px', display: 'flex', gap: '8px' }}>
            <span style={{ opacity: 0.5 }}>—</span> Start a Project <span style={{ opacity: 0.5 }}>—</span>
          </p>
          <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, letterSpacing:'-0.03em', color:'#fff', marginBottom:'24px' }}>
            Ready to be our next success story?
          </h2>
          <div className="sr" style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Start a Project <ArrowRight size={16} /></Link>
            <Link href="/contact" className="btn btn-outline btn-lg">Get Free Quote</Link>
          </div>
        </div>
      </section>
    </>
  )
}
