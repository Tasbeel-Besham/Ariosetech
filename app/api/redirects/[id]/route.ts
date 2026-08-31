import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCollection } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { validateRedirect, resolveChain, type RedirectDoc } from '@/lib/redirects/shared'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ id: string }> }
type Row = RedirectDoc & { _id?: unknown }

function oid(id: string): ObjectId | null {
  try { return new ObjectId(id) } catch { return null }
}

export async function PUT(req: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const _id = oid(id)
  if (!_id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  const col = await getCollection('redirects')
  const current = await col.findOne({ _id } as never) as unknown as Row | null
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const v = validateRedirect(body.from ?? current.from, body.to ?? current.to, body.type ?? current.type)
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 })

  // A different row may already own this source path — updating into it would
  // create a duplicate the map silently resolves at random.
  const clash = await col.findOne({ from: v.from, _id: { $ne: _id } } as never)
  if (clash) return NextResponse.json({ error: `Another rule already redirects ${v.from}.` }, { status: 409 })

  const others = (await col.find({ _id: { $ne: _id } } as never).toArray()) as unknown as Row[]
  const resolved = resolveChain(v.from, v.to, others as { from: string; to: string; enabled?: boolean }[])
  if (resolved === null || resolved === v.from) {
    return NextResponse.json({ error: `${v.from} → ${v.to} closes a redirect loop.` }, { status: 400 })
  }

  await col.updateOne({ _id } as never, {
    $set: {
      from: v.from,
      to: resolved,
      type: v.type,
      enabled: body.enabled !== false,
      note: typeof body.note === 'string' ? body.note : (current.note || ''),
      updatedAt: new Date(),
    },
  } as never)

  return NextResponse.json({ success: true, from: v.from, to: resolved, flattened: resolved !== v.to })
}

export async function DELETE(_req: NextRequest, { params }: P) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const _id = oid(id)
  if (!_id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const col = await getCollection('redirects')
  await col.deleteOne({ _id } as never)
  return NextResponse.json({ success: true })
}
