"use client";
import SectionHeader from '@/components/ui/SectionHeader'

type Step = { n: string; title: string; sub: string; desc: string }
type Props = { eyebrow?: string; headline?: string; subheadline?: string; intro?: string; items?: Step[]; steps?: Step[] }

export default function HowItWorksSection({ eyebrow='Our Process', headline='How It Works', subheadline, intro, items=[], steps=[] }: Props) {
  const safe = items.length ? items : steps
  const sub = subheadline || intro || ''
  
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute hidden-mobile pointer-events-none hiw-spine" />
      <div className="container relative z-10">
        <div className="mb-64">
          <SectionHeader
            eyebrow={eyebrow}
            headline={headline}
            desc={sub}
            center
            mb={0}
            headlineClass="font-display font-extrabold tracking-tighter"
          />
        </div>
        
        <div className="flex flex-col gap-32 mx-auto hiw-list">
          {safe.map((step,i) => {
            const isRight = i % 2 !== 0
            const card = (dir: 'left'|'right') => (
              <div className="card-hover bg-subtle border-subtle rounded-2xl relative overflow-hidden p-32">
                <p className="font-display font-extrabold leading-none mb-16 select-none hiw-num">{step.n}</p>
                <p className="font-display font-extrabold text-white mb-6 text-17">{step.title}</p>
                <p className="font-display font-semibold text-primary mb-12 uppercase tracking-widest text-xs">{step.sub}</p>
                <p className="text-gray-2 leading-loose text-sm">{step.desc}</p>
              </div>
            )
            return (
              <div key={i} className="sr items-center hiw-row" style={{ animationDelay:`${i*0.1}s` }}>
                {isRight ? <div /> : card('left')}
                <div className="flex flex-col items-center">
                  <div className="shrink-0 flex items-center justify-center rounded-full bg-soft text-primary hiw-node">
                    <span className="font-mono font-extrabold text-xs">{step.n}</span>
                  </div>
                </div>
                {!isRight ? <div /> : card('right')}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
