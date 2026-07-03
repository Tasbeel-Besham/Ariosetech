"use client";
import SectionHeader from '@/components/ui/SectionHeader'

type Metric = { value: string; label: string; desc: string }
type Props = { eyebrow?: string; headline?: string; subheadline?: string; intro?: string; items?: Metric[]; metrics?: Metric[] }

export default function ImpactSection({ eyebrow='Results That Matter', headline='The Impact, Quantified', subheadline, intro, items=[], metrics=[] }: Props) {
  const safe = items.length ? items : metrics
  const sub = subheadline || intro || ''
  
  return (
    <section className="section section--dark relative overflow-hidden">
      <div className="absolute top-[50%] left-[50%] pointer-events-none" style={{ transform:'translate(-50%,-50%)', width:'70%', height:'80%', background:'radial-gradient(ellipse, rgba(118,108,255,0.09) 0%, transparent 65%)', filter: 'blur(30px)' }} />
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
            <div key={i} className="sr card-hover relative overflow-hidden p-40" style={{ borderRadius: '24px', animationDelay:`${i*0.1}s`, background:'rgba(10,10,18,0.7)', border:'1px solid rgba(118,108,255,0.18)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)' }}>
              <div className="absolute top-0 left-0 right-0 bg-grad" style={{ height: '2px' }} />
              <div className="absolute pointer-events-none" style={{ top:'-30%', left:'-10%', width:'60%', height:'60%', background:'radial-gradient(ellipse, rgba(118,108,255,0.12) 0%, transparent 70%)' }} />
              <p className="font-display font-extrabold leading-none mb-12 text-gradient" style={{ fontSize:'clamp(3rem,5vw,4.5rem)' }}>{m.value}</p>
              <p className="font-display font-bold text-white mb-16 text-base">{m.label}</p>
              <p className="text-gray-2 leading-loose text-sm">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
