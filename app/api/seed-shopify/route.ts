import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import type { PageDoc } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: 'Missing or wrong secret.' }, { status: 401 })
  }

  try {
    const sections = [
      {
        id: new ObjectId().toHexString(),
        type: 'hero-interactive',
        props: {
          eyebrow: 'Shopify Services',
          headline: 'Professional Shopify\nDevelopment Services',
          subheadline: 'Scale Your E-commerce Business with Expert Shopify Solutions',
          desc: 'From startup stores to enterprise Shopify Plus platforms, we create high-converting e-commerce experiences that drive sales. Trusted by 30+ Shopify businesses worldwide for exceptional design, functionality, and growth.',
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
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\u2713 Sales Increased'" }, { t: 'v', v: ';' }],
            [{ t: 'v', v: '}' }]
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'services-accordion',
        props: {
          eyebrow: 'Our Services',
          headline: 'Complete Shopify Solutions for E-commerce Success',
          intro: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.',
          items: [
  {
    "label": "Development",
    "title": "Shopify Store Development",
    "sub": "Launch Your Dream E-commerce Store",
    "desc": "Transform your business idea into a profitable Shopify store. Our custom development approach creates unique, high-converting stores that capture your brand essence and drive sales from day one.\n\n**Design Features:**\n• Custom brand integration\n• User-friendly navigation\n• High-converting product pages\n• Optimized checkout process\n• Mobile-first design approach\n• Fast loading times\n• Professional photography integration\n\n**Perfect For:**\n• New businesses launching online\n• Brands moving from other platforms\n• Companies needing unique, custom designs\n• Businesses requiring specific functionality\n• Entrepreneurs starting their e-commerce journey\n\n**Timeline:** 2-3 weeks",
    "features": "Custom Shopify theme development,Responsive design across all devices,Product catalog setup and optimization,Payment gateway integration,Shipping configuration and tax setup,30 days of free support",
    "price": "$999",
    "href": "/contact"
  },
  {
    "label": "Migration",
    "title": "Shopify Migration Services",
    "sub": "Seamless Migration to Shopify",
    "desc": "Moving your e-commerce store to Shopify? We handle the complete migration process while preserving your SEO rankings, customer data, and sales history. Zero downtime, zero data loss guaranteed.\n\n**Migration Process:**\n1. Pre-Migration Audit - Analyze current store and requirements\n2. Data Mapping - Plan transfer of products, customers, orders\n3. Theme Recreation - Rebuild or adapt your current design\n4. Content Migration - Transfer all products, pages, blog posts\n5. Testing Phase - Verify all functionality works perfectly\n6. Go-Live - Launch with minimal downtime\n7. Post-Migration Support - 30 days of assistance\n\n**Supported Platforms:**\n• WooCommerce to Shopify\n• Magento to Shopify\n• BigCommerce to Shopify\n• Custom platforms & other platforms\n\n**Timeline:** 1-2 weeks",
    "features": "All product data and images,Customer accounts and order history,Blog posts and pages,SEO settings and redirects,Reviews and testimonials,30 days of post-migration support",
    "price": "$799",
    "href": "/contact"
  },
  {
    "label": "Optimization",
    "title": "Shopify Performance Optimization",
    "sub": "Maximize Your Store's Speed and Conversions",
    "desc": "Slow Shopify stores lose customers and sales. Our performance optimization service can improve your store speed by 40-60%, leading to higher conversions and better customer experience.\n\n**Performance & Conversion Improvements:**\n• Speed: Audit, image compression, code optimization, app performance review, theme speed enhancements, Shopify script optimization, CDN, mobile speed, Core Web Vitals\n• Conversion: Checkout optimization, product page enhancements, cart abandonment reduction, trust signals, A/B testing, UX improvements, mobile conversion\n\n**Expected Results:**\n• 40-60% faster loading times\n• Improved Google PageSpeed scores & search engine rankings\n• 15-25% increase in conversions & reduced bounce rates\n\n**Timeline:** 5-7 days",
    "features": "Comprehensive speed audit and analysis,Image optimization and compression,Code optimization and cleanup,App performance review and optimization,Theme speed enhancements,Core Web Vitals improvement",
    "price": "$599",
    "href": "/contact"
  },
  {
    "label": "Integration",
    "title": "Shopify Integration Services",
    "sub": "Connect Your Store with Essential Business Tools",
    "desc": "Streamline your operations by integrating your Shopify store with essential business tools and third-party services. Automate workflows and improve efficiency across your entire business.\n\n**Popular Integrations:**\n• 📊 Analytics & Reporting: Google Analytics 4, Facebook Pixel, Google Tag Manager\n• 📧 Email Marketing: Klaviyo, Mailchimp, Constant Contact, Abandoned cart email sequences\n• 📦 Inventory & Fulfillment: ShipStation, dropshipping apps, multi-channel inventory sync\n• 💰 Accounting & Finance: QuickBooks, Xero, tax calculation, financial reporting\n• 🎯 Marketing & Advertising: Facebook Shop, Google Shopping, affiliate & loyalty programs\n\n**Timeline:** 3-5 days per integration",
    "features": "Google Analytics 4 setup,Klaviyo setup and automation,ShipStation integration,QuickBooks integration,Xero accounting connection,Custom API development for custom tools",
    "price": "$399",
    "href": "/contact"
  }
]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: 'Enterprise Scaling',
          headline: 'Shopify Plus Development & Scaling',
          body: 'Scale your high-volume business with Shopify Plus. We specialize in complex enterprise implementations, custom functionality, and advanced integrations that support rapid growth and global expansion.\n\nShopify Plus Exclusive Features:\n* Higher transaction limits and reduced fees\n* Advanced automation workflows (Shopify Flow, Launchpad)\n* Advanced reporting, B2B wholesale capabilities, multi-store, and multi-currency\n* Enhanced customization and checkout experiences\n\nIdeal Fit List:\n* High-volume merchants (> $1M annual sales)\n* Brands with complex CRM or ERP requirements\n* International e-commerce brands & multi-brand companies\n\nScale your e-commerce operations with a platform built for enterprise performance.',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: 'Re-platforming & Optimization',
          headline: 'Conversion-Optimized Shopify Redesign',
          body: 'Is your Shopify store underperforming? Our redesign service combines modern design with conversion optimization to create stores that not only look amazing but also drive more sales.\n\nDesign Focus Areas:\n* Homepage layout and CTA optimization\n* Product page enhancements and media integration\n* Simplified checkout and cart drawer flow\n* Trust signal and social proof placement\n* Mobile shopping experience and performance\n\nExpected Results:\n* 20-40% average increase in conversions\n* Improved mobile user experience and faster loading speeds\n* Higher average order value (AOV) and customer retention',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: 'Custom Extensions',
          headline: 'Custom Shopify App Development',
          body: "Need custom functionality that doesn't exist in the app store? We develop custom Shopify apps tailored to your specific requirements, giving you competitive advantages and streamlined operations.\n\nTypes of Apps We Build:\n* Custom product configurators & personalization tools\n* Advanced inventory management & warehouse sync\n* Subscription systems & recurring billing integrations\n* Advanced search, filtering, and custom B2B pricing portals\n\nBuilt using Shopify Partner APIs (GraphQL & REST), Polaris design standards, and modern secure frameworks.",
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: 'Ongoing Support',
          headline: 'Shopify Maintenance & Support Plans',
          body: 'Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your Shopify store stays updated, secure, and optimized for peak performance.\n\nOur Support Plans:\n* Starter Plan ($99/mo): 1 Shopify store, monthly updates and checks, basic performance monitoring, email support (48h response), 2 hours of modifications.\n* Growth Plan ($199/mo): Up to 2 Shopify stores, bi-weekly updates, advanced optimization, priority email & chat support (24h response), 5 hours of modifications, performance reporting.\n* Enterprise Plan ($399/mo): Up to 5 Shopify stores, weekly updates, 24/7 priority support, 10 hours of modifications, custom feature development, dedicated account manager.\n\nKeep your store running at peak speed and security without the overhead of an in-house team.',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why Choose Us',
          headline: 'Why Choose ARIOSETECH for Shopify Development?',
          items: [
            { icon: '🏆', title: 'Shopify Partner Excellence', subhead: 'Official Shopify Partners', desc: 'Official Shopify Partners with proven expertise in building successful e-commerce stores across various industries.' },
            { icon: '💰', title: 'Conversion-Focused Approach', subhead: 'Optimized for Sales', desc: 'Every store we build is optimized for sales with proven conversion tactics and user experience best practices.' },
            { icon: '🚀', title: 'Shopify Plus Certified', subhead: 'Enterprise Ready', desc: 'Specialized expertise in enterprise-level Shopify Plus implementations for high-growth businesses.' },
            { icon: '📱', title: 'Mobile-Commerce Experts', subhead: 'Responsive Everywhere', desc: 'Deep understanding of mobile shopping behaviors ensures your store performs perfectly on all devices.' },
            { icon: '🔧', title: 'Ongoing Partnership', subhead: 'Long-term Growth', desc: 'We\'re your long-term Shopify growth partner, supporting your business at every stage of expansion.' },
            { icon: '⚡', title: 'Performance Obsessed', subhead: 'Fast & SEO Friendly', desc: 'Every Shopify store we develop loads fast and ranks well in search engines.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'process',
        props: {
          eyebrow: 'How We Work',
          headline: 'Shopify Development Process',
          steps: [
  {
    "n": "01",
    "title": "Discovery & Strategy",
    "sub": "Understand Your Vision",
    "desc": "Business goals analysis, Target audience research, Competitive landscape review, Technical requirements planning, Design and functionality wireframes",
    "time": "3-5 days"
  },
  {
    "n": "02",
    "title": "Design & User Experience",
    "sub": "Blueprint for Success",
    "desc": "Custom design creation, User experience optimization, Mobile-first approach, Brand integration, Conversion optimization planning",
    "time": "1 week"
  },
  {
    "n": "03",
    "title": "Development & Integration",
    "sub": "Bringing Ideas to Life",
    "desc": "Custom theme development, App integrations, Payment and shipping setup, SEO optimization, Performance optimization",
    "time": "1-2 weeks"
  },
  {
    "n": "04",
    "title": "Testing & Launch",
    "sub": "Ensuring Perfection",
    "desc": "Cross-device testing, Functionality verification, Performance testing, Security checks, Go-live and monitoring",
    "time": "3-5 days"
  },
  {
    "n": "05",
    "title": "Training & Support",
    "sub": "Your Success, Our Priority",
    "desc": "Store management training, 30-day support period, Performance monitoring, Growth recommendations",
    "time": "Ongoing"
  }
]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'portfolio',
        props: {
          eyebrow: 'Our Work',
          headline: 'Shopify Portfolio Highlights',
          intro: 'Discover how we\'ve helped e-commerce brands scale with custom Shopify developments.',
          ctaLabel: 'View Full Shopify Portfolio',
          ctaHref: '/portfolio',
          items: [
            { title: 'WYOX Sports', client: 'USA Sports Equipment', platform: 'Shopify + Custom Solutions', result: '250%', resultLabel: 'Business growth', quote: 'Professional, reliable, and always available when we need them.', slug: 'portfolio' },
            { title: 'Genovie', client: 'Skincare Brand', platform: 'Shopify Plus Custom Store', result: '180%', resultLabel: 'AOV increase', quote: 'Incredible personalization and seamless user experience.', slug: 'portfolio' },
            { title: 'Janya.pk', client: 'Wholesale Fashion', platform: 'Shopify Plus Wholesale', result: '300%', resultLabel: 'Increase in wholesale orders', quote: 'Smooth B2B integration and automated commission payments.', slug: 'portfolio' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Get Started',
          headline: 'Ready to Start Your Shopify Project?',
          subhead: 'Get Your Free Shopify Store Audit',
          desc: 'Discover what\'s holding your store back. Get a complete store performance analysis, conversion rate recommendations, and a detailed project proposal.',
          ctaLabel: 'Get Free Store Audit',
          ctaHref: '/contact',
          guarantee: '30-day money-back guarantee | Free post-launch training | Ongoing support available'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'faq',
        props: {
          eyebrow: 'Shopify FAQ',
          headline: 'Frequently Asked Questions About Shopify',
          items: [
  {
    "q": "How long does it take to build a Shopify store?",
    "a": "Most custom Shopify stores are completed within 2-4 weeks, while Shopify Plus projects typically take 4-6 weeks depending on complexity."
  },
  {
    "q": "Can you migrate my existing store to Shopify?",
    "a": "Yes! We provide complete migration services from all major e-commerce platforms including WooCommerce, Magento, BigCommerce, and custom solutions."
  },
  {
    "q": "Do you provide Shopify hosting?",
    "a": "Shopify includes hosting as part of their platform. We help with setup, optimization, and ongoing management of your Shopify store."
  },
  {
    "q": "What's included in the post-launch support?",
    "a": "All Shopify projects include 30 days of free support covering bug fixes, minor adjustments, training, and guidance on store management."
  },
  {
    "q": "Can you help with Shopify marketing and SEO?",
    "a": "While we focus on development, we include basic SEO optimization and can recommend trusted partners for advanced marketing services."
  },
  {
    "q": "How much does Shopify maintenance cost?",
    "a": "Our Shopify maintenance plans start at $99/month and include updates, monitoring, support, and monthly modifications."
  },
  {
    "q": "Do you work with Shopify Plus?",
    "a": "Yes! We're experienced with Shopify Plus implementations for enterprise clients requiring advanced features and higher transaction volumes."
  },
  {
    "q": "Can you develop custom Shopify apps?",
    "a": "Absolutely! We develop both private apps for individual stores and public apps for the Shopify App Store."
  }
]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'cta',
        props: {
          eyebrow: 'Ready to grow?',
          headline: 'Start Your Shopify Journey Today',
          desc: 'Join successful brands scaling their online stores. Professional results, transparent reporting, and long-term partnership.',
          ctaLabel: 'Schedule Free Consultation',
          ctaHref: '/contact',
          secondaryLabel: 'View Case Studies',
          secondaryHref: '/portfolio',
          trust: 'Shopify Partner | 30-Day Money-Back Guarantee | Ongoing Support'
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
              description: 'Scale Your E-commerce Business with Expert Shopify Solutions.'
            }
          } 
        }
      )
      return NextResponse.json({ message: 'Shopify page updated!' })
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
          description: 'Scale Your E-commerce Business with Expert Shopify Solutions.',
          robots: { index: true, follow: true }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return NextResponse.json({ message: 'Shopify page created!' })
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}