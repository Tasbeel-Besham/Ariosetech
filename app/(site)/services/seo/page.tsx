import Link from 'next/link'
import { getCollection } from '@/lib/db/mongodb'
import { ServicePageDoc } from '@/types'

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
    { icon: '🎯', title: 'Business-First SEO', desc: 'We focus on visibility that supports real business outcomes, not just traffic numbers.' },
    { icon: '⚙️', title: 'Development and SEO in Sync', desc: 'Because our team works across websites, structure, and performance, we can align SEO with how your site is actually built.' },
    { icon: '✅', title: 'Clean, Practical Execution', desc: 'We focus on the changes that make the biggest impact without creating confusion or unnecessary complexity.' },
    { icon: '📈', title: 'Long-Term Growth Thinking', desc: 'We build SEO in a way that supports stronger performance over time, not just short-term spikes.' },
    { icon: '🏪', title: 'Support for Different Business Types', desc: 'We work with service businesses, local brands, and eCommerce companies that need stronger digital visibility.' },
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
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <p className="eyebrow">Our Approach</p>
              <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                SEO That Supports Real Growth
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
            <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px' }}>
              <p style={{ ...hs, fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>Why SEO Still Matters</p>
              <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.8, marginBottom: '20px' }}>
                Search is still one of the strongest channels for long-term digital growth. When your business ranks for the right searches, you build visibility, trust, and steady traffic without relying only on paid ads.
              </p>
              <p style={{ ...hm, fontSize: '11px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>A strong SEO setup helps your business:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Show up when customers are actively searching',
                  'Build trust through better visibility',
                  'Attract more qualified traffic',
                  'Improve lead generation over time',
                  'Support long-term growth with compounding results',
                ].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px', display:'flex' }}><CheckSVG size={14} /></span> {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p className="eyebrow">Our SEO Services</p>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Our SEO Services
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '56px' }}>
            We offer focused SEO solutions built to improve search visibility, site performance, and growth potential.
          </p>

          {activeServices.map((svc: Record<string, unknown>) => (
            <div key={svc.id} id={svc.id} style={{ marginBottom: '40px', scrollMarginTop: '90px' }}>
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <div style={{ height: '3px', background: `linear-gradient(90deg, var(--primary), rgba(118,108,255,0.6))` }} />
                <div style={{ padding: '36px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flexShrink: 0 }}>
                      <p style={{ ...hs, fontSize: 'clamp(3rem,4vw,4rem)', fontWeight: 800, color: `rgba(118,108,255,0.22)`, lineHeight: 1, userSelect: 'none' }}>{svc.number}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ ...hs, fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{svc.title}</h3>
                      <p style={{ ...hs, fontSize: '14px', fontWeight: 600, color: 'var(--primary)', marginBottom: '16px' }}>{svc.tagline}</p>
                      <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.85, marginBottom: '24px', maxWidth: '720px' }}>{svc.desc}</p>
                      <p style={{ ...hm, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '12px' }}>{"What's Included:"}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px 24px', marginBottom: '24px' }}>
                        {svc.features.map((f: string) => (
                          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '13px', color: 'var(--text-2)' }}>
                            <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px', display:'flex' }}><CheckSVG size={13} /></span> {f}
                          </div>
                        ))}
                      </div>
                      <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', borderRadius: '9px', background: `rgba(118,108,255,0.15)`, border: `1px solid rgba(118,108,255,0.4)`, color: 'var(--primary)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                        Get Started <ArrowSVG size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ARIOSETECH ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <p className="eyebrow">Why Choose Us</p>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Why Businesses Choose Ariosetech for SEO
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '600px', marginBottom: '48px' }}>
            SEO works best when strategy, structure, and execution move in the same direction. That is why our work connects technical improvements, content decisions, website structure, and growth goals instead of treating SEO like a checklist.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {activeWhyUs.map((r: Record<string, unknown>) => (
              <div key={r.title} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', transition: 'border-color 0.2s' }}>
                <p style={{ fontSize: '28px', marginBottom: '12px', lineHeight: 1 }}>{r.icon}</p>
                <p style={{ ...hs, fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{r.title}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.75 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMS WE SOLVE ──────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div>
              <p className="eyebrow">Common Issues</p>
              <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                Common SEO Problems We Help Fix
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>
                Many businesses come to us with the same core issues. Their website is live, but growth is slow and search visibility is weak.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
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
                  <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>→</span> {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Who We Work With */}
            <div>
              <p className="eyebrow">Who We Work With</p>
              <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                Who Our SEO Services Are For
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '28px' }}>
                Our SEO services are designed for businesses that want more than surface-level optimization. We work best with brands that want a stronger digital foundation and are ready to improve visibility with the right strategy.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
                {['Local service businesses', 'Agencies and consultants', 'eCommerce brands', 'Startups and growing companies', 'Businesses with underperforming websites', 'Brands needing technical SEO and content support'].map(who => (
                  <div key={who} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--primary)', flexShrink: 0, display:'flex' }}><CheckSVG size={14} /></span> {who}
                  </div>
                ))}
              </div>

              {/* Results */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
                <p style={{ ...hs, fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>What Better SEO Can Do for Your Business</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Stronger search visibility', 'Better keyword reach', 'Improved local presence', 'More qualified traffic', 'Better lead potential', 'Stronger content foundation', 'Healthier website structure'].map(r => (
                    <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', color: 'var(--text-2)' }}>
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
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <p className="eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>Our Process</p>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px', textAlign: 'center' }}>
            Our SEO Process
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.8, textAlign: 'center', maxWidth: '500px', margin: '0 auto 56px' }}>
            We keep the process clear, focused, and tied to business priorities.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px' }}>
            {[
              { n: '01', label: 'Audit',        desc: 'We review your website, search presence, content, and technical condition to understand what is holding performance back.' },
              { n: '02', label: 'Strategy',     desc: 'We build an SEO plan based on your business model, audience, goals, and search opportunities.' },
              { n: '03', label: 'Optimization', desc: 'We improve your pages, structure, technical setup, content targeting, and internal SEO foundation.' },
              { n: '04', label: 'Content & Growth', desc: 'Where needed, we build supporting content, improve weak pages, and strengthen site-wide relevance.' },
              { n: '05', label: 'Ongoing Improvement', desc: 'SEO is not static. We continue refining based on performance, search trends, and growth priorities.' },
            ].map((step, i) => (
              <div key={step.n} style={{ padding: '28px 20px', borderRight: i < 4 ? '1px solid var(--border)' : 'none', background: 'var(--bg-3)' }}>
                <p style={{ ...hs, fontSize: 'clamp(2.5rem,3.5vw,3.5rem)', fontWeight: 800, color: 'rgba(79,110,247,0.15)', lineHeight: 1, marginBottom: '14px', userSelect: 'none' }}>{step.n}</p>
                <p style={{ ...hs, fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{step.label}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.8 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ ...hm, fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', marginTop: '32px', fontStyle: 'italic' }}>
            Clear strategy. Focused execution. Better search performance.
          </p>
        </div>
      </section>

      {/* ── SEO + WEBSITE ALIGNMENT ─────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, rgba(79,110,247,0.08), rgba(155,109,255,0.05))', border: '1px solid rgba(79,110,247,0.15)', borderRadius: '24px', padding: 'clamp(40px,5vw,64px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
            <div>
              <p className="eyebrow">Website & SEO Together</p>
              <h2 style={{ ...hs, fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                SEO Works Better When Your Website Is Built Right
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '16px' }}>
                One of the biggest SEO problems businesses face is trying to grow search traffic on top of a weak website foundation. Poor structure, slow speed, weak UX, and disconnected content can limit results no matter how many keywords you target.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.85 }}>
                Because Ariosetech works across web development, Shopify, WordPress, SEO, and automation, we can improve SEO with a broader understanding of how digital performance actually works.
              </p>
              <p style={{ ...hm, fontSize: '12px', color: 'var(--primary)', marginTop: '20px', fontStyle: 'italic' }}>
                SEO is stronger when the website behind it is built to support growth.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '🔧', label: 'WordPress Development', href: '/services/wordpress' },
                { icon: '🛒', label: 'Shopify Development', href: '/services/shopify' },
                { icon: '🏪', label: 'WooCommerce Development', href: '/services/woocommerce' },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 22px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '14px', textDecoration: 'none', transition: 'all 0.2s' }} className="card-hover">
                  <span style={{ fontSize: '22px' }}>{link.icon}</span>
                  <span style={{ ...hs, fontSize: '14px', fontWeight: 600, color: '#fff' }}>{link.label}</span>
                  <ArrowSVG size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div style={{ position: 'sticky', top: '100px' }}>
              <p className="eyebrow">FAQ</p>
              <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                SEO Questions Answered
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '32px' }}>
                Tell us where your website stands, and we&apos;ll help you map the next move.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Book a Free SEO Consultation <ArrowSVG size={15} /></Link>
            </div>
            <div>
              {activeFaqs.map(({ q, a }: unknown, i: number) => (
                <details key={i} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '6px' }}>
                  <summary style={{ padding: '18px 22px', cursor: 'pointer', ...hs, fontSize: '15px', fontWeight: 600, color: '#fff', listStyle: 'none', userSelect: 'none' }}>
                    {q}
                  </summary>
                  <div style={{ padding: '0 22px 18px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.85 }}>{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(79,110,247,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ ...hs, fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Ready to Improve Your Search Visibility?
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Whether you need technical fixes, stronger local SEO, better website optimization, or a content strategy that supports rankings, Ariosetech is ready to help.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Book a Free SEO Consultation <ArrowSVG size={15} /></Link>
            <Link href="/contact?audit=1" className="btn btn-outline btn-lg">Get a Website Audit</Link>
          </div>
          <p style={{ ...hm, fontSize: '12px', color: 'var(--text-3)', marginTop: '20px', fontStyle: 'italic' }}>
            Tell us where your website stands, and we&apos;ll help you map the next move.
          </p>
        </div>
      </section>
    </>
  )
}
