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

  // Accent colour follows the admin theme; the template itself is a light layout.
  const theme = await getTheme()
  const accent = theme.colorPrimary || '#766cff'

  const name = lead.name ? esc(String(lead.name)).split(' ')[0] : 'there'
  const service = lead.service ? esc(String(lead.service)) : 'your project'
  const budget = lead.budget ? esc(String(lead.budget)) : 'To be discussed'
  const phone = lead.phone ? esc(String(lead.phone)) : 'Not provided'
  const message = lead.message ? esc(String(lead.message)).replace(/\n/g, '<br />') : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>We received your request</title>
</head>
<body style="margin:0; padding:0; background:#eef0f5; font-family:'Segoe UI', Arial, Helvetica, sans-serif; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f5; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(20,20,45,0.08);">

          <tr><td style="height:4px; background:${accent}; line-height:4px; font-size:0;">&nbsp;</td></tr>

          <tr>
            <td style="background:#0a0a12; padding:26px 32px; text-align:center;">
              <img src="https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png" alt="ARIOSETECH" width="220" style="display:inline-block; width:220px; max-width:70%; height:auto; border:0;" />
            </td>
          </tr>

          <tr>
            <td style="padding:34px 32px;">

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
                <tr>
                  <td style="width:48px; height:48px; border-radius:50%; background:#eeedfe; text-align:center; vertical-align:middle; font-size:26px; color:${accent}; line-height:48px;">&#10003;</td>
                </tr>
              </table>

              <h1 style="margin:0 0 12px; font-size:22px; color:#1a1a26; font-weight:700;">Thanks, ${name} — we got your message</h1>

              <p style="margin:0 0 16px; font-size:14px; color:#54546a; line-height:1.8;">
                Your request about <strong style="color:#1a1a26;">${service}</strong> has reached our team. One of our experts will reply within <strong style="color:#1a1a26;">24 hours</strong> with next steps and a free quote.
              </p>

              <div style="background:#f6f6fa; border:1px solid #eeeef4; border-radius:12px; padding:16px 18px; margin:0 0 18px;">
                <div style="font-size:10px; color:#9a9aa8; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:10px;">Summary of your request</div>
                <div style="font-size:13px; color:#54546a; padding:3px 0;"><span style="color:#9a9aa8;">Service:</span> <strong style="color:#1a1a26;">${service}</strong></div>
                <div style="font-size:13px; color:#54546a; padding:3px 0;"><span style="color:#9a9aa8;">Budget:</span> <strong style="color:#1a1a26;">${budget}</strong></div>
                <div style="font-size:13px; color:#54546a; padding:3px 0;"><span style="color:#9a9aa8;">Phone:</span> <strong style="color:#1a1a26;">${phone}</strong></div>
              </div>

              ${message ? `<div style="background:#f6f6fa; border:1px solid #eeeef4; border-radius:12px; padding:16px 18px; margin:0 0 22px;">
                <div style="font-size:10px; color:#9a9aa8; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px;">A copy of your enquiry</div>
                <div style="font-size:14px; color:#1a1a26; line-height:1.7;">${message}</div>
              </div>` : ''}

              <p style="margin:0 0 20px; font-size:14px; color:#54546a; line-height:1.8;">Need something urgent? Message us on WhatsApp — we usually respond within minutes.</p>

              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:10px; background:${accent};">
                    <a href="https://wa.me/923009484739" style="display:inline-block; padding:13px 26px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none;">Chat on WhatsApp</a>
                  </td>
                  <td style="width:12px;">&nbsp;</td>
                  <td style="border-radius:10px; border:1px solid #d9d9e6;">
                    <a href="https://ariosetech.com/portfolio" style="display:inline-block; padding:13px 26px; font-size:14px; font-weight:700; color:#1a1a26; text-decoration:none;">See our work</a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0; font-size:12px; color:#9a9aa8; line-height:1.7;">This is an automatic confirmation — replying to this email reaches us too.</p>

            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px; border-top:1px solid #eeeef4; background:#fafafc;">
              <p style="margin:0; font-size:11px; color:#9a9aa8; line-height:1.8;">
                ARIOSETECH — WordPress, Shopify and WooCommerce development since 2017<br />
                <a href="https://ariosetech.com" style="color:${accent}; text-decoration:none;">ariosetech.com</a> &nbsp;&middot;&nbsp;
                <a href="mailto:info@ariosetech.com" style="color:${accent}; text-decoration:none;">info@ariosetech.com</a> &nbsp;&middot;&nbsp;
                <a href="https://wa.me/923009484739" style="color:${accent}; text-decoration:none;">+92 300 9484739</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return send({
    from,
    reply_to: process.env.EMAIL_TO || 'info@ariosetech.com',
    to: String(lead.email),
    subject: 'We received your request — ARIOSETECH',
    html,
  })
}

/** Send the visitor's confirmation first, then notify the business.
    Both are best-effort — a failure in either never blocks the other or the response. */
export async function sendContactEmails(lead: Lead): Promise<void> {
  // Customer confirmation first, so the person who filled the form hears back fastest.
  if (lead.email) {
    try { await sendLeadConfirmation(lead) } catch (e) { console.error('[email] confirmation failed', e) }
  }
  // Then the internal notification.
  try { await sendLeadNotification(lead) } catch (e) { console.error('[email] notification failed', e) }
}
