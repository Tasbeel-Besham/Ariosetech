import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { initRegistry } from '@/components/builder/sections/registry-init'
import { getSection } from '@/lib/builder/registry'
import { ObjectId } from 'mongodb'
import type { PageDoc } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request) {
  try {
    initRegistry()
    const pagesCol = await getCollection<PageDoc>('pages')

    const sectionTypes = [
      'hero',
      'stats',
      'logos',
      'services',
      'whyus',
      'impact',
      'howitworks',
      'approach',
      'portfolio',
      'testimonials',
      'process',
      'audit'
    ]

    const sections = sectionTypes.map(type => {
      const def = getSection(type)
      if (!def) throw new Error(`Section type "${type}" not found in registry!`)
      return {
        id: new ObjectId().toHexString(),
        type: def.type,
        props: def.defaultProps,
      }
    })

    const existing = await pagesCol.findOne({ fullPath: '/' })

    if (existing) {
      await pagesCol.updateOne(
        { fullPath: '/' },
        { 
          $set: { 
            'layout.sections': sections,
            updatedAt: new Date()
          } 
        }
      )
      return NextResponse.json({ message: 'Homepage layout updated successfully in database!' })
    } else {
      await pagesCol.insertOne({
        title: 'Home',
        slug: '',
        parentId: null,
        fullPath: '/',
        layout: { sections },
        status: 'published',
        seo: {
          title: 'ARIOSETECH — Consider It Solved',
          description: 'Professional WordPress, Shopify & WooCommerce development since 2017.',
          robots: { index: true, follow: true }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return NextResponse.json({ message: 'Homepage layout created successfully in database!' })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
