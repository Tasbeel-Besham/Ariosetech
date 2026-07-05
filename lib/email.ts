/**
 * Contact-form email via Resend (https://resend.com).
 * Configure these environment variables (in .env.local and on Vercel):
 *   RESEND_API_KEY   – your Resend API key (starts with "re_")
 *   EMAIL_FROM       – verified sender, e.g. "ARIOSETECH <noreply@ariosetech.com>"
 *   EMAIL_TO         – where business notifications land, e.g. "info@ariosetech.com"
 * Emails are best-effort: if Resend isn't configured or the call fails, the lead
 * is still saved and the visitor still sees success — email is never a hard dependency.
 */

const RESEND_URL = 'https://api.resend.com/emails'
const LOGO = 'https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png'
const BRAND = '#3b2fd6'
const WHATSAPP = 'https://wa.me/923009484739'

type Lead = {
  name?: string
  email?: string
  phone?: string
  service?: string
  budget?: string
  message?: string
  [k: string]: unknown
}

function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
const br = (v: unknown) => esc(v).replace(/\n/g, '<br/>')

async function send(payload: Record<string, unknown>): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('[email] Resend error', res.status, await res.text())
      return false
    }
    return true
  } catch (e) {
    console.error('[email] Resend request failed', e)
    return false
  }
}

function shell(inner: string, tag: string, centerHeader = false): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="x-apple-disable-message-reformatting"/></head>
<body style="margin:0;padding:0;background:#eef0f5;font-family:'Segoe UI',Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(20,20,45,0.08);">
        <tr><td style="height:4px;background:${BRAND};line-height:4px;font-size:0;">&nbsp;</td></tr>
        <tr><td style="background:#0a0a12;padding:26px 32px;text-align:${centerHeader ? 'center' : 'left'};">
          <img src="${LOGO}" alt="ARIOSETECH" width="${centerHeader ? 220 : 200}" style="display:inline-block;width:${centerHeader ? 220 : 200}px;max-width:70%;height:auto;border:0;"/>
          ${tag ? `<div style="font-size:10px;color:#8f86ff;letter-spacing:0.14em;margin-top:8px;">${tag}</div>` : ''}
        </td></tr>
        <tr><td style="padding:32px;">${inner}</td></tr>
        <tr><td style="padding:22px 32px;border-top:1px solid #eeeef4;background:#fafafc;">
          <p style="margin:0;font-size:11px;color:#9a9aa8;line-height:1.8;">
            ARIOSETECH — WordPress, Shopify and WooCommerce development since 2017<br/>
            <a href="https://ariosetech.com" style="color:${BRAND};text-decoration:none;">ariosetech.com</a> &nbsp;·&nbsp;
            <a href="mailto:info@ariosetech.com" style="color:${BRAND};text-decoration:none;">info@ariosetech.com</a> &nbsp;·&nbsp;
            <a href="${WHATSAPP}" style="color:${BRAND};text-decoration:none;">+92 300 9484739</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/** Internal notification to the business with all submitted fields. */
export async function sendLeadNotification(lead: Lead): Promise<boolean> {
  const from = process.env.EMAIL_FROM || 'ARIOSETECH <noreply@ariosetech.com>'
  const to = process.env.EMAIL_TO || 'info@ariosetech.com'

  const skip = ['status', 'source', 'createdAt', 'updatedAt', 'formName', 'ip', 'message', '_id']
  const rows = Object.entries(lead)
    .filter(([k, v]) => v && String(v).trim() && !skip.includes(k))
    .map(([k, v], i, arr) => {
      const label = k.charAt(0).toUpperCase() + k.slice(1)
      const val = k === 'email'
        ? `<a href="mailto:${esc(v)}" style="color:${BRAND};text-decoration:none;font-weight:600;">${esc(v)}</a>`
        : `<span style="color:#1a1a26;font-weight:600;">${esc(v)}</span>`
      const border = i < arr.length - 1 ? 'border-bottom:1px solid #f0f0f5;' : ''
      return `<tr>
        <td style="padding:12px 16px;font-size:12px;color:#9a9aa8;text-transform:uppercase;letter-spacing:0.06em;width:150px;vertical-align:top;background:#fafafc;${border}">${esc(label)}</td>
        <td style="padding:12px 16px;font-size:14px;${border}">${val}</td>
      </tr>`
    }).join('')

  const inner = `
    <h1 style="margin:0 0 4px;font-size:20px;color:#1a1a26;font-weight:700;">New enquiry from ${esc(lead.name || 'a visitor')}</h1>
    <p style="margin:0 0 22px;font-size:13px;color:#9a9aa8;">${esc(lead.source || 'Website')} &middot; ${esc(new Date().toLocaleString())} — reply to this email to respond directly.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeef4;border-radius:12px;overflow:hidden;border-collapse:separate;border-spacing:0;">${rows}</table>
    ${lead.message ? `
    <p style="margin:22px 0 8px;font-size:12px;color:#9a9aa8;text-transform:uppercase;letter-spacing:0.06em;">Project details</p>
    <div style="background:#f6f6fa;border:1px solid #eeeef4;border-radius:12px;padding:18px;font-size:14px;color:#1a1a26;line-height:1.75;">${br(lead.message)}</div>` : ''}
    ${lead.email ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
      <td style="border-radius:10px;background:${BRAND};">
        <a href="mailto:${esc(lead.email)}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Reply to ${esc((String(lead.name || 'client')).split(' ')[0])}</a>
      </td>
    </tr></table>` : ''}
  `

  return send({
    from,
    to,
    reply_to: lead.email ? String(lead.email) : undefined,
    subject: `New lead: ${lead.name || lead.email || 'Website contact'}${lead.service ? ` — ${lead.service}` : ''}`,
    html: shell(inner, 'NEW LEAD · WEBSITE FORM'),
  })
}

/** Branded confirmation to the visitor who submitted the form. */
export async function sendLeadConfirmation(lead: Lead): Promise<boolean> {
  if (!lead.email) return false
  const from = process.env.EMAIL_FROM || 'ARIOSETECH <noreply@ariosetech.com>'
  const name = lead.name ? esc(String(lead.name)).split(' ')[0] : 'there'

  const summary: Array<[string, unknown]> = [
    ['Service', lead.service],
    ['Budget', lead.budget],
    ['Phone', lead.phone],
  ]
  const hasSummary = summary.some(([, v]) => v && String(v).trim())

  const inner = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tr>
      <td style="width:48px;height:48px;border-radius:50%;background:#eeedfe;text-align:center;vertical-align:middle;font-size:26px;color:${BRAND};line-height:48px;">&#10003;</td>
    </tr></table>
    <h1 style="margin:0 0 12px;font-size:22px;color:#1a1a26;font-weight:700;">Thanks, ${name} — we got your message</h1>
    <p style="margin:0 0 16px;font-size:14px;color:#54546a;line-height:1.8;">
      Your request${lead.service ? ` about <strong style="color:#1a1a26;">${esc(lead.service)}</strong>` : ''} has reached our team.
      One of our experts will reply within <strong style="color:#1a1a26;">24 hours</strong> with next steps and a free quote.
    </p>
    ${hasSummary ? `
    <div style="background:#f6f6fa;border:1px solid #eeeef4;border-radius:12px;padding:16px 18px;margin:0 0 18px;">
      <div style="font-size:10px;color:#9a9aa8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">Summary of your request</div>
      ${summary.filter(([, v]) => v && String(v).trim()).map(([k, v]) =>
        `<div style="font-size:13px;color:#54546a;padding:3px 0;"><span style="color:#9a9aa8;">${esc(k)}:</span> <strong style="color:#1a1a26;">${esc(v)}</strong></div>`
      ).join('')}
    </div>` : ''}
    ${lead.message ? `
    <div style="background:#f6f6fa;border:1px solid #eeeef4;border-radius:12px;padding:16px 18px;margin:0 0 22px;">
      <div style="font-size:10px;color:#9a9aa8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">A copy of your enquiry</div>
      <div style="font-size:14px;color:#1a1a26;line-height:1.7;">${br(lead.message)}</div>
    </div>` : ''}
    <p style="margin:0 0 20px;font-size:14px;color:#54546a;line-height:1.8;">Need something urgent? Message us on WhatsApp — we usually respond within minutes.</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="border-radius:10px;background:${BRAND};">
        <a href="${WHATSAPP}" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Chat on WhatsApp</a>
      </td>
      <td style="width:12px;">&nbsp;</td>
      <td style="border-radius:10px;border:1px solid #d9d9e6;">
        <a href="https://ariosetech.com/portfolio" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:700;color:#1a1a26;text-decoration:none;">See our work</a>
      </td>
    </tr></table>
    <p style="margin:24px 0 0;font-size:12px;color:#9a9aa8;line-height:1.7;">This is an automatic confirmation — replying to this email reaches us too.</p>
  `

  return send({
    from,
    to: String(lead.email),
    subject: 'We received your request — ARIOSETECH',
    html: shell(inner, 'CONSIDER IT SOLVED', true),
    reply_to: process.env.EMAIL_TO || 'info@ariosetech.com',
  })
}

/** Send the visitor's confirmation first, then notify the business.
    Both are best-effort — a failure in either never blocks the other or the response. */
export async function sendContactEmails(lead: Lead): Promise<void> {
  if (lead.email) {
    try { await sendLeadConfirmation(lead) } catch (e) { console.error('[email] confirmation failed', e) }
  }
  try { await sendLeadNotification(lead) } catch (e) { console.error('[email] notification failed', e) }
}
