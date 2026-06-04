import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'

const envPath = '.env.local'
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  content.split('\n').forEach(line => {
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
        headline: 'SEO Services That Help\nYour Business Get Found',
        subheadline: 'Ariosetech helps businesses grow through strategic SEO built around visibility, traffic, leads, and long-term digital performance.',
        desc: 'From technical fixes to local SEO and content strategy, we build a stronger search presence that supports real business growth.',
        ctaPrimaryLabel: 'Book a Free SEO Consultation',
        ctaPrimaryHref: '/contact',
        ctaSecondaryLabel: 'Get a Website Audit',
        ctaSecondaryHref: '/contact',
        trust: 'Website SEO \u2022 Local SEO \u2022 Technical SEO \u2022 SEO Content',
        codeFilename: 'seo-analysis / ranking.ts',
        codeLines: [
          [{ t: 'com', v: '// Executing technical SEO audit' }],
          [],
          [{ t: 'kw', v: 'async function ' }, { t: 'fn', v: 'optimize_rankings' }, { t: 'v', v: '() {' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'audit' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'run_technical_audit' }, { t: 'v', v: '();' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'if' }, { t: 'v', v: ' (' }, { t: 'attr', v: 'audit' }, { t: 'v', v: '.' }, { t: 'attr', v: 'core_web_vitals' }, { t: 'v', v: ' === ' }, { t: 'str', v: "'poor'" }, { t: 'v', v: ') {' }],
          [{ t: 'v', v: '    ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'optimize_performance' }, { t: 'v', v: '();' }],
          [{ t: 'v', v: '  }' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'str', v: "'\u2713 Rankings Improved'" }, { t: 'v', v: ';' }],
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
          body: 'Ranking on Google is not just about adding keywords to a page. Strong SEO comes from the right structure, better content, technical health, internal linking, local relevance, and a website that actually deserves to rank.\n\nAt Ariosetech, we take a business-first approach to SEO. That means we do not chase vanity traffic or empty rankings. We focus on the type of visibility that helps your brand attract the right audience, bring in qualified traffic, and create more opportunities for leads and sales.\n\nWhether you run a local business, a service-based company, or an eCommerce brand, we build SEO strategies around your goals, website condition, and growth stage.',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'Why SEO Still Matters',
          body: 'Search is still one of the strongest channels for long-term digital growth. When your business ranks for the right searches, you build visibility, trust, and steady traffic without relying only on paid ads.\n\nA strong SEO setup helps your business:\n* Show up when customers are actively searching\n* Build trust through better visibility\n* Attract more qualified traffic\n* Improve lead generation over time\n* Support long-term growth with compounding results\n\nGood SEO does not just help you rank. It helps your business become easier to find, trust, and choose.',
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
        items: [
  {
    "label": "Website SEO",
    "title": "Website SEO",
    "sub": "Website SEO That Strengthens Your Foundation",
    "desc": "We improve the on-page SEO and structural setup of your website so search engines can better understand your content and users can move through your site more clearly. This includes heading structure, metadata, content optimization, internal linking, page targeting, keyword mapping, and overall SEO alignment.",
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
]
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
          body: 'Many businesses come to us with the same core issues. Their website is live, but growth is slow and search visibility is weak.\n\n* Your website is not ranking for important keywords\n* You are getting traffic, but not qualified leads\n* Your service pages are weak or under-optimized\n* Your website has technical SEO issues\n* Your local business is not showing in local search results\n* Your content lacks structure or depth\n* Your pages are not connected properly through internal links\n* Your competitors are outranking you consistently\n\nIf your website is not pulling its weight in search, the issue is usually deeper than one missing keyword.',
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
          body: 'Our SEO services are designed for businesses that want more than surface-level optimization. We work best with brands that want a stronger digital foundation and are ready to improve visibility with the right strategy.\n\nIdeal Fit List:\n* Local service businesses\n* Agencies and consultants\n* eCommerce brands\n* Startups and growing companies\n* Businesses with underperforming websites\n* Brands needing technical SEO and content support',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'What Better SEO Can Do for Your Business',
          body: 'A stronger SEO setup can improve much more than rankings alone. With the right structure and strategy in place, your website becomes easier to discover, easier to trust, and better positioned to convert.\n\n* Stronger search visibility\n* Better keyword reach\n* Improved local presence\n* More qualified traffic\n* Better lead potential\n* Stronger content foundation\n* Healthier website structure',
          align: 'left'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'heading',
        props: {
          eyebrow: '',
          headline: 'SEO Works Better When Your Website Is Built Right',
          body: 'One of the biggest SEO problems businesses face is trying to grow search traffic on top of a weak website foundation. Poor structure, slow speed, weak UX, and disconnected content can limit results no matter how many keywords you target.\n\nBecause Ariosetech works across web development, Shopify, WordPress, SEO, and automation, we can improve SEO with a broader understanding of how digital performance actually works.\n\nSEO is stronger when the website behind it is built to support growth.',
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
        guarantee: 'Tell us where your website stands, and we\'ll help you map the next move.'
      }
    },
    {
      id: new ObjectId().toHexString(),
      type: 'faq',
      props: {
        eyebrow: 'SEO FAQ',
        headline: 'Frequently Asked Questions About SEO',
        items: [
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
run();