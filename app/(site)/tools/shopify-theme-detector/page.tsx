import type { Metadata } from 'next'
import ShopifyDetectorClient from './ShopifyDetectorClient'

export const metadata: Metadata = {
  title: 'Shopify Theme Detector — Find Any Shopify Store Theme Instantly',
  description: 'Detect the Shopify theme used by any Shopify store. Free tool by ARIOSETECH.',
}

export default function ShopifyThemeDetectorPage() {
  return <ShopifyDetectorClient />
}
