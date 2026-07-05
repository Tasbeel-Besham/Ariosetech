"use client";
import SectionHeader from '@/components/ui/SectionHeader'

type Metric = { value: string; label: string; desc: string }
type Props = { eyebrow?: string; headline?: string; subheadline?: string; intro?: string; items?: Metric[]; metrics?: Metric[] }

export default function ImpactSection({ eyebrow='Results That Matter', headline='The Impact, Quantified', subheadline, intro, items=[], metrics=[] }: Props) {
  const safe = items.length ? items : metrics
  const sub = subheadline || intro || ''
  
  return (
    <section className="section section--dark relative overflow-hidden">
      <div className="absolute top-[50%] left-[50%] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] bg-[radial-gradient(ellipse,rgba(var(--primary-rgb),0.09)_0%,transparent_65%)] blur-[30px]" />
      <div className="container relative z-10">
        <div className="mb-64">
          <SectionHeader
            eyebrow={eyebrow}
            headline={
              headline.includes('Quantified') 
                ? <>{headline.replace('Quantified','')}<span className="text-gradient">Quantified</span></> 
                : headline
            }
            desc={sub}
            center
            mb={0}
            headlineClass="font-display font-extrabold tracking-tighter"
          />
        </div>
        
        <div className="g-3 gap-24">
          {safe.map((m,i) => (
            <div key={i} className="sr card-hover relative overflow-hidden p-40 rounded-[24px] bg-[rgba(10,10,18,0.7)] border border-[rgba(var(--primary-rgb),0.18)] backdrop-blur-[20px]" style={{ animationDelay:`${i*0.1}s` }}>
              <div className="absolute top-0 left-0 right-0 bg-grad h-[2px]" />
              <div className="absolute pointer-events-none top-[-30%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse,rgba(var(--primary-rgb),0.12)_0%,transparent_70%)]" />
              <p className="font-display font-extrabold leading-none mb-12 text-gradient text-[clamp(3rem,5vw,4.5rem)]">{m.value}</p>
              <p className="font-display font-bold text-white mb-16 text-base">{m.label}</p>
              <p className="text-gray-2 leading-loose text-sm">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
