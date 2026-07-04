import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icons'

const hs = { fontFamily: 'var(--font-display)' } as const

export default function NotFound() {
  return (
    <div className="nf-wrap">
      <div className="container py-[80px]">
        <p className="nf-code">404</p>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-desc">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-12 flex-wrap">
          <Link href="/" className="btn btn-primary btn-lg">Back to home <ArrowRight size={15} /></Link>
          <Link href="/contact" className="btn btn-outline btn-lg">Contact us</Link>
        </div>
      </div>
    </div>
  )
}
