'use client'
import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export default function Animations() {
  const pathname = usePathname()

  const reveal = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.sr:not(.sr-visible)').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Reveal immediately visible elements
    const cleanup = reveal()
    return cleanup
  }, [pathname, reveal])

  return null
}
