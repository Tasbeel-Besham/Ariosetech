import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import type { PageDoc } from '@/types'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const pagesCol = await getCollection<PageDoc>('pages')
    
    // First ensure the portfolio page exists
    const existing = await pagesCol.findOne({ fullPath: '/portfolio' })
    
    const sections = [
      { 
        id: new ObjectId().toHexString(), 
        type: 'hero-interactive', 
        props: { 
          eyebrow: 'Our Work', 
          headline: 'Success Stories That Speak for Themselves', 
          subheadline: 'Explore how we have transformed businesses across industries with custom web solutions that drive growth and maximize ROI.', 
          ctaPrimaryLabel: 'Start Your Project', 
          ctaPrimaryHref: '/contact', 
          ctaSecondaryLabel: 'View Services', 
          ctaSecondaryHref: '/services',
          metrics: [
            { ico: '📊', val: '+150%', lbl: 'Average Traffic', c1: '#766cff', c2: '#9b8fff', bar: 0.85 },
            { ico: '💰', val: '+200%', lbl: 'Revenue Growth', c1: '#766cff', c2: '#9b8fff', bar: 0.95 },
            { ico: '⚡', val: '99/100', lbl: 'Performance Score', c1: '#766cff', c2: '#9b8fff', bar: 0.99 }
          ]
        } 
      },
      { 
        id: new ObjectId().toHexString(), 
        type: 'portfolio', 
        props: { 
          eyebrow: 'Featured Projects', 
          headline: 'A Selection of Our Best Work', 
          intro: '', 
          ctaLabel: 'Start a Project', 
          ctaHref: '/contact' 
        } 
      },
      { 
        id: new ObjectId().toHexString(), 
        type: 'cta', 
        props: { 
          eyebrow: 'Ready to Transform Your Digital Presence?', 
          headline: 'Let’s Build Something Extraordinary Together', 
          desc: 'Join the 100+ businesses that have chosen Ariosetech to elevate their online strategy.', 
          ctaPrimaryLabel: 'Get Your Free Quote', 
          ctaPrimaryHref: '/contact', 
          ctaSecondaryLabel: 'Book a Strategy Call', 
          ctaSecondaryHref: '/contact' 
        } 
      },
    ]

    if (existing) {
      await pagesCol.updateOne(
        { fullPath: '/portfolio' },
        { $set: { 'layout.sections': sections, updatedAt: new Date(), status: 'published' } }
      )
    } else {
      await pagesCol.insertOne({
        title: 'Portfolio',
        slug: 'portfolio',
        fullPath: '/portfolio',
        layout: { sections },
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
    }

    return NextResponse.json({ success: true, message: 'Successfully seeded portfolio page layout.' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to seed portfolio page.' }, { status: 500 })
  }
}
