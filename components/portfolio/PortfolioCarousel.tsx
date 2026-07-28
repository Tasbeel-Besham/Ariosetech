'use client'
import { useState, useRef } from 'react'
import { ArrowLeft, ArrowRight } from '@/components/ui/Icons'

/**
 * A gallery carousel for a case-study page. Shows the project's screenshots as
 * horizontally-scrolling slides with prev/next controls and dot indicators.
 * Scroll-snap keeps slides aligned; swipe works natively on touch devices.
 */
export default function PortfolioCarousel({ images, title }: { images: string[]; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  if (!images || images.length === 0) return null

  const scrollTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(i, images.length - 1))
    const slide = track.children[clamped] as HTMLElement | undefined
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' })
      setActive(clamped)
    }
  }

  // Keep the active dot in sync as the user swipes/scrolls.
  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const center = track.scrollLeft + track.clientWidth / 2
    let closest = 0
    let min = Infinity
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement
      const c = el.offsetLeft - track.offsetLeft + el.clientWidth / 2
      const d = Math.abs(c - center)
      if (d < min) { min = d; closest = i }
    })
    setActive(closest)
  }

  return (
    <section className="pd-carousel-section">
      <div className="container">
        <p className="pd-label text-center mb-3">Project Gallery</p>
        <h2 className="pd-carousel-title">A closer look at {title}</h2>

        <div className="pd-carousel">
          <div className="pd-carousel-track" ref={trackRef} onScroll={onScroll}>
            {images.map((src, i) => (
              <div key={i} className="pd-carousel-slide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${title} screenshot ${i + 1}`} className="pd-carousel-img" loading="lazy" />
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button className="pd-carousel-nav pd-carousel-prev" onClick={() => scrollTo(active - 1)} aria-label="Previous">
                <ArrowLeft size={18} />
              </button>
              <button className="pd-carousel-nav pd-carousel-next" onClick={() => scrollTo(active + 1)} aria-label="Next">
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="pd-carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`pd-carousel-dot ${active === i ? 'is-active' : ''}`}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
