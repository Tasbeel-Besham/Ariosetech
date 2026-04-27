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
        { icon: '🔷', title: 'WordPress Development', headline: 'Build Powerful, Scalable Websites', desc: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.', features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services', price: '$799', href: '/services/wordpress' },
        { icon: '🛒', title: 'WooCommerce Development', headline: 'Launch Your Dream E-commerce Store', desc: 'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.', features: 'Store Setup & Customization,Payment Gateway Integration,Multi-vendor Solutions,Performance Optimization', price: '$1,299', href: '/services/woocommerce' },
        { icon: '🚀', title: 'Shopify Development', headline: 'Scale Your Business with Shopify', desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.', features: 'Custom Store Development,Shopify Plus Solutions,App Integration,Conversion Optimization', price: '$999', href: '/services/shopify' },
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
        { icon: '💰', title: 'Cost-Effective Excellence', subhead: 'Save 60% Without Compromising Quality', desc: 'Get premium web development at a fraction of US agency costs. Professional results, affordable pricing, transparent communication.' },
        { icon: '⚡', title: 'Lightning-Fast Delivery', subhead: 'From Concept to Launch in 30 Days', desc: 'Our streamlined process and dedicated team ensure rapid turnaround without cutting corners. Most projects completed ahead of schedule.' },
        { icon: '🛡️', title: 'Professional Support', subhead: '24/7 Expert Assistance When You Need It', desc: 'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included.' },
        { icon: '📈', title: 'Proven Results', subhead: 'Track Record of Growing Businesses', desc: 'Our clients see average 150% increase in conversions and 40% improvement in site speed. Real results, measurable impact.' },
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
