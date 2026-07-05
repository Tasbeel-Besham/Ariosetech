'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

/* ── Types & Data ── */
type Tok = { t: 'com' | 'kw' | 'fn' | 'attr' | 'str' | 'v'; v: string }

const DEFAULT_CODE_LINES: Tok[][] = [
  [{ t: 'com', v: '// Ariosetech WooCommerce Store, 2025' }],
  [],
  [{ t: 'kw', v: 'function ' }, { t: 'fn', v: 'ariose_boost_performance' }, { t: 'v', v: '() {' }],
  [{ t: 'v', v: '  ' }, { t: 'attr', v: '$config' }, { t: 'v', v: ' = [' }, { t: 'str', v: "'speed'" }, { t: 'v', v: ', ' }, { t: 'str', v: "'seo'" }, { t: 'v', v: ', ' }, { t: 'str', v: "'conversions'" }, { t: 'v', v: '];' }],
  [{ t: 'v', v: '  ' }, { t: 'kw', v: 'foreach' }, { t: 'v', v: ' (' }, { t: 'attr', v: '$config' }, { t: 'v', v: ' as ' }, { t: 'attr', v: '$module' }, { t: 'v', v: ') {' }],
  [{ t: 'v', v: '    ' }, { t: 'fn', v: 'load_module' }, { t: 'v', v: '(' }, { t: 'attr', v: '$module' }, { t: 'v', v: ', ' }, { t: 'str', v: "'priority=high'" }, { t: 'v', v: ');' }],
  [{ t: 'v', v: '  }' }],
  [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'✓ Performance Optimized'" }, { t: 'v', v: ';' }],
  [{ t: 'v', v: '}' }],
  [],
  [{ t: 'com', v: '// Result: 98 PageSpeed · 150% more conversions' }],
  [{ t: 'fn', v: 'add_action' }, { t: 'v', v: '(' }, { t: 'str', v: "'woocommerce_loaded'" }, { t: 'v', v: ', ' }, { t: 'fn', v: "'ariose_boost_performance'"}, { t: 'v', v: ');' }],
]

/* ── Brand Color Configuration ── */
const B_PRI = 'var(--primary)'
const B_SEC = 'var(--secondary)'

const COLOR_MAP = {
  com: 'rgba(255,255,255,.22)', kw: '#60a5fa', fn: '#fbbf24', attr: '#a78bfa', str: '#4ade80', v: 'rgba(255,255,255,.55)'
}

/* ── SVGs ── */
const SpeedSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
)
const StarSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
)
const LockSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)

type Props = {
  eyebrow?: string
  headline?: string
  subheadline?: string
  desc?: string
  trust?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  liveSiteText?: string
  codeFilename?: string
  codeLines?: Tok[][]
  metrics?: { ico: React.ReactNode, val: string, lbl: string, c1: string, c2: string, bar: number }[]
  marqueeItems?: string[]
}

/** Strip leading decorative glyphs (checkmarks, emoji) that DB content sometimes carries —
    the design supplies its own markers, so these read as double icons. Words are untouched. */
function stripLeadMark(s: string): string {
  let i = 0
  while (i < s.length) {
    const cp = s.codePointAt(i)!
    if (cp === 0x2713 || cp === 0x2714 || cp === 0xFE0F || cp === 0x200D || cp >= 0x2190) {
      i += cp > 0xFFFF ? 2 : 1
      continue
    }
    if (s[i] === ' ') { i++; continue }
    break
  }
  return s.slice(i)
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const } }),
}

export default function InteractiveHeroSection({
  eyebrow = 'Professional Web Development Since 2017',
  headline = 'Professional WordPress, Shopify & WooCommerce Development',
  subheadline = "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.",
  desc,
  trust,
  ctaPrimaryLabel = 'Get Free Quote & Strategy Call',
  ctaPrimaryHref = '/contact',
  ctaSecondaryLabel = 'View Our Portfolio',
  ctaSecondaryHref = '/portfolio',
  liveSiteText = 'Live site just launched 🚀',
  codeFilename = 'ariosetech-store / functions.php',
  codeLines = DEFAULT_CODE_LINES,
  metrics,
  marqueeItems = ['WordPress Development', 'WooCommerce Stores', 'Shopify Development', 'SEO Optimization', 'Speed Optimization', '24/7 Support', '30-Day Guarantee', 'USA · UAE · Switzerland', 'Since 2017'],
}: Props) {
  const [typedLines, setTypedLines] = useState<Tok[][]>([])
  const [currentLine, setCurrentLine] = useState<Tok[]>([])
  const lineIdxRef = useRef(0)
  const charIdxRef = useRef(0)

  /* ── Typing Animation (the hero's single signature) ── */
  useEffect(() => {
    let timer: NodeJS.Timeout
    const tick = () => {
      const lineIdx = lineIdxRef.current
      if (lineIdx >= codeLines.length) {
        timer = setTimeout(() => {
          setTypedLines([])
          setCurrentLine([])
          lineIdxRef.current = 0
          charIdxRef.current = 0
          tick()
        }, 3200)
        return
      }

      const tokens = codeLines[lineIdx]
      if (tokens.length === 0) {
        setTypedLines(prev => [...prev, []])
        lineIdxRef.current++
        charIdxRef.current = 0
        timer = setTimeout(tick, 80)
        return
      }

      const fullText = tokens.map(t => t.v).join('')
      const charIdx = charIdxRef.current

      if (charIdx >= fullText.length) {
        setTypedLines(prev => [...prev, tokens])
        setCurrentLine([])
        lineIdxRef.current++
        charIdxRef.current = 0
        timer = setTimeout(tick, (lineIdx + 1) % 3 === 0 ? 260 : 80)
        return
      }

      // Build partial token list up to charIdx
      let remaining = charIdx + 1
      const partial: Tok[] = []
      for (const tok of tokens) {
        if (remaining <= 0) break
        if (tok.v.length <= remaining) {
          partial.push(tok)
          remaining -= tok.v.length
        } else {
          partial.push({ t: tok.t, v: tok.v.slice(0, remaining) })
          remaining = 0
        }
      }
      setCurrentLine(partial)
      charIdxRef.current++
      timer = setTimeout(tick, 14 + Math.random() * 22)
    }
    timer = setTimeout(tick, 700)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // DB headlines store line breaks as a literal backslash-n; support both forms
  const headlineLines = (headline || '').split(/\\n|\n/).filter(l => l.trim().length > 0)

  return (
    <section className="hero-section-wrapper relative w-full overflow-hidden bg-[#05050e]">

      {/* Static backdrop: faint grid + one soft brand glow. No JS. */}
      <div className="hero-backdrop absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] items-center gap-[56px] pt-[88px] pb-[72px] max-w-[1240px] mx-auto">

        {/* Left Side */}
        <div className="flex flex-col min-w-0 max-w-full">
          {eyebrow && eyebrow.trim().length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <div className="inline-flex items-center gap-10 mb-20">
                <div className="w-[22px] h-[1.5px] bg-grad shrink-0" />
                <span className="font-mono uppercase tracking-widest text-white/35 text-[10.5px]">{stripLeadMark(eyebrow)}</span>
              </div>
            </motion.div>
          )}

          {headlineLines.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-16 max-w-[640px] w-full">
              <h1 className="hero-headline text-balance break-words">
                {headlineLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h1>
            </motion.div>
          )}

          {subheadline && subheadline.trim().length > 0 && (
            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className={subheadline.length > 140
                ? 'hero-subheadline font-body text-white/55 max-w-[560px] w-full leading-relaxed mb-14 text-[15.5px]'
                : 'hero-subheadline font-display font-semibold text-white/80 max-w-[540px] w-full leading-snug mb-14 text-[17px] tracking-tight'}
            >
              {subheadline}
            </motion.p>
          )}

          {desc && (
            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={3} className="font-body text-white/45 max-w-[500px] w-full leading-relaxed mb-20 text-[15px]">
              {desc}
            </motion.p>
          )}

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={4} className="font-body text-white/35 mb-[28px] text-[13px] max-w-full">
            {trust ? (
              trust.includes(',') ? (
                trust.split(',').map((t, i) => (
                  <span key={i} className="whitespace-nowrap">
                    {i > 0 && <span className="text-primary/50 mx-[9px]">·</span>}
                    {stripLeadMark(t.trim())}
                  </span>
                ))
              ) : trust
            ) : (
              <>
                Trusted by businesses in <span className="text-primary/80">USA</span>, <span className="text-primary/80">UAE</span>, and <span className="text-primary/80">Switzerland</span> for affordable, high-quality development.
              </>
            )}
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="hero-ctas flex gap-[14px] items-center flex-wrap">
            {ctaPrimaryLabel && ctaPrimaryLabel.trim().length > 0 && (
              <Link href={ctaPrimaryHref || '/contact'} className="btn btn-primary btn-lg">
                {ctaPrimaryLabel}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            )}
            {ctaSecondaryLabel && ctaSecondaryLabel.trim().length > 0 && (
              <Link href={ctaSecondaryHref || '/portfolio'} className="btn btn-outline btn-lg">
                {ctaSecondaryLabel}
              </Link>
            )}
          </motion.div>
        </div>

        {/* Right Side */}
        <motion.div
          className="hero-right-col relative flex flex-col gap-[18px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Editor window, the one signature element */}
          <div className="rounded-xl overflow-hidden bg-[rgba(10,10,20,0.72)] border border-[rgba(255,255,255,0.09)] shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-[10px]">
            <div className="px-[16px] py-[11px] flex items-center gap-12 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.07)]">
              <div className="flex gap-6">
                <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-[6px] font-mono text-white/30 text-[11px]">{codeFilename}</div>
              <div className="ml-auto flex items-center gap-8 font-mono text-[10px] text-white/40">
                <span className="w-[6px] h-[6px] rounded-full bg-[#22c55e] inline-block" />
                {liveSiteText}
              </div>
            </div>
            <div className="p-24 font-mono leading-loose min-h-[240px] max-h-[240px] overflow-hidden text-[12px]">
              {typedLines.map((toks, i) => (
                <div key={i} className="flex gap-[14px]">
                  <span className="text-white/15 min-w-[18px] text-right text-[10px]">{i + 1}</span>
                  <span className="text-white/50">
                    {toks.map((t, ti) => (<span key={ti} style={{ color: COLOR_MAP[t.t] }}>{t.v}</span>))}
                  </span>
                </div>
              ))}
              {lineIdxRef.current < codeLines.length && (
                <div className="flex gap-[14px]">
                  <span className="text-white/15 min-w-[18px] text-right text-[10px]">{typedLines.length + 1}</span>
                  <span className="text-white/50">
                    {currentLine.map((t, ti) => (<span key={ti} style={{ color: COLOR_MAP[t.t] }}>{t.v}</span>))}
                    <span className="inline-block w-[2px] h-[14px] align-middle ml-[3px] animate-[cblink_.9s_infinite] bg-primary-solid" />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Metrics */}
          <div className="flex gap-[14px]">
            {(metrics || [
              { ico: <SpeedSVG />, val: '98', lbl: 'PageSpeed Score', c1: B_PRI, c2: B_SEC, bar: 0.92 },
              { ico: <StarSVG />, val: '5.0', lbl: 'Clutch Rating', c1: B_PRI, c2: B_SEC, bar: 1.0 },
              { ico: <LockSVG />, val: '30d', lbl: 'Money-Back', c1: B_PRI, c2: B_SEC, bar: 0.98 },
            ]).map((m, i) => (
              <div key={m.lbl + i} className="flex-1 rounded-xl p-[16px] relative overflow-hidden bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)]">
                <div className="mb-8 flex text-primary/80">{m.ico}</div>
                <div className="font-display font-extrabold text-white mb-4 text-[20px]">{m.val}</div>
                <div className="uppercase tracking-wider font-semibold text-[9.5px] text-[rgba(255,255,255,0.35)]">{m.lbl}</div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-70 origin-left" style={{ background: `linear-gradient(90deg, ${m.c1}, ${m.c2})`, transform: `scaleX(${m.bar})` }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Services ticker */}
      <div className="py-[11px] overflow-hidden border-t border-[rgba(255,255,255,0.05)] relative z-10">
        <div className="flex whitespace-nowrap animate-[ticker_55s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              {marqueeItems.map(text => (
                <span key={text} className="inline-flex items-center gap-16 px-[36px] font-mono font-semibold tracking-widest uppercase text-white/20 text-[9.5px]">
                  <span className="w-[4px] h-[4px] rounded-full bg-primary/40" />
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes cblink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .hero-backdrop {
          background-image:
            radial-gradient(ellipse 55% 60% at 22% 18%, rgba(var(--primary-rgb),0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 85% 75%, rgba(var(--primary-rgb),0.05) 0%, transparent 60%),
            linear-gradient(rgba(var(--primary-rgb),0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--primary-rgb),0.028) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 56px 56px, 56px 56px;
          mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
        }
        @media (min-width: 1025px) {
          .hero-ctas { flex-wrap: nowrap; }
        }
        @media (max-width: 1024px) {
          .hero-section-wrapper .container { grid-template-columns: 1fr !important; padding-top: 64px !important; padding-bottom: 56px !important; gap: 2rem !important; }
          .hero-right-col { display: none !important; }
        }
      `}</style>
    </section>
  )
}
