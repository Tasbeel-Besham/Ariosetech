import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { sendLeadNotification, sendLeadConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { formId, data } = await req.json()
  if (!formId || !data) return NextResponse.json({ error: 'formId and data required' }, { status: 400 })

  const formsCol = await getCollection('forms')
  const form = await formsCol.findOne({ _id: new ObjectId(formId) })
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  const formDoc = form as unknown as { name: string; emailTo?: string }
  const leadsCol = await getCollection('leads')
  await leadsCol.insertOne({
    formId, formName: formDoc.name, data,
    source: req.headers.get('referer') || '',
    ip: req.headers.get('x-forwarded-for') || '',
    status: 'new',
    createdAt: new Date(),
  } as never)

  // data is a flat key/value map of the builder form's fields.
  const lead: Record<string, unknown> = { ...(data as Record<string, unknown>), source: formDoc.name }
  // Customer confirmation first, then internal notification. Best-effort.
  if (lead.email) {
    try { await sendLeadConfirmation(lead) } catch (e) { console.error('[submit] confirmation failed', e) }
  }
  try { await sendLeadNotification(lead) } catch (e) { console.error('[submit] notification failed', e) }

  return NextResponse.json({ success: true })
}
