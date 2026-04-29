import { registerSection, getSection } from '@/lib/builder/registry'

// ── All section components ────────────────────────────────────────
import HeroSection from './HeroSection'
import ServicesSection from './ServicesSection'
import WhyUsSection from './WhyUsSection'
import PortfolioSection from './PortfolioSection'
import TestimonialsSection from './TestimonialsSection'
import ProcessSection from './ProcessSection'
import StatsSection from './StatsSection'
import CtaSection from './CtaSection'
import AuditSection from './AuditSection'
import HeadingSection from './HeadingSection'
import TextSection from './TextSection'
import ContactSection from './ContactSection'
import FaqSection from './FaqSection'
import LogosMarqueeSection from './LogosMarqueeSection'
import ImpactSection from './ImpactSection'
import HowItWorksSection from './HowItWorksSection'
import BlogSection from './BlogSection'
import ApproachSection from './ApproachSection'

export function initRegistry() {
  if (getSection('hero')) return  // already registered

  // ── HERO ──────────────────────────────────────────────────────
  registerSection({
    type: 'hero', label: 'Hero Banner', category: 'Sections', icon: '🚀',
    component: HeroSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Available for new projects',
      headline: 'Professional WordPress, Shopify & WooCommerce Development Since 2017',
      subheadline: "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.",
      supportingText: 'Trusted by businesses in the USA, UAE, and Switzerland for affordable, high-quality web development that delivers real ROI.',
      ctaPrimaryLabel: 'Get Free Quote & Strategy Call',
      ctaPrimaryHref: '/contact',
      ctaSecondaryLabel: 'View Our Portfolio',
      ctaSecondaryHref: '/portfolio',
      trust: '7+ Years of Excellence,100+ Successful Projects,24/7 Expert Support,30-Day Money-Back Guarantee',
    },
    schema: [
      { type: 'text',     name: 'eyebrow',          label: 'Eyebrow badge' },
      { type: 'text',     name: 'headline',          label: 'Main headline' },
      { type: 'textarea', name: 'subheadline',       label: 'Subheadline' },
      { type: 'textarea', name: 'supportingText',    label: 'Supporting text' },
      { type: 'text',     name: 'ctaPrimaryLabel',   label: 'Primary CTA label' },
      { type: 'text',     name: 'ctaPrimaryHref',    label: 'Primary CTA URL' },
      { type: 'text',     name: 'ctaSecondaryLabel', label: 'Secondary CTA label' },
      { type: 'text',     name: 'ctaSecondaryHref',  label: 'Secondary CTA URL' },
      { type: 'textarea', name: 'trust',             label: 'Trust indicators (comma separated)' },
      { type: 'repeater',  name: 'stats',             label: 'Stats (value + label)' },
    ],
  })

  // ── SERVICES ──────────────────────────────────────────────────
  registerSection({
    type: 'services', label: 'Services Grid', category: 'Sections', icon: '⚙️',
    component: ServicesSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'What We Offer',
      headline: 'Comprehensive Web Development Solutions for Your Business Growth',
      items: [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>', title: 'WordPress Development', headline: 'Build Powerful, Scalable Websites', desc: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.', features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services', price: '$799', href: '/services/wordpress' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>', title: 'WooCommerce Development', headline: 'Launch Your Dream E-commerce Store', desc: 'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.', features: 'Store Setup & Customization,Payment Gateway Integration,Multi-vendor Solutions,Performance Optimization', price: '$1,299', href: '/services/woocommerce' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', title: 'Shopify Development', headline: 'Scale Your Business with Shopify', desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.', features: 'Custom Store Development,Shopify Plus Solutions,App Integration,Conversion Optimization', price: '$999', href: '/services/shopify' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'items', label: 'Service cards', fields: [
        { type: 'text',     name: 'icon',     label: 'Icon (emoji)' },
        { type: 'text',     name: 'title',    label: 'Title' },
        { type: 'text',     name: 'headline', label: 'Sub-headline' },
        { type: 'textarea', name: 'desc',     label: 'Description' },
        { type: 'textarea', name: 'features', label: 'Features (comma separated)' },
        { type: 'text',     name: 'price',    label: 'Starting price' },
        { type: 'text',     name: 'href',     label: 'Link URL' },
      ]},
    ],
  })

  // ── WHY US ─────────────────────────────────────────────────────
  registerSection({
    type: 'whyus', label: 'Why Choose Us', category: 'Sections', icon: '💡',
    component: WhyUsSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Why Choose Us',
      headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success',
      items: [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', title: 'Cost-Effective Excellence', subhead: 'Save 60% Without Compromising Quality', desc: 'Get premium web development at a fraction of US agency costs. Professional results, affordable pricing, transparent communication.' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', title: 'Lightning-Fast Delivery', subhead: 'From Concept to Launch in 30 Days', desc: 'Our streamlined process and dedicated team ensure rapid turnaround without cutting corners. Most projects completed ahead of schedule.' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>', title: 'Professional Support', subhead: '24/7 Expert Assistance When You Need It', desc: 'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included.' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>', title: 'Proven Results', subhead: 'Track Record of Growing Businesses', desc: 'Our clients see average 150% increase in conversions and 40% improvement in site speed. Real results, measurable impact.' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'items', label: 'Benefit cards', fields: [
        { type: 'text',     name: 'icon',    label: 'Icon' },
        { type: 'text',     name: 'title',   label: 'Title' },
        { type: 'text',     name: 'subhead', label: 'Sub-headline' },
        { type: 'textarea', name: 'desc',    label: 'Description' },
      ]},
    ],
  })

  // ── PORTFOLIO ──────────────────────────────────────────────────
  registerSection({
    type: 'portfolio', label: 'Portfolio Showcase', category: 'Sections', icon: '🎯',
    component: PortfolioSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Our Work',
      headline: 'Success Stories That Speak for Themselves',
      intro: "Discover how we've transformed businesses across industries with custom web solutions that drive growth and maximize ROI.",
      items: [
        { title: 'The Kapra', client: 'E-commerce Fashion Store', platform: 'Custom WooCommerce', result: '300%', resultLabel: 'Increase in online sales', quote: 'ARIOSETECH transformed our vision into reality with custom code solutions.' },
        { title: 'Dr. Scents', client: 'International Perfume Online Store', platform: 'Multi-site WooCommerce', result: '32', resultLabel: 'Countries launched in 4 months', quote: 'Incredible speed and quality. They delivered beyond our expectations.' },
        { title: 'WYOX Sports', client: 'USA-Based Sports Equipment', platform: 'Shopify + Custom Solutions', result: '250%', resultLabel: 'Business growth', quote: 'Professional, reliable, and always available when we need them.' },
      ],
      ctaLabel: 'Explore All Projects',
      ctaHref: '/portfolio',
    },
    schema: [
      { type: 'text',     name: 'eyebrow',   label: 'Eyebrow' },
      { type: 'text',     name: 'headline',  label: 'Headline' },
      { type: 'textarea', name: 'intro',     label: 'Intro text' },
      { type: 'text',     name: 'ctaLabel',  label: 'CTA label' },
      { type: 'text',     name: 'ctaHref',   label: 'CTA URL' },
      { type: 'repeater', name: 'items', label: 'Portfolio items', fields: [
        { type: 'text',     name: 'title',       label: 'Project name' },
        { type: 'text',     name: 'client',      label: 'Client/Type' },
        { type: 'text',     name: 'platform',    label: 'Platform' },
        { type: 'text',     name: 'result',      label: 'Result value' },
        { type: 'text',     name: 'resultLabel', label: 'Result label' },
        { type: 'textarea', name: 'quote',       label: 'Client quote' },
      ]},
    ],
  })

  // ── TESTIMONIALS ───────────────────────────────────────────────
  registerSection({
    type: 'testimonials', label: 'Client Testimonials', category: 'Sections', icon: '⭐',
    component: TestimonialsSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Client Reviews',
      headline: 'What Our Clients Say About Working With Us',
      items: [
        { name: 'Dr. Fred Sahafi', role: 'Founder of Genovie', initials: 'FS', quote: 'ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth.' },
        { name: 'Michael Chen', role: 'CEO of GeoMag World', initials: 'MC', quote: 'Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom WooCommerce solution that perfectly fits our business model.' },
        { name: 'Muhammad Hannan', role: 'Director of Janya.pk', initials: 'MH', quote: 'Fast, reliable, and cost-effective. ARIOSETECH helped us launch our wholesale platform on Shopify ahead of schedule and under budget.' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'items', label: 'Testimonials', fields: [
        { type: 'text',     name: 'name',     label: 'Name' },
        { type: 'text',     name: 'role',     label: 'Role' },
        { type: 'text',     name: 'initials', label: 'Initials (2 chars)' },
        { type: 'textarea', name: 'quote',    label: 'Quote' },
      ]},
    ],
  })

  // ── PROCESS ────────────────────────────────────────────────────
  registerSection({
    type: 'process', label: 'Our Process', category: 'Sections', icon: '📋',
    component: ProcessSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'How We Work',
      headline: 'Your Success Journey in 5 Simple Steps',
      steps: [
        { n: '01', title: 'Discovery & Strategy', sub: 'Understand Your Vision', desc: 'We start with a comprehensive consultation to understand your business goals, target audience, and technical requirements.', time: '1-2 days' },
        { n: '02', title: 'Planning & Design', sub: 'Blueprint for Success', desc: 'Detailed project planning, wireframing, and design mockups that align with your brand and conversion goals.', time: '3-5 days' },
        { n: '03', title: 'Development', sub: 'Bringing Ideas to Life', desc: 'Expert development using best practices, clean code, and scalable architecture that grows with your business.', time: '15-20 days' },
        { n: '04', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Rigorous testing across devices, speed optimization, and security checks before launch.', time: '3-5 days' },
        { n: '05', title: 'Launch & Support', sub: 'Your Success, Our Priority', desc: 'Smooth launch with comprehensive training and ongoing support to ensure continuous success.', time: 'Ongoing' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'steps', label: 'Process steps', fields: [
        { type: 'text',     name: 'n',     label: 'Step number (01, 02…)' },
        { type: 'text',     name: 'title', label: 'Step title' },
        { type: 'text',     name: 'sub',   label: 'Sub-heading' },
        { type: 'textarea', name: 'desc',  label: 'Description' },
        { type: 'text',     name: 'time',  label: 'Timeline' },
      ]},
    ],
  })

  // ── STATS ─────────────────────────────────────────────────────
  registerSection({
    type: 'stats', label: 'Stats Bar', category: 'Elements', icon: '📊',
    component: StatsSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      items: [
        { value: '100+', label: 'Projects Delivered' },
        { value: '7+',   label: 'Years Experience' },
        { value: '5.0★', label: 'Clutch Rating' },
        { value: '40+',  label: 'Industries Served' },
      ],
    },
    schema: [
      { type: 'repeater', name: 'items', label: 'Stats', fields: [
        { type: 'text', name: 'value', label: 'Value' },
        { type: 'text', name: 'label', label: 'Label' },
      ]},
    ],
  })

  // ── LOGOS MARQUEE ─────────────────────────────────────────────
  registerSection({
    type: 'logos', label: 'Client Logos Marquee', category: 'Elements', icon: '🏷️',
    component: LogosMarqueeSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      label: 'Trusted by 100+ businesses',
      items: ['The Kapra','Dr. Scents','Janya.pk','GeoMag World','Genovie','WYOX Sports','Snap Glam Spa','CTV Promo','US Bidding Estimating','CMA Digital','Zoom PC Hire','Ocean Tech BPO','Staffing Ocean','BGMG Cosmetics','Accident Law','Fabric Wholesale'].map(value => ({ value })),
    },
    schema: [
      { type: 'text', name: 'label', label: 'Label' },
      { type: 'repeater', name: 'items', label: 'Names', fields: [{ type: 'text', name: 'value', label: 'Name' }] },
    ],
  })

  // ── IMPACT ─────────────────────────────────────────────────────
  registerSection({
    type: 'impact', label: 'Impact Metrics', category: 'Sections', icon: '📈',
    component: ImpactSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Results That Matter',
      headline: 'The Impact, Quantified',
      intro: "Numbers don't lie. Here's what working with ARIOSETECH actually delivers for your business.",
      metrics: [
        { value: '150%', label: 'Avg Conversion Lift', desc: 'Our tailored e-commerce strategies and optimized UX consistently drive 150%+ conversion improvements for clients.' },
        { value: '98%', label: 'Client Satisfaction', desc: 'Every project is delivered with near-perfect precision — on time, on spec, and fully aligned with your business goals.' },
        { value: '40%', label: 'Site Speed Gain', desc: 'Performance-first builds mean faster stores, better SEO rankings, and higher revenue from the same traffic.' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow', label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'textarea', name: 'intro', label: 'Intro' },
      { type: 'repeater', name: 'metrics', label: 'Metrics', fields: [
        { type: 'text', name: 'value', label: 'Value' },
        { type: 'text', name: 'label', label: 'Label' },
        { type: 'textarea', name: 'desc', label: 'Description' },
      ]},
    ],
  })

  // ── HOW IT WORKS ───────────────────────────────────────────────
  registerSection({
    type: 'howitworks', label: 'How It Works', category: 'Sections', icon: '🧭',
    component: HowItWorksSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Our Process',
      headline: 'How It Works',
      intro: 'From setup to scale — a proven 5-step process that takes you from idea to a live, high-performing site.',
      steps: [
        { n: '01', title: 'Discovery & Strategy', sub: 'Understand Your Vision', desc: 'We kick off with a deep-dive consultation so every decision is rooted in business strategy.' },
        { n: '02', title: 'Planning & Design', sub: 'Blueprint for Success', desc: 'Wireframes and pixel-perfect UI that aligns with your brand and converts.' },
        { n: '03', title: 'Development', sub: 'Bringing Ideas to Life', desc: 'Clean, scalable builds for WordPress, Shopify, or WooCommerce — made to grow with you.' },
        { n: '04', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Cross-device QA, Core Web Vitals performance, security hardening, and SEO validation.' },
        { n: '05', title: 'Launch & Scale', sub: 'Your Success, Our Priority', desc: 'Smooth go-live, handover, and post-launch support — then ongoing growth support if needed.' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow', label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'textarea', name: 'intro', label: 'Intro' },
      { type: 'repeater', name: 'steps', label: 'Steps', fields: [
        { type: 'text', name: 'n', label: 'Number' },
        { type: 'text', name: 'title', label: 'Title' },
        { type: 'text', name: 'sub', label: 'Subheading' },
        { type: 'textarea', name: 'desc', label: 'Description' },
      ]},
    ],
  })

  // ── APPROACH ───────────────────────────────────────────────────
  registerSection({
    type: 'approach', label: 'Our Approach (Sticky)', category: 'Sections', icon: '🛣️',
    component: ApproachSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: "Why We're Different",
      headline: "Our",
      scrambleWord: "Approach",
      items: [
        { n:'01', title:'COST-EFFECTIVE', sub:'Save 60% Without Compromising Quality', desc:'Premium web development at a fraction of US agency costs. Professional results, transparent pricing, zero compromise on quality.' },
        { n:'02', title:'TRANSPARENT', sub:'Open Communication at Every Step', desc:'We share project progress, insights, and feedback in real-time so you always know exactly where your investment stands.' },
        { n:'03', title:'RELIABLE', sub:'Consistently Delivered. Always On-Time.', desc:'100+ projects delivered on time and within budget. Our clients come back because our track record speaks for itself.' },
        { n:'04', title:'SCALABLE', sub:'Built to Grow With Your Business', desc:'Every site we build is architected for scale — whether you launch small or enterprise-level, our code grows seamlessly with your business.' },
        { n:'05', title:'SUPPORTED', sub:'24/7 Expert Assistance, Always On', desc:'Round-the-clock support across time zones. Emergency fixes, proactive monitoring, and regular maintenance included in every plan.' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow', label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline Text' },
      { type: 'text', name: 'scrambleWord', label: 'Scramble Effect Word' },
      { type: 'repeater', name: 'items', label: 'Cards', fields: [
        { type: 'text', name: 'n', label: 'Number (e.g. 01)' },
        { type: 'text', name: 'title', label: 'Title' },
        { type: 'text', name: 'sub', label: 'Subheading' },
        { type: 'textarea', name: 'desc', label: 'Description' },
      ]},
    ],
  })

  // ── BLOG ───────────────────────────────────────────────────────
  registerSection({
    type: 'blog', label: 'Blog Grid', category: 'Sections', icon: '📰',
    component: BlogSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Knowledge Base',
      headline: 'Latest Insights & Tutorials',
      intro: 'Practical guides, growth insights, and platform-specific tips from our team.',
      ctaLabel: 'All Articles',
      ctaHref: '/blog',
      posts: [
        { title: 'WooCommerce vs Shopify: Which is Better?', excerpt: 'A practical comparison to help you choose the right platform.', href: '/blog', category: 'E-Commerce', meta: '8min read' },
        { title: '10 WordPress Security Best Practices', excerpt: 'Protect your site with these essential security steps.', href: '/blog', category: 'Security', meta: '6min read' },
        { title: 'How to Optimize E‑Commerce Site Speed', excerpt: 'Speed techniques that improve conversions and SEO.', href: '/blog', category: 'Performance', meta: '10min read' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow', label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'textarea', name: 'intro', label: 'Intro' },
      { type: 'text', name: 'ctaLabel', label: 'CTA label' },
      { type: 'text', name: 'ctaHref', label: 'CTA URL' },
      { type: 'repeater', name: 'posts', label: 'Posts', fields: [
        { type: 'text', name: 'title', label: 'Title' },
        { type: 'textarea', name: 'excerpt', label: 'Excerpt' },
        { type: 'text', name: 'href', label: 'Link' },
        { type: 'text', name: 'category', label: 'Category' },
        { type: 'text', name: 'meta', label: 'Meta (e.g. 8min read)' },
      ]},
    ],
  })

  // ── CTA ────────────────────────────────────────────────────────
  registerSection({
    type: 'cta', label: 'Call to Action', category: 'Elements', icon: '📣',
    component: CtaSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Get Started Today',
      headline: 'Start Your Success Story Today',
      desc: 'Join 100+ successful businesses that chose ARIOSETECH for their web development needs. Professional results, affordable pricing, and ongoing support.',
      trust: 'No Long-Term Contracts,30-Day Money-Back Guarantee,Free Post-Launch Support,Transparent Pricing',
      ctaLabel: 'Schedule Free Consultation',
      ctaHref: '/contact',
      secondaryLabel: 'View Our Portfolio',
      secondaryHref: '/portfolio',
    },
    schema: [
      { type: 'text',     name: 'eyebrow',       label: 'Eyebrow' },
      { type: 'text',     name: 'headline',       label: 'Headline' },
      { type: 'textarea', name: 'desc',           label: 'Description' },
      { type: 'textarea', name: 'trust',          label: 'Trust badges (comma separated)' },
      { type: 'text',     name: 'ctaLabel',       label: 'Primary CTA' },
      { type: 'text',     name: 'ctaHref',        label: 'Primary URL' },
      { type: 'text',     name: 'secondaryLabel', label: 'Secondary CTA' },
      { type: 'text',     name: 'secondaryHref',  label: 'Secondary URL' },
    ],
  })

  // ── AUDIT ─────────────────────────────────────────────────────
  registerSection({
    type: 'audit', label: 'Free Audit CTA', category: 'Elements', icon: '🔍',
    component: AuditSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Free Audit',
      headline: 'Get Your Free Website Performance Audit',
      subhead: "Discover what's holding your website back from peak performance.",
      desc: "Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.",
      ctaLabel: 'Get My Free Audit Report',
      ctaHref: '/contact',
      guarantee: 'No spam, ever. Detailed report delivered within 24 hours.',
    },
    schema: [
      { type: 'text',     name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text',     name: 'headline', label: 'Headline' },
      { type: 'text',     name: 'subhead',  label: 'Sub-headline' },
      { type: 'textarea', name: 'desc',     label: 'Description' },
      { type: 'text',     name: 'ctaLabel', label: 'CTA label' },
      { type: 'text',     name: 'ctaHref',  label: 'CTA URL' },
      { type: 'text',     name: 'guarantee',label: 'Guarantee text' },
    ],
  })

  // ── HEADING ────────────────────────────────────────────────────
  registerSection({
    type: 'heading', label: 'Heading + Text', category: 'Typography', icon: '✏️',
    component: HeadingSection as React.FC<Record<string, unknown>>,
    defaultProps: { eyebrow: '', headline: 'Section Heading', body: 'Add your description text here.', align: 'left' },
    schema: [
      { type: 'text',     name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text',     name: 'headline', label: 'Heading' },
      { type: 'textarea', name: 'body',     label: 'Body text' },
      { type: 'select',   name: 'align',    label: 'Alignment', options: ['left', 'center', 'right'] },
    ],
  })

  // ── TEXT ───────────────────────────────────────────────────────
  registerSection({
    type: 'text', label: 'Rich Text Block', category: 'Typography', icon: '📝',
    component: TextSection as React.FC<Record<string, unknown>>,
    defaultProps: { content: 'Edit this text block.' },
    schema: [{ type: 'textarea', name: 'content', label: 'Content' }],
  })

  // ── CONTACT ────────────────────────────────────────────────────
  registerSection({
    type: 'contact', label: 'Contact Section', category: 'Elements', icon: '📬',
    component: ContactSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'Get In Touch',
      headline: 'Ready to Transform Your Online Presence?',
      guarantee: 'We respond to all inquiries within 2 hours during business days.',
    },
    schema: [
      { type: 'text', name: 'eyebrow',   label: 'Eyebrow' },
      { type: 'text', name: 'headline',  label: 'Headline' },
      { type: 'text', name: 'guarantee', label: 'Response guarantee' },
    ],
  })

  // ── FAQ ─────────────────────────────────────────────────────────
  registerSection({
    type: 'faq', label: 'FAQ Section', category: 'Elements', icon: '❓',
    component: FaqSection as React.FC<Record<string, unknown>>,
    defaultProps: {
      eyebrow: 'FAQ',
      headline: 'Frequently Asked Questions',
      items: [
        { q: 'How long does a WordPress website take?', a: 'Most WordPress websites are completed within 2-3 weeks. Complex projects with custom functionality may take 4-6 weeks.' },
        { q: 'What is included in your maintenance plans?', a: 'Our maintenance plans include regular updates, security monitoring, performance optimization, backup management, and priority support.' },
        { q: 'Do you offer a money-back guarantee?', a: 'Yes. We offer a 30-day money-back guarantee on all our development projects. If you\'re not satisfied, we\'ll refund you in full.' },
        { q: 'Can you work with my existing WordPress site?', a: 'Absolutely. We work with existing WordPress sites for redesigns, migrations, speed optimization, security fixes, and feature additions.' },
        { q: 'Do you offer ongoing support after launch?', a: 'Yes. Every project includes 30 days of free post-launch support. After that, we offer flexible monthly maintenance plans starting at $79/month.' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'items', label: 'FAQ items', fields: [
        { type: 'text',     name: 'q', label: 'Question' },
        { type: 'textarea', name: 'a', label: 'Answer' },
      ]},
    ],
  })
}
