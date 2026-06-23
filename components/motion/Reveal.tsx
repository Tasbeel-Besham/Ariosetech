'use client'

import { motion, type MotionProps } from 'framer-motion'
import type { PropsWithChildren } from 'react'

type RevealProps = PropsWithChildren<{
  delay?: number
  y?: number
} & Omit<MotionProps, 'children'>>

export default function Reveal({ children, delay = 0, y = 30, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

