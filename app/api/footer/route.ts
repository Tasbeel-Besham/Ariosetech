import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'

const DEFAULT = {
  key: 'footer',
  tagline: 'Professional WordPress, Shopify & WooCommerce development since 2017. Consider It Solved.',
  ctaHeadline: 'Ready to build something extraordinary?',
  ctaDesc: 'Get a free quote within 24 hours. No commitment, no lock-in contracts.',
  ctaPrimaryLabel: 'Start a Project', ctaPrimaryHref: '/contact',
  columns: [
    { title: 'Services', links: [
      { label: 'WordPress Development',   href: '/services/wordpress' },
      { label: 'WooCommerce Development', href: '/services/woocommerce' },
      { label: 'Shopify Development',     href: '/services/shopify' },
      { label: 'SEO Services',            href: '/services/seo' },
    ]},
    { title: 'Company', links: [
      { label: 'About',     href: '/about' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog',      href: '/blog' },
      { label: 'Contact',   href: '/contact' },
    ]},
    { title: 'Legal', links: [
      { label: 'Privacy Policy',   href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ]},
  ],
  bottomText: `© ${new Date().getFullYear()} ARIOSETECH. All rights reserved. Crafted in Lahore, Pakistan.`,
}

export async function GET() {
  const col = await getCollection('site_config')
  const doc = await col.findOne({ key: 'footer' })
  if (!doc) return NextResponse.json(DEFAULT)
  return NextResponse.json({ ...DEFAULT, ...doc })
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const col = await getCollection('site_config')
  await col.updateOne(
    { key: 'footer' },
    { $set: { ...body, key: 'footer', updatedAt: new Date() } } as never,
    { upsert: true }
  )
  return NextResponse.json({ success: true })
}
