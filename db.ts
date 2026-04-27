import fs from 'fs'
import path from 'path'

const IS_PROD   = process.env.NODE_ENV === 'production'
const SEED_PATH = path.join(process.cwd(), 'data', 'db.json')
const DB_KEY    = 'ariosetech:db'

// ── Types ─────────────────────────────────────────────────────

export interface BlogPost {
  id: string; slug: string; title: string; excerpt: string
  category: string; author: string; date: string; readTime: number
  tags: string[]; published: boolean
  content: { type: 'h2' | 'p'; text: string }[]
  coverImage?: string; updatedAt: string
  oldSlugs?: string[]
}

export interface PortfolioItem {
  id: string; slug: string; title: string; client: string; clientUrl: string
  category: 'wordpress' | 'woocommerce' | 'shopify' | 'seo'; summary: string
  challenge: string; solution: string; quote: string
  results: { label: string; value: string }[]; stack: string[]
  image?: string; featured: boolean; published: boolean; updatedAt: string
}

export interface SeoPage {
  title: string; description: string; og_title: string
  og_description: string; og_image: string; keywords: string
  canonical: string; noindex: boolean
}

export interface SeoGlobal {
  site_name: string; site_description: string; og_image: string
  twitter_handle: string; google_verify: string; bing_verify: string
  robots: string; canonical_base: string
}

export interface AdminUser {
  id: string; username: string; password: string
  role: 'admin' | 'editor'; createdAt: string
}

export interface DB {
  blogs:     BlogPost[]
  pages:     Record<string, Record<string, string>>
  portfolio: PortfolioItem[]
  settings:  Record<string, string>
  users:     AdminUser[]
  seo:       Record<string, SeoPage | SeoGlobal>
}

const EMPTY_DB: DB = { blogs: [], pages: {}, portfolio: [], settings: {}, users: [], seo: {} }

// ── Seed data (local JSON) ────────────────────────────────────

function readSeed(): DB {
  try {
    return JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'))
  } catch {
    return EMPTY_DB
  }
}

// ── Upstash REST helpers (no SDK needed) ──────────────────────

async function upstashGet(key: string): Promise<string | null> {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const res = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const json = await res.json() as { result: string | null }
  return json.result
}

async function upstashSet(key: string, value: string): Promise<void> {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return

  await fetch(`${url}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
    cache: 'no-store',
  })
}

// ── Public API ────────────────────────────────────────────────

export async function readDBAsync(): Promise<DB> {
  // Local dev — use JSON file
  if (!IS_PROD) return readSeed()

  try {
    const raw = await upstashGet(DB_KEY)
    if (!raw) {
      // First time in production — seed Upstash from db.json
      const seed = readSeed()
      await upstashSet(DB_KEY, JSON.stringify(seed))
      return seed
    }
    return JSON.parse(raw) as DB
  } catch {
    return readSeed()
  }
}

export async function writeDBAsync(data: DB): Promise<void> {
  if (!IS_PROD) {
    fs.mkdirSync(path.dirname(SEED_PATH), { recursive: true })
    fs.writeFileSync(SEED_PATH, JSON.stringify(data, null, 2))
    return
  }
  await upstashSet(DB_KEY, JSON.stringify(data))
}

// ── Sync shims for code that still calls readDB() / writeDB() ─
// These fall back to the seed file (safe for build-time/static use)

export function readDB(): DB {
  return readSeed()
}

export function writeDB(_data: DB): void {
  // No-op in production — use writeDBAsync() in API routes
}

// ── Utilities ─────────────────────────────────────────────────

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}
