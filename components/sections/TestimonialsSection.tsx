"use client";
import ClutchWidget from '@/components/ui/ClutchWidget'

type Item = { name: string; role: string; initials: string; quote: string; image?: string }
type Props = { eyebrow?: string; headline?: string; items?: Item[] }

const StarSVG = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--primary)"><path d="M7 1l1.5 4.5H13L9.5 8l1.3 4L7 10l-3.8 2 1.3-4L1 5.5h4.5z"/></svg>

export default function TestimonialsSection({ eyebrow='Client Reviews', headline='What Our Clients Say About Working With Us', items=[] }: Props) {
  const safe = Array.isArray(items) ? items : []
  return (
    <section className="section">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-20 mb-[56px]">
          <div>
            <p className="eyebrow sr">{eyebrow}</p>
            <h2 className="sr font-display font-extrabold leading-none tracking-tighter section-headline">{headline}</h2>
          </div>
          <div className="sr"><ClutchWidget widgetType={7} height={65} /></div>
        </div>
        <div className="g-3 gap-20 mb-40">
          {safe.map((t,i) => (
            <div key={i} className="card card-hover sr p-32 flex flex-col" style={{ animationDelay:`${i*0.08}s` }}>
              <div className="flex gap-4 mb-20">
                {[0,1,2,3,4].map(s => <StarSVG key={s} />)}
              </div>
              <p className="text-gray-2 leading-loose italic mb-[28px] flex-1 text-base">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-[14px] pt-[20px] border-t border-subtle">
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.image} alt={t.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-grad flex items-center justify-center font-display text-sm font-extrabold text-white shrink-0">{t.initials}</div>
                )}
                <div>
                  <p className="font-display text-sm font-bold text-white">{t.name}</p>
                  <p className="font-mono text-gray-3 uppercase tracking-wider font-semibold text-10">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl overflow-hidden border border-subtle">
          <ClutchWidget widgetType={12} height={375} reviews="449566,412231,406618,406326,405095,379000,373080,373075,372945,372930,372228,372128" />
        </div>
      </div>
    </section>
  )
}
