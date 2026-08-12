import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Animations from '@/components/ui/Animations'
import Preloader from '@/components/ui/Preloader'
import SiteMain from '@/components/layout/SiteMain'
import { FooterCtaProvider } from '@/components/layout/FooterCtaContext'
import { getHeaderSettings } from '@/lib/header'

/**
 * Server component. It was 'use client' purely because it called usePathname
 * to decide on breadcrumbs; that now lives in <SiteMain>, so the header's
 * branding can be read on the server and handed to the navbar as props.
 *
 * The practical effect: the correct logo is in the HTML on first paint instead
 * of the text wordmark flashing and then being replaced. The same object is
 * handed to <Footer> so the footer logo behaves identically.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const header = await getHeaderSettings()

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
      <Navbar initialHeader={header} />
      <SiteMain>{children}</SiteMain>
      <Footer initialHeader={header} />
      <Animations />
    </FooterCtaProvider>
  )
}
