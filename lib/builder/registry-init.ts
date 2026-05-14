/**
 * lib/builder/registry-init.ts  —  CANONICAL section registry
 * Single source of truth. Import initRegistry from here everywhere.
 */

import { registerSection, getSection } from '@/lib/builder/registry'
import type { SectionDefinition } from '@/types'

import HeroSection              from '@/components/builder/sections/HeroSection'
import InteractiveHeroSection   from '@/components/sections/InteractiveHeroSection'
import ServicesAccordionSection from '@/components/sections/ServicesAccordionSection'
import ServicesSection          from '@/components/sections/ServicesSection'
import WhyUsSection             from '@/components/sections/WhyUsSection'
import PortfolioSection         from '@/components/sections/PortfolioSection'
import TestimonialsSection      from '@/components/sections/TestimonialsSection'
import ProcessSection           from '@/components/sections/ProcessSection'
import StatsSection             from '@/components/sections/StatsSection'
import CtaSection               from '@/components/sections/CtaSection'
import AuditSection             from '@/components/sections/AuditSection'
import HeadingSection           from '@/components/sections/HeadingSection'
import TextSection              from '@/components/sections/TextSection'
import ContactSection           from '@/components/sections/ContactSection'
import FaqSection               from '@/components/sections/FaqSection'
import LogosMarqueeSection      from '@/components/sections/LogosMarqueeSection'
import ImpactSection            from '@/components/sections/ImpactSection'
import HowItWorksSection        from '@/components/sections/HowItWorksSection'
import BlogSection              from '@/components/sections/BlogSection'
import ApproachSection          from '@/components/sections/ApproachSection'
import CyberTerminalSection     from '@/components/sections/CyberTerminalSection'
import MaintenancePlansSection  from '@/components/sections/MaintenancePlansSection'
import SpeedScoreSection        from '@/components/sections/SpeedScoreSection'
import ServiceVerticalSection   from '@/components/sections/ServiceVerticalSection'
import ServiceGridSection       from '@/components/sections/ServiceGridSection'

type C = React.FC<Record<string, unknown>>

const HERO_DEFAULT_PROPS = {
  eyebrow:           'Professional Web Development Since 2017',
  headline:          'Professional WordPress, Shopify & WooCommerce Development',
  subheadline:       'Transform your business with custom e-commerce solutions that drive results.',
  supportingText:    '',
  ctaPrimaryLabel:   'Get Free Quote',
  ctaPrimaryHref:    '/contact',
  ctaSecondaryLabel: 'View Portfolio',
  ctaSecondaryHref:  '/portfolio',
  trust:             'No Contracts,30-Day Guarantee,Free Support,Transparent Pricing',
}

const HERO_SCHEMA: SectionDefinition['schema'] = [
  { type: 'text',     name: 'eyebrow',          label: 'Eyebrow badge' },
  { type: 'text',     name: 'headline',          label: 'Main headline' },
  { type: 'textarea', name: 'subheadline',       label: 'Subheadline' },
  { type: 'textarea', name: 'supportingText',    label: 'Supporting text (below subheadline)' },
  { type: 'text',     name: 'ctaPrimaryLabel',   label: 'Primary CTA label' },
  { type: 'text',     name: 'ctaPrimaryHref',    label: 'Primary CTA URL' },
  { type: 'text',     name: 'ctaSecondaryLabel', label: 'Secondary CTA label' },
  { type: 'text',     name: 'ctaSecondaryHref',  label: 'Secondary CTA URL' },
  { type: 'textarea', name: 'trust',             label: 'Trust badges (comma separated)' },
]

export function initRegistry() {
  if (getSection('hero')) return // already initialised

  // ── HERO ─────────────────────────────────────────────────────
  registerSection({ type: 'hero',             label: 'Hero (Standard)',     category: 'Sections', icon: '🚀', component: HeroSection            as C, defaultProps: HERO_DEFAULT_PROPS, schema: HERO_SCHEMA })
  registerSection({ type: 'hero-interactive', label: 'Hero (Interactive)', category: 'Sections', icon: '✨', component: InteractiveHeroSection  as C, defaultProps: HERO_DEFAULT_PROPS, schema: HERO_SCHEMA })
  registerSection({ type: 'hero-classic',     label: 'Hero (Classic)',     category: 'Sections', icon: '🏛️', component: HeroSection            as C, defaultProps: HERO_DEFAULT_PROPS, schema: HERO_SCHEMA })

  // ── SERVICES ACCORDION ───────────────────────────────────────
  registerSection({
    type: 'services-accordion', label: 'Services Accordion (Tabs)', category: 'Sections', icon: '🗂️',
    component: ServicesAccordionSection as C,
    defaultProps: {
      eyebrow: 'What We Offer',
      headline: 'Comprehensive Web Development Solutions',
      intro: "Three core platforms. One expert team.",
      items: [
        { label: 'WordPress',   title: 'WordPress Development',   sub: 'Build Powerful, Scalable Websites',    desc: 'Custom themes to complex functionality, speed-optimized and SEO-ready.', features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services,Security Hardening,SEO-Ready Builds', price: '$799',   href: '/services/wordpress',   bg: 'linear-gradient(160deg,#0c0a1c,#05050a)', icon: '' },
        { label: 'WooCommerce', title: 'WooCommerce Development', sub: 'Launch Your Dream E-commerce Store',  desc: 'Profitable online stores with seamless payment integration.',             features: 'Store Setup,Payment Gateways,Multi-vendor,Performance,Inventory,Mobile', price: '$1,299', href: '/services/woocommerce', bg: 'linear-gradient(160deg,#08081a,#05050a)', icon: '' },
        { label: 'Shopify',     title: 'Shopify Development',     sub: 'Scale Your Business with Shopify',    desc: 'From startup stores to Shopify Plus enterprises.',                        features: 'Custom Development,Shopify Plus,App Integration,Conversion Optimization,Theme Customization,Migration', price: '$999',   href: '/services/shopify',     bg: 'linear-gradient(160deg,#0a0818,#05050a)', icon: '' },
        { label: 'SEO',         title: 'SEO Services',            sub: 'Rank Higher, Get Found Faster',       desc: 'Business-first SEO — technical, local, and content strategy.',           features: 'Website SEO,Local SEO,Technical SEO,Content Strategy,Core Web Vitals,Competitor Analysis', price: 'Custom', href: '/services/seo',         bg: 'linear-gradient(160deg,#08081a,#05050a)', icon: '' },
      ],
    },
    schema: [
      { type: 'text',     name: 'eyebrow',  label: 'Eyebrow badge' },
      { type: 'text',     name: 'headline', label: 'Section headline' },
      { type: 'textarea', name: 'intro',    label: 'Intro paragraph' },
      { type: 'repeater', name: 'items',    label: 'Service Tabs', fields: [
        { type: 'text',     name: 'label',    label: 'Tab label' },
        { type: 'text',     name: 'title',    label: 'Service title' },
        { type: 'text',     name: 'sub',      label: 'Subheading' },
        { type: 'textarea', name: 'desc',     label: 'Description' },
        { type: 'textarea', name: 'features', label: 'Features (comma separated)' },
        { type: 'text',     name: 'price',    label: 'Starting price' },
        { type: 'text',     name: 'href',     label: 'Button URL' },
        { type: 'text',     name: 'icon',     label: 'SVG icon code' },
        { type: 'textarea', name: 'bg',       label: 'Background CSS (gradient)' },
      ]},
    ],
  })

  // ── SERVICES GRID ────────────────────────────────────────────
  registerSection({
    type: 'services', label: 'Services Grid', category: 'Sections', icon: '⚙️',
    component: ServicesSection as C,
    defaultProps: {
      eyebrow: 'What We Offer',
      headline: 'Comprehensive Web Development Solutions for Your Business Growth',
      items: [
        { icon: '🖥️', title: 'WordPress Development',   headline: 'Build Powerful, Scalable Websites',    desc: 'Custom themes to complex functionality.', features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services', price: '$799',   href: '/services/wordpress' },
        { icon: '🛒', title: 'WooCommerce Development', headline: 'Launch Your Dream E-commerce Store',   desc: 'Turn your vision into a profitable store.', features: 'Store Setup,Payment Gateways,Multi-vendor,Performance', price: '$1,299', href: '/services/woocommerce' },
        { icon: '🛍️', title: 'Shopify Development',    headline: 'Scale Your Business with Shopify',     desc: 'From startup stores to Shopify Plus.', features: 'Custom Development,Shopify Plus,App Integration,Conversion Optimization', price: '$999',   href: '/services/shopify' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'items', label: 'Service cards', fields: [
        { type: 'text',     name: 'icon',     label: 'Icon (emoji or SVG)' },
        { type: 'text',     name: 'title',    label: 'Title' },
        { type: 'text',     name: 'headline', label: 'Sub-headline' },
        { type: 'textarea', name: 'desc',     label: 'Description' },
        { type: 'textarea', name: 'features', label: 'Features (comma separated)' },
        { type: 'text',     name: 'price',    label: 'Starting price' },
        { type: 'text',     name: 'href',     label: 'Link URL' },
        { type: 'text',     name: 'ctaLabel', label: 'Button text' },
      ]},
    ],
  })

  // ── WHY US ───────────────────────────────────────────────────
  registerSection({
    type: 'whyus', label: 'Why Choose Us', category: 'Sections', icon: '💡',
    component: WhyUsSection as C,
    defaultProps: {
      eyebrow: 'Why Choose Us',
      headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success',
      items: [
        { icon: '💰', title: 'Cost-Effective Excellence',  subhead: 'Save 60% Without Compromising Quality',    desc: 'Premium web development at a fraction of US agency costs.' },
        { icon: '⚡', title: 'Lightning-Fast Delivery',    subhead: 'From Concept to Launch in 30 Days',        desc: 'Most projects completed ahead of schedule.' },
        { icon: '🛡️', title: 'Professional Support',      subhead: '24/7 Expert Assistance When You Need It',  desc: 'Round-the-clock support across time zones.' },
        { icon: '📈', title: 'Proven Results',             subhead: 'Track Record of Growing Businesses',      desc: 'Avg 150% increase in conversions, 40% improvement in site speed.' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'items', label: 'Benefit cards', fields: [
        { type: 'text',     name: 'icon',    label: 'Icon (emoji or SVG)' },
        { type: 'text',     name: 'title',   label: 'Title' },
        { type: 'text',     name: 'subhead', label: 'Sub-headline' },
        { type: 'textarea', name: 'desc',    label: 'Description' },
      ]},
    ],
  })

  // ── PORTFOLIO ────────────────────────────────────────────────
  registerSection({
    type: 'portfolio', label: 'Portfolio Showcase', category: 'Sections', icon: '🎯',
    component: PortfolioSection as C,
    defaultProps: { eyebrow: 'Our Work', headline: 'Success Stories That Speak for Themselves', intro: "Discover how we've transformed businesses across industries.", items: [], ctaLabel: 'Explore All Projects', ctaHref: '/portfolio' },
    schema: [
      { type: 'text',     name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text',     name: 'headline', label: 'Headline' },
      { type: 'textarea', name: 'intro',    label: 'Intro text' },
      { type: 'text',     name: 'ctaLabel', label: 'CTA label' },
      { type: 'text',     name: 'ctaHref',  label: 'CTA URL' },
    ],
  })

  // ── TESTIMONIALS ─────────────────────────────────────────────
  registerSection({
    type: 'testimonials', label: 'Client Testimonials', category: 'Sections', icon: '⭐',
    component: TestimonialsSection as C,
    defaultProps: {
      eyebrow: 'Client Reviews', headline: 'What Our Clients Say About Working With Us',
      items: [
        { name: 'Dr. Fred Sahafi', role: 'Founder of Genovie',   initials: 'FS', quote: 'ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations.' },
        { name: 'Michael Chen',    role: 'CEO of GeoMag World',  initials: 'MC', quote: 'They understood our complex requirements and delivered a WooCommerce solution that perfectly fits our business.' },
        { name: 'Muhammad Hannan', role: 'Director of Janya.pk', initials: 'MH', quote: 'Fast, reliable, and cost-effective. Launched our wholesale platform ahead of schedule and under budget.' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'items', label: 'Testimonials', fields: [
        { type: 'text',     name: 'name',     label: 'Name' },
        { type: 'text',     name: 'role',     label: 'Role / Company' },
        { type: 'text',     name: 'initials', label: 'Initials (2 chars)' },
        { type: 'textarea', name: 'quote',    label: 'Quote' },
      ]},
    ],
  })

  // ── PROCESS ──────────────────────────────────────────────────
  registerSection({
    type: 'process', label: 'Our Process', category: 'Sections', icon: '📋',
    component: ProcessSection as C,
    defaultProps: {
      eyebrow: 'How We Work', headline: 'Your Success Journey in 5 Simple Steps',
      steps: [
        { n: '01', title: 'Discovery & Strategy',     sub: 'Understand Your Vision',     desc: 'Comprehensive consultation to understand your goals.',            time: '1-2 days' },
        { n: '02', title: 'Planning & Design',        sub: 'Blueprint for Success',       desc: 'Wireframing and mockups aligned with your brand.',               time: '3-5 days' },
        { n: '03', title: 'Development',              sub: 'Bringing Ideas to Life',      desc: 'Expert development using best practices and scalable code.',      time: '15-20 days' },
        { n: '04', title: 'Testing & Optimization',   sub: 'Ensuring Perfection',         desc: 'Cross-device testing, speed optimization, security hardening.',   time: '3-5 days' },
        { n: '05', title: 'Launch & Support',         sub: 'Your Success, Our Priority', desc: 'Smooth launch with training and ongoing support.',               time: 'Ongoing' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'steps', label: 'Process steps', fields: [
        { type: 'text',     name: 'n',     label: 'Step number (01, 02…)' },
        { type: 'text',     name: 'title', label: 'Title' },
        { type: 'text',     name: 'sub',   label: 'Sub-heading' },
        { type: 'textarea', name: 'desc',  label: 'Description' },
        { type: 'text',     name: 'time',  label: 'Timeline' },
      ]},
    ],
  })

  // ── STATS ────────────────────────────────────────────────────
  registerSection({
    type: 'stats', label: 'Stats Bar', category: 'Elements', icon: '📊',
    component: StatsSection as C,
    defaultProps: { items: [{ value: '100+', label: 'Projects Delivered' }, { value: '7+', label: 'Years Experience' }, { value: '5.0★', label: 'Clutch Rating' }, { value: '40+', label: 'Industries Served' }] },
    schema: [{ type: 'repeater', name: 'items', label: 'Stats', fields: [{ type: 'text', name: 'value', label: 'Value' }, { type: 'text', name: 'label', label: 'Label' }] }],
  })

  // ── LOGOS MARQUEE ────────────────────────────────────────────
  registerSection({
    type: 'logos', label: 'Client Logos Marquee', category: 'Elements', icon: '🏷️',
    component: LogosMarqueeSection as C,
    defaultProps: {
      label: 'Trusted by 100+ businesses',
      items: ['The Kapra','Dr. Scents','Janya.pk','GeoMag World','Genovie','WYOX Sports','Snap Glam Spa','CTV Promo','US Bidding Estimating','CMA Digital','Zoom PC Hire','Ocean Tech BPO','Staffing Ocean','BGMG Cosmetics','Accident Law','Fabric Wholesale'].map(value => ({ value })),
    },
    schema: [
      { type: 'text', name: 'label', label: 'Label above marquee' },
      { type: 'repeater', name: 'items', label: 'Client names', fields: [{ type: 'text', name: 'value', label: 'Name' }] },
    ],
  })

  // ── IMPACT ───────────────────────────────────────────────────
  registerSection({
    type: 'impact', label: 'Impact Metrics', category: 'Sections', icon: '📈',
    component: ImpactSection as C,
    defaultProps: {
      eyebrow: 'Results That Matter', headline: 'The Impact, Quantified',
      intro: "Numbers don't lie. Here's what working with ARIOSETECH delivers.",
      metrics: [
        { value: '150%',  label: 'Avg Conversion Lift', desc: 'Consistently drive 150%+ conversion improvements.' },
        { value: '98%',   label: 'Client Satisfaction', desc: 'Delivered on time, on spec, aligned with your goals.' },
        { value: '99.9%', label: 'Uptime Guarantee',    desc: 'Enterprise-grade reliability with 24/7 monitoring.' },
      ],
    },
    schema: [
      { type: 'text',     name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text',     name: 'headline', label: 'Headline' },
      { type: 'textarea', name: 'intro',    label: 'Intro text' },
      { type: 'repeater', name: 'metrics',  label: 'Metrics', fields: [
        { type: 'text',     name: 'value', label: 'Value (e.g. 150%)' },
        { type: 'text',     name: 'label', label: 'Label' },
        { type: 'textarea', name: 'desc',  label: 'Description' },
      ]},
    ],
  })

  // ── HOW IT WORKS ─────────────────────────────────────────────
  registerSection({
    type: 'howitworks', label: 'How It Works', category: 'Sections', icon: '🧭',
    component: HowItWorksSection as C,
    defaultProps: {
      eyebrow: 'Our Process', headline: 'How It Works',
      intro: 'From setup to scale — a proven 5-step process from idea to live site.',
      steps: [
        { n: '01', title: 'Discovery & Strategy',   sub: 'Understand Your Vision',    desc: 'Deep-dive consultation rooted in business strategy.' },
        { n: '02', title: 'Planning & Design',      sub: 'Blueprint for Success',      desc: 'Wireframes and pixel-perfect UI aligned with your brand.' },
        { n: '03', title: 'Development',            sub: 'Bringing Ideas to Life',     desc: 'Clean, scalable builds for WordPress, Shopify, or WooCommerce.' },
        { n: '04', title: 'Testing & Optimization', sub: 'Ensuring Perfection',        desc: 'Cross-device QA, Core Web Vitals, security, SEO validation.' },
        { n: '05', title: 'Launch & Scale',         sub: 'Your Success, Our Priority', desc: 'Smooth go-live, handover, and post-launch support.' },
      ],
    },
    schema: [
      { type: 'text',     name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text',     name: 'headline', label: 'Headline' },
      { type: 'textarea', name: 'intro',    label: 'Intro' },
      { type: 'repeater', name: 'steps',    label: 'Steps', fields: [
        { type: 'text',     name: 'n',     label: 'Number (01, 02…)' },
        { type: 'text',     name: 'title', label: 'Title' },
        { type: 'text',     name: 'sub',   label: 'Sub-heading' },
        { type: 'textarea', name: 'desc',  label: 'Description' },
      ]},
    ],
  })

  // ── APPROACH ─────────────────────────────────────────────────
  registerSection({
    type: 'approach', label: 'Our Approach (Sticky)', category: 'Sections', icon: '🛣️',
    component: ApproachSection as C,
    defaultProps: {
      eyebrow: "Why We're Different", headline: 'Our', scrambleWord: 'Approach',
      items: [
        { n: '01', title: 'COST-EFFECTIVE', sub: 'Save 60% Without Compromising Quality',    desc: 'Premium web development at a fraction of US agency costs.' },
        { n: '02', title: 'TRANSPARENT',    sub: 'Open Communication at Every Step',         desc: 'We share progress in real-time so you always know where your investment stands.' },
        { n: '03', title: 'RELIABLE',       sub: 'Consistently Delivered. Always On-Time.', desc: '100+ projects delivered on time and within budget.' },
        { n: '04', title: 'SCALABLE',       sub: 'Built to Grow With Your Business',         desc: 'Every site is architected for scale from day one.' },
        { n: '05', title: 'SUPPORTED',      sub: '24/7 Expert Assistance, Always On',        desc: 'Round-the-clock support across time zones.' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',      label: 'Eyebrow' },
      { type: 'text', name: 'headline',     label: 'Headline text' },
      { type: 'text', name: 'scrambleWord', label: 'Scramble-effect word' },
      { type: 'repeater', name: 'items', label: 'Cards', fields: [
        { type: 'text',     name: 'n',     label: 'Number (e.g. 01)' },
        { type: 'text',     name: 'title', label: 'Title' },
        { type: 'text',     name: 'sub',   label: 'Sub-heading' },
        { type: 'textarea', name: 'desc',  label: 'Description' },
      ]},
    ],
  })

  // ── BLOG GRID ────────────────────────────────────────────────
  registerSection({
    type: 'blog', label: 'Blog Grid', category: 'Sections', icon: '📰',
    component: BlogSection as C,
    defaultProps: {
      eyebrow: 'Knowledge Base', headline: 'Latest Insights & Tutorials',
      intro: 'Practical guides, growth insights, and platform-specific tips.',
      ctaLabel: 'All Articles', ctaHref: '/blog',
      posts: [
        { title: 'WooCommerce vs Shopify: Which is Better?',  excerpt: 'A practical comparison to help you choose.', href: '/blog', category: 'E-Commerce', meta: '8 min read' },
        { title: '10 WordPress Security Best Practices',       excerpt: 'Protect your site with these essential steps.',  href: '/blog', category: 'Security',   meta: '6 min read' },
        { title: 'How to Optimize E‑Commerce Site Speed',      excerpt: 'Speed techniques that improve conversions.',     href: '/blog', category: 'Performance', meta: '10 min read' },
      ],
    },
    schema: [
      { type: 'text',     name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text',     name: 'headline', label: 'Headline' },
      { type: 'textarea', name: 'intro',    label: 'Intro text' },
      { type: 'text',     name: 'ctaLabel', label: 'CTA label' },
      { type: 'text',     name: 'ctaHref',  label: 'CTA URL' },
      { type: 'repeater', name: 'posts',    label: 'Fallback posts', fields: [
        { type: 'text',     name: 'title',    label: 'Title' },
        { type: 'textarea', name: 'excerpt',  label: 'Excerpt' },
        { type: 'text',     name: 'href',     label: 'Link' },
        { type: 'text',     name: 'category', label: 'Category' },
        { type: 'text',     name: 'meta',     label: 'Meta (e.g. 8 min read)' },
      ]},
    ],
  })

  // ── CTA ──────────────────────────────────────────────────────
  registerSection({
    type: 'cta', label: 'Call to Action', category: 'Elements', icon: '📣',
    component: CtaSection as C,
    defaultProps: {
      eyebrow: 'Get Started Today', headline: 'Start Your Success Story Today',
      desc: 'Join 100+ successful businesses that chose ARIOSETECH.',
      trust: 'No Long-Term Contracts,30-Day Money-Back Guarantee,Free Post-Launch Support,Transparent Pricing',
      ctaLabel: 'Schedule Free Consultation', ctaHref: '/contact',
      secondaryLabel: 'View Our Portfolio',   secondaryHref: '/portfolio',
    },
    schema: [
      { type: 'text',     name: 'eyebrow',       label: 'Eyebrow' },
      { type: 'text',     name: 'headline',       label: 'Headline' },
      { type: 'textarea', name: 'desc',           label: 'Description' },
      { type: 'textarea', name: 'trust',          label: 'Trust badges (comma separated)' },
      { type: 'text',     name: 'ctaLabel',       label: 'Primary CTA label' },
      { type: 'text',     name: 'ctaHref',        label: 'Primary CTA URL' },
      { type: 'text',     name: 'secondaryLabel', label: 'Secondary CTA label' },
      { type: 'text',     name: 'secondaryHref',  label: 'Secondary CTA URL' },
    ],
  })

  // ── AUDIT CTA ────────────────────────────────────────────────
  registerSection({
    type: 'audit', label: 'Free Audit CTA', category: 'Elements', icon: '🔍',
    component: AuditSection as C,
    defaultProps: {
      eyebrow: 'Free Audit', headline: 'Get Your Free Website Performance Audit',
      subhead: "Discover what's holding your website back.",
      desc: "Find out how to improve speed, SEO, security, and conversions with our 25-point audit.",
      ctaLabel: 'Get My Free Audit Report', ctaHref: '/contact',
      guarantee: 'No spam, ever. Report delivered within 24 hours.',
    },
    schema: [
      { type: 'text',     name: 'eyebrow',   label: 'Eyebrow' },
      { type: 'text',     name: 'headline',  label: 'Headline' },
      { type: 'text',     name: 'subhead',   label: 'Sub-headline' },
      { type: 'textarea', name: 'desc',      label: 'Description' },
      { type: 'text',     name: 'ctaLabel',  label: 'CTA label' },
      { type: 'text',     name: 'ctaHref',   label: 'CTA URL' },
      { type: 'text',     name: 'guarantee', label: 'Guarantee text' },
    ],
  })

  // ── HEADING + TEXT ───────────────────────────────────────────
  registerSection({
    type: 'heading', label: 'Heading + Text', category: 'Typography', icon: '✏️',
    component: HeadingSection as C,
    defaultProps: { eyebrow: '', headline: 'Section Heading', body: 'Add your description text here.', align: 'left' },
    schema: [
      { type: 'text',     name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text',     name: 'headline', label: 'Heading' },
      { type: 'textarea', name: 'body',     label: 'Body text' },
      { type: 'select',   name: 'align',    label: 'Alignment', options: ['left', 'center', 'right'] },
    ],
  })

  // ── RICH TEXT BLOCK ──────────────────────────────────────────
  registerSection({
    type: 'text', label: 'Rich Text Block', category: 'Typography', icon: '📝',
    component: TextSection as C,
    defaultProps: { content: 'Edit this text block.' },
    schema: [{ type: 'textarea', name: 'content', label: 'Content' }],
  })

  // ── CONTACT ──────────────────────────────────────────────────
  registerSection({
    type: 'contact', label: 'Contact Section', category: 'Elements', icon: '📬',
    component: ContactSection as C,
    defaultProps: { eyebrow: 'Get In Touch', headline: 'Ready to Transform Your Online Presence?', guarantee: 'We respond within 2 hours during business days.', email: 'info@ariosetech.com', phone: '+92 300 9484 739', address: '95 College Road, Lahore' },
    schema: [
      { type: 'text', name: 'eyebrow',   label: 'Eyebrow' },
      { type: 'text', name: 'headline',  label: 'Headline' },
      { type: 'text', name: 'guarantee', label: 'Response guarantee text' },
      { type: 'text', name: 'email',     label: 'Email address' },
      { type: 'text', name: 'phone',     label: 'Phone / WhatsApp' },
      { type: 'text', name: 'address',   label: 'Physical address' },
    ],
  })

  // ── FAQ ──────────────────────────────────────────────────────
  registerSection({
    type: 'faq', label: 'FAQ Section', category: 'Elements', icon: '❓',
    component: FaqSection as C,
    defaultProps: {
      eyebrow: 'FAQ', headline: 'Frequently Asked Questions',
      items: [
        { q: 'How long does a WordPress website take?',       a: 'Most projects complete in 2-3 weeks. Complex builds may take 4-6 weeks.' },
        { q: 'What is included in your maintenance plans?',   a: 'Regular updates, security monitoring, backups, performance optimization, and priority support.' },
        { q: 'Do you offer a money-back guarantee?',          a: 'Yes — a 30-day money-back guarantee on all development projects.' },
        { q: 'Can you work with my existing WordPress site?', a: 'Absolutely. Redesigns, migrations, speed fixes, security, and feature additions.' },
        { q: 'Do you offer ongoing support after launch?',    a: '30 days free post-launch support included. Then flexible monthly plans from $79/mo.' },
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

  // ── CYBER TERMINAL ───────────────────────────────────────────
  registerSection({
    type: 'cyber-terminal', label: 'Cyber Terminal', category: 'Services', icon: '💻',
    component: CyberTerminalSection as C,
    defaultProps: { tagline: 'EMERGENCY RESPONSE', title: 'Virus Removal', desc: 'Emergency 24-48 hour service for infected sites. Complete malware scan, file cleaning, and Google Blacklist removal.', price: '$199', features: 'Malware Identification,Infected File Cleaning,Blacklist Removal,Security Hardening,30-Day Monitoring', statusText: 'root@ariosetech:~/malware_scanner' },
    schema: [
      { type: 'text',     name: 'tagline',    label: 'Upper tagline' },
      { type: 'text',     name: 'title',      label: 'Main title' },
      { type: 'textarea', name: 'desc',       label: 'Description' },
      { type: 'text',     name: 'price',      label: 'Starting price' },
      { type: 'text',     name: 'statusText', label: 'Terminal header text' },
      { type: 'textarea', name: 'features',   label: 'Features (comma separated)' },
    ],
  })

  // ── MAINTENANCE PLANS ────────────────────────────────────────
  registerSection({
    type: 'maintenance-plans', label: 'Pricing Plans', category: 'Services', icon: '💳',
    component: MaintenancePlansSection as C,
    defaultProps: {
      title: 'Maintenance & Support Plans', subtitle: 'Proactive care for your WordPress infrastructure.',
      plans: [
        { tier: 'Starter',      price: '$79/mo',  desc: 'Basic protection', features: 'Monthly Updates,Uptime Monitoring,Basic Security',   isPopular: false },
        { tier: 'Professional', price: '$149/mo', desc: 'High performance', features: 'Weekly Updates,Speed Optimization,Advanced Security', isPopular: true  },
        { tier: 'Business',     price: '$299/mo', desc: 'Full management',  features: 'Daily Updates,Priority Support,Full Backups',         isPopular: false },
      ],
    },
    schema: [
      { type: 'text', name: 'title',    label: 'Section title' },
      { type: 'text', name: 'subtitle', label: 'Subtitle' },
      { type: 'repeater', name: 'plans', label: 'Pricing tiers', fields: [
        { type: 'text',     name: 'tier',      label: 'Tier name' },
        { type: 'text',     name: 'price',     label: 'Price' },
        { type: 'text',     name: 'desc',      label: 'Short description' },
        { type: 'textarea', name: 'features',  label: 'Features (comma separated)' },
        { type: 'text',     name: 'ctaLabel',  label: 'Button label' },
        { type: 'text',     name: 'ctaHref',   label: 'Button URL' },
        { type: 'boolean',  name: 'isPopular', label: 'Most Popular badge?' },
      ]},
    ],
  })

  // ── SPEED SCORE ──────────────────────────────────────────────
  registerSection({
    type: 'speed-score', label: 'Speed Score Viz', category: 'Services', icon: '⚡',
    component: SpeedScoreSection as C,
    defaultProps: { title: 'Speed Optimization', desc: 'Improve site speed by 40-70%.', score: 99, statusLabel: 'CORE WEB VITALS PASS', metrics: [{ label: 'Investment', value: '$399' }, { label: 'Execution', value: '5-7 Days' }] },
    schema: [
      { type: 'text',     name: 'title',       label: 'Section title' },
      { type: 'textarea', name: 'desc',        label: 'Description' },
      { type: 'number',   name: 'score',       label: 'PageSpeed score (0-100)' },
      { type: 'text',     name: 'statusLabel', label: 'Status badge text' },
      { type: 'repeater', name: 'metrics',     label: 'Metrics / stats', fields: [
        { type: 'text', name: 'label', label: 'Label' },
        { type: 'text', name: 'value', label: 'Value' },
      ]},
    ],
  })

  // ── SERVICE VERTICAL (ZIGZAG) ────────────────────────────────
  registerSection({
    type: 'service-vertical', label: 'Service Vertical (Zigzag)', category: 'Services', icon: '📐',
    component: ServiceVerticalSection as C,
    defaultProps: { tagline: 'Scalable Solutions', title: 'Website Development', desc: 'Build your dream website from scratch with custom development that stands out.', features: 'Custom theme development,Responsive design,SEO-optimized structure,30-day money-back guarantee', price: '$799', timeline: '2-4 weeks', visualType: 'score', align: 'left', score: 99, statusLabel: 'Avg. Speed Score' },
    schema: [
      { type: 'text',     name: 'tagline',     label: 'Upper tagline' },
      { type: 'text',     name: 'title',       label: 'Main title' },
      { type: 'textarea', name: 'desc',        label: 'Description' },
      { type: 'textarea', name: 'features',    label: 'Features (comma separated)' },
      { type: 'text',     name: 'price',       label: 'Starting price' },
      { type: 'text',     name: 'timeline',    label: 'Execution timeline' },
      { type: 'select',   name: 'visualType',  label: 'Visual type', options: ['score', 'terminal', 'vitals', 'none'] },
      { type: 'select',   name: 'align',       label: 'Visual position', options: ['left', 'right'] },
      { type: 'number',   name: 'score',       label: 'Score (0-100)' },
      { type: 'text',     name: 'statusText',  label: 'Terminal header / alt label' },
      { type: 'text',     name: 'statusLabel', label: 'Badge label' },
      { type: 'repeater', name: 'metrics',     label: 'Specific metrics', fields: [{ type: 'text', name: 'label', label: 'Label' }, { type: 'text', name: 'value', label: 'Value' }] },
    ],
  })

  // ── SERVICE GRID (ADDITIONAL SOLUTIONS) ─────────────────────
  registerSection({
    type: 'service-grid', label: 'Service Grid (Solutions)', category: 'Services', icon: '▦',
    component: ServiceGridSection as C,
    defaultProps: {
      eyebrow: 'Tailored Services', headline: 'Additional Solutions',
      items: [
        { title: 'Security Services',  price: '$299', desc: 'Enterprise-grade security hardening.',           icon: '🛡️' },
        { title: 'Website Redesign',   price: '$599', desc: 'Modern makeover without losing SEO rankings.', icon: '🎨' },
        { title: 'Migration Services', price: '$199', desc: 'Zero-downtime transfers to any host.',          icon: '📦' },
      ],
    },
    schema: [
      { type: 'text', name: 'eyebrow',  label: 'Eyebrow' },
      { type: 'text', name: 'headline', label: 'Headline' },
      { type: 'repeater', name: 'items', label: 'Solution cards', fields: [
        { type: 'text',     name: 'title', label: 'Title' },
        { type: 'text',     name: 'price', label: 'Price' },
        { type: 'textarea', name: 'desc',  label: 'Description' },
        { type: 'text',     name: 'icon',  label: 'Icon (emoji or SVG string)' },
      ]},
    ],
  })
}
