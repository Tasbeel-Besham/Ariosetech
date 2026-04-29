import type { Metadata } from 'next'
import PortfolioClient from './PortfolioClient'

export const metadata: Metadata = {
  title: 'Portfolio — Our Work | ARIOSETECH',
  description: 'Case studies of 100+ WordPress, WooCommerce, and Shopify projects we have delivered.',
}

export default function PortfolioPage() {
  return <PortfolioClient />
}
