'use client'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Animations from '@/components/ui/Animations'
import Preloader from '@/components/ui/Preloader'
import AutoBreadcrumbs from '@/components/ui/AutoBreadcrumbs'
import { FooterCtaProvider } from '@/components/layout/FooterCtaContext'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  // No breadcrumb on the homepage — it would only point at itself.
  const hasBreadcrumbs = pathname !== '/'

  return (
    <FooterCtaProvider>
      <Preloader />
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#111128',
          color: '#f0f0ff',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
        },
      }} />
      <Navbar />
      {/*
        The class tells the first section below to drop its own header
        clearance — the breadcrumb bar is carrying it instead. Without that the
        two offsets stack into ~200px of empty space. A class rather than an
        adjacent-sibling selector because pages emit <script> tags for their
        JSON-LD, which would sit between the bar and the section and break
        `+` matching.
      */}
      <main className={hasBreadcrumbs ? 'with-breadcrumbs' : undefined}>
        {hasBreadcrumbs && <AutoBreadcrumbs />}
        {children}
      </main>
      <Footer />
      <Animations />
    </FooterCtaProvider>
  )
}
