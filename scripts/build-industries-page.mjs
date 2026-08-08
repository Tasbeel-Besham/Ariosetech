/**
 * Build the /industries page layout.
 *
 *   node scripts/build-industries-page.mjs            # dry run, shows the plan
 *   node scripts/build-industries-page.mjs --apply    # writes to the database
 *   node scripts/build-industries-page.mjs --restore  # puts the old layout back
 *
 * Requires MONGODB_URI in the environment (or a .env.local in the project root).
 *
 * Before writing, the current layout is copied to `page_layout_backups`. The
 * page's SEO settings, slug and status are left exactly as they are — only
 * `layout.sections` is replaced. Nothing else on the site is touched.
 *
 * The three sections use their built-in default content, so every field stays
 * editable in the admin afterwards and this script does not become the source
 * of truth for the copy.
 */

import { MongoClient } from 'mongodb'
import { readFileSync, existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'

const PAGE_PATH = '/industries'
const BACKUP_COLLECTION = 'page_layout_backups'

// ── Environment ──────────────────────────────────────────────────────
function loadEnv() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*MONGODB_URI\s*=\s*(.+)\s*$/)
      if (m) return m[1].trim().replace(/^["']|["']$/g, '')
    }
  }
  return null
}

// ── The layout ───────────────────────────────────────────────────────
// Empty props mean "use the component's defaults", which keeps the copy in one
// place and leaves every field editable in the builder.
const SECTIONS = [
  { id: randomUUID(), type: 'industry-index',    props: {}, meta: { label: 'Industry Index' } },
  { id: randomUUID(), type: 'industry-contrast', props: {}, meta: { label: 'Why the vertical matters' } },
  { id: randomUUID(), type: 'industry-entries',  props: {}, meta: { label: 'The entries' } },
]

const mode =
  process.argv.includes('--restore') ? 'restore'
  : process.argv.includes('--apply') ? 'apply'
  : 'dry'

const uri = loadEnv()
if (!uri) {
  console.error('MONGODB_URI not found. Set it in the environment or .env.local.')
  process.exit(1)
}

const client = new MongoClient(uri)

try {
  await client.connect()
  const db = client.db()
  const pages = db.collection('pages')
  const backups = db.collection(BACKUP_COLLECTION)

  const page = await pages.findOne({ fullPath: PAGE_PATH })

  if (!page) {
    console.error(`No page found with fullPath "${PAGE_PATH}".`)
    console.error('Create it in the admin first, then re-run. This script only replaces a layout; it never creates a page.')
    process.exit(1)
  }

  const currentCount = page.layout?.sections?.length ?? 0
  console.log(`Found "${page.title || PAGE_PATH}"  ·  status: ${page.status}  ·  ${currentCount} section(s) currently`)

  // ── Restore ──
  if (mode === 'restore') {
    const backup = await backups.find({ fullPath: PAGE_PATH }).sort({ createdAt: -1 }).limit(1).next()
    if (!backup) {
      console.error('No backup found. Nothing to restore.')
      process.exit(1)
    }
    await pages.updateOne(
      { _id: page._id },
      { $set: { layout: backup.layout, updatedAt: new Date() } },
    )
    console.log(`Restored the layout saved at ${backup.createdAt.toISOString()} (${backup.layout?.sections?.length ?? 0} sections).`)
    console.log('Publish or re-save in the admin if you want the cache cleared immediately.')
    process.exit(0)
  }

  // ── Dry run ──
  if (mode === 'dry') {
    console.log('\nDRY RUN — nothing written.\n')
    console.log('Would replace the layout with:')
    SECTIONS.forEach((s, i) => console.log(`  ${i + 1}. ${s.type.padEnd(20)} ${s.meta.label}`))
    console.log(`\nThe existing ${currentCount} section(s) would be backed up to "${BACKUP_COLLECTION}" first.`)
    console.log('SEO settings, slug, title and status are not touched.\n')
    console.log('Re-run with --apply to write, or --restore afterwards to undo.')
    process.exit(0)
  }

  // ── Apply ──
  await backups.insertOne({
    fullPath: PAGE_PATH,
    pageId: page._id,
    layout: page.layout ?? { sections: [] },
    createdAt: new Date(),
    note: 'Auto-backup before industries redesign',
  })
  console.log(`Backed up ${currentCount} section(s) to "${BACKUP_COLLECTION}".`)

  await pages.updateOne(
    { _id: page._id },
    { $set: { layout: { ...(page.layout ?? {}), sections: SECTIONS }, updatedAt: new Date() } },
  )

  console.log(`Wrote ${SECTIONS.length} sections to ${PAGE_PATH}.`)
  console.log('\nNext: open /industries to check it, and edit any copy in the admin builder.')
  console.log('To undo:  node scripts/build-industries-page.mjs --restore')
} catch (err) {
  console.error('Failed:', err.message)
  process.exit(1)
} finally {
  await client.close()
}
