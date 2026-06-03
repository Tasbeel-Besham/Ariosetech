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
          eyebrow: 'WordPress Services',
          headline: 'Professional WordPress\nDevelopment Services',
          subheadline: 'Display Your Business Online with a WordPress Website',
          desc: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability.',
          ctaPrimaryLabel: 'Get Free WordPress Consultation',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'View WordPress Portfolio',
          ctaSecondaryHref: '/portfolio',
          trust: 'Starting at $799,30-Day Money-Back Guarantee,Free Post-Launch Support',
          codeFilename: 'wp-core / security.ts',
          codeLines: [
            [{ t: 'com', v: '// Executing WordPress security hardening' }],
            [],
            [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'secure_site' }, { t: 'v', v: '() {' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'scan' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'run_malware_scan' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'scan' }, { t: 'v', v: '.' }, { t: 'attr', v: 'vulnerabilities' }, { t: 'v', v: ' > ' }, { t: 'num', v: '0' }, { t: 'v', v: ') {' }],
            [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'patch_core_and_plugins' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  }' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\u2713 Site Secured'" }, { t: 'v', v: ';' }],
            [{ t: 'v', v: '}' }]
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'services-accordion',
        props: {
          eyebrow: 'Our Services',
          headline: 'Complete WordPress Solutions for Every Business Need',
          intro: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.',
          items: [
  {
    "label": "Development",
    "title": "WordPress Website Development",
    "sub": "Build Your Dream Website from Scratch",
    "desc": "Transform your vision into a stunning, high-performing WordPress website. Our custom development approach ensures your site stands out from the competition while delivering exceptional user experience.",
    "features": "Custom theme development from your designs,Responsive design across all devices,SEO-optimized structure and content,Contact forms and lead generation tools,Social media integration,Google Analytics setup,Basic on-page SEO optimization,30 days of free support",
    "price": "$799",
    "href": "/contact"
  },
  {
    "label": "Migration",
    "title": "WordPress Migration Services",
    "sub": "Seamless Migration Without Downtime",
    "desc": "Moving to WordPress or changing hosts? We handle the entire migration process while ensuring zero data loss and minimal downtime. Your SEO rankings and user experience remain intact.",
    "features": "Complete site backup and migration,Domain and hosting setup assistance,SSL certificate installation,Email migration (if required),Speed and performance optimization,SEO preservation techniques,Testing across all devices,14 days of post-migration support",
    "price": "$299",
    "href": "/contact"
  },
  {
    "label": "Bugs/Errors",
    "title": "WordPress Bugs/Errors Fixing Services",
    "sub": "Quick Resolution for WordPress Issues",
    "desc": "Is your WordPress site showing errors, broken pages, or strange behavior? Our experts diagnose and fix issues quickly, getting your site back to peak performance.",
    "features": "White screen of death,Internal server errors (500 errors),Database connection errors,Plugin conflicts and compatibility issues,Theme-related problems,Broken layouts and design issues,Login and admin access problems,Email functionality issues",
    "price": "$149",
    "href": "/contact"
  },
  {
    "label": "Maintenance",
    "title": "WordPress Maintenance & Support",
    "sub": "Keep Your WordPress Site Running Smoothly",
    "desc": "Regular maintenance is crucial for WordPress security, performance, and reliability. Our comprehensive maintenance plans ensure your site stays updated, secure, and optimized.",
    "features": "WordPress core core theme and plugin updates,Security monitoring and malware scans,Database optimization and cleanup,Broken link checks and fixes,Performance monitoring and reporting,Regular backups (stored securely),Uptime monitoring,Priority support for issues",
    "price": "$79/mo",
    "href": "/contact"
  },
  {
    "label": "Speed",
    "title": "WordPress Speed Optimization Services",
    "sub": "Make Your WordPress Site Lightning Fast",
    "desc": "Slow websites lose customers and hurt search rankings. Our speed optimization service can improve your site speed by 40-70%, leading to better user experience and higher conversions.",
    "features": "Comprehensive speed audit and analysis,Image optimization and compression,Caching implementation and configuration,Database optimization and cleanup,CSS and JavaScript minification,CDN setup and configuration,Server-level optimizations,Core Web Vitals optimization,Mobile speed improvements",
    "price": "$399",
    "href": "/contact"
  },
  {
    "label": "Security",
    "title": "WordPress Security Services",
    "sub": "Protect Your WordPress Site from Threats",
    "desc": "WordPress security is not optional. Our comprehensive security service protects your site from hackers, malware, and other threats while ensuring compliance with security best practices.",
    "features": "Malware scanning and removal,Firewall installation and configuration,Security plugin setup and optimization,Login security enhancements,File permission optimization,Database security improvements,SSL certificate installation,Security headers implementation,Regular security audits",
    "price": "$299",
    "href": "/contact"
  },
  {
    "label": "Virus Removal",
    "title": "WordPress Virus Removal Services",
    "sub": "Fast and Complete Malware Removal",
    "desc": "Is your WordPress site infected with malware or viruses? We provide emergency malware removal services to get your site clean and secure quickly.",
    "features": "Complete malware scan and removal,Infected file cleaning or replacement,Database cleanup and optimization,Security plugin installation,Firewall configuration,Google Safe Browsing removal,Security recommendations,30-day monitoring period",
    "price": "$199",
    "href": "/contact"
  },
  {
    "label": "Backups",
    "title": "WordPress Backup Solutions",
    "sub": "Never Lose Your WordPress Data Again",
    "desc": "Protect your valuable content and data with automated, reliable backup solutions. Our backup service ensures you can restore your site quickly in case of any emergency.",
    "features": "Automated daily backups,Multiple backup storage locations,One-click restore functionality,Database and file backups,Incremental backup options,Backup scheduling flexibility,Encrypted secure storage,Easy backup management",
    "price": "$29/mo",
    "href": "/contact"
  },
  {
    "label": "Redesign",
    "title": "WordPress Website Redesign",
    "sub": "Give Your WordPress Site a Fresh New Look",
    "desc": "Is your WordPress site looking outdated? Our redesign service transforms your existing site with modern design, improved functionality, and a better user experience.",
    "features": "Modern responsive design,Improved user experience,SEO optimization,Speed optimization,Mobile-first approach,Content migration,Basic SEO setup,30 days of support",
    "price": "$1,299",
    "href": "/contact"
  },
  {
    "label": "Multilingual",
    "title": "WordPress Multilingual Websites",
    "sub": "Reach Global Audiences with Multilingual WordPress",
    "desc": "Expand your business globally with professionally developed multilingual WordPress websites. We create seamless multi-language experiences that engage international audiences.",
    "features": "Multiple language setup and configuration,Professional translation management,SEO optimization for each language,Currency switcher integration,Language-specific content management,Automatic language detection,Multilingual menu and navigation,International SEO setup",
    "price": "$899",
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
          headline: 'Why Choose ARIOSETECH for WordPress Development?',
          items: [
            { icon: '🏆', title: '7+ Years WordPress Expertise', subhead: 'Proven Track Record', desc: 'We\'ve been perfecting WordPress development since 2017, delivering 50+ successful WordPress projects across various industries.' },
            { icon: '⚡', title: 'Performance-First Approach', subhead: 'Speed & SEO Optimized', desc: 'Every WordPress site we build is optimized for speed, security, and search engines from day one.' },
            { icon: '🔒', title: 'Security-Focused Development', subhead: 'Enterprise Hardening', desc: 'We implement enterprise-grade security measures to protect your WordPress site from threats.' },
            { icon: '📱', title: 'Mobile-First Design', subhead: 'Responsive Layouts', desc: 'All our WordPress sites are built with mobile users in mind, ensuring perfect performance across all devices.' },
            { icon: '🔧', title: 'Ongoing Support', subhead: 'Continuous Care', desc: 'We don\'t just build and leave. Our team provides continuous support to ensure your WordPress site thrives.' },
            { icon: '💰', title: 'Transparent Pricing', subhead: 'No Hidden Costs', desc: 'No hidden costs or surprise fees. Our WordPress development pricing is upfront and honest.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'portfolio',
        props: {
          eyebrow: 'Our Work',
          headline: 'WordPress Portfolio Highlights',
          intro: 'Discover how we\'ve helped businesses grow with custom WordPress solutions.',
          ctaLabel: 'View Full WordPress Portfolio',
          ctaHref: '/portfolio',
          items: [
            { title: 'Corporate Website', client: 'Professional Services', platform: 'Custom WordPress Theme', result: '200%', resultLabel: 'Increase in lead generation', quote: 'Custom WordPress theme with advanced features.', slug: 'portfolio' },
            { title: 'E-commerce Integration', client: 'Retail', platform: 'WooCommerce Integration', result: '150%', resultLabel: 'Increase in online sales', quote: 'WooCommerce integration with custom features.', slug: 'portfolio' },
            { title: 'Multilingual Site', client: 'International Business', platform: 'WPML Multilingual WordPress', result: '300%', resultLabel: 'Increase in international inquiries', quote: 'WPML-powered multilingual WordPress site.', slug: 'portfolio' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Get Started',
          headline: 'Ready to Start Your WordPress Project?',
          subhead: 'Get Your Free WordPress Consultation',
          desc: 'Discover what\'s holding your site back. Get a 30-minute strategy session, WordPress recommendations, project timeline and pricing, and a no-obligation proposal.',
          ctaLabel: 'Book Free Consultation',
          ctaHref: '/contact',
          guarantee: '30-day money-back guarantee on all WordPress development services'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'faq',
        props: {
          eyebrow: 'WordPress FAQ',
          headline: 'Frequently Asked Questions About WordPress',
          items: [
  {
    "q": "How long does WordPress development take?",
    "a": "Most WordPress projects are completed within 2-4 weeks, depending on complexity and requirements."
  },
  {
    "q": "Do you provide WordPress hosting?",
    "a": "We can recommend reliable hosting providers and assist with setup, but we focus on development rather than hosting services."
  },
  {
    "q": "Can you work with existing WordPress sites?",
    "a": "Absolutely! We provide maintenance, optimization, and enhancement services for existing WordPress websites."
  },
  {
    "q": "What's included in post-launch support?",
    "a": "All WordPress projects include 30 days of free support covering bug fixes, minor adjustments, and training."
  },
  {
    "q": "Do you use WordPress page builders?",
    "a": "We prefer custom development for better performance, but can work with page builders like Elementor or Gutenberg when requested."
  },
  {
    "q": "How much does WordPress maintenance cost?",
    "a": "Our maintenance plans start at $79/month and include updates, backups, security monitoring, and support."
  }
]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'cta',
        props: {
          eyebrow: 'Ready to grow your business online?',
          headline: 'Start Your WordPress Journey Today',
          desc: 'Join successful businesses maximizing their online presence. Professional results, transparent reporting, and long-term support.',
          ctaLabel: 'Schedule Free Consultation',
          ctaHref: '/contact',
          secondaryLabel: 'View Case Studies',
          secondaryHref: '/portfolio',
          trust: 'Starting at $799,30-Day Money-Back Guarantee,Free Post-Launch Support'
        }
      }
    ]

    const pagesCol = await getCollection<PageDoc>('pages')
    const existing = await pagesCol.findOne({ fullPath: '/services/wordpress' })

    if (existing) {
      await pagesCol.updateOne(
        { fullPath: '/services/wordpress' }, 
        { 
          $set: { 
            title: 'WordPress Services',
            status: 'published',
            'layout.sections': sections, 
            updatedAt: new Date(),
            seo: {
              title: 'Professional WordPress Development Services | Ariosetech',
              description: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results.'
            }
          } 
        }
      )
      return NextResponse.json({ message: 'WordPress page updated!' })
    } else {
      await pagesCol.insertOne({
        title: 'WordPress Services',
        slug: 'wordpress',
        parentId: null,
        fullPath: '/services/wordpress',
        layout: { sections },
        status: 'published',
        seo: {
          title: 'Professional WordPress Development Services | Ariosetech',
          description: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results.',
          robots: { index: true, follow: true }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return NextResponse.json({ message: 'WordPress page created!' })
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}