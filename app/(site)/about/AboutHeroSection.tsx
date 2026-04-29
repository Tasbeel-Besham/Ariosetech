'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { ArrowRight } from '@/components/ui/Icons'
import { motion, useScroll, useTransform } from 'framer-motion'

const hs = { fontFamily: 'var(--font-display)' } as const

export default function AboutHeroSection() {
  const ref = useRef<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(0% 50% 0% 50%)', 'inset(0% 0% 0% 0%)'])

  return (
    <motion.section
      ref={ref}
      style={{
        clipPath,
        borderBottom: '1px solid var(--border)',
        paddingTop: '100px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(79,110,247,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <p className="eyebrow">About Us</p>
        <h1
          style={{
            ...hs,
            fontSize: 'clamp(2.6rem,6vw,5rem)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
            maxWidth: '700px',
          }}
        >
          Specialists, Not Generalists.
          <br />
          <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Consider It Solved.
          </span>
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '580px', marginBottom: '36px' }}>
          ARIOSETECH was founded with one mission: give growing businesses access to the same quality of web development that enterprise brands enjoy — at honest,
          transparent prices.
        </p>
        <Link href="/contact" className="btn btn-primary btn-lg" style={{ ...hs, fontWeight: 700 }}>
          Work With Us <ArrowRight size={16} />
        </Link>
      </div>
    </motion.section>
  )
}

