import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { hashPassword } from '@/lib/auth'
import { ObjectId } from 'mongodb'

let counter = 1
function sec(type: string, props: Record<string, unknown> = {}) {
  return { id: `sec_seed_${counter++}`, type, props, styles: {}, meta: { locked: false, hidden: false } }
}

const SEO_D = { title: '', description: '', keywords: [], canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', twitterTitle: '', twitterDescription: '', twitterImage: '', robots: { index: true, follow: true } }
const PD = { parentId: null, schema: null, relatedPages: [], relatedBlogs: [], slugHistory: [], createdAt: new Date(), updatedAt: new Date() }

const TRUST = '✓ 7+ Years of Excellence,✓ 100+ Successful Projects,✓ 24/7 Expert Support,✓ 30-Day Money-Back Guarantee'
const CTA_TRUST = '✓ No Long-Term Contracts,✓ 30-Day Money-Back Guarantee,✓ Free Post-Launch Support,✓ Transparent Pricing'

const WHY_ITEMS = [
  {
    "icon": "💰",
    "title": "Cost-Effective Excellence",
    "subhead": "Save 60% Without Compromising Quality",
    "desc": "Get premium web development at a fraction of US agency costs. Professional results, affordable pricing, transparent communication."
  },
  {
    "icon": "⚡",
    "title": "Lightning-Fast Delivery",
    "subhead": "From Concept to Launch in 30 Days",
    "desc": "Our streamlined process and dedicated team ensure rapid turnaround without cutting corners. Most projects completed ahead of schedule."
  },
  {
    "icon": "🛡️",
    "title": "Professional Support",
    "subhead": "24/7 Expert Assistance When You Need It",
    "desc": "Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included."
  },
  {
    "icon": "📈",
    "title": "Proven Results",
    "subhead": "Track Record of Growing Businesses",
    "desc": "Our clients see average 150% increase in conversions and 40% improvement in site speed. Real results, measurable impact."
  }
]
const PORTFOLIO_ITEMS = [
  {
    "title": "The Kapra",
    "client": "E-commerce Fashion Store",
    "platform": "Custom WooCommerce",
    "result": "300%",
    "resultLabel": "Increase in online sales",
    "quote": "ARIOSETECH transformed our vision into reality with custom code solutions.",
    "slug": "thekapra"
  },
  {
    "title": "Dr. Scents",
    "client": "International Perfume Online Store",
    "platform": "Multi-site WooCommerce",
    "result": "32",
    "resultLabel": "Countries launched in under 4 months",
    "quote": "Incredible speed and quality. They delivered beyond our expectations.",
    "slug": "drscents"
  },
  {
    "title": "WYOX Sports",
    "client": "USA-Based Sports Equipment",
    "platform": "Shopify + Custom Solutions",
    "result": "250%",
    "resultLabel": "Business growth",
    "quote": "Professional, reliable, and always available when we need them.",
    "slug": "wyox"
  }
]
const TESTIMONIALS = [
  {
    "name": "Dr. Fred Sahafi",
    "role": "Founder of Genovie",
    "initials": "FS",
    "quote": "ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth."
  },
  {
    "name": "Michael Chen",
    "role": "CEO of GeoMag World",
    "initials": "MC",
    "quote": "Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom WooCommerce solution that perfectly fits our business model."
  },
  {
    "name": "Muhammad Hannan",
    "role": "Director of Janya.pk",
    "initials": "MH",
    "quote": "Fast, reliable, and cost-effective. ARIOSETECH helped us launch our wholesale platform on Shopify ahead of schedule and under budget."
  }
]
const PROCESS_STEPS = [
  {
    "n": "01",
    "title": "Discovery & Strategy",
    "sub": "Understand Your Vision",
    "desc": "We start with a comprehensive consultation to understand your business goals, target audience, and technical requirements.",
    "time": "1-2 days"
  },
  {
    "n": "02",
    "title": "Planning & Design",
    "sub": "Blueprint for Success",
    "desc": "Detailed project planning, wireframing, and design mockups that align with your brand and conversion goals.",
    "time": "3-5 days"
  },
  {
    "n": "03",
    "title": "Development",
    "sub": "Bringing Ideas to Life",
    "desc": "Expert development using best practices, clean code, and scalable architecture that grows with your business.",
    "time": "15-20 days"
  },
  {
    "n": "04",
    "title": "Testing & Optimization",
    "sub": "Ensuring Perfection",
    "desc": "Rigorous testing across devices, speed optimization, and security checks before launch.",
    "time": "3-5 days"
  },
  {
    "n": "05",
    "title": "Launch & Support",
    "sub": "Your Success, Our Priority",
    "desc": "Smooth launch with comprehensive training and ongoing support to ensure continuous success.",
    "time": "Ongoing"
  }
]
const HOW_IT_WORKS = [
  {
    "n": "01",
    "title": "Discovery & Strategy",
    "sub": "Understand Your Vision",
    "desc": "We kick off with a deep-dive consultation to understand your business goals, target audience, tech stack, and growth plans — so every decision is rooted in strategy."
  },
  {
    "n": "02",
    "title": "Planning & Design",
    "sub": "Blueprint for Success",
    "desc": "Detailed project roadmaps, wireframes, and pixel-perfect design mockups that align with your brand identity and maximize conversion at every touchpoint."
  },
  {
    "n": "03",
    "title": "Development",
    "sub": "Bringing Ideas to Life",
    "desc": "Expert WordPress, Shopify, or WooCommerce development using clean code, reusable components, and scalable architecture built to grow with your business."
  },
  {
    "n": "04",
    "title": "Testing & Optimization",
    "sub": "Ensuring Perfection",
    "desc": "Rigorous cross-device QA, speed optimization via Core Web Vitals, security hardening, and SEO validation — nothing ships until it's flawless."
  },
  {
    "n": "05",
    "title": "Launch & Scale",
    "sub": "Your Success, Our Priority",
    "desc": "A smooth go-live, comprehensive handover training, and 30 days of free post-launch support. After that, flexible monthly plans keep your site at peak performance."
  }
]

const homeLayout = { sections: [
  sec('hero-interactive', { eyebrow: '✓ 7+ Years of Excellence', headline: 'Professional WordPress, Shopify & WooCommerce Development Since 2017', subheadline: "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.", desc: 'Trusted by businesses in the USA, UAE, and Switzerland for affordable, high-quality web development that delivers real ROI.', ctaPrimaryLabel: 'Get Free Quote & Strategy Call', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View Our Portfolio', ctaSecondaryHref: '/portfolio', trust: TRUST, stats: [{ value: '100+', label: 'Projects Delivered' }, { value: '7+', label: 'Years Experience' }, { value: '98%', label: 'Client Satisfaction' }, { value: '40+', label: 'Industries Served' }] }),
  sec('logos', { label: 'Trusted by 100+ businesses', items: ['The Kapra','Dr. Scents','Janya.pk','GeoMag World','Genovie','WYOX Sports','Snap Glam Spa','CTV Promo','US Bidding Estimating','CMA Digital','Zoom PC Hire','Ocean Tech BPO','Staffing Ocean','BGMG Cosmetics','Accident Law','Fabric Wholesale'].map(value => ({ value })) }),
  sec('services-accordion', { eyebrow: 'What We Offer', headline: 'Comprehensive Web Development Solutions for Your Business Growth', intro: "Three core platforms. One expert team. We don't dabble — we specialise so you get the best results every time.", items: [
    { label: 'WordPress', title: 'WordPress Development', sub: 'Build Powerful, Scalable Websites', desc: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.', features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services', price: '$799', href: '/services/wordpress', bg: 'radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0c0a1c,#05050a)', icon: '' },
    { label: 'WooCommerce', title: 'WooCommerce Development', sub: 'Launch Your Dream E-commerce Store', desc: 'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.', features: 'Store Setup & Customization,Payment Gateway Integration,Multi-vendor Solutions,Performance Optimization', price: '$1,299', href: '/services/woocommerce', bg: 'radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#08081a,#05050a)', icon: '' },
    { label: 'Shopify', title: 'Shopify Development', sub: 'Scale Your Business with Shopify', desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.', features: 'Custom Store Development,Shopify Plus Solutions,App Integration,Conversion Optimization', price: '$999', href: '/services/shopify', bg: 'radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0a0818,#05050a)', icon: '' }
  ]}),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success', items: WHY_ITEMS }),
  sec('impact', { eyebrow: 'Results That Matter', headline: 'The Impact, Quantified', subheadline: "Numbers don't lie. Here's what working with ARIOSETECH actually delivers for your business.", items: [{ value: '150%', label: 'Avg Conversion Lift', desc: 'Our tailored e-commerce strategies and optimized UX consistently drive 150%+ conversion improvements for clients.' }, { value: '98%', label: 'Client Satisfaction', desc: 'Every project is delivered with near-perfect precision — on time, on spec, and fully aligned with your business goals.' }, { value: '40%', label: 'Site Speed Gain', desc: 'Performance-first builds mean faster stores, better SEO rankings, and higher revenue from the same traffic.' }] }),
  sec('howitworks', { eyebrow: 'Our Process', headline: 'How It Works', subheadline: 'From setup to scale — a proven 5-step process that takes you from idea to a live, high-performing site.', items: HOW_IT_WORKS }),
  sec('approach', { eyebrow: "Why We're Different", headline: "Our", scrambleWord: "Approach", items: [
    { n: '01', title: 'COST-EFFECTIVE', sub: 'Save 60% Without Compromising Quality', desc: 'Premium web development at a fraction of US agency costs. Professional results, transparent pricing, zero compromise on quality.' },
    { n: '02', title: 'TRANSPARENT', sub: 'Open Communication at Every Step', desc: 'We share project progress, insights, and feedback in real-time so you always know exactly where your investment stands.' },
    { n: '03', title: 'RELIABLE', sub: 'Consistently Delivered. Always On-Time.', desc: '100+ projects delivered on time and within budget. Our clients come back because our track record speaks for itself.' },
    { n: '04', title: 'SCALABLE', sub: 'Built to Grow With Your Business', desc: 'Every site we build is architected for scale — whether you launch small or enterprise-level, our code grows seamlessly with your business.' },
    { n: '05', title: 'SUPPORTED', sub: '24/7 Expert Assistance, Always On', desc: 'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included in every plan.' }
  ]}),
  sec('portfolio', { eyebrow: 'Our Work', headline: 'Success Stories That Speak for Themselves', intro: "Discover how we've transformed businesses across industries with custom web solutions that drive growth and maximize ROI.", items: PORTFOLIO_ITEMS, ctaLabel: 'Explore All Projects', ctaHref: '/portfolio' }),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('process', { eyebrow: 'How We Work', headline: 'Your Success Journey in 5 Simple Steps', items: PROCESS_STEPS }),
  sec('audit', { eyebrow: 'Free Audit', headline: 'Get Your Free Website Performance Audit', subheadline: "Discover what's holding your website back from peak performance.", desc: "Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.", note: 'No spam, ever. Detailed report delivered within 24 hours.', ctaLabel: 'Get My Free Audit Report', ctaHref: '/contact', items: [{ value: 'Performance bottleneck analysis' }, { value: 'SEO issues & keyword opportunities' }, { value: 'Conversion barrier identification' }, { value: 'Security vulnerability check' }, { value: 'Mobile experience assessment' }, { value: 'Detailed action plan — no obligation' }] }),
  sec('blog', { eyebrow: 'Knowledge Base', headline: 'Latest Insights & Tutorials', ctaLabel: 'All Articles', ctaHref: '/blog', limit: 3 }),
  sec('faq', { eyebrow: 'FAQ', headline: 'Frequently Asked Questions', subheadline: "Can't find what you're looking for? We're here to help.", ctaLabel: 'Ask Us Anything', ctaHref: '/contact', items: [
    { q: 'How long does a WordPress website take?', a: 'Most WordPress websites are completed within 2-4 weeks, depending on complexity and requirements. Complex projects may take 4-6 weeks.' },
    { q: 'What is included in your maintenance plans?', a: 'Our maintenance plans include regular updates, security monitoring, performance optimization, backup management, and priority support. Plans start at $79/month.' },
    { q: 'Do you offer a money-back guarantee?', a: "Yes. We offer a 30-day money-back guarantee on all our development projects. If you're not satisfied, we'll refund you in full." },
    { q: 'Can you work with my existing WordPress site?', a: 'Absolutely. We work with existing WordPress sites for redesigns, migrations, speed optimization, security fixes, and feature additions.' },
    { q: 'Do you offer ongoing support after launch?', a: 'Yes. Every project includes 30 days of free post-launch support. After that, we offer flexible monthly maintenance plans starting at $79/month.' },
    { q: 'Can you migrate my existing store to Shopify or WooCommerce?', a: 'Yes! We provide complete migration services from all major e-commerce platforms including Shopify, WooCommerce, Magento, BigCommerce, and custom solutions.' }
  ]}),
  sec('cta', { eyebrow: 'Get Started Today', headline: 'Start Your Success Story Today', subheadline: 'Join 100+ successful businesses that chose ARIOSETECH for their web development needs. Professional results, affordable pricing, and ongoing support.', ctaPrimaryLabel: 'Schedule Free Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'Download Our Service Guide', ctaSecondaryHref: '/portfolio', tags: 'No Long-Term Contracts,30-Day Money-Back Guarantee,Free Post-Launch Support,Transparent Pricing' }),
]}

const wordpressLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'WordPress Services', headline: 'Professional WordPress\nDevelopment Services', subheadline: 'Display Your Business Online with a WordPress Website', desc: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability.', ctaPrimaryLabel: 'Get Free WordPress Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View WordPress Portfolio', ctaSecondaryHref: '/portfolio', trust: 'Starting at $799,30-Day Money-Back Guarantee,Free Post-Launch Support', codeFilename: 'wp-core / security.ts', codeLines: [[{ t: 'com', v: '// Executing WordPress security hardening' }], [], [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'secure_site' }, { t: 'v', v: '() {' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'scan' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'run_malware_scan' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'scan' }, { t: 'v', v: '.' }, { t: 'attr', v: 'vulnerabilities' }, { t: 'v', v: ' > ' }, { t: 'num', v: '0' }, { t: 'v', v: ') {' }], [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'patch_core_and_plugins' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  }' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\u2713 Site Secured'" }, { t: 'v', v: ';' }], [{ t: 'v', v: '}' }]] }),
  sec('services-accordion', { eyebrow: 'Our Services', headline: 'Complete WordPress Solutions for Every Business Need', intro: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.', items: [
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
] }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why Choose ARIOSETECH for WordPress Development?', items: [
    { icon: '🏆', title: '7+ Years WordPress Expertise', subhead: 'Proven Track Record', desc: 'We\'ve been perfecting WordPress development since 2017, delivering 50+ successful WordPress projects across various industries.' },
    { icon: '⚡', title: 'Performance-First Approach', subhead: 'Speed & SEO Optimized', desc: 'Every WordPress site we build is optimized for speed, security, and search engines from day one.' },
    { icon: '🔒', title: 'Security-Focused Development', subhead: 'Enterprise Hardening', desc: 'We implement enterprise-grade security measures to protect your WordPress site from threats.' },
    { icon: '📱', title: 'Mobile-First Design', subhead: 'Responsive Layouts', desc: 'All our WordPress sites are built with mobile users in mind, ensuring perfect performance across all devices.' },
    { icon: '🔧', title: 'Ongoing Support', subhead: 'Continuous Care', desc: 'We don\'t just build and leave. Our team provides continuous support to ensure your WordPress site thrives.' },
    { icon: '💰', title: 'Transparent Pricing', subhead: 'No Hidden Costs', desc: 'No hidden costs or surprise fees. Our WordPress development pricing is upfront and honest.' }
  ]}),
  sec('portfolio', { eyebrow: 'Our Work', headline: 'WordPress Portfolio Highlights', intro: 'Discover how we\'ve helped businesses grow with custom WordPress solutions.', ctaLabel: 'View Full WordPress Portfolio', ctaHref: '/portfolio', items: [{ title: 'Corporate Website', client: 'Professional Services', platform: 'Custom WordPress Theme', result: '200%', resultLabel: 'Increase in lead generation', quote: 'Custom WordPress theme with advanced features.', slug: 'portfolio' }, { title: 'E-commerce Integration', client: 'Retail', platform: 'WooCommerce Integration', result: '150%', resultLabel: 'Increase in online sales', quote: 'WooCommerce integration with custom features.', slug: 'portfolio' }, { title: 'Multilingual Site', client: 'International Business', platform: 'WPML Multilingual WordPress', result: '300%', resultLabel: 'Increase in international inquiries', quote: 'WPML-powered multilingual WordPress site.', slug: 'portfolio' }] }),
  sec('audit', { eyebrow: 'Get Started', headline: 'Ready to Start Your WordPress Project?', subhead: 'Get Your Free WordPress Consultation', desc: 'Discover what\'s holding your site back. Get a 30-minute strategy session, WordPress recommendations, project timeline and pricing, and a no-obligation proposal.', ctaLabel: 'Book Free Consultation', ctaHref: '/contact', guarantee: '30-day money-back guarantee on all WordPress development services' }),
  sec('faq', { eyebrow: 'WordPress FAQ', headline: 'Frequently Asked Questions About WordPress', items: [
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
] }),
  sec('cta', { eyebrow: 'Ready to grow your business online?', headline: 'Start Your WordPress Journey Today', desc: 'Join successful businesses maximizing their online presence. Professional results, transparent reporting, and long-term support.', ctaLabel: 'Schedule Free Consultation', ctaHref: '/contact', secondaryLabel: 'View Case Studies', secondaryHref: '/portfolio', trust: 'Starting at $799,30-Day Money-Back Guarantee,Free Post-Launch Support' })
]}

const shopifyLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'Shopify Services', headline: 'Professional Shopify\nDevelopment Services', subheadline: 'Scale Your E-commerce Business with Expert Shopify Solutions', desc: 'From startup stores to enterprise Shopify Plus platforms, we create high-converting e-commerce experiences that drive sales. Trusted by 30+ Shopify businesses worldwide for exceptional design, functionality, and growth.', ctaPrimaryLabel: 'Get Free Shopify Store Audit', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View Shopify Portfolio', ctaSecondaryHref: '/portfolio', trust: 'Starting at $999,30-Day Money-Back Guarantee,Free Post-Launch Training', codeFilename: 'shopify-conversion / optimize.ts', codeLines: [[{ t: 'com', v: '// Executing Shopify conversion optimization' }], [], [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_store' }, { t: 'v', v: '() {' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'store' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'analyze_checkout' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'store' }, { t: 'v', v: '.' }, { t: 'attr', v: 'bounce_rate' }, { t: 'v', v: ' > ' }, { t: 'str', v: "'40%'" }, { t: 'v', v: ') {' }], [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'implement_fast_checkout' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  }' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\u2713 Sales Increased'" }, { t: 'v', v: ';' }], [{ t: 'v', v: '}' }]] }),
  sec('services-accordion', { eyebrow: 'Our Services', headline: 'Complete Shopify Solutions for E-commerce Success', intro: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.', items: [
  {
    "label": "Development",
    "title": "Shopify Store Development",
    "sub": "Launch Your Dream E-commerce Store",
    "desc": "Transform your business idea into a profitable Shopify store. Our custom development approach creates unique, high-converting stores that capture your brand essence and drive sales from day one.",
    "features": "Custom Shopify theme development,Responsive design across all devices,Product catalog setup and optimization,Payment gateway integration,Shipping configuration and tax setup,30 days of free support",
    "price": "$999",
    "href": "/contact"
  },
  {
    "label": "Migration",
    "title": "Shopify Migration Services",
    "sub": "Seamless Migration to Shopify",
    "desc": "Moving your e-commerce store to Shopify? We handle the complete migration process while preserving your SEO rankings, customer data, and sales history. Zero downtime, zero data loss guaranteed.",
    "features": "All product data and images,Customer accounts and order history,Blog posts and pages,SEO settings and redirects,Reviews and testimonials,30 days of post-migration support",
    "price": "$799",
    "href": "/contact"
  },
  {
    "label": "Optimization",
    "title": "Shopify Performance Optimization",
    "sub": "Maximize Your Store's Speed and Conversions",
    "desc": "Slow Shopify stores lose customers and sales. Our performance optimization service can improve your store speed by 40-60%, leading to higher conversions and better customer experience.",
    "features": "Comprehensive speed audit and analysis,Image optimization and compression,Code optimization and cleanup,App performance review and optimization,Theme speed enhancements,Core Web Vitals improvement",
    "price": "$599",
    "href": "/contact"
  },
  {
    "label": "Integration",
    "title": "Shopify Integration Services",
    "sub": "Connect Your Store with Essential Business Tools",
    "desc": "Streamline your operations by integrating your Shopify store with essential business tools and third-party services. Automate workflows and improve efficiency across your entire business.",
    "features": "Google Analytics 4 setup,Klaviyo setup and automation,ShipStation integration,QuickBooks integration,Xero accounting connection,Custom API development for custom tools",
    "price": "$399",
    "href": "/contact"
  },
  {
    "label": "Maintenance",
    "title": "Shopify Maintenance & Support",
    "sub": "Keep Your Shopify Store Running Smoothly",
    "desc": "Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your Shopify store stays updated, secure, and optimized for peak performance.",
    "features": "Regular theme and app updates,Security monitoring and protection,Performance monitoring and optimization,Broken link checks and fixes,Product data backup and security,Priority technical support",
    "price": "$99/mo",
    "href": "/contact"
  },
  {
    "label": "Shopify Plus",
    "title": "Shopify Plus Development",
    "sub": "Enterprise E-commerce Solutions with Shopify Plus",
    "desc": "Scale your high-volume business with Shopify Plus. We specialize in complex enterprise implementations, custom functionality, and advanced integrations that support rapid growth and global expansion.",
    "features": "Custom Theme Development for enterprise brands,ERP and CRM advanced integrations,B2B wholesale portals and pricing,Multi-store and multi-currency support,Custom app development,API-first architecture",
    "price": "$2,999",
    "href": "/contact"
  },
  {
    "label": "Redesign",
    "title": "Shopify Store Redesign",
    "sub": "Transform Your Store for Maximum Conversions",
    "desc": "Is your Shopify store underperforming? Our redesign service combines modern design with conversion optimization to create stores that not only look amazing but also drive more sales.",
    "features": "Modern mobile-first design,Conversion rate optimization,User experience improvements,Page speed optimization,SEO structure enhancement,30 days of support",
    "price": "$1,499",
    "href": "/contact"
  },
  {
    "label": "App Dev",
    "title": "Shopify App Development",
    "sub": "Custom Apps for Unique Business Needs",
    "desc": "Need functionality that doesn't exist? We develop custom Shopify apps tailored to your specific requirements, giving you competitive advantages and streamlined operations.",
    "features": "Public & private apps development,Custom product configurators,Subscription and recurring billing,Loyalty and rewards programs,Advanced search and filtering,Polaris design standard compliance",
    "price": "$1,999",
    "href": "/contact"
  }
] }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why Choose ARIOSETECH for Shopify Development?', items: [
    { icon: '🏆', title: 'Shopify Partner Excellence', subhead: 'Official Shopify Partners', desc: 'Official Shopify Partners with proven expertise in building successful e-commerce stores across various industries.' },
    { icon: '💰', title: 'Conversion-Focused Approach', subhead: 'Optimized for Sales', desc: 'Every store we build is optimized for sales with proven conversion tactics and user experience best practices.' },
    { icon: '🚀', title: 'Shopify Plus Certified', subhead: 'Enterprise Ready', desc: 'Specialized expertise in enterprise-level Shopify Plus implementations for high-growth businesses.' },
    { icon: '📱', title: 'Mobile-Commerce Experts', subhead: 'Responsive Everywhere', desc: 'Deep understanding of mobile shopping behaviors ensures your store performs perfectly on all devices.' },
    { icon: '🔧', title: 'Ongoing Partnership', subhead: 'Long-term Growth', desc: 'We\'re your long-term Shopify growth partner, supporting your business at every stage of expansion.' },
    { icon: '⚡', title: 'Performance Obsessed', subhead: 'Fast & SEO Friendly', desc: 'Every Shopify store we develop loads fast and ranks well in search engines.' }
  ]}),
  sec('portfolio', { eyebrow: 'Our Work', headline: 'Shopify Portfolio Highlights', intro: 'Discover how we\'ve helped e-commerce brands scale with custom Shopify developments.', ctaLabel: 'View Full Shopify Portfolio', ctaHref: '/portfolio', items: [{ title: 'WYOX Sports', client: 'USA Sports Equipment', platform: 'Shopify + Custom Solutions', result: '250%', resultLabel: 'Business growth', quote: 'Professional, reliable, and always available when we need them.', slug: 'portfolio' }, { title: 'Genovie', client: 'Skincare Brand', platform: 'Shopify Plus Custom Store', result: '180%', resultLabel: 'AOV increase', quote: 'Incredible personalization and seamless user experience.', slug: 'portfolio' }, { title: 'Janya.pk', client: 'Wholesale Fashion', platform: 'Shopify Plus Wholesale', result: '300%', resultLabel: 'Increase in wholesale orders', quote: 'Smooth B2B integration and automated commission payments.', slug: 'portfolio' }] }),
  sec('audit', { eyebrow: 'Get Started', headline: 'Ready to Start Your Shopify Project?', subhead: 'Get Your Free Shopify Store Audit', desc: 'Discover what\'s holding your store back. Get a complete store performance analysis, conversion rate recommendations, and a detailed project proposal.', ctaLabel: 'Get Free Store Audit', ctaHref: '/contact', guarantee: '30-day money-back guarantee | Free post-launch training | Ongoing support available' }),
  sec('faq', { eyebrow: 'Shopify FAQ', headline: 'Frequently Asked Questions About Shopify', items: [
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
] }),
  sec('cta', { eyebrow: 'Ready to grow?', headline: 'Start Your Shopify Journey Today', desc: 'Join successful brands scaling their online stores. Professional results, transparent reporting, and long-term partnership.', ctaLabel: 'Schedule Free Consultation', ctaHref: '/contact', secondaryLabel: 'View Case Studies', secondaryHref: '/portfolio', trust: 'Shopify Partner | 30-Day Money-Back Guarantee | Ongoing Support' })
]}

const woocommerceLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'WooCommerce Services', headline: 'Professional WooCommerce\nDevelopment Services', subheadline: 'Build Powerful E-commerce Stores with WordPress & WooCommerce', desc: 'Transform your WordPress site into a powerful online store that drives sales. We create custom WooCommerce solutions that combine the flexibility of WordPress with robust e-commerce functionality. Trusted by 40+ businesses worldwide for exceptional performance and growth.', ctaPrimaryLabel: 'Get Free WooCommerce Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View WooCommerce Portfolio', ctaSecondaryHref: '/portfolio', trust: 'Starting at $1,299,30-Day Money-Back Guarantee,Free Post-Launch Training', codeFilename: 'woocommerce-scaling / optimize.ts', codeLines: [[{ t: 'com', v: '// Executing WooCommerce scaling optimization' }], [], [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_checkout' }, { t: 'v', v: '() {' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'store' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'analyze_performance' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'store' }, { t: 'v', v: '.' }, { t: 'attr', v: 'load_time' }, { t: 'v', v: ' > ' }, { t: 'str', v: "'2s'" }, { t: 'v', v: ') {' }], [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'implement_caching' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  }' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\u2713 Performance Optimized'" }, { t: 'v', v: ';' }], [{ t: 'v', v: '}' }]] }),
  sec('services-accordion', { eyebrow: 'Our Services', headline: 'Complete WooCommerce Solutions for E-commerce Success', intro: 'Custom WooCommerce solutions with seamless payment integration and conversion optimization.', items: [
  {
    "label": "Development",
    "title": "WooCommerce Website Development Services",
    "sub": "Launch Your Ultimate E-commerce Store",
    "desc": "Build a powerful online store that leverages the best of WordPress and WooCommerce. Our custom development creates unique, high-converting stores that perfectly match your brand and business requirements.",
    "features": "Custom WooCommerce theme development,Responsive design across all devices,Complete product catalog setup,Payment gateway integration,Shipping zones and tax configuration,30 days of free support",
    "price": "$1,299",
    "href": "/contact"
  },
  {
    "label": "Customization",
    "title": "WooCommerce Theme Customization",
    "sub": "Transform Your Store with Custom Design",
    "desc": "Make your WooCommerce store stand out with completely custom theme development or extensive customization of existing themes. We create unique shopping experiences that reflect your brand and drive conversions.",
    "features": "Complete theme redesign and development,Custom homepage and product page layouts,Brand-specific color schemes and typography,Custom icons and graphics integration,Advanced product display options,30 days of design support",
    "price": "$899",
    "href": "/contact"
  },
  {
    "label": "Payments",
    "title": "WooCommerce Payment Gateway Integration",
    "sub": "Secure, Seamless Payment Processing",
    "desc": "Offer your customers the payment methods they prefer with secure, reliable payment gateway integrations. We implement and optimize payment systems that reduce cart abandonment and increase conversions.",
    "features": "Stripe and PayPal integration,Square online payments,Authorize.net integration,Local gateways (JazzCash EasyPaisa),SSL certificate implementation,30 days of payment support",
    "price": "$299",
    "href": "/contact"
  },
  {
    "label": "Performance",
    "title": "WooCommerce Performance Optimization",
    "sub": "Maximize Speed, Sales, and Search Rankings",
    "desc": "Slow e-commerce sites lose customers and sales. Our comprehensive optimization service can improve your WooCommerce store speed by 50-70%, leading to higher conversions, better user experience, and improved search rankings.",
    "features": "Database query optimization,Image compression and optimization,Caching implementation (page object browser),CDN setup and configuration,Server-level optimizations,Core Web Vitals check",
    "price": "$699",
    "href": "/contact"
  },
  {
    "label": "Maintenance",
    "title": "WooCommerce Maintenance & Support",
    "sub": "Keep Your Store Running Smoothly",
    "desc": "Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your WooCommerce store stays updated, secure, and optimized for peak performance.",
    "features": "WordPress and WooCommerce core updates,Plugin and theme updates,Security monitoring and hardening,Performance monitoring and optimization,Database optimization and cleanup,Uptime monitoring & backups",
    "price": "$129/mo",
    "href": "/contact"
  },
  {
    "label": "Multi-vendor",
    "title": "WooCommerce Multi-vendor Solutions",
    "sub": "Create Your Own E-commerce Marketplace",
    "desc": "Transform your WooCommerce store into a thriving multi-vendor marketplace where multiple sellers can list and sell their products. Perfect for creating Amazon-like platforms or expanding your business model.",
    "features": "Vendor registration and approval system,Individual vendor dashboards,Vendor commission management,Automated commission calculations,Multiple payout methods,30 days of marketplace support",
    "price": "$1,999",
    "href": "/contact"
  },
  {
    "label": "Multilingual",
    "title": "WooCommerce Multilingual Websites",
    "sub": "Expand Globally with Multilingual E-commerce",
    "desc": "Reach international customers with professionally developed multilingual WooCommerce stores. We create seamless multi-language shopping experiences that engage global audiences and drive international sales.",
    "features": "Multiple language setup (unlimited),Multi-currency and localization setup,Location-based pricing,Country-specific payment methods,RTL language support,30 days of multilingual support",
    "price": "$1,499",
    "href": "/contact"
  },
  {
    "label": "Migration",
    "title": "WooCommerce Migration Services",
    "sub": "Seamless Migration to WooCommerce",
    "desc": "Moving your e-commerce store to WooCommerce? We handle the complete migration process while preserving your SEO rankings, customer data, order history, and ensuring zero downtime.",
    "features": "Product catalog migration with variations,Customer accounts and order history,Reviews and testimonials,Blog posts and content pages,SEO settings and URL redirects,30 days of dedicated support",
    "price": "$999",
    "href": "/contact"
  }
] }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why Choose ARIOSETECH for WooCommerce Development?', items: [
    { icon: '🏆', title: 'WordPress + WooCommerce Expertise', desc: 'Deep understanding of both WordPress and WooCommerce ensures seamless integration and optimal performance for your online store.' },
    { icon: '🛒', title: 'E-commerce Focus', desc: 'Specialized in e-commerce development with proven strategies for increasing conversions, average order value, and customer retention.' },
    { icon: '🎨', title: 'Custom Solutions', desc: 'Every WooCommerce store we build is uniquely tailored to your business needs, brand identity, and growth objectives.' },
    { icon: '⚡', title: 'Performance Obsessed', desc: 'We optimize every aspect of your store for speed, ensuring fast loading times that keep customers engaged and improve search rankings.' },
    { icon: '🔒', title: 'Security First', desc: 'Enterprise-grade security measures protect your store and customer data from threats, ensuring trust and compliance.' },
    { icon: '📈', title: 'Growth Partnership', desc: 'We don\'t just build stores; we create growth-focused solutions that scale with your business and support long-term success.' }
  ]}),
  sec('portfolio', { eyebrow: 'Our Work', headline: 'WooCommerce Portfolio Highlights', intro: 'Discover how we\'ve helped e-commerce brands scale with custom WooCommerce solutions.', ctaLabel: 'View Full WooCommerce Portfolio', ctaHref: '/portfolio', items: [{ title: 'The Kapra', client: 'Fashion Brand', platform: 'Custom WooCommerce', result: '300%', resultLabel: 'Revenue growth', quote: 'ARIOSETECH transformed our vision into reality with custom code solutions.', slug: 'portfolio' }, { title: 'Dr. Scents', client: 'Fragrance Brand', platform: 'Multi-site WooCommerce', result: '32', resultLabel: 'Countries launched', quote: 'Incredible speed and quality. They launched our international operation in 4 months.', slug: 'portfolio' }, { title: 'GeoMag World', client: 'Educational Toys', platform: 'Custom Catalog WooCommerce', result: '200%', resultLabel: 'AOV increase', quote: 'Managing our global catalog is now effortless.', slug: 'portfolio' }] }),
  sec('audit', { eyebrow: 'Get Started', headline: 'Ready to Start Your WooCommerce Project?', subhead: 'Get Your Free WooCommerce Store Consultation', desc: 'Discover what\'s holding your store back. Get a complete e-commerce strategy session, platform analysis, project timeline, and a detailed proposal.', ctaLabel: 'Book Free Consultation', ctaHref: '/contact', guarantee: '30-day money-back guarantee | Free post-launch training | Ongoing support available' }),
  sec('faq', { eyebrow: 'WooCommerce FAQ', headline: 'Frequently Asked Questions About WooCommerce', items: [
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
] }),
  sec('cta', { eyebrow: 'Ready to Launch?', headline: 'Start Your WooCommerce Journey Today', desc: 'Join successful brands scaling their online stores. Professional results, transparent reporting, and long-term partnership.', ctaLabel: 'Schedule Free Consultation', ctaHref: '/contact', secondaryLabel: 'View Case Studies', secondaryHref: '/portfolio', trust: 'Starting at $1,299 | 30-Day Money-Back Guarantee | Ongoing Support' })
]}

const seoLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'SEO Services for Growing Brands', headline: 'SEO Services That Help\nYour Business Get Found', subheadline: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance.', desc: 'From technical fixes to local SEO and content strategy, we build a stronger search presence that supports real business growth.', ctaPrimaryLabel: 'Book a Free SEO Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'Get a Website Audit', ctaSecondaryHref: '/contact', trust: 'Website SEO \u2022 Local SEO \u2022 Technical SEO \u2022 SEO Content', codeFilename: 'seo-analysis / ranking.ts', codeLines: [[{ t: 'com', v: '// Executing technical SEO audit' }], [], [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_rankings' }, { t: 'v', v: '() {' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'audit' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'run_technical_audit' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'audit' }, { t: 'v', v: '.' }, { t: 'attr', v: 'core_web_vitals' }, { t: 'v', v: ' === ' }, { t: 'str', v: "'poor'" }, { t: 'v', v: ') {' }], [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'optimize_performance' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  }' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\u2713 Rankings Improved'" }, { t: 'v', v: ';' }], [{ t: 'v', v: '}' }]] }),
  sec('services-accordion', { eyebrow: 'Our Services', headline: 'Our SEO Services', intro: 'We offer focused SEO solutions built to improve search visibility, site performance, and growth potential.', items: [
  {
    "label": "Website SEO",
    "title": "Website SEO",
    "sub": "Website SEO That Strengthens Your Foundation",
    "desc": "We improve the on-page SEO and structural setup of your website so search engines can better understand your content and users can move through your site more clearly.",
    "features": "On-page SEO improvements,Page-level optimization,Heading and content structure,Metadata optimization,Internal linking strategy,Keyword targeting and mapping",
    "price": "$299",
    "href": "/contact"
  },
  {
    "label": "Local SEO",
    "title": "Local SEO",
    "sub": "Local SEO That Brings More Calls and Leads",
    "desc": "For local businesses, visibility in your service areas matters. We help improve your local presence through Google Business Profile optimization, local landing pages, service-area targeting, on-page local signals, and stronger geographic relevance across your website.",
    "features": "Google Business Profile optimization,Local keyword targeting,City and service-area pages,Local on-page SEO,Location-based content support,Better visibility for local intent searches",
    "price": "$399/mo",
    "href": "/contact"
  },
  {
    "label": "Technical SEO",
    "title": "Technical SEO",
    "sub": "Technical SEO That Fixes What Holds You Back",
    "desc": "Many websites struggle to rank because of technical problems happening behind the scenes. We identify and fix issues related to crawlability, indexing, site speed, mobile usability, page structure, duplicates, and weak internal architecture so your website performs better in search.",
    "features": "Technical SEO audits,Crawl and indexing fixes,Page speed improvement recommendations,Mobile usability checks,Site structure improvements,Duplicate and thin content review",
    "price": "$499",
    "href": "/contact"
  },
  {
    "label": "SEO Content",
    "title": "SEO Content",
    "sub": "SEO Content That Builds Topical Strength",
    "desc": "We help businesses create and improve content that supports rankings, search intent, and topical authority. This includes service page optimization, blog strategy, content planning, keyword clustering, and search-focused content improvements that help your site compete more effectively.",
    "features": "SEO content strategy,Service page optimization,Blog topic planning,Keyword clustering,Content updates and refreshes,Content structure for search intent",
    "price": "$599/mo",
    "href": "/contact"
  }
] }),
  sec('whyus', { eyebrow: 'Why Us', headline: 'Why Businesses Choose Ariosetech for SEO', items: [
    { icon: '🎯', title: 'Business-First SEO', desc: 'We focus on visibility that supports real business outcomes, not just traffic numbers.' },
    { icon: '⚙️', title: 'Development & SEO in Sync', desc: 'Because our team works across websites, structure, and performance, we can align SEO with how your site is actually built.' },
    { icon: '✅', title: 'Clean, Practical Execution', desc: 'We focus on the changes that make the biggest impact without creating confusion or unnecessary complexity.' },
    { icon: '📈', title: 'Long-Term Growth Thinking', desc: 'We build SEO in a way that supports stronger performance over time, not just short-term spikes.' },
    { icon: '🏪', title: 'Support for Different Business Types', desc: 'We work with service businesses, local brands, and eCommerce companies that need stronger digital visibility.' }
  ]}),
  sec('process', { eyebrow: 'How We Work', headline: 'Our SEO Process', steps: [
    { n: '01', title: 'Audit', sub: '', desc: 'We review your website, search presence, content, and technical condition to understand what is holding performance back.' },
    { n: '02', title: 'Strategy', sub: '', desc: 'We build an SEO plan based on your business model, audience, goals, and search opportunities.' },
    { n: '03', title: 'Optimization', sub: '', desc: 'We improve your pages, structure, technical setup, content targeting, and internal SEO foundation.' },
    { n: '04', title: 'Content and Growth Support', sub: '', desc: 'Where needed, we build supporting content, improve weak pages, and strengthen site-wide relevance.' },
    { n: '05', title: 'Ongoing Improvement', sub: '', desc: 'SEO is not static. We continue refining based on performance, search trends, and growth priorities.' }
  ]}),
  sec('audit', { eyebrow: 'Get Started', headline: 'Ready to Improve Your Search Visibility?', subhead: 'Get a free SEO audit', desc: 'Discover exactly what is holding your site back from ranking #1 with our comprehensive SEO and performance audit.', ctaLabel: 'Book a Free SEO Consultation', ctaHref: '/contact', guarantee: 'Tell us where your website stands, and we\'ll help you map the next move.' }),
  sec('faq', { eyebrow: 'SEO FAQ', headline: 'Frequently Asked Questions About SEO', items: [
  {
    "q": "What SEO services does Ariosetech offer?",
    "a": "We offer website SEO, local SEO, technical SEO, and SEO content support. This includes on-page optimization, technical fixes, local search improvements, and content strategy built to improve rankings and business visibility."
  },
  {
    "q": "Is SEO worth it for small businesses?",
    "a": "Yes. SEO helps small businesses show up when potential customers are actively searching for their services. It can improve visibility, bring qualified traffic, and support long-term growth without depending only on paid ads."
  },
  {
    "q": "How long does SEO take to show results?",
    "a": "SEO usually takes time because rankings depend on competition, website condition, content quality, and technical setup. Some improvements can be seen earlier, but strong SEO results usually build over months, not days."
  },
  {
    "q": "Do you offer local SEO services?",
    "a": "Yes. We help local businesses improve visibility through Google Business Profile optimization, service-area targeting, local page structure, and stronger on-page local signals."
  },
  {
    "q": "Can you fix technical SEO issues on my website?",
    "a": "Yes. We can review and improve crawl issues, indexing problems, speed-related blockers, mobile usability, internal structure, and other technical factors affecting search performance."
  },
  {
    "q": "Do you also help with SEO content?",
    "a": "Yes. We help with service page optimization, blog planning, keyword clustering, content updates, and search-focused content strategy to strengthen your site's topical coverage."
  }
] }),
  sec('cta', { eyebrow: 'Ready to grow your business online?', headline: 'Start Your SEO Journey Today', desc: 'Join 100+ successful businesses. Professional results, transparent reporting, and long-term growth.', ctaLabel: 'Book a Free SEO Consultation', ctaHref: '/contact', secondaryLabel: 'Get a Website Audit', secondaryHref: '/contact', trust: 'No Long-Term Contracts,Transparent Monthly Reporting,White-Hat Techniques' })
]}

const aboutLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'About Us', headline: 'Specialists, Not Generalists. Consider It Solved.', subheadline: 'ARIOSETECH was founded with one mission: give growing businesses access to the same quality of web development that enterprise brands enjoy — at honest, transparent prices.', desc: 'Based in Lahore, Pakistan. Serving clients in the USA, UAE, Switzerland, UK, Australia, and beyond.', ctaPrimaryLabel: 'Work With Us', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View Our Work', ctaSecondaryHref: '/portfolio', trust: '100+ Projects Delivered,7+ Years Experience,40+ Industries Served,5.0\u2605 Clutch Rating' }),
  sec('whyus', { eyebrow: 'Our Values', headline: 'What Sets Us Apart', items: [
    { icon: '🎯', title: 'Specialists Only', subhead: 'Three Platforms, Deep Expertise', desc: 'We only work with WordPress, WooCommerce, and Shopify. This focus means deeper expertise and better results than any generalist agency.' },
    { icon: '💬', title: 'Transparent Communication', subhead: 'No Hidden Fees, No Surprises', desc: 'You know exactly what you are getting, when you are getting it, and what it costs. Clear communication at every stage.' },
    { icon: '⚡', title: 'Speed Without Compromise', subhead: 'Fast Because We Have Done It Before', desc: 'We deliver fast because we have done it before. Our team knows these platforms inside out — no learning on your budget.' },
    { icon: '🤝', title: 'Long-term Partnership', subhead: 'We Are With You After Launch', desc: 'We do not disappear after launch. Ongoing support, maintenance, and growth — we are your long-term web development partner.' }
  ]}),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('cta', { eyebrow: 'Start a Project', headline: 'Ready to Work With Specialists?', desc: 'Get a free consultation and see why 100+ businesses chose ARIOSETECH for their web development needs.', trust: CTA_TRUST, ctaLabel: 'Start a Project', ctaHref: '/contact', secondaryLabel: 'View Our Work', secondaryHref: '/portfolio' })
]}

const contactLayout = { sections: [
  sec('contact', { eyebrow: 'Get In Touch', headline: 'Ready to Transform Your Online Presence?', guarantee: 'We respond to all inquiries within 2 hours during business days.' }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why 100+ Businesses Trust ARIOSETECH', items: WHY_ITEMS }),
  sec('faq', { eyebrow: 'FAQ', headline: 'Frequently Asked Questions', items: FAQS_WP })
]}

const portfolioLayout = { sections: [
  sec('portfolio', { eyebrow: 'Our Work', headline: 'Success Stories That Speak for Themselves', intro: "Discover how we've transformed businesses across industries with custom web solutions that drive growth and maximize ROI.", items: PORTFOLIO_ITEMS, ctaLabel: 'Start Your Project', ctaHref: '/contact' }),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('cta', { eyebrow: 'Ready?', headline: 'Let\'s Build Your Success Story', desc: 'Join 100+ businesses that chose ARIOSETECH for their web development needs.', trust: CTA_TRUST, ctaLabel: 'Start a Project', ctaHref: '/contact', secondaryLabel: 'View All Services', secondaryHref: '/services/wordpress' })
]}

const blogLayout = { sections: [
  sec('heading', { eyebrow: 'Knowledge Base', headline: 'WordPress, WooCommerce & Shopify Insights', body: 'Expert tutorials, case studies, and industry insights to help you grow your online business. Published by the ARIOSETECH team.', align: 'center' }),
  sec('cta', { eyebrow: 'Free Audit', headline: 'Get Your Free Website Performance Audit', desc: "Discover what's holding your website back. Our 25-point audit covers speed, SEO, security, and conversions.", trust: '', ctaLabel: 'Get Free Audit', ctaHref: '/contact', secondaryLabel: '', secondaryHref: '' })
]}

const PAGES = [
  { title: 'Home',                slug: '',                    fullPath: '/',                    status: 'published', layout: homeLayout },
  { title: 'WordPress Services',  slug: 'services/wordpress',  fullPath: '/services/wordpress',  status: 'published', layout: wordpressLayout },
  { title: 'WooCommerce Services',slug: 'services/woocommerce',fullPath: '/services/woocommerce',status: 'published', layout: woocommerceLayout },
  { title: 'Shopify Services',    slug: 'services/shopify',    fullPath: '/services/shopify',    status: 'published', layout: shopifyLayout },
  { title: 'SEO Services',        slug: 'services/seo',        fullPath: '/services/seo',        status: 'published', layout: seoLayout },
  { title: 'Portfolio',           slug: 'portfolio',            fullPath: '/portfolio',           status: 'published', layout: portfolioLayout },
  { title: 'Blog',                slug: 'blog',                 fullPath: '/blog',                status: 'published', layout: blogLayout },
  { title: 'About Us',            slug: 'about',                fullPath: '/about',               status: 'published', layout: aboutLayout },
  { title: 'Contact',             slug: 'contact',              fullPath: '/contact',             status: 'published', layout: contactLayout },
]

const BLOGS = [
  { slug: 'complete-guide-woocommerce-vs-shopify', title: 'Complete Guide to WooCommerce vs Shopify: Which is Better for Your Business?', excerpt: 'A comprehensive comparison of WooCommerce and Shopify to help you choose the right platform.', category: 'E-Commerce', author: 'ARIOSETECH Team', date: '2025-01-15', readTime: 8, tags: ['WooCommerce','Shopify'], published: true, status: 'published', content: [{type:'h2',text:'Overview'},{type:'p',text:'Both platforms are excellent but serve different needs. WooCommerce offers unlimited customization while Shopify provides ease of use.'},{type:'h2',text:'WooCommerce Pros'},{type:'p',text:'Free to use, unlimited customization, full data ownership, better for complex stores, no transaction fees.'},{type:'h2',text:'Shopify Pros'},{type:'p',text:'Hosted solution, 24/7 support, easier setup, built-in payment processing, great for beginners.'},{type:'h2',text:'Our Recommendation'},{type:'p',text:'Choose WooCommerce for complex stores. Choose Shopify for fast launches.'}], seo: SEO_D, updatedAt: new Date().toISOString() },
  { slug: '10-wordpress-security-best-practices', title: '10 WordPress Security Best Practices Every Site Owner Must Know', excerpt: 'Protect your WordPress site with these essential security practices every business owner should implement.', category: 'Security', author: 'ARIOSETECH Team', date: '2025-02-01', readTime: 6, tags: ['WordPress','Security'], published: true, status: 'published', content: [{type:'h2',text:'Why Security Matters'},{type:'p',text:'WordPress powers 40% of all websites, making it the top target for hackers. A breach costs thousands in lost revenue.'},{type:'h2',text:'1. Keep Everything Updated'},{type:'p',text:'Always run the latest WordPress, themes, and plugins. Updates patch known vulnerabilities.'},{type:'h2',text:'2. Use Strong Passwords'},{type:'p',text:'Complex unique passwords for admin, hosting, and database. Use a password manager.'},{type:'h2',text:'3. Install a Security Plugin'},{type:'p',text:'Wordfence or Sucuri provide firewall protection and malware scanning for free.'}], seo: SEO_D, updatedAt: new Date().toISOString() },
  { slug: 'how-to-optimize-ecommerce-site-speed', title: 'How to Optimize Your E-Commerce Site Speed in 2025', excerpt: 'Speed optimization techniques that directly improve conversions and revenue for WooCommerce and Shopify stores.', category: 'Performance', author: 'ARIOSETECH Team', date: '2025-02-15', readTime: 10, tags: ['Speed','Performance'], published: true, status: 'published', content: [{type:'h2',text:'Why Speed Matters'},{type:'p',text:'A 1-second delay results in 7% fewer conversions. For a $10,000/month store, that is $700 lost per second of delay.'},{type:'h2',text:'Optimize Images First'},{type:'p',text:'Images are the biggest culprit. Compress them and use WebP format to reduce page size by 60%.'},{type:'h2',text:'Implement Caching'},{type:'p',text:'Browser and server-side caching drastically reduce load times for returning visitors.'},{type:'h2',text:'Use a CDN'},{type:'p',text:'A CDN serves content from servers close to your visitors, reducing latency worldwide.'}], seo: SEO_D, updatedAt: new Date().toISOString() }
]

const PORTFOLIO_DB = [
  { slug: 'thekapra-woocommerce', title: 'The Kapra', client: 'The Kapra', clientUrl: 'https://thekapra.com', category: 'woocommerce', summary: 'Premium Pakistani fashion brand WooCommerce store with custom product configurator and complex inventory management.', challenge: 'Complex size and customization options for traditional Pakistani clothing.', solution: 'Custom WooCommerce product configurator with real-time preview and automated inventory alerts.', quote: 'ARIOSETECH transformed our vision into reality. Our sales tripled within 3 months.', results: [{label:'Revenue Growth',value:'+300%'},{label:'Conversion Rate',value:'4.2%'},{label:'Load Time',value:'0.9s'}], stack: ['WooCommerce','PHP','Custom Theme','ACF'], featured: true, published: true, updatedAt: new Date().toISOString() },
  { slug: 'drscents-woocommerce', title: 'Dr. Scents', client: 'Dr. Scents', clientUrl: 'https://drscents.com', category: 'woocommerce', summary: 'International luxury fragrance brand launched across 32 countries with multi-site WooCommerce network.', challenge: 'Needed 32 separate storefronts with local pricing, currency, and shipping rules.', solution: 'WooCommerce Multisite with centralized product management and automated currency conversion.', quote: 'Incredible speed and quality. They launched our entire international operation in under 4 months.', results: [{label:'Countries Launched',value:'32'},{label:'Launch Time',value:'4 months'},{label:'Revenue YoY',value:'+200%'}], stack: ['WooCommerce Multisite','PHP','WPML'], featured: true, published: true, updatedAt: new Date().toISOString() },
  { slug: 'wyox-shopify', title: 'WYOX Sports', client: 'WYOX Sports', clientUrl: 'https://wyoxsports.com', category: 'shopify', summary: 'USA-based international sports equipment brand with B2B wholesale portal and custom product builder.', challenge: 'Needed B2C retail and B2B wholesale with custom pricing and US market compliance.', solution: 'Shopify Plus with custom B2B portal and automated wholesale pricing rules.', quote: 'Professional, reliable, and always available. We now serve 40+ countries from one platform.', results: [{label:'International Sales',value:'+250%'},{label:'B2B Orders',value:'+150%'},{label:'Countries',value:'40+'}], stack: ['Shopify Plus','Liquid','React'], featured: true, published: true, updatedAt: new Date().toISOString() }
]

const SERVICES_DB = [
  {
    slug: 'wordpress',
    title: 'WordPress Services',
    status: 'published',
    hero: {
      eyebrow: 'WordPress Solutions',
      headline: 'Professional WordPress Development Services',
      subheadline: 'Display Your Business Online with a WordPress Website',
      desc: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability.',
      startingPrice: '$799',
      ctaPrimary: 'Get Free WordPress Consultation',
      ctaSecondary: 'View WordPress Portfolio'
    },
    services: [
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
],
    whyUs: WHY_ITEMS,
    process: PROCESS_STEPS,
    portfolio: PORTFOLIO_ITEMS,
    faqs: FAQS_WP,
    updatedAt: new Date()
  },
  {
    slug: 'shopify',
    title: 'Shopify Services',
    status: 'published',
    hero: {
      eyebrow: 'Shopify Services',
      headline: 'Professional Shopify Development Services',
      subheadline: 'Scale your business with Shopify. From startup stores to Shopify Plus enterprises.',
      desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter. Starting at $999.',
      startingPrice: '$999',
      ctaPrimary: 'Get Free Shopify Consultation',
      ctaSecondary: 'View Shopify Portfolio'
    },
    services: [
  {
    "label": "Development",
    "title": "Shopify Store Development",
    "sub": "Launch Your Dream E-commerce Store",
    "desc": "Transform your business idea into a profitable Shopify store. Our custom development approach creates unique, high-converting stores that capture your brand essence and drive sales from day one.",
    "features": "Custom Shopify theme development,Responsive design across all devices,Product catalog setup and optimization,Payment gateway integration,Shipping configuration and tax setup,30 days of free support",
    "price": "$999",
    "href": "/contact"
  },
  {
    "label": "Migration",
    "title": "Shopify Migration Services",
    "sub": "Seamless Migration to Shopify",
    "desc": "Moving your e-commerce store to Shopify? We handle the complete migration process while preserving your SEO rankings, customer data, and sales history. Zero downtime, zero data loss guaranteed.",
    "features": "All product data and images,Customer accounts and order history,Blog posts and pages,SEO settings and redirects,Reviews and testimonials,30 days of post-migration support",
    "price": "$799",
    "href": "/contact"
  },
  {
    "label": "Optimization",
    "title": "Shopify Performance Optimization",
    "sub": "Maximize Your Store's Speed and Conversions",
    "desc": "Slow Shopify stores lose customers and sales. Our performance optimization service can improve your store speed by 40-60%, leading to higher conversions and better customer experience.",
    "features": "Comprehensive speed audit and analysis,Image optimization and compression,Code optimization and cleanup,App performance review and optimization,Theme speed enhancements,Core Web Vitals improvement",
    "price": "$599",
    "href": "/contact"
  },
  {
    "label": "Integration",
    "title": "Shopify Integration Services",
    "sub": "Connect Your Store with Essential Business Tools",
    "desc": "Streamline your operations by integrating your Shopify store with essential business tools and third-party services. Automate workflows and improve efficiency across your entire business.",
    "features": "Google Analytics 4 setup,Klaviyo setup and automation,ShipStation integration,QuickBooks integration,Xero accounting connection,Custom API development for custom tools",
    "price": "$399",
    "href": "/contact"
  },
  {
    "label": "Maintenance",
    "title": "Shopify Maintenance & Support",
    "sub": "Keep Your Shopify Store Running Smoothly",
    "desc": "Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your Shopify store stays updated, secure, and optimized for peak performance.",
    "features": "Regular theme and app updates,Security monitoring and protection,Performance monitoring and optimization,Broken link checks and fixes,Product data backup and security,Priority technical support",
    "price": "$99/mo",
    "href": "/contact"
  },
  {
    "label": "Shopify Plus",
    "title": "Shopify Plus Development",
    "sub": "Enterprise E-commerce Solutions with Shopify Plus",
    "desc": "Scale your high-volume business with Shopify Plus. We specialize in complex enterprise implementations, custom functionality, and advanced integrations that support rapid growth and global expansion.",
    "features": "Custom Theme Development for enterprise brands,ERP and CRM advanced integrations,B2B wholesale portals and pricing,Multi-store and multi-currency support,Custom app development,API-first architecture",
    "price": "$2,999",
    "href": "/contact"
  },
  {
    "label": "Redesign",
    "title": "Shopify Store Redesign",
    "sub": "Transform Your Store for Maximum Conversions",
    "desc": "Is your Shopify store underperforming? Our redesign service combines modern design with conversion optimization to create stores that not only look amazing but also drive more sales.",
    "features": "Modern mobile-first design,Conversion rate optimization,User experience improvements,Page speed optimization,SEO structure enhancement,30 days of support",
    "price": "$1,499",
    "href": "/contact"
  },
  {
    "label": "App Dev",
    "title": "Shopify App Development",
    "sub": "Custom Apps for Unique Business Needs",
    "desc": "Need functionality that doesn't exist? We develop custom Shopify apps tailored to your specific requirements, giving you competitive advantages and streamlined operations.",
    "features": "Public & private apps development,Custom product configurators,Subscription and recurring billing,Loyalty and rewards programs,Advanced search and filtering,Polaris design standard compliance",
    "price": "$1,999",
    "href": "/contact"
  }
],
    whyUs: WHY_ITEMS,
    process: PROCESS_STEPS,
    portfolio: PORTFOLIO_ITEMS,
    faqs: FAQS_SHOPIFY,
    updatedAt: new Date()
  },
  {
    slug: 'woocommerce',
    title: 'WooCommerce Services',
    status: 'published',
    hero: {
      eyebrow: 'WooCommerce Services',
      headline: 'Custom WooCommerce Development Services',
      subheadline: 'Turn your vision into a profitable online store.',
      desc: 'Custom WooCommerce solutions with seamless payment integration and conversion optimization. Starting at $1,299.',
      startingPrice: '$1,299',
      ctaPrimary: 'Get Free WooCommerce Quote',
      ctaSecondary: 'View WooCommerce Portfolio'
    },
    services: [
  {
    "label": "Development",
    "title": "WooCommerce Website Development Services",
    "sub": "Launch Your Ultimate E-commerce Store",
    "desc": "Build a powerful online store that leverages the best of WordPress and WooCommerce. Our custom development creates unique, high-converting stores that perfectly match your brand and business requirements.",
    "features": "Custom WooCommerce theme development,Responsive design across all devices,Complete product catalog setup,Payment gateway integration,Shipping zones and tax configuration,30 days of free support",
    "price": "$1,299",
    "href": "/contact"
  },
  {
    "label": "Customization",
    "title": "WooCommerce Theme Customization",
    "sub": "Transform Your Store with Custom Design",
    "desc": "Make your WooCommerce store stand out with completely custom theme development or extensive customization of existing themes. We create unique shopping experiences that reflect your brand and drive conversions.",
    "features": "Complete theme redesign and development,Custom homepage and product page layouts,Brand-specific color schemes and typography,Custom icons and graphics integration,Advanced product display options,30 days of design support",
    "price": "$899",
    "href": "/contact"
  },
  {
    "label": "Payments",
    "title": "WooCommerce Payment Gateway Integration",
    "sub": "Secure, Seamless Payment Processing",
    "desc": "Offer your customers the payment methods they prefer with secure, reliable payment gateway integrations. We implement and optimize payment systems that reduce cart abandonment and increase conversions.",
    "features": "Stripe and PayPal integration,Square online payments,Authorize.net integration,Local gateways (JazzCash EasyPaisa),SSL certificate implementation,30 days of payment support",
    "price": "$299",
    "href": "/contact"
  },
  {
    "label": "Performance",
    "title": "WooCommerce Performance Optimization",
    "sub": "Maximize Speed, Sales, and Search Rankings",
    "desc": "Slow e-commerce sites lose customers and sales. Our comprehensive optimization service can improve your WooCommerce store speed by 50-70%, leading to higher conversions, better user experience, and improved search rankings.",
    "features": "Database query optimization,Image compression and optimization,Caching implementation (page object browser),CDN setup and configuration,Server-level optimizations,Core Web Vitals check",
    "price": "$699",
    "href": "/contact"
  },
  {
    "label": "Maintenance",
    "title": "WooCommerce Maintenance & Support",
    "sub": "Keep Your Store Running Smoothly",
    "desc": "Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your WooCommerce store stays updated, secure, and optimized for peak performance.",
    "features": "WordPress and WooCommerce core updates,Plugin and theme updates,Security monitoring and hardening,Performance monitoring and optimization,Database optimization and cleanup,Uptime monitoring & backups",
    "price": "$129/mo",
    "href": "/contact"
  },
  {
    "label": "Multi-vendor",
    "title": "WooCommerce Multi-vendor Solutions",
    "sub": "Create Your Own E-commerce Marketplace",
    "desc": "Transform your WooCommerce store into a thriving multi-vendor marketplace where multiple sellers can list and sell their products. Perfect for creating Amazon-like platforms or expanding your business model.",
    "features": "Vendor registration and approval system,Individual vendor dashboards,Vendor commission management,Automated commission calculations,Multiple payout methods,30 days of marketplace support",
    "price": "$1,999",
    "href": "/contact"
  },
  {
    "label": "Multilingual",
    "title": "WooCommerce Multilingual Websites",
    "sub": "Expand Globally with Multilingual E-commerce",
    "desc": "Reach international customers with professionally developed multilingual WooCommerce stores. We create seamless multi-language shopping experiences that engage global audiences and drive international sales.",
    "features": "Multiple language setup (unlimited),Multi-currency and localization setup,Location-based pricing,Country-specific payment methods,RTL language support,30 days of multilingual support",
    "price": "$1,499",
    "href": "/contact"
  },
  {
    "label": "Migration",
    "title": "WooCommerce Migration Services",
    "sub": "Seamless Migration to WooCommerce",
    "desc": "Moving your e-commerce store to WooCommerce? We handle the complete migration process while preserving your SEO rankings, customer data, order history, and ensuring zero downtime.",
    "features": "Product catalog migration with variations,Customer accounts and order history,Reviews and testimonials,Blog posts and content pages,SEO settings and URL redirects,30 days of dedicated support",
    "price": "$999",
    "href": "/contact"
  }
],
    whyUs: WHY_ITEMS,
    process: PROCESS_STEPS,
    portfolio: PORTFOLIO_ITEMS,
    faqs: FAQS_WC,
    updatedAt: new Date()
  }
]

export async function GET(req: NextRequest) { return POST(req) }

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: 'Missing or wrong secret.' }, { status: 401 })
  }

  try {
    const pagesCol = await getCollection('pages')
    await pagesCol.deleteMany({})
    await pagesCol.insertMany(PAGES.map(p => ({ ...PD, seo: { ...SEO_D }, ...p, updatedAt: new Date() })) as never[])

    const blogsCol = await getCollection('blogs')
    await blogsCol.deleteMany({})
    await blogsCol.insertMany(BLOGS as never[])

    const portfolioCol = await getCollection('portfolio')
    await portfolioCol.deleteMany({})
    await portfolioCol.insertMany(PORTFOLIO_DB as never[])

    const servicesCol = await getCollection('services')
    await servicesCol.deleteMany({})
    await servicesCol.insertMany(SERVICES_DB as never[])

    const usersCol = await getCollection('users')
    if (!await usersCol.findOne({ username: process.env.ADMIN_USERNAME || 'admin' })) {
      await usersCol.insertOne({ username: process.env.ADMIN_USERNAME || 'admin', password: hashPassword(process.env.ADMIN_PASSWORD || 'changeme123'), role: 'admin', createdAt: new Date() } as never)
    }

    await (await getCollection('settings')).updateOne(
      { key: 'site_settings' },
      { $set: { key: 'site_settings', value: { site_name: 'ARIOSETECH', logo_url: 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png', tagline: 'Consider It Solved', email: 'info@ariosetech.com', phone: '+92 300 9484 739', whatsapp: 'https://wa.me/923009484739', address: '95 College Road, Block E, PCSIR Staff Colony, Lahore, 54770' } } },
      { upsert: true }
    )

    return NextResponse.json({ success: true, seeded: { pages: PAGES.length, blogs: BLOGS.length, portfolio: PORTFOLIO_DB.length, services: SERVICES_DB.length }, message: 'All pages and services seeded.' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}