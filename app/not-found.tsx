import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const hs = { fontFamily: 'var(--font-display)' } as const

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>404</p>
        <h1 style={{ ...hs, fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '16px' }}>Page not found</h1>
        <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '400px', marginBottom: '32px' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary btn-lg" style={{ ...hs, fontWeight: 700 }}>Back to home <ArrowRight size={15} /></Link>
          <Link href="/contact" className="btn-outline btn-lg" style={{ ...hs, fontWeight: 600 }}>Contact us</Link>
        </div>
      </div>
    </div>
  )
}
