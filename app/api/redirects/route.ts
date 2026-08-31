import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { validateRedirect, resolveChain, shadowedByCodeRule, type RedirectDoc } from '@/lib/redirects/shared'

export const dynamic = 'force-dynamic'

/**
 * Management API for the `redirects` collection.
 *
 * The public read path is /api/redirects/map, which returns only the compact
 * lookup table. This route is the admin view — full documents, notes, disabled
 * rows — so it is behind auth.
 */

type Row = RedirectDoc & { _id?: unknown }

// GET — admin only. The middleware reads /api/redirects/map instead.
export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const col = await getCollection('redirects')
  const rows = await col.find({}).sort({ updatedAt: -1, _id: -1 }).toArray()
  return NextResponse.json(rows)
}

/**
 * Write one redirect, keeping the table flat.
 *
 * Two things happen beyond a plain insert:
 *   1. The destination is followed through existing rows, so saving A→B when
 *      B→C already exists stores A→C. Chains bleed ranking signal at every hop.
 *   2. Any row already pointing at the new source is repointed at the final
 *      destination, so creating B→C does not leave A→B dangling as a chain.
 * Both are reported back so the admin can say what it did rather than silently
 * rewriting what was typed.
 */
async function upsertOne(
  col: Awaited<ReturnType<typeof getCollection>>,
  existing: Row[],
  rawFrom: string, rawTo: string, rawType: unknown,
  extra: { note?: string; enabled?: boolean } = {},
): Promise<{ ok: true; from: string; to: string; flattened: boolean; repointed: number } | { ok: false; error: string }> {
  const v = validateRedirect(rawFrom, rawTo, rawType)
  if (!v.ok) return v

  const resolved = resolveChain(v.from, v.to, existing as { from: string; to: string; enabled?: boolean }[])
  if (resolved === null) {
    return { ok: false, error: `${v.from} → ${v.to} closes a loop: following the existing rules leads back to ${v.from}.` }
  }
  if (resolved === v.from) {
    return { ok: false, error: `${v.from} → ${v.to} resolves back to itself through the existing rules.` }
  }

  const now = new Date()
  await col.updateOne(
    { from: v.from } as never,
    {
      $set: { from: v.from, to: resolved, type: v.type, enabled: extra.enabled !== false, note: extra.note || '', updatedAt: now },
      $setOnInsert: { source: 'manual', createdAt: now },
    } as never,
    { upsert: true },
  )

  // Flatten anything that pointed at this source.
  const repoint = existing.filter(r => r.to === v.from && r.from !== v.from && r.enabled !== false)
  for (const r of repoint) {
    await col.updateOne({ from: r.from } as never, { $set: { to: resolved, updatedAt: now } } as never)
  }

  return { ok: true, from: v.from, to: resolved, flattened: resolved !== v.to, repointed: repoint.length }
}

// POST — create/replace one redirect, or bulk-import many.
export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const col = await getCollection('redirects')
  const existing = await col.find({}).toArray() as unknown as Row[]

  // ── Bulk import ──
  // One rule per line: "/old, /new" with an optional third field for the status
  // code. Pasting a 404 export from Search Console is the whole point, so tabs,
  // commas and whitespace are all accepted as separators and blank or
  // commented lines are skipped rather than reported as errors.
  if (typeof body.bulk === 'string') {
    const lines = body.bulk.split('\n').map((l: string) => l.trim()).filter((l: string) => l && !l.startsWith('#'))
    const created: string[] = []
    const errors: string[] = []
    for (const line of lines) {
      const parts = line.split(/[\t,]|\s{2,}|\s+/).map((s: string) => s.trim()).filter(Boolean)
      if (parts.length < 2) { errors.push(`${line} — needs a source and a destination`); continue }
      const res = await upsertOne(col, existing, parts[0], parts[1], parts[2] || 301)
      if (res.ok) {
        created.push(`${res.from} → ${res.to}`)
        existing.push({ from: res.from, to: res.to, type: 301, enabled: true })
      } else {
        errors.push(`${line} — ${res.error}`)
      }
    }
    return NextResponse.json({ success: true, created: created.length, errors, imported: created })
  }

  // ── Single rule ──
  const res = await upsertOne(col, existing, body.from, body.to, body.type, { note: body.note, enabled: body.enabled })
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 })
  return NextResponse.json({
    success: true,
    from: res.from,
    to: res.to,
    flattened: res.flattened,
    repointed: res.repointed,
    shadowedBy: shadowedByCodeRule(res.from),
  })
}
