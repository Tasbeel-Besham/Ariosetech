import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const normalized = url.startsWith('http') ? url : `https://${url}`

    // Fetch the page HTML
    let html = ''
    try {
      const res = await fetch(normalized, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(12000),
      })
      html = await res.text()
    } catch {
      return NextResponse.json({ error: 'Could not reach this URL. Make sure it is publicly accessible.' }, { status: 400 })
    }

    // ── Is it WordPress? ──────────────────────────────────────────
    const isWordPress =
      html.includes('/wp-content/') ||
      html.includes('/wp-includes/') ||
      html.includes('wp-json') ||
      html.includes('WordPress') ||
      html.includes('xmlrpc.php')

    if (!isWordPress) {
      return NextResponse.json({ isWordPress: false })
    }

    // ── Detect theme ──────────────────────────────────────────────
    // Theme name from wp-content/themes/THEME_NAME/
    const themeMatch = html.match(/\/wp-content\/themes\/([^\/'"]+)/i)
    const themeSlug  = themeMatch ? themeMatch[1] : null

    // WP Version from meta generator
    const wpVersionMatch = html.match(/WordPress\s+([\d.]+)/i)
    const wpVersion = wpVersionMatch ? wpVersionMatch[1] : undefined

    // ── Fetch theme details from WordPress.org API ────────────────
    let themeInfo: Record<string, unknown> = {}
    if (themeSlug) {
      try {
        const wpApiRes = await fetch(
          `https://api.wordpress.org/themes/info/1.1/?action=theme_information&request[slug]=${encodeURIComponent(themeSlug)}&request[fields][screenshot_url]=true&request[fields][description]=true&request[fields][author]=true&request[fields][version]=true`,
          { signal: AbortSignal.timeout(6000) }
        )
        if (wpApiRes.ok) {
          const data = await wpApiRes.json()
          if (data && !data.error) themeInfo = data
        }
      } catch { /* theme not in WP.org repo — may be premium */ }
    }

    // Build theme object
    const theme = themeSlug ? {
      name:        (themeInfo.name as string) || themeSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      slug:        themeSlug,
      version:     (themeInfo.version as string) || undefined,
      author:      (themeInfo.author as Record<string,string>)?.display_name || (themeInfo.author as string) || undefined,
      description: typeof themeInfo.sections === 'object' && themeInfo.sections
        ? (themeInfo.sections as Record<string,string>).description?.replace(/<[^>]+>/g, '').slice(0, 200)
        : undefined,
      screenshot:  (themeInfo.screenshot_url as string) || undefined,
      themeUrl:    themeInfo.name
        ? `https://wordpress.org/themes/${themeSlug}/`
        : undefined,
      isPremium:   !themeInfo.name, // not on WP.org = likely premium
    } : undefined

    // ── Detect plugins ────────────────────────────────────────────
    const pluginSlugs = new Set<string>()
    const pluginMatches = html.matchAll(/\/wp-content\/plugins\/([^\/'"]+)/gi)
    for (const m of pluginMatches) {
      if (m[1] && m[1] !== 'plugins') pluginSlugs.add(m[1])
    }

    // Fetch plugin info from WP.org for each slug (limit to 8)
    const pluginList: { name: string; slug: string; version?: string; description?: string }[] = []
    for (const slug of Array.from(pluginSlugs).slice(0, 8)) {
      try {
        const pRes = await fetch(
          `https://api.wordpress.org/plugins/info/1.0/${encodeURIComponent(slug)}.json`,
          { signal: AbortSignal.timeout(4000) }
        )
        if (pRes.ok) {
          const pd = await pRes.json()
          if (pd && pd.name) {
            pluginList.push({ name: pd.name, slug, version: pd.version })
          } else {
            pluginList.push({ name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), slug })
          }
        }
      } catch {
        pluginList.push({ name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), slug })
      }
    }

    return NextResponse.json({
      isWordPress: true,
      theme,
      plugins: pluginList,
      wpVersion,
      url: normalized,
    })

  } catch (err) {
    console.error('[detect-wordpress]', err)
    return NextResponse.json({ error: 'Detection failed. Please try again.' }, { status: 500 })
  }
}
