import type { ReactNode } from 'react'
import Eyebrow from './Eyebrow'

interface SectionHeaderProps {
  eyebrow?: string
  headline: ReactNode
  desc?: ReactNode
  center?: boolean
  mb?: number
  headlineClass?: string
}

export default function SectionHeader({
  eyebrow, headline, desc, center, mb = 48, headlineClass,
}: SectionHeaderProps) {
  return (
    <div
      className={`section-header mb-[var(--sh-mb)]${center ? ' section-header--center' : ''}`}
      style={{ '--sh-mb': `${mb}px` } as React.CSSProperties}
    >
      {eyebrow && <Eyebrow center={center}>{eyebrow}</Eyebrow>}
      <h2 className={`t-h2 sr${headlineClass ? ` ${headlineClass}` : ''}`}>
        {headline}
      </h2>
      {desc && (
        <p className={`t-body sr max-w-2xl mt-8 ${center ? 'mx-auto' : ''}`}>
          {desc}
        </p>
      )}
    </div>
  )
}
