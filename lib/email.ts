import { getTheme } from '@/lib/theme'

/**
 * Contact-form email via Resend (https://resend.com).
 * Configure these environment variables (in .env.local and on your host):
 *   RESEND_API_KEY   – your Resend API key (starts with "re_")
 *   EMAIL_FROM       – verified sender, e.g. "ARIOSETECH <noreply@ariosetech.com>"
 *   EMAIL_TO         – where business notifications land, e.g. "info@ariosetech.com"
 * Emails are best-effort: if Resend isn't configured or the call fails, the lead
 * is still saved and the visitor still sees success — email is never a hard dependency.
 */

const RESEND_URL = 'https://api.resend.com/emails'

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

/** Internal notification to the business with all submitted fields. */
export async function sendLeadNotification(lead: Lead): Promise<boolean> {
  const from = process.env.EMAIL_FROM || 'ARIOSETECH <noreply@ariosetech.com>'
  const to = process.env.EMAIL_TO || 'info@ariosetech.com'

  const rows = Object.entries(lead)
    .filter(([k, v]) => v && !['status', 'source', 'createdAt', 'formName'].includes(k))
    .map(([k, v]) => `<tr>
      <td style="padding:8px 14px;border-bottom:1px solid #eee;font-weight:600;text-transform:capitalize;color:#555;width:130px;vertical-align:top">${esc(k)}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #eee;color:#111">${esc(v).replace(/\n/g, '<br/>')}</td>
    </tr>`).join('')

  const html = `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto">
    <h2 style="color:#111;margin:0 0 4px">New contact form submission</h2>
    <p style="color:#777;margin:0 0 18px;font-size:13px">${esc(lead.source || 'Website')} · ${new Date().toLocaleString()}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
  </div>`

  return send({
    from,
    to,
    reply_to: lead.email ? String(lead.email) : undefined,
    subject: `New lead: ${lead.name || lead.email || 'Website contact'}`,
    html,
  })
}

/** Branded confirmation to the visitor who submitted the form. */
export async function sendLeadConfirmation(lead: Lead): Promise<boolean> {
  if (!lead.email) return false
  const from = process.env.EMAIL_FROM || 'ARIOSETECH <noreply@ariosetech.com>'

  const theme = await getTheme()
  const primary = theme.colorPrimary || '#766cff'
  const secondary = theme.colorSecondary || '#9b8fff'
  const name = lead.name ? esc(lead.name).split(' ')[0] : 'there'

  const html = `<div style="background:#0a0a12;padding:32px 16px;font-family:system-ui,-apple-system,sans-serif">
    <div style="max-width:520px;margin:0 auto;background:#12121f;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden">
      <div style="height:4px;background:linear-gradient(90deg,${primary},${secondary})"></div>
      <div style="padding:36px 32px">
        <div style="font-family:sans-serif;font-weight:800;letter-spacing:2px;color:#fff;font-size:20px;margin-bottom:24px">ARIOSETECH</div>
        <h1 style="color:#fff;font-size:22px;margin:0 0 14px">Thanks, ${name} — we've got your message.</h1>
        <p style="color:#b0b0cc;font-size:15px;line-height:1.7;margin:0 0 16px">
          Our team will review your enquiry and get back to you within one business day.
          If it's urgent, reply to this email or reach us on WhatsApp.
        </p>
        ${lead.message ? `<div style="background:#0a0a12;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;margin:0 0 20px">
          <p style="color:#7a7a9a;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px">Your message</p>
          <p style="color:#d0d0e0;font-size:14px;line-height:1.6;margin:0">${esc(lead.message).replace(/\n/g, '<br/>')}</p>
        </div>` : ''}
        <a href="https://ariosetech.com/portfolio" style="display:inline-block;background:linear-gradient(180deg,${secondary},${primary});color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px">See our recent work →</a>
        <p style="color:#5a5a72;font-size:12px;line-height:1.6;margin:28px 0 0">
          ARIOSETECH · Professional WordPress, Shopify &amp; WooCommerce development since 2017<br/>
          You're receiving this because you contacted us at ariosetech.com.
        </p>
      </div>
    </div>
  </div>`

  return send({
    from,
    to: String(lead.email),
    subject: "We received your message — ARIOSETECH",
    html,
  })
}

/** Fire both emails without blocking the response on failures. */
export async function sendContactEmails(lead: Lead): Promise<void> {
  await Promise.allSettled([
    sendLeadNotification(lead),
    sendLeadConfirmation(lead),
  ])
}
