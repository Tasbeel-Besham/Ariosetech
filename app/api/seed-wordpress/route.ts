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
          desc: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 100+ businesses worldwide for speed, security, and scalability.',
          ctaPrimaryLabel: 'Get Free WordPress Consultation',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'View WordPress Portfolio',
          ctaSecondaryHref: '/portfolio',
          trust: 'Starting at $799,Fixed-Price Quotes No Surprises,Free Post-Launch Support',
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
    "sub": "Custom Websites Built from Scratch",
    "desc": "Transform your vision into a stunning, high-performing WordPress website. Our custom development ensures your site is speed-optimized, secure, and built to scale with your business growth.",
    "features": "Custom Theme Design,Responsive Layouts,SEO-Ready Structure,Performance Tuning",
    "price": "$799",
    "href": "/contact",
    "bg": "radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0c0a1c,#05050a)",
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><polyline points=\"16 18 22 12 16 6\"></polyline><polyline points=\"8 6 2 12 8 18\"></polyline></svg>"
  },
  {
    "label": "Migration",
    "title": "WordPress Migration Services",
    "sub": "Seamless Migration Without Downtime",
    "desc": "Moving to WordPress or changing hosts? We handle the entire migration process with zero data loss, preserved SEO rankings, and absolute minimal downtime.",
    "features": "Full Database Backup,SSL Setup & Configuration,Domain Transfer Support,SEO Rankings Preservation",
    "price": "$299",
    "href": "/contact",
    "bg": "radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#08081a,#05050a)",
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path><path d=\"M3 21v-5h5\"></path></svg>"
  },
  {
    "label": "Bugs/Errors",
    "title": "WordPress Bug & Error Fixing",
    "sub": "Quick Resolution for Website Issues",
    "desc": "Is your site showing errors, broken pages, or plugin conflicts? Our experts quickly diagnose and resolve database connection issues, layout bugs, and theme crashes.",
    "features": "White Screen Resolution,Plugin Conflict Fixes,Database Connection Repair,Broken Layout Fixes",
    "price": "$149",
    "href": "/contact",
    "bg": "radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0a0818,#05050a)",
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M8 2a4 4 0 0 1 8 0v2H8V2z\"></path><path d=\"M8 10a4 4 0 0 0 8 0V4H8v6z\"></path><path d=\"M6 8h2\"></path><path d=\"M16 8h2\"></path><path d=\"M4 12h4\"></path><path d=\"M16 12h4\"></path><path d=\"M5 16.5l3-1.5\"></path><path d=\"M16 15l3 1.5\"></path><path d=\"M20 20L16 16\"></path><path d=\"M4 20L8 16\"></path></svg>"
  },
  {
    "label": "Maintenance",
    "title": "WordPress Maintenance & Support",
    "sub": "Keep Your Site Safe and Updated",
    "desc": "Proactive care for your WordPress site. We manage regular updates, database cleanups, security scans, and offsite backups so your site runs flawlessly.",
    "features": "Plugin & Theme Updates,Daily Database Backups,24/7 Security Scans,Uptime Monitoring",
    "price": "$79/mo",
    "href": "/contact",
    "bg": "radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0a0818,#05050a)",
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"></path></svg>"
  }
]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Performance & Defense',
          headline: 'WordPress Security & Speed Optimization',
          desc: 'Keep your website loading instantly and fully protected from threats with our performance and security hardening solutions.',
          layout: 'grid',
          items: [
  {
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"></polygon></svg>",
    "title": "WordPress Speed Optimization",
    "subhead": "Make Your Website Lightning Fast",
    "desc": "Slow pages lose sales. We optimize your Core Web Vitals, implement premium caching, compress images, and fine-tune databases to improve speed by 40-70%.",
    "features": "Core Web Vitals Audit,Image Compression,Caching & Minification,Database Optimization",
    "price": "$399",
    "href": "/contact"
  },
  {
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"></path></svg>",
    "title": "WordPress Security Hardening",
    "subhead": "Complete Protection from Online Threats",
    "desc": "Protect your site from hackers, brute force attacks, and injections. We install firewalls, restrict access, and implement enterprise-grade security protocols.",
    "features": "Firewall Configuration,Login Access Hardening,File Integrity Scanning,Vulnerability Assessment",
    "price": "$299",
    "href": "/contact"
  },
  {
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"></path><path d=\"M9.5 9.5l5 5\"></path><path d=\"M14.5 9.5l-5 5\"></path></svg>",
    "title": "WordPress Virus & Malware Removal",
    "subhead": "Emergency Cleanup and Recovery",
    "desc": "If your site gets hacked, we act fast. We scan and clean database tables, replace infected files, remove Google blacklist warnings, and secure vulnerabilities.",
    "features": "Emergency Malware Cleanup,Infected Database Repairs,Blacklist Warning Removal,Post-Cleanup Monitoring",
    "price": "$199",
    "href": "/contact"
  }
]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Scale & Modernize',
          headline: 'WordPress Custom Solutions & Scaling',
          desc: 'Scale your business global, protect your data, and deliver a modern interface with backup, localization, and theme redesign services.',
          layout: 'rows',
          items: [
  {
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"></ellipse><path d=\"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\"></path><path d=\"M3 12c0 1.66 4 3 9 3s9-1.34 9-3\"></path></svg>",
    "title": "WordPress Backup Solutions",
    "subhead": "Secure, Offsite Automated Backups",
    "desc": "Never lose your files or database. We configure automated, redundant, and secure offsite backups with easy, one-click recovery options.",
    "features": "Automated Offsite Backups,Encrypted Secure Storage,Redundant Copy Locations,One-Click Site Restoration",
    "price": "$29/mo",
    "href": "/contact"
  },
  {
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063A2 2 0 0 0 14.063 15.5L12.481 21.635a.5.5 0 0 1-.962 0z\"></path><path d=\"M20 3h4\"></path><path d=\"M22 1v4\"></path><path d=\"M4 17h2\"></path><path d=\"M5 16v2\"></path></svg>",
    "title": "WordPress Website Redesign",
    "subhead": "Fresh, Modern Look for Better Conversion",
    "desc": "Outgrown your current theme? We deliver conversion-focused, modern redesigns with a clean structure, mobile-first responsiveness, and streamlined navigation.",
    "features": "Conversion-Focused UI,Mobile-First Layouts,Seamless Content Transfer,Modern Theme Integration",
    "price": "$1,299",
    "href": "/contact"
  },
  {
    "icon": "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.7\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"></path></svg>",
    "title": "WordPress Multilingual Setup",
    "subhead": "Reach Global Markets with Multiple Languages",
    "desc": "Connect with international audiences. We integrate robust translation systems (WPML, Polylang) optimized for SEO and localized customer experience.",
    "features": "WPML/Polylang Integration,Localized URL Structuring,Language-Specific SEO,Multi-Currency Support",
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
        type: 'process',
        props: {
          eyebrow: 'Our Process',
          headline: 'WordPress Development Process',
          steps: [
  {
    "n": "01",
    "title": "Discovery & Planning",
    "sub": "Understand Your Vision",
    "desc": "Detailed requirement analysis, Technical specifications, Design wireframes, Project timeline",
    "time": "2-3 days"
  },
  {
    "n": "02",
    "title": "Design & Development",
    "sub": "Bringing Ideas to Life",
    "desc": "Custom theme creation, Functionality development, Responsive design implementation, Content integration",
    "time": "1-2 weeks"
  },
  {
    "n": "03",
    "title": "Testing & Optimization",
    "sub": "Ensuring Perfection",
    "desc": "Cross-browser testing, Mobile responsiveness check, Speed optimization, Security testing",
    "time": "3-5 days"
  },
  {
    "n": "04",
    "title": "Launch & Support",
    "sub": "Your Success, Our Priority",
    "desc": "Live deployment, Training session, 30-day support period, Maintenance planning",
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
          guarantee: 'Fixed-price quotes with no surprises \u2014 your quote within 24 hours'
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
          trust: 'Starting at $799,Fixed-Price Quotes No Surprises,Free Post-Launch Support'
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