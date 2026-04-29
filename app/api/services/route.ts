import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { ServicePageDoc } from '@/types'

export async function GET() {
  try {
    const col = await getCollection<ServicePageDoc>('services')
    const services = await col.find({}, { projection: { slug: 1, title: 1, status: 1, updatedAt: 1 } }).toArray()
    return NextResponse.json(services)
  } catch (error: Record<string, unknown>) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const col = await getCollection<ServicePageDoc>('services')
    
    // Minimal validation
    if (!data.slug || !data.title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 })
    }

    const doc: Omit<ServicePageDoc, '_id'> = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await col.insertOne(doc as ServicePageDoc)
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error: Record<string, unknown>) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
