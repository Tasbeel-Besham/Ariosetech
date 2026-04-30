/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { getCollection } from '@/lib/db/mongodb'
import { ServicePageDoc } from '@/types'
import ServicesAccordionSection from '@/components/builder/sections/ServicesAccordionSection'
import ApproachSection from '@/components/sections/ApproachSection'

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const
const P  = { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as const

const ArrowSVG = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const CheckSVG = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ── ICONS ─────────────────────────────────────────────────── */
const TargetSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const SyncSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
  </svg>
)
const PracticalSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const ChartSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)
const StoreSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const ToolSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
)
const WP_SVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
  </svg>
)
const ShopifySVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const Woo_SVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const ChevSVG = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.25s', flexShrink: 0 }}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)


/* ── SERVICES (from Doc) ──────────────────────────────────────── */
const SEO_SERVICES = [
  {
    id: 'website-seo',
    number: '01',
    title: 'Website SEO',
    tagline: 'Website SEO That Strengthens Your Foundation',
    desc: 'We improve the on-page SEO and structural setup of your website so search engines can better understand your content and users can move through your site more clearly. This includes heading structure, metadata, content optimization, internal linking, page targeting, keyword mapping, and overall SEO alignment.',
    features: [
      'On-page SEO improvements',
      'Page-level optimization',
      'Heading and content structure',
      'Metadata optimization',
      'Internal linking strategy',
      'Keyword targeting and mapping',
    ],
    color: 'var(--primary)',
  },
  {
    id: 'local-seo',
    number: '02',
    title: 'Local SEO',
    tagline: 'Local SEO That Brings More Calls and Leads',
    desc: 'For local businesses, visibility in your service areas matters. We help improve your local presence through Google Business Profile optimization, local landing pages, service-area targeting, on-page local signals, and stronger geographic relevance across your website.',
    features: [
      'Google Business Profile optimization',
      'Local keyword targeting',
      'City and service-area pages',
      'Local on-page SEO',
      'Location-based content support',
      'Better visibility for local intent searches',
    ],
    color: 'var(--primary)',
  },
  {
    id: 'technical-seo',
    number: '03',
    title: 'Technical SEO',
    tagline: 'Technical SEO That Fixes What Holds You Back',
    desc: 'Many websites struggle to rank because of technical problems happening behind the scenes. We identify and fix issues related to crawlability, indexing, site speed, mobile usability, page structure, duplicates, and weak internal architecture so your website performs better in search.',
    features: [
      'Technical SEO audits',
      'Crawl and indexing fixes',
      'Page speed improvement recommendations',
      'Mobile usability checks',
      'Site structure improvements',
      'Duplicate and thin content review',
    ],
    color: 'var(--primary)',
  },
  {
    id: 'seo-content',
    number: '04',
    title: 'SEO Content',
    tagline: 'SEO Content That Builds Topical Strength',
    desc: 'We help businesses create and improve content that supports rankings, search intent, and topical authority. This includes service page optimization, blog strategy, content planning, keyword clustering, and search-focused content improvements that help your site compete more effectively.',
    features: [
      'SEO content strategy',
      'Service page optimization',
      'Blog topic planning',
      'Keyword clustering',
      'Content updates and refreshes',
      'Content structure for search intent',
    ],
    color: 'var(--primary)',
  },
]

const FAQS = [
  { q: 'What SEO services does Ariosetech offer?',    a: 'We offer website SEO, local SEO, technical SEO, and SEO content support. This includes on-page optimization, technical fixes, local search improvements, and content strategy built to improve rankings and business visibility.' },
  { q: 'Is SEO worth it for small businesses?',       a: 'Yes. SEO helps small businesses show up when potential customers are actively searching for their services. It can improve visibility, bring qualified traffic, and support long-term growth without depending only on paid ads.' },
  { q: 'How long does SEO take to show results?',     a: 'SEO usually takes time because rankings depend on competition, website condition, content quality, and technical setup. Some improvements can be seen earlier, but strong SEO results usually build over months, not days.' },
  { q: 'Do you offer local SEO services?',            a: 'Yes. We help local businesses improve visibility through Google Business Profile optimization, service-area targeting, local page structure, and stronger on-page local signals.' },
  { q: 'Can you fix technical SEO issues on my website?', a: 'Yes. We can review and improve crawl issues, indexing problems, speed-related blockers, mobile usability, internal structure, and other technical factors affecting search performance.' },
  { q: 'Do you also help with SEO content?',          a: "Yes. We help with service page optimization, blog planning, keyword clustering, content updates, and search-focused content strategy to strengthen your site's topical coverage." },
]

export default async function SEOPage() {
  let dbData: Partial<ServicePageDoc> | null = null
  try {
    const col = await getCollection<ServicePageDoc>('services')
    dbData = await col.findOne({ slug: 'seo' })
  } catch {}

  const activeServices = dbData?.services?.length ? dbData.services : SEO_SERVICES
  const activeFaqs = dbData?.faqs?.length ? dbData.faqs : FAQS
  const activeWhyUs = dbData?.whyUs?.length ? dbData.whyUs : [
    { icon: <TargetSVG />,    title: 'Business-First SEO', desc: 'We focus on visibility that supports real business outcomes, not just traffic numbers.' },
    { icon: <SyncSVG />,      title: 'Development and SEO in Sync', desc: 'Because our team works across websites, structure, and performance, we can align SEO with how your site is actually built.' },
    { icon: <PracticalSVG />, title: 'Clean, Practical Execution', desc: 'We focus on the changes that make the biggest impact without creating confusion or unnecessary complexity.' },
    { icon: <ChartSVG />,     title: 'Long-Term Growth Thinking', desc: 'We build SEO in a way that supports stronger performance over time, not just short-term spikes.' },
    { icon: <StoreSVG />,     title: 'Support for Different Business Types', desc: 'We work with service businesses, local brands, and eCommerce companies that need stronger digital visibility.' },
  ]
  const heroData = dbData?.hero || {
    eyebrow: 'SEO Services for Growing Brands',
    headline: 'SEO Services That Help',
    subheadline: 'Your Business Get Found',
    desc: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance. From technical fixes to local SEO and content strategy, we build a stronger search presence that supports real business growth.',
    bullets: ['Website SEO', 'Local SEO', 'Technical SEO', 'SEO Content'],
    ctaPrimary: 'Book a Free SEO Consultation',
    ctaSecondary: 'Get a Website Audit',
    startingPrice: ''
  }

  // Map services to accordion format
  const seoTabItems = activeServices.map((svc: any, i: number) => {
    const labels = ['Website', 'Local', 'Technical', 'Content'];
    const icons = [
      <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
      <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
      <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    ];
    const bgs = [
      'radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 90% 10%, rgba(80,60,220,0.18) 0%, transparent 50%), linear-gradient(160deg,#0c0a1c,#05050a)',
      'radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 10%, rgba(60,50,200,0.18) 0%, transparent 50%), linear-gradient(160deg,#08081a,#05050a)',
      'radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% -10%, rgba(90,80,240,0.16) 0%, transparent 50%), linear-gradient(160deg,#0a0818,#05050a)',
      'radial-gradient(ellipse 70% 70% at 20% 20%, rgba(118,108,255,0.30) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(80,70,220,0.18) 0%, transparent 50%), linear-gradient(160deg,#08081a,#05050a)',
    ];

    return {
      id: svc.id || i,
      label: labels[i] || 'SEO',
      title: svc.title,
      sub: svc.tagline,
      desc: svc.desc,
      features: svc.features,
      price: 'Custom',
      href: '/contact',
      bg: bgs[i] || bgs[0],
      icon: icons[i] || icons[0],
    };
  });

  // Map SEO Process to ApproachSection format
  const seoProcessItems = [
    { n: '01', title: 'Audit',        sub: 'Strengthening Your Foundation', desc: 'We review your website, search presence, content, and technical condition to understand what is holding performance back.', time: '1-2 days' },
    { n: '02', title: 'Strategy',     sub: 'Tailored Growth Roadmap',       desc: 'We build an SEO plan based on your business model, audience, goals, and search opportunities.', time: '2-3 days' },
    { n: '03', title: 'Optimization', sub: 'Improving Search Visibility',    desc: 'We improve your pages, structure, technical setup, content targeting, and internal SEO foundation.', time: '10-15 days' },
    { n: '04', title: 'Content & Growth', sub: 'Building Topical Strength', desc: 'Where needed, we build supporting content, improve weak pages, and strengthen site-wide relevance.', time: 'Ongoing' },
    { n: '05', title: 'Ongoing Improvement', sub: 'Data-Driven Success',    desc: 'SEO is not static. We continue refining based on performance, search trends, and growth priorities.', time: 'Monthly' },
  ]

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)', paddingTop: '72px', paddingBottom: '64px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50%', height: '70%', background: 'radial-gradient(ellipse, rgba(79,110,247,0.12) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px 5px 10px', borderRadius: '20px', background: 'rgba(79,110,247,0.08)', border: '1px solid rgba(79,110,247,0.2)', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />
            <span style={{ ...hm, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{heroData.eyebrow}</span>
          </div>

          <h1 style={{ ...hs, fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em', marginBottom: '8px', maxWidth: '800px' }}>
            {heroData.headline}
          </h1>
          <h1 style={{ ...hs, fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em', marginBottom: '24px', maxWidth: '800px', ...P }}>
            {heroData.subheadline}
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '600px', marginBottom: '32px' }}>
            {heroData.desc}
          </p>

          {/* Trust strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '36px' }}>
            {heroData.bullets?.map((b: string) => (
              <span key={b} style={{ ...hm, fontSize: '11px', color: 'var(--primary)', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.2)', borderRadius: '20px', padding: '5px 14px', fontWeight: 700, letterSpacing: '0.06em' }}>{b}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">{heroData.ctaPrimary} <ArrowSVG size={16} /></Link>
            <Link href="/contact?audit=1" className="btn btn-outline btn-lg">{heroData.ctaSecondary}</Link>
          </div>
        </div>
      </section>

      {/* ── INTRO ─────────────────────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div className="sr">
              <p className="eyebrow">Our Approach</p>
              <h2 style={{ ...hs, fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px' }}>
                SEO That Supports <span style={P}>Real Growth</span>
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '20px' }}>
                Ranking on Google is not just about adding keywords to a page. Strong SEO comes from the right structure, better content, technical health, internal linking, local relevance, and a website that actually deserves to rank.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.85, marginBottom: '20px' }}>
                At Ariosetech, we take a business-first approach to SEO. That means we do not chase vanity traffic or empty rankings. We focus on the type of visibility that helps your brand attract the right audience, bring in qualified traffic, and create more opportunities for leads and sales.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.85 }}>
                Whether you run a local business, a service-based company, or an eCommerce brand, we build SEO strategies around your goals, website condition, and growth stage.
              </p>
            </div>
            <div className="sr" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '24px', padding: '40px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'var(--grad)' }} />
              <p style={{ ...hs, fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>Why SEO Still Matters</p>
              <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.8, marginBottom: '24px' }}>
                Search is still one of the strongest channels for long-term digital growth. When your business ranks for the right searches, you build visibility, trust, and steady traffic without relying only on paid ads.
              </p>
              <p style={{ ...hm, fontSize: '11px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>A strong SEO setup helps your business:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Show up when customers are actively searching',
                  'Build trust through better visibility',
                  'Attract more qualified traffic',
                  'Improve lead generation over time',
                  'Support long-term growth with compounding results',
                ].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '3px', display:'flex' }}><CheckSVG size={14} /></span> {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <ServicesAccordionSection 
        eyebrow="Our SEO Services"
        headline="Our SEO Services"
        intro="We offer focused SEO solutions built to improve search visibility, site performance, and growth potential."
        items={seoTabItems}
      />

      {/* ── WHY ARIOSETECH ──────────────────────────────────────────── */}
      <section className="section" style={{ overflow: 'visible' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            {/* Left - Sticky */}
            <div className="sr" style={{ position: 'sticky', top: '100px' }}>
              <p className="eyebrow">Why Choose Us</p>
              <h2 style={{ ...hs, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px' }}>
                Why Businesses Choose <span style={P}>ARIOSETECH</span> for SEO
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '32px' }}>
                SEO works best when strategy, structure, and execution move in the same direction. That is why our work connects technical improvements, content decisions, website structure, and growth goals instead of treating SEO like a checklist.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Start a Project <ArrowSVG size={16} /></Link>
            </div>

            {/* Right - Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeWhyUs.map((r: any, i: number) => (
                <div key={r.title} className="sr" style={{ display: 'flex', gap: '20px', padding: '28px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', transition: 'all 0.3s var(--ease)', animationDelay: `${i * 0.08}s` }}>
                  <div style={{ flexShrink: 0, width: '52px', height: '52px', borderRadius: '14px', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    {r.icon}
                  </div>
                  <div>
                    <p style={{ ...hs, fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{r.title}</p>
                    <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.75 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEMS WE SOLVE ──────────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div className="sr">
              <p className="eyebrow">Common Issues</p>
              <h2 style={{ ...hs, fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '20px' }}>
                Common SEO Problems <span style={P}>We Help Fix</span>
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>
                Many businesses come to us with the same core issues. Their website is live, but growth is slow and search visibility is weak.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Your website is not ranking for important keywords',
                  'You are getting traffic, but not qualified leads',
                  'Your service pages are weak or under-optimized',
                  'Your website has technical SEO issues',
                  'Your local business is not showing in local search results',
                  'Your content lacks structure or depth',
                  'Your pages are not connected properly through internal links',
                  'Your competitors are outranking you consistently',
                ].map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '14px', fontSize: '14px', color: 'var(--text-2)', transition:'all 0.2s var(--ease)' }}>
                    <span style={{ color: 'var(--primary)', display:'flex' }}><CheckSVG size={14} /></span> {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Who We Work With */}
            <div className="sr">
              <p className="eyebrow">Who We Work With</p>
              <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                Who Our SEO Services <span style={P}>Are For</span>
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '28px' }}>
                Our SEO services are designed for businesses that want more than surface-level optimization. We work best with brands that want a stronger digital foundation and are ready to improve visibility with the right strategy.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                {['Local service businesses', 'Agencies and consultants', 'eCommerce brands', 'Startups and growing companies', 'Businesses with underperforming websites', 'Brands needing technical SEO and content support'].map(who => (
                  <div key={who} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--text-2)', fontWeight: 500 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckSVG size={10} />
                    </div>
                    {who}
                  </div>
                ))}
              </div>

              {/* Results */}
              <div style={{ background: 'linear-gradient(145deg, rgba(118,108,255,0.08) 0%, rgba(10,10,18,0.4) 100%)', border: '1px solid rgba(118,108,255,0.2)', borderRadius: '24px', padding: '36px', position:'relative' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'var(--grad)' }} />
                <p style={{ ...hs, fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>What Better SEO Can Do for Your Business</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {['Stronger search visibility', 'Better keyword reach', 'Improved local presence', 'More qualified traffic', 'Better lead potential', 'Stronger content foundation', 'Healthier website structure'].map(r => (
                    <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-2)' }}>
                      <span style={{ color: 'var(--primary)', flexShrink: 0, display:'flex' }}><CheckSVG size={12} /></span> {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ────────────────────────────────────────────────── */}
      <ApproachSection title="Our SEO Process" processItems={seoProcessItems} />

      {/* ── SEO + WEBSITE ALIGNMENT ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, rgba(79,110,247,0.1) 0%, rgba(118,108,255,0.05) 100%)', border: '1px solid rgba(118,108,255,0.15)', borderRadius: '32px', padding: 'clamp(40px,6vw,80px)', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '80px', alignItems: 'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'40%', height:'60%', background:'radial-gradient(ellipse, rgba(118,108,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
            
            <div className="sr">
              <p className="eyebrow">Website & SEO Together</p>
              <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '24px' }}>
                SEO Works Better When Your Website Is <span style={P}>Built Right</span>
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '20px' }}>
                One of the biggest SEO problems businesses face is trying to grow search traffic on top of a weak website foundation. Poor structure, slow speed, weak UX, and disconnected content can limit results no matter how many keywords you target.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.85 }}>
                Because Ariosetech works across web development, Shopify, WordPress, SEO, and automation, we can improve SEO with a broader understanding of how digital performance actually works.
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginTop:'32px', padding:'16px 20px', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', borderRadius:'14px', width:'fit-content' }}>
                <ToolSVG />
                <p style={{ ...hm, fontSize: '12px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  SEO is stronger when the website supports growth.
                </p>
              </div>
            </div>

            <div className="sr" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              {[
                { icon: <WP_SVG />, label: 'WordPress Development', href: '/services/wordpress', desc: 'Custom themes built for speed and crawlability.' },
                { icon: <ShopifySVG />, label: 'Shopify Development', href: '/services/shopify', desc: 'E-commerce SEO that drives organic sales.' },
                { icon: <Woo_SVG />, label: 'WooCommerce Development', href: '/services/woocommerce', desc: 'Scalable store structures with clean code.' },
              ].map((link, i) => (
                <Link key={link.href} href={link.href}
                  className="card-hover"
                  style={{ display: 'flex', gap: '20px', padding: '24px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', textDecoration: 'none', transition: 'all 0.3s var(--ease)', animationDelay:`${i*0.1}s` }}>
                  <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-soft)', border: '1px solid rgba(118,108,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    {link.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ ...hs, fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{link.label}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5 }}>{link.desc}</p>
                  </div>
                  <div style={{ color:'var(--text-3)', marginTop:'4px' }}><ArrowSVG size={16} /></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="section section--dark" style={{ overflow: 'visible' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            {/* Left - Sticky */}
            <div className="sr" style={{ position: 'sticky', top: '100px' }}>
              <p className="eyebrow">FAQ</p>
              <h2 style={{ ...hs, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px' }}>
                SEO Questions <span style={P}>Answered</span>
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>
                Everything you need to know about our SEO approach and how we help businesses grow organic visibility.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Book a Free Consultation <ArrowSVG size={16} /></Link>
            </div>

            {/* Right - Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeFaqs.map(({ q, a }: any, i: number) => (
                <div key={i} className="sr" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s var(--ease)', animationDelay:`${i*0.06}s` }}>
                  <details style={{ width:'100%' }}>
                    <summary style={{ padding: '24px 28px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      <span style={{ ...hs, fontSize: '16px', fontWeight: 700, color: '#fff', flex: 1, lineHeight: 1.4 }}>{q}</span>
                      <div style={{ color:'var(--primary)', flexShrink:0 }}><ChevSVG open={false} /></div>
                    </summary>
                    <div style={{ padding: '0 28px 24px' }}>
                      <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8 }}>{a}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(118,108,255,0.1) 0%, transparent 80%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)', pointerEvents: 'none', opacity: 0.3 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sr">
            <p className="eyebrow" style={{ justifyContent:'center' }}>Get Started Today</p>
            <h2 style={{ ...hs, fontSize: 'clamp(2.4rem,6vw,4.5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.05em', marginBottom: '24px', color:'#fff' }}>
              Ready to Improve Your<br />
              <span style={P}>Search Visibility?</span>
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.8 }}>
              Whether you need technical fixes, stronger local SEO, better website optimization, or a content strategy that supports rankings, Ariosetech is ready to help.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary btn-lg">Book a Free SEO Consultation <ArrowSVG size={16} /></Link>
              <Link href="/contact?audit=1" className="btn btn-outline btn-lg">Get a Website Audit</Link>
            </div>
            <p style={{ ...hm, fontSize: '12px', color: 'var(--text-3)', marginTop: '32px', fontStyle: 'italic', letterSpacing:'0.05em' }}>
              Tell us where your website stands, and we&apos;ll help you map the next move.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
