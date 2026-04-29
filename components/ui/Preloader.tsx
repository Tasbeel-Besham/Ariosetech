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
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#07070f',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >

          {/* ── Content (centered, sits above curtain seam) ── */}
          <div style={{
            position: 'relative', zIndex: 2,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            userSelect: 'none',
          }}>
            {/* Counter */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4rem, 13vw, 11rem)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #a78bfa 0%, #766cff 40%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.05em',
              textAlign: 'center',
              width: '100%',
              paddingRight: '0.08em', // Prevent slanted font from clipping on the right
              fontVariantNumeric: 'tabular-nums',
            } as React.CSSProperties}>
              {count}
            </div>

            {/* Brand name with stagger reveal */}
            <div
              ref={letterScope}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.1rem, 3.5vw, 2.2rem)',
                fontWeight: 900,
                letterSpacing: '0.28em',
                color: '#ffffff',
                display: 'flex', gap: '0.04em',
                overflow: 'hidden',
              }}
            >
              {BRAND.split('').map((ch, i) => (
                <span key={i} style={{ display: 'inline-block', opacity: 0 }}>
                  {ch}
                </span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(9px, 1.2vw, 11px)',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                marginTop: '14px',
              }}
            >
              {TAGLINE}
            </motion.p>
          </div>

          {/* ── Progress bar (bottom) ── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '2px', background: 'rgba(255,255,255,0.06)', zIndex: 3,
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #766cff, #a78bfa, #60a5fa)',
                width: `${count}%`,
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* ── Percentage label (bottom right) ── */}
          <div style={{
            position: 'absolute', bottom: '20px', right: '28px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px', fontWeight: 700,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            zIndex: 3,
          }}>
            Loading {count}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
