import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { ServicePageDoc } from '@/types'

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const col = await getCollection<ServicePageDoc>('services')
    const service = await col.findOne({ slug })
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    return NextResponse.json(service)
  } catch (error: Record<string, unknown>) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const data = await req.json()
    const col = await getCollection<ServicePageDoc>('services')
    
    const { _id: _, ...updateData } = data
    
    await col.updateOne(
      { slug },
      { $set: { ...updateData, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error: Record<string, unknown>) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const col = await getCollection<ServicePageDoc>('services')
    await col.deleteOne({ slug })
    return NextResponse.json({ success: true })
  } catch (error: Record<string, unknown>) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
