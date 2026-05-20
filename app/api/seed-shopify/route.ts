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
          eyebrow: 'Shopify Services',
          headline: 'Professional Shopify\nDevelopment Services',
          subheadline: 'From startup stores to enterprise Shopify Plus platforms, we create high-converting e-commerce experiences that drive sales.',
          desc: 'Trusted by 30+ Shopify businesses worldwide. We optimize for speed, conversion, and scale.',
          ctaPrimaryLabel: 'Get Free Shopify Store Audit',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'View Shopify Portfolio',
          ctaSecondaryHref: '/portfolio',
          trust: 'Starting at $999,30-Day Money-Back Guarantee,Free Post-Launch Training',
          codeFilename: 'shopify-conversion / optimize.ts',
          codeLines: [
            [{ t: 'com', v: '// Executing Shopify conversion optimization' }],
            [],
            [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_store' }, { t: 'v', v: '() {' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'store' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'analyze_checkout' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'store' }, { t: 'v', v: '.' }, { t: 'attr', v: 'bounce_rate' }, { t: 'v', v: ' > ' }, { t: 'str', v: "'40%'" }, { t: 'v', v: ') {' }],
            [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'implement_fast_checkout' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  }' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'✓ Sales Increased'" }, { t: 'v', v: ';' }],
            [{ t: 'v', v: '}' }]
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'services-accordion',
        props: {
          eyebrow: 'Our Services',
          headline: 'Comprehensive Shopify Solutions',
          intro: "Targeted strategies to build your e-commerce presence from the ground up.",
          items: [
            {
              label: 'Development',
              title: 'Shopify Store Development',
              sub: 'Launch Your Dream E-commerce Store',
              desc: 'Transform your business idea into a profitable Shopify store. Our custom development approach creates unique, high-converting stores that capture your brand essence.',
              features: 'Custom theme development,Responsive design,Product catalog setup,Payment gateway integration,SEO optimization',
              price: '$999',
              href: '/contact',
              bg: 'radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0c0a1c,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
            },
            {
              label: 'Migration',
              title: 'Shopify Migration Services',
              sub: 'Seamless Migration to Shopify',
              desc: 'Moving to Shopify? We handle the complete migration process preserving SEO rankings, customer data, and sales history. Zero downtime guaranteed.',
              features: 'Product data transfer,Customer accounts history,SEO settings preservation,Reviews and testimonials,Analytics setup',
              price: '$799',
              href: '/contact',
              bg: 'radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#08081a,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
            },
            {
              label: 'Optimization',
              title: 'Performance Optimization',
              sub: 'Maximize Speed and Conversions',
              desc: 'Slow stores lose sales. Our performance optimization service can improve store speed by 40–60%, leading to higher conversions and better customer experience.',
              features: 'Speed audit,Image compression,Code optimization,App review,Theme enhancements',
              price: '$599',
              href: '/contact',
              bg: 'radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0a0818,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
            },
            {
              label: 'Shopify Plus',
              title: 'Shopify Plus Development',
              sub: 'Enterprise E-commerce Solutions',
              desc: 'Scale your high-volume business with Shopify Plus. We specialize in complex enterprise implementations, custom functionality, and advanced integrations.',
              features: 'Enterprise Theme Development,Advanced Integrations,B2B Functionality,Multi-Store Setup,Custom Apps',
              price: '$2,999',
              href: '/contact',
              bg: 'radial-gradient(ellipse 70% 70% at 20% 20%, rgba(118,108,255,0.30) 0%, transparent 55%), linear-gradient(160deg,#08081a,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
            }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why Us',
          headline: 'Shopify Partner Excellence',
          items: [
            { icon: '🏆', title: 'Shopify Partner', subhead: 'Official Expertise', desc: 'Official Shopify Partners with proven expertise in building successful e-commerce stores across various industries.' },
            { icon: '💰', title: 'Conversion-Focused', subhead: 'Built for Sales', desc: 'Every store we build is optimized for sales with proven conversion tactics and user experience best practices.' },
            { icon: '🚀', title: 'Shopify Plus Ready', subhead: 'Enterprise Scale', desc: 'Specialized expertise in enterprise-level Shopify Plus implementations for high-growth businesses.' },
            { icon: '📱', title: 'Mobile-Commerce', subhead: 'Perfect on Any Device', desc: 'Deep understanding of mobile shopping behaviors ensures your store performs perfectly on all devices.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'portfolio',
        props: {
          eyebrow: 'Our Work',
          headline: 'Success Stories That Speak for Themselves',
          intro: "Discover how we've transformed businesses with custom Shopify solutions that drive growth and maximize ROI.",
          ctaLabel: 'Explore All Projects',
          ctaHref: '/portfolio',
          items: [
            { title: 'WYOX Sports', client: 'Sports Equipment (USA)', platform: 'Shopify', result: '250%', resultLabel: 'Increase in online sales', quote: 'Custom Shopify store with advanced filtering and checkout optimization.', slug: 'wyox' },
            { title: 'Genovie', client: 'Fashion & Lifestyle', platform: 'Shopify Plus', result: '180%', resultLabel: 'Increase in average order value', quote: 'Custom Shopify Plus store with advanced personalization.', slug: 'genovie' },
            { title: 'Janya.pk', client: 'Wholesale Fashion', platform: 'Shopify Plus', result: '300%', resultLabel: 'Increase in wholesale orders', quote: 'Shopify Plus with custom wholesale portal integration.', slug: 'janya' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Get Started',
          headline: 'Ready to Scale Your E-commerce?',
          subhead: 'Get a free Shopify store audit',
          desc: 'Discover exactly what is holding your store back from maximizing sales with our comprehensive performance and conversion audit.',
          ctaLabel: 'Get Free Shopify Audit',
          ctaHref: '/contact',
          guarantee: 'No spam, ever. Actionable report delivered within 24 hours.'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'faq',
        props: {
          eyebrow: 'Shopify FAQ',
          headline: 'Frequently Asked Questions About Shopify',
          items: [
            { q: 'How long does it take to build a Shopify store?', a: 'Most custom Shopify stores are completed within 2–4 weeks, while Shopify Plus projects typically take 4–6 weeks depending on complexity.' },
            { q: 'Can you migrate my existing store to Shopify?', a: 'Yes! We provide complete migration services from all major e-commerce platforms including WooCommerce, Magento, BigCommerce, and custom solutions.' },
            { q: 'Do you provide Shopify hosting?', a: 'Shopify includes hosting as part of their platform. We help with setup, optimization, and ongoing management of your Shopify store.' },
            { q: "What's included in the post-launch support?", a: 'All Shopify projects include 30 days of free support covering bug fixes, minor adjustments, training, and guidance on store management.' },
            { q: 'How much does Shopify maintenance cost?', a: 'Our Shopify maintenance plans start at $99/month and include updates, monitoring, support, and monthly modifications.' },
            { q: 'Can you develop custom Shopify apps?', a: 'Absolutely! We develop both private apps for individual stores and public apps for the Shopify App Store.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'cta',
        props: {
          eyebrow: 'Ready to grow your business online?',
          headline: 'Start Your Shopify Journey Today',
          desc: 'Join successful businesses maximizing their revenue. Professional results, seamless migrations, and long-term support.',
          ctaLabel: 'Schedule Free Consultation',
          ctaHref: '/contact',
          secondaryLabel: 'View Case Studies',
          secondaryHref: '/portfolio',
          trust: 'No Long-Term Contracts,Shopify Partner Excellence,Ongoing E-commerce Support'
        }
      }
    ]

    const pagesCol = await getCollection<PageDoc>('pages')
    const existing = await pagesCol.findOne({ fullPath: '/services/shopify' })

    if (existing) {
      await pagesCol.updateOne(
        { fullPath: '/services/shopify' }, 
        { 
          $set: { 
            title: 'Shopify Services',
            status: 'published',
            'layout.sections': sections, 
            updatedAt: new Date(),
            seo: {
              title: 'Professional Shopify Development Services | Ariosetech',
              description: 'Scale Your E-commerce Business with Expert Shopify Solutions. We create high-converting e-commerce experiences that drive sales.'
            }
          } 
        }
      )
      return NextResponse.json({ message: `Shopify page updated with ${sections.length} sections!` })
    } else {
      await pagesCol.insertOne({
        title: 'Shopify Services',
        slug: 'shopify',
        parentId: null,
        fullPath: '/services/shopify',
        layout: { sections },
        status: 'published',
        seo: {
          title: 'Professional Shopify Development Services | Ariosetech',
          description: 'Scale Your E-commerce Business with Expert Shopify Solutions. We create high-converting e-commerce experiences that drive sales.',
          robots: { index: true, follow: true }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return NextResponse.json({ message: `Shopify page created with ${sections.length} sections!` })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
