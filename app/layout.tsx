import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import '@/styles/globals.css'

const manrope = Manrope({
  subsets: ['latin'], weight: ['400','500','600','700','800'],
  variable: '--font-manrope', display: 'swap',
})
const inter = Inter({
  subsets: ['latin'], weight: ['300','400','500','600','700'],
  variable: '--font-inter', display: 'swap',
})

import localFont from 'next/font/local'
const roadRadio = localFont({
  src: '../public/fonts/RoadRadio-Bold.ttf',
  variable: '--font-logo',
  display: 'swap',
})

const LOGO = 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png'
// Social share card. MUST be 1200x630 for WhatsApp/LinkedIn/Facebook/X to show
// a full-width preview instead of a small letterboxed logo. Upload a designed
// card (logo + tagline on the brand background) and put its URL here.
const OG_IMAGE = process.env.NEXT_PUBLIC_OG_IMAGE || LOGO
const FAVICON = 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539349/ariosetech/cmeul8vugjeeujikb4e5.png'

export const metadata: Metadata = {
  title: { default: 'ARIOSETECH, Consider It Solved', template: '%s | ARIOSETECH' },
  description: 'Professional WordPress, Shopify & WooCommerce development since 2017. 100+ businesses scaled globally.',
  metadataBase: new URL('https://ariosetech.com'),
  icons: {
    icon: FAVICON,
    shortcut: FAVICON,
    apple: FAVICON,
  },
  openGraph: {
    type: 'website', siteName: 'ARIOSETECH', locale: 'en_US',
    // Social platforms expect a 1200x630 landscape card. Declaring the real
    // dimensions stops WhatsApp/LinkedIn/FB from letterboxing it into a
    // white box. Replace OG_IMAGE with a proper 1200x630 designed card.
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'ARIOSETECH — WordPress, Shopify & WooCommerce Development Agency' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordPress, Shopify & WooCommerce Development Agency',
    description: 'Professional WordPress, Shopify & WooCommerce development since 2017. 100+ businesses scaled.',
    images: [OG_IMAGE],
  },
}

import Animations from '@/components/ui/Animations'
import SpotlightEffect from '@/components/ui/SpotlightEffect'
import { getTheme, themeToCss } from '@/lib/theme'

// Read the live theme on every request so admin colour changes apply immediately.
export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getTheme()
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${inter.variable} ${roadRadio.variable}`}>
      <head>
        {/* Apply saved dark/light choice before first paint (no flash). Dark is default. */}
        <script dangerouslySetInnerHTML={{ __html:
          `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.dataset.theme='light'}}catch(e){}`
        }} />
        {/* Live brand theme from admin → overrides static defaults in globals.css */}
        <style id="site-theme" dangerouslySetInnerHTML={{ __html: themeToCss(theme) }} />
      </head>
      <body>
        <Animations />
        <SpotlightEffect />
        {children}
      </body>
    </html>
  )
}
