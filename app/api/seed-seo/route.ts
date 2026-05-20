import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import type { PageDoc } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: 'Missing or wrong secret. Add ?secret=YOUR_ADMIN_JWT_SECRET to the URL.' }, { status: 401 })
  }

  try {
    const sections = [
      {
        id: new ObjectId().toHexString(),
        type: 'hero-interactive',
        props: {
          eyebrow: 'SEO Services',
          headline: 'SEO Services That Help\nYour Business Get Found',
          subheadline: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance.',
          desc: 'From technical fixes to local SEO and content strategy, we build a stronger search presence that supports real business growth.',
          ctaPrimaryLabel: 'Book a Free SEO Consultation',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'Get a Website Audit',
          ctaSecondaryHref: '/contact',
          trust: 'No Contracts,Transparent Reporting,White-Hat SEO,Business-First Focus',
          codeFilename: 'seo-analysis / ranking.ts',
          codeLines: [
            [{ t: 'com', v: '// Executing technical SEO audit' }],
            [],
            [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_rankings' }, { t: 'v', v: '() {' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'audit' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'run_technical_audit' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'audit' }, { t: 'v', v: '.' }, { t: 'attr', v: 'core_web_vitals' }, { t: 'v', v: ' === ' }, { t: 'str', v: "'poor'" }, { t: 'v', v: ') {' }],
            [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'optimize_performance' }, { t: 'v', v: '();' }],
            [{ t: 'v', v: '  }' }],
            [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'✓ Rankings Improved'" }, { t: 'v', v: ';' }],
            [{ t: 'v', v: '}' }]
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'services-accordion',
        props: {
          eyebrow: 'Our Services',
          headline: 'Comprehensive SEO Solutions',
          intro: "Targeted strategies to build your search presence from the ground up.",
          items: [
            {
              label: 'Website SEO',
              title: 'Website SEO',
              sub: 'Website SEO That Strengthens Your Foundation',
              desc: 'We improve the on-page SEO and structural setup of your website so search engines can better understand your content and users can move through your site more clearly.',
              features: 'On-page improvements,Heading structure,Metadata optimization,Internal linking,Keyword targeting,SEO alignment',
              price: 'Custom',
              href: '/contact',
              bg: 'radial-gradient(ellipse 90% 80% at 10% 90%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0c0a1c,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
            },
            {
              label: 'Local SEO',
              title: 'Local SEO',
              sub: 'Bring More Local Calls and Leads',
              desc: 'For local businesses, visibility in your service areas matters. We help improve your local presence through GBP optimization, local landing pages, and geographic targeting.',
              features: 'Google Business Profile,Local keywords,City/service pages,On-page local signals,Location-based content,Map pack visibility',
              price: 'Custom',
              href: '/contact',
              bg: 'radial-gradient(ellipse 90% 80% at 90% 80%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#08081a,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
            },
            {
              label: 'Technical SEO',
              title: 'Technical SEO',
              sub: 'Fix What Holds You Back',
              desc: 'Many websites struggle to rank because of technical problems behind the scenes. We identify and fix crawlability, indexing, speed, and structural issues.',
              features: 'Technical audits,Crawl & indexing fixes,Speed improvements,Mobile usability,Site structure,Duplicate content review',
              price: 'Custom',
              href: '/contact',
              bg: 'radial-gradient(ellipse 90% 80% at 50% 110%, rgba(118,108,255,0.32) 0%, transparent 55%), linear-gradient(160deg,#0a0818,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
            },
            {
              label: 'SEO Content',
              title: 'SEO Content',
              sub: 'Build Topical Strength & Authority',
              desc: 'Create and improve content that supports rankings and search intent. We optimize service pages, plan blog strategies, and cluster keywords to help your site compete.',
              features: 'Content strategy,Service page optimization,Blog topic planning,Keyword clustering,Content updates,Search intent alignment',
              price: 'Custom',
              href: '/contact',
              bg: 'radial-gradient(ellipse 70% 70% at 20% 20%, rgba(118,108,255,0.30) 0%, transparent 55%), linear-gradient(160deg,#08081a,#05050a)',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
            }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why SEO With Us',
          headline: 'SEO is Your Best Long-Term Investment',
          items: [
            { icon: '🎯', title: 'Business-First SEO', subhead: 'Focus on Real Outcomes', desc: 'We focus on visibility that supports real business outcomes, not just traffic numbers.' },
            { icon: '⚙️', title: 'Development & SEO in Sync', subhead: 'Built for Performance', desc: 'Because our team works across websites, structure, and performance, we can align SEO with how your site is actually built.' },
            { icon: '✅', title: 'Clean Execution', subhead: 'Practical & Effective', desc: 'We focus on the changes that make the biggest impact without creating confusion or unnecessary complexity.' },
            { icon: '📈', title: 'Long-Term Growth', subhead: 'Sustainable Results', desc: 'We build SEO in a way that supports stronger performance over time, not just short-term spikes.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'process',
        props: {
          eyebrow: 'How We Work',
          headline: 'Our SEO Process',
          steps: [
            { n: '01', title: 'Audit & Strategy', sub: 'Discover What Is Holding You Back', desc: 'We review your website, search presence, content, and technical condition to understand what is holding performance back.', time: '' },
            { n: '02', title: 'Keyword Research', sub: 'Find Your Winning Opportunities', desc: 'We build an SEO plan based on your business model, audience, goals, and search opportunities.', time: '' },
            { n: '03', title: 'On-Page Optimization', sub: 'Fix and Improve Every Page', desc: 'We improve your pages, structure, technical setup, content targeting, and internal SEO foundation.', time: '' },
            { n: '04', title: 'Content & Growth', sub: 'Build Authority Over Time', desc: 'Where needed, we build supporting content, improve weak pages, and strengthen site-wide relevance.', time: '' },
            { n: '05', title: 'Report & Refine', sub: 'Monthly Progress Updates', desc: 'SEO is not static. We continue refining based on performance, search trends, and growth priorities.', time: '' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Get Started',
          headline: 'Ready to Dominate Google Search?',
          subhead: 'Get a free 25-point SEO audit',
          desc: 'Discover exactly what is holding your site back from ranking #1 with our comprehensive SEO and performance audit.',
          ctaLabel: 'Get Free SEO Audit',
          ctaHref: '/contact',
          guarantee: 'No spam, ever. Actionable report delivered within 24 hours.'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'faq',
        props: {
          eyebrow: 'SEO FAQ',
          headline: 'Frequently Asked Questions About SEO',
          items: [
            { q: 'What SEO services does Ariosetech offer?', a: 'We offer website SEO, local SEO, technical SEO, and SEO content support. This includes on-page optimization, technical fixes, local search improvements, and content strategy built to improve rankings and business visibility.' },
            { q: 'Is SEO worth it for small businesses?', a: 'Yes. SEO helps small businesses show up when potential customers are actively searching for their services. It can improve visibility, bring qualified traffic, and support long-term growth without depending only on paid ads.' },
            { q: 'How long does SEO take to show results?', a: 'SEO usually takes time because rankings depend on competition, website condition, content quality, and technical setup. Some improvements can be seen earlier, but strong SEO results usually build over months, not days.' },
            { q: 'Do you offer local SEO services?', a: 'Yes. We help local businesses improve visibility through Google Business Profile optimization, service-area targeting, local page structure, and stronger on-page local signals.' },
            { q: 'Can you fix technical SEO issues on my website?', a: 'Yes. We can review and improve crawl issues, indexing problems, speed-related blockers, mobile usability, internal structure, and other technical factors affecting search performance.' },
            { q: 'Do you also help with SEO content?', a: 'Yes. We help with service page optimization, blog planning, keyword clustering, content updates, and search-focused content strategy to strengthen your site\'s topical coverage.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'cta',
        props: {
          eyebrow: 'Ready to grow your business online?',
          headline: 'Start Your SEO Journey Today',
          desc: 'Join 100+ successful businesses. Professional results, transparent reporting, and long-term growth.',
          ctaLabel: 'Schedule Free Consultation',
          ctaHref: '/contact',
          secondaryLabel: 'View Case Studies',
          secondaryHref: '/portfolio',
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
              title: 'Professional SEO Services | Ariosetech',
              description: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance.'
            }
          } 
        }
      )
      return NextResponse.json({ message: `SEO page updated with ${sections.length} sections!` })
    } else {
      await pagesCol.insertOne({
        title: 'SEO Services',
        slug: 'seo',
        parentId: null, // Depending on if it needs parent, usually fullPath handles it
        fullPath: '/services/seo',
        layout: { sections },
        status: 'published',
        seo: {
          title: 'Professional SEO Services | Ariosetech',
          description: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance.',
          robots: { index: true, follow: true }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return NextResponse.json({ message: `SEO page created with ${sections.length} sections!` })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
