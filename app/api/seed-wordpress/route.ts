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
    "desc": "Transform your vision into a stunning, high-performing WordPress website. Our custom development approach ensures your site stands out from the competition while delivering exceptional user experience.\n\n**Perfect For:**\n• New businesses launching online\n• Companies needing complete website overhaul\n• Brands requiring unique, custom designs\n• Businesses with specific functionality requirements\n\n**Timeline:** 2-3 weeks",
    "features": "Custom theme development from your designs,Responsive design across all devices,SEO-optimized structure and content,Contact forms and lead generation tools,Social media integration,Google Analytics setup,Basic on-page SEO optimization,30 days of free support",
    "price": "$799",
    "href": "/contact"
  },
  {
    "label": "Migration",
    "title": "WordPress Migration Services",
    "sub": "Seamless Migration Without Downtime",
    "desc": "Moving to WordPress or changing hosts? We handle the entire migration process while ensuring zero data loss and minimal downtime. Your SEO rankings and user experience remain intact.\n\n**Perfect For:**\n• Sites moving from other platforms (Wix, Squarespace, etc.)\n• WordPress to WordPress migrations\n• Hosting provider changes\n• Development to live site transfers\n\n**Timeline:** 3-5 days",
    "features": "Complete site backup and migration,Domain and hosting setup assistance,SSL certificate installation,Email migration (if required),Speed and performance optimization,SEO preservation techniques,Testing across all devices,14 days of post-migration support",
    "price": "$299",
    "href": "/contact"
  },
  {
    "label": "Bugs/Errors",
    "title": "WordPress Bugs/Errors Fixing Services",
    "sub": "Quick Resolution for WordPress Issues",
    "desc": "Is your WordPress site showing errors, broken pages, or strange behavior? Our experts diagnose and fix issues quickly, getting your site back to peak performance.\n\n**Common Issues We Fix:**\n• White screen of death\n• Internal server errors (500 errors)\n• Database connection errors\n• Plugin conflicts and compatibility issues\n• Theme-related problems\n• Broken layouts and design issues\n• Login and admin access problems\n• Email functionality issues\n\n**Perfect For:**\n• Sites experiencing sudden errors\n• Businesses losing revenue due to downtime\n• WordPress sites with plugin conflicts\n• Emergency fixes needed urgently\n\n**Timeline:** 24-48 hours",
    "features": "Comprehensive site diagnosis,Root cause identification,Complete issue resolution,Prevention recommendations,Site backup before fixes,Testing and verification,7 days of monitoring",
    "price": "$149",
    "href": "/contact"
  },
  {
    "label": "Maintenance",
    "title": "WordPress Maintenance & Support",
    "sub": "Keep Your WordPress Site Running Smoothly",
    "desc": "Regular maintenance is crucial for WordPress security, performance, and reliability. Our comprehensive maintenance plans ensure your site stays updated, secure, and optimized.\n\n**Maintenance Plans:**\n• 🥉 Basic Plan - $79/month:\n  - 1 WordPress site\n  - Monthly updates and backups\n  - Basic security monitoring\n  - Email support\n• 🥈 Professional Plan - $149/month:\n  - Up to 3 WordPress sites\n  - Weekly updates and backups\n  - Advanced security features\n  - Performance optimization\n  - Priority email & chat support\n• 🥇 Enterprise Plan - $299/month:\n  - Up to 10 WordPress sites\n  - Real-time monitoring\n  - Advanced security and malware removal\n  - Speed optimization\n  - 24/7 priority support\n  - Monthly performance reports",
    "features": "WordPress core core theme and plugin updates,Security monitoring and malware scans,Database optimization and cleanup,Broken link checks and fixes,Performance monitoring and reporting,Regular backups (stored securely),Uptime monitoring,Priority support for issues",
    "price": "$79/mo",
    "href": "/contact"
  },
  {
    "label": "Speed",
    "title": "WordPress Speed Optimization Services",
    "sub": "Make Your WordPress Site Lightning Fast",
    "desc": "Slow websites lose customers and hurt search rankings. Our speed optimization service can improve your site speed by 40-70%, leading to better user experience and higher conversions.\n\n**Expected Results:**\n• 40-70% faster loading times\n• Improved Google PageSpeed scores\n• Better Core Web Vitals\n• Enhanced user experience\n• Higher search engine rankings\n\n**Timeline:** 5-7 days",
    "features": "Comprehensive speed audit and analysis,Image optimization and compression,Caching implementation and configuration,Database optimization and cleanup,CSS and JavaScript minification,CDN setup and configuration,Server-level optimizations,Core Web Vitals optimization,Mobile speed improvements",
    "price": "$399",
    "href": "/contact"
  },
  {
    "label": "Security",
    "title": "WordPress Security Services",
    "sub": "Protect Your WordPress Site from Threats",
    "desc": "WordPress security is not optional. Our comprehensive security service protects your site from hackers, malware, and other threats while ensuring compliance with security best practices.\n\n**Security Monitoring:**\n• 24/7 threat monitoring\n• Real-time alerts for suspicious activity\n• Automatic malware removal\n• Weekly security reports\n• Blacklist monitoring\n• Vulnerability assessments\n\n**Perfect For:**\n• E-commerce websites\n• Sites handling sensitive data\n• Businesses requiring compliance\n• Sites previously hacked\n• High-traffic WordPress sites\n\n**Timeline:** 3-5 days",
    "features": "Malware scanning and removal,Firewall installation and configuration,Security plugin setup and optimization,Login security enhancements,File permission optimization,Database security improvements,SSL certificate installation,Security headers implementation,Regular security audits",
    "price": "$299",
    "href": "/contact"
  },
  {
    "label": "Virus Removal",
    "title": "WordPress Virus Removal Services",
    "sub": "Fast and Complete Malware Removal",
    "desc": "Is your WordPress site infected with malware or viruses? We provide emergency malware removal services to get your site clean and secure quickly.\n\n**Virus Removal Process:**\n1. Immediate Site Analysis - Identify infection type and scope\n2. Complete Malware Removal - Clean all infected files and database\n3. Security Hardening - Prevent future infections\n4. Blacklist Removal - Get your site off Google/search engine blacklists\n5. Prevention Setup - Install security measures\n6. Monitoring - 30 days of security monitoring\n\n**Emergency Service Available:**\n• Same-day removal for critical cases\n• 24/7 emergency response\n• Money-back guarantee if malware returns\n\n**Timeline:** 24-48 hours",
    "features": "Complete malware scan and removal,Infected file cleaning or replacement,Database cleanup and optimization,Security plugin installation,Firewall configuration,Google Safe Browsing removal,Security recommendations,30-day monitoring period",
    "price": "$199",
    "href": "/contact"
  },
  {
    "label": "Backups",
    "title": "WordPress Backup Solutions",
    "sub": "Never Lose Your WordPress Data Again",
    "desc": "Protect your valuable content and data with automated, reliable backup solutions. Our backup service ensures you can restore your site quickly in case of any emergency.\n\n**Backup Plans:**\n• 📁 Basic Backup - $29/month:\n  - Daily automated backups\n  - 30-day backup retention\n  - One-click restore\n  - Email notifications\n• 📁 Advanced Backup - $59/month:\n  - Real-time backups\n  - 90-day backup retention\n  - Multiple restore points\n  - Priority restoration support\n  - Multiple storage locations\n• 📁 Enterprise Backup - $99/month:\n  - Continuous backups\n  - 1-year backup retention\n  - Instant recovery options\n  - Dedicated backup support\n  - Custom backup schedules",
    "features": "Automated daily backups,Multiple backup storage locations,One-click restore functionality,Database and file backups,Incremental backup options,Backup scheduling flexibility,Encrypted secure storage,Easy backup management",
    "price": "$29/mo",
    "href": "/contact"
  },
  {
    "label": "Redesign",
    "title": "WordPress Website Redesign",
    "sub": "Give Your WordPress Site a Fresh New Look",
    "desc": "Is your WordPress site looking outdated? Our redesign service transforms your existing site with modern design, improved functionality, and a better user experience.\n\n**Redesign Process:**\n1. Current Site Analysis - Audit existing design and functionality\n2. Strategy Development - Plan improvements based on your goals\n3. Design Creation - Create modern, conversion-focused designs\n4. Development - Build the new design on WordPress\n5. Content Migration - Transfer and optimize existing content\n6. Testing & Launch - Ensure everything works perfectly\n7. Training - Show you how to manage your new site\n\n**Before Starting:**\n• Detailed consultation about your goals\n• Competitor analysis\n• User experience audit\n• Technical requirements assessment\n\n**Timeline:** 3-4 weeks",
    "features": "Modern responsive design,Improved user experience,SEO optimization,Speed optimization,Mobile-first approach,Content migration,Basic SEO setup,30 days of support",
    "price": "$1,299",
    "href": "/contact"
  },
  {
    "label": "Multilingual",
    "title": "WordPress Multilingual Websites",
    "sub": "Reach Global Audiences with Multilingual WordPress",
    "desc": "Expand your business globally with professionally developed multilingual WordPress websites. We create seamless multi-language experiences that engage international audiences.\n\n**Supported Solutions:**\n• WPML - Professional multilingual plugin\n• Polylang - Free multilingual solution\n• TranslatePress - Visual translation interface\n• Custom Solutions - Tailored multilingual systems\n\n**Perfect For:**\n• International businesses\n• E-commerce stores selling globally\n• Service providers with global clientele\n• Organizations serving diverse communities\n\n**Timeline:** 2-3 weeks",
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