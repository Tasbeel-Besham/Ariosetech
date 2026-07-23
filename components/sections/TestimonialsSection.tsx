"use client";
import SectionHeading from '@/components/ui/SectionHeading'

type Item = { name: string; role: string; initials: string; quote: string; image?: string }
type Props = {
  headingTag?: string;
  eyebrow?: string; headline?: string; items?: Item[]; clutchRating?: string; clutchCount?: string; clutchUrl?: string; googleUrl?: string }

const StarSVG = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--primary)"><path d="M7 1l1.5 4.5H13L9.5 8l1.3 4L7 10l-3.8 2 1.3-4L1 5.5h4.5z"/></svg>

// Static, dependency-free rating badge. Replaces the third-party Clutch embed
// (which rendered an empty grey box when their script was blocked or slow).
function RatingBadge({ rating, count, url, label }: { rating: string; count: string; url: string; label: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-3 rounded-xl px-4 py-3 border border-subtle bg-subtle-2 no-underline transition hover:border-[rgba(var(--primary-rgb),0.4)]">
      <span className="font-display text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>{rating}</span>
      <span className="flex flex-col">
        <span className="flex gap-[2px]">{[0,1,2,3,4].map(s => <StarSVG key={s} />)}</span>
        <span className="font-mono text-10 uppercase tracking-wider font-semibold" style={{ color: 'var(--text-2)' }}>{count} reviews · {label}</span>
      </span>
    </a>
  )
}

export default function TestimonialsSection({
  eyebrow='Client Reviews',
  headline='What Our Clients Say About Working With Us',
  headingTag = 'h2',
  items=[],
  clutchRating='4.9',
  clutchCount='16',
  clutchUrl='https://clutch.co/profile/ariosetech',
  googleUrl='https://g.co/kgs/oiGmWD7',
}: Props) {
  const safe = Array.isArray(items) ? items : []
  return (
    <section className="section">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-20 mb-[56px]">
          <div>
            <p className="eyebrow sr">{eyebrow}</p>
            <SectionHeading as={headingTag} className="sr font-display font-extrabold leading-none tracking-tighter section-headline">{headline}</SectionHeading>
          </div>
          <div className="sr flex gap-3 flex-wrap">
            <RatingBadge rating={clutchRating} count={clutchCount} url={clutchUrl} label="Clutch" />
            <RatingBadge rating="5.0" count="Verified" url={googleUrl} label="Google" />
          </div>
        </div>
        <div className="g-3 gap-20">
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
        <div className="mt-10 text-center">
          <a href={clutchUrl} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 font-mono text-11 uppercase tracking-widest font-semibold" style={{ color: 'var(--primary)' }}>
            Read all {clutchCount} verified reviews on Clutch →
          </a>
        </div>
      </div>
    </section>
  )
}
