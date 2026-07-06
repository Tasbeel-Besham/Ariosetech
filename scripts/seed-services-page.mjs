/**
 * Creates the main /services overview page in your database.
 * Run once from the project root:  node scripts/seed-services-page.mjs
 * Safe to re-run — upserts by slug. Edit/delete afterwards in Admin → Pages.
 */
import { MongoClient } from 'mongodb'
import { readFileSync } from 'fs'

function loadEnv() {
  try { for (const line of readFileSync('.env.local','utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g,'')
  }} catch {}
}
loadEnv()
const uri = process.env.MONGODB_URI, dbName = process.env.MONGODB_DB || 'ariosetech'
if (!uri) { console.error('MONGODB_URI missing'); process.exit(1) }

const doc = JSON.parse(readFileSync(new URL('../.services-page.json', import.meta.url)))
// Convert the {$date} markers to real Dates
doc.createdAt = new Date(); doc.updatedAt = new Date()

const client = new MongoClient(uri)
try {
  await client.connect()
  const res = await client.db(dbName).collection('pages').updateOne(
    { fullPath: '/services' }, { $set: doc }, { upsert: true })
  console.log('✓ /services page', res.upsertedCount ? 'created' : 'updated')
  console.log('  Visit /services and edit it in Admin → Pages.')
} catch(e){ console.error('Failed:', e.message); process.exit(1) }
finally { await client.close() }
