'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
  style?: React.CSSProperties
  once?: boolean
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  y = 30,
  className = '',
  style = {},
  once = true
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
