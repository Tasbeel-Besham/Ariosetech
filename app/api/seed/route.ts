import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { hashPassword } from '@/lib/auth'

// ── Helper to create a section instance ──────────────────────────
let counter = 1
function sec(type: string, props: Record<string, unknown> = {}) {
  return { id: `sec_seed_${counter++}`, type, props, styles: {}, meta: { locked: false, hidden: false } }
}

// ── Page layouts — sections with real content ─────────────────────
const SEO_D = { title: '', description: '', keywords: [], canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', twitterTitle: '', twitterDescription: '', twitterImage: '', robots: { index: true, follow: true } }
const PD = { parentId: null, schema: null, relatedPages: [], relatedBlogs: [], slugHistory: [], createdAt: new Date(), updatedAt: new Date() }

const TRUST = '7+ Years of Excellence,100+ Successful Projects,24/7 Expert Support,30-Day Money-Back Guarantee'
const CTA_TRUST = 'No Long-Term Contracts,30-Day Money-Back Guarantee,Free Post-Launch Support,Transparent Pricing'

const WP_SERVICES = [
  { icon: '🔷', title: 'WordPress Website Development', headline: 'Build Your Dream Website from Scratch', desc: 'Transform your vision into a stunning, high-performing WordPress website. Our custom development approach ensures your site stands out while delivering exceptional user experience.', features: 'Custom theme development,Responsive design across all devices,SEO-optimized structure,Contact forms & lead generation,Google Analytics setup,30 days of free support', price: '$799', href: '/contact' },
  { icon: '🚀', title: 'WordPress Migration Services', headline: 'Seamless Migration Without Downtime', desc: 'Moving to WordPress or changing hosts? We handle the entire migration process ensuring zero data loss and minimal downtime. Your SEO rankings and user experience remain intact.', features: 'Complete site backup and migration,Domain and hosting setup,SSL certificate installation,SEO preservation techniques,Testing across all devices,14 days post-migration support', price: '$299', href: '/contact' },
  { icon: '⚡', title: 'WordPress Speed Optimization', headline: 'Boost Your Site Speed by 40-70%', desc: 'We optimize images, implement caching, clean your database, and set up a CDN for lightning-fast performance that improves rankings and conversions.', features: 'Image optimization and WebP conversion,Browser and server-side caching,Database optimization and cleanup,CDN implementation,Core Web Vitals improvement,Performance report before & after', price: '$399', href: '/contact' },
  { icon: '🛡️', title: 'WordPress Security Services', headline: 'Enterprise-Grade Protection for Your Site', desc: 'Protect your WordPress site against hackers, malware, and brute force attacks with our comprehensive security hardening service.', features: 'Security audit and vulnerability scan,Malware removal (if infected),Firewall and login protection,SSL certificate setup,Regular security monitoring,Two-factor authentication', price: '$199', href: '/contact' },
  { icon: '🔧', title: 'WordPress Maintenance & Support', headline: 'Keep Your Site Running Smoothly', desc: 'Focus on your business while we handle the technical side. Our maintenance plans keep your WordPress site secure, fast, and up-to-date.', features: 'Regular WordPress & plugin updates,Security monitoring and protection,Performance optimization,Backup management,Uptime monitoring,Priority support', price: '$79/mo', href: '/contact' },
  { icon: '🎨', title: 'WordPress Website Redesign', headline: 'Modern Makeover Without Losing SEO', desc: 'Give your existing WordPress site a modern makeover. Fresh design, improved UX, and better performance — without losing your existing content or rankings.', features: 'Complete visual redesign,Improved UX and navigation,Mobile-first responsive design,Content migration,SEO preservation,Speed optimization included', price: '$599', href: '/contact' },
]

const WC_SERVICES = [
  { icon: '🛒', title: 'WooCommerce Store Development', headline: 'Launch Your Profitable Online Store', desc: 'Build a profitable online store with WooCommerce. Custom design, seamless checkout, and conversion-optimized UX from day one.', features: 'Custom WooCommerce theme development,Product catalog setup and configuration,Shopping cart and checkout optimization,Customer account management,SEO-optimized product pages,30 days of free support', price: '$1,299', href: '/contact' },
  { icon: '💳', title: 'Payment Gateway Integration', headline: 'Accept Payments Your Customers Trust', desc: 'Add any payment gateway to your WooCommerce store. PayPal, Stripe, JazzCash, EasyPaisa, or custom solutions.', features: 'PayPal and Stripe setup,Local gateways (JazzCash, EasyPaisa),SSL and security configuration,Test transactions and validation,Recurring payment setup,Multi-currency support', price: '$299', href: '/contact' },
  { icon: '⚡', title: 'WooCommerce Performance Optimization', headline: 'Speed Up Your Store for More Conversions', desc: 'Slow stores lose customers. We optimize your WooCommerce store for lightning-fast performance and better conversion rates.', features: 'Database optimization and cleanup,Image optimization and lazy loading,Server-side and object caching,Product page speed improvement,Checkout speed optimization,Core Web Vitals improvements', price: '$499', href: '/contact' },
  { icon: '🏪', title: 'Multi-vendor Marketplace Setup', headline: 'Launch Your Own Amazon or Etsy', desc: 'Build a marketplace with multiple vendors, commission management, and seamless operations using WooCommerce.', features: 'Vendor registration and dashboard,Commission management system,Product management per vendor,Payment splitting and payouts,Vendor review system,Admin oversight and reporting', price: '$1,999', href: '/contact' },
  { icon: '🎨', title: 'WooCommerce Theme Customization', headline: 'Make Your Store Look Exactly Right', desc: 'Custom styling, layout changes, and brand alignment for your WooCommerce store to match your vision perfectly.', features: 'Custom CSS and design changes,Brand colors and typography,Homepage layout customization,Product page redesign,Mobile responsiveness fixes,Checkout page styling', price: '$399', href: '/contact' },
  { icon: '🔧', title: 'WooCommerce Maintenance', headline: 'Keep Your Store Running Perfectly', desc: 'Keep your WooCommerce store secure, fast, and up-to-date with our ongoing maintenance plans.', features: 'Regular plugin and core updates,Security monitoring,Performance checks,Backup management,Bug fixes and minor changes,Priority support', price: '$99/mo', href: '/contact' },
]

const SHOPIFY_SERVICES = [
  { icon: '🚀', title: 'Shopify Store Development', headline: 'Professional Stores Built for Growth', desc: 'Custom Shopify stores with conversion-optimized design, fast performance, and seamless UX from day one.', features: 'Custom Shopify theme development,Product catalog and collections setup,Payment gateway configuration,Shipping and tax setup,SEO-optimized product pages,30 days of free support', price: '$999', href: '/contact' },
  { icon: '⭐', title: 'Shopify Plus Development', headline: 'Enterprise-Grade for High-Volume Brands', desc: 'Advanced Shopify Plus solutions for enterprise brands — custom checkout, B2B features, and advanced automation.', features: 'Custom checkout with Extensibility,B2B and wholesale portal,Multi-store management,Advanced automation flows,Custom app development,Dedicated account management', price: '$2,999', href: '/contact' },
  { icon: '⚡', title: 'Shopify Performance Optimization', headline: 'Faster Store = More Sales', desc: 'Speed up your Shopify store for better conversions. Every second of delay costs sales.', features: 'Liquid code optimization,Image compression and lazy loading,App audit and removal,Core Web Vitals improvement,Checkout page speed boost,Performance report before & after', price: '$499', href: '/contact' },
  { icon: '🎨', title: 'Shopify Store Redesign', headline: 'Modern Design Without Losing Data', desc: 'Modernize your Shopify store with a fresh design, improved navigation, and better conversion rates — keeping all your data safe.', features: 'Custom theme redesign,Improved UX and navigation,Brand identity alignment,Mobile responsiveness,Product page optimization,Speed optimization included', price: '$799', href: '/contact' },
  { icon: '🔗', title: 'Shopify App & Integration', headline: 'Connect Any Tool to Your Store', desc: 'Connect your Shopify store with any third-party tool — CRM, ERP, email marketing, shipping, or custom apps.', features: 'Third-party app integration,Custom API connections,Zapier and Make automation,Email marketing integration,Inventory system sync,Custom private app development', price: '$399+', href: '/contact' },
  { icon: '🔧', title: 'Shopify Maintenance & Support', headline: 'Always-On Expert Support', desc: 'Keep your Shopify store running smoothly with regular updates, monitoring, and expert support.', features: 'Monthly store health check,App updates and management,Content and product updates,Bug fixes and troubleshooting,Performance monitoring,Priority support channel', price: '$79/mo', href: '/contact' },
]

const PORTFOLIO_ITEMS = [
  { title: 'The Kapra', client: 'E-commerce Fashion Store', platform: 'Custom WooCommerce', result: '+300%', resultLabel: 'Increase in online sales', quote: 'ARIOSETECH transformed our vision into reality with custom code solutions.' },
  { title: 'Dr. Scents', client: 'International Perfume Online Store', platform: 'Multi-site WooCommerce', result: '32', resultLabel: 'Countries launched in under 4 months', quote: 'Incredible speed and quality. They delivered beyond our expectations.' },
  { title: 'WYOX Sports', client: 'USA-Based Sports Equipment', platform: 'Shopify + Custom Solutions', result: '+250%', resultLabel: 'Business growth', quote: 'Professional, reliable, and always available when we need them.' },
]

const TESTIMONIALS = [
  { name: 'Dr. Fred Sahafi', role: 'Founder of Genovie', initials: 'FS', quote: 'ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth.' },
  { name: 'Michael Chen', role: 'CEO of GeoMag World', initials: 'MC', quote: 'Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom WooCommerce solution that perfectly fits our business model.' },
  { name: 'Muhammad Hannan', role: 'Director of Janya.pk', initials: 'MH', quote: 'Fast, reliable, and cost-effective. ARIOSETECH helped us launch our wholesale platform on Shopify ahead of schedule and under budget.' },
]

const PROCESS_STEPS = [
  { n: '01', title: 'Discovery & Strategy', sub: 'Understand Your Vision', desc: 'We start with a comprehensive consultation to understand your business goals, target audience, and technical requirements.', time: '1-2 days' },
  { n: '02', title: 'Planning & Design', sub: 'Blueprint for Success', desc: 'Detailed project planning, wireframing, and design mockups that align with your brand and conversion goals.', time: '3-5 days' },
  { n: '03', title: 'Development', sub: 'Bringing Ideas to Life', desc: 'Expert development using best practices, clean code, and scalable architecture that grows with your business.', time: '15-20 days' },
  { n: '04', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Rigorous testing across devices, speed optimization, and security checks before launch.', time: '3-5 days' },
  { n: '05', title: 'Launch & Support', sub: 'Your Success, Our Priority', desc: 'Smooth launch with comprehensive training and ongoing support to ensure continuous success.', time: 'Ongoing' },
]

const WHY_ITEMS = [
  { icon: '💰', title: 'Cost-Effective Excellence', subhead: 'Save 60% Without Compromising Quality', desc: 'Get premium web development at a fraction of US agency costs. Professional results, affordable pricing, transparent communication.' },
  { icon: '⚡', title: 'Lightning-Fast Delivery', subhead: 'From Concept to Launch in 30 Days', desc: 'Our streamlined process and dedicated team ensure rapid turnaround without cutting corners. Most projects completed ahead of schedule.' },
  { icon: '🛡️', title: 'Professional Support', subhead: '24/7 Expert Assistance When You Need It', desc: 'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included.' },
  { icon: '📈', title: 'Proven Results', subhead: 'Track Record of Growing Businesses', desc: 'Our clients see average 150% increase in conversions and 40% improvement in site speed. Real results, measurable impact.' },
]

const FAQ_ITEMS = [
  { q: 'How long does a WordPress website take?', a: 'Most WordPress websites are completed within 2-3 weeks. Complex projects with custom functionality may take 4-6 weeks. We always provide realistic timelines upfront.' },
  { q: 'What is included in your maintenance plans?', a: 'Our maintenance plans include regular updates for WordPress core, themes, and plugins, security monitoring, performance optimization, backup management, uptime monitoring, and priority support.' },
  { q: 'Do you offer a money-back guarantee?', a: 'Yes. We offer a 30-day money-back guarantee on all development projects. If you are not satisfied with our work, we will refund you in full — no questions asked.' },
  { q: 'Can you work with my existing WordPress site?', a: 'Absolutely. We work with existing WordPress sites for redesigns, migrations, speed optimization, security fixes, bug fixing, and adding new features and functionality.' },
  { q: 'Do you offer ongoing support after launch?', a: 'Yes. Every project includes 30 days of free post-launch support. After that, we offer flexible monthly maintenance plans starting at $79/month to keep your site running perfectly.' },
  { q: 'What makes ARIOSETECH different from other agencies?', a: 'We specialize exclusively in WordPress, WooCommerce, and Shopify — no generalist dabbling. This focus means deeper expertise, faster delivery, and better results for your specific platform.' },
]

// ── Build page layouts ────────────────────────────────────────────
const homeLayout = { sections: [
  sec('hero', { eyebrow: 'Available for new projects', headline: 'Professional WordPress, Shopify & WooCommerce Development Since 2017', subheadline: "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.", supportingText: 'Trusted by businesses in the USA, UAE, and Switzerland for affordable, high-quality web development that delivers real ROI.', ctaPrimaryLabel: 'Get Free Quote & Strategy Call', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View Our Portfolio', ctaSecondaryHref: '/portfolio', trust: TRUST }),
  sec('stats', { items: [{ value: '100+', label: 'Projects Delivered' }, { value: '7+', label: 'Years Experience' }, { value: '5.0★', label: 'Clutch Rating' }, { value: '40+', label: 'Industries Served' }] }),
  sec('services', { eyebrow: 'What We Offer', headline: 'Comprehensive Web Development Solutions for Your Business Growth', items: [
    { icon: '🔷', title: 'WordPress Development', headline: 'Build Powerful, Scalable Websites', desc: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.', features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services', price: '$799', href: '/services/wordpress' },
    { icon: '🛒', title: 'WooCommerce Development', headline: 'Launch Your Dream E-commerce Store', desc: 'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.', features: 'Store Setup & Customization,Payment Gateway Integration,Multi-vendor Solutions,Performance Optimization', price: '$1,299', href: '/services/woocommerce' },
    { icon: '🚀', title: 'Shopify Development', headline: 'Scale Your Business with Shopify', desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.', features: 'Custom Store Development,Shopify Plus Solutions,App Integration,Conversion Optimization', price: '$999', href: '/services/shopify' },
  ]}),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success', items: WHY_ITEMS }),
  sec('portfolio', { eyebrow: 'Our Work', headline: 'Success Stories That Speak for Themselves', intro: "Discover how we've transformed businesses across industries with custom web solutions that drive growth and maximize ROI.", items: PORTFOLIO_ITEMS, ctaLabel: 'Explore All Projects', ctaHref: '/portfolio' }),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('process', { eyebrow: 'How We Work', headline: 'Your Success Journey in 5 Simple Steps', steps: PROCESS_STEPS }),
  sec('audit', { eyebrow: 'Free Audit', headline: 'Get Your Free Website Performance Audit', subhead: "Discover what's holding your website back from peak performance.", desc: "Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.", ctaLabel: 'Get My Free Audit Report', ctaHref: '/contact', guarantee: 'No spam, ever. Detailed report delivered within 24 hours.' }),
  sec('cta', { eyebrow: 'Get Started Today', headline: 'Start Your Success Story Today', desc: 'Join 100+ successful businesses that chose ARIOSETECH for their web development needs. Professional results, affordable pricing, and ongoing support.', trust: CTA_TRUST, ctaLabel: 'Schedule Free Consultation', ctaHref: '/contact', secondaryLabel: 'View Our Portfolio', secondaryHref: '/portfolio' }),
  sec('faq', { eyebrow: 'FAQ', headline: 'Frequently Asked Questions', items: FAQ_ITEMS }),
]}

const wordpressLayout = { sections: [
  sec('hero', { eyebrow: 'WordPress Services', headline: 'Professional WordPress Development Services', subheadline: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability.', supportingText: 'Starting at $799 · 30-Day Money-Back Guarantee · Free Post-Launch Support', ctaPrimaryLabel: 'Get Free WordPress Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View WordPress Portfolio', ctaSecondaryHref: '/portfolio', trust: 'Custom Development — Tailored to your exact needs,Lightning Fast — Optimized for Core Web Vitals,100% Secure — Enterprise-grade security,SEO-Ready — Built for search engine success,24/7 Support — Always here when you need us' }),
  sec('services', { eyebrow: 'All Services', headline: 'Complete WordPress Solutions for Every Business Need', items: WP_SERVICES }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success', items: WHY_ITEMS }),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('faq', { eyebrow: 'WordPress FAQ', headline: 'Frequently Asked Questions', items: FAQ_ITEMS }),
  sec('cta', { eyebrow: 'Get Started', headline: 'Ready to Build Your WordPress Site?', desc: 'Get a free consultation and project quote within 24 hours. No commitment required.', trust: CTA_TRUST, ctaLabel: 'Get Free Consultation', ctaHref: '/contact', secondaryLabel: 'View Our Work', secondaryHref: '/portfolio' }),
]}

const woocommerceLayout = { sections: [
  sec('hero', { eyebrow: 'WooCommerce Services', headline: 'Custom WooCommerce Development Services', subheadline: "Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization. Starting at $1,299.", supportingText: '30-Day Money-Back Guarantee · Free Post-Launch Support', ctaPrimaryLabel: 'Get Free WooCommerce Quote', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View WooCommerce Portfolio', ctaSecondaryHref: '/portfolio', trust: 'Store Setup & Customization,Payment Gateway Integration,Multi-vendor Solutions,Performance Optimization' }),
  sec('services', { eyebrow: 'All Services', headline: 'Complete WooCommerce Solutions for Every Business Need', items: WC_SERVICES }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success', items: WHY_ITEMS }),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('faq', { eyebrow: 'WooCommerce FAQ', headline: 'Frequently Asked Questions', items: FAQ_ITEMS }),
  sec('cta', { eyebrow: 'Get Started', headline: 'Ready to Launch Your WooCommerce Store?', desc: 'Get a free quote within 24 hours. No commitment required.', trust: CTA_TRUST, ctaLabel: 'Start Your Store', ctaHref: '/contact', secondaryLabel: 'View Our Work', secondaryHref: '/portfolio' }),
]}

const shopifyLayout = { sections: [
  sec('hero', { eyebrow: 'Shopify Services', headline: 'Professional Shopify Development Services', subheadline: 'Scale your business with Shopify. From startup stores to Shopify Plus enterprises, we deliver results that matter. Starting at $999.', supportingText: '30-Day Money-Back Guarantee · Free Post-Launch Support', ctaPrimaryLabel: 'Get Free Shopify Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View Shopify Portfolio', ctaSecondaryHref: '/portfolio', trust: 'Custom Store Development,Shopify Plus Solutions,App Integration,Conversion Optimization' }),
  sec('services', { eyebrow: 'All Services', headline: 'Complete Shopify Solutions for Every Business Need', items: SHOPIFY_SERVICES }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success', items: WHY_ITEMS }),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('faq', { eyebrow: 'Shopify FAQ', headline: 'Frequently Asked Questions', items: FAQ_ITEMS }),
  sec('cta', { eyebrow: 'Get Started', headline: 'Ready to Launch Your Shopify Store?', desc: 'Get a free quote within 24 hours. No commitment required.', trust: CTA_TRUST, ctaLabel: 'Start Your Store', ctaHref: '/contact', secondaryLabel: 'View Our Work', secondaryHref: '/portfolio' }),
]}

const seoLayout = { sections: [
  sec('hero', { eyebrow: 'SEO Services', headline: 'Get Found on Google. Drive Real Organic Traffic.', subheadline: "Expert SEO services for WordPress, WooCommerce, and Shopify stores. We don't just improve rankings — we drive qualified traffic that converts into paying customers.", supportingText: 'Free 25-point audit · No commitment · Results in 90 days or money back', ctaPrimaryLabel: 'Get Free SEO Audit', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View Case Studies', ctaSecondaryHref: '/portfolio', trust: 'Technical SEO,On-Page Optimization,E-Commerce SEO,Local SEO,Content Strategy' }),
  sec('stats', { items: [{ value: '+312%', label: 'Avg Organic Traffic Increase' }, { value: '#1-3', label: 'Google Rankings' }, { value: '-45%', label: 'Bounce Rate Reduction' }, { value: '6mo', label: 'Avg Timeline to Results' }] }),
  sec('whyus', { eyebrow: 'Why SEO', headline: 'SEO is Your Best Long-Term Investment', items: [
    { icon: '📈', title: 'Compounds Over Time', subhead: 'Results Build Month After Month', desc: 'Unlike paid ads that stop when you stop paying, SEO compounds over time. Every month of optimization builds on the last.' },
    { icon: '🎯', title: 'Qualified Traffic', subhead: 'Buyers, Not Just Browsers', desc: 'People searching for your services are already interested. SEO brings qualified leads who are ready to buy.' },
    { icon: '💰', title: 'Best ROI', subhead: '748% Average ROI', desc: 'Average SEO ROI is 748% according to Search Engine Journal. No other marketing channel comes close long-term.' },
    { icon: '🔍', title: 'Full Transparency', subhead: 'Monthly Reports, Clear Metrics', desc: 'You get detailed monthly reports showing exactly what we did, what rankings improved, and what traffic increased.' },
  ]}),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('faq', { eyebrow: 'SEO FAQ', headline: 'Frequently Asked Questions About SEO', items: [
    { q: 'How long does SEO take to show results?', a: 'SEO typically shows meaningful results within 3-6 months. You may see small improvements in 4-6 weeks, but significant traffic increases usually come after 3-6 months of consistent work.' },
    { q: 'How much does SEO cost?', a: 'Our SEO services start at $299 for a one-time technical audit and go up to $699/month for ongoing content and optimization. We always provide a custom quote based on your specific goals and competition.' },
    { q: 'Do you guarantee #1 rankings on Google?', a: 'No legitimate SEO agency can guarantee specific rankings, and anyone who does is lying. We do guarantee improvement in your overall organic visibility, traffic, and rankings over time.' },
    { q: 'What is included in your SEO service?', a: 'Our SEO service includes technical audit, on-page optimization, keyword research and mapping, content optimization, link building strategy, Google Search Console setup, and monthly reporting.' },
  ]}),
  sec('cta', { eyebrow: 'Get Started', headline: 'Ready to Dominate Google Search?', desc: 'Get a free SEO audit and discover exactly what is holding your site back from ranking #1.', trust: CTA_TRUST, ctaLabel: 'Get Free SEO Audit', ctaHref: '/contact', secondaryLabel: 'View Case Studies', secondaryHref: '/portfolio' }),
]}

const aboutLayout = { sections: [
  sec('hero', { eyebrow: 'About Us', headline: 'Specialists, Not Generalists. Consider It Solved.', subheadline: 'ARIOSETECH was founded with one mission: give growing businesses access to the same quality of web development that enterprise brands enjoy — at honest, transparent prices.', supportingText: 'Based in Lahore, Pakistan. Serving clients in the USA, UAE, Switzerland, UK, Australia, and beyond.', ctaPrimaryLabel: 'Work With Us', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View Our Work', ctaSecondaryHref: '/portfolio', trust: '100+ Projects Delivered,7+ Years Experience,40+ Industries Served,5.0★ Clutch Rating' }),
  sec('stats', { items: [{ value: '100+', label: 'Projects Delivered' }, { value: '7+', label: 'Years Experience' }, { value: '40+', label: 'Industries Served' }, { value: '5.0★', label: 'Clutch Rating' }] }),
  sec('whyus', { eyebrow: 'Our Values', headline: 'What Sets Us Apart', items: [
    { icon: '🎯', title: 'Specialists Only', subhead: 'Three Platforms, Deep Expertise', desc: 'We only work with WordPress, WooCommerce, and Shopify. This focus means deeper expertise and better results than any generalist agency.' },
    { icon: '💬', title: 'Transparent Communication', subhead: 'No Hidden Fees, No Surprises', desc: 'You know exactly what you are getting, when you are getting it, and what it costs. Clear communication at every stage.' },
    { icon: '⚡', title: 'Speed Without Compromise', subhead: 'Fast Because We Have Done It Before', desc: 'We deliver fast because we have done it before. Our team knows these platforms inside out — no learning on your budget.' },
    { icon: '🤝', title: 'Long-term Partnership', subhead: 'We Are With You After Launch', desc: 'We do not disappear after launch. Ongoing support, maintenance, and growth — we are your long-term web development partner.' },
  ]}),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('cta', { eyebrow: 'Start a Project', headline: 'Ready to Work With Specialists?', desc: 'Get a free consultation and see why 100+ businesses chose ARIOSETECH for their web development needs.', trust: CTA_TRUST, ctaLabel: 'Start a Project', ctaHref: '/contact', secondaryLabel: 'View Our Work', secondaryHref: '/portfolio' }),
]}

const contactLayout = { sections: [
  sec('contact', { eyebrow: 'Get In Touch', headline: 'Ready to Transform Your Online Presence?', guarantee: 'We respond to all inquiries within 2 hours during business days.' }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why 100+ Businesses Trust ARIOSETECH', items: WHY_ITEMS }),
  sec('faq', { eyebrow: 'FAQ', headline: 'Frequently Asked Questions', items: FAQ_ITEMS }),
]}

const portfolioLayout = { sections: [
  sec('portfolio', { eyebrow: 'Our Work', headline: 'Success Stories That Speak for Themselves', intro: "Discover how we've transformed businesses across industries with custom web solutions that drive growth and maximize ROI.", items: PORTFOLIO_ITEMS, ctaLabel: 'Start Your Project', ctaHref: '/contact' }),
  sec('stats', { items: [{ value: '100+', label: 'Projects Delivered' }, { value: '7+', label: 'Years Experience' }, { value: '40+', label: 'Industries Served' }, { value: '5.0★', label: 'Clutch Rating' }] }),
  sec('testimonials', { eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us', items: TESTIMONIALS }),
  sec('cta', { eyebrow: 'Ready?', headline: 'Let\'s Build Your Success Story', desc: 'Join 100+ businesses that chose ARIOSETECH for their web development needs.', trust: CTA_TRUST, ctaLabel: 'Start a Project', ctaHref: '/contact', secondaryLabel: 'View All Services', secondaryHref: '/services/wordpress' }),
]}

const blogLayout = { sections: [
  sec('heading', { eyebrow: 'Knowledge Base', headline: 'WordPress, WooCommerce & Shopify Insights', body: 'Expert tutorials, case studies, and industry insights to help you grow your online business. Published by the ARIOSETECH team.', align: 'center' }),
  sec('cta', { eyebrow: 'Free Audit', headline: 'Get Your Free Website Performance Audit', desc: "Discover what's holding your website back. Our 25-point audit covers speed, SEO, security, and conversions.", trust: '', ctaLabel: 'Get Free Audit', ctaHref: '/contact', secondaryLabel: '', secondaryHref: '' }),
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
  { slug: 'how-to-optimize-ecommerce-site-speed', title: 'How to Optimize Your E-Commerce Site Speed in 2025', excerpt: 'Speed optimization techniques that directly improve conversions and revenue for WooCommerce and Shopify stores.', category: 'Performance', author: 'ARIOSETECH Team', date: '2025-02-15', readTime: 10, tags: ['Speed','Performance'], published: true, status: 'published', content: [{type:'h2',text:'Why Speed Matters'},{type:'p',text:'A 1-second delay results in 7% fewer conversions. For a $10,000/month store, that is $700 lost per second of delay.'},{type:'h2',text:'Optimize Images First'},{type:'p',text:'Images are the biggest culprit. Compress them and use WebP format to reduce page size by 60%.'},{type:'h2',text:'Implement Caching'},{type:'p',text:'Browser and server-side caching drastically reduce load times for returning visitors.'},{type:'h2',text:'Use a CDN'},{type:'p',text:'A CDN serves content from servers close to your visitors, reducing latency worldwide.'}], seo: SEO_D, updatedAt: new Date().toISOString() },
  { slug: 'wordpress-speed-optimization-guide', title: 'WordPress Speed: From 40 to 98 PageSpeed Score in 7 Days', excerpt: "The exact process we used to take a client's WordPress site from 40 to 98 on Google PageSpeed in one week.", category: 'Performance', author: 'ARIOSETECH Team', date: '2025-03-15', readTime: 9, tags: ['WordPress','Speed'], published: true, status: 'published', content: [{type:'h2',text:'The Starting Point: Score 40'},{type:'p',text:"Our client's site was scoring 40 on PageSpeed. Bounce rate was over 70%. Here is how we fixed it in 7 days."},{type:'h2',text:'Day 1-2: Images (Score: 58)'},{type:'p',text:'Found 47 uncompressed images. Converted to WebP, added lazy loading. Score jumped from 40 to 58.'},{type:'h2',text:'Day 3-4: Caching (Score: 78)'},{type:'p',text:'Installed WP Rocket, cleaned 15,000 database revisions, set up Redis. Score jumped to 78.'},{type:'h2',text:'Day 5-7: CDN and Code (Score: 98)'},{type:'p',text:'Added Cloudflare CDN, deferred non-critical JS, removed render-blocking CSS. Final score: 98.'}], seo: SEO_D, updatedAt: new Date().toISOString() },
  { slug: 'shopify-vs-woocommerce-for-fashion', title: 'Shopify vs WooCommerce for Fashion Brands: Real Experience', excerpt: "Based on building 20+ fashion stores, here's our honest comparison for fashion and apparel businesses.", category: 'E-Commerce', author: 'ARIOSETECH Team', date: '2025-03-01', readTime: 7, tags: ['Shopify','WooCommerce'], published: true, status: 'published', content: [{type:'h2',text:'Fashion Has Unique Needs'},{type:'p',text:'Fashion e-commerce needs beautiful displays, size guides, lookbooks, and seamless UX beyond basic setup.'},{type:'h2',text:'Shopify for Fashion'},{type:'p',text:'Shopify excels with its theme ecosystem, Instagram/TikTok integrations, and Shopify Markets for international selling.'},{type:'h2',text:'WooCommerce for Fashion'},{type:'p',text:'WooCommerce gives complete control — custom configurators, unlimited variants, and ERP integrations.'},{type:'h2',text:'Our Verdict'},{type:'p',text:'Shopify for fast launches. WooCommerce for complex customization and B2B needs.'}], seo: SEO_D, updatedAt: new Date().toISOString() },
  { slug: 'woocommerce-payment-gateways-guide', title: 'WooCommerce Payment Gateways: Complete Setup Guide 2025', excerpt: 'Everything you need to know about choosing and setting up payment gateways for your WooCommerce store.', category: 'WooCommerce', author: 'ARIOSETECH Team', date: '2025-04-01', readTime: 8, tags: ['WooCommerce','Payments'], published: true, status: 'published', content: [{type:'h2',text:'Choosing the Right Gateway'},{type:'p',text:'The right gateway affects your conversion rate, fees, and customer trust. Choose carefully.'},{type:'h2',text:'Stripe: Best for Most Stores'},{type:'p',text:'2.9% + $0.30 per transaction, 135+ currencies, excellent developer experience. Our top recommendation.'},{type:'h2',text:'PayPal: Maximum Trust'},{type:'p',text:'400 million users trust PayPal. Offering it can increase conversions by 10-15% internationally.'},{type:'h2',text:'Pakistani Gateways'},{type:'p',text:'JazzCash and EasyPaisa are essential for Pakistani businesses. We integrate both seamlessly.'}], seo: SEO_D, updatedAt: new Date().toISOString() },
]

const PORTFOLIO_DB = [
  { slug: 'thekapra-woocommerce', title: 'The Kapra', client: 'The Kapra', clientUrl: 'https://thekapra.com', category: 'woocommerce', summary: 'Premium Pakistani fashion brand WooCommerce store with custom product configurator and complex inventory management.', challenge: 'Complex size and customization options for traditional Pakistani clothing.', solution: 'Custom WooCommerce product configurator with real-time preview and automated inventory alerts.', quote: 'ARIOSETECH transformed our vision into reality. Our sales tripled within 3 months.', results: [{label:'Revenue Growth',value:'+300%'},{label:'Conversion Rate',value:'4.2%'},{label:'Load Time',value:'0.9s'}], stack: ['WooCommerce','PHP','Custom Theme','ACF'], featured: true, published: true, updatedAt: new Date().toISOString() },
  { slug: 'drscents-woocommerce', title: 'Dr. Scents', client: 'Dr. Scents', clientUrl: 'https://drscents.com', category: 'woocommerce', summary: 'International luxury fragrance brand launched across 32 countries with multi-site WooCommerce network.', challenge: 'Needed 32 separate storefronts with local pricing, currency, and shipping rules.', solution: 'WooCommerce Multisite with centralized product management and automated currency conversion.', quote: 'Incredible speed and quality. They launched our entire international operation in under 4 months.', results: [{label:'Countries Launched',value:'32'},{label:'Launch Time',value:'4 months'},{label:'Revenue YoY',value:'+200%'}], stack: ['WooCommerce Multisite','PHP','WPML'], featured: true, published: true, updatedAt: new Date().toISOString() },
  { slug: 'wyox-shopify', title: 'WYOX Sports', client: 'WYOX Sports', clientUrl: 'https://wyoxsports.com', category: 'shopify', summary: 'USA-based international sports equipment brand with B2B wholesale portal and custom product builder.', challenge: 'Needed B2C retail and B2B wholesale with custom pricing and US market compliance.', solution: 'Shopify Plus with custom B2B portal and automated wholesale pricing rules.', quote: 'Professional, reliable, and always available. We now serve 40+ countries from one platform.', results: [{label:'International Sales',value:'+250%'},{label:'B2B Orders',value:'+150%'},{label:'Countries',value:'40+'}], stack: ['Shopify Plus','Liquid','React'], featured: true, published: true, updatedAt: new Date().toISOString() },
  { slug: 'genovie-shopify', title: 'Genovie', client: 'Genovie', clientUrl: 'https://genovie.com', category: 'shopify', summary: 'Premium skincare brand with AI-powered quiz that recommends products and converts at 38%.', challenge: 'Customers struggled to find right products, leading to high return rates.', solution: 'Custom Shopify quiz with personalized recommendations and Klaviyo integration.', quote: 'Our quiz converts at 38% — far above industry average. Returns dropped by 60%.', results: [{label:'Quiz Conversion',value:'38%'},{label:'Revenue Growth',value:'+85%'},{label:'Returns Reduced',value:'-60%'}], stack: ['Shopify','Custom Quiz','Klaviyo'], featured: false, published: true, updatedAt: new Date().toISOString() },
  { slug: 'geomag-woocommerce', title: 'GeoMag World', client: 'GeoMag World', clientUrl: 'https://geomagworld.com', category: 'woocommerce', summary: 'Global educational toy brand with 15 languages, age-based filtering, and multi-currency across 30+ markets.', challenge: 'Multi-language, multi-currency catalog with age-appropriate filtering.', solution: 'WooCommerce with WPML, custom age filter, Aelia Currency Switcher, and Elasticsearch search.', quote: 'Managing our global catalog is now effortless. Average order value increased 200%.', results: [{label:'Languages',value:'15'},{label:'Markets',value:'30+'},{label:'AOV Increase',value:'+200%'}], stack: ['WooCommerce','WPML','Elasticsearch'], featured: false, published: true, updatedAt: new Date().toISOString() },
  { slug: 'janya-shopify', title: 'Janya.pk', client: 'Janya', clientUrl: 'https://janya.pk', category: 'shopify', summary: 'Pakistani fashion marketplace with 50+ vendors, JazzCash/EasyPaisa integration, and wholesale portal.', challenge: 'Multi-vendor marketplace with local payment gateways and commission management.', solution: 'Shopify + custom vendor portal + JazzCash/EasyPaisa + automated commission payouts.', quote: 'We launched 50+ vendors in the first month. The payment integration works flawlessly.', results: [{label:'Vendors',value:'50+'},{label:'Monthly Orders',value:'2,000+'},{label:'Payment Success',value:'98%'}], stack: ['Shopify','Vendor App','JazzCash','EasyPaisa'], featured: false, published: true, updatedAt: new Date().toISOString() },
  { slug: 'snapglammed-spa', title: 'Snap Glammed Spa', client: 'Snap Glammed', clientUrl: 'https://snapglammed.com', category: 'wordpress', summary: 'Luxury spa with online appointment booking, gift card store, and client loyalty program.', challenge: 'Needed online booking, gift cards, service packages, and loyalty points.', solution: 'WordPress with Amelia booking, WooCommerce gift cards, and custom loyalty points.', quote: 'Online bookings increased by 400% in the first quarter. The gift card feature is a hit.', results: [{label:'Online Bookings',value:'+400%'},{label:'Gift Card Sales',value:'+200%'},{label:'Revenue',value:'+65%'}], stack: ['WordPress','Amelia','WooCommerce'], featured: false, published: true, updatedAt: new Date().toISOString() },
  { slug: 'ctvpromo-wordpress', title: 'CTV Promo', client: 'CTV Promo', clientUrl: 'https://ctvpromo.com', category: 'wordpress', summary: 'Promotional products company with custom quote system, PDF generation, and HubSpot CRM integration.', challenge: 'Complex product customization with quantity-based pricing and automated quotes.', solution: 'WordPress with custom quote builder plugin, PDF generation, and HubSpot sync.', quote: 'The quote system saves our team 5 hours per day. Lead quality improved dramatically.', results: [{label:'Time Saved',value:'-80%'},{label:'Lead Quality',value:'+120%'},{label:'Close Rate',value:'+35%'}], stack: ['WordPress','Custom Plugin','HubSpot'], featured: false, published: true, updatedAt: new Date().toISOString() },
]

export async function GET(req: NextRequest) { return POST(req) }

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: 'Missing or wrong secret. Add ?secret=YOUR_ADMIN_JWT_SECRET to the URL.' }, { status: 401 })
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

    const usersCol = await getCollection('users')
    if (!await usersCol.findOne({ username: process.env.ADMIN_USERNAME || 'admin' })) {
      await usersCol.insertOne({ username: process.env.ADMIN_USERNAME || 'admin', password: hashPassword(process.env.ADMIN_PASSWORD || 'changeme123'), role: 'admin', createdAt: new Date() } as never)
    }

    await (await getCollection('settings')).updateOne(
      { key: 'site_settings' },
      { $set: { key: 'site_settings', value: { site_name: 'ARIOSETECH', logo_url: 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png', tagline: 'Consider It Solved', email: 'info@ariosetech.com', phone: '+92 300 9484 739', whatsapp: 'https://wa.me/923009484739', address: '95 College Road, Block E, PCSIR Staff Colony, Lahore, 54770' } } },
      { upsert: true }
    )

    return NextResponse.json({ success: true, seeded: { pages: PAGES.length, blogs: BLOGS.length, portfolio: PORTFOLIO_DB.length }, message: 'All pages seeded with full content. Go to /admin/pages to see them.' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
