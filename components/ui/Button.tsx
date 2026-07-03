import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  href?: string
  external?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  style?: React.CSSProperties
}

export default function Button({
  children, variant = 'primary', size = 'md',
  href, external, disabled, loading, onClick,
  type = 'button', className, style,
}: ButtonProps) {
  const cls = `btn btn-${variant} btn-${size}${className ? ` ${className}` : ''}`

  if (href) {
    return (
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cls}
        style={style}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
    >
      {loading ? (
        <>
          <span className="spinner" />
          {children}
        </>
      ) : children}
    </button>
  )
}
