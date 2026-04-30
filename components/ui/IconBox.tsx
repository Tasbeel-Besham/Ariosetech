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
      className={className}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        borderRadius: `${radius}px`, 
        background: 'var(--primary-soft)', 
        border: '1px solid rgba(118,108,255,0.22)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'var(--primary)', 
        flexShrink: 0,
        ...style 
      }}
    >
      {children}
    </div>
  )
}

/* ── Common SVGs ── */

export const CheckSVG = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ArrowSVG = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ChevSVG = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.25s', flexShrink: 0 }}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
