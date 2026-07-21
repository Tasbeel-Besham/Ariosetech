// Static, dependency-free review badges using REAL verified data.
// Replaces the third-party Clutch embed which renders an empty box when
// their script is blocked or slow. Safe to use anywhere, site-wide.

const CLUTCH_URL = 'https://clutch.co/profile/ariosetech'
const GOOGLE_URL = 'https://g.co/kgs/oiGmWD7'
const CLUTCH_RATING = '4.9'
const CLUTCH_COUNT = '16'

const Star = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="var(--primary)" aria-hidden="true">
    <path d="M7 1l1.5 4.5H13L9.5 8l1.3 4L7 10l-3.8 2 1.3-4L1 5.5h4.5z" />
  </svg>
)

function Badge({ rating, sub, url, label }: { rating: string; sub: string; url: string; label: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-3 rounded-xl px-4 py-3 border border-subtle bg-subtle-2 no-underline transition hover:border-[rgba(var(--primary-rgb),0.4)]"
       aria-label={`${label} rating ${rating}`}>
      <span className="font-display text-xl font-extrabold leading-none" style={{ color: 'var(--primary)' }}>{rating}</span>
      <span className="flex flex-col gap-[3px]">
        <span className="flex gap-[2px]">{[0,1,2,3,4].map(s => <Star key={s} />)}</span>
        <span className="font-mono text-10 uppercase tracking-wider font-semibold" style={{ color: 'var(--text-2)' }}>{sub} · {label}</span>
      </span>
    </a>
  )
}

// Two badges (Clutch + Google) — use in footer, About page, anywhere.
export default function ReviewsBadge() {
  return (
    <div className="flex gap-3 flex-wrap items-center">
      <Badge rating={CLUTCH_RATING} sub={`${CLUTCH_COUNT} reviews`} url={CLUTCH_URL} label="Clutch" />
      <Badge rating="5.0" sub="Verified" url={GOOGLE_URL} label="Google" />
    </div>
  )
}

export { CLUTCH_URL, GOOGLE_URL, CLUTCH_RATING, CLUTCH_COUNT }
