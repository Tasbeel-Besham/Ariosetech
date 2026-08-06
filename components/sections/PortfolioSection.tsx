'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from '@/components/ui/Icons'
import SectionHeading from '@/components/ui/SectionHeading'

type Item = {
  title: string; client: string; platform: string; result: string; resultLabel: string; quote: string;
  image?: string; screenshot?: string; url?: string; slug?: string; cat?: string
}

type Props = {
  headingTag?: string;
  eyebrow?: string; headline?: string; intro?: string; items?: Item[]; ctaLabel?: string; ctaHref?: string
}

/* ── Pan tuning ────────────────────────────────────────────────────
   Duration is derived from how far the image actually has to travel, at a
   constant speed. A 6000px page and a 1500px page therefore scroll at the same
   perceived rate instead of both taking a fixed 4 seconds — which made short
   screenshots crawl and long ones blur past.                                  */
const PAN_SPEED_PX_PER_SEC = 165   // felt rate of the downward pan
const MIN_PAN_MS           = 1800  // never snap, even on barely-tall images
const MAX_PAN_MS           = 16000 // long pages take their time rather than rush
const RETURN_MS            = 520   // return faster than the pan, but not a snap
const START_DELAY_MS       = 140   // hover intent — ignore a mouse passing over
const MIN_TRAVEL_PX        = 24    // below this there is nothing worth panning

/* Easing.
   The pan previously used cubic-bezier(0.4, 0, 0.25, 1). A symmetric ease of
   that shape peaks at roughly twice its average speed in the middle, so even a
   sensible average read as a whip through the centre of the image. Reading a
   page is a steady motion: this curve is close to linear with only soft ends,
   holding peak speed near ~1.2x average. The return keeps a normal ease-out —
   snapping back should feel like a release, not a scroll. */
const PAN_EASE    = 'cubic-bezier(0.25, 0.1, 0.75, 0.9)'
const RETURN_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

/**
 * Portfolio grid — a 3-column grid of project cards. Each card is a framed
 * screenshot on a tinted background with the category + title below.
 *
 * On hover, the full-page screenshot pans from the header all the way to the
 * footer inside the frame. The travel distance is measured from the image's
 * real intrinsic size once it loads, so it always lands exactly on the bottom
 * of the page — no guessing, and no dependence on container-query units.
 *
 * Images come from two separate fields, set per project in the builder:
 *   screenshot → the tall full-page capture that pans (preferred)
 *   image      → a normal cover thumbnail (used as fallback; sits still)
 */
function ProjectCard({ item, index }: { item: Item; index: number }) {
  const catClass = (item.cat || 'other').toLowerCase()
  const href = item.slug ? `/portfolio/${catClass}/${item.slug}` : (item.url || '#')

  // Prefer the tall screenshot; fall back to the cover image, which simply
  // fills the frame since there is nothing to scroll through.
  const shot = item.screenshot || item.image || ''

  const frameRef = useRef<HTMLDivElement>(null)
  const imgRef   = useRef<HTMLImageElement>(null)
  const delayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [isTall, setIsTall] = useState(false)
  const [pan, setPan]       = useState({ y: 0, ms: 0, ease: PAN_EASE })

  /** How far the image can travel inside the frame, and how long that takes. */
  const measure = useCallback(() => {
    const frame = frameRef.current
    const img   = imgRef.current
    if (!frame || !img || !img.naturalWidth || !img.naturalHeight) return { travel: 0, ms: 0 }

    // The image is rendered at 100% frame width, so its on-screen height is
    // proportional to its intrinsic aspect ratio.
    const renderedHeight = frame.clientWidth * (img.naturalHeight / img.naturalWidth)
    const travel = Math.max(0, Math.round(renderedHeight - frame.clientHeight))
    if (travel < MIN_TRAVEL_PX) return { travel: 0, ms: 0 }

    const ms = Math.min(MAX_PAN_MS, Math.max(MIN_PAN_MS, (travel / PAN_SPEED_PX_PER_SEC) * 1000))
    return { travel, ms }
  }, [])

  // Decide once the image loads whether it's a pannable full-page capture or a
  // normal cover that should just fill the frame.
  const handleLoad = useCallback(() => {
    setIsTall(measure().travel > 0)
  }, [measure])

  // Cached images can be complete before React attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete) handleLoad()
  }, [handleLoad])

  // Re-evaluate on resize: the grid drops from 3 to 2 to 1 column, which
  // changes frame width and therefore the rendered image height.
  useEffect(() => {
    const onResize = () => {
      setIsTall(measure().travel > 0)
      setPan({ y: 0, ms: 0, ease: PAN_EASE })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [measure])

  const start = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Brief delay so sweeping the cursor across the grid doesn't set every
    // card in motion at once.
    clearTimeout(delayRef.current)
    delayRef.current = setTimeout(() => {
      const { travel, ms } = measure()
      if (!travel) return
      setPan({ y: -travel, ms, ease: PAN_EASE })
    }, START_DELAY_MS)
  }

  const stop = () => {
    clearTimeout(delayRef.current)
    setPan(p => (p.y === 0 ? p : { y: 0, ms: RETURN_MS, ease: RETURN_EASE }))
  }

  // Don't leave a pending start running after the card unmounts (filtering the
  // grid does exactly that).
  useEffect(() => () => clearTimeout(delayRef.current), [])

  return (
    <Link
      href={href}
      className="pfc"
      style={{ animationDelay: `${index * 0.06}s` }}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      <div className="pfc-frame" ref={frameRef}>
        {shot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={shot}
            alt={`${item.title} — full page screenshot`}
            onLoad={handleLoad}
            className={`pfc-shot${isTall ? '' : ' pfc-shot--cover'}`}
            style={{
              transform: `translate3d(0, ${pan.y}px, 0)`,
              transitionDuration: `${pan.ms}ms`,
              transitionTimingFunction: pan.ease,
            }}
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="pfc-fallback"><span>{item.platform}</span></div>
        )}
        <div className="pfc-frame-overlay" />
        <span className="pfc-arrow"><ArrowRight size={18} /></span>
      </div>
      <div className="pfc-meta">
        <span className="pfc-cat">{catClass === 'other' ? 'Project' : catClass.toUpperCase()}</span>
        <h3 className="pfc-title">{item.title}</h3>
      </div>
    </Link>
  )
}

export default function PortfolioSection({
  eyebrow = 'Our Work',
  headline = 'Success Stories That Speak for Themselves',
  headingTag = 'h2',
  intro = '',
  items = [],
  ctaLabel = 'Start a Project',
  ctaHref = '/contact',
}: Props) {
  const safeItems: Item[] = Array.isArray(items) ? items : []
  const pathname = usePathname()
  const [dbItems, setDbItems] = useState<Item[]>([])

  const defaultFilter = pathname?.match(/^\/portfolio\/([^/]+)\/?$/) ? pathname.split('/')[2].toLowerCase() : 'all'
  const [filter, setFilter] = useState(defaultFilter)

  // Fetch only if the server did not already supply items. Pages now hydrate
  // this on the server (lib/builder/server-data.ts) so the projects appear in
  // the initial HTML; this fetch is the fallback for any path that doesn't.
  useEffect(() => {
    if (safeItems.length > 0) return
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return
        const mapped = data.map((item: Record<string, any>) => {
          const result = item.results?.[0]?.value || ''
          const resultLabel = item.results?.[0]?.label || ''
          return {
            title: item.title, client: item.client,
            platform: item.category || 'other', cat: item.category || 'other',
            result, resultLabel,
            quote: item.quote || item.summary || '',
            image: item.image, screenshot: item.screenshot,
            url: item.clientUrl, slug: item.slug,
          }
        })
        setDbItems(mapped)
      })
      .catch(console.error)
  }, [safeItems.length])

  // Explicit page picks win; otherwise fall back to the full DB collection.
  const displayItems = safeItems.length > 0 ? safeItems : dbItems
  const displayCats = Array.from(new Set(displayItems.map(item => (item.cat || 'other').toLowerCase())))
  const filtered = filter === 'all' ? displayItems : displayItems.filter(p => (p.cat || '').toLowerCase() === filter)

  return (
    <section id="projects" className="section section--dark pf-grid-section">
      <div className="container">
        {/* Heading */}
        <div className="pf-grid-head">
          <p className="eyebrow font-mono text-primary uppercase tracking-widest font-bold text-10 mb-4">{eyebrow}</p>
          <SectionHeading as={headingTag} className="pf-grid-headline">{headline}</SectionHeading>
          {intro && <p className="pf-grid-intro">{intro}</p>}
        </div>

        {/* Filters */}
        {displayCats.length > 1 && (
          <div className="pf-filters">
            <button className={`pf-fb ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</button>
            {displayCats.map(c => (
              <button key={c} className={`pf-fb ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-gray-3 text-center py-12">No projects to show yet.</p>
        ) : (
          <div className="pf-grid">
            {filtered.map((item, i) => (
              <ProjectCard key={`${item.slug || item.title}-${i}`} item={item} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        {ctaLabel && (
          <div className="pf-grid-cta">
            <Link href={ctaHref} className="btn btn-primary btn-lg">{ctaLabel} <ArrowRight size={16} /></Link>
          </div>
        )}
      </div>
    </section>
  )
}
