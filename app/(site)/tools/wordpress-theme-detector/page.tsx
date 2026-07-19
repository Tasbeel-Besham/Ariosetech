import type { Metadata } from 'next'
import Link from 'next/link'
import WordPressDetectorClient from './WordPressDetectorClient'

export const metadata: Metadata = {
  title: 'WordPress Theme Detector, Find Any WordPress Theme Instantly',
  description: 'Free WordPress theme detector. Enter any site URL to instantly identify its WordPress theme, parent theme, and detectable plugins. No signup required.',
  alternates: { canonical: 'https://ariosetech.com/tools/wordpress-theme-detector' },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'WordPress Theme Detector',
  operatingSystem: 'Any',
  applicationCategory: 'DeveloperApplication',
  url: 'https://ariosetech.com/tools/wordpress-theme-detector',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'ARIOSETECH', url: 'https://ariosetech.com' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [{"@type":"Question","name":'Is this WordPress theme detector free?',"acceptedAnswer":{"@type":"Answer","text":'Yes, completely free with no signup required. Enter any WordPress site URL and get instant results.'}},{"@type":"Question","name":'How does the WordPress theme detector work?',"acceptedAnswer":{"@type":"Answer","text":"It fetches the site's public HTML and reads the active theme's stylesheet path and metadata that every WordPress site exposes, then shows you the theme name, author, and version where available."}},{"@type":"Question","name":'Can it detect child themes and parent themes?',"acceptedAnswer":{"@type":"Answer","text":'Yes. When a site runs a child theme, the tool reports both the child theme and the parent theme it is built on.'}},{"@type":"Question","name":'Why does it sometimes say the theme is custom or unknown?',"acceptedAnswer":{"@type":"Answer","text":'Some sites use fully custom themes with no public metadata, rename their theme, or block detection through caching and security layers. In those cases no detector can reliably identify the theme.'}},{"@type":"Question","name":'Does it also detect WordPress plugins?',"acceptedAnswer":{"@type":"Answer","text":'The tool focuses on themes, but detectable plugin fingerprints found in the page source are listed when present.'}}],
}

export default function WordPressThemeDetectorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <WordPressDetectorClient />

      {/* Crawlable supporting content + FAQ (server-rendered) */}
      <section className="max-w-[860px] mx-auto px-6 pb-24">
        <h2 className="font-display text-[26px] font-extrabold mb-6" style={{color:'var(--heading)'}}>Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>Is this WordPress theme detector free?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">Yes, completely free with no signup required. Enter any WordPress site URL and get instant results.</p>
          </div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>How does the WordPress theme detector work?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">It fetches the site's public HTML and reads the active theme's stylesheet path and metadata that every WordPress site exposes, then shows you the theme name, author, and version where available.</p>
          </div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>Can it detect child themes and parent themes?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">Yes. When a site runs a child theme, the tool reports both the child theme and the parent theme it is built on.</p>
          </div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>Why does it sometimes say the theme is custom or unknown?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">Some sites use fully custom themes with no public metadata, rename their theme, or block detection through caching and security layers. In those cases no detector can reliably identify the theme.</p>
          </div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h3 className="font-display text-[15px] font-bold text-heading mb-2" style={{color:'var(--heading)'}}>Does it also detect WordPress plugins?</h3>
            <p className="text-[13.5px] text-text-2 leading-relaxed">The tool focuses on themes, but detectable plugin fingerprints found in the page source are listed when present.</p>
          </div>
        </div>
        <p className="text-[13.5px] text-text-3 mt-8 leading-relaxed">
          Found a theme you like? We build, customize, and optimize it for your business —{' '}
          <Link href="/services/wordpress" className="text-primary font-semibold">explore our WordPress services</Link>{' '}or{' '}
          <Link href="/contact" className="text-primary font-semibold">get a free quote</Link>.
        </p>
      </section>
    </>
  )
}
