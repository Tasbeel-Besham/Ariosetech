"use client";
import SectionHeader from '@/components/ui/SectionHeader'

type Step = { n: string; title: string; sub: string; desc: string }
type Props = { eyebrow?: string; headline?: string; subheadline?: string; intro?: string; items?: Step[]; steps?: Step[] }

export default function HowItWorksSection({ eyebrow='Our Process', headline='How It Works', subheadline, intro, items=[], steps=[] }: Props) {
  const safe = items.length ? items : steps
  const sub = subheadline || intro || ''
  
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute hidden-mobile pointer-events-none" style={{ left:'50%', top:'160px', bottom:'80px', width:'1px', background:'linear-gradient(to bottom, transparent, rgba(118,108,255,0.20) 20%, rgba(118,108,255,0.20) 80%, transparent)' }} />
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
        
        <div className="flex flex-col gap-32 mx-auto" style={{ maxWidth: '900px' }}>
          {safe.map((step,i) => {
            const isRight = i % 2 !== 0
            const card = (dir: 'left'|'right') => (
              <div className="card-hover bg-subtle border-subtle rounded-2xl relative overflow-hidden p-32">
                <p className="font-display font-extrabold leading-none mb-16 select-none" style={{ fontSize:'clamp(3rem,4vw,3.8rem)', color:'rgba(118,108,255,0.15)' }}>{step.n}</p>
                <p className="font-display font-extrabold text-white mb-6" style={{ fontSize: '17px' }}>{step.title}</p>
                <p className="font-display font-semibold text-primary mb-12 uppercase tracking-widest text-xs">{step.sub}</p>
                <p className="text-gray-2 leading-loose text-sm">{step.desc}</p>
              </div>
            )
            return (
              <div key={i} className="sr items-center" style={{ animationDelay:`${i*0.1}s`, display:'grid', gridTemplateColumns:'1fr 80px 1fr' }}>
                {isRight ? <div /> : card('left')}
                <div className="flex flex-col items-center">
                  <div className="shrink-0 flex items-center justify-center rounded-full bg-soft text-primary" style={{ width:'44px', height:'44px', border:'2px solid rgba(118,108,255,0.35)' }}>
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
