import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | ARIOSETECH',
  description: 'Answers to the most common questions about ARIOSETECH web development services, pricing, timelines, and support.',
}

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const
const hb = { fontFamily: 'var(--font-body)' } as const

const FAQS = [
  {
    category: 'General',
    items: [
      { q: 'What services does ARIOSETECH offer?', a: 'We specialise in WordPress development, WooCommerce store development, Shopify development, and SEO services. This includes new builds, redesigns, migrations, speed optimisation, security hardening, maintenance plans, and multilingual setups.' },
      { q: 'How long have you been in business?', a: 'ARIOSETECH has been delivering professional web development since 2017 — over 7 years of focused experience across WordPress, WooCommerce, and Shopify.' },
      { q: 'Where are you based and who do you work with?', a: 'We are based in Lahore, Pakistan and serve clients globally — primarily in the USA, UAE, Switzerland, UK, and Australia. We work across all industries and business sizes.' },
      { q: 'Do you have a portfolio I can review?', a: 'Yes! You can browse our portfolio at ariosetech.com/portfolio. We have delivered 100+ projects including fashion stores, international marketplaces, corporate sites, and service businesses.' },
    ],
  },
  {
    category: 'WordPress',
    items: [
      { q: 'How long does WordPress development take?', a: 'Most WordPress websites are completed within 2-4 weeks. Simple business sites take 2-3 weeks, while complex builds with custom functionality take 4-6 weeks. We always provide a clear timeline upfront.' },
      { q: 'Can you work with my existing WordPress site?', a: 'Absolutely. We handle redesigns, speed optimisation, security hardening, plugin fixes, migrations, and feature additions on existing WordPress sites.' },
      { q: 'Do you use page builders like Elementor?', a: 'We prefer custom theme development for better performance, but we can work with Elementor, Gutenberg, or any page builder based on your preference.' },
      { q: 'How much does WordPress development cost?', a: 'WordPress development starts at $799 for a standard business website. Pricing depends on scope, functionality, and design complexity. We provide a detailed quote after a free consultation.' },
      { q: 'What is included in post-launch support?', a: 'Every project includes 30 days of free support covering bug fixes and minor adjustments. After that, we offer monthly maintenance plans starting at $79/month.' },
    ],
  },
  {
    category: 'WooCommerce',
    items: [
      { q: 'How much does a WooCommerce store cost?', a: 'Custom WooCommerce development starts at $1,299 for a standard e-commerce store. Complex stores with advanced features, multi-vendor capabilities, or custom integrations range from $2,000–$5,000+.' },
      { q: 'How long does WooCommerce development take?', a: 'Most WooCommerce stores are completed in 3-5 weeks. Complex projects with extensive customisation may take 6-8 weeks. We provide a realistic timeline after reviewing your requirements.' },
      { q: 'Can you migrate my store from Shopify or another platform?', a: 'Yes. We provide complete migration services from Shopify, Magento, OpenCart, PrestaShop, and other platforms to WooCommerce, including all product data, customer accounts, and SEO redirects.' },
      { q: 'Which payment gateways do you integrate?', a: 'We integrate all major gateways including Stripe, PayPal, Square, and local options like JazzCash and EasyPaisa. We also support Apple Pay, Google Pay, and multi-currency setups.' },
      { q: 'Can WooCommerce handle large product catalogs?', a: 'Yes. WooCommerce can handle thousands of products when properly optimised. We implement performance enhancements specifically for large-scale stores.' },
    ],
  },
  {
    category: 'Shopify',
    items: [
      { q: 'How long does it take to build a Shopify store?', a: 'Most custom Shopify stores are completed in 2-4 weeks. Shopify Plus projects with enterprise requirements typically take 4-6 weeks.' },
      { q: 'Do you work with Shopify Plus?', a: 'Yes. We have experience with Shopify Plus for high-volume merchants including custom checkout, B2B portals, multi-store setups, and advanced automation workflows.' },
      { q: 'Can you migrate my existing store to Shopify?', a: 'Yes. We migrate from WooCommerce, Magento, BigCommerce, and custom platforms to Shopify, preserving all product data, customer records, order history, and SEO settings.' },
      { q: 'Do you develop custom Shopify apps?', a: 'Yes. We build both private apps for individual stores and public apps for the Shopify App Store, using the latest Shopify APIs, GraphQL, and React.' },
      { q: 'How much does Shopify maintenance cost?', a: 'Our Shopify maintenance plans start at $99/month and include store health checks, app updates, bug fixes, and priority support.' },
    ],
  },
  {
    category: 'SEO',
    items: [
      { q: 'What SEO services do you offer?', a: 'We offer website SEO (on-page optimisation), local SEO (Google Business Profile, local rankings), technical SEO (crawl issues, speed, indexing), and SEO content strategy.' },
      { q: 'How long does SEO take to show results?', a: 'SEO is a long-term investment. Some technical improvements are visible quickly, but meaningful ranking improvements typically take 3-6 months depending on competition and your starting point.' },
      { q: 'Is SEO worth it for small businesses?', a: 'Absolutely. SEO helps small businesses appear when potential customers are searching for their services — driving qualified, free organic traffic without ongoing ad spend.' },
      { q: 'Do you offer local SEO?', a: 'Yes. We optimise your Google Business Profile, create local landing pages, build local citations, and improve your visibility for location-based searches.' },
    ],
  },
  {
    category: 'Pricing & Process',
    items: [
      { q: 'Do you offer a money-back guarantee?', a: 'Yes — we offer a 30-day money-back guarantee on all development projects. If you are not satisfied with our work, we will refund you in full, no questions asked.' },
      { q: 'Do you require a deposit to start?', a: 'Yes. We require a 50% deposit to begin work, with the remaining 50% due upon project completion before final delivery.' },
      { q: 'How do we communicate during a project?', a: 'We use email, WhatsApp, and video calls based on your preference. You will receive regular progress updates throughout the project.' },
      { q: 'Do you sign NDAs?', a: 'Yes. We are happy to sign a Non-Disclosure Agreement before discussing sensitive project details.' },
      { q: 'Can I request changes after the project is complete?', a: 'Minor revisions are included in every project. Larger changes or new features after delivery are quoted separately. All projects also include 30 days of free post-launch support.' },
    ],
  },
]

export default function FAQPage() {
  return (
    <main className="faqp-main">
      <div className="container faqp-narrow">

        {/* Header */}
        <div className="text-center mb-64">
          <p className="faqp-eyebrow">
            FAQ
          </p>
          <h1 className="faqp-title">
            Frequently Asked Questions
          </h1>
          <p className="faqp-lede">
            Everything you need to know about ARIOSETECH services, pricing, timelines, and how we work.
          </p>
        </div>

        {/* FAQ Categories */}
        {FAQS.map((group) => (
          <div key={group.category} className="mb-56">
            <h2 className="faqp-group">
              {group.category}
            </h2>
            <div className="flex flex-col">
              {group.items.map((faq, i) => (
                <details key={i} className="faqp-item">
                  <summary className="faqp-q">
                    {faq.q}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="faqp-chevron">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </summary>
                  <p className="faqp-a">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="faqp-cta">
          <h2 className="faqp-cta-title">
            Still have questions?
          </h2>
          <p className="faqp-cta-desc">
            Our team responds to all enquiries within 2 hours during business days.
          </p>
          <div className="flex gap-12 justify-center flex-wrap">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get In Touch
            </Link>
            <a href="https://wa.me/923009484739" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </main>
  )
}
