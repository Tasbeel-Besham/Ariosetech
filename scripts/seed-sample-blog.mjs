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
  { type: 'p',  text: 'A slow WordPress site quietly costs you customers. Studies consistently show that most visitors abandon a page that takes more than three seconds to load, and Google uses page speed as a ranking signal. The good news: most WordPress performance problems come from a short list of fixable causes. This guide walks through the ones that matter, in the order we tackle them for our own clients.' },

  { type: 'h2', text: '1. Start With a Real Measurement' },
  { type: 'p',  text: 'Before changing anything, measure. Run your homepage and one heavy inner page through Google PageSpeed Insights and a waterfall tool like WebPageTest. Note your Largest Contentful Paint, Total Blocking Time, and Cumulative Layout Shift. These three Core Web Vitals are what Google actually scores, so they are the numbers to move.' },
  { type: 'p',  text: 'Write the numbers down. Optimization without a baseline is guesswork, and it is the only way to prove the work paid off.' },

  { type: 'h2', text: '2. Choose Hosting That Is Built for WordPress' },
  { type: 'p',  text: 'Cheap shared hosting is the single most common cause of a slow site. If your server takes 800 milliseconds just to respond before anything even downloads, no amount of plugin tuning will save you. Managed WordPress hosting with server-level caching and modern PHP gives you a faster starting point than any optimization plugin can.' },
  { type: 'p',  text: 'Look for hosts that offer PHP 8.2 or newer, server-side caching, and a content delivery network. These fundamentals matter more than any single plugin.' },

  { type: 'h2', text: '3. Optimize and Properly Size Your Images' },
  { type: 'p',  text: 'Images are usually the largest thing on a page. Serve them in modern formats like WebP or AVIF, compress them, and never load a 3000-pixel image into a 400-pixel slot. Lazy-load anything below the fold so the browser only fetches what the visitor can actually see.' },
  { type: 'p',  text: 'On a typical store, right-sizing images alone can cut total page weight in half. It is the highest-return task on this list for the least effort.' },

  { type: 'h2', text: '4. Cache Aggressively' },
  { type: 'p',  text: 'Caching stores a ready-made copy of your pages so the server does not rebuild them on every visit. A good caching setup combines page caching, browser caching, and object caching. Pair it with a content delivery network so visitors load your site from a server near them rather than from a single origin halfway around the world.' },

  { type: 'h2', text: '5. Trim Plugins and Scripts' },
  { type: 'p',  text: 'Every active plugin adds code, and some load their assets on every page whether they are needed there or not. Audit your plugin list, remove what you do not use, and defer or delay non-critical JavaScript so it does not block the first paint. A lean set of well-chosen plugins beats a pile of overlapping ones.' },

  { type: 'h2', text: 'When to Bring in Help' },
  { type: 'p',  text: 'If you have worked through this list and your site is still sluggish, the bottleneck is usually deeper: bloated theme code, an inefficient database, or render-blocking resources that need hands-on tuning. That is where a professional audit pays for itself, often turning a failing score into a 90-plus in a single engagement.' },
  { type: 'p',  text: 'Speed is not a one-time task. It is a habit. Measure, fix the biggest problem, measure again, and repeat. Do that consistently and your site will stay fast as it grows.' },
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
