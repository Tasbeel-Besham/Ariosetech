import { MongoClient, ObjectId } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local manually
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

    // Define the sequence of sections we want on the homepage
    const sections = [
      {
        id: new ObjectId().toHexString(),
        type: 'hero',
        props: {
          eyebrow: 'Available for new projects',
          headline: 'Professional WordPress, Shopify & WooCommerce Development Since 2017',
          subheadline: "Transform your business with custom e-commerce solutions that drive results. We've helped 100+ businesses across the globe scale their online presence with expert development, lightning-fast performance, and ongoing support.",
          supportingText: 'Trusted by businesses in the USA, UAE, and Switzerland for affordable, high-quality web development that delivers real ROI.',
          ctaPrimaryLabel: 'Get Free Quote & Strategy Call',
          ctaPrimaryHref: '/contact',
          ctaSecondaryLabel: 'View Our Portfolio',
          ctaSecondaryHref: '/portfolio',
          trust: '7+ Years of Excellence,100+ Successful Projects,24/7 Expert Support,30-Day Money-Back Guarantee'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'stats',
        props: {
          items: [
            { value: '100+', label: 'Projects Delivered' },
            { value: '7+',   label: 'Years Experience' },
            { value: '5.0★', label: 'Clutch Rating' },
            { value: '40+',  label: 'Industries Served' }
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
        type: 'services',
        props: {
          eyebrow: 'What We Offer',
          headline: 'Comprehensive Web Development Solutions for Your Business Growth',
          items: [
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>', title: 'WordPress Development', headline: 'Build Powerful, Scalable Websites', desc: 'From custom themes to complex functionality, we create WordPress sites that grow with your business. Speed-optimized, secure, and SEO-ready.', features: 'Custom Development,Speed Optimization,Maintenance & Support,Migration Services', price: '$799', href: '/services/wordpress' },
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>', title: 'WooCommerce Development', headline: 'Launch Your Dream E-commerce Store', desc: 'Turn your vision into a profitable online store. Custom WooCommerce solutions with seamless payment integration and conversion optimization.', features: 'Store Setup & Customization,Payment Gateway Integration,Multi-vendor Solutions,Performance Optimization', price: '$1,299', href: '/services/woocommerce' },
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', title: 'Shopify Development', headline: 'Scale Your Business with Shopify', desc: 'Professional Shopify stores built for growth. From startup stores to Shopify Plus enterprises, we deliver results that matter.', features: 'Custom Store Development,Shopify Plus Solutions,App Integration,Conversion Optimization', price: '$999', href: '/services/shopify' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'whyus',
        props: {
          eyebrow: 'Why Choose Us',
          headline: 'Why 100+ Businesses Trust ARIOSETECH for Their Success',
          items: [
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', title: 'Cost-Effective Excellence', subhead: 'Save 60% Without Compromising Quality', desc: 'Get premium web development at a fraction of US agency costs. Professional results, affordable pricing, transparent communication.' },
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', title: 'Lightning-Fast Delivery', subhead: 'From Concept to Launch in 30 Days', desc: 'Our streamlined process and dedicated team ensure rapid turnaround without cutting corners. Most projects completed ahead of schedule.' },
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>', title: 'Professional Support', subhead: '24/7 Expert Assistance When You Need It', desc: 'Round-the-clock support across time zones. Emergency fixes, regular maintenance, and proactive monitoring included.' },
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>', title: 'Proven Results', subhead: 'Track Record of Growing Businesses', desc: 'Our clients see average 150% increase in conversions and 40% improvement in site speed. Real results, measurable impact.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'impact',
        props: {
          eyebrow: 'Results That Matter',
          headline: 'The Impact, Quantified',
          intro: "Numbers don't lie. Here's what working with ARIOSETECH actually delivers for your business.",
          metrics: [
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
          intro: 'From setup to scale — a proven 5-step process that takes you from idea to a live, high-performing site.',
          steps: [
            { n: '01', title: 'Discovery & Strategy', sub: 'Understand Your Vision', desc: 'We kick off with a deep-dive consultation so every decision is rooted in business strategy.' },
            { n: '02', title: 'Planning & Design', sub: 'Blueprint for Success', desc: 'Wireframes and pixel-perfect UI that aligns with your brand and converts.' },
            { n: '03', title: 'Development', sub: 'Bringing Ideas to Life', desc: 'Clean, scalable builds for WordPress, Shopify, or WooCommerce — made to grow with you.' },
            { n: '04', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Cross-device QA, Core Web Vitals performance, security hardening, and SEO validation.' },
            { n: '05', title: 'Launch & Scale', sub: 'Your Success, Our Priority', desc: 'Smooth go-live, handover, and post-launch support — then ongoing growth support if needed.' }
          ]
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
            { n:'01', title:'COST-EFFECTIVE', sub:'Save 60% Without Compromising Quality', desc:'Premium web development at a fraction of US agency costs. Professional results, transparent pricing, zero compromise on quality.' },
            { n:'02', title:'TRANSPARENT', sub:'Open Communication at Every Step', desc:'We share project progress, insights, and feedback in real-time so you always know exactly where your investment stands.' },
            { n:'03', title:'RELIABLE', sub:'Consistently Delivered. Always On-Time.', desc:'100+ projects delivered on time and within budget. Our clients come back because our track record speaks for itself.' },
            { n:'04', title:'SCALABLE', sub:'Built to Grow With Your Business', desc:'Every site we build is architected for scale — whether you launch small or enterprise-level, our code grows seamlessly with your business.' },
            { n:'05', title:'SUPPORTED', sub:'24/7 Expert Assistance, Always On', desc:'Round-the-clock support across time zones. Emergency fixes, proactive monitoring, and regular maintenance included in every plan.' }
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
          items: [
            { title: 'The Kapra', client: 'E-commerce Fashion Store', platform: 'Custom WooCommerce', result: '300%', resultLabel: 'Increase in online sales', quote: 'ARIOSETECH transformed our vision into reality with custom code solutions.' },
            { title: 'Dr. Scents', client: 'International Perfume Online Store', platform: 'Multi-site WooCommerce', result: '32', resultLabel: 'Countries launched in 4 months', quote: 'Incredible speed and quality. They delivered beyond our expectations.' },
            { title: 'WYOX Sports', client: 'USA-Based Sports Equipment', platform: 'Shopify + Custom Solutions', result: '250%', resultLabel: 'Business growth', quote: 'Professional, reliable, and always available when we need them.' }
          ],
          ctaLabel: 'Explore All Projects',
          ctaHref: '/portfolio'
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'testimonials',
        props: {
          eyebrow: 'Client Reviews',
          headline: 'What Our Clients Say About Working With Us',
          items: [
            { name: 'Dr. Fred Sahafi', role: 'Founder of Genovie', initials: 'FS', quote: 'ARIOSETECH delivered an exceptional Shopify store that exceeded our expectations. Their attention to detail and ongoing support have been invaluable to our business growth.' },
            { name: 'Michael Chen', role: 'CEO of GeoMag World', initials: 'MC', quote: 'Working with ARIOSETECH was seamless. They understood our complex requirements and delivered a custom WooCommerce solution that perfectly fits our business model.' },
            { name: 'Muhammad Hannan', role: 'Director of Janya.pk', initials: 'MH', quote: 'Fast, reliable, and cost-effective. ARIOSETECH helped us launch our wholesale platform on Shopify ahead of schedule and under budget.' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'process',
        props: {
          eyebrow: 'How We Work',
          headline: 'Your Success Journey in 5 Simple Steps',
          steps: [
            { n: '01', title: 'Discovery & Strategy', sub: 'Understand Your Vision', desc: 'We start with a comprehensive consultation to understand your business goals, target audience, and technical requirements.', time: '1-2 days' },
            { n: '02', title: 'Planning & Design', sub: 'Blueprint for Success', desc: 'Detailed project planning, wireframing, and design mockups that align with your brand and conversion goals.', time: '3-5 days' },
            { n: '03', title: 'Development', sub: 'Bringing Ideas to Life', desc: 'Expert development using best practices, clean code, and scalable architecture that grows with your business.', time: '15-20 days' },
            { n: '04', title: 'Testing & Optimization', sub: 'Ensuring Perfection', desc: 'Rigorous testing across devices, speed optimization, and security checks before launch.', time: '3-5 days' },
            { n: '05', title: 'Launch & Support', sub: 'Your Success, Our Priority', desc: 'Smooth launch with comprehensive training and ongoing support to ensure continuous success.', time: 'Ongoing' }
          ]
        }
      },
      {
        id: new ObjectId().toHexString(),
        type: 'audit',
        props: {
          eyebrow: 'Free Audit',
          headline: 'Get Your Free Website Performance Audit',
          subhead: "Discover what's holding your website back from peak performance.",
          desc: "Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.",
          ctaLabel: 'Get My Free Audit Report',
          ctaHref: '/contact',
          guarantee: 'No spam, ever. Detailed report delivered within 24 hours.'
        }
      }
    ]

    // Check if a page with fullPath '/' exists
    const existing = await pagesCol.findOne({ fullPath: '/' })

    if (existing) {
      console.log('Updating existing homepage layout...')
      await pagesCol.updateOne(
        { fullPath: '/' },
        { 
          $set: { 
            'layout.sections': sections,
            updatedAt: new Date()
          } 
        }
      )
      console.log('Homepage layout updated successfully!')
    } else {
      console.log('Creating new homepage document...')
      await pagesCol.insertOne({
        title: 'Home',
        slug: '',
        parentId: null,
        fullPath: '/',
        layout: { sections },
        status: 'published',
        seo: {
          title: 'ARIOSETECH — Consider It Solved',
          description: 'Professional WordPress, Shopify & WooCommerce development since 2017. 100+ businesses scaled globally.',
          robots: { index: true, follow: true }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('Homepage document created successfully!')
    }

  } catch (err) {
    console.error('Error seeding homepage:', err)
  } finally {
    await client.close()
  }
}

seedHomepage()
