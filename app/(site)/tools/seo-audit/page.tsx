import type { Metadata } from 'next'
import SeoAuditClient from '@/components/tools/SeoAuditClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

export const metadata: Metadata = {
  title: 'Free SEO Audit Tool — Check Your On-Page SEO Instantly',
  description: 'Run a free basic SEO audit on any website. Checks title tags, meta descriptions, headings, image alt text, canonical, mobile, HTTPS, structured data and more — no signup.',
  alternates: { canonical: `${SITE_URL}/tools/seo-audit` },
  openGraph: {
    type: 'website',
    title: 'Free SEO Audit Tool — Check Your On-Page SEO Instantly',
    description: 'Run a free basic SEO audit on any website. On-page technical checks, instant results, no signup.',
    url: `${SITE_URL}/tools/seo-audit`,
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is this SEO audit tool free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, completely free with no signup. Enter any public website URL and get instant on-page SEO results.' } },
    { '@type': 'Question', name: 'What does the SEO audit check?', acceptedAnswer: { '@type': 'Answer', text: 'It checks on-page technical SEO from the page HTML: title tag, meta description, H1 and headings, image alt text, canonical tag, mobile viewport, HTTPS, Open Graph tags, structured data, language attribute, and content depth.' } },
    { '@type': 'Question', name: 'Does it check backlinks or page speed?', acceptedAnswer: { '@type': 'Answer', text: 'No. This is a basic on-page audit that reads the page HTML. Backlinks, real page-speed scores, and a full-site crawl require dedicated tools or Google data — our team provides a complete audit that covers those.' } },
    { '@type': 'Question', name: 'Why does the audit sometimes fail to load a site?', acceptedAnswer: { '@type': 'Answer', text: 'Some sites block automated requests through security or caching layers, or are not publicly reachable. In those cases the tool cannot fetch the HTML to audit.' } },
  ],
}

export default function SeoAuditPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="dt-hero">
        <div className="dt-hero-glow" />
        <div className="container flex flex-col items-center md:items-start text-center md:text-left relative z-1">
          <div className="dt-badge"><span className="dt-badge-text">Free Tool</span></div>
          <h1 className="dt-title">Free SEO Audit Tool</h1>
          <p className="dt-lede">
            Check the on-page SEO of any website in seconds. Get a score and a prioritized list of what to fix — free, no signup.
          </p>
          <div className="w-full mt-8 max-w-[820px]">
            <SeoAuditClient />
          </div>
        </div>
      </section>

      {/* What it checks / FAQ */}
      <section className="section section--dark">
        <div className="container max-w-[820px]">
          <p className="eyebrow">Good to know</p>
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--heading)' }}>What this audit covers</h2>
          <div className="space-y-5">
            <div>
              <p className="font-semibold mb-1">On-page technical SEO</p>
              <p className="text-[14px] text-text-2 leading-relaxed">It reads your page&apos;s HTML and checks the fundamentals search engines look at: title, meta description, headings, image alt text, canonical, mobile viewport, HTTPS, Open Graph, structured data, and content depth.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">What it doesn&apos;t do</p>
              <p className="text-[14px] text-text-2 leading-relaxed">It doesn&apos;t crawl your whole site, measure real page-speed / Core Web Vitals, or analyze backlinks — those need dedicated tools and Google&apos;s own data. For the full picture, our team runs a complete audit.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
