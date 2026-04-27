'use client'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Animations from '@/components/ui/Animations'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
      <main>{children}</main>
      <Footer />
      <Animations />
    </>
  )
}
