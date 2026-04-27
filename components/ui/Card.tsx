import type { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  hover?: boolean
  dark?: boolean
  darker?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  accent?: string
  className?: string
  style?: CSSProperties
  onClick?: () => void
  href?: string
}

const PAD = { none: '0', sm: 'var(--space-4)', md: 'var(--space-6)', lg: 'var(--space-8)' }

export default function Card({
  children, hover, dark, darker, padding = 'md',
  accent, className, style, onClick,
}: CardProps) {
  const cls = [
    'card',
    hover ? 'card-hover' : '',
    dark ? 'card--dark' : '',
    darker ? 'card--darker' : '',
    className || '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} style={{ cursor: onClick ? 'pointer' : undefined, ...style }} onClick={onClick}>
      {accent && (
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${accent}, ${accent}55)` }} />
      )}
      {padding !== 'none' ? (
        <div style={{ padding: PAD[padding] }}>{children}</div>
      ) : children}
    </div>
  )
}
