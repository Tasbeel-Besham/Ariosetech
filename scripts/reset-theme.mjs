/**
 * One-time cleanup for the theme that got saved with bad values
 * (light-purple background made the whole app unreadable).
 *
 * Run once from the project root:
 *   node scripts/reset-theme.mjs
 *
 * It removes the dangerous colorBg / colorText / colorAccent keys and resets
 * the brand colours to the ARIOSETECH defaults. Safe to run multiple times.
 */
import { MongoClient } from 'mongodb'
import { readFileSync } from 'fs'

// Load MONGODB_URI / MONGODB_DB from .env.local without extra deps.
function loadEnv() {
  try {
    for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
}
loadEnv()

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'ariosetech'
if (!uri) { console.error('MONGODB_URI not found in environment or .env.local'); process.exit(1) }

const DEFAULTS = {
  colorPrimary: '#766cff',
  colorSecondary: '#9b8fff',
  colorPrimaryDark: '#5a50e0',
  fontDisplay: 'Manrope',
  fontBody: 'Inter',
  borderRadius: '12px',
}

const client = new MongoClient(uri)
try {
  await client.connect()
  const col = client.db(dbName).collection('site_config')
  const res = await col.updateOne(
    { key: 'theme' },
    { $set: { ...DEFAULTS, key: 'theme', updatedAt: new Date() },
      $unset: { colorBg: '', colorText: '', colorAccent: '' } },
    { upsert: true },
  )
  console.log('✓ Theme reset to ARIOSETECH defaults.', res.matchedCount ? '(updated existing)' : '(created)')
  console.log('  Reload your site — the purple background is gone and colours are back to #766cff.')
} catch (e) {
  console.error('Failed:', e.message)
  process.exit(1)
} finally {
  await client.close()
}
