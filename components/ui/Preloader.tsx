'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, stagger } from 'framer-motion'

/* ─── Preloader ─────────────────────────────────────────────────
   An opaque overlay covering the viewport delays Largest Contentful Paint by
   exactly as long as it stays up: the hero is in the DOM the whole time but
   LCP only counts pixels the user can actually see. The old timings held the
   curtain for ~1900ms, which on top of server response time put LCP past
   Google's 2500ms "good" threshold on every page, for every visitor.

   Three changes keep the brand moment without failing Core Web Vitals:
     1. Once per browser session. Reloads and direct entries to other pages
        within the same session skip it entirely.
     2. Shorter — fully gone by ~1000ms instead of ~1900ms.
     3. Skipped for reduced-motion and data-saver users.

   Set ENABLED to false to remove it entirely.
──────────────────────────────────────────────────────────────── */

const ENABLED = true
const SESSION_KEY = 'ats:preloader-shown'

const BRAND   = 'ARIOSETECH'
const TAGLINE = 'Consider It Solved'
const DURATION    = 700   // ms for counter to reach 100
const SLIDE_DELAY = 600   // ms before curtain exits
const EXIT_MS     = 400   // curtain exit animation

/** Should this visit see the overlay at all? Browser-only. */
function shouldSkip(): boolean {
  if (!ENABLED) return true
  if (typeof window === 'undefined') return false
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
    // Data-saver users have explicitly asked for less. Non-standard API.
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return true
  } catch {
    // sessionStorage can throw in private mode — fall through and show it.
  }
  return false
}

export default function Preloader() {
  const [count, setCount] = useState(0)
  const [exit,  setExit]  = useState(false)
  const [gone,  setGone]  = useState(false)
  const [letterScope, animateLetters] = useAnimate()
  const rafRef = useRef<number>(0)

  /* ── Session / preference gate ──
     useLayoutEffect so the decision lands in the same commit as hydration,
     before the browser paints the hydrated tree. On a repeat visit the overlay
     is removed without a visible frame. */
  useLayoutEffect(() => {
    if (shouldSkip()) {
      setGone(true)
      return
    }
    try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* private mode */ }
  }, [])

  /* ── Count 0 → 100 ── */
  useEffect(() => {
    if (gone) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1)
      setCount(Math.round(p * 100))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [gone])

  /* ── Animate brand letters in ── */
  useEffect(() => {
    if (gone || !letterScope.current) return
    animateLetters('span', { opacity: [0, 1], y: ['100%', '0%'] }, {
      duration: 0.05,
      delay: stagger(0.03, { startDelay: 0.15 }),
      ease: 'easeOut',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gone])

  /* ── Trigger exit ── */
  useEffect(() => {
    if (gone) return
    const t1 = setTimeout(() => setExit(true), SLIDE_DELAY)
    const t2 = setTimeout(() => setGone(true), SLIDE_DELAY + EXIT_MS)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [gone])

  if (gone) return null

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000 }}
          // aria-hidden + inert: the overlay is decorative, and without this a
          // screen reader announces "Loading 0%" ahead of the real content.
          aria-hidden="true"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07070f] pointer-events-none"
        >

          {/* ── Content (centered, sits above curtain seam) ── */}
          <div className="relative z-10 flex flex-col items-center select-none">
            {/* Counter */}
            <div className="font-display font-black leading-none text-center w-full tabular-nums tracking-tighter text-[clamp(4rem,13vw,11rem)] bg-[linear-gradient(135deg,#a78bfa_0%,#766cff_40%,#60a5fa_100%)] bg-clip-text text-transparent mb-[0.05em] pr-[0.08em]">
              {count}
            </div>

            {/* Brand name with stagger reveal */}
            <div
              ref={letterScope}
              className="font-display font-black text-white flex overflow-hidden tracking-[0.28em] text-[clamp(1.1rem,3.5vw,2.2rem)] gap-[0.04em]"
            >
              {BRAND.split('').map((ch, i) => (
                <span key={i} className="inline-block opacity-0">
                  {ch}
                </span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="font-mono text-white/30 uppercase tracking-[0.22em] mt-[14px] text-[clamp(9px,1.2vw,11px)]"
            >
              {TAGLINE}
            </motion.p>
          </div>

          {/* ── Progress bar (bottom) ── */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
            <motion.div
              className="h-full origin-left bg-[linear-gradient(90deg,#766cff,#a78bfa,#60a5fa)]"
              style={{ width: `${count}%` }}
            />
          </div>

          {/* ── Percentage label (bottom right) ── */}
          <div className="absolute bottom-5 right-7 font-mono text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] z-20">
            Loading {count}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
