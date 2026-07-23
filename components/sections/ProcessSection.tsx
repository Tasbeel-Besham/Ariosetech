"use client";
import type { CSSProperties } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'

type Step = { n: string; title: string; sub: string; desc: string; time: string }
type Props = {
  headingTag?: string;
  eyebrow?: string; headline?: string; items?: Step[]; steps?: Step[] }

export default function ProcessSection({ headingTag='h2', eyebrow='How We Work', headline='Your Success Journey in 5 Simple Steps', items=[], steps=[] }: Props) {
  const safe = items.length ? items : steps

  return (
    <section className="section section--dark">
      <div className="container">
        <div className="text-center mb-[60px]">
          <p className="eyebrow sr justify-center">{eyebrow}</p>
          <SectionHeading as={headingTag} className="sr process-headline">{headline}</SectionHeading>
        </div>
        <div className="process-grid" style={{ '--process-cols': safe.length } as CSSProperties}>
          {safe.map(({n,title,sub,desc,time},i) => (
            <div key={i} className="sr process-step" style={{ animationDelay: `${i*0.07}s` }}>
              <p className="process-num">{n}</p>
              <p className="process-title">{title}</p>
              <p className="process-sub">{sub}</p>
              <p className="process-desc">{desc}</p>
              {time && <span className="tag">{time}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
