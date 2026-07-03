'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, stagger } from 'framer-motion'

/* ─── Preloader ─────────────────────────────────────────────────
   Sequence:
   0 ms  →  overlay appears, counter starts (0 → 100)
   1800ms →  counter done, brand letters fully visible
   2100ms →  two curtain panels slide up & exit
   2700ms →  component unmounts
────────────────────────────────────────────────────────────────*/

const BRAND   = 'ARIOSETECH'
const TAGLINE = 'Consider It Solved'
const DURATION = 1800          // ms for counter to reach 100
const SLIDE_DELAY = 2100       // ms before curtain exits

export default function Preloader() {
  const [count, setCount]   = useState(0)
  const [exit,  setExit]    = useState(false)
  const [gone,  setGone]    = useState(false)
  const [letterScope, animateLetters] = useAnimate()
  const rafRef = useRef<number>(0)

  /* ── Count 0 → 100 ── */
  useEffect(() => {
    const start = performance.now()
    const tick  = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1)
      setCount(Math.round(p * 100))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* ── Animate brand letters in ── */
  useEffect(() => {
    if (!letterScope.current) return
    animateLetters('span', { opacity: [0, 1], y: ['100%', '0%'] }, {
      duration: 0.06,
      delay: stagger(0.05, { startDelay: 0.3 }),
      ease: 'easeOut',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Trigger exit ── */
  useEffect(() => {
    const t1 = setTimeout(() => setExit(true), SLIDE_DELAY)
    const t2 = setTimeout(() => setGone(true), SLIDE_DELAY + 800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (gone) return null

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07070f]"
        >

          {/* ── Content (centered, sits above curtain seam) ── */}
          <div className="relative z-10 flex flex-col items-center select-none">
            {/* Counter */}
            <div className="font-display font-black leading-none text-center w-full tabular-nums tracking-tighter" style={{
              fontSize: 'clamp(4rem, 13vw, 11rem)',
              background: 'linear-gradient(135deg, #a78bfa 0%, #766cff 40%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.05em',
              paddingRight: '0.08em', // Prevent slanted font from clipping on the right
            }}>
              {count}
            </div>

            {/* Brand name with stagger reveal */}
            <div
              ref={letterScope}
              className="font-display font-black text-white flex overflow-hidden tracking-[0.28em]"
              style={{ fontSize: 'clamp(1.1rem, 3.5vw, 2.2rem)', gap: '0.04em' }}
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
              transition={{ delay: 0.9, duration: 0.6 }}
              className="font-mono text-white/30 uppercase tracking-[0.22em] mt-[14px]"
              style={{ fontSize: 'clamp(9px, 1.2vw, 11px)' }}
            >
              {TAGLINE}
            </motion.p>
          </div>

          {/* ── Progress bar (bottom) ── */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
            <motion.div
              className="h-full origin-left"
              style={{ background: 'linear-gradient(90deg, #766cff, #a78bfa, #60a5fa)', width: `${count}%` }}
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
