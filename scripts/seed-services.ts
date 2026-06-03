import { MongoClient } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#\s][^=]+)=(.*)$/)
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
    }
  })
}

const MONGODB_URI = process.env.MONGODB_URI as string
const MONGODB_DB = process.env.MONGODB_DB as string || 'ariosetech'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

const shopifyData = {
  slug: 'shopify',
  title: 'Shopify Services',
  status: 'published',
  hero: {
    eyebrow: 'Shopify Services',
    headline: 'Professional Shopify',
    subheadline: 'Development Services',
    desc: 'From startup stores to enterprise Shopify Plus platforms, we create e-commerce experiences that drive results. We\'ve helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.',
    bullets: [
      'Custom Development — Unique stores that stand out',
      'Conversion-Focused — Optimized for maximum sales',
      'Shopify Plus Certified — Enterprise solutions available',
      'Mobile-Optimized — Perfect on every device',
      '24/7 Expert Support — Always here to help'
    ],
    ctaPrimary: 'Get Free Shopify Store Audit',
    ctaSecondary: 'View Shopify Portfolio',
    startingPrice: 'Starting at $999 | 30-Day Money-Back Guarantee | Free Post-Launch Training'
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
  whyUs: [
    { icon: '🏆', title: 'Shopify Partner Excellence', desc: 'Official Shopify Partners with proven expertise in building successful e-commerce stores across various industries.' },
    { icon: '💰', title: 'Conversion-Focused Approach', desc: 'Every store we build is optimized for sales with proven conversion tactics and user experience best practices.' },
    { icon: '🚀', title: 'Shopify Plus Certified', desc: 'Specialized expertise in enterprise-level Shopify Plus implementations for high-growth businesses.' },
    { icon: '📱', title: 'Mobile-Commerce Experts', desc: 'Deep understanding of mobile shopping behaviors ensures your store performs perfectly on all devices.' },
    { icon: '🔧', title: 'Ongoing Partnership', desc: "We\'re your long-term Shopify growth partner, supporting your business at every stage of expansion." },
    { icon: '⚡', title: 'Performance Obsessed', desc: 'Every Shopify store we develop loads fast and ranks well in search engines.' }
  ],
  process: [
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
],
  portfolio: [
    { name: 'WYOX Sports', industry: 'Sports Equipment (USA)', challenge: 'Complex product variations and US market requirements', solution: 'Custom Shopify store with advanced filtering and checkout optimization', result: '250%', resultLabel: 'increase in online sales' },
    { name: 'Genovie', industry: 'Fashion & Lifestyle', challenge: 'High-end brand representation with seamless UX', solution: 'Custom Shopify Plus store with advanced personalization', result: '180%', resultLabel: 'increase in average order value' },
    { name: 'Janya.pk', industry: 'Wholesale Fashion', challenge: 'B2B wholesale functionality with complex pricing', solution: 'Shopify Plus with custom wholesale portal integration', result: '300%', resultLabel: 'increase in wholesale orders' }
  ],
  faqs: [
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
],
  seo: {
    title: 'Professional Shopify Development Services | Ariosetech',
    description: 'Scale Your E-commerce Business with Expert Shopify Solutions.'
  }
};

const wordpressData = {
  slug: 'wordpress',
  title: 'WordPress Services',
  status: 'published',
  hero: {
    eyebrow: 'WordPress Services',
    headline: 'Professional WordPress',
    subheadline: 'Development Services',
    desc: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability.',
    bullets: [
      'Custom Development — Tailored to your exact needs',
      'Lightning Fast — Optimized for Core Web Vitals',
      '100% Secure — Enterprise-grade security measures',
      'SEO-Ready — Built for search engine success',
      '24/7 Support — Always here when you need us'
    ],
    ctaPrimary: 'Get Free WordPress Consultation',
    ctaSecondary: 'View WordPress Portfolio',
    startingPrice: 'Starting at $799 | 30-Day Money-Back Guarantee | Free Post-Launch Support'
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
  whyUs: [
    { icon: '🏆', title: '7+ Years WordPress Expertise', desc: 'We\'ve been perfecting WordPress development since 2017, delivering 50+ successful WordPress projects across various industries.' },
    { icon: '⚡', title: 'Performance-First Approach', desc: 'Every WordPress site we build is optimized for speed, security, and search engines from day one.' },
    { icon: '🔒', title: 'Security-Focused Development', desc: 'We implement enterprise-grade security measures to protect your WordPress site from threats.' },
    { icon: '📱', title: 'Mobile-First Design', desc: 'All our WordPress sites are built with mobile users in mind, ensuring perfect performance across all devices.' },
    { icon: '🔧', title: 'Ongoing Support', desc: "We don\'t just build and leave. Our team provides continuous support to ensure your WordPress site thrives." },
    { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden costs or surprise fees. Our WordPress development pricing is upfront and honest.' }
  ],
  process: [
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
],
  portfolio: [
    { name: 'Corporate Website', industry: 'Professional Services', challenge: 'Modern design with complex functionality', solution: 'Custom WordPress theme with advanced features', result: '200%', resultLabel: 'increase in lead generation' },
    { name: 'E-commerce Integration', industry: 'Retail', challenge: 'WordPress with e-commerce functionality', solution: 'WooCommerce integration with custom features', result: '150%', resultLabel: 'increase in online sales' },
    { name: 'Multilingual Site', industry: 'International Business', challenge: '5-language website with complex navigation', solution: 'WPML-powered multilingual WordPress site', result: '300%', resultLabel: 'increase in international inquiries' }
  ],
  faqs: [
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
],
  seo: {
    title: 'Professional WordPress Development Services | Ariosetech',
    description: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results.'
  }
};

const woocommerceData = {
  slug: 'woocommerce',
  title: 'WooCommerce Services',
  status: 'published',
  hero: {
    eyebrow: 'WooCommerce Services',
    headline: 'Professional WooCommerce',
    subheadline: 'Development Services',
    desc: 'Transform your WordPress site into a powerful online store that drives sales. We create custom WooCommerce solutions that combine the flexibility of WordPress with robust e-commerce functionality. Trusted by 40+ businesses worldwide for exceptional performance and growth.',
    bullets: [
      'Custom Development — Tailored to your exact business needs',
      'WordPress Integration — Seamless blend of content and commerce',
      'Scalable Solutions — Grow from startup to enterprise',
      'Mobile-Optimized — Perfect shopping experience on all devices',
      '24/7 Expert Support — Always here when you need us'
    ],
    ctaPrimary: 'Get Free WooCommerce Consultation',
    ctaSecondary: 'View WooCommerce Portfolio',
    startingPrice: 'Starting at $1,299 | 30-Day Money-Back Guarantee | Free Post-Launch Training'
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
  whyUs: [
    { icon: '🏆', title: 'WordPress + WooCommerce Expertise', desc: 'Deep understanding of both WordPress and WooCommerce ensures seamless integration and optimal performance for your online store.' },
    { icon: '🛒', title: 'E-commerce Focus', desc: 'Specialized in e-commerce development with proven strategies for increasing conversions, average order value, and customer retention.' },
    { icon: '🎨', title: 'Custom Solutions', desc: 'Every WooCommerce store we build is uniquely tailored to your business needs, brand identity, and growth objectives.' },
    { icon: '⚡', title: 'Performance Obsessed', desc: 'We optimize every aspect of your store for speed, ensuring fast loading times that keep customers engaged and improve search rankings.' },
    { icon: '🔒', title: 'Security First', desc: 'Enterprise-grade security measures protect your store and customer data from threats, ensuring trust and compliance.' },
    { icon: '📈', title: 'Growth Partnership', desc: 'We don\'t just build stores; we create growth-focused solutions that scale with your business and support long-term success.' }
  ],
  process: [
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
],
  portfolio: [
    { name: 'The Kapra', industry: 'Fashion E-commerce', challenge: 'Complex inventory management and custom features', solution: 'Custom WooCommerce with advanced product variations', result: '300%', resultLabel: 'increase in online sales' },
    { name: 'Dr. Scents International', industry: 'Perfume & Cosmetics', challenge: '32 different country-specific websites', solution: 'Multi-site WooCommerce with localization', result: 'Launched in 32 countries', resultLabel: 'under 4 months' },
    { name: 'GeoMag World', industry: 'Educational Toys', challenge: 'Complex product catalog with learning resources', solution: 'WooCommerce with custom product configurator', result: '200%', resultLabel: 'increase in average order value' }
  ],
  faqs: [
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
],
  seo: {
    title: 'Professional WooCommerce Development Services | Ariosetech',
    description: 'Transform your WordPress site into a powerful online store that drives sales.'
  }
};

const seoData = {
  slug: 'seo',
  title: 'SEO Services',
  status: 'published',
  hero: {
    eyebrow: 'SEO Services for Growing Brands',
    headline: 'SEO Services That Help',
    subheadline: 'Your Business Get Found',
    desc: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance. From technical fixes to local SEO and content strategy, we build a stronger search presence that supports real business growth.',
    bullets: [
      'Website SEO — Strengthens your foundation',
      'Local SEO — Brings more geographic relevance',
      'Technical SEO — Crawlability & speed audit',
      'SEO Content — Topical authority content strategy'
    ],
    ctaPrimary: 'Book a Free SEO Consultation',
    ctaSecondary: 'Get a Website Audit',
    startingPrice: 'Website SEO \u2022 Local SEO \u2022 Technical SEO \u2022 SEO Content'
  },
  services: [
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
],
  whyUs: [
    { icon: '🎯', title: 'Business-First SEO', desc: 'We focus on visibility that supports real business outcomes, not just traffic numbers.' },
    { icon: '⚙️', title: 'Development and SEO in Sync', desc: 'Because our team works across websites, structure, and performance, we can align SEO with how your site is actually built.' },
    { icon: '✅', title: 'Clean, Practical Execution', desc: 'We focus on the changes that make the biggest impact without creating confusion or unnecessary complexity.' },
    { icon: '📈', title: 'Long-Term Growth Thinking', desc: 'We build SEO in a way that supports stronger performance over time, not just short-term spikes.' },
    { icon: '🏪', title: 'Support for Different Business Types', desc: 'We work with service businesses, local brands, and eCommerce companies that need stronger digital visibility.' }
  ],
  process: [
    { n: '01', title: 'Audit', sub: '', desc: 'We review your website, search presence, content, and technical condition to understand what is holding performance back.', time: '' },
    { n: '02', title: 'Strategy', sub: '', desc: 'We build an SEO plan based on your business model, audience, goals, and search opportunities.', time: '' },
    { n: '03', title: 'Optimization', sub: '', desc: 'We improve your pages, structure, technical setup, content targeting, and internal SEO foundation.', time: '' },
    { n: '04', title: 'Content & Growth', sub: '', desc: 'Where needed, we build supporting content, improve weak pages, and strengthen site-wide relevance.', time: '' },
    { n: '05', title: 'Ongoing Improvement', sub: '', desc: 'SEO is not static. We continue refining based on performance, search trends, and growth priorities.', time: '' }
  ],
  portfolio: [],
  faqs: [
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
],
  seo: {
    title: 'Professional SEO Services | Ariosetech',
    description: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance.'
  }
};

async function seedServices() {
  const client = new MongoClient(MONGODB_URI)
  try {
    console.log('Connecting to MongoDB...')
    await client.connect()
    const db = client.db(MONGODB_DB)
    const servicesCol = db.collection('services')

    console.log('Upserting Service Pages...')
    const pages = [shopifyData, wordpressData, woocommerceData, seoData]
    for (const page of pages) {
      const result = await servicesCol.updateOne(
        { slug: page.slug },
        { $set: { ...page, updatedAt: new Date() } },
        { upsert: true }
      )
      console.log(`- ${page.slug}: ${result.upsertedId ? 'Created' : 'Updated'}`)
    }
    console.log('Services seeded successfully!')
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await client.close()
  }
}
seedServices();