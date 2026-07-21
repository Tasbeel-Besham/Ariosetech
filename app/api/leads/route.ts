import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { sendContactEmails } from '@/lib/email'

// GET — admin only
export async function GET(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formId  = req.nextUrl.searchParams.get('formId')
  const status  = req.nextUrl.searchParams.get('status')
  const col     = await getCollection('leads')
  const filter: Record<string, string> = {}
  if (formId)  filter.formId = formId
  if (status)  filter.status = status
  const leads = await col.find(filter).sort({ createdAt: -1 }).toArray()
  return NextResponse.json(leads)
}

// ── Simple in-memory rate limiter (per IP). Resets on server restart, which
// is fine for throttling spam bursts. For multi-instance scale, swap for Redis.
const rlHits = new Map<string, number[]>()
function rateLimited(ip: string, max = 3, windowMs = 60_000): boolean {
  const now = Date.now()
  const arr = (rlHits.get(ip) || []).filter(t => now - t < windowMs)
  arr.push(now)
  rlHits.set(ip, arr)
  // opportunistic cleanup
  if (rlHits.size > 5000) { for (const [k, v] of rlHits) if (!v.some(t => now - t < windowMs)) rlHits.delete(k) }
  return arr.length > max
}

// Lightweight content heuristics — flag obvious spam without blocking real leads.
function looksLikeSpam(body: Record<string, unknown>): boolean {
  const text = [body.name, body.message, body.email, body.phone, (body as any).company]
    .filter(Boolean).join(' ').toLowerCase()
  if (!text) return false
  // Too many links is the #1 spam signal for contact forms.
  const linkCount = (text.match(/https?:\/\/|www\.|\[url|<a\s/gi) || []).length
  if (linkCount >= 2) return true
  // Common spam phrases seen in form-blast campaigns.
  const spamWords = ['seo services', 'buy now', 'crypto', 'bitcoin', 'viagra', 'casino', 'loan offer',
    'increase your traffic', 'rank #1', 'guaranteed ranking', 'backlinks', 'telegram', '@gmail.com sent you']
  if (spamWords.some(w => text.includes(w))) return true
  // Cyrillic / non-Latin bulk (common in bot spam) mixed into a Latin form.
  if (/[\u0400-\u04FF]{6,}/.test(text)) return true
  return false
}

// POST — public (contact form, no auth required)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. Honeypot: a hidden field real users never see or fill. Bots fill every
    //    field, so any value here = bot. Return success so the bot thinks it won.
    if (body.company_website || body.honeypot || body._gotcha) {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    // 2. Timing check: forms submitted in under 2s are almost always bots.
    if (typeof body.formLoadedAt === 'number' && Date.now() - body.formLoadedAt < 2000) {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    // 3. Rate limit per IP.
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
      || req.headers.get('x-real-ip') || 'unknown'
    if (ip !== 'unknown' && rateLimited(ip)) {
      return NextResponse.json({ error: 'Too many submissions. Please try again in a minute.' }, { status: 429 })
    }

    if (!body.email && !body.name) {
      return NextResponse.json({ error: 'Name or email required' }, { status: 400 })
    }

    // 4. Content heuristics — save spam but flag it, so it lands in a spam
    //    bucket instead of your inbox (and you can review if needed).
    const flaggedSpam = looksLikeSpam(body)

    const col = await getCollection('leads')
    const lead = {
      ...body,
      // don't persist the anti-spam plumbing
      company_website: undefined, honeypot: undefined, _gotcha: undefined, formLoadedAt: undefined,
      status: flaggedSpam ? 'spam' : (body.status || 'new'),
      source: body.source || 'Website',
      spam: flaggedSpam,
      ip,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await col.insertOne(lead as never)

    // The lead is saved — that's the part that must succeed. Email is a bonus:
    // wrap it so nothing here (theme lookup, Resend, network) can turn a saved
    // lead into a 500 for the visitor. Skip the email entirely for spam so your
    // inbox stays clean.
    if (!flaggedSpam) {
      try {
        await sendContactEmails(lead)
      } catch (emailErr) {
        console.error('[leads POST] email step failed (lead still saved):', emailErr)
      }
    }

    return NextResponse.json({ success: true, _id: result.insertedId }, { status: 201 })
  } catch (err) {
    console.error('[leads POST] FAILED before/at DB write:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
