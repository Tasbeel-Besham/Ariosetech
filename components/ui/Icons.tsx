/**
 * Centralized inline SVG icon components.
 * Drop-in replacement for lucide-react across all public-facing pages.
 * Each icon accepts: size (number), style (CSSProperties), className (string), color (string)
 */

import React from 'react'

interface IconProps {
  size?: number
  style?: React.CSSProperties
  className?: string
  color?: string
  fill?: string
  strokeWidth?: number
}

const base = (size: number, style?: React.CSSProperties, className?: string, color?: string): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color || 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  style,
  className,
  'aria-hidden': true,
})

export const ArrowRight = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export const ArrowLeft = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

export const Check = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const ChevronDown = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export const ChevronUp = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
)

export const Star = ({ size = 24, style, className, color, fill: fillColor }: IconProps) => (
  <svg {...base(size, style, className, color)} fill={fillColor || 'none'}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export const ExternalLink = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

export const Search = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export const AlertCircle = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

export const Mail = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

export const Phone = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.3 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l.95-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export const MapPin = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const Clock = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export const Calendar = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export const MessageCircle = ({ size = 24, style, className, color }: IconProps) => (
  <svg {...base(size, style, className, color)}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

/** Animated spinner — replaces lucide Loader2 */
export const Loader = ({ size = 24, style, className, color }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || 'currentColor'}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ animation: 'spin 0.7s linear infinite', ...style }}
    className={className}
    aria-hidden
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

/* ── Social icons ── */

export const Facebook = ({ size = 24, style, className, color }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'} style={style} className={className} aria-hidden>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

export const Instagram = ({ size = 24, style, className, color }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style} className={className} aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export const Linkedin = ({ size = 24, style, className, color }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'} style={style} className={className} aria-hidden>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export const Twitter = ({ size = 24, style, className, color }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'} style={style} className={className} aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)
