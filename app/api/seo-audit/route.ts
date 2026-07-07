import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

/**
 * On-page SEO auditor. Two layers:
 *  1. Deterministic technical checks parsed from the page HTML — always run,
 *     free, and 100% reliable (no AI, no hallucination).
 *  2. Optional AI content review via the Anthropic API — only runs if
 *     ANTHROPIC_API_KEY is set. Advisory only; never changes the site.
 *
 * This tool only READS a page and returns advice. It cannot modify anything,
 * so it is completely safe to run against production.
 */

type Check = {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
  fix?: string
}

function textBetween(html: string, re: RegExp): string | null {
  const m = html.match(re)
  return m ? m[1].trim() : null
}

function countMatches(html: string, re: RegExp): number {
  const m = html.match(re)
  return m ? m.length : 0
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function technicalChecks(html: string, url: string): Check[] {
  const checks: Check[] = []

  // Title
  const title = textBetween(html, /<title[^>]*>([\s\S]*?)<\/title>/i)
  if (!title) {
    checks.push({ id: 'title', label: 'Title tag', status: 'fail', detail: 'No <title> tag found.', fix: 'Add a unique, keyword-rich title of 50–60 characters.' })
  } else {
    const len = title.length
    const status = len >= 30 && len <= 65 ? 'pass' : 'warn'
    checks.push({ id: 'title', label: 'Title tag', status, detail: `"${title}" (${len} chars)`, fix: status === 'pass' ? undefined : len < 30 ? 'Title is short — aim for 50–60 characters to use the full SERP width.' : 'Title may be truncated in search results — keep it under ~60 characters.' })
  }

  // Meta description
  const desc = textBetween(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
    || textBetween(html, /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i)
  if (!desc) {
    checks.push({ id: 'desc', label: 'Meta description', status: 'fail', detail: 'No meta description found.', fix: 'Add a compelling 150–160 character description with your primary keyword.' })
  } else {
    const len = desc.length
    const status = len >= 120 && len <= 165 ? 'pass' : 'warn'
    checks.push({ id: 'desc', label: 'Meta description', status, detail: `${len} characters`, fix: status === 'pass' ? undefined : len < 120 ? 'Description is short — expand toward 150–160 characters.' : 'Description may be truncated — keep it under ~160 characters.' })
  }

  // H1
  const h1Count = countMatches(html, /<h1[\s>]/gi)
  if (h1Count === 0) checks.push({ id: 'h1', label: 'H1 heading', status: 'fail', detail: 'No H1 found.', fix: 'Every page should have exactly one H1 describing its main topic.' })
  else if (h1Count === 1) checks.push({ id: 'h1', label: 'H1 heading', status: 'pass', detail: 'Exactly one H1 — perfect.' })
  else checks.push({ id: 'h1', label: 'H1 heading', status: 'warn', detail: `${h1Count} H1 tags found.`, fix: 'Use only one H1 per page; make the rest H2/H3.' })

  // Heading structure
  const h2Count = countMatches(html, /<h2[\s>]/gi)
  checks.push({ id: 'h2', label: 'Subheadings (H2)', status: h2Count >= 2 ? 'pass' : 'warn', detail: `${h2Count} H2 subheadings.`, fix: h2Count >= 2 ? undefined : 'Break content into sections with H2 subheadings — helps readers and search engines.' })

  // Images alt text
  const imgTotal = countMatches(html, /<img[\s>]/gi)
  const imgWithAlt = countMatches(html, /<img[^>]*\salt=["'][^"']/gi)
  const imgNoAlt = imgTotal - imgWithAlt
  if (imgTotal === 0) checks.push({ id: 'alt', label: 'Image alt text', status: 'pass', detail: 'No images on the page.' })
  else checks.push({ id: 'alt', label: 'Image alt text', status: imgNoAlt === 0 ? 'pass' : 'warn', detail: `${imgWithAlt}/${imgTotal} images have alt text.`, fix: imgNoAlt === 0 ? undefined : `${imgNoAlt} image(s) missing alt text — add descriptive alt for accessibility and image SEO.` })

  // Canonical
  const canonical = textBetween(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
  checks.push({ id: 'canonical', label: 'Canonical URL', status: canonical ? 'pass' : 'warn', detail: canonical || 'No canonical tag.', fix: canonical ? undefined : 'Add a canonical link to prevent duplicate-content issues.' })

  // Open Graph
  const ogTitle = /<meta[^>]*property=["']og:title["']/i.test(html)
  const ogImage = /<meta[^>]*property=["']og:image["']/i.test(html)
  checks.push({ id: 'og', label: 'Social sharing (Open Graph)', status: ogTitle && ogImage ? 'pass' : 'warn', detail: `${ogTitle ? 'og:title ✓' : 'og:title ✗'}, ${ogImage ? 'og:image ✓' : 'og:image ✗'}`, fix: ogTitle && ogImage ? undefined : 'Add og:title and og:image so links preview nicely when shared.' })

  // Structured data
  const hasSchema = /application\/ld\+json/i.test(html)
  checks.push({ id: 'schema', label: 'Structured data (Schema.org)', status: hasSchema ? 'pass' : 'warn', detail: hasSchema ? 'JSON-LD structured data present.' : 'No structured data found.', fix: hasSchema ? undefined : 'Add JSON-LD schema (Organization, Article, FAQ) — critical for rich results and AI citations.' })

  // Viewport / mobile
  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html)
  checks.push({ id: 'viewport', label: 'Mobile viewport', status: hasViewport ? 'pass' : 'fail', detail: hasViewport ? 'Viewport meta present.' : 'No viewport meta tag.', fix: hasViewport ? undefined : 'Add a viewport meta tag for mobile responsiveness.' })

  // Word count
  const text = stripTags(html)
  const words = text ? text.split(/\s+/).length : 0
  checks.push({ id: 'words', label: 'Content length', status: words >= 300 ? 'pass' : 'warn', detail: `~${words} words.`, fix: words >= 300 ? undefined : 'Thin content — aim for 300+ meaningful words so search engines have something to rank.' })

  // Internal links
  let host = ''
  try { host = new URL(url).host } catch {}
  const links = html.match(/<a[^>]*href=["']([^"']+)["']/gi) || []
  let internal = 0
  for (const l of links) {
    const href = (l.match(/href=["']([^"']+)["']/i) || [])[1] || ''
    if (href.startsWith('/') || (host && href.includes(host))) internal++
  }
  checks.push({ id: 'links', label: 'Internal links', status: internal >= 3 ? 'pass' : 'warn', detail: `${internal} internal links.`, fix: internal >= 3 ? undefined : 'Add internal links to related pages — spreads authority and helps crawling.' })

  return checks
}

async function aiContentReview(html: string, url: string): Promise<{ summary: string; suggestions: string[] } | null> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  const text = stripTags(html).slice(0, 6000)
  const title = textBetween(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || ''

  const prompt = `You are an SEO content reviewer. Analyze this page's content quality for search and AI-citation potential. Be specific and practical. Do NOT suggest keyword stuffing, cloaking, or any manipulative tactics.

URL: ${url}
Title: ${title}
Content (truncated):
${text}

Respond ONLY with valid JSON, no markdown, in this exact shape:
{"summary":"one or two sentence assessment of content quality","suggestions":["specific improvement 1","specific improvement 2","specific improvement 3","specific improvement 4","specific improvement 5"]}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const raw = (data.content || []).map((c: { text?: string }) => c.text || '').join('').trim()
    const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(clean)
    return { summary: String(parsed.summary || ''), suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String) : [] }
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await req.json()
  if (!url || typeof url !== 'string') return NextResponse.json({ error: 'A url is required' }, { status: 400 })

  let target: string
  try {
    target = new URL(url).toString()
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  let html = ''
  try {
    const res = await fetch(target, { headers: { 'User-Agent': 'ARIOSETECH-SEO-Auditor/1.0' } })
    if (!res.ok) return NextResponse.json({ error: `Could not fetch page (HTTP ${res.status})` }, { status: 400 })
    html = await res.text()
  } catch {
    return NextResponse.json({ error: 'Could not reach the page. Check the URL is publicly accessible.' }, { status: 400 })
  }

  const checks = technicalChecks(html, target)
  const pass = checks.filter(c => c.status === 'pass').length
  const score = Math.round((pass / checks.length) * 100)
  const ai = await aiContentReview(html, target)

  return NextResponse.json({
    url: target,
    score,
    checks,
    ai,
    aiAvailable: !!process.env.ANTHROPIC_API_KEY,
  })
}
