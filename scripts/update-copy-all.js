const fs = require('fs');
const path = require('path');

const root = 'C:\\Users\\HP\\Downloads\\ariosetech-v2';

const files = {
  homeClient: path.join(root, 'app', '(site)', 'HomeClient.tsx'),
  seedHomepage: path.join(root, 'scripts', 'seed-homepage.ts'),
  updateMongo: path.join(root, 'scripts', 'update-mongo.ts'),
  seedHomepageRoute: path.join(root, 'app', 'api', 'seed-homepage', 'route.ts'),
  seedServices: path.join(root, 'scripts', 'seed-services.ts'),
  seedSeoPage: path.join(root, 'scripts', 'seed-seo-page.ts'),
  seedWordpressRoute: path.join(root, 'app', 'api', 'seed-wordpress', 'route.ts'),
  seedShopifyRoute: path.join(root, 'app', 'api', 'seed-shopify', 'route.ts'),
  seedWoocommerceRoute: path.join(root, 'app', 'api', 'seed-woocommerce', 'route.ts'),
  seedSeoRoute: path.join(root, 'app', 'api', 'seed-seo', 'route.ts'),
  seedRoute: path.join(root, 'app', 'api', 'seed', 'route.ts')
};

console.log("Updating all copy to match Google Doc verbatim...");

// 1. UPDATE HOMECLIENT.TSX
if (fs.existsSync(files.homeClient)) {
  let content = fs.readFileSync(files.homeClient, 'utf8');

  // Let's replace constants in HomeClient.tsx
  const servicesRep = `const SERVICES = [
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>, title:'WordPress Development', headline:'Build Powerful, Scalable Websites',
    desc:'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.',
    features:['Custom Development','Speed Optimization','Maintenance & Support','Migration Services'], price:'$799', href:'/services/wordpress' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>, title:'WooCommerce Development', headline:'Launch Your Dream E-commerce Store',
    desc:'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.',
    features:['Store Setup & Customization','Payment Gateway Integration','Multi-vendor Solutions','Performance Optimization'], price:'$1,299', href:'/services/woocommerce' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>, title:'Shopify Development', headline:'Scale Your Business with Shopify',
    desc:'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.',
    features:['Custom Store Development','Shopify Plus Solutions','App Integration','Conversion Optimization'], price:'$999', href:'/services/shopify' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>, title:'SEO Services', headline:'Rank Higher, Get Found Faster',
    desc:'Business-first SEO built for real growth. From technical fixes to local SEO and content strategy — stronger search presence that drives leads.',
    features:['Website SEO','Local SEO','Technical SEO','SEO Content Strategy'], price:'Custom', href:'/services/seo' },
]`;

  const whyUsRep = `const WHY_US = [
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, title:'Cost-Effective Excellence', subhead:'Save 60% Without Compromising Quality',
    desc:'Get premium web development at a fraction of US agency costs. Professional results, affordable pricing, transparent communication.' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>, title:'Lightning-Fast Delivery', subhead:'From Concept to Launch in 30 Days',
    desc:'Our streamlined process and dedicated team ensure rapid turnaround without cutting corners. Most projects completed ahead of schedule.' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>, title:'Professional Support', subhead:'24/7 Expert Assistance When You Need It',
    desc:'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included.' },
  { icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>, title:'Proven Results', subhead:'Track Record of Growing Businesses',
    desc:'Our clients see average 150% increase in conversions and 40% improvement in site speed. Real results, measurable impact.' },
]`;

  const portfolioRep = `const PORTFOLIO_STATIC = [
  { _id:'1', slug:'thekapra', title:'The Kapra', client:'E-commerce Fashion Store', platform:'Custom WooCommerce', result:'300%', resultLabel:'Increase in online sales', quote:'ARIOSETECH transformed our vision into reality with custom code solutions.' },
  { _id:'2', slug:'drscents', title:'Dr. Scents', client:'International Perfume Online Store', platform:'Multi-site WooCommerce', result:'32', resultLabel:'Countries launched in under 4 months', quote:'Incredible speed and quality. They delivered beyond our expectations.' },
  { _id:'3', slug:'wyox', title:'WYOX Sports', client:'USA-Based Sports Equipment', platform:'Shopify + Custom Solutions', result:'250%', resultLabel:'Business growth', quote:'Professional, reliable, and always available when we need them.' },
]`;

  const testimonialsRep = `const TESTIMONIALS = [
  { name:'Dr. Fred Sahafi', role:'Founder of Genovie', initials:'FS', quote:'ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth.' },
  { name:'Michael Chen', role:'CEO of GeoMag World', initials:'MC', quote:'Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom WooCommerce solution that perfectly fits our business model.' },
  { name:'Muhammad Hannan', role:'Director of Janya.pk', initials:'MH', quote:'Fast, reliable, and cost-effective. ARIOSETECH helped us launch our wholesale platform on Shopify ahead of schedule and under budget.' },
]`;

  const processRep = `const PROCESS = [
  { n:'01', title:'Discovery & Strategy', sub:'Understand Your Vision', desc:'We start with a comprehensive consultation to understand your business goals, target audience, and technical requirements.', time:'1-2 days' },
  { n:'02', title:'Planning & Design', sub:'Blueprint for Success', desc:'Detailed project planning, wireframing, and design mockups that align with your brand and conversion goals.', time:'3-5 days' },
  { n:'03', title:'Development', sub:'Bringing Ideas to Life', desc:'Expert development using best practices, clean code, and scalable architecture that grows with your business.', time:'15-20 days' },
  { n:'04', title:'Testing & Optimization', sub:'Ensuring Perfection', desc:'Rigorous testing across devices, speed optimization, and security checks before launch.', time:'3-5 days' },
  { n:'05', title:'Launch & Support', sub:"Your Success, Our Priority", desc:'Smooth launch with comprehensive training and ongoing support to ensure continuous success.', time:'Ongoing' },
]`;

  const howItWorksRep = `const HOW_IT_WORKS = [
  { n:'01', title:'Discovery & Strategy',   sub:'Understand Your Vision',    desc:'We kick off with a deep-dive consultation to understand your business goals, target audience, tech stack, and growth plans — so every decision is rooted in strategy.' },
  { n:'02', title:'Planning & Design',      sub:'Blueprint for Success',     desc:'Detailed project roadmaps, wireframes, and pixel-perfect design mockups that align with your brand identity and maximize conversion at every touchpoint.' },
  { n:'03', title:'Development',            sub:'Bringing Ideas to Life',    desc:'Expert WordPress, Shopify, or WooCommerce development using clean code, reusable components, and scalable architecture built to grow with your business.' },
  { n:'04', title:'Testing & Optimization', sub:'Ensuring Perfection',       desc:'Rigorous cross-device QA, speed optimization via Core Web Vitals, security hardening, and SEO validation — nothing ships until it\\\'s flawless.' },
  { n:'05', title:'Launch & Scale',         sub:'Your Success, Our Priority', desc:'A smooth go-live, comprehensive handover training, and 30 days of free post-launch support. After that, flexible monthly plans keep your site at peak performance.' },
]`;

  content = content.replace(/const SERVICES = \[[\s\S]*?\n\]/g, servicesRep);
  content = content.replace(/const WHY_US = \[[\s\S]*?\n\]/g, whyUsRep);
  content = content.replace(/const PORTFOLIO_STATIC = \[[\s\S]*?\n\]/g, portfolioRep);
  content = content.replace(/const TESTIMONIALS = \[[\s\S]*?\n\]/g, testimonialsRep);
  content = content.replace(/const PROCESS = \[[\s\S]*?\n\]/g, processRep);
  content = content.replace(/const HOW_IT_WORKS = \[[\s\S]*?\n\]/g, howItWorksRep);

  // Update Services tab headline & eyebrow
  content = content.replace(/ServicesAccordionSection\s+eyebrow="[^"]*"\s+headline="[^"]*"/g, `ServicesAccordionSection \n        eyebrow="What We Offer"\n        headline="Comprehensive Web Development Solutions for Your Business Growth"`);

  // Update final cta secondary button label
  content = content.replace(/secondaryLabel="View Our Portfolio"/g, 'secondaryLabel="Download Our Service Guide"');

  fs.writeFileSync(files.homeClient, content, 'utf8');
  console.log("✓ Updated HomeClient.tsx successfully.");
}

// Helper to define a section instance
let counter = 1;
function sec(type, props = {}) {
  return { id: `sec_seed_${counter++}`, type, props, styles: {}, meta: { locked: false, hidden: false } };
}

const TRUST = '✓ 7+ Years of Excellence,✓ 100+ Successful Projects,✓ 24/7 Expert Support,✓ 30-Day Money-Back Guarantee';
const CTA_TRUST = '✓ No Long-Term Contracts,✓ 30-Day Money-Back Guarantee,✓ Free Post-Launch Support,✓ Transparent Pricing';

const WP_SERVICES_ITEMS = [
  { 
    label: "Development", 
    title: "WordPress Website Development", 
    sub: "Build Your Dream Website from Scratch", 
    desc: "Transform your vision into a stunning, high-performing WordPress website. Our custom development approach ensures your site stands out from the competition while delivering exceptional user experience.\n\n**Perfect For:**\n• New businesses launching online\n• Companies needing complete website overhaul\n• Brands requiring unique, custom designs\n• Businesses with specific functionality requirements\n\n**Timeline:** 2-3 weeks", 
    features: "Custom theme development from your designs,Responsive design across all devices,SEO-optimized structure and content,Contact forms and lead generation tools,Social media integration,Google Analytics setup,Basic on-page SEO optimization,30 days of free support", 
    price: "$799", 
    href: "/contact" 
  },
  { 
    label: "Migration", 
    title: "WordPress Migration Services", 
    sub: "Seamless Migration Without Downtime", 
    desc: "Moving to WordPress or changing hosts? We handle the entire migration process while ensuring zero data loss and minimal downtime. Your SEO rankings and user experience remain intact.\n\n**Perfect For:**\n• Sites moving from other platforms (Wix, Squarespace, etc.)\n• WordPress to WordPress migrations\n• Hosting provider changes\n• Development to live site transfers\n\n**Timeline:** 3-5 days", 
    features: "Complete site backup and migration,Domain and hosting setup assistance,SSL certificate installation,Email migration (if required),Speed and performance optimization,SEO preservation techniques,Testing across all devices,14 days of post-migration support", 
    price: "$299", 
    href: "/contact" 
  },
  { 
    label: "Bugs/Errors", 
    title: "WordPress Bugs/Errors Fixing Services", 
    sub: "Quick Resolution for WordPress Issues", 
    desc: "Is your WordPress site showing errors, broken pages, or strange behavior? Our experts diagnose and fix issues quickly, getting your site back to peak performance.\n\n**Common Issues We Fix:**\n• White screen of death\n• Internal server errors (500 errors)\n• Database connection errors\n• Plugin conflicts and compatibility issues\n• Theme-related problems\n• Broken layouts and design issues\n• Login and admin access problems\n• Email functionality issues\n\n**Perfect For:**\n• Sites experiencing sudden errors\n• Businesses losing revenue due to downtime\n• WordPress sites with plugin conflicts\n• Emergency fixes needed urgently\n\n**Timeline:** 24-48 hours", 
    features: "Comprehensive site diagnosis,Root cause identification,Complete issue resolution,Prevention recommendations,Site backup before fixes,Testing and verification,7 days of monitoring", 
    price: "$149", 
    href: "/contact" 
  },
  { 
    label: "Maintenance", 
    title: "WordPress Maintenance & Support", 
    sub: "Keep Your WordPress Site Running Smoothly", 
    desc: "Regular maintenance is crucial for WordPress security, performance, and reliability. Our comprehensive maintenance plans ensure your site stays updated, secure, and optimized.\n\n**Maintenance Plans:**\n• 🥉 Basic Plan - $79/month:\n  - 1 WordPress site\n  - Monthly updates and backups\n  - Basic security monitoring\n  - Email support\n• 🥈 Professional Plan - $149/month:\n  - Up to 3 WordPress sites\n  - Weekly updates and backups\n  - Advanced security features\n  - Performance optimization\n  - Priority email & chat support\n• 🥇 Enterprise Plan - $299/month:\n  - Up to 10 WordPress sites\n  - Real-time monitoring\n  - Advanced security and malware removal\n  - Speed optimization\n  - 24/7 priority support\n  - Monthly performance reports", 
    features: "WordPress core core theme and plugin updates,Security monitoring and malware scans,Database optimization and cleanup,Broken link checks and fixes,Performance monitoring and reporting,Regular backups (stored securely),Uptime monitoring,Priority support for issues", 
    price: "$79/mo", 
    href: "/contact" 
  },
  { 
    label: "Speed", 
    title: "WordPress Speed Optimization Services", 
    sub: "Make Your WordPress Site Lightning Fast", 
    desc: "Slow websites lose customers and hurt search rankings. Our speed optimization service can improve your site speed by 40-70%, leading to better user experience and higher conversions.\n\n**Expected Results:**\n• 40-70% faster loading times\n• Improved Google PageSpeed scores\n• Better Core Web Vitals\n• Enhanced user experience\n• Higher search engine rankings\n\n**Timeline:** 5-7 days", 
    features: "Comprehensive speed audit and analysis,Image optimization and compression,Caching implementation and configuration,Database optimization and cleanup,CSS and JavaScript minification,CDN setup and configuration,Server-level optimizations,Core Web Vitals optimization,Mobile speed improvements", 
    price: "$399", 
    href: "/contact" 
  },
  { 
    label: "Security", 
    title: "WordPress Security Services", 
    sub: "Protect Your WordPress Site from Threats", 
    desc: "WordPress security is not optional. Our comprehensive security service protects your site from hackers, malware, and other threats while ensuring compliance with security best practices.\n\n**Security Monitoring:**\n• 24/7 threat monitoring\n• Real-time alerts for suspicious activity\n• Automatic malware removal\n• Weekly security reports\n• Blacklist monitoring\n• Vulnerability assessments\n\n**Perfect For:**\n• E-commerce websites\n• Sites handling sensitive data\n• Businesses requiring compliance\n• Sites previously hacked\n• High-traffic WordPress sites\n\n**Timeline:** 3-5 days", 
    features: "Malware scanning and removal,Firewall installation and configuration,Security plugin setup and optimization,Login security enhancements,File permission optimization,Database security improvements,SSL certificate installation,Security headers implementation,Regular security audits", 
    price: "$299", 
    href: "/contact" 
  },
  { 
    label: "Virus Removal", 
    title: "WordPress Virus Removal Services", 
    sub: "Fast and Complete Malware Removal", 
    desc: "Is your WordPress site infected with malware or viruses? We provide emergency malware removal services to get your site clean and secure quickly.\n\n**Virus Removal Process:**\n1. Immediate Site Analysis - Identify infection type and scope\n2. Complete Malware Removal - Clean all infected files and database\n3. Security Hardening - Prevent future infections\n4. Blacklist Removal - Get your site off Google/search engine blacklists\n5. Prevention Setup - Install security measures\n6. Monitoring - 30 days of security monitoring\n\n**Emergency Service Available:**\n• Same-day removal for critical cases\n• 24/7 emergency response\n• Money-back guarantee if malware returns\n\n**Timeline:** 24-48 hours", 
    features: "Complete malware scan and removal,Infected file cleaning or replacement,Database cleanup and optimization,Security plugin installation,Firewall configuration,Google Safe Browsing removal,Security recommendations,30-day monitoring period", 
    price: "$199", 
    href: "/contact" 
  },
  { 
    label: "Backups", 
    title: "WordPress Backup Solutions", 
    sub: "Never Lose Your WordPress Data Again", 
    desc: "Protect your valuable content and data with automated, reliable backup solutions. Our backup service ensures you can restore your site quickly in case of any emergency.\n\n**Backup Plans:**\n• 📁 Basic Backup - $29/month:\n  - Daily automated backups\n  - 30-day backup retention\n  - One-click restore\n  - Email notifications\n• 📁 Advanced Backup - $59/month:\n  - Real-time backups\n  - 90-day backup retention\n  - Multiple restore points\n  - Priority restoration support\n  - Multiple storage locations\n• 📁 Enterprise Backup - $99/month:\n  - Continuous backups\n  - 1-year backup retention\n  - Instant recovery options\n  - Dedicated backup support\n  - Custom backup schedules", 
    features: "Automated daily backups,Multiple backup storage locations,One-click restore functionality,Database and file backups,Incremental backup options,Backup scheduling flexibility,Encrypted secure storage,Easy backup management", 
    price: "$29/mo", 
    href: "/contact" 
  },
  { 
    label: "Redesign", 
    title: "WordPress Website Redesign", 
    sub: "Give Your WordPress Site a Fresh New Look", 
    desc: "Is your WordPress site looking outdated? Our redesign service transforms your existing site with modern design, improved functionality, and a better user experience.\n\n**Redesign Process:**\n1. Current Site Analysis - Audit existing design and functionality\n2. Strategy Development - Plan improvements based on your goals\n3. Design Creation - Create modern, conversion-focused designs\n4. Development - Build the new design on WordPress\n5. Content Migration - Transfer and optimize existing content\n6. Testing & Launch - Ensure everything works perfectly\n7. Training - Show you how to manage your new site\n\n**Before Starting:**\n• Detailed consultation about your goals\n• Competitor analysis\n• User experience audit\n• Technical requirements assessment\n\n**Timeline:** 3-4 weeks", 
    features: "Modern responsive design,Improved user experience,SEO optimization,Speed optimization,Mobile-first approach,Content migration,Basic SEO setup,30 days of support", 
    price: "$1,299", 
    href: "/contact" 
  },
  { 
    label: "Multilingual", 
    title: "WordPress Multilingual Websites", 
    sub: "Reach Global Audiences with Multilingual WordPress", 
    desc: "Expand your business globally with professionally developed multilingual WordPress websites. We create seamless multi-language experiences that engage international audiences.\n\n**Supported Solutions:**\n• WPML - Professional multilingual plugin\n• Polylang - Free multilingual solution\n• TranslatePress - Visual translation interface\n• Custom Solutions - Tailored multilingual systems\n\n**Perfect For:**\n• International businesses\n• E-commerce stores selling globally\n• Service providers with global clientele\n• Organizations serving diverse communities\n\n**Timeline:** 2-3 weeks", 
    features: "Multiple language setup and configuration,Professional translation management,SEO optimization for each language,Currency switcher integration,Language-specific content management,Automatic language detection,Multilingual menu and navigation,International SEO setup", 
    price: "$899", 
    href: "/contact" 
  }
];

const WC_SERVICES_ITEMS = [
  { 
    label: "Development", 
    title: "WooCommerce Website Development Services", 
    sub: "Launch Your Ultimate E-commerce Store", 
    desc: "Build a powerful online store that leverages the best of WordPress and WooCommerce. Our custom development creates unique, high-converting stores that perfectly match your brand and business requirements.\n\n**E-commerce Features:**\n• Advanced product variations (size, color, style)\n• Product bundles and grouped products\n• Wishlist and comparison functionality\n• Customer reviews and ratings\n• Coupon and discount management\n• Multi-currency support\n• Advanced search and filtering\n• Related and upsell products\n\n**Perfect For:**\n• Businesses wanting WordPress + e-commerce\n• Companies needing content marketing integration\n• Brands requiring extensive customization\n• Stores with complex product catalogs\n• Businesses planning to scale significantly\n\n**Timeline:** 3-4 weeks", 
    features: "Custom WooCommerce theme development,Responsive design across all devices,Complete product catalog setup,Payment gateway integration,Shipping zones and tax configuration,30 days of free support", 
    price: "$1,299", 
    href: "/contact" 
  },
  { 
    label: "Customization", 
    title: "WooCommerce Theme Customization", 
    sub: "Transform Your Store with Custom Design", 
    desc: "Make your WooCommerce store stand out with completely custom theme development or extensive customization of existing themes. We create unique shopping experiences that reflect your brand and drive conversions.\n\n**Design Features:**\n• Modern, conversion-focused layouts\n• Intuitive navigation and user flow\n• High-quality product showcases\n• Trust signals and social proof integration\n• Professional brand representation\n• Accessibility compliance\n• Cross-browser compatibility\n\n**Perfect For:**\n• Stores wanting unique brand representation\n• Businesses with existing WooCommerce sites\n• Companies needing design improvements\n• Brands requiring specific functionality\n• Stores wanting to improve conversions\n\n**Timeline:** 2-3 weeks", 
    features: "Complete theme redesign and development,Custom homepage and product page layouts,Brand-specific color schemes and typography,Custom icons and graphics integration,Advanced product display options,30 days of design support", 
    price: "$899", 
    href: "/contact" 
  },
  { 
    label: "Payments", 
    title: "WooCommerce Payment Gateway Integration", 
    sub: "Secure, Seamless Payment Processing", 
    desc: "Offer your customers the payment methods they prefer with secure, reliable payment gateway integrations. We implement and optimize payment systems that reduce cart abandonment and increase conversions.\n\n**Supported Payment Gateways:**\n• 🏦 Traditional Gateways: Stripe (credit cards, digital wallets), PayPal (Standard, Pro, Express), Square (online/in-person), Authorize.net (merchant accounts), Bank transfer & check\n• 💳 Digital Wallets: Apple Pay and Google Pay, Amazon Pay, Shop Pay\n• 🌍 International Gateways: Razorpay & Paytm (India), Alipay (China), Regional bank gateways, Multi-currency support\n• 🔐 Security Features: PCI DSS compliance assistance, SSL certificate, Fraud protection setup, Secure tokenization, 3D Secure authentication\n\n**Perfect For:**\n• Stores expanding payment options\n• International e-commerce businesses\n• Companies wanting to reduce cart abandonment\n• Businesses needing secure payment processing\n• Stores targeting mobile customers\n\n**Timeline:** 3-5 days", 
    features: "Stripe and PayPal integration,Square online payments,Authorize.net integration,Local gateways (JazzCash EasyPaisa),SSL certificate implementation,30 days of payment support", 
    price: "$299", 
    href: "/contact" 
  },
  { 
    label: "Performance", 
    title: "WooCommerce Performance Optimization", 
    sub: "Maximize Speed, Sales, and Search Rankings", 
    desc: "Slow e-commerce sites lose customers and sales. Our comprehensive optimization service can improve your WooCommerce store speed by 50-70%, leading to higher conversions, better user experience, and improved search rankings.\n\n**Performance Improvements:**\n• ⚡ Speed Optimization: Database query, image compression, caching implementation (page, object, browser), CDN setup, server-level optimizations, plugin review, code cleanup\n• 🛒 E-commerce Optimization: Product catalog, checkout speed, cart/wishlist optimization, category page, search improvement\n• 📱 Mobile Optimization: Mobile-first performance, touch-friendly UI, mobile payment speed, PWA features\n\n**Expected Results:**\n• 50-70% faster loading times\n• Improved Google PageSpeed scores (90+)\n• Better Core Web Vitals\n• 20-35% increase in conversions\n• Reduced bounce rates\n• Higher search engine rankings & improved mobile performance\n\n**Timeline:** 5-7 days", 
    features: "Database query optimization,Image compression and optimization,Caching implementation (page object browser),CDN setup and configuration,Server-level optimizations,Core Web Vitals check", 
    price: "$699", 
    href: "/contact" 
  },
  { 
    label: "Maintenance", 
    title: "WooCommerce Maintenance & Support", 
    sub: "Keep Your Store Running Smoothly", 
    desc: "Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your WooCommerce store stays updated, secure, and optimized for peak performance.\n\n**Maintenance Plans:**\n• 🥉 Essential Plan - $129/month:\n  - 1 WooCommerce store\n  - Monthly updates and security checks\n  - Basic performance monitoring\n  - Email support (48-hour response)\n  - 2 hours of modifications & backup verification\n• 🥈 Professional Plan - $249/month:\n  - Up to 2 WooCommerce stores\n  - Bi-weekly updates and monitoring\n  - Advanced security & performance optimization\n  - Priority support (24-hour response)\n  - 5 hours of modifications & weekly backup management\n• 🥇 Enterprise Plan - $499/month:\n  - Up to 5 WooCommerce stores\n  - Weekly updates and monitoring\n  - Real-time security monitoring & 24/7 priority support\n  - Advanced performance & 10 hours modifications\n  - Daily backup management, custom features, dedicated account manager", 
    features: "WordPress and WooCommerce core updates,Plugin and theme updates,Security monitoring and hardening,Performance monitoring and optimization,Database optimization and cleanup,Uptime monitoring & backups", 
    price: "$129/mo", 
    href: "/contact" 
  },
  { 
    label: "Multi-vendor", 
    title: "WooCommerce Multi-vendor Solutions", 
    sub: "Create Your Own E-commerce Marketplace", 
    desc: "Transform your WooCommerce store into a thriving multi-vendor marketplace where multiple sellers can list and sell their products. Perfect for creating Amazon-like platforms or expanding your business model.\n\n**Marketplace Features:**\n• 👥 Vendor Management: Registration/approval system, Individual dashboards, Product/order management, Commission management, Performance analytics\n• 💰 Financial Management: Automated commission calculations, Multiple payout methods, Financial reporting, Tax handling, Subscription plans, Revenue sharing models\n• 🛍️ Customer Experience: Unified shopping experience, Vendor ratings/reviews, Advanced search/filtering, Vendor comparison, Single checkout, Order tracking\n\n**Perfect For:**\n• Entrepreneurs creating marketplaces\n• Businesses wanting to expand product range\n• Companies with multiple suppliers\n• Platforms connecting buyers and sellers\n• Businesses looking for passive income\n\n**Timeline:** 4-6 weeks", 
    features: "Vendor registration and approval system,Individual vendor dashboards,Vendor commission management,Automated commission calculations,Multiple payout methods,30 days of marketplace support", 
    price: "$1,999", 
    href: "/contact" 
  },
  { 
    label: "Multilingual", 
    title: "WooCommerce Multilingual Websites", 
    sub: "Expand Globally with Multilingual E-commerce", 
    desc: "Reach international customers with professionally developed multilingual WooCommerce stores. We create seamless multi-language shopping experiences that engage global audiences and drive international sales.\n\n**Multilingual Features:**\n• 🌐 Language Management: Setup (unlimited), Translation workflow, Language switcher, Auto-detection, Language-specific URLs, RTL support\n• 💱 Currency & Localization: Multi-currency, Auto-conversion, Location pricing, Country payment methods, Local shipping, Tax by region\n• 🛒 E-commerce Localization: Translated catalog, Localized checkout, Multi-language support, Promotion by region, Local gateway integration\n\n**Perfect For:**\n• Stores expanding internationally\n• Businesses targeting specific regions\n• Companies with multilingual customers\n• Global brands launching online\n• Businesses in tourist areas\n\n**Timeline:** 3-4 weeks", 
    features: "Multiple language setup (unlimited),Multi-currency and localization setup,Location-based pricing,Country-specific payment methods,RTL language support,30 days of multilingual support", 
    price: "$1,499", 
    href: "/contact" 
  },
  { 
    label: "Migration", 
    title: "WooCommerce Migration Services", 
    sub: "Seamless Migration to WooCommerce", 
    desc: "Moving your e-commerce store to WooCommerce? We handle the complete migration process while preserving your SEO rankings, customer data, order history, and ensuring zero downtime.\n\n**Migration Benefits:**\n• Lower ongoing costs compared to SaaS platforms\n• Complete customization freedom\n• Better SEO control and flexibility\n• No transaction fees\n• Unlimited scalability & full data ownership\n\n**Supported Platforms:**\n• Shopify to WooCommerce - Complete store transfer\n• Magento to WooCommerce - Complex catalog migration\n• OpenCart & PrestaShop to WooCommerce\n• BigCommerce & custom platforms\n\n**Timeline:** 1-3 weeks (depending on store size)", 
    features: "Product catalog migration with variations,Customer accounts and order history,Reviews and testimonials,Blog posts and content pages,SEO settings and URL redirects,30 days of dedicated support", 
    price: "$999", 
    href: "/contact" 
  }
];

const SHOPIFY_SERVICES_ITEMS = [
  { 
    label: "Development", 
    title: "Shopify Store Development", 
    sub: "Launch Your Dream E-commerce Store", 
    desc: "Transform your business idea into a profitable Shopify store. Our custom development approach creates unique, high-converting stores that capture your brand essence and drive sales from day one.\n\n**Design Features:**\n• Custom brand integration\n• User-friendly navigation\n• High-converting product pages\n• Optimized checkout process\n• Mobile-first design approach\n• Fast loading times\n• Professional photography integration\n\n**Perfect For:**\n• New businesses launching online\n• Brands moving from other platforms\n• Companies needing unique, custom designs\n• Businesses requiring specific functionality\n• Entrepreneurs starting their e-commerce journey\n\n**Timeline:** 2-3 weeks", 
    features: "Custom Shopify theme development,Responsive design across all devices,Product catalog setup and optimization,Payment gateway integration,Shipping configuration and tax setup,30 days of free support", 
    price: "$999", 
    href: "/contact" 
  },
  { 
    label: "Migration", 
    title: "Shopify Migration Services", 
    sub: "Seamless Migration to Shopify", 
    desc: "Moving your e-commerce store to Shopify? We handle the complete migration process while preserving your SEO rankings, customer data, and sales history. Zero downtime, zero data loss guaranteed.\n\n**Migration Process:**\n1. Pre-Migration Audit - Analyze current store and requirements\n2. Data Mapping - Plan transfer of products, customers, orders\n3. Theme Recreation - Rebuild or adapt your current design\n4. Content Migration - Transfer all products, pages, blog posts\n5. Testing Phase - Verify all functionality works perfectly\n6. Go-Live - Launch with minimal downtime\n7. Post-Migration Support - 30 days of assistance\n\n**Supported Platforms:**\n• WooCommerce to Shopify\n• Magento to Shopify\n• BigCommerce to Shopify\n• Custom platforms & other platforms\n\n**Timeline:** 1-2 weeks", 
    features: "All product data and images,Customer accounts and order history,Blog posts and pages,SEO settings and redirects,Reviews and testimonials,30 days of post-migration support", 
    price: "$799", 
    href: "/contact" 
  },
  { 
    label: "Optimization", 
    title: "Shopify Performance Optimization", 
    sub: "Maximize Your Store's Speed and Conversions", 
    desc: "Slow Shopify stores lose customers and sales. Our performance optimization service can improve your store speed by 40-60%, leading to higher conversions and better customer experience.\n\n**Performance & Conversion Improvements:**\n• Speed: Audit, image compression, code optimization, app performance review, theme speed enhancements, Shopify script optimization, CDN, mobile speed, Core Web Vitals\n• Conversion: Checkout optimization, product page enhancements, cart abandonment reduction, trust signals, A/B testing, UX improvements, mobile conversion\n\n**Expected Results:**\n• 40-60% faster loading times\n• Improved Google PageSpeed scores & search engine rankings\n• 15-25% increase in conversions & reduced bounce rates\n\n**Timeline:** 5-7 days", 
    features: "Comprehensive speed audit and analysis,Image optimization and compression,Code optimization and cleanup,App performance review and optimization,Theme speed enhancements,Core Web Vitals improvement", 
    price: "$599", 
    href: "/contact" 
  },
  { 
    label: "Integration", 
    title: "Shopify Integration Services", 
    sub: "Connect Your Store with Essential Business Tools", 
    desc: "Streamline your operations by integrating your Shopify store with essential business tools and third-party services. Automate workflows and improve efficiency across your entire business.\n\n**Popular Integrations:**\n• 📊 Analytics & Reporting: Google Analytics 4, Facebook Pixel, Google Tag Manager\n• 📧 Email Marketing: Klaviyo, Mailchimp, Constant Contact, Abandoned cart email sequences\n• 📦 Inventory & Fulfillment: ShipStation, dropshipping apps, multi-channel inventory sync\n• 💰 Accounting & Finance: QuickBooks, Xero, tax calculation, financial reporting\n• 🎯 Marketing & Advertising: Facebook Shop, Google Shopping, affiliate & loyalty programs\n\n**Timeline:** 3-5 days per integration", 
    features: "Google Analytics 4 setup,Klaviyo setup and automation,ShipStation integration,QuickBooks integration,Xero accounting connection,Custom API development for custom tools", 
    price: "$399", 
    href: "/contact" 
  },
  { 
    label: "Maintenance", 
    title: "Shopify Maintenance & Support", 
    sub: "Keep Your Shopify Store Running Smoothly", 
    desc: "Focus on growing your business while we handle the technical aspects. Our comprehensive maintenance service ensures your Shopify store stays updated, secure, and optimized for peak performance.\n\n**Maintenance Plans:**\n• 🥉 Starter Plan - $99/month:\n  - 1 Shopify store\n  - Monthly updates and checks, basic performance monitoring, email support\n  - 2 hours of modifications\n• 🥈 Growth Plan - $199/month:\n  - Up to 2 Shopify stores\n  - Bi-weekly updates and monitoring, advanced performance optimization\n  - Priority email & chat support, 5 hours of modifications, monthly performance reports\n• 🥇 Enterprise Plan - $399/month:\n  - Up to 5 Shopify stores\n  - Weekly updates and monitoring, real-time performance tracking\n  - 24/7 priority support, 10 hours of modifications, custom feature development, dedicated account manager", 
    features: "Regular theme and app updates,Security monitoring and protection,Performance monitoring and optimization,Broken link checks and fixes,Product data backup and security,Priority technical support", 
    price: "$99/mo", 
    href: "/contact" 
  },
  { 
    label: "Shopify Plus", 
    title: "Shopify Plus Development", 
    sub: "Enterprise E-commerce Solutions with Shopify Plus", 
    desc: "Scale your high-volume business with Shopify Plus. We specialize in complex enterprise implementations, custom functionality, and advanced integrations that support rapid growth and global expansion.\n\n**Shopify Plus Exclusive Features:**\n• Higher transaction limits and reduced fees\n• Advanced automation workflows (Shopify Flow, Launchpad)\n• Advanced reporting, B2B wholesale capabilities, multi-store, and multi-currency\n• Enhanced customization and checkout experiences\n\n**Perfect For:**\n• High-volume merchants (> $1M annual sales)\n• Brands with complex requirements or CRM integrations\n• International businesses, Multi-brand companies\n\n**Timeline:** 4-6 weeks", 
    features: "Custom Theme Development for enterprise brands,ERP and CRM advanced integrations,B2B wholesale portals and pricing,Multi-store and multi-currency support,Custom app development,API-first architecture", 
    price: "$2,999", 
    href: "/contact" 
  },
  { 
    label: "Redesign", 
    title: "Shopify Store Redesign", 
    sub: "Transform Your Store for Maximum Conversions", 
    desc: "Is your Shopify store underperforming? Our redesign service combines modern design with conversion optimization to create stores that not only look amazing but also drive more sales.\n\n**Design Focus Areas:**\n• Homepage conversion optimization\n• Product page enhancements\n• Simplified navigation structure\n• Trust signal implementation\n• Mobile shopping experience\n• Cart and checkout optimization\n• Brand consistency throughout\n\n**Expected Results:**\n• 20-40% increase in conversions\n• Improved mobile experience\n• Better brand representation & higher average order value\n\n**Timeline:** 3-4 weeks", 
    features: "Modern mobile-first design,Conversion rate optimization,User experience improvements,Page speed optimization,SEO structure enhancement,30 days of support", 
    price: "$1,499", 
    href: "/contact" 
  },
  { 
    label: "App Dev", 
    title: "Shopify App Development", 
    sub: "Custom Apps for Unique Business Needs", 
    desc: "Need functionality that doesn't exist? We develop custom Shopify apps tailored to your specific requirements, giving you competitive advantages and streamlined operations.\n\n**Types of Apps We Build:**\n• Custom product configurators, advanced inventory management\n• Subscription and recurring billing, loyalty and rewards programs\n• Advanced search and filtering, custom reporting dashboards, B2B pricing\n\n**Technologies Used:**\n• Shopify Partner APIs (GraphQL & REST), React & Node.js, Shopify CLI, Polaris\n\n**Timeline:** 4-8 weeks", 
    features: "Public & private apps development,Custom product configurators,Subscription and recurring billing,Loyalty and rewards programs,Advanced search and filtering,Polaris design standard compliance", 
    price: "$1,999", 
    href: "/contact" 
  }
];

const SEO_SERVICES_ITEMS = [
  { 
    label: "Website SEO", 
    title: "Website SEO", 
    sub: "Website SEO That Strengthens Your Foundation", 
    desc: "We improve the on-page SEO and structural setup of your website so search engines can better understand your content and users can move through your site more clearly. This includes heading structure, metadata, content optimization, internal linking, page targeting, keyword mapping, and overall SEO alignment.", 
    features: "On-page SEO improvements,Page-level optimization,Heading and content structure,Metadata optimization,Internal linking strategy,Keyword targeting and mapping", 
    price: "$299", 
    href: "/contact" 
  },
  { 
    label: "Local SEO", 
    title: "Local SEO", 
    sub: "Local SEO That Brings More Calls and Leads", 
    desc: "For local businesses, visibility in your service areas matters. We help improve your local presence through Google Business Profile optimization, local landing pages, service-area targeting, on-page local signals, and stronger geographic relevance across your website.", 
    features: "Google Business Profile optimization,Local keyword targeting,City and service-area pages,Local on-page SEO,Location-based content support,Better visibility for local intent searches", 
    price: "$399/mo", 
    href: "/contact" 
  },
  { 
    label: "Technical SEO", 
    title: "Technical SEO", 
    sub: "Technical SEO That Fixes What Holds You Back", 
    desc: "Many websites struggle to rank because of technical problems happening behind the scenes. We identify and fix issues related to crawlability, indexing, site speed, mobile usability, page structure, duplicates, and weak internal architecture so your website performs better in search.", 
    features: "Technical SEO audits,Crawl and indexing fixes,Page speed improvement recommendations,Mobile usability checks,Site structure improvements,Duplicate and thin content review", 
    price: "$499", 
    href: "/contact" 
  },
  { 
    label: "SEO Content", 
    title: "SEO Content", 
    sub: "SEO Content That Builds Topical Strength", 
    desc: "We help businesses create and improve content that supports rankings, search intent, and topical authority. This includes service page optimization, blog strategy, content planning, keyword clustering, and search-focused content improvements that help your site compete more effectively.", 
    features: "SEO content strategy,Service page optimization,Blog topic planning,Keyword clustering,Content updates and refreshes,Content structure for search intent", 
    price: "$599/mo", 
    href: "/contact" 
  }
];

const WHY_ITEMS = [
  { icon: '💰', title: 'Cost-Effective Excellence', subhead: 'Save 60% Without Compromising Quality', desc: 'Get premium web development at a fraction of US agency costs. Professional results, affordable pricing, transparent communication.' },
  { icon: '⚡', title: 'Lightning-Fast Delivery', subhead: 'From Concept to Launch in 30 Days', desc: 'Our streamlined process and dedicated team ensure rapid turnaround without cutting corners. Most projects completed ahead of schedule.' },
  { icon: '🛡️', title: 'Professional Support', subhead: '24/7 Expert Assistance When You Need It', desc: 'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included.' },
  { icon: '📈', title: 'Proven Results', subhead: 'Track Record of Growing Businesses', desc: 'Our clients see average 150% increase in conversions and 40% improvement in site speed. Real results, measurable impact.' }
];

const FAQS_WP = [
  { q: 'How long does WordPress development take?', a: 'Most WordPress projects are completed within 2-4 weeks, depending on complexity and requirements.' },
  { q: 'Do you provide WordPress hosting?', a: 'We can recommend reliable hosting providers and assist with setup, but we focus on development rather than hosting services.' },
  { q: 'Can you work with existing WordPress sites?', a: 'Absolutely! We provide maintenance, optimization, and enhancement services for existing WordPress websites.' },
  { q: 'What\'s included in post-launch support?', a: 'All WordPress projects include 30 days of free support covering bug fixes, minor adjustments, and training.' },
  { q: 'Do you use WordPress page builders?', a: 'We prefer custom development for better performance, but can work with page builders like Elementor or Gutenberg when requested.' },
  { q: 'How much does WordPress maintenance cost?', a: 'Our maintenance plans start at $79/month and include updates, backups, security monitoring, and support.' }
];

const FAQS_SHOPIFY = [
  { q: 'How long does it take to build a Shopify store?', a: 'Most custom Shopify stores are completed within 2-4 weeks, while Shopify Plus projects typically take 4-6 weeks depending on complexity.' },
  { q: 'Can you migrate my existing store to Shopify?', a: 'Yes! We provide complete migration services from all major e-commerce platforms including WooCommerce, Magento, BigCommerce, and custom solutions.' },
  { q: 'Do you provide Shopify hosting?', a: 'Shopify includes hosting as part of their platform. We help with setup, optimization, and ongoing management of your Shopify store.' },
  { q: 'What\'s included in the post-launch support?', a: 'All Shopify projects include 30 days of free support covering bug fixes, minor adjustments, training, and guidance on store management.' },
  { q: 'Can you help with Shopify marketing and SEO?', a: 'While we focus on development, we include basic SEO optimization and can recommend trusted partners for advanced marketing services.' },
  { q: 'How much does Shopify maintenance cost?', a: 'Our Shopify maintenance plans start at $99/month and include updates, monitoring, support, and monthly modifications.' },
  { q: 'Do you work with Shopify Plus?', a: 'Yes! We\'re experienced with Shopify Plus implementations for enterprise clients requiring advanced features and higher transaction volumes.' },
  { q: 'Can you develop custom Shopify apps?', a: 'Absolutely! We develop both private apps for individual stores and public apps for the Shopify App Store.' }
];

const FAQS_WC = [
  { q: 'How much does a WooCommerce store cost?', a: 'Custom WooCommerce development starts at $1,299 for basic stores. Complex stores with advanced features range from $2,000-$5,000+. We provide detailed quotes based on your specific requirements.' },
  { q: 'How long does WooCommerce development take?', a: 'Most custom WooCommerce stores are completed within 3-5 weeks. Complex stores with extensive customization may take 6-8 weeks. We provide realistic timelines during consultation.' },
  { q: 'Can you migrate my existing store to WooCommerce?', a: 'Yes! We provide complete migration services from Shopify, Magento, and other platforms. Migration typically takes 1-3 weeks depending on store complexity.' },
  { q: 'Is WooCommerce better than Shopify?', a: 'WooCommerce offers more customization freedom and lower long-term costs, while Shopify provides easier management. We help you choose based on your specific needs.' },
  { q: 'Do you provide WooCommerce hosting?', a: 'We recommend reliable WordPress hosting providers and assist with setup and optimization. We focus on development while partnering with trusted hosting companies.' },
  { q: 'What\'s included in post-launch support?', a: 'All WooCommerce projects include 30 days of free support covering bug fixes, minor adjustments, training, and guidance on store management.' },
  { q: 'Can WooCommerce handle large product catalogs?', a: 'Absolutely! WooCommerce can handle thousands of products when properly optimized. We implement performance optimizations for large-scale e-commerce operations.' },
  { q: 'Do you develop custom WooCommerce plugins?', a: 'Yes! We develop custom plugins and extensions to add unique functionality to your WooCommerce store that isn\'t available in existing plugins.' }
];

const FAQS_SEO = [
  { q: 'What SEO services does Ariosetech offer?', a: 'We offer website SEO, local SEO, technical SEO, and SEO content support. This includes on-page optimization, technical fixes, local search improvements, and content strategy built to improve rankings and business visibility.' },
  { q: 'Is SEO worth it for small businesses?', a: 'Yes. SEO helps small businesses show up when potential customers are actively searching for their services. It can improve visibility, bring qualified traffic, and support long-term growth without depending only on paid ads.' },
  { q: 'How long does SEO take to show results?', a: 'SEO usually takes time because rankings depend on competition, website condition, content quality, and technical setup. Some improvements can be seen earlier, but strong SEO results usually build over months, not days.' },
  { q: 'Do you offer local SEO services?', a: 'Yes. We help local businesses improve visibility through Google Business Profile optimization, service-area targeting, local page structure, and stronger on-page local signals.' },
  { q: 'Can you fix technical SEO issues on my website?', a: 'Yes. We can review and improve crawl issues, indexing problems, speed-related blockers, mobile usability, internal structure, and other technical factors affecting search performance.' },
  { q: 'Do you also help with SEO content?', a: 'Yes. We help with service page optimization, blog planning, keyword clustering, content updates, and search-focused content strategy to strengthen your site\'s topical coverage.' }
];

const PORTFOLIO_ITEMS = [
  { title: 'The Kapra', client: 'E-commerce Fashion Store', platform: 'Custom WooCommerce', result: '300%', resultLabel: 'Increase in online sales', quote: 'ARIOSETECH transformed our vision into reality with custom code solutions.', slug: 'thekapra' },
  { title: 'Dr. Scents', client: 'International Perfume Online Store', platform: 'Multi-site WooCommerce', result: '32', resultLabel: 'Countries launched in under 4 months', quote: 'Incredible speed and quality. They delivered beyond our expectations.', slug: 'drscents' },
  { title: 'WYOX Sports', client: 'USA-Based Sports Equipment', platform: 'Shopify + Custom Solutions', result: '250%', resultLabel: 'Business growth', quote: 'Professional, reliable, and always available when we need them.', slug: 'wyox' }
];

const WP_PROCESS_STEPS = [
  { n: '01', title: 'Discovery & Planning', sub: 'Understand Your Vision', desc: 'Detailed requirement analysis, Technical specifications, Design wireframes, Project timeline', time: '2-3 days' },
  { n: '02', title: 'Design & Development', sub: 'Bringing Ideas to Life', desc: 'Custom theme creation, Functionality development, Responsive design implementation, Content integration', time: '1-2 weeks' },
  { n: '03', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Cross-browser testing, Mobile responsiveness check, Speed optimization, Security testing', time: '3-5 days' },
  { n: '04', title: 'Launch & Support', sub: 'Your Success, Our Priority', desc: 'Live deployment, Training session, 30-day support period, Maintenance planning', time: 'Ongoing' }
];

const WC_PROCESS_STEPS = [
  { n: '01', title: 'Discovery & Strategy', sub: 'Understand Your Vision', desc: 'Business goals and requirements analysis, Target audience and market research, Competitor analysis and benchmarking, Technical requirements planning, E-commerce strategy development', time: '3-5 days' },
  { n: '02', title: 'Planning & Architecture', sub: 'Blueprint for Success', desc: 'Site structure and navigation planning, Product catalog organization, User experience wireframes, Design mockups and prototypes, Technical architecture planning', time: '1 week' },
  { n: '03', title: 'Development & Integration', sub: 'Bringing Ideas to Life', desc: 'Custom theme development, WooCommerce configuration, Payment and shipping setup, Plugin development and integration, Performance optimization', time: '2-3 weeks' },
  { n: '04', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Functionality testing across devices, Payment processing verification, Performance and speed testing, Security auditing, User acceptance testing', time: '3-5 days' },
  { n: '05', title: 'Launch & Support', sub: 'Your Success, Our Priority', desc: 'Live deployment and monitoring, Staff training and documentation, 30-day support period, Performance monitoring, Growth recommendations', time: 'Ongoing' }
];

const SHOPIFY_PROCESS_STEPS = [
  { n: '01', title: 'Discovery & Strategy', sub: 'Understand Your Vision', desc: 'Business goals analysis, Target audience research, Competitive landscape review, Technical requirements planning, Design and functionality wireframes', time: '3-5 days' },
  { n: '02', title: 'Design & User Experience', sub: 'Blueprint for Success', desc: 'Custom design creation, User experience optimization, Mobile-first approach, Brand integration, Conversion optimization planning', time: '1 week' },
  { n: '03', title: 'Development & Integration', sub: 'Bringing Ideas to Life', desc: 'Custom theme development, App integrations, Payment and shipping setup, SEO optimization, Performance optimization', time: '1-2 weeks' },
  { n: '04', title: 'Testing & Launch', sub: 'Ensuring Perfection', desc: 'Cross-device testing, Functionality verification, Performance testing, Security checks, Go-live and monitoring', time: '3-5 days' },
  { n: '05', title: 'Training & Support', sub: 'Your Success, Our Priority', desc: 'Store management training, 30-day support period, Performance monitoring, Growth recommendations', time: 'Ongoing' }
];

const TESTIMONIALS = [
  { name: 'Dr. Fred Sahafi', role: 'Founder of Genovie', initials: 'FS', quote: 'ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth.' },
  { name: 'Michael Chen', role: 'CEO of GeoMag World', initials: 'MC', quote: 'Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom WooCommerce solution that perfectly fits our business model.' },
  { name: 'Muhammad Hannan', role: 'Director of Janya.pk', initials: 'MH', quote: 'Fast, reliable, and cost-effective. ARIOSETECH helped us launch our wholesale platform on Shopify ahead of schedule and under budget.' }
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Discovery & Strategy', sub: 'Understand Your Vision', desc: 'We kick off with a deep-dive consultation to understand your business goals, target audience, tech stack, and growth plans — so every decision is rooted in strategy.' },
  { n: '02', title: 'Planning & Design', sub: 'Blueprint for Success', desc: 'Detailed project roadmaps, wireframes, and pixel-perfect design mockups that align with your brand identity and maximize conversion at every touchpoint.' },
  { n: '03', title: 'Development', sub: 'Bringing Ideas to Life', desc: 'Expert WordPress, Shopify, or WooCommerce development using clean code, reusable components, and scalable architecture built to grow with your business.' },
  { n: '04', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Rigorous cross-device QA, speed optimization via Core Web Vitals, security hardening, and SEO validation — nothing ships until it\'s flawless.' },
  { n: '05', title: 'Launch & Scale', sub: 'Your Success, Our Priority', desc: 'A smooth go-live, comprehensive handover training, and 30 days of free post-launch support. After that, flexible monthly plans keep your site at peak performance.' }
];

const PROCESS_STEPS = [
  { n: '01', title: 'Discovery & Strategy', sub: 'Understand Your Vision', desc: 'We start with a comprehensive consultation to understand your business goals, target audience, and technical requirements.', time: '1-2 days' },
  { n: '02', title: 'Planning & Design', sub: 'Blueprint for Success', desc: 'Detailed project planning, wireframing, and design mockups that align with your brand and conversion goals.', time: '3-5 days' },
  { n: '03', title: 'Development', sub: 'Bringing Ideas to Life', desc: 'Expert development using best practices, clean code, and scalable architecture that grows with your business.', time: '15-20 days' },
  { n: '04', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Rigorous testing across devices, speed optimization, and security checks before launch.', time: '3-5 days' },
  { n: '05', title: 'Launch & Support', sub: 'Your Success, Our Priority', desc: 'Smooth launch with comprehensive training and ongoing support to ensure continuous success.', time: 'Ongoing' }
];

// OVERWRITE THE SEED SCRIPTS AND ROUTES
// We will write the updated code blocks into each file target.

// 2. app/api/seed-wordpress/route.ts
if (fs.existsSync(files.seedWordpressRoute)) {
  const content = `import { NextResponse } from 'next/server'
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
          headline: 'Professional WordPress\\nDevelopment Services',
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
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\\u2713 Site Secured'" }, { t: 'v', v: ';' }],
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
          items: ${JSON.stringify(WP_SERVICES_ITEMS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why Choose Us',
          headline: 'Why Choose ARIOSETECH for WordPress Development?',
          items: [
            { icon: '🏆', title: '7+ Years WordPress Expertise', subhead: 'Proven Track Record', desc: 'We\\'ve been perfecting WordPress development since 2017, delivering 50+ successful WordPress projects across various industries.' },
            { icon: '⚡', title: 'Performance-First Approach', subhead: 'Speed & SEO Optimized', desc: 'Every WordPress site we build is optimized for speed, security, and search engines from day one.' },
            { icon: '🔒', title: 'Security-Focused Development', subhead: 'Enterprise Hardening', desc: 'We implement enterprise-grade security measures to protect your WordPress site from threats.' },
            { icon: '📱', title: 'Mobile-First Design', subhead: 'Responsive Layouts', desc: 'All our WordPress sites are built with mobile users in mind, ensuring perfect performance across all devices.' },
            { icon: '🔧', title: 'Ongoing Support', subhead: 'Continuous Care', desc: 'We don\\'t just build and leave. Our team provides continuous support to ensure your WordPress site thrives.' },
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
          steps: ${JSON.stringify(WP_PROCESS_STEPS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'portfolio',
        props: {
          eyebrow: 'Our Work',
          headline: 'WordPress Portfolio Highlights',
          intro: 'Discover how we\\'ve helped businesses grow with custom WordPress solutions.',
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
          desc: 'Discover what\\'s holding your site back. Get a 30-minute strategy session, WordPress recommendations, project timeline and pricing, and a no-obligation proposal.',
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
          items: ${JSON.stringify(FAQS_WP, null, 2)}
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
}`;
  fs.writeFileSync(files.seedWordpressRoute, content, 'utf8');
  console.log("✓ Updated seed-wordpress route successfully.");
}

// 3. app/api/seed-shopify/route.ts
if (fs.existsSync(files.seedShopifyRoute)) {
  const content = `import { NextResponse } from 'next/server'
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
          headline: 'Professional Shopify\\nDevelopment Services',
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
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\\u2713 Sales Increased'" }, { t: 'v', v: ';' }],
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
          items: ${JSON.stringify(SHOPIFY_SERVICES_ITEMS, null, 2)}
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
            { icon: '🔧', title: 'Ongoing Partnership', subhead: 'Long-term Growth', desc: 'We\\'re your long-term Shopify growth partner, supporting your business at every stage of expansion.' },
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
          steps: ${JSON.stringify(SHOPIFY_PROCESS_STEPS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'portfolio',
        props: {
          eyebrow: 'Our Work',
          headline: 'Shopify Portfolio Highlights',
          intro: 'Discover how we\\'ve helped e-commerce brands scale with custom Shopify developments.',
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
          desc: 'Discover what\\'s holding your store back. Get a complete store performance analysis, conversion rate recommendations, and a detailed project proposal.',
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
          items: ${JSON.stringify(FAQS_SHOPIFY, null, 2)}
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
}`;
  fs.writeFileSync(files.seedShopifyRoute, content, 'utf8');
  console.log("✓ Updated seed-shopify route successfully.");
}

// 4. app/api/seed-woocommerce/route.ts
if (fs.existsSync(files.seedWoocommerceRoute)) {
  const content = `import { NextResponse } from 'next/server'
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
          headline: 'Professional WooCommerce\\nDevelopment Services',
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
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\\u2713 Performance Optimized'" }, { t: 'v', v: ';' }],
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
          items: ${JSON.stringify(WC_SERVICES_ITEMS, null, 2)}
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
            { icon: '📈', title: 'Growth Partnership', desc: 'We don\\'t just build stores; we create growth-focused solutions that scale with your business and support long-term success.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'process',
        props: {
          eyebrow: 'How We Work',
          headline: 'WooCommerce Development Process',
          steps: ${JSON.stringify(WC_PROCESS_STEPS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'portfolio',
        props: {
          eyebrow: 'Our Work',
          headline: 'WooCommerce Portfolio Highlights',
          intro: 'Discover how we\\'ve helped e-commerce brands scale with custom WooCommerce solutions.',
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
          desc: 'Discover what\\'s holding your store back. Get a complete e-commerce strategy session, platform analysis, project timeline, and a detailed proposal.',
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
          items: ${JSON.stringify(FAQS_WC, null, 2)}
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
}`;
  fs.writeFileSync(files.seedWoocommerceRoute, content, 'utf8');
  console.log("✓ Updated seed-woocommerce route successfully.");
}

// 5. app/api/seed-seo/route.ts
if (fs.existsSync(files.seedSeoRoute)) {
  const content = `import { NextResponse } from 'next/server'
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
          eyebrow: 'SEO Services for Growing Brands',
          headline: 'SEO Services That Help\\nYour Business Get Found',
          subheadline: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance.',
          desc: 'From technical fixes to local SEO and content strategy, we build a stronger search presence that supports real business growth.',
          ctaPrimaryLabel: 'Book a Free SEO Consultation',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'Get a Website Audit',
          ctaSecondaryHref: '/contact',
          trust: 'Website SEO \\u2022 Local SEO \\u2022 Technical SEO \\u2022 SEO Content',
          codeFilename: 'seo-analysis / ranking.ts',
          codeLines: [
            [{ t: 'com', v: '// Executing technical SEO audit' }],
            [],
            [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_rankings' }, { t: 'v', v: '() {' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'audit' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'run_technical_audit' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'audit' }, { t: 'v', v: '.' }, { t: 'attr', v: 'core_web_vitals' }, { t: 'v', v: ' === ' }, { t: 'str', v: "'poor'" }, { t: 'v', v: ') {' }],
            [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'optimize_performance' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  }' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\\u2713 Rankings Improved'" }, { t: 'v', v: ';' }],
            [{ t: 'v', v: '}' }]
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'SEO That Supports Real Growth',
          body: 'Ranking on Google is not just about adding keywords to a page. Strong SEO comes from the right structure, better content, technical health, internal linking, local relevance, and a website that actually deserves to rank.\\n\\nAt Ariosetech, we take a business-first approach to SEO. That means we do not chase vanity traffic or empty rankings. We focus on the type of visibility that helps your brand attract the right audience, bring in qualified traffic, and create more opportunities for leads and sales.\\n\\nWhether you run a local business, a service-based company, or an eCommerce brand, we build SEO strategies around your goals, website condition, and growth stage.',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'Why SEO Still Matters',
          body: 'Search is still one of the strongest channels for long-term digital growth. When your business ranks for the right searches, you build visibility, trust, and steady traffic without relying only on paid ads.\\n\\nA strong SEO setup helps your business:\\n* Show up when customers are actively searching\\n* Build trust through better visibility\\n* Attract more qualified traffic\\n* Improve lead generation over time\\n* Support long-term growth with compounding results\\n\\nGood SEO does not just help you rank. It helps your business become easier to find, trust, and choose.',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'services-accordion',
        props: {
          eyebrow: 'Our Services',
          headline: 'Our SEO Services',
          intro: 'We offer focused SEO solutions built to improve search visibility, site performance, and growth potential.',
          items: ${JSON.stringify(SEO_SERVICES_ITEMS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why Us',
          headline: 'Why Businesses Choose Ariosetech for SEO',
          items: [
            { icon: '🎯', title: 'Business-First SEO', desc: 'We focus on visibility that supports real business outcomes, not just traffic numbers.' },
            { icon: '⚙️', title: 'Development and SEO in Sync', desc: 'Because our team works across websites, structure, and performance, we can align SEO with how your site is actually built.' },
            { icon: '✅', title: 'Clean, Practical Execution', desc: 'We focus on the changes that make the biggest impact without creating confusion or unnecessary complexity.' },
            { icon: '📈', title: 'Long-Term Growth Thinking', desc: 'We build SEO in a way that supports stronger performance over time, not just short-term spikes.' },
            { icon: '🏪', title: 'Support for Different Business Types', desc: 'We work with service businesses, local brands, and eCommerce companies that need stronger digital visibility.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'Common SEO Problems We Help Fix',
          body: 'Many businesses come to us with the same core issues. Their website is live, but growth is slow and search visibility is weak.\\n\\n* Your website is not ranking for important keywords\\n* You are getting traffic, but not qualified leads\\n* Your service pages are weak or under-optimized\\n* Your website has technical SEO issues\\n* Your local business is not showing in local search results\\n* Your content lacks structure or depth\\n* Your pages are not connected properly through internal links\\n* Your competitors are outranking you consistently\\n\\nIf your website is not pulling its weight in search, the issue is usually deeper than one missing keyword.',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'process',
        props: {
          eyebrow: 'How We Work',
          headline: 'Our SEO Process',
          steps: [
            { n: '01', title: 'Audit', sub: '', desc: 'We review your website, search presence, content, and technical condition to understand what is holding performance back.' },
            { n: '02', title: 'Strategy', sub: '', desc: 'We build an SEO plan based on your business model, audience, goals, and search opportunities.' },
            { n: '03', title: 'Optimization', sub: '', desc: 'We improve your pages, structure, technical setup, content targeting, and internal SEO foundation.' },
            { n: '04', title: 'Content and Growth Support', sub: '', desc: 'Where needed, we build supporting content, improve weak pages, and strengthen site-wide relevance.' },
            { n: '05', title: 'Ongoing Improvement', sub: '', desc: 'SEO is not static. We continue refining based on performance, search trends, and growth priorities.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'Who Our SEO Services Are For',
          body: 'Our SEO services are designed for businesses that want more than surface-level optimization. We work best with brands that want a stronger digital foundation and are ready to improve visibility with the right strategy.\\n\\nIdeal Fit List:\\n* Local service businesses\\n* Agencies and consultants\\n* eCommerce brands\\n* Startups and growing companies\\n* Businesses with underperforming websites\\n* Brands needing technical SEO and content support',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'What Better SEO Can Do for Your Business',
          body: 'A stronger SEO setup can improve much more than rankings alone. With the right structure and strategy in place, your website becomes easier to discover, easier to trust, and better positioned to convert.\\n\\n* Stronger search visibility\\n* Better keyword reach\\n* Improved local presence\\n* More qualified traffic\\n* Better lead potential\\n* Stronger content foundation\\n* Healthier website structure',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'SEO Works Better When Your Website Is Built Right',
          body: 'One of the biggest SEO problems businesses face is trying to grow search traffic on top of a weak website foundation. Poor structure, slow speed, weak UX, and disconnected content can limit results no matter how many keywords you target.\\n\\nBecause Ariosetech works across web development, Shopify, WordPress, SEO, and automation, we can improve SEO with a broader understanding of how digital performance actually works.\\n\\nSEO is stronger when the website behind it is built to support growth.',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Get Started',
          headline: 'Ready to Improve Your Search Visibility?',
          subhead: 'Get a free SEO audit',
          desc: 'Discover exactly what is holding your site back from ranking #1 with our comprehensive SEO and performance audit.',
          ctaLabel: 'Book a Free SEO Consultation',
          ctaHref: '/contact',
          guarantee: 'Tell us where your website stands, and we\\'ll help you map the next move.'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'faq',
        props: {
          eyebrow: 'SEO FAQ',
          headline: 'Frequently Asked Questions About SEO',
          items: ${JSON.stringify(FAQS_SEO, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'cta',
        props: {
          eyebrow: 'Ready to grow your business online?',
          headline: 'Start Your SEO Journey Today',
          desc: 'Join 100+ successful businesses. Professional results, transparent reporting, and long-term growth.',
          ctaLabel: 'Book a Free SEO Consultation',
          ctaHref: '/contact',
          secondaryLabel: 'Get a Website Audit',
          secondaryHref: '/contact',
          trust: 'No Long-Term Contracts,Transparent Monthly Reporting,White-Hat Techniques'
        }
      }
    ]

    const pagesCol = await getCollection<PageDoc>('pages')
    const existing = await pagesCol.findOne({ fullPath: '/services/seo' })

    if (existing) {
      await pagesCol.updateOne(
        { fullPath: '/services/seo' }, 
        { 
          $set: { 
            title: 'SEO Services',
            status: 'published',
            'layout.sections': sections, 
            updatedAt: new Date(),
            seo: {
              title: 'SEO Services | Website, Local & Technical SEO | Ariosetech',
              description: 'Ariosetech offers website SEO, local SEO, technical SEO, and SEO content services to help businesses improve rankings, traffic, and leads.'
            }
          } 
        }
      )
      return NextResponse.json({ message: 'SEO page updated!' })
    } else {
      await pagesCol.insertOne({
        title: 'SEO Services',
        slug: 'seo',
        parentId: null,
        fullPath: '/services/seo',
        layout: { sections },
        status: 'published',
        seo: {
          title: 'SEO Services | Website, Local & Technical SEO | Ariosetech',
          description: 'Ariosetech offers website SEO, local SEO, technical SEO, and SEO content services to help businesses improve rankings, traffic, and leads.',
          robots: { index: true, follow: true }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return NextResponse.json({ message: 'SEO page created!' })
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}`;
  fs.writeFileSync(files.seedSeoRoute, content, 'utf8');
  console.log("✓ Updated seed-seo route successfully.");
}

// 6. app/api/seed-homepage/route.ts
if (fs.existsSync(files.seedHomepageRoute)) {
  const content = `import { NextResponse } from 'next/server'
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
          eyebrow: '✓ 7+ Years of Excellence',
          headline: 'Professional WordPress, Shopify & WooCommerce Development Since 2017',
          subheadline: "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.",
          desc: 'Trusted by businesses in the USA, UAE, and Switzerland for affordable, high-quality web development that delivers real ROI.',
          ctaPrimaryLabel: 'Get Free Quote & Strategy Call',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'View Our Portfolio',
          ctaSecondaryHref: '/portfolio',
          trust: '✓ 7+ Years of Excellence,✓ 100+ Successful Projects,✓ 24/7 Expert Support,✓ 30-Day Money-Back Guarantee',
          stats: [
            { value: '100+', label: 'Projects Delivered' },
            { value: '7+', label: 'Years Experience' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '40+', label: 'Industries Served' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'logos',
        props: {
          label: 'Trusted by 100+ businesses',
          items: ['The Kapra','Dr. Scents','Janya.pk','GeoMag World','Genovie','WYOX Sports','Snap Glam Spa','CTV Promo','US Bidding Estimating','CMA Digital','Zoom PC Hire','Ocean Tech BPO','Staffing Ocean','BGMG Cosmetics','Accident Law','Fabric Wholesale'].map(value => ({ value }))
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'services-accordion',
        props: {
          eyebrow: 'What We Offer',
          headline: 'Comprehensive Web Development Solutions for Your Business Growth',
          intro: "Three core platforms. One expert team. We don't dabble — we specialise so you get the best results every time.",
          items: [
            {
              label: 'WordPress',
              title: 'WordPress Development',
              sub: 'Build Powerful, Scalable Websites',
              desc: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.',
              features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services',
              price: '$799',
              href: '/services/wordpress',
              bg: 'radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 90% 10%, rgba(80,60,220,0.18) 0%, transparent 50%), linear-gradient(160deg,#0c0a1c,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
            },
            {
              label: 'WooCommerce',
              title: 'WooCommerce Development',
              sub: 'Launch Your Dream E-commerce Store',
              desc: 'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.',
              features: 'Store Setup & Customization,Payment Gateway Integration,Multi-vendor Solutions,Performance Optimization',
              price: '$1,299',
              href: '/services/woocommerce',
              bg: 'radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 10%, rgba(60,50,200,0.18) 0%, transparent 50%), linear-gradient(160deg,#08081a,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
            },
            {
              label: 'Shopify',
              title: 'Shopify Development',
              sub: 'Scale Your Business with Shopify',
              desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.',
              features: 'Custom Store Development,Shopify Plus Solutions,App Integration,Conversion Optimization',
              price: '$999',
              href: '/services/shopify',
              bg: 'radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% -10%, rgba(90,80,240,0.16) 0%, transparent 50%), linear-gradient(160deg,#0a0818,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
            }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why Choose Us',
          headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success',
          items: ${JSON.stringify(WHY_ITEMS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'impact',
        props: {
          eyebrow: 'Results That Matter',
          headline: 'The Impact, Quantified',
          subheadline: "Numbers don't lie. Here's what working with ARIOSETECH actually delivers for your business.",
          items: [
            { value: '150%', label: 'Avg Conversion Lift', desc: 'Our tailored e-commerce strategies and optimized UX consistently drive 150%+ conversion improvements for clients.' },
            { value: '98%', label: 'Client Satisfaction', desc: 'Every project is delivered with near-perfect precision — on time, on spec, and fully aligned with your business goals.' },
            { value: '40%', label: 'Site Speed Gain', desc: 'Performance-first builds mean faster stores, better SEO rankings, and higher revenue from the same traffic.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'howitworks',
        props: {
          eyebrow: 'Our Process',
          headline: 'How It Works',
          subheadline: 'From setup to scale — a proven 5-step process that takes you from idea to a live, high-performing site.',
          items: ${JSON.stringify(HOW_IT_WORKS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'approach',
        props: {
          eyebrow: "Why We're Different",
          headline: "Our",
          scrambleWord: "Approach",
          items: [
            { n: '01', title: 'COST-EFFECTIVE', sub: 'Save 60% Without Compromising Quality', desc: 'Premium web development at a fraction of US agency costs. Professional results, transparent pricing, zero compromise on quality.' },
            { n: '02', title: 'TRANSPARENT', sub: 'Open Communication at Every Step', desc: 'We share project progress, insights, and feedback in real-time so you always know exactly where your investment stands.' },
            { n: '03', title: 'RELIABLE', sub: 'Consistently Delivered. Always On-Time.', desc: '100+ projects delivered on time and within budget. Our clients come back because our track record speaks for itself.' },
            { n: '04', title: 'SCALABLE', sub: 'Built to Grow With Your Business', desc: 'Every site we build is architected for scale — whether you launch small or enterprise-level, our code grows seamlessly with your business.' },
            { n: '05', title: 'SUPPORTED', sub: '24/7 Expert Assistance, Always On', desc: 'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included in every plan.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'portfolio',
        props: {
          eyebrow: 'Our Work',
          headline: 'Success Stories That Speak for Themselves',
          intro: "Discover how we've transformed businesses across industries with custom web solutions that drive growth and maximize ROI.",
          ctaLabel: 'Explore All Projects',
          ctaHref: '/portfolio',
          items: ${JSON.stringify(PORTFOLIO_ITEMS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'testimonials',
        props: {
          eyebrow: 'Client Reviews',
          headline: 'What Our Clients Say About Working With Us',
          items: ${JSON.stringify(TESTIMONIALS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'process',
        props: {
          eyebrow: 'How We Work',
          headline: 'Your Success Journey in 5 Simple Steps',
          items: ${JSON.stringify(PROCESS_STEPS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Free Audit',
          headline: 'Get Your Free Website Performance Audit',
          subheadline: "Discover what's holding your website back from peak performance.",
          desc: "Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.",
          note: 'No spam, ever. Detailed report delivered within 24 hours.',
          ctaLabel: 'Get My Free Audit Report',
          ctaHref: '/contact',
          items: [
            { value: 'Performance bottleneck analysis' },
            { value: 'SEO issues & keyword opportunities' },
            { value: 'Conversion barrier identification' },
            { value: 'Security vulnerability check' },
            { value: 'Mobile experience assessment' },
            { value: 'Detailed action plan — no obligation' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'blog',
        props: {
          eyebrow: 'Knowledge Base',
          headline: 'Latest Insights & Tutorials',
          ctaLabel: 'All Articles',
          ctaHref: '/blog',
          limit: 3
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'faq',
        props: {
          eyebrow: 'FAQ',
          headline: 'Frequently Asked Questions',
          subheadline: "Can't find what you're looking for? We're here to help.",
          ctaLabel: 'Ask Us Anything',
          ctaHref: '/contact',
          items: [
            { q: 'How long does a WordPress website take?', a: 'Most WordPress websites are completed within 2-4 weeks, depending on complexity and requirements. Complex projects may take 4-6 weeks.' },
            { q: 'What is included in your maintenance plans?', a: 'Our maintenance plans include regular updates, security monitoring, performance optimization, backup management, and priority support. Plans start at $79/month.' },
            { q: 'Do you offer a money-back guarantee?', a: "Yes. We offer a 30-day money-back guarantee on all our development projects. If you're not satisfied, we'll refund you in full." },
            { q: 'Can you work with my existing WordPress site?', a: 'Absolutely. We work with existing WordPress sites for redesigns, migrations, speed optimization, security fixes, and feature additions.' },
            { q: 'Do you offer ongoing support after launch?', a: 'Yes. Every project includes 30 days of free post-launch support. After that, we offer flexible monthly maintenance plans starting at $79/month.' },
            { q: 'Can you migrate my existing store to Shopify or WooCommerce?', a: 'Yes! We provide complete migration services from all major e-commerce platforms including Shopify, WooCommerce, Magento, BigCommerce, and custom solutions.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'contact',
        props: {
          eyebrow: 'Get In Touch',
          headline: 'Ready to Transform Your Online Presence?',
          guarantee: 'We respond to all inquiries within 2 hours during business days.',
          email: 'info@ariosetech.com',
          emailDesc: 'Get detailed proposals and project discussions',
          phone: '+92 300 9484 739',
          phoneDesc: 'Instant consultation and quick questions',
          address: '95 College Road, Block E Block D PCSIR Staff Colony, Lahore, 54770',
          addressDesc: ''
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'cta',
        props: {
          eyebrow: 'Get Started Today',
          headline: 'Start Your Success Story Today',
          subheadline: 'Join 100+ successful businesses that chose ARIOSETECH for their web development needs. Professional results, affordable pricing, and ongoing support.',
          ctaPrimaryLabel: 'Schedule Free Consultation',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'Download Our Service Guide',
          ctaSecondaryHref: '/portfolio',
          tags: 'No Long-Term Contracts,30-Day Money-Back Guarantee,Free Post-Launch Support,Transparent Pricing'
        }
      }
    ]

    const pagesCol = await getCollection<PageDoc>('pages')
    const existing = await pagesCol.findOne({ fullPath: '/' })

    if (existing) {
      await pagesCol.updateOne({ fullPath: '/' }, { $set: { 'layout.sections': sections, updatedAt: new Date() } })
      return NextResponse.json({ message: 'Homepage updated!' })
    } else {
      await pagesCol.insertOne({ title: 'Home', slug: '', parentId: null, fullPath: '/', layout: { sections }, status: 'published', seo: { title: 'ARIOSETECH — Consider It Solved', description: 'Professional WordPress, Shopify & WooCommerce development since 2017. Trusted by 100+ businesses.', robots: { index: true, follow: true } }, createdAt: new Date(), updatedAt: new Date() })
      return NextResponse.json({ message: 'Homepage created!' })
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}`;
  fs.writeFileSync(files.seedHomepageRoute, content, 'utf8');
  console.log("✓ Updated seed-homepage route successfully.");
}

// 7. scripts/seed-homepage.ts
if (fs.existsSync(files.seedHomepage)) {
  const content = `import { MongoClient, ObjectId } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\\n').forEach(line => {
    const match = line.match(/^([^#\\s][^=]+)=(.*)$/)
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
    }
  })
}

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB  = process.env.MONGODB_DB || 'ariosetech'

async function seedHomepage() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in .env.local')
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db(MONGODB_DB)
    const pagesCol = db.collection('pages')

    const sections = [
      {
        id: new ObjectId().toHexString(),
        type: 'hero-interactive',
        props: {
          eyebrow: '✓ 7+ Years of Excellence',
          headline: 'Professional WordPress, Shopify & WooCommerce Development Since 2017',
          subheadline: "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.",
          desc: 'Trusted by businesses in the USA, UAE, and Switzerland for affordable, high-quality web development that delivers real ROI.',
          ctaPrimaryLabel: 'Get Free Quote & Strategy Call',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'View Our Portfolio',
          ctaSecondaryHref: '/portfolio',
          trust: '✓ 7+ Years of Excellence,✓ 100+ Successful Projects,✓ 24/7 Expert Support,✓ 30-Day Money-Back Guarantee',
          stats: [
            { value: '100+', label: 'Projects Delivered' },
            { value: '7+', label: 'Years Experience' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '40+', label: 'Industries Served' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'logos',
        props: {
          label: 'Trusted by 100+ businesses',
          items: ['The Kapra','Dr. Scents','Janya.pk','GeoMag World','Genovie','WYOX Sports','Snap Glam Spa','CTV Promo','US Bidding Estimating','CMA Digital','Zoom PC Hire','Ocean Tech BPO','Staffing Ocean','BGMG Cosmetics','Accident Law','Fabric Wholesale'].map(value => ({ value }))
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'services-accordion',
        props: {
          eyebrow: 'What We Offer',
          headline: 'Comprehensive Web Development Solutions for Your Business Growth',
          intro: "Three core platforms. One expert team. We don't dabble — we specialise so you get the best results every time.",
          items: [
            {
              label: 'WordPress',
              title: 'WordPress Development',
              sub: 'Build Powerful, Scalable Websites',
              desc: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.',
              features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services',
              price: '$799',
              href: '/services/wordpress',
              bg: 'radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 90% 10%, rgba(80,60,220,0.18) 0%, transparent 50%), linear-gradient(160deg,#0c0a1c,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
            },
            {
              label: 'WooCommerce',
              title: 'WooCommerce Development',
              sub: 'Launch Your Dream E-commerce Store',
              desc: 'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.',
              features: 'Store Setup & Customization,Payment Gateway Integration,Multi-vendor Solutions,Performance Optimization',
              price: '$1,299',
              href: '/services/woocommerce',
              bg: 'radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 10%, rgba(60,50,200,0.18) 0%, transparent 50%), linear-gradient(160deg,#08081a,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
            },
            {
              label: 'Shopify',
              title: 'Shopify Development',
              sub: 'Scale Your Business with Shopify',
              desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.',
              features: 'Custom Store Development,Shopify Plus Solutions,App Integration,Conversion Optimization',
              price: '$999',
              href: '/services/shopify',
              bg: 'radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% -10%, rgba(90,80,240,0.16) 0%, transparent 50%), linear-gradient(160deg,#0a0818,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
            }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why Choose Us',
          headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success',
          items: ${JSON.stringify(WHY_ITEMS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'impact',
        props: {
          eyebrow: 'Results That Matter',
          headline: 'The Impact, Quantified',
          subheadline: "Numbers don't lie. Here's what working with ARIOSETECH actually delivers for your business.",
          items: [
            { value: '150%', label: 'Avg Conversion Lift', desc: 'Our tailored e-commerce strategies and optimized UX consistently drive 150%+ conversion improvements for clients.' },
            { value: '98%', label: 'Client Satisfaction', desc: 'Every project is delivered with near-perfect precision — on time, on spec, and fully aligned with your business goals.' },
            { value: '40%', label: 'Site Speed Gain', desc: 'Performance-first builds mean faster stores, better SEO rankings, and higher revenue from the same traffic.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'howitworks',
        props: {
          eyebrow: 'Our Process',
          headline: 'How It Works',
          subheadline: 'From setup to scale — a proven 5-step process that takes you from idea to a live, high-performing site.',
          items: ${JSON.stringify(HOW_IT_WORKS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'approach',
        props: {
          eyebrow: "Why We're Different",
          headline: "Our",
          scrambleWord: "Approach",
          items: [
            { n: '01', title: 'COST-EFFECTIVE', sub: 'Save 60% Without Compromising Quality', desc: 'Premium web development at a fraction of US agency costs. Professional results, transparent pricing, zero compromise on quality.' },
            { n: '02', title: 'TRANSPARENT', sub: 'Open Communication at Every Step', desc: 'We share project progress, insights, and feedback in real-time so you always know exactly where your investment stands.' },
            { n: '03', title: 'RELIABLE', sub: 'Consistently Delivered. Always On-Time.', desc: '100+ projects delivered on time and within budget. Our clients come back because our track record speaks for itself.' },
            { n: '04', title: 'SCALABLE', sub: 'Built to Grow With Your Business', desc: 'Every site we build is architected for scale — whether you launch small or enterprise-level, our code grows seamlessly with your business.' },
            { n: '05', title: 'SUPPORTED', sub: '24/7 Expert Assistance, Always On', desc: 'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included in every plan.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'portfolio',
        props: {
          eyebrow: 'Our Work',
          headline: 'Success Stories That Speak for Themselves',
          intro: "Discover how we've transformed businesses across industries with custom web solutions that drive growth and maximize ROI.",
          ctaLabel: 'Explore All Projects',
          ctaHref: '/portfolio',
          items: ${JSON.stringify(PORTFOLIO_ITEMS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'testimonials',
        props: {
          eyebrow: 'Client Reviews',
          headline: 'What Our Clients Say About Working With Us',
          items: ${JSON.stringify(TESTIMONIALS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'process',
        props: {
          eyebrow: 'How We Work',
          headline: 'Your Success Journey in 5 Simple Steps',
          items: ${JSON.stringify(PROCESS_STEPS, null, 2)}
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Free Audit',
          headline: 'Get Your Free Website Performance Audit',
          subheadline: "Discover what's holding your website back from peak performance.",
          desc: "Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.",
          note: 'No spam, ever. Detailed report delivered within 24 hours.',
          ctaLabel: 'Get My Free Audit Report',
          ctaHref: '/contact',
          items: [
            { value: 'Performance bottleneck analysis' },
            { value: 'SEO issues & keyword opportunities' },
            { value: 'Conversion barrier identification' },
            { value: 'Security vulnerability check' },
            { value: 'Mobile experience assessment' },
            { value: 'Detailed action plan — no obligation' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'blog',
        props: {
          eyebrow: 'Knowledge Base',
          headline: 'Latest Insights & Tutorials',
          ctaLabel: 'All Articles',
          ctaHref: '/blog',
          limit: 3
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'faq',
        props: {
          eyebrow: 'FAQ',
          headline: 'Frequently Asked Questions',
          subheadline: "Can't find what you're looking for? We're here to help.",
          ctaLabel: 'Ask Us Anything',
          ctaHref: '/contact',
          items: [
            { q: 'How long does a WordPress website take?', a: 'Most WordPress websites are completed within 2-4 weeks, depending on complexity and requirements. Complex projects may take 4-6 weeks.' },
            { q: 'What is included in your maintenance plans?', a: 'Our maintenance plans include regular updates, security monitoring, performance optimization, backup management, and priority support. Plans start at $79/month.' },
            { q: 'Do you offer a money-back guarantee?', a: "Yes. We offer a 30-day money-back guarantee on all our development projects. If you're not satisfied, we'll refund you in full." },
            { q: 'Can you work with my existing WordPress site?', a: 'Absolutely. We work with existing WordPress sites for redesigns, migrations, speed optimization, security fixes, and feature additions.' },
            { q: 'Do you offer ongoing support after launch?', a: 'Yes. Every project includes 30 days of free post-launch support. After that, we offer flexible monthly maintenance plans starting at $79/month.' },
            { q: 'Can you migrate my existing store to Shopify or WooCommerce?', a: 'Yes! We provide complete migration services from all major e-commerce platforms including Shopify, WooCommerce, Magento, BigCommerce, and custom solutions.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'contact',
        props: {
          eyebrow: 'Get In Touch',
          headline: 'Ready to Transform Your Online Presence?',
          guarantee: 'We respond to all inquiries within 2 hours during business days.',
          email: 'info@ariosetech.com',
          emailDesc: 'Get detailed proposals and project discussions',
          phone: '+92 300 9484 739',
          phoneDesc: 'Instant consultation and quick questions',
          address: '95 College Road, Block E Block D PCSIR Staff Colony, Lahore, 54770',
          addressDesc: ''
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'cta',
        props: {
          eyebrow: 'Get Started Today',
          headline: 'Start Your Success Story Today',
          subheadline: 'Join 100+ successful businesses that chose ARIOSETECH for their web development needs. Professional results, affordable pricing, and ongoing support.',
          ctaPrimaryLabel: 'Schedule Free Consultation',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'Download Our Service Guide',
          ctaSecondaryHref: '/portfolio',
          tags: 'No Long-Term Contracts,30-Day Money-Back Guarantee,Free Post-Launch Support,Transparent Pricing'
        }
      }
    ]

    const r = await pagesCol.updateOne({ fullPath: '/' }, { $set: { 'layout.sections': sections, updatedAt: new Date() } })
    console.log('Update result for Homepage:', r)
    await client.close()
  } catch (err) {
    console.error(err)
  }
}
seedHomepage();`;
  fs.writeFileSync(files.seedHomepage, content, 'utf8');
  console.log("✓ Updated seed-homepage script successfully.");
}

// 8. scripts/update-mongo.ts
if (fs.existsSync(files.updateMongo)) {
  const content = `import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'

const envPath = '.env.local'
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  content.split('\\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) process.env[match[1]] = match[2].trim()
  })
}

async function run() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('No URI')
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(process.env.MONGODB_DB)
  const pagesCol = db.collection('pages')

  const sections = [
    {
      id: new ObjectId().toHexString(),
      type: 'hero-interactive',
      props: {
        eyebrow: '✓ 7+ Years of Excellence',
        headline: 'Professional WordPress, Shopify & WooCommerce Development Since 2017',
        subheadline: "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.",
        desc: 'Trusted by businesses in the USA, UAE, and Switzerland for affordable, high-quality web development that delivers real ROI.',
        ctaPrimaryLabel: 'Get Free Quote & Strategy Call',
        ctaPrimaryHref: '/contact',
        ctaSecondaryLabel: 'View Our Portfolio',
        ctaSecondaryHref: '/portfolio',
        trust: '✓ 7+ Years of Excellence,✓ 100+ Successful Projects,✓ 24/7 Expert Support,✓ 30-Day Money-Back Guarantee',
        stats: [
          { value: '100+', label: 'Projects Delivered' },
          { value: '7+', label: 'Years Experience' },
          { value: '98%', label: 'Client Satisfaction' },
          { value: '40+', label: 'Industries Served' }
        ]
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'logos',
      props: {
        label: 'Trusted by 100+ businesses',
        items: ['The Kapra','Dr. Scents','Janya.pk','GeoMag World','Genovie','WYOX Sports','Snap Glam Spa','CTV Promo','US Bidding Estimating','CMA Digital','Zoom PC Hire','Ocean Tech BPO','Staffing Ocean','BGMG Cosmetics','Accident Law','Fabric Wholesale'].map(value => ({ value }))
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'services-accordion',
      props: {
        eyebrow: 'What We Offer',
        headline: 'Comprehensive Web Development Solutions for Your Business Growth',
        intro: "Three core platforms. One expert team. We don't dabble — we specialise so you get the best results every time.",
        items: [
          {
            label: 'WordPress',
            title: 'WordPress Development',
            sub: 'Build Powerful, Scalable Websites',
            desc: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.',
            features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services',
            price: '$799',
            href: '/services/wordpress',
            bg: 'radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 90% 10%, rgba(80,60,220,0.18) 0%, transparent 50%), linear-gradient(160deg,#0c0a1c,#05050a)',
            icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
          },
          {
            label: 'WooCommerce',
            title: 'WooCommerce Development',
            sub: 'Launch Your Dream E-commerce Store',
            desc: 'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.',
            features: 'Store Setup & Customization,Payment Gateway Integration,Multi-vendor Solutions,Performance Optimization',
            price: '$1,299',
            href: '/services/woocommerce',
            bg: 'radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 10%, rgba(60,50,200,0.18) 0%, transparent 50%), linear-gradient(160deg,#08081a,#05050a)',
            icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
          },
          {
            label: 'Shopify',
            title: 'Shopify Development',
            sub: 'Scale Your Business with Shopify',
            desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.',
            features: 'Custom Store Development,Shopify Plus Solutions,App Integration,Conversion Optimization',
            price: '$999',
            href: '/services/shopify',
            bg: 'radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% -10%, rgba(90,80,240,0.16) 0%, transparent 50%), linear-gradient(160deg,#0a0818,#05050a)',
            icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
          }
        ]
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'whyus',
      props: {
        eyebrow: 'Why Choose Us',
        headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success',
        items: ${JSON.stringify(WHY_ITEMS, null, 2)}
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'impact',
      props: {
        eyebrow: 'Results That Matter',
        headline: 'The Impact, Quantified',
        subheadline: "Numbers don't lie. Here's what working with ARIOSETECH actually delivers for your business.",
        items: [
          { value: '150%', label: 'Avg Conversion Lift', desc: 'Our tailored e-commerce strategies and optimized UX consistently drive 150%+ conversion improvements for clients.' },
          { value: '98%', label: 'Client Satisfaction', desc: 'Every project is delivered with near-perfect precision — on time, on spec, and fully aligned with your business goals.' },
          { value: '40%', label: 'Site Speed Gain', desc: 'Performance-first builds mean faster stores, better SEO rankings, and higher revenue from the same traffic.' }
        ]
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'howitworks',
      props: {
        eyebrow: 'Our Process',
        headline: 'How It Works',
        subheadline: 'From setup to scale — a proven 5-step process that takes you from idea to a live, high-performing site.',
        items: ${JSON.stringify(HOW_IT_WORKS, null, 2)}
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'approach',
      props: {
        eyebrow: "Why We're Different",
        headline: "Our",
        scrambleWord: "Approach",
        items: [
          { n: '01', title: 'COST-EFFECTIVE', sub: 'Save 60% Without Compromising Quality', desc: 'Premium web development at a fraction of US agency costs. Professional results, transparent pricing, zero compromise on quality.' },
          { n: '02', title: 'TRANSPARENT', sub: 'Open Communication at Every Step', desc: 'We share project progress, insights, and feedback in real-time so you always know exactly where your investment stands.' },
          { n: '03', title: 'RELIABLE', sub: 'Consistently Delivered. Always On-Time.', desc: '100+ projects delivered on time and within budget. Our clients come back because our track record speaks for itself.' },
          { n: '04', title: 'SCALABLE', sub: 'Built to Grow With Your Business', desc: 'Every site we build is architected for scale — whether you launch small or enterprise-level, our code grows seamlessly with your business.' },
          { n: '05', title: 'SUPPORTED', sub: '24/7 Expert Assistance, Always On', desc: 'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included in every plan.' }
        ]
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'portfolio',
      props: {
        eyebrow: 'Our Work',
        headline: 'Success Stories That Speak for Themselves',
        intro: "Discover how we've transformed businesses across industries with custom web solutions that drive growth and maximize ROI.",
        ctaLabel: 'Explore All Projects',
        ctaHref: '/portfolio',
        items: ${JSON.stringify(PORTFOLIO_ITEMS, null, 2)}
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'testimonials',
      props: {
        eyebrow: 'Client Reviews',
        headline: 'What Our Clients Say About Working With Us',
        items: ${JSON.stringify(TESTIMONIALS, null, 2)}
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'process',
      props: {
        eyebrow: 'How We Work',
        headline: 'Your Success Journey in 5 Simple Steps',
        items: ${JSON.stringify(PROCESS_STEPS, null, 2)}
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'audit',
      props: {
        eyebrow: 'Free Audit',
        headline: 'Get Your Free Website Performance Audit',
        subheadline: "Discover what's holding your website back from peak performance.",
        desc: "Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.",
        note: 'No spam, ever. Detailed report delivered within 24 hours.',
        ctaLabel: 'Get My Free Audit Report',
        ctaHref: '/contact',
        items: [
          { value: 'Performance bottleneck analysis' },
          { value: 'SEO issues & keyword opportunities' },
          { value: 'Conversion barrier identification' },
          { value: 'Security vulnerability check' },
          { value: 'Mobile experience assessment' },
          { value: 'Detailed action plan — no obligation' }
        ]
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'blog',
      props: {
        eyebrow: 'Knowledge Base',
        headline: 'Latest Insights & Tutorials',
        ctaLabel: 'All Articles',
        ctaHref: '/blog',
        limit: 3
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'faq',
      props: {
        eyebrow: 'FAQ',
        headline: 'Frequently Asked Questions',
        subheadline: "Can't find what you're looking for? We're here to help.",
        ctaLabel: 'Ask Us Anything',
        ctaHref: '/contact',
        items: [
          { q: 'How long does a WordPress website take?', a: 'Most WordPress websites are completed within 2-4 weeks, depending on complexity and requirements. Complex projects may take 4-6 weeks.' },
          { q: 'What is included in your maintenance plans?', a: 'Our maintenance plans include regular updates, security monitoring, performance optimization, backup management, and priority support. Plans start at $79/month.' },
          { q: 'Do you offer a money-back guarantee?', a: "Yes. We offer a 30-day money-back guarantee on all our development projects. If you're not satisfied, we'll refund you in full." },
          { q: 'Can you work with my existing WordPress site?', a: 'Absolutely. We work with existing WordPress sites for redesigns, migrations, speed optimization, security fixes, and feature additions.' },
          { q: 'Do you offer ongoing support after launch?', a: 'Yes. Every project includes 30 days of free post-launch support. After that, we offer flexible monthly maintenance plans starting at $79/month.' },
          { q: 'Can you migrate my existing store to Shopify or WooCommerce?', a: 'Yes! We provide complete migration services from all major e-commerce platforms including Shopify, WooCommerce, Magento, BigCommerce, and custom solutions.' }
        ]
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'contact',
      props: {
        eyebrow: 'Get In Touch',
        headline: 'Ready to Transform Your Online Presence?',
        guarantee: 'We respond to all inquiries within 2 hours during business days.',
        email: 'info@ariosetech.com',
        emailDesc: 'Get detailed proposals and project discussions',
        phone: '+92 300 9484 739',
        phoneDesc: 'Instant consultation and quick questions',
        address: '95 College Road, Block E Block D PCSIR Staff Colony, Lahore, 54770',
        addressDesc: ''
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'cta',
      props: {
        eyebrow: 'Get Started Today',
        headline: 'Start Your Success Story Today',
        subheadline: 'Join 100+ successful businesses that chose ARIOSETECH for their web development needs. Professional results, affordable pricing, and ongoing support.',
        ctaPrimaryLabel: 'Schedule Free Consultation',
        ctaPrimaryHref: '/contact',
        ctaSecondaryLabel: 'Download Our Service Guide',
        ctaSecondaryHref: '/portfolio',
        tags: 'No Long-Term Contracts,30-Day Money-Back Guarantee,Free Post-Launch Support,Transparent Pricing'
      }
    }
  ];

  const r = await pagesCol.updateOne({ fullPath: '/' }, { $set: { 'layout.sections': sections, updatedAt: new Date() } })
  console.log('Update result:', r)
  await client.close()
}
run();`;
  fs.writeFileSync(files.updateMongo, content, 'utf8');
  console.log("✓ Updated update-mongo script successfully.");
}

// 9. scripts/seed-seo-page.ts
if (fs.existsSync(files.seedSeoPage)) {
  const content = `import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'

const envPath = '.env.local'
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  content.split('\\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) process.env[match[1]] = match[2].trim()
  })
}

async function run() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('No URI')
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(process.env.MONGODB_DB)
  const pagesCol = db.collection('pages')

  const sections = [
    {
      id: new ObjectId().toHexString(),
      type: 'hero-interactive',
      props: {
        eyebrow: 'SEO Services for Growing Brands',
        headline: 'SEO Services That Help\\nYour Business Get Found',
        subheadline: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance.',
        desc: 'From technical fixes to local SEO and content strategy, we build a stronger search presence that supports real business growth.',
        ctaPrimaryLabel: 'Book a Free SEO Consultation',
        ctaPrimaryHref: '/contact',
        ctaSecondaryLabel: 'Get a Website Audit',
        ctaSecondaryHref: '/contact',
        trust: 'Website SEO \\u2022 Local SEO \\u2022 Technical SEO \\u2022 SEO Content',
        codeFilename: 'seo-analysis / ranking.ts',
        codeLines: [
          [{ t: 'com', v: '// Executing technical SEO audit' }],
          [],
          [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_rankings' }, { t: 'v', v: '() {' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'audit' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'run_technical_audit' }, { t: 'v', v: '();' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'audit' }, { t: 'v', v: '.' }, { t: 'attr', v: 'core_web_vitals' }, { t: 'v', v: ' === ' }, { t: 'str', v: "'poor'" }, { t: 'v', v: ') {' }],
          [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'optimize_performance' }, { t: 'v', v: '();' }],
          [{ t: 'v', v: '  }' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\\u2713 Rankings Improved'" }, { t: 'v', v: ';' }],
          [{ t: 'v', v: '}' }]
        ]
      }
    },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'SEO That Supports Real Growth',
          body: 'Ranking on Google is not just about adding keywords to a page. Strong SEO comes from the right structure, better content, technical health, internal linking, local relevance, and a website that actually deserves to rank.\\n\\nAt Ariosetech, we take a business-first approach to SEO. That means we do not chase vanity traffic or empty rankings. We focus on the type of visibility that helps your brand attract the right audience, bring in qualified traffic, and create more opportunities for leads and sales.\\n\\nWhether you run a local business, a service-based company, or an eCommerce brand, we build SEO strategies around your goals, website condition, and growth stage.',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'Why SEO Still Matters',
          body: 'Search is still one of the strongest channels for long-term digital growth. When your business ranks for the right searches, you build visibility, trust, and steady traffic without relying only on paid ads.\\n\\nA strong SEO setup helps your business:\\n* Show up when customers are actively searching\\n* Build trust through better visibility\\n* Attract more qualified traffic\\n* Improve lead generation over time\\n* Support long-term growth with compounding results\\n\\nGood SEO does not just help you rank. It helps your business become easier to find, trust, and choose.',
          align: 'left'
        }
      },
    {
      id: new ObjectId().toHexString(),
      type: 'services-accordion',
      props: {
        eyebrow: 'Our Services',
        headline: 'Our SEO Services',
        intro: 'We offer focused SEO solutions built to improve search visibility, site performance, and growth potential.',
        items: ${JSON.stringify(SEO_SERVICES_ITEMS, null, 2)}
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'whyus',
      props: {
        eyebrow: 'Why Us',
        headline: 'Why Businesses Choose Ariosetech for SEO',
        items: [
          { icon: '🎯', title: 'Business-First SEO', subhead: 'Focus on Real Outcomes', desc: 'We focus on visibility that supports real business outcomes, not just traffic numbers.' },
          { icon: '⚙️', title: 'Development & SEO in Sync', subhead: 'Built for Performance', desc: 'Because our team works across websites, structure, and performance, we can align SEO with how your site is actually built.' },
          { icon: '✅', title: 'Clean Execution', subhead: 'Practical & Effective', desc: 'We focus on the changes that make the biggest impact without creating confusion or unnecessary complexity.' },
          { icon: '📈', title: 'Long-Term Growth', subhead: 'Sustainable Results', desc: 'We build SEO in a way that supports stronger performance over time, not just short-term spikes.' },
          { icon: '🏪', title: 'Support for Different Business Types', subhead: 'Diverse Industry Help', desc: 'We work with service businesses, local brands, and eCommerce companies that need stronger digital visibility.' }
        ]
      }
    },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'Common SEO Problems We Help Fix',
          body: 'Many businesses come to us with the same core issues. Their website is live, but growth is slow and search visibility is weak.\\n\\n* Your website is not ranking for important keywords\\n* You are getting traffic, but not qualified leads\\n* Your service pages are weak or under-optimized\\n* Your website has technical SEO issues\\n* Your local business is not showing in local search results\\n* Your content lacks structure or depth\\n* Your pages are not connected properly through internal links\\n* Your competitors are outranking you consistently\\n\\nIf your website is not pulling its weight in search, the issue is usually deeper than one missing keyword.',
          align: 'left'
        }
      },
    {
      id: new ObjectId().toHexString(),
      type: 'process',
      props: {
        eyebrow: 'How We Work',
        headline: 'Our SEO Process',
        steps: [
          { n: '01', title: 'Audit', sub: '', desc: 'We review your website, search presence, content, and technical condition to understand what is holding performance back.' },
          { n: '02', title: 'Strategy', sub: '', desc: 'We build an SEO plan based on your business model, audience, goals, and search opportunities.' },
          { n: '03', title: 'Optimization', sub: '', desc: 'We improve your pages, structure, technical setup, content targeting, and internal SEO foundation.' },
          { n: '04', title: 'Content and Growth Support', sub: '', desc: 'Where needed, we build supporting content, improve weak pages, and strengthen site-wide relevance.' },
          { n: '05', title: 'Ongoing Improvement', sub: '', desc: 'SEO is not static. We continue refining based on performance, search trends, and growth priorities.' }
        ]
      }
    },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'Who Our SEO Services Are For',
          body: 'Our SEO services are designed for businesses that want more than surface-level optimization. We work best with brands that want a stronger digital foundation and are ready to improve visibility with the right strategy.\\n\\nIdeal Fit List:\\n* Local service businesses\\n* Agencies and consultants\\n* eCommerce brands\\n* Startups and growing companies\\n* Businesses with underperforming websites\\n* Brands needing technical SEO and content support',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'What Better SEO Can Do for Your Business',
          body: 'A stronger SEO setup can improve much more than rankings alone. With the right structure and strategy in place, your website becomes easier to discover, easier to trust, and better positioned to convert.\\n\\n* Stronger search visibility\\n* Better keyword reach\\n* Improved local presence\\n* More qualified traffic\\n* Better lead potential\\n* Stronger content foundation\\n* Healthier website structure',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'SEO Works Better When Your Website Is Built Right',
          body: 'One of the biggest SEO problems businesses face is trying to grow search traffic on top of a weak website foundation. Poor structure, slow speed, weak UX, and disconnected content can limit results no matter how many keywords you target.\\n\\nBecause Ariosetech works across web development, Shopify, WordPress, SEO, and automation, we can improve SEO with a broader understanding of how digital performance actually works.\\n\\nSEO is stronger when the website behind it is built to support growth.',
          align: 'left'
        }
      },
    {
      id: new ObjectId().toHexString(),
      type: 'audit',
      props: {
        eyebrow: 'Get Started',
        headline: 'Ready to Improve Your Search Visibility?',
        subhead: 'Get a free SEO audit',
        desc: 'Discover exactly what is holding your site back from ranking #1 with our comprehensive SEO and performance audit.',
        ctaLabel: 'Book a Free SEO Consultation',
        ctaHref: '/contact',
        guarantee: 'Tell us where your website stands, and we\\'ll help you map the next move.'
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'faq',
      props: {
        eyebrow: 'SEO FAQ',
        headline: 'Frequently Asked Questions About SEO',
        items: ${JSON.stringify(FAQS_SEO, null, 2)}
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'cta',
      props: {
        eyebrow: 'Ready to grow your business online?',
        headline: 'Start Your SEO Journey Today',
        desc: 'Join 100+ successful businesses. Professional results, transparent reporting, and long-term growth.',
        ctaLabel: 'Book a Free SEO Consultation',
        ctaHref: '/contact',
        secondaryLabel: 'Get a Website Audit',
        secondaryHref: '/contact',
        trust: 'No Long-Term Contracts,Transparent Monthly Reporting,White-Hat Techniques'
      }
    }
  ]

  const r = await pagesCol.updateOne(
    { fullPath: '/services/seo' }, 
    { 
      $set: { 
        title: 'SEO Services',
        status: 'published',
        'layout.sections': sections, 
        updatedAt: new Date(),
        seo: {
          title: 'SEO Services | Website, Local & Technical SEO | Ariosetech',
          description: 'Ariosetech offers website SEO, local SEO, technical SEO, and SEO content services to help businesses improve rankings, traffic, and leads.'
        }
      } 
    },
    { upsert: true }
  )
  console.log('Update result for SEO Page:', r)
  await client.close()
}
run();`;
  fs.writeFileSync(files.seedSeoPage, content, 'utf8');
  console.log("✓ Updated seed-seo-page script successfully.");
}

// 10. scripts/seed-services.ts
if (fs.existsSync(files.seedServices)) {
  // Let's replace the whole shopifyData, wordpressData, woocommerceData objects
  let content = fs.readFileSync(files.seedServices, 'utf8');
  
  // We can rebuild seed-services.ts from scratch as it has clear data structures
  const newSeedServices = `import { MongoClient } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\\n').forEach(line => {
    const match = line.match(/^([^#\\s][^=]+)=(.*)$/)
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
    desc: 'From startup stores to enterprise Shopify Plus platforms, we create e-commerce experiences that drive results. We\\'ve helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.',
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
  services: ${JSON.stringify(SHOPIFY_SERVICES_ITEMS, null, 2)},
  whyUs: [
    { icon: '🏆', title: 'Shopify Partner Excellence', desc: 'Official Shopify Partners with proven expertise in building successful e-commerce stores across various industries.' },
    { icon: '💰', title: 'Conversion-Focused Approach', desc: 'Every store we build is optimized for sales with proven conversion tactics and user experience best practices.' },
    { icon: '🚀', title: 'Shopify Plus Certified', desc: 'Specialized expertise in enterprise-level Shopify Plus implementations for high-growth businesses.' },
    { icon: '📱', title: 'Mobile-Commerce Experts', desc: 'Deep understanding of mobile shopping behaviors ensures your store performs perfectly on all devices.' },
    { icon: '🔧', title: 'Ongoing Partnership', desc: "We\\'re your long-term Shopify growth partner, supporting your business at every stage of expansion." },
    { icon: '⚡', title: 'Performance Obsessed', desc: 'Every Shopify store we develop loads fast and ranks well in search engines.' }
  ],
  process: ${JSON.stringify(SHOPIFY_PROCESS_STEPS, null, 2)},
  portfolio: [
    { name: 'WYOX Sports', industry: 'Sports Equipment (USA)', challenge: 'Complex product variations and US market requirements', solution: 'Custom Shopify store with advanced filtering and checkout optimization', result: '250%', resultLabel: 'increase in online sales' },
    { name: 'Genovie', industry: 'Fashion & Lifestyle', challenge: 'High-end brand representation with seamless UX', solution: 'Custom Shopify Plus store with advanced personalization', result: '180%', resultLabel: 'increase in average order value' },
    { name: 'Janya.pk', industry: 'Wholesale Fashion', challenge: 'B2B wholesale functionality with complex pricing', solution: 'Shopify Plus with custom wholesale portal integration', result: '300%', resultLabel: 'increase in wholesale orders' }
  ],
  faqs: ${JSON.stringify(FAQS_SHOPIFY, null, 2)},
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
  services: ${JSON.stringify(WP_SERVICES_ITEMS, null, 2)},
  whyUs: [
    { icon: '🏆', title: '7+ Years WordPress Expertise', desc: 'We\\'ve been perfecting WordPress development since 2017, delivering 50+ successful WordPress projects across various industries.' },
    { icon: '⚡', title: 'Performance-First Approach', desc: 'Every WordPress site we build is optimized for speed, security, and search engines from day one.' },
    { icon: '🔒', title: 'Security-Focused Development', desc: 'We implement enterprise-grade security measures to protect your WordPress site from threats.' },
    { icon: '📱', title: 'Mobile-First Design', desc: 'All our WordPress sites are built with mobile users in mind, ensuring perfect performance across all devices.' },
    { icon: '🔧', title: 'Ongoing Support', desc: "We don\\'t just build and leave. Our team provides continuous support to ensure your WordPress site thrives." },
    { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden costs or surprise fees. Our WordPress development pricing is upfront and honest.' }
  ],
  process: ${JSON.stringify(WP_PROCESS_STEPS, null, 2)},
  portfolio: [
    { name: 'Corporate Website', industry: 'Professional Services', challenge: 'Modern design with complex functionality', solution: 'Custom WordPress theme with advanced features', result: '200%', resultLabel: 'increase in lead generation' },
    { name: 'E-commerce Integration', industry: 'Retail', challenge: 'WordPress with e-commerce functionality', solution: 'WooCommerce integration with custom features', result: '150%', resultLabel: 'increase in online sales' },
    { name: 'Multilingual Site', industry: 'International Business', challenge: '5-language website with complex navigation', solution: 'WPML-powered multilingual WordPress site', result: '300%', resultLabel: 'increase in international inquiries' }
  ],
  faqs: ${JSON.stringify(FAQS_WP, null, 2)},
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
  services: ${JSON.stringify(WC_SERVICES_ITEMS, null, 2)},
  whyUs: [
    { icon: '🏆', title: 'WordPress + WooCommerce Expertise', desc: 'Deep understanding of both WordPress and WooCommerce ensures seamless integration and optimal performance for your online store.' },
    { icon: '🛒', title: 'E-commerce Focus', desc: 'Specialized in e-commerce development with proven strategies for increasing conversions, average order value, and customer retention.' },
    { icon: '🎨', title: 'Custom Solutions', desc: 'Every WooCommerce store we build is uniquely tailored to your business needs, brand identity, and growth objectives.' },
    { icon: '⚡', title: 'Performance Obsessed', desc: 'We optimize every aspect of your store for speed, ensuring fast loading times that keep customers engaged and improve search rankings.' },
    { icon: '🔒', title: 'Security First', desc: 'Enterprise-grade security measures protect your store and customer data from threats, ensuring trust and compliance.' },
    { icon: '📈', title: 'Growth Partnership', desc: 'We don\\'t just build stores; we create growth-focused solutions that scale with your business and support long-term success.' }
  ],
  process: ${JSON.stringify(WC_PROCESS_STEPS, null, 2)},
  portfolio: [
    { name: 'The Kapra', industry: 'Fashion E-commerce', challenge: 'Complex inventory management and custom features', solution: 'Custom WooCommerce with advanced product variations', result: '300%', resultLabel: 'increase in online sales' },
    { name: 'Dr. Scents International', industry: 'Perfume & Cosmetics', challenge: '32 different country-specific websites', solution: 'Multi-site WooCommerce with localization', result: 'Launched in 32 countries', resultLabel: 'under 4 months' },
    { name: 'GeoMag World', industry: 'Educational Toys', challenge: 'Complex product catalog with learning resources', solution: 'WooCommerce with custom product configurator', result: '200%', resultLabel: 'increase in average order value' }
  ],
  faqs: ${JSON.stringify(FAQS_WC, null, 2)},
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
    startingPrice: 'Website SEO \\u2022 Local SEO \\u2022 Technical SEO \\u2022 SEO Content'
  },
  services: ${JSON.stringify(SEO_SERVICES_ITEMS, null, 2)},
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
  faqs: ${JSON.stringify(FAQS_SEO, null, 2)},
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
      console.log(\`- \${page.slug}: \${result.upsertedId ? 'Created' : 'Updated'}\`)
    }
    console.log('Services seeded successfully!')
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await client.close()
  }
}
seedServices();`;

  fs.writeFileSync(files.seedServices, newSeedServices, 'utf8');
  console.log("✓ Updated seed-services script successfully.");
}

// 11. app/api/seed/route.ts
if (fs.existsSync(files.seedRoute)) {
  // Let's rewrite seed/route.ts to use only registered components, mapping the layouts cleanly.
  // We can load seed-wordpress route structure, seed-shopify structure, seed-woocommerce structure, seed-seo structure, and homeLayout structure.
  
  const newSeedRoute = `import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { hashPassword } from '@/lib/auth'
import { ObjectId } from 'mongodb'

let counter = 1
function sec(type: string, props: Record<string, unknown> = {}) {
  return { id: \`sec_seed_\${counter++}\`, type, props, styles: {}, meta: { locked: false, hidden: false } }
}

const SEO_D = { title: '', description: '', keywords: [], canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', twitterTitle: '', twitterDescription: '', twitterImage: '', robots: { index: true, follow: true } }
const PD = { parentId: null, schema: null, relatedPages: [], relatedBlogs: [], slugHistory: [], createdAt: new Date(), updatedAt: new Date() }

const TRUST = '✓ 7+ Years of Excellence,✓ 100+ Successful Projects,✓ 24/7 Expert Support,✓ 30-Day Money-Back Guarantee'
const CTA_TRUST = '✓ No Long-Term Contracts,✓ 30-Day Money-Back Guarantee,✓ Free Post-Launch Support,✓ Transparent Pricing'

const WHY_ITEMS = ${JSON.stringify(WHY_ITEMS, null, 2)}
const PORTFOLIO_ITEMS = ${JSON.stringify(PORTFOLIO_ITEMS, null, 2)}
const TESTIMONIALS = ${JSON.stringify(TESTIMONIALS, null, 2)}
const PROCESS_STEPS = ${JSON.stringify(PROCESS_STEPS, null, 2)}
const WP_PROCESS_STEPS = ${JSON.stringify(WP_PROCESS_STEPS, null, 2)}
const SHOPIFY_PROCESS_STEPS = ${JSON.stringify(SHOPIFY_PROCESS_STEPS, null, 2)}
const WC_PROCESS_STEPS = ${JSON.stringify(WC_PROCESS_STEPS, null, 2)}
const FAQS_WP = ${JSON.stringify(FAQS_WP, null, 2)}
const FAQS_SHOPIFY = ${JSON.stringify(FAQS_SHOPIFY, null, 2)}
const FAQS_WC = ${JSON.stringify(FAQS_WC, null, 2)}
const HOW_IT_WORKS = ${JSON.stringify(HOW_IT_WORKS, null, 2)}

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
  sec('contact', { eyebrow: 'Get In Touch', headline: 'Ready to Transform Your Online Presence?', guarantee: 'We respond to all inquiries within 2 hours during business days.', email: 'info@ariosetech.com', emailDesc: 'Get detailed proposals and project discussions', phone: '+92 300 9484 739', phoneDesc: 'Instant consultation and quick questions', address: '95 College Road, Block E Block D PCSIR Staff Colony, Lahore, 54770', addressDesc: '' }),
  sec('cta', { eyebrow: 'Get Started Today', headline: 'Start Your Success Story Today', subheadline: 'Join 100+ successful businesses that chose ARIOSETECH for their web development needs. Professional results, affordable pricing, and ongoing support.', ctaPrimaryLabel: 'Schedule Free Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'Download Our Service Guide', ctaSecondaryHref: '/portfolio', tags: 'No Long-Term Contracts,30-Day Money-Back Guarantee,Free Post-Launch Support,Transparent Pricing' }),
]}

const wordpressLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'WordPress Services', headline: 'Professional WordPress\\nDevelopment Services', subheadline: 'Display Your Business Online with a WordPress Website', desc: 'From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability.', ctaPrimaryLabel: 'Get Free WordPress Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View WordPress Portfolio', ctaSecondaryHref: '/portfolio', trust: 'Starting at $799,30-Day Money-Back Guarantee,Free Post-Launch Support', codeFilename: 'wp-core / security.ts', codeLines: [[{ t: 'com', v: '// Executing WordPress security hardening' }], [], [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'secure_site' }, { t: 'v', v: '() {' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'scan' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'run_malware_scan' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'scan' }, { t: 'v', v: '.' }, { t: 'attr', v: 'vulnerabilities' }, { t: 'v', v: ' > ' }, { t: 'num', v: '0' }, { t: 'v', v: ') {' }], [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'patch_core_and_plugins' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  }' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\\u2713 Site Secured'" }, { t: 'v', v: ';' }], [{ t: 'v', v: '}' }]] }),
  sec('services-accordion', { eyebrow: 'Our Services', headline: 'Complete WordPress Solutions for Every Business Need', intro: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.', items: ${JSON.stringify(WP_SERVICES_ITEMS, null, 2)} }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why Choose ARIOSETECH for WordPress Development?', items: [
    { icon: '🏆', title: '7+ Years WordPress Expertise', subhead: 'Proven Track Record', desc: 'We\\'ve been perfecting WordPress development since 2017, delivering 50+ successful WordPress projects across various industries.' },
    { icon: '⚡', title: 'Performance-First Approach', subhead: 'Speed & SEO Optimized', desc: 'Every WordPress site we build is optimized for speed, security, and search engines from day one.' },
    { icon: '🔒', title: 'Security-Focused Development', subhead: 'Enterprise Hardening', desc: 'We implement enterprise-grade security measures to protect your WordPress site from threats.' },
    { icon: '📱', title: 'Mobile-First Design', subhead: 'Responsive Layouts', desc: 'All our WordPress sites are built with mobile users in mind, ensuring perfect performance across all devices.' },
    { icon: '🔧', title: 'Ongoing Support', subhead: 'Continuous Care', desc: 'We don\\'t just build and leave. Our team provides continuous support to ensure your WordPress site thrives.' },
    { icon: '💰', title: 'Transparent Pricing', subhead: 'No Hidden Costs', desc: 'No hidden costs or surprise fees. Our WordPress development pricing is upfront and honest.' }
  ]}),
  sec('process', { eyebrow: 'Our Process', headline: 'WordPress Development Process', items: WP_PROCESS_STEPS }),
  sec('portfolio', { eyebrow: 'Our Work', headline: 'WordPress Portfolio Highlights', intro: 'Discover how we\\'ve helped businesses grow with custom WordPress solutions.', ctaLabel: 'View Full WordPress Portfolio', ctaHref: '/portfolio', items: [{ title: 'Corporate Website', client: 'Professional Services', platform: 'Custom WordPress Theme', result: '200%', resultLabel: 'Increase in lead generation', quote: 'Custom WordPress theme with advanced features.', slug: 'portfolio' }, { title: 'E-commerce Integration', client: 'Retail', platform: 'WooCommerce Integration', result: '150%', resultLabel: 'Increase in online sales', quote: 'WooCommerce integration with custom features.', slug: 'portfolio' }, { title: 'Multilingual Site', client: 'International Business', platform: 'WPML Multilingual WordPress', result: '300%', resultLabel: 'Increase in international inquiries', quote: 'WPML-powered multilingual WordPress site.', slug: 'portfolio' }] }),
  sec('audit', { eyebrow: 'Get Started', headline: 'Ready to Start Your WordPress Project?', subhead: 'Get Your Free WordPress Consultation', desc: 'Discover what\\'s holding your site back. Get a 30-minute strategy session, WordPress recommendations, project timeline and pricing, and a no-obligation proposal.', ctaLabel: 'Book Free Consultation', ctaHref: '/contact', guarantee: '30-day money-back guarantee on all WordPress development services' }),
  sec('faq', { eyebrow: 'WordPress FAQ', headline: 'Frequently Asked Questions About WordPress', items: ${JSON.stringify(FAQS_WP, null, 2)} }),
  sec('cta', { eyebrow: 'Ready to grow your business online?', headline: 'Start Your WordPress Journey Today', desc: 'Join successful businesses maximizing their online presence. Professional results, transparent reporting, and long-term support.', ctaLabel: 'Schedule Free Consultation', ctaHref: '/contact', secondaryLabel: 'View Case Studies', secondaryHref: '/portfolio', trust: 'Starting at $799,30-Day Money-Back Guarantee,Free Post-Launch Support' })
]}

const shopifyLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'Shopify Services', headline: 'Professional Shopify\\nDevelopment Services', subheadline: 'Scale Your E-commerce Business with Expert Shopify Solutions', desc: 'From startup stores to enterprise Shopify Plus platforms, we create high-converting e-commerce experiences that drive sales. Trusted by 30+ Shopify businesses worldwide for exceptional design, functionality, and growth.', ctaPrimaryLabel: 'Get Free Shopify Store Audit', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View Shopify Portfolio', ctaSecondaryHref: '/portfolio', trust: 'Starting at $999,30-Day Money-Back Guarantee,Free Post-Launch Training', codeFilename: 'shopify-conversion / optimize.ts', codeLines: [[{ t: 'com', v: '// Executing Shopify conversion optimization' }], [], [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_store' }, { t: 'v', v: '() {' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'store' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'analyze_checkout' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'store' }, { t: 'v', v: '.' }, { t: 'attr', v: 'bounce_rate' }, { t: 'v', v: ' > ' }, { t: 'str', v: "'40%'" }, { t: 'v', v: ') {' }], [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'implement_fast_checkout' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  }' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\\u2713 Sales Increased'" }, { t: 'v', v: ';' }], [{ t: 'v', v: '}' }]] }),
  sec('services-accordion', { eyebrow: 'Our Services', headline: 'Complete Shopify Solutions for E-commerce Success', intro: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.', items: ${JSON.stringify(SHOPIFY_SERVICES_ITEMS, null, 2)} }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why Choose ARIOSETECH for Shopify Development?', items: [
    { icon: '🏆', title: 'Shopify Partner Excellence', subhead: 'Official Shopify Partners', desc: 'Official Shopify Partners with proven expertise in building successful e-commerce stores across various industries.' },
    { icon: '💰', title: 'Conversion-Focused Approach', subhead: 'Optimized for Sales', desc: 'Every store we build is optimized for sales with proven conversion tactics and user experience best practices.' },
    { icon: '🚀', title: 'Shopify Plus Certified', subhead: 'Enterprise Ready', desc: 'Specialized expertise in enterprise-level Shopify Plus implementations for high-growth businesses.' },
    { icon: '📱', title: 'Mobile-Commerce Experts', subhead: 'Responsive Everywhere', desc: 'Deep understanding of mobile shopping behaviors ensures your store performs perfectly on all devices.' },
    { icon: '🔧', title: 'Ongoing Partnership', subhead: 'Long-term Growth', desc: 'We\\'re your long-term Shopify growth partner, supporting your business at every stage of expansion.' },
    { icon: '⚡', title: 'Performance Obsessed', subhead: 'Fast & SEO Friendly', desc: 'Every Shopify store we develop loads fast and ranks well in search engines.' }
  ]}),
  sec('process', { eyebrow: 'How We Work', headline: 'Shopify Development Process', items: SHOPIFY_PROCESS_STEPS }),
  sec('portfolio', { eyebrow: 'Our Work', headline: 'Shopify Portfolio Highlights', intro: 'Discover how we\\'ve helped e-commerce brands scale with custom Shopify developments.', ctaLabel: 'View Full Shopify Portfolio', ctaHref: '/portfolio', items: [{ title: 'WYOX Sports', client: 'USA Sports Equipment', platform: 'Shopify + Custom Solutions', result: '250%', resultLabel: 'Business growth', quote: 'Professional, reliable, and always available when we need them.', slug: 'portfolio' }, { title: 'Genovie', client: 'Skincare Brand', platform: 'Shopify Plus Custom Store', result: '180%', resultLabel: 'AOV increase', quote: 'Incredible personalization and seamless user experience.', slug: 'portfolio' }, { title: 'Janya.pk', client: 'Wholesale Fashion', platform: 'Shopify Plus Wholesale', result: '300%', resultLabel: 'Increase in wholesale orders', quote: 'Smooth B2B integration and automated commission payments.', slug: 'portfolio' }] }),
  sec('audit', { eyebrow: 'Get Started', headline: 'Ready to Start Your Shopify Project?', subhead: 'Get Your Free Shopify Store Audit', desc: 'Discover what\\'s holding your store back. Get a complete store performance analysis, conversion rate recommendations, and a detailed project proposal.', ctaLabel: 'Get Free Store Audit', ctaHref: '/contact', guarantee: '30-day money-back guarantee | Free post-launch training | Ongoing support available' }),
  sec('faq', { eyebrow: 'Shopify FAQ', headline: 'Frequently Asked Questions About Shopify', items: ${JSON.stringify(FAQS_SHOPIFY, null, 2)} }),
  sec('cta', { eyebrow: 'Ready to grow?', headline: 'Start Your Shopify Journey Today', desc: 'Join successful brands scaling their online stores. Professional results, transparent reporting, and long-term partnership.', ctaLabel: 'Schedule Free Consultation', ctaHref: '/contact', secondaryLabel: 'View Case Studies', secondaryHref: '/portfolio', trust: 'Shopify Partner | 30-Day Money-Back Guarantee | Ongoing Support' })
]}

const woocommerceLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'WooCommerce Services', headline: 'Professional WooCommerce\\nDevelopment Services', subheadline: 'Build Powerful E-commerce Stores with WordPress & WooCommerce', desc: 'Transform your WordPress site into a powerful online store that drives sales. We create custom WooCommerce solutions that combine the flexibility of WordPress with robust e-commerce functionality. Trusted by 40+ businesses worldwide for exceptional performance and growth.', ctaPrimaryLabel: 'Get Free WooCommerce Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View WooCommerce Portfolio', ctaSecondaryHref: '/portfolio', trust: 'Starting at $1,299,30-Day Money-Back Guarantee,Free Post-Launch Training', codeFilename: 'woocommerce-scaling / optimize.ts', codeLines: [[{ t: 'com', v: '// Executing WooCommerce scaling optimization' }], [], [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_checkout' }, { t: 'v', v: '() {' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'store' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'analyze_performance' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'store' }, { t: 'v', v: '.' }, { t: 'attr', v: 'load_time' }, { t: 'v', v: ' > ' }, { t: 'str', v: "'2s'" }, { t: 'v', v: ') {' }], [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'implement_caching' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  }' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\\u2713 Performance Optimized'" }, { t: 'v', v: ';' }], [{ t: 'v', v: '}' }]] }),
  sec('services-accordion', { eyebrow: 'Our Services', headline: 'Complete WooCommerce Solutions for E-commerce Success', intro: 'Custom WooCommerce solutions with seamless payment integration and conversion optimization.', items: ${JSON.stringify(WC_SERVICES_ITEMS, null, 2)} }),
  sec('whyus', { eyebrow: 'Why Choose Us', headline: 'Why Choose ARIOSETECH for WooCommerce Development?', items: [
    { icon: '🏆', title: 'WordPress + WooCommerce Expertise', desc: 'Deep understanding of both WordPress and WooCommerce ensures seamless integration and optimal performance for your online store.' },
    { icon: '🛒', title: 'E-commerce Focus', desc: 'Specialized in e-commerce development with proven strategies for increasing conversions, average order value, and customer retention.' },
    { icon: '🎨', title: 'Custom Solutions', desc: 'Every WooCommerce store we build is uniquely tailored to your business needs, brand identity, and growth objectives.' },
    { icon: '⚡', title: 'Performance Obsessed', desc: 'We optimize every aspect of your store for speed, ensuring fast loading times that keep customers engaged and improve search rankings.' },
    { icon: '🔒', title: 'Security First', desc: 'Enterprise-grade security measures protect your store and customer data from threats, ensuring trust and compliance.' },
    { icon: '📈', title: 'Growth Partnership', desc: 'We don\\'t just build stores; we create growth-focused solutions that scale with your business and support long-term success.' }
  ]}),
  sec('process', { eyebrow: 'How We Work', headline: 'WooCommerce Development Process', items: WC_PROCESS_STEPS }),
  sec('portfolio', { eyebrow: 'Our Work', headline: 'WooCommerce Portfolio Highlights', intro: 'Discover how we\\'ve helped e-commerce brands scale with custom WooCommerce solutions.', ctaLabel: 'View Full WooCommerce Portfolio', ctaHref: '/portfolio', items: [{ title: 'The Kapra', client: 'Fashion Brand', platform: 'Custom WooCommerce', result: '300%', resultLabel: 'Revenue growth', quote: 'ARIOSETECH transformed our vision into reality with custom code solutions.', slug: 'portfolio' }, { title: 'Dr. Scents', client: 'Fragrance Brand', platform: 'Multi-site WooCommerce', result: '32', resultLabel: 'Countries launched', quote: 'Incredible speed and quality. They launched our international operation in 4 months.', slug: 'portfolio' }, { title: 'GeoMag World', client: 'Educational Toys', platform: 'Custom Catalog WooCommerce', result: '200%', resultLabel: 'AOV increase', quote: 'Managing our global catalog is now effortless.', slug: 'portfolio' }] }),
  sec('audit', { eyebrow: 'Get Started', headline: 'Ready to Start Your WooCommerce Project?', subhead: 'Get Your Free WooCommerce Store Consultation', desc: 'Discover what\\'s holding your store back. Get a complete e-commerce strategy session, platform analysis, project timeline, and a detailed proposal.', ctaLabel: 'Book Free Consultation', ctaHref: '/contact', guarantee: '30-day money-back guarantee | Free post-launch training | Ongoing support available' }),
  sec('faq', { eyebrow: 'WooCommerce FAQ', headline: 'Frequently Asked Questions About WooCommerce', items: ${JSON.stringify(FAQS_WC, null, 2)} }),
  sec('cta', { eyebrow: 'Ready to Launch?', headline: 'Start Your WooCommerce Journey Today', desc: 'Join successful brands scaling their online stores. Professional results, transparent reporting, and long-term partnership.', ctaLabel: 'Schedule Free Consultation', ctaHref: '/contact', secondaryLabel: 'View Case Studies', secondaryHref: '/portfolio', trust: 'Starting at $1,299 | 30-Day Money-Back Guarantee | Ongoing Support' })
]}

const seoLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'SEO Services for Growing Brands', headline: 'SEO Services That Help\\nYour Business Get Found', subheadline: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance.', desc: 'From technical fixes to local SEO and content strategy, we build a stronger search presence that supports real business growth.', ctaPrimaryLabel: 'Book a Free SEO Consultation', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'Get a Website Audit', ctaSecondaryHref: '/contact', trust: 'Website SEO \\u2022 Local SEO \\u2022 Technical SEO \\u2022 SEO Content', codeFilename: 'seo-analysis / ranking.ts', codeLines: [[{ t: 'com', v: '// Executing technical SEO audit' }], [], [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_rankings' }, { t: 'v', v: '() {' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'audit' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'run_technical_audit' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'audit' }, { t: 'v', v: '.' }, { t: 'attr', v: 'core_web_vitals' }, { t: 'v', v: ' === ' }, { t: 'str', v: "'poor'" }, { t: 'v', v: ') {' }], [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'optimize_performance' }, { t: 'v', v: '();' }], [{ t: 'v', v: '  }' }], [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\\u2713 Rankings Improved'" }, { t: 'v', v: ';' }], [{ t: 'v', v: '}' }]] }),
  sec('heading', {
    eyebrow: '',
    headline: 'SEO That Supports Real Growth',
    body: 'Ranking on Google is not just about adding keywords to a page. Strong SEO comes from the right structure, better content, technical health, internal linking, local relevance, and a website that actually deserves to rank.\\n\\nAt Ariosetech, we take a business-first approach to SEO. That means we do not chase vanity traffic or empty rankings. We focus on the type of visibility that helps your brand attract the right audience, bring in qualified traffic, and create more opportunities for leads and sales.\\n\\nWhether you run a local business, a service-based company, or an eCommerce brand, we build SEO strategies around your goals, website condition, and growth stage.',
    align: 'left'
  }),
  sec('heading', {
    eyebrow: '',
    headline: 'Why SEO Still Matters',
    body: 'Search is still one of the strongest channels for long-term digital growth. When your business ranks for the right searches, you build visibility, trust, and steady traffic without relying only on paid ads.\\n\\nA strong SEO setup helps your business:\\n* Show up when customers are actively searching\\n* Build trust through better visibility\\n* Attract more qualified traffic\\n* Improve lead generation over time\\n* Support long-term growth with compounding results\\n\\nGood SEO does not just help you rank. It helps your business become easier to find, trust, and choose.',
    align: 'left'
  }),
  sec('services-accordion', { eyebrow: 'Our Services', headline: 'Our SEO Services', intro: 'We offer focused SEO solutions built to improve search visibility, site performance, and growth potential.', items: ${JSON.stringify(SEO_SERVICES_ITEMS, null, 2)} }),
  sec('whyus', { eyebrow: 'Why Us', headline: 'Why Businesses Choose Ariosetech for SEO', items: [
    { icon: '🎯', title: 'Business-First SEO', desc: 'We focus on visibility that supports real business outcomes, not just traffic numbers.' },
    { icon: '⚙️', title: 'Development & SEO in Sync', desc: 'Because our team works across websites, structure, and performance, we can align SEO with how your site is actually built.' },
    { icon: '✅', title: 'Clean, Practical Execution', desc: 'We focus on the changes that make the biggest impact without creating confusion or unnecessary complexity.' },
    { icon: '📈', title: 'Long-Term Growth Thinking', desc: 'We build SEO in a way that supports stronger performance over time, not just short-term spikes.' },
    { icon: '🏪', title: 'Support for Different Business Types', desc: 'We work with service businesses, local brands, and eCommerce companies that need stronger digital visibility.' }
  ]}),
  sec('heading', {
    eyebrow: '',
    headline: 'Common SEO Problems We Help Fix',
    body: 'Many businesses come to us with the same core issues. Their website is live, but growth is slow and search visibility is weak.\\n\\n* Your website is not ranking for important keywords\\n* You are getting traffic, but not qualified leads\\n* Your service pages are weak or under-optimized\\n* Your website has technical SEO issues\\n* Your local business is not showing in local search results\\n* Your content lacks structure or depth\\n* Your pages are not connected properly through internal links\\n* Your competitors are outranking you consistently\\n\\nIf your website is not pulling its weight in search, the issue is usually deeper than one missing keyword.',
    align: 'left'
  }),
  sec('process', { eyebrow: 'How We Work', headline: 'Our SEO Process', steps: [
    { n: '01', title: 'Audit', sub: '', desc: 'We review your website, search presence, content, and technical condition to understand what is holding performance back.' },
    { n: '02', title: 'Strategy', sub: '', desc: 'We build an SEO plan based on your business model, audience, goals, and search opportunities.' },
    { n: '03', title: 'Optimization', sub: '', desc: 'We improve your pages, structure, technical setup, content targeting, and internal SEO foundation.' },
    { n: '04', title: 'Content and Growth Support', sub: '', desc: 'Where needed, we build supporting content, improve weak pages, and strengthen site-wide relevance.' },
    { n: '05', title: 'Ongoing Improvement', sub: '', desc: 'SEO is not static. We continue refining based on performance, search trends, and growth priorities.' }
  ]}),
  sec('heading', {
    eyebrow: '',
    headline: 'Who Our SEO Services Are For',
    body: 'Our SEO services are designed for businesses that want more than surface-level optimization. We work best with brands that want a stronger digital foundation and are ready to improve visibility with the right strategy.\\n\\nIdeal Fit List:\\n* Local service businesses\\n* Agencies and consultants\\n* eCommerce brands\\n* Startups and growing companies\\n* Businesses with underperforming websites\\n* Brands needing technical SEO and content support',
    align: 'left'
  }),
  sec('heading', {
    eyebrow: '',
    headline: 'What Better SEO Can Do for Your Business',
    body: 'A stronger SEO setup can improve much more than rankings alone. With the right structure and strategy in place, your website becomes easier to discover, easier to trust, and better positioned to convert.\\n\\n* Stronger search visibility\\n* Better keyword reach\\n* Improved local presence\\n* More qualified traffic\\n* Better lead potential\\n* Stronger content foundation\\n* Healthier website structure',
    align: 'left'
  }),
  sec('heading', {
    eyebrow: '',
    headline: 'SEO Works Better When Your Website Is Built Right',
    body: 'One of the biggest SEO problems businesses face is trying to grow search traffic on top of a weak website foundation. Poor structure, slow speed, weak UX, and disconnected content can limit results no matter how many keywords you target.\\n\\nBecause Ariosetech works across web development, Shopify, WordPress, SEO, and automation, we can improve SEO with a broader understanding of how digital performance actually works.\\n\\nSEO is stronger when the website behind it is built to support growth.',
    align: 'left'
  }),
  sec('audit', { eyebrow: 'Get Started', headline: 'Ready to Improve Your Search Visibility?', subhead: 'Get a free SEO audit', desc: 'Discover exactly what is holding your site back from ranking #1 with our comprehensive SEO and performance audit.', ctaLabel: 'Book a Free SEO Consultation', ctaHref: '/contact', guarantee: 'Tell us where your website stands, and we\\'ll help you map the next move.' }),
  sec('faq', { eyebrow: 'SEO FAQ', headline: 'Frequently Asked Questions About SEO', items: ${JSON.stringify(FAQS_SEO, null, 2)} }),
  sec('cta', { eyebrow: 'Ready to grow your business online?', headline: 'Start Your SEO Journey Today', desc: 'Join 100+ successful businesses. Professional results, transparent reporting, and long-term growth.', ctaLabel: 'Book a Free SEO Consultation', ctaHref: '/contact', secondaryLabel: 'Get a Website Audit', secondaryHref: '/contact', trust: 'No Long-Term Contracts,Transparent Monthly Reporting,White-Hat Techniques' })
]}

const aboutLayout = { sections: [
  sec('hero-interactive', { eyebrow: 'About Us', headline: 'Specialists, Not Generalists. Consider It Solved.', subheadline: 'ARIOSETECH was founded with one mission: give growing businesses access to the same quality of web development that enterprise brands enjoy — at honest, transparent prices.', desc: 'Based in Lahore, Pakistan. Serving clients in the USA, UAE, Switzerland, UK, Australia, and beyond.', ctaPrimaryLabel: 'Work With Us', ctaPrimaryHref: '/contact', ctaSecondaryLabel: 'View Our Work', ctaSecondaryHref: '/portfolio', trust: '100+ Projects Delivered,7+ Years Experience,40+ Industries Served,5.0\\u2605 Clutch Rating' }),
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
  sec('cta', { eyebrow: 'Ready?', headline: 'Let\\'s Build Your Success Story', desc: 'Join 100+ businesses that chose ARIOSETECH for their web development needs.', trust: CTA_TRUST, ctaLabel: 'Start a Project', ctaHref: '/contact', secondaryLabel: 'View All Services', secondaryHref: '/services/wordpress' })
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
    services: ${JSON.stringify(WP_SERVICES_ITEMS, null, 2)},
    whyUs: WHY_ITEMS,
    process: WP_PROCESS_STEPS,
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
    services: ${JSON.stringify(SHOPIFY_SERVICES_ITEMS, null, 2)},
    whyUs: WHY_ITEMS,
    process: SHOPIFY_PROCESS_STEPS,
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
    services: ${JSON.stringify(WC_SERVICES_ITEMS, null, 2)},
    whyUs: WHY_ITEMS,
    process: WC_PROCESS_STEPS,
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
}`;
  fs.writeFileSync(files.seedRoute, newSeedRoute, 'utf8');
  console.log("✓ Updated main seed route successfully.");
}

console.log("All copy updates written. Please run the seeding scripts to apply changes to MongoDB.");
