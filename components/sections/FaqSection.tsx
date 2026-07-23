'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'

type Item = { q: string; a: string }
type Props = {
  headingTag?: string;
  eyebrow?: string; headline?: string; subheadline?: string; ctaLabel?: string; ctaHref?: string; items?: Item[] }

export default function FaqSection({ eyebrow='FAQ', headline='Frequently Asked\nQuestions', subheadline="Can't find what you're looking for? We're here to help.", ctaLabel='Ask Us Anything', ctaHref='/contact', items=[] }: Props) {
  const [open, setOpen] = useState<number|null>(null)
  const F = { fontFamily:'var(--font-display)' } as const
  const safe = Array.isArray(items) ? items : []
  return (
    <section className="section overflow-visible">
      <div className="container">
        <div className="g-2 gap-80 items-start">
          <div className="sticky-mobile-fix lg:sticky sticky-100">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="sr faq-headline">
              {headline.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? (
                    <span className="text-grad">
                      {line}
                    </span>
                  ) : (
                    <>{line} </>
                  )}
                </React.Fragment>
              ))}
            </h2>
            <p className="faq-sub">{subheadline}</p>
            <Link href={ctaHref} className="btn btn-primary btn-lg">
              {ctaLabel}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <div className="flex flex-col gap-8">
            {safe.map(({q,a},i) => (
              <div key={i} className={`faq-item${open===i ? ' open' : ''}`}>
                <button onClick={()=>setOpen(open===i?null:i)} className="faq-q">
                  <span className="faq-q-text">{q}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="faq-chevron">
                    <path d="M4 6l4 4 4-4" stroke={open===i?'var(--primary)':'var(--text-3)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {open===i && <div className="faq-a"><p>{a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
