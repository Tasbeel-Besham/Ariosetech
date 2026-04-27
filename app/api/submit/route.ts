import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  const { formId, data } = await req.json()
  if (!formId || !data) return NextResponse.json({ error: 'formId and data required' }, { status: 400 })

  const formsCol = await getCollection('forms')
  const form = await formsCol.findOne({ _id: new ObjectId(formId) })
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  const formDoc = form as unknown as { name: string }
  const leadsCol = await getCollection('leads')
  await leadsCol.insertOne({
    formId, formName: formDoc.name, data,
    source: req.headers.get('referer') || '',
    ip: req.headers.get('x-forwarded-for') || '',
    status: 'new',
    createdAt: new Date(),
  } as never)

  // Send email if Resend configured
  if (process.env.RESEND_API_KEY) {
    try {
      const formFields = form as unknown as { emailTo?: string; emailSubject?: string; name: string }
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'noreply@ariosetech.com',
          to: formFields.emailTo || 'info@ariosetech.com',
          subject: formFields.emailSubject || `New submission: ${formFields.name}`,
          html: `<h2>New Form Submission</h2><table>${Object.entries(data).map(([k, v]) => `<tr><td><b>${k}</b></td><td>${v}</td></tr>`).join('')}</table>`,
        }),
      })
    } catch (e) { console.error('[submit] email failed', e) }
  }

  return NextResponse.json({ success: true })
}
