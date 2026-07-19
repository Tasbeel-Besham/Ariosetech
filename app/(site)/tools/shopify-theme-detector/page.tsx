import type { Metadata } from 'next'
import Link from 'next/link'
import ShopifyDetectorClient from './ShopifyDetectorClient'

export const metadata: Metadata = {
  title: 'Shopify Theme Detector, Detect Any Shopify Theme Instantly',
  description: 'Free Shopify theme detector. Paste any store URL to instantly identify its Shopify theme, including paid and custom themes. No signup required.',
  alternates: { canonical: 'https://ariosetech.com/tools/shopify-theme-detector' },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Shopify Theme Detector',
  operatingSystem: 'Any',
  applicationCategory: 'DeveloperApplication',
  url: 'https://ariosetech.com/tools/shopify-theme-detector',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'ARIOSETECH', url: 'https://ariosetech.com' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [{"@type":"Question","name":'Is this Shopify theme detector free?',"acceptedAnswer":{"@type":"Answer","text":"Yes, it's completely free and requires no signup. Paste any Shopify store URL to see its theme instantly."}},{"@type":"Question","name":'How does the Shopify theme detector work?',"acceptedAnswer":{"@type":"Answer","text":'It reads the public Shopify theme data every storefront exposes, including the theme name and store ID, and matches it against known Shopify themes.'}},{"@type":"Question","name":'Can it tell if a store uses a paid Shopify theme?',"acceptedAnswer":{"@type":"Answer","text":'Yes. It identifies official Shopify themes from the Theme Store, popular third-party themes, and flags heavily customized or custom-built themes.'}},{"@type":"Question","name":'Why does a store show as using a custom theme?',"acceptedAnswer":{"@type":"Answer","text":'Many established stores customize a base theme so heavily, or build fully custom, that the original theme metadata is removed. The detector reports these honestly as custom rather than guessing.'}},{"@type":"Question","name":'Does it work on headless Shopify stores?',"acceptedAnswer":{"@type":"Answer","text":"Headless storefronts don't use Shopify's theme layer, so there is no theme to detect. The tool will indicate when a store appears to be headless."}}],
}

export default function ShopifyThemeDetectorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ShopifyDetectorClient />

      {/* Crawlable supporting content + FAQ (server-rendered) */}
      <section className="max-w-[860px] mx-auto px-6 pb-24">
        <h2 className="font-display text-[26px] font-extrabold mb-6" style={{color:'var(--heading)'}}>Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>Is this Shopify theme detector free?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">Yes, it's completely free and requires no signup. Paste any Shopify store URL to see its theme instantly.</p>
          </div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>How does the Shopify theme detector work?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">It reads the public Shopify theme data every storefront exposes, including the theme name and store ID, and matches it against known Shopify themes.</p>
          </div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>Can it tell if a store uses a paid Shopify theme?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">Yes. It identifies official Shopify themes from the Theme Store, popular third-party themes, and flags heavily customized or custom-built themes.</p>
          </div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>Why does a store show as using a custom theme?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">Many established stores customize a base theme so heavily, or build fully custom, that the original theme metadata is removed. The detector reports these honestly as custom rather than guessing.</p>
          </div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>Does it work on headless Shopify stores?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">Headless storefronts don't use Shopify's theme layer, so there is no theme to detect. The tool will indicate when a store appears to be headless.</p>
          </div>
        </div>
        <p className="text-[13.5px] text-text-3 mt-8 leading-relaxed">
          Found a theme you like? We build, customize, and optimize it for your business —{' '}
          <Link href="/services/shopify" className="text-primary font-semibold">explore our Shopify services</Link>{' '}or{' '}
          <Link href="/contact" className="text-primary font-semibold">get a free quote</Link>.
        </p>
      </section>
    </>
  )
}
