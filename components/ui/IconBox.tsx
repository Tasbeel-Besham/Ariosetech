'use client'

import React from 'react'

type IconBoxProps = {
  children: React.ReactNode
  size?: number
  radius?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Standardized premium icon container used across the site.
 * Ensures consistent branding for all icons, including checkmarks, 
 * features, and services.
 */
export function IconBox({ 
  children, 
  size = 48, 
  radius = 12, 
  className, 
  style 
}: IconBoxProps) {
  return (
    <div 
      className={`flex items-center justify-center shrink-0 text-primary bg-primary/10 border border-primary/20 ${className || ''}`}
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${radius}px`,
        ...style 
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

/* ── Common SVGs ── */

export const CheckSVG = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3.5 8.5L6.5 11.5L13.5 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const StandardCheck = ({ size = 18 }: { size?: number }) => (
  <span 
    className="flex items-center justify-center shrink-0 text-primary bg-primary/10 border border-primary/20 rounded-md" 
    style={{ width: `${size}px`, height: `${size}px` } as React.CSSProperties}
  >
    <CheckSVG size={size * 0.65} />
  </span>
)

export const ArrowSVG = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ChevSVG = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`shrink-0 transition-transform duration-250 ${open ? 'rotate-180' : ''}`}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const SecuritySVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
)

export const MigrationSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

export const SpeedSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

export const RedesignSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
  </svg>
)

export const CodeSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
)

export const GlobeSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
