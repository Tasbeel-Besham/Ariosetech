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
          eyebrow: 'WooCommerce Services',
          headline: 'Professional WooCommerce\nDevelopment Services',
          subheadline: 'Build Powerful E-commerce Stores with WordPress & WooCommerce',
          desc: 'Transform your WordPress site into a powerful online store that drives sales. We create custom WooCommerce solutions that combine the flexibility of WordPress with robust e-commerce functionality. Trusted by 40+ businesses worldwide for exceptional performance and growth.',
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
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\u2713 Performance Optimized'" }, { t: 'v', v: ';' }],
            [{ t: 'v', v: '}' }]
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'services-accordion',
        props: {
          eyebrow: 'Our Services',
          headline: 'Complete WooCommerce Solutions for E-commerce Success',
          intro: 'Custom WooCommerce solutions with seamless payment integration and conversion optimization.',
          items: [
  {
    "label": "Development",
    "title": "WooCommerce Website Development Services",
    "sub": "Launch Your Ultimate E-commerce Store",
    "desc": "Build a powerful online store that leverages the best of WordPress and WooCommerce. Our custom development creates unique, high-converting stores that perfectly match your brand and business requirements.\n\n**E-commerce Features:**\n• Advanced product variations (size, color, style)\n• Product bundles and grouped products\n• Wishlist and comparison functionality\n• Customer reviews and ratings\n• Coupon and discount management\n• Multi-currency support\n• Advanced search and filtering\n• Related and upsell products\n\n**Perfect For:**\n• Businesses wanting WordPress + e-commerce\n• Companies needing content marketing integration\n• Brands requiring extensive customization\n• Stores with complex product catalogs\n• Businesses planning to scale significantly\n\n**Timeline:** 3-4 weeks",
    "features": "Custom WooCommerce theme development,Responsive design across all devices,Complete product catalog setup,Payment gateway integration,Shipping zones and tax configuration,30 days of free support",
    "price": "$1,299",
    "href": "/contact"
  },
  {
    "label": "Customization",
    "title": "WooCommerce Theme Customization",
    "sub": "Transform Your Store with Custom Design",
    "desc": "Make your WooCommerce store stand out with completely custom theme development or extensive customization of existing themes. We create unique shopping experiences that reflect your brand and drive conversions.\n\n**Design Features:**\n• Modern, conversion-focused layouts\n• Intuitive navigation and user flow\n• High-quality product showcases\n• Trust signals and social proof integration\n• Professional brand representation\n• Accessibility compliance\n• Cross-browser compatibility\n\n**Perfect For:**\n• Stores wanting unique brand representation\n• Businesses with existing WooCommerce sites\n• Companies needing design improvements\n• Brands requiring specific functionality\n• Stores wanting to improve conversions\n\n**Timeline:** 2-3 weeks",
    "features": "Complete theme redesign and development,Custom homepage and product page layouts,Brand-specific color schemes and typography,Custom icons and graphics integration,Advanced product display options,30 days of design support",
    "price": "$899",
    "href": "/contact"
  },
  {
    "label": "Payments",
    "title": "WooCommerce Payment Gateway Integration",
    "sub": "Secure, Seamless Payment Processing",
    "desc": "Offer your customers the payment methods they prefer with secure, reliable payment gateway integrations. We implement and optimize payment systems that reduce cart abandonment and increase conversions.\n\n**Supported Payment Gateways:**\n• 🏦 Traditional Gateways: Stripe (credit cards, digital wallets), PayPal (Standard, Pro, Express), Square (online/in-person), Authorize.net (merchant accounts), Bank transfer & check\n• 💳 Digital Wallets: Apple Pay and Google Pay, Amazon Pay, Shop Pay\n• 🌍 International Gateways: Razorpay & Paytm (India), Alipay (China), Regional bank gateways, Multi-currency support\n• 🔐 Security Features: PCI DSS compliance assistance, SSL certificate, Fraud protection setup, Secure tokenization, 3D Secure authentication\n\n**Perfect For:**\n• Stores expanding payment options\n• International e-commerce businesses\n• Companies wanting to reduce cart abandonment\n• Businesses needing secure payment processing\n• Stores targeting mobile customers\n\n**Timeline:** 3-5 days",
    "features": "Stripe and PayPal integration,Square online payments,Authorize.net integration,Local gateways (JazzCash EasyPaisa),SSL certificate implementation,30 days of payment support",
    "price": "$299",
    "href": "/contact"
  },
  {
    "label": "Performance",
    "title": "WooCommerce Performance Optimization",
    "sub": "Maximize Speed, Sales, and Search Rankings",
    "desc": "Slow e-commerce sites lose customers and sales. Our comprehensive optimization service can improve your WooCommerce store speed by 50-70%, leading to higher conversions, better user experience, and improved search rankings.\n\n**Performance Improvements:**\n• ⚡ Speed Optimization: Database query, image compression, caching implementation (page, object, browser), CDN setup, server-level optimizations, plugin review, code cleanup\n• 🛒 E-commerce Optimization: Product catalog, checkout speed, cart/wishlist optimization, category page, search improvement\n• 📱 Mobile Optimization: Mobile-first performance, touch-friendly UI, mobile payment speed, PWA features\n\n**Expected Results:**\n• 50-70% faster loading times\n• Improved Google PageSpeed scores (90+)\n• Better Core Web Vitals\n• 20-35% increase in conversions\n• Reduced bounce rates\n• Higher search engine rankings & improved mobile performance\n\n**Timeline:** 5-7 days",
    "features": "Database query optimization,Image compression and optimization,Caching implementation (page object browser),CDN setup and configuration,Server-level optimizations,Core Web Vitals check",
    "price": "$699",
    "href": "/contact"
  },
  {
    "label": "Maintenance",
    "title": "WooCommerce Maintenance & Support",
    "sub": "Keep Your Store Running Smoothly",
    "desc": "Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your WooCommerce store stays updated, secure, and optimized for peak performance.\n\n**Maintenance Plans:**\n• 🥉 Essential Plan - $129/month:\n  - 1 WooCommerce store\n  - Monthly updates and security checks\n  - Basic performance monitoring\n  - Email support (48-hour response)\n  - 2 hours of modifications & backup verification\n• 🥈 Professional Plan - $249/month:\n  - Up to 2 WooCommerce stores\n  - Bi-weekly updates and monitoring\n  - Advanced security & performance optimization\n  - Priority support (24-hour response)\n  - 5 hours of modifications & weekly backup management\n• 🥇 Enterprise Plan - $499/month:\n  - Up to 5 WooCommerce stores\n  - Weekly updates and monitoring\n  - Real-time security monitoring & 24/7 priority support\n  - Advanced performance & 10 hours modifications\n  - Daily backup management, custom features, dedicated account manager",
    "features": "WordPress and WooCommerce core updates,Plugin and theme updates,Security monitoring and hardening,Performance monitoring and optimization,Database optimization and cleanup,Uptime monitoring & backups",
    "price": "$129/mo",
    "href": "/contact"
  },
  {
    "label": "Multi-vendor",
    "title": "WooCommerce Multi-vendor Solutions",
    "sub": "Create Your Own E-commerce Marketplace",
    "desc": "Transform your WooCommerce store into a thriving multi-vendor marketplace where multiple sellers can list and sell their products. Perfect for creating Amazon-like platforms or expanding your business model.\n\n**Marketplace Features:**\n• 👥 Vendor Management: Registration/approval system, Individual dashboards, Product/order management, Commission management, Performance analytics\n• 💰 Financial Management: Automated commission calculations, Multiple payout methods, Financial reporting, Tax handling, Subscription plans, Revenue sharing models\n• 🛍️ Customer Experience: Unified shopping experience, Vendor ratings/reviews, Advanced search/filtering, Vendor comparison, Single checkout, Order tracking\n\n**Perfect For:**\n• Entrepreneurs creating marketplaces\n• Businesses wanting to expand product range\n• Companies with multiple suppliers\n• Platforms connecting buyers and sellers\n• Businesses looking for passive income\n\n**Timeline:** 4-6 weeks",
    "features": "Vendor registration and approval system,Individual vendor dashboards,Vendor commission management,Automated commission calculations,Multiple payout methods,30 days of marketplace support",
    "price": "$1,999",
    "href": "/contact"
  },
  {
    "label": "Multilingual",
    "title": "WooCommerce Multilingual Websites",
    "sub": "Expand Globally with Multilingual E-commerce",
    "desc": "Reach international customers with professionally developed multilingual WooCommerce stores. We create seamless multi-language shopping experiences that engage global audiences and drive international sales.\n\n**Multilingual Features:**\n• 🌐 Language Management: Setup (unlimited), Translation workflow, Language switcher, Auto-detection, Language-specific URLs, RTL support\n• 💱 Currency & Localization: Multi-currency, Auto-conversion, Location pricing, Country payment methods, Local shipping, Tax by region\n• 🛒 E-commerce Localization: Translated catalog, Localized checkout, Multi-language support, Promotion by region, Local gateway integration\n\n**Perfect For:**\n• Stores expanding internationally\n• Businesses targeting specific regions\n• Companies with multilingual customers\n• Global brands launching online\n• Businesses in tourist areas\n\n**Timeline:** 3-4 weeks",
    "features": "Multiple language setup (unlimited),Multi-currency and localization setup,Location-based pricing,Country-specific payment methods,RTL language support,30 days of multilingual support",
    "price": "$1,499",
    "href": "/contact"
  },
  {
    "label": "Migration",
    "title": "WooCommerce Migration Services",
    "sub": "Seamless Migration to WooCommerce",
    "desc": "Moving your e-commerce store to WooCommerce? We handle the complete migration process while preserving your SEO rankings, customer data, order history, and ensuring zero downtime.\n\n**Migration Benefits:**\n• Lower ongoing costs compared to SaaS platforms\n• Complete customization freedom\n• Better SEO control and flexibility\n• No transaction fees\n• Unlimited scalability & full data ownership\n\n**Supported Platforms:**\n• Shopify to WooCommerce - Complete store transfer\n• Magento to WooCommerce - Complex catalog migration\n• OpenCart & PrestaShop to WooCommerce\n• BigCommerce & custom platforms\n\n**Timeline:** 1-3 weeks (depending on store size)",
    "features": "Product catalog migration with variations,Customer accounts and order history,Reviews and testimonials,Blog posts and content pages,SEO settings and URL redirects,30 days of dedicated support",
    "price": "$999",
    "href": "/contact"
  }
]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why Choose Us',
          headline: 'Why Choose ARIOSETECH for WooCommerce Development?',
          items: [
            { icon: '🏆', title: 'WordPress + WooCommerce Expertise', desc: 'Deep understanding of both WordPress and WooCommerce ensures seamless integration and optimal performance for your online store.' },
            { icon: '🛒', title: 'E-commerce Focus', desc: 'Specialized in e-commerce development with proven strategies for increasing conversions, average order value, and customer retention.' },
            { icon: '🎨', title: 'Custom Solutions', desc: 'Every WooCommerce store we build is uniquely tailored to your business needs, brand identity, and growth objectives.' },
            { icon: '⚡', title: 'Performance Obsessed', desc: 'We optimize every aspect of your store for speed, ensuring fast loading times that keep customers engaged and improve search rankings.' },
            { icon: '🔒', title: 'Security First', desc: 'Enterprise-grade security measures protect your store and customer data from threats, ensuring trust and compliance.' },
            { icon: '📈', title: 'Growth Partnership', desc: 'We don\'t just build stores; we create growth-focused solutions that scale with your business and support long-term success.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'process',
        props: {
          eyebrow: 'How We Work',
          headline: 'WooCommerce Development Process',
          steps: [
  {
    "n": "01",
    "title": "Discovery & Strategy",
    "sub": "Understand Your Vision",
    "desc": "Business goals and requirements analysis, Target audience and market research, Competitor analysis and benchmarking, Technical requirements planning, E-commerce strategy development",
    "time": "3-5 days"
  },
  {
    "n": "02",
    "title": "Planning & Architecture",
    "sub": "Blueprint for Success",
    "desc": "Site structure and navigation planning, Product catalog organization, User experience wireframes, Design mockups and prototypes, Technical architecture planning",
    "time": "1 week"
  },
  {
    "n": "03",
    "title": "Development & Integration",
    "sub": "Bringing Ideas to Life",
    "desc": "Custom theme development, WooCommerce configuration, Payment and shipping setup, Plugin development and integration, Performance optimization",
    "time": "2-3 weeks"
  },
  {
    "n": "04",
    "title": "Testing & Optimization",
    "sub": "Ensuring Perfection",
    "desc": "Functionality testing across devices, Payment processing verification, Performance and speed testing, Security auditing, User acceptance testing",
    "time": "3-5 days"
  },
  {
    "n": "05",
    "title": "Launch & Support",
    "sub": "Your Success, Our Priority",
    "desc": "Live deployment and monitoring, Staff training and documentation, 30-day support period, Performance monitoring, Growth recommendations",
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
          headline: 'WooCommerce Portfolio Highlights',
          intro: 'Discover how we\'ve helped e-commerce brands scale with custom WooCommerce solutions.',
          ctaLabel: 'View Full WooCommerce Portfolio',
          ctaHref: '/portfolio',
          items: [
            { title: 'The Kapra', client: 'Fashion Brand', platform: 'Custom WooCommerce', result: '300%', resultLabel: 'Revenue growth', quote: 'ARIOSETECH transformed our vision into reality with custom code solutions.', slug: 'portfolio' },
            { title: 'Dr. Scents', client: 'Fragrance Brand', platform: 'Multi-site WooCommerce', result: '32', resultLabel: 'Countries launched', quote: 'Incredible speed and quality. They launched our international operation in 4 months.', slug: 'portfolio' },
            { title: 'GeoMag World', client: 'Educational Toys', platform: 'Custom Catalog WooCommerce', result: '200%', resultLabel: 'AOV increase', quote: 'Managing our global catalog is now effortless.', slug: 'portfolio' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Get Started',
          headline: 'Ready to Start Your WooCommerce Project?',
          subhead: 'Get Your Free WooCommerce Store Consultation',
          desc: 'Discover what\'s holding your store back. Get a complete e-commerce strategy session, platform analysis, project timeline, and a detailed proposal.',
          ctaLabel: 'Book Free Consultation',
          ctaHref: '/contact',
          guarantee: '30-day money-back guarantee | Free post-launch training | Ongoing support available'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'faq',
        props: {
          eyebrow: 'WooCommerce FAQ',
          headline: 'Frequently Asked Questions About WooCommerce',
          items: [
  {
    "q": "How much does a WooCommerce store cost?",
    "a": "Custom WooCommerce development starts at $1,299 for basic stores. Complex stores with advanced features range from $2,000-$5,000+. We provide detailed quotes based on your specific requirements."
  },
  {
    "q": "How long does WooCommerce development take?",
    "a": "Most custom WooCommerce stores are completed within 3-5 weeks. Complex stores with extensive customization may take 6-8 weeks. We provide realistic timelines during consultation."
  },
  {
    "q": "Can you migrate my existing store to WooCommerce?",
    "a": "Yes! We provide complete migration services from Shopify, Magento, and other platforms. Migration typically takes 1-3 weeks depending on store complexity."
  },
  {
    "q": "Is WooCommerce better than Shopify?",
    "a": "WooCommerce offers more customization freedom and lower long-term costs, while Shopify provides easier management. We help you choose based on your specific needs."
  },
  {
    "q": "Do you provide WooCommerce hosting?",
    "a": "We recommend reliable WordPress hosting providers and assist with setup and optimization. We focus on development while partnering with trusted hosting companies."
  },
  {
    "q": "What's included in post-launch support?",
    "a": "All WooCommerce projects include 30 days of free support covering bug fixes, minor adjustments, training, and guidance on store management."
  },
  {
    "q": "Can WooCommerce handle large product catalogs?",
    "a": "Absolutely! WooCommerce can handle thousands of products when properly optimized. We implement performance optimizations for large-scale e-commerce operations."
  },
  {
    "q": "Do you develop custom WooCommerce plugins?",
    "a": "Yes! We develop custom plugins and extensions to add unique functionality to your WooCommerce store that isn't available in existing plugins."
  }
]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'cta',
        props: {
          eyebrow: 'Ready to Launch?',
          headline: 'Start Your WooCommerce Journey Today',
          desc: 'Join successful brands scaling their online stores. Professional results, transparent reporting, and long-term partnership.',
          ctaLabel: 'Schedule Free Consultation',
          ctaHref: '/contact',
          secondaryLabel: 'View Case Studies',
          secondaryHref: '/portfolio',
          trust: 'Starting at $1,299 | 30-Day Money-Back Guarantee | Ongoing Support'
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
              title: 'Professional WooCommerce Development Services | Ariosetech',
              description: 'Build Powerful E-commerce Stores with WordPress & WooCommerce.'
            }
          } 
        }
      )
      return NextResponse.json({ message: 'WooCommerce page updated!' })
    } else {
      await pagesCol.insertOne({
        title: 'WooCommerce Services',
        slug: 'woocommerce',
        parentId: null,
        fullPath: '/services/woocommerce',
        layout: { sections },
        status: 'published',
        seo: {
          title: 'Professional WooCommerce Development Services | Ariosetech',
          description: 'Build Powerful E-commerce Stores with WordPress & WooCommerce.',
          robots: { index: true, follow: true }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return NextResponse.json({ message: 'WooCommerce page created!' })
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}