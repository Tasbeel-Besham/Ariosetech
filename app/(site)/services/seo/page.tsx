import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/db/mongodb'
import { PageDoc } from '@/types'
import { BuilderRenderer } from '@/components/builder/canvas/BuilderRenderer'
import { initRegistry } from '@/components/sections/registry-init'

export const dynamic = 'force-dynamic'

initRegistry()

export async function generateMetadata() {
  const col = await getCollection<PageDoc>('pages')
  const page = await col.findOne({ fullPath: '/services/seo' })
  if (!page) return { title: 'SEO Services | ARIOSETECH' }
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || '',
  }
}

export default async function SeoServicePage() {
  const col = await getCollection<PageDoc>('pages')
  const page = await col.findOne({ fullPath: '/services/seo' })
  if (!page) notFound()
  return <BuilderRenderer sections={page.layout?.sections || []} pageUrl="/services/seo" pageName="SEO Services" />
}
