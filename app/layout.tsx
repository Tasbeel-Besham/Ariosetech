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
const FAVICON = 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539349/ariosetech/cmeul8vugjeeujikb4e5.png'

export const metadata: Metadata = {
  title: { default: 'ARIOSETECH — Consider It Solved', template: '%s | ARIOSETECH' },
  description: 'Professional WordPress, Shopify & WooCommerce development since 2017. 100+ businesses scaled globally.',
  metadataBase: new URL('https://ariosetech.com'),
  icons: {
    icon: FAVICON,
    shortcut: FAVICON,
    apple: FAVICON,
  },
  openGraph: {
    type: 'website', siteName: 'ARIOSETECH', locale: 'en_US',
    images: [{ url: LOGO, width: 800, height: 200 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${roadRadio.variable}`}>
      <body>{children}</body>
    </html>
  )
}
