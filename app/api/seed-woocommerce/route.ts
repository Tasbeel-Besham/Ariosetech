import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import type { PageDoc } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: 'Missing or wrong secret. Add ?secret=YOUR_ADMIN_JWT_SECRET to the URL.' }, { status: 401 })
  }

  try {
    const sections = [
      {
        id: new ObjectId().toHexString(),
        type: 'hero-interactive',
        props: {
          eyebrow: 'WooCommerce Services',
          headline: 'Custom WooCommerce\nDevelopment Services',
          subheadline: 'Transform your WordPress site into a powerful online store that drives sales. We create custom WooCommerce solutions that combine flexibility with robust e-commerce functionality.',
          desc: 'Trusted by 40+ businesses worldwide for scalable e-commerce solutions.',
          ctaPrimaryLabel: 'Get Free WooCommerce Consultation',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'View WooCommerce Portfolio',
          ctaSecondaryHref: '/portfolio',
          trust: 'Starting at $1,299,30-Day Money-Back Guarantee,Free Post-Launch Training',
          codeFilename: 'woocommerce-scaling / optimize.ts',
          codeLines: [
            [{ t: 'com', v: '// Executing WooCommerce scaling optimization' }],
            [],
            [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_checkout' }, { t: 'v', v: '() {' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'store' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'analyze_performance' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'store' }, { t: 'v', v: '.' }, { t: 'attr', v: 'load_time' }, { t: 'v', v: ' > ' }, { t: 'str', v: "'2s'" }, { t: 'v', v: ') {' }],
            [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'implement_caching' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  }' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'✓ Performance Optimized'" }, { t: 'v', v: ';' }],
            [{ t: 'v', v: '}' }]
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'services-accordion',
        props: {
          eyebrow: 'Our Services',
          headline: 'Comprehensive WooCommerce Solutions',
          intro: "Robust e-commerce capabilities built natively on WordPress.",
          items: [
            {
              label: 'Development',
              title: 'WooCommerce Website Development',
              sub: 'Launch Your Ultimate E-commerce Store',
              desc: 'Build a powerful online store that leverages the best of WordPress and WooCommerce. Our custom development creates unique, high-converting stores.',
              features: 'Custom theme development,Responsive design,Product catalog setup,Payment gateway integration,Inventory management',
              price: '$1,299',
              href: '/contact',
              bg: 'radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0c0a1c,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
            },
            {
              label: 'Customization',
              title: 'WooCommerce Theme Customization',
              sub: 'Transform Your Store Design',
              desc: 'Make your WooCommerce store stand out with completely custom theme development or extensive customization of existing themes.',
              features: 'Theme redesign,Brand-specific UI/UX,Advanced product displays,Custom checkout design,Speed optimization',
              price: '$899',
              href: '/contact',
              bg: 'radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#08081a,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
            },
            {
              label: 'Performance',
              title: 'WooCommerce Performance Optimization',
              sub: 'Maximize Speed and Sales',
              desc: 'Slow e-commerce sites lose customers. Our comprehensive optimization service can improve your WooCommerce store speed by 50–70%.',
              features: 'Query optimization,Image compression,Caching implementation,CDN setup,Checkout speedup',
              price: '$699',
              href: '/contact',
              bg: 'radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0a0818,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
            },
            {
              label: 'Multi-vendor',
              title: 'WooCommerce Multi-vendor Solutions',
              sub: 'Create Your Own Marketplace',
              desc: 'Transform your WooCommerce store into a thriving multi-vendor marketplace where multiple sellers can list and sell their products.',
              features: 'Vendor dashboards,Commission management,Payment splitting,Vendor ratings,Advanced filtering',
              price: '$1,999',
              href: '/contact',
              bg: 'radial-gradient(ellipse 70% 70% at 20% 20%, rgba(118,108,255,0.30) 0%, transparent 55%), linear-gradient(160deg,#08081a,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
            }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why Us',
          headline: 'WooCommerce Expertise',
          items: [
            { icon: '🏆', title: 'WordPress + WooCommerce', subhead: 'Deep Expertise', desc: 'Deep understanding of both WordPress and WooCommerce ensures seamless integration and optimal performance.' },
            { icon: '🛒', title: 'E-commerce Focus', subhead: 'Built for Sales', desc: 'Specialized in e-commerce development with proven strategies for increasing conversions and retention.' },
            { icon: '⚡', title: 'Performance Obsessed', subhead: 'Lightning Fast', desc: 'We optimize every aspect of your store for speed, ensuring fast loading times that keep customers engaged.' },
            { icon: '🔒', title: 'Security First', subhead: 'Enterprise Grade', desc: 'Enterprise-grade security measures protect your store and customer data from threats.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'portfolio',
        props: {
          eyebrow: 'Our Work',
          headline: 'Success Stories That Speak for Themselves',
          intro: "Discover how we've transformed businesses with custom WooCommerce solutions that drive growth and maximize ROI.",
          ctaLabel: 'Explore All Projects',
          ctaHref: '/portfolio',
          items: [
            { title: 'The Kapra', client: 'Fashion E-commerce', platform: 'WooCommerce', result: '300%', resultLabel: 'Increase in online sales', quote: 'Custom WooCommerce with advanced product variations.', slug: 'thekapra' },
            { title: 'Dr. Scents', client: 'Perfume & Cosmetics', platform: 'WooCommerce Multi-site', result: '32', resultLabel: 'Countries launched in 4 months', quote: 'Multi-site WooCommerce with full localization.', slug: 'drscents' },
            { title: 'GeoMag World', client: 'Educational Toys', platform: 'WooCommerce', result: '200%', resultLabel: 'Increase in average order value', quote: 'WooCommerce with custom product configurator.', slug: 'geomag' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Get Started',
          headline: 'Ready to Transform Your Store?',
          subhead: 'Get a free WooCommerce consultation',
          desc: 'Find out exactly how to improve your store speed, security, and conversion rates with our expert analysis.',
          ctaLabel: 'Get Free WooCommerce Audit',
          ctaHref: '/contact',
          guarantee: 'No spam, ever. Actionable report delivered within 24 hours.'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'faq',
        props: {
          eyebrow: 'WooCommerce FAQ',
          headline: 'Frequently Asked Questions About WooCommerce',
          items: [
            { q: 'How much does a WooCommerce store cost?', a: 'Custom WooCommerce development starts at $1,299 for basic stores. Complex stores with advanced features range from $2,000–$5,000+.' },
            { q: 'How long does WooCommerce development take?', a: 'Most custom WooCommerce stores are completed within 3–5 weeks. Complex stores with extensive customization may take 6–8 weeks.' },
            { q: 'Can you migrate my existing store to WooCommerce?', a: 'Yes! We provide complete migration services from Shopify, Magento, and other platforms. Migration typically takes 1–3 weeks.' },
            { q: 'Is WooCommerce better than Shopify?', a: 'WooCommerce offers more customization freedom and lower long-term costs, while Shopify provides easier management. We help you choose based on your specific needs.' },
            { q: 'Can WooCommerce handle large product catalogs?', a: 'Absolutely! WooCommerce can handle thousands of products when properly optimized. We implement performance optimizations for large-scale e-commerce operations.' },
            { q: 'Do you develop custom WooCommerce plugins?', a: 'Yes! We develop custom plugins and extensions to add unique functionality to your WooCommerce store that isn\'t available in existing plugins.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'cta',
        props: {
          eyebrow: 'Ready to grow your business online?',
          headline: 'Start Your WooCommerce Journey Today',
          desc: 'Join successful businesses maximizing their revenue. Professional results, transparent reporting, and long-term support.',
          ctaLabel: 'Schedule Free Consultation',
          ctaHref: '/contact',
          secondaryLabel: 'View Case Studies',
          secondaryHref: '/portfolio',
          trust: 'No Long-Term Contracts,WooCommerce Experts,Ongoing E-commerce Support'
        }
      }
    ]

    const pagesCol = await getCollection<PageDoc>('pages')
    const existing = await pagesCol.findOne({ fullPath: '/services/woocommerce' })

    if (existing) {
      await pagesCol.updateOne(
        { fullPath: '/services/woocommerce' }, 
        { 
          $set: { 
            title: 'WooCommerce Services',
            status: 'published',
            'layout.sections': sections, 
            updatedAt: new Date(),
            seo: {
              title: 'Custom WooCommerce Development Services | Ariosetech',
              description: 'Transform your WordPress site into a powerful online store that drives sales with our expert WooCommerce solutions.'
            }
          } 
        }
      )
      return NextResponse.json({ message: `WooCommerce page updated with ${sections.length} sections!` })
    } else {
      await pagesCol.insertOne({
        title: 'WooCommerce Services',
        slug: 'woocommerce',
        parentId: null,
        fullPath: '/services/woocommerce',
        layout: { sections },
        status: 'published',
        seo: {
          title: 'Custom WooCommerce Development Services | Ariosetech',
          description: 'Transform your WordPress site into a powerful online store that drives sales with our expert WooCommerce solutions.',
          robots: { index: true, follow: true }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return NextResponse.json({ message: `WooCommerce page created with ${sections.length} sections!` })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
