/**
 * Inserts (or updates) one complete, SEO-oriented sample blog post so you can
 * see the redesigned blog list + single-post layout with real content and all
 * the SEO fields populated. Safe to re-run — it upserts by slug.
 *
 * Run from the project root:
 *   node scripts/seed-sample-blog.mjs
 *
 * Delete it afterwards from the admin Blog section if you don't want it live.
 */
import { MongoClient } from 'mongodb'
import { readFileSync } from 'fs'

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
if (!uri) { console.error('MONGODB_URI missing'); process.exit(1) }

const slug = 'wordpress-speed-optimization-guide'

// Body is a sequence of h2 headings and paragraphs — matches the blog content model.
const content = [
  { type: 'p', text: 'A slow WordPress site quietly costs you customers. Most visitors abandon a page that takes more than three seconds to load, and Google uses page speed as a ranking signal. The good news: most WordPress performance problems come from a short, fixable list. Here is the exact order we tackle them.' },
  { type: 'callout', text: 'Quick win: right-sizing and compressing images alone can cut total page weight in half. If you only do one thing on this list, do that.' },
  { type: 'h2', text: '1. Start With a Real Measurement' },
  { type: 'p', text: 'Before changing anything, measure. Run your homepage and one heavy inner page through Google PageSpeed Insights and note your Core Web Vitals.' },
  { type: 'list', ordered: false, items: ['Largest Contentful Paint (LCP): under 2.5s', 'Interaction to Next Paint (INP): under 200ms', 'Cumulative Layout Shift (CLS): under 0.1'] },
  { type: 'p', text: 'Write the numbers down. Optimization without a baseline is guesswork.' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', caption: 'A performance waterfall reveals exactly what is slowing your page down.' },
  { type: 'h2', text: '2. Choose Hosting Built for WordPress' },
  { type: 'p', text: 'Cheap shared hosting is the single most common cause of a slow site. Managed WordPress hosting with server-level caching and modern PHP gives you a faster starting point than any plugin can.' },
  { type: 'quote', text: 'Your server response time sets the ceiling for how fast your site can ever be. Fix that first.', caption: 'ARIOSETECH Engineering' },
  { type: 'h2', text: '3. Cache Aggressively' },
  { type: 'p', text: 'Caching stores a ready-made copy of your pages so the server does not rebuild them on every visit.' },
  { type: 'code', lang: 'php', text: '// wp-config.php\ndefine( "WP_CACHE", true );\ndefine( "WP_REDIS_HOST", "127.0.0.1" );' },
  { type: 'h3', text: 'Do not forget a CDN' },
  { type: 'p', text: 'Pair caching with a content delivery network so visitors load your site from a server near them.' },
  { type: 'divider' },
  { type: 'p', text: 'Speed is a habit, not a one-time task. Measure, fix the biggest problem, measure again, and repeat.' },
  { type: 'button', text: 'Get a Free Speed Audit', url: '/contact' },
]

const now = new Date()
const post = {
  slug,
  title: 'WordPress Speed Optimization: A Practical Guide for 2026',
  excerpt: 'Slow WordPress sites lose customers and rankings. Here is the exact, prioritized checklist we use to take sites from sluggish to sub-second — hosting, images, caching, and more.',
  content,
  category: 'WordPress',
  tags: ['WordPress', 'Performance', 'Core Web Vitals', 'SEO', 'Page Speed'],
  author: 'ARIOSETECH Team',
  readTime: 6,
  readingTime: 6,
  featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  published: true,
  status: 'published',
  date: now.toISOString(),
  publishedAt: now.toISOString(),
  seo: {
    title: 'WordPress Speed Optimization Guide (2026) — ARIOSETECH',
    description: 'A practical, prioritized WordPress speed checklist: hosting, image optimization, caching, and plugin cleanup to pass Core Web Vitals and rank higher.',
    keywords: ['wordpress speed optimization', 'core web vitals', 'wordpress performance', 'page speed', 'wordpress caching'],
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'}/blog/${slug}`,
    ogTitle: 'WordPress Speed Optimization: A Practical Guide for 2026',
    ogDescription: 'The exact prioritized checklist we use to take WordPress sites from sluggish to sub-second.',
    ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    twitterTitle: 'WordPress Speed Optimization Guide (2026)',
    twitterDescription: 'Hosting, images, caching, plugins — the checklist that passes Core Web Vitals.',
    twitterImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    robots: { index: true, follow: true },
  },
  createdAt: now,
  updatedAt: now,
}

const client = new MongoClient(uri)
try {
  await client.connect()
  const col = client.db(dbName).collection('blogs')
  const res = await col.updateOne({ slug }, { $set: post }, { upsert: true })
  console.log(`✓ Sample blog post ${res.upsertedCount ? 'created' : 'updated'}: /blog/${slug}`)
  console.log('  Open it at:  ' + (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/blog/' + slug)
  console.log('  Edit or delete it anytime from Admin → Blog Posts.')
} catch (e) {
  console.error('Failed:', e.message)
  process.exit(1)
} finally {
  await client.close()
}
