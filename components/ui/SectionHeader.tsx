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
      className={`section-header${center ? ' section-header--center' : ''}`}
      style={{ marginBottom: mb }}
    >
      {eyebrow && <Eyebrow center={center}>{eyebrow}</Eyebrow>}
      <h2 className={`t-h2 sr${headlineClass ? ` ${headlineClass}` : ''}`}>
        {headline}
      </h2>
      {desc && (
        <p className="t-body sr" style={{
          maxWidth: 'var(--max-w-text)',
          marginTop: 'var(--space-5)',
          marginLeft: center ? 'auto' : undefined,
          marginRight: center ? 'auto' : undefined,
        }}>
          {desc}
        </p>
      )}
    </div>
  )
}
