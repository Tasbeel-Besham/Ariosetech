import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

// ============================================================================
// FIXES TWO THINGS, then delete this file:
// 1. Empties the /portfolio page's Portfolio Showcase items so it falls back
//    to the full portfolio COLLECTION (showing all 19 with correct filters),
//    instead of 3 hardcoded old entries with no category.
// 2. De-duplicates the portfolio collection: removes documents whose slug is
//    empty/missing OR that have no `category` (the old 3), keeping the seeded
//    versions that have proper slug + category.
//
//   Run:  https://ariosetech.com/api/fix-portfolio-page?secret=YOUR_ADMIN_JWT_SECRET
// ============================================================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report: any = { pageFixed: false, sectionsEmptied: 0, duplicatesRemoved: 0, remaining: 0, errors: [] as string[] }

  try {
    // ---- 1. Empty the portfolio section items on the /portfolio page ----
    const pagesCol = await getCollection('pages')
    const page: any = await pagesCol.findOne({ fullPath: '/portfolio' } as never)
    if (page && page.layout && Array.isArray(page.layout.sections)) {
      let changed = false
      for (const s of page.layout.sections) {
        if (s.type === 'portfolio' && s.props && Array.isArray(s.props.items) && s.props.items.length > 0) {
          s.props.items = []          // empty -> component falls back to the collection
          report.sectionsEmptied++
          changed = true
        }
      }
      if (changed) {
        await pagesCol.updateOne({ fullPath: '/portfolio' } as never, { $set: { layout: page.layout, updatedAt: new Date() } } as never)
        report.pageFixed = true
      }
    }

    // ---- 2. De-duplicate the portfolio collection ----
    // Duplicates exist because 3 old docs (Kapra/Dr.Scents/WYOX) predated the
    // seed and the seed added richer versions alongside them. Both have a
    // category, so we can't distinguish on that. The reliable signal: the
    // seeded versions have a non-empty `challenge` (full case study); the old
    // ones do not. Group by title; if any doc in the group has a challenge,
    // keep the best one WITH a challenge and delete the rest.
    const portCol = await getCollection('portfolio')
    const all: any[] = await portCol.find({} as never).toArray()

    const groups: Record<string, any[]> = {}
    for (const d of all) {
      const key = String(d.title || d.slug || d._id).trim().toLowerCase()
      ;(groups[key] = groups[key] || []).push(d)
    }

    for (const key of Object.keys(groups)) {
      const group = groups[key]
      if (group.length < 2) continue   // no duplicate for this title

      // Rank: prefer a doc that has a non-empty challenge, then one with a
      // descriptive client (client !== title), then the first.
      const scored = group.map(d => ({
        d,
        score:
          (d.challenge && String(d.challenge).trim() ? 100 : 0) +
          (d.client && String(d.client).trim().toLowerCase() !== String(d.title).trim().toLowerCase() ? 10 : 0) +
          (Array.isArray(d.results) && d.results.length ? 1 : 0),
      }))
      scored.sort((a, b) => b.score - a.score)

      // Keep the top-scored, delete the others
      for (let i = 1; i < scored.length; i++) {
        await portCol.deleteOne({ _id: scored[i].d._id } as never)
        report.duplicatesRemoved++
      }
    }

    report.remaining = await portCol.countDocuments({} as never)
    return NextResponse.json({ success: true, ...report,
      note: 'Fixed. Delete app/api/fix-portfolio-page/route.ts and redeploy. Hard-refresh /portfolio.' })
  } catch (err: any) {
    return NextResponse.json({ error: 'Fix failed', message: err.message, report }, { status: 500 })
  }
}
