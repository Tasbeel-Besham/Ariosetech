import { NextRequest, NextResponse } from 'next/server'

/**
 * Basic on-page SEO audit. Fetches the page's public HTML and checks the
 * technical fundamentals that are visible in the markup: title, meta
 * description, headings, image alt text, canonical, Open Graph, structured
 * data, viewport, HTTPS, and a few common issues.
 *
 * Honest scope: this reads the HTML a server receives. It does NOT crawl the
 * whole site, measure real PageSpeed/Core Web Vitals, check backlinks, or read
 * Google's own data — those need a full crawler or Google APIs. The UI is clear
 * about that so the result is useful without overpromising.
 */

type Check = {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
  category: 'Content' | 'Technical' | 'Social' | 'Structure'
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const normalized = url.startsWith('http') ? url : `https://${url}`
    let finalUrl = normalized
    let html = ''
    let status = 0
    try {
      const res = await fetch(normalized, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(12000),
        redirect: 'follow',
      })
      status = res.status
      finalUrl = res.url || normalized
      html = await res.text()
    } catch {
      return NextResponse.json({ error: 'Could not reach this URL. Make sure it is publicly accessible.' }, { status: 400 })
    }

    const checks: Check[] = []
    const add = (c: Check) => checks.push(c)

    const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1]) || html
    const lower = html.toLowerCase()

    // ── Title ──
    const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : ''
    if (!title) {
      add({ id: 'title', label: 'Title tag', status: 'fail', category: 'Content', detail: 'No <title> tag found. This is the single most important on-page SEO element.' })
    } else if (title.length < 30) {
      add({ id: 'title', label: 'Title tag', status: 'warn', category: 'Content', detail: `Title is short (${title.length} chars). Aim for 50–60 characters: "${title}"` })
    } else if (title.length > 65) {
      add({ id: 'title', label: 'Title tag', status: 'warn', category: 'Content', detail: `Title is long (${title.length} chars) and may be truncated in search results.` })
    } else {
      add({ id: 'title', label: 'Title tag', status: 'pass', category: 'Content', detail: `Good length (${title.length} chars): "${title}"` })
    }

    // ── Meta description ──
    const descMatch = head.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)
      || head.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)
    const desc = descMatch ? descMatch[1].trim() : ''
    if (!desc) {
      add({ id: 'desc', label: 'Meta description', status: 'fail', category: 'Content', detail: 'No meta description. Google often uses it as the search snippet.' })
    } else if (desc.length < 70) {
      add({ id: 'desc', label: 'Meta description', status: 'warn', category: 'Content', detail: `Description is short (${desc.length} chars). Aim for 140–160 characters.` })
    } else if (desc.length > 165) {
      add({ id: 'desc', label: 'Meta description', status: 'warn', category: 'Content', detail: `Description is long (${desc.length} chars) and may be truncated.` })
    } else {
      add({ id: 'desc', label: 'Meta description', status: 'pass', category: 'Content', detail: `Good length (${desc.length} chars).` })
    }

    // ── H1 ──
    const h1s = html.match(/<h1[\s>]/gi) || []
    if (h1s.length === 0) {
      add({ id: 'h1', label: 'H1 heading', status: 'fail', category: 'Structure', detail: 'No H1 heading found. Each page should have exactly one H1.' })
    } else if (h1s.length > 1) {
      add({ id: 'h1', label: 'H1 heading', status: 'warn', category: 'Structure', detail: `Found ${h1s.length} H1 tags. Best practice is exactly one per page.` })
    } else {
      add({ id: 'h1', label: 'H1 heading', status: 'pass', category: 'Structure', detail: 'Exactly one H1 — correct.' })
    }

    // ── Headings structure ──
    const h2s = (html.match(/<h2[\s>]/gi) || []).length
    add({ id: 'h2', label: 'Subheadings (H2)', status: h2s > 0 ? 'pass' : 'warn', category: 'Structure',
      detail: h2s > 0 ? `${h2s} H2 subheading(s) — good content structure.` : 'No H2 subheadings. Break content into sections for readability and SEO.' })

    // ── Images alt ──
    const imgs = html.match(/<img[^>]*>/gi) || []
    const imgsNoAlt = imgs.filter(i => !/\balt\s*=/i.test(i)).length
    if (imgs.length === 0) {
      add({ id: 'alt', label: 'Image alt text', status: 'pass', category: 'Content', detail: 'No images found to check.' })
    } else if (imgsNoAlt === 0) {
      add({ id: 'alt', label: 'Image alt text', status: 'pass', category: 'Content', detail: `All ${imgs.length} images have alt attributes.` })
    } else {
      add({ id: 'alt', label: 'Image alt text', status: 'warn', category: 'Content', detail: `${imgsNoAlt} of ${imgs.length} images are missing alt text. Alt text helps SEO and accessibility.` })
    }

    // ── Canonical ──
    const canonical = /<link[^>]+rel=["']canonical["']/i.test(head)
    add({ id: 'canonical', label: 'Canonical tag', status: canonical ? 'pass' : 'warn', category: 'Technical',
      detail: canonical ? 'Canonical URL is set — helps avoid duplicate-content issues.' : 'No canonical tag. Add one to tell Google the preferred URL for this page.' })

    // ── Viewport (mobile) ──
    const viewport = /<meta[^>]+name=["']viewport["']/i.test(head)
    add({ id: 'viewport', label: 'Mobile viewport', status: viewport ? 'pass' : 'fail', category: 'Technical',
      detail: viewport ? 'Viewport meta tag present — page is mobile-responsive-ready.' : 'No viewport meta tag. The page may not display correctly on mobile, which hurts rankings.' })

    // ── HTTPS ──
    const isHttps = finalUrl.startsWith('https://')
    add({ id: 'https', label: 'HTTPS', status: isHttps ? 'pass' : 'fail', category: 'Technical',
      detail: isHttps ? 'Served over HTTPS — secure and required for good rankings.' : 'Not served over HTTPS. Google flags non-secure sites and it hurts trust and rankings.' })

    // ── Open Graph (social) ──
    const ogTitle = /<meta[^>]+property=["']og:title["']/i.test(head)
    const ogImage = /<meta[^>]+property=["']og:image["']/i.test(head)
    if (ogTitle && ogImage) {
      add({ id: 'og', label: 'Open Graph tags', status: 'pass', category: 'Social', detail: 'Open Graph title and image set — links preview nicely when shared.' })
    } else {
      add({ id: 'og', label: 'Open Graph tags', status: 'warn', category: 'Social', detail: `Missing Open Graph ${!ogTitle ? 'title' : ''}${!ogTitle && !ogImage ? ' and ' : ''}${!ogImage ? 'image' : ''}. Shared links may show a blank preview.` })
    }

    // ── Structured data ──
    const hasSchema = /application\/ld\+json/i.test(html) || /itemscope/i.test(html)
    add({ id: 'schema', label: 'Structured data', status: hasSchema ? 'pass' : 'warn', category: 'Technical',
      detail: hasSchema ? 'Structured data (schema.org) found — helps rich results in search.' : 'No structured data found. Schema markup can earn rich results (stars, FAQs, breadcrumbs).' })

    // ── Language ──
    const hasLang = /<html[^>]+lang=/i.test(html)
    add({ id: 'lang', label: 'Language attribute', status: hasLang ? 'pass' : 'warn', category: 'Technical',
      detail: hasLang ? 'HTML lang attribute set — helps search engines and screen readers.' : 'No lang attribute on <html>. Add one (e.g. lang="en").' })

    // ── Word count (thin content) ──
    const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const words = textOnly ? textOnly.split(' ').length : 0
    if (words < 300) {
      add({ id: 'content', label: 'Content depth', status: 'warn', category: 'Content', detail: `About ${words} words of visible text. Thin content ranks poorly; aim for substantial, useful copy.` })
    } else {
      add({ id: 'content', label: 'Content depth', status: 'pass', category: 'Content', detail: `About ${words} words of visible text — reasonable content depth.` })
    }

    // ── Score ──
    const weights = { pass: 1, warn: 0.5, fail: 0 }
    const score = Math.round((checks.reduce((s, c) => s + weights[c.status], 0) / checks.length) * 100)

    const passes = checks.filter(c => c.status === 'pass').length
    const warns = checks.filter(c => c.status === 'warn').length
    const fails = checks.filter(c => c.status === 'fail').length

    return NextResponse.json({
      url: finalUrl,
      httpStatus: status,
      score,
      summary: { passes, warns, fails, total: checks.length },
      title, description: desc,
      checks,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Audit failed. Please try again.' }, { status: 500 })
  }
}
