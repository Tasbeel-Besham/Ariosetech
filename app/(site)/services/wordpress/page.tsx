/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import SchemaMarkup from '@/components/ui/SchemaMarkup'
import InteractiveHeroSection from '@/components/sections/InteractiveHeroSection'
import ApproachSection from '@/components/sections/ApproachSection'
import WhyUsSection from '@/components/sections/WhyUsSection'
import FaqSection from '@/components/sections/FaqSection'
import CtaSection from '@/components/sections/CtaSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import StatsSection from '@/components/sections/StatsSection'
import ServiceVerticalSection from '@/components/sections/ServiceVerticalSection'
import MaintenancePlansSection from '@/components/sections/MaintenancePlansSection'
import CyberTerminalSection from '@/components/sections/CyberTerminalSection'
import ServiceGridSection from '@/components/sections/ServiceGridSection'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Professional WordPress Development Services | ARIOSETECH',
    description: 'Custom WordPress development, speed optimisation, security hardening, maintenance, migration, and multilingual sites. Starting at $799. 30-day money-back guarantee.',
  }
}

// ── DATA ────────────────────────────────────────────────────────────

const STATS = [
  { value: '99', label: 'Avg PageSpeed Score' },
  { value: '150%', label: 'Avg Conversion Lift' },
  { value: '$799', label: 'Starting Price' },
  { value: '50+', label: 'WP Sites Managed' },
]

const MAINTENANCE_PLANS = [
  {
    tier: 'Basic',
    price: '$79/mo',
    desc: 'Essential maintenance for small business websites.',
    features: ['1 WordPress site', 'Monthly updates & backups', 'Basic security monitoring', 'Uptime monitoring', 'Email support'],
    ctaLabel: 'Choose Basic',
    ctaHref: '/contact',
    isPopular: false,
  },
  {
    tier: 'Professional',
    price: '$149/mo',
    desc: 'Comprehensive support for growing businesses.',
    features: ['Up to 3 WordPress sites', 'Weekly updates & backups', 'Advanced security features', 'Performance optimisation', 'Priority email & chat support', 'Monthly performance reports'],
    ctaLabel: 'Go Professional',
    ctaHref: '/contact',
    isPopular: true,
  },
  {
    tier: 'Enterprise',
    price: '$299/mo',
    desc: 'Total peace of mind for high-traffic & e-commerce sites.',
    features: ['Up to 10 WordPress sites', 'Real-time monitoring', 'Advanced security & malware removal', 'Speed optimisation', '24/7 priority support', 'Monthly performance reports'],
    ctaLabel: 'Contact Sales',
    ctaHref: '/contact',
    isPopular: false,
  },
]

const BACKUP_PLANS = [
  { tier: 'Basic Backup', price: '$29/mo', desc: 'Daily backups for small sites.', features: ['Daily automated backups', '30-day backup retention', 'One-click restore', 'Email notifications'], ctaLabel: 'Set Up Backups', ctaHref: '/contact', isPopular: false },
  { tier: 'Advanced Backup', price: '$59/mo', desc: 'Real-time backups for busy sites.', features: ['Real-time backups', '90-day backup retention', 'Multiple restore points', 'Priority restoration support', 'Multiple storage locations'], ctaLabel: 'Go Advanced', ctaHref: '/contact', isPopular: true },
  { tier: 'Enterprise Backup', price: '$99/mo', desc: 'Continuous backups for critical sites.', features: ['Continuous backups', '1-year retention', 'Instant recovery options', 'Dedicated backup support', 'Custom backup schedules'], ctaLabel: 'Contact Sales', ctaHref: '/contact', isPopular: false },
]

const ADDITIONAL_SERVICES = [
  { title: 'Bugs & Errors Fixing', price: '$149', desc: 'Fast resolution for White Screen of Death, 500 errors, plugin conflicts, and broken layouts. Diagnosed and fixed within 24-48 hours.', icon: '🔧' },
  { title: 'Security Services', price: '$299', desc: 'Enterprise-grade security hardening, firewall setup, malware removal, and 24/7 monitoring. Perfect for e-commerce and sensitive data sites.', icon: '🛡️' },
  { title: 'Website Redesign', price: '$1,299', desc: 'Modern makeover with improved UX, mobile-first design, and full SEO preservation. No rankings lost.', icon: '🎨' },
  { title: 'Multilingual Websites', price: '$899', desc: 'Full WPML, Polylang, or TranslatePress setup with language switcher, international SEO, and currency support.', icon: '🌐' },
  { title: 'Migration Services', price: '$299', desc: 'Zero-downtime migration from any platform or host. Complete SEO preservation with 301 redirects.', icon: '🚀' },
  { title: 'Backup Solutions', price: '$29/mo', desc: 'Automated daily backups with encrypted offsite storage and one-click restore functionality.', icon: '💾' },
]

const PROCESS_ITEMS = [
  { n: '01', title: 'DISCOVERY & PLANNING', sub: '2-3 DAYS', desc: 'Comprehensive requirement analysis, technical specifications, and project roadmap. We define goals, audience, and success criteria before writing a single line of code.' },
  { n: '02', title: 'DESIGN & DEVELOPMENT', sub: '1-3 WEEKS', desc: 'Custom theme creation, responsive implementation, and functionality development. Bringing your vision to life with clean, scalable, and well-documented code.' },
  { n: '03', title: 'TESTING & OPTIMISATION', sub: '3-5 DAYS', desc: 'Cross-browser and cross-device testing, speed optimisation, security hardening, and SEO validation to ensure a flawless, high-performing launch.' },
  { n: '04', title: 'LAUNCH & SUPPORT', sub: 'ONGOING', desc: 'Smooth deployment with training, documentation, and 30 days of free post-launch support. Optional ongoing maintenance plans available.' },
]

const WHY_ITEMS = [
  { title: '7+ Years WordPress Expertise', subhead: 'Delivering Since 2017', desc: 'We have been perfecting WordPress development since 2017, delivering 50+ successful projects across industries. Deep platform knowledge, not generalist dabbling.' },
  { title: 'Performance-First Development', subhead: '99/100 PageSpeed Standard', desc: 'Every WordPress site we build is optimised for speed, Core Web Vitals, and SEO from day one. Fast sites rank higher and convert more visitors into customers.' },
  { title: '60% Cost-Effective', subhead: 'Save Without Compromising', desc: 'Get premium WordPress development at a fraction of US or UK agency costs. The same quality, the same results, at honest transparent pricing.' },
  { title: '30-Day Money-Back Guarantee', subhead: 'Zero Risk for You', desc: 'If you are not satisfied with our work within 30 days of delivery, we refund you in full. No questions asked. That is how confident we are in what we deliver.' },
]

const TESTIMONIALS = [
  { name: 'Dr. Fred Sahafi', role: 'Founder of Genovie', initials: 'FS', quote: 'ARIOSETECH delivered an exceptional store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth.' },
  { name: 'Michael Chen', role: 'CEO of GeoMag World', initials: 'MC', quote: 'Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom solution that perfectly fits our business model.' },
  { name: 'Muhammad Hannan', role: 'Director of Janya.pk', initials: 'MH', quote: 'Fast, reliable, and cost-effective. ARIOSETECH helped us launch ahead of schedule and under budget. The team is always available when we need them.' },
]

const FAQS = [
  { q: 'How long does WordPress development take?', a: 'Most WordPress websites are completed within 2-4 weeks. Simple business sites take 2-3 weeks. Complex custom builds with advanced functionality take 4-6 weeks. We always provide realistic timelines upfront.' },
  { q: 'Do you use page builders like Elementor?', a: 'We prefer custom theme development for better performance and SEO, but can work with Elementor, Gutenberg, or any page builder if you prefer or already have one installed.' },
  { q: 'Can you work with my existing WordPress site?', a: 'Absolutely. We handle redesigns, migrations, speed optimisation, security fixes, plugin conflicts, bug fixing, and adding new features to existing WordPress sites.' },
  { q: 'What is included in post-launch support?', a: 'Every project includes 30 days of free support covering bug fixes and minor adjustments. After that, we offer monthly maintenance plans starting at $79/month.' },
  { q: 'Do you offer a money-back guarantee?', a: 'Yes — a 30-day money-back guarantee on all WordPress development projects. If you are not satisfied, we will refund you in full, no questions asked.' },
  { q: 'How much does WordPress maintenance cost?', a: 'Our WordPress maintenance plans start at $79/month and include updates, backups, security monitoring, uptime monitoring, and priority support. Plans cover 1 to 10 sites.' },
]

// ── PAGE ────────────────────────────────────────────────────────────

export default function WordPressPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SchemaMarkup
        type="Service"
        pageUrl="/services/wordpress"
        pageName="WordPress Development Services"
        pageDescription="Custom WordPress development, speed optimisation, security hardening, maintenance, migration, and multilingual sites. Starting at $799."
        faqs={FAQS}
      />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <InteractiveHeroSection
        eyebrow="WordPress Services"
        headline="Professional WordPress"
        subheadline="Development Services"
        desc="From simple business websites to complex enterprise platforms, we create WordPress sites that drive results. Trusted by 50+ businesses worldwide for speed, security, and scalability."
        trust="Custom Development — Tailored to your exact needs,Lightning Fast — Optimized for Core Web Vitals,100% Secure — Enterprise-grade security,SEO-Ready — Built for search engine success,24/7 Support — Always here when you need us"
        ctaPrimaryLabel="Get Free WordPress Consultation"
        ctaPrimaryHref="/contact"
        ctaSecondaryLabel="View WordPress Portfolio"
        ctaSecondaryHref="/portfolio"
        liveSiteText="WordPress site deployed 🚀"
        codeFilename="wp-content/themes/custom/functions.php"
      />

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <StatsSection items={STATS} />

      {/* ── FLAGSHIP: WEBSITE DEVELOPMENT ───────────────────────────── */}
      <ServiceVerticalSection
        id="development"
        tagline="Custom Development"
        title="WordPress Website Development"
        desc="Build your dream website from scratch. Transform your vision into a stunning, high-performing WordPress website. Our custom development approach ensures your site stands out while delivering exceptional user experience and measurable business results."
        features="Custom theme development from your designs,Responsive design across all devices,SEO-optimized structure and content,Contact forms and lead generation tools,Google Analytics setup,Basic on-page SEO optimization,30 days of free post-launch support"
        price="$799"
        timeline="2-3 weeks"
        visualType="score"
        align="left"
        score={99}
        statusLabel="CORE WEB VITALS PASS"
        metrics={[{ label: 'Investment', value: '$799' }, { label: 'Timeline', value: '2-3 weeks' }]}
      />

      {/* ── SECURITY & VIRUS REMOVAL ─────────────────────────────────── */}
      <ServiceVerticalSection
        id="virus-removal"
        tagline="Emergency Response"
        title="Security & Virus Removal"
        desc="Is your WordPress site infected with malware or showing security warnings? We provide emergency malware removal services within 24-48 hours — cleaning all infected files, removing from Google Blacklist, hardening security, and installing 30-day post-removal monitoring."
        features="Immediate site analysis & infection identification,Complete malware scan and removal,Infected file cleaning or replacement,Database cleanup and optimization,Google Safe Browsing blacklist removal,Security hardening to prevent reinfection,30-day monitoring period"
        price="$199"
        timeline="24-48 hours"
        visualType="terminal"
        align="right"
        statusText="root@ariosetech:~/malware_scanner"
      />

      {/* ── SPEED OPTIMISATION ───────────────────────────────────────── */}
      <ServiceVerticalSection
        id="speed"
        tagline="Extreme Performance"
        title="WordPress Speed Optimization"
        desc="Slow websites lose customers and hurt search rankings. Our speed optimisation service can improve your site speed by 40-70%, leading to better user experience, higher conversions, and improved Google rankings. We provide detailed before/after reports."
        features="Comprehensive speed audit and analysis,Image optimization and WebP conversion,Caching implementation and configuration,Database optimization and cleanup,CSS and JavaScript minification,CDN setup and configuration,Core Web Vitals optimization,Mobile speed improvements"
        price="$399"
        timeline="5-7 days"
        visualType="vitals"
        align="left"
        statusLabel="PERFORMANCE OPTIMISED"
        score={99}
        metrics={[{ label: 'Speed Improvement', value: '40-70%' }, { label: 'Timeline', value: '5-7 days' }]}
      />

      {/* ── MIGRATION ────────────────────────────────────────────────── */}
      <ServiceVerticalSection
        id="migration"
        tagline="Zero Downtime"
        title="WordPress Migration Services"
        desc="Moving to WordPress or changing hosts? We handle the entire migration process while ensuring zero data loss and minimal downtime. Your SEO rankings and user experience remain fully intact — whether you are migrating from Wix, Squarespace, another host, or staging to live."
        features="Complete site backup and migration,Domain and hosting setup assistance,SSL certificate installation,Email migration if required,Speed and performance optimization,SEO preservation with 301 redirects,Testing across all devices,14 days of post-migration support"
        price="$299"
        timeline="3-5 days"
        visualType="score"
        align="right"
        score={100}
        statusLabel="ZERO DATA LOSS"
        metrics={[{ label: 'Investment', value: '$299' }, { label: 'Timeline', value: '3-5 days' }]}
      />

      {/* ── BACKUP SOLUTIONS ─────────────────────────────────────────── */}
      <ServiceVerticalSection
        id="backup"
        tagline="Data Protection"
        title="WordPress Backup Solutions"
        desc="Never lose your WordPress data again. Our automated backup solutions run silently in the background, storing encrypted copies of your entire site in multiple secure offsite locations — with one-click restore whenever you need it."
        features="Automated daily or real-time backups,Multiple secure offsite storage locations,One-click restore functionality,Database and file backups,Incremental backup options,Encrypted secure storage,Easy backup management dashboard"
        price="$29/mo"
        timeline="Ongoing"
        visualType="score"
        align="left"
        score={100}
        statusLabel="BACKUP VERIFIED"
        metrics={[{ label: 'Starting from', value: '$29/mo' }, { label: 'Retention', value: '30–365 days' }]}
      />

      {/* ── MULTILINGUAL ─────────────────────────────────────────────── */}
      <ServiceVerticalSection
        id="multilingual"
        tagline="Global Reach"
        title="WordPress Multilingual Websites"
        desc="Expand your business globally with a professionally developed multilingual WordPress website. We support WPML, Polylang, and TranslatePress with full SEO configuration for each language, automatic language detection, currency switching, and RTL support."
        features="Multiple language setup and configuration,Professional translation management,SEO optimization for each language,Currency switcher integration,Language-specific content management,Automatic language detection,Multilingual menu and navigation,International SEO setup"
        price="$899"
        timeline="2-3 weeks"
        visualType="vitals"
        align="right"
        statusLabel="GLOBAL READY"
        metrics={[{ label: 'Investment', value: '$899' }, { label: 'Timeline', value: '2-3 weeks' }]}
      />

      {/* ── REDESIGN ─────────────────────────────────────────────────── */}
      <ServiceVerticalSection
        id="redesign"
        tagline="Fresh Start"
        title="WordPress Website Redesign"
        desc="Is your WordPress site looking outdated? Our redesign service transforms your existing site with modern design, improved UX, and better performance — without losing your SEO rankings or existing content. We audit, plan, design, build, and migrate everything."
        features="Current site audit and competitor analysis,Modern conversion-focused design,UX and navigation overhaul,Mobile-first responsive design,Content migration and optimisation,SEO preservation throughout,Speed optimization included,30 days of post-launch support"
        price="$1,299"
        timeline="3-4 weeks"
        visualType="score"
        align="left"
        score={98}
        statusLabel="UX OPTIMISED"
        metrics={[{ label: 'Investment', value: '$1,299' }, { label: 'Timeline', value: '3-4 weeks' }]}
      />

      {/* ── MAINTENANCE PLANS ────────────────────────────────────────── */}
      <MaintenancePlansSection
        title="WordPress Maintenance & Support Plans"
        subtitle="Proactive care for your WordPress infrastructure."
        plans={MAINTENANCE_PLANS}
      />

      {/* ── BACKUP PLANS ─────────────────────────────────────────────── */}
      <MaintenancePlansSection
        title="WordPress Backup Plans"
        subtitle="Automated backup and recovery solutions."
        plans={BACKUP_PLANS}
      />

      {/* ── SECURITY TERMINAL ────────────────────────────────────────── */}
      <CyberTerminalSection
        tagline="Cyber Defense"
        title="Security Services & Hardening"
        desc="Protect your WordPress site from hackers, malware, and data breaches with enterprise-grade security. Ideal for e-commerce sites and businesses handling sensitive data."
        price="$299"
        features="Malware scanning and removal,Firewall installation and configuration,Login security enhancements,File permission optimization,SSL certificate installation,Security headers implementation,24/7 threat monitoring,Weekly security reports"
        statusText="root@ariosetech:~/security_audit"
      />

      {/* ── ADDITIONAL SERVICES GRID ─────────────────────────────────── */}
      <ServiceGridSection
        eyebrow="Tailored Services"
        headline="Additional WordPress Solutions"
        items={ADDITIONAL_SERVICES}
      />

      {/* ── OUR PROCESS ──────────────────────────────────────────────── */}
      <ApproachSection
        eyebrow="Our Process"
        headline="How It "
        scrambleWord="Works"
        items={PROCESS_ITEMS}
      />

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <WhyUsSection
        eyebrow="Why ARIOSETECH"
        headline="Why Choose ARIOSETECH for WordPress?"
        items={WHY_ITEMS}
      />

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <TestimonialsSection
        eyebrow="Client Reviews"
        headline="What Our Clients Say"
        items={TESTIMONIALS}
      />

      {/* ── PORTFOLIO ────────────────────────────────────────────────── */}
      <section className="section" style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '600px' }}>
              <p className="eyebrow">Proven Results</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800 }}>WordPress Portfolio & Case Studies</h2>
              <p style={{ color: 'var(--text-2)', marginTop: '12px', lineHeight: 1.7 }}>
                Real results from real WordPress sites we have built, optimised, and grown.
              </p>
            </div>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View All Projects</Link>
          </div>
          <div className="g-3">
            {[
              { title: 'Snap Glammed Spa', desc: 'Luxury spa with online booking, gift cards, and loyalty program. Online bookings increased 400% in the first quarter.', site: 'snapglammedspa.com', result: '+400% Bookings' },
              { title: 'CTV Promo', desc: 'Promotional products company with custom quote system and HubSpot CRM integration. Saves the team 5 hours per day.', site: 'ctvpromo.com', result: '-80% Manual Work' },
              { title: 'Ocean Tech BPO', desc: 'Global BPO company with animated corporate site, services matrix, and multi-region lead capture. Enterprise leads tripled.', site: 'oceantech-globalbpo.com', result: '+200% Enterprise Leads' },
            ].map((item, i) => (
              <div key={i} className="sr card card-hover" style={{ padding: '32px' }}>
                <div style={{ background: 'var(--bg-3)', borderRadius: '16px', padding: '40px 24px', textAlign: 'center', marginBottom: '24px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--primary)', fontWeight: 800 }}>{item.result}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '12px', lineHeight: 1.6 }}>{item.desc}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>{item.site}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <FaqSection
        eyebrow="WordPress FAQ"
        headline="Frequently Asked Questions"
        items={FAQS}
      />

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <CtaSection
        eyebrow="Get Started Today"
        headline="Ready to Build Your WordPress Site?"
        desc="Get a free consultation and detailed project quote within 24 hours. No commitment required. 30-day money-back guarantee on all projects."
        trust="No Long-Term Contracts,30-Day Money-Back Guarantee,Free Post-Launch Support,Transparent Pricing"
        ctaLabel="Get Free Consultation"
        ctaHref="/contact"
        secondaryLabel="View Our Portfolio"
        secondaryHref="/portfolio"
      />

    </main>
  )
}
