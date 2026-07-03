import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  hover?: boolean
  dark?: boolean
  darker?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  accent?: string
  className?: string
  onClick?: () => void
  href?: string
}

const PAD = { none: 'p-0', sm: 'p-4', md: 'p-6', lg: 'p-8' }

export default function Card({
  children, hover, dark, darker, padding = 'md',
  accent, className, onClick,
}: CardProps) {
  const cls = [
    'card relative',
    hover ? 'card-hover' : '',
    dark ? 'card--dark' : '',
    darker ? 'card--darker' : '',
    onClick ? 'cursor-pointer' : '',
    className || '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} onClick={onClick}>
      {accent && (
        <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55)` }} />
      )}
      {padding !== 'none' ? (
        <div className={PAD[padding]}>{children}</div>
      ) : children}
    </div>
  )
}
