import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const normalized = url.startsWith('http') ? url : `https://${url}`
    const urlObj     = new URL(normalized)

    // Fetch main page HTML
    let html = ''
    let finalUrl = normalized
    try {
      const res = await fetch(normalized, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(12000),
      })
      html     = await res.text()
      finalUrl = res.url
    } catch {
      return NextResponse.json({ error: 'Could not reach this URL. Make sure it is publicly accessible.' }, { status: 400 })
    }

    // ── Is it Shopify? ────────────────────────────────────────────
    const isShopify =
      html.includes('cdn.shopify.com') ||
      html.includes('Shopify.theme') ||
      html.includes('myshopify.com') ||
      html.includes('/cdn/shop/') ||
      html.includes('shopify-features') ||
      html.includes('"shopify"') ||
      html.includes('Shopify.locale') ||
      finalUrl.includes('myshopify.com')

    if (!isShopify) {
      return NextResponse.json({ isShopify: false })
    }

    // ── Theme name ────────────────────────────────────────────────
    // Method 1: Shopify.theme JS object
    let themeName = ''
    let themeId: number | undefined
    const themeJsMatch = html.match(/Shopify\.theme\s*=\s*\{([^}]+)\}/i)
    if (themeJsMatch) {
      const nameMatch = themeJsMatch[1].match(/"name"\s*:\s*"([^"]+)"/i)
      const idMatch   = themeJsMatch[1].match(/"id"\s*:\s*(\d+)/i)
      if (nameMatch) themeName = nameMatch[1]
      if (idMatch)   themeId   = parseInt(idMatch[1])
    }

    // Method 2: theme_id in script tags
    if (!themeName) {
      const m2 = html.match(/["']theme_name["']\s*:\s*["']([^"']+)["']/i)
      if (m2) themeName = m2[1]
    }

    // Method 3: window.Shopify.theme
    if (!themeName) {
      const m3 = html.match(/window\.Shopify\.theme\s*=\s*\{[^}]*name['"]\s*:\s*['"]([^'"]+)['"]/i)
      if (m3) themeName = m3[1]
    }

    // Method 4: meta tag
    if (!themeName) {
      const m4 = html.match(/<meta[^>]+name=['"]shopify-theme-name['"][^>]+content=['"]([^'"]+)['"]/i)
      if (m4) themeName = m4[1]
    }

    // Method 5: CDN path — /cdn/shop/t2/assets/ pattern has theme ID
    if (!themeId) {
      const cdnMatch = html.match(/cdn\.shopify\.com\/s\/files\/\d+\/\d+\/\d+\/\d+\/t\/(\d+)\//i)
      if (cdnMatch) themeId = parseInt(cdnMatch[1])
    }

    // ── Check Shopify theme store for known themes ─────────────────
    // Well-known free/paid themes mapping
    const KNOWN_THEMES: Record<string, { author: string; price: string; themeUrl: string; themeStore: boolean }> = {
      'dawn':       { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/dawn/styles/default', themeStore:true },
      'debut':      { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/debut', themeStore:true },
      'brooklyn':   { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/brooklyn', themeStore:true },
      'minimal':    { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/minimal', themeStore:true },
      'narrative':  { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/narrative', themeStore:true },
      'sense':      { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/sense', themeStore:true },
      'refresh':    { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/refresh', themeStore:true },
      'craft':      { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/craft', themeStore:true },
      'crave':      { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/crave', themeStore:true },
      'ride':       { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/ride', themeStore:true },
      'colorblock': { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/colorblock', themeStore:true },
      'origin':     { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/origin', themeStore:true },
      'context':    { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/context', themeStore:true },
      'boundary':   { author:'Shopify', price:'Free', themeUrl:'https://themes.shopify.com/themes/boundary', themeStore:true },
      'impulse':    { author:'Archetype Themes', price:'$380', themeUrl:'https://themes.shopify.com/themes/impulse', themeStore:true },
      'prestige':   { author:'Maestrooo', price:'$320', themeUrl:'https://themes.shopify.com/themes/prestige', themeStore:true },
      'turbo':      { author:'Out of the Sandbox', price:'$400', themeUrl:'https://themes.shopify.com/themes/turbo', themeStore:true },
      'pipeline':   { author:'Groupthought', price:'$320', themeUrl:'https://themes.shopify.com/themes/pipeline', themeStore:true },
      'symmetry':   { author:'Clean Canvas', price:'$320', themeUrl:'https://themes.shopify.com/themes/symmetry', themeStore:true },
      'motion':     { author:'Archetype Themes', price:'$380', themeUrl:'https://themes.shopify.com/themes/motion', themeStore:true },
      'warehouse':  { author:'Pixel Union', price:'$320', themeUrl:'https://themes.shopify.com/themes/warehouse', themeStore:true },
      'flex':       { author:'Out of the Sandbox', price:'$480', themeUrl:'https://themes.shopify.com/themes/flex', themeStore:true },
      'split':      { author:'Clean Canvas', price:'$320', themeUrl:'https://themes.shopify.com/themes/split', themeStore:true },
      'venue':      { author:'Pixel Union', price:'$320', themeUrl:'https://themes.shopify.com/themes/venue', themeStore:true },
    }

    const themeKey    = themeName.toLowerCase().replace(/\s+/g, '-')
    const knownTheme  = KNOWN_THEMES[themeKey] || KNOWN_THEMES[themeName.toLowerCase()]

    // ── Shop info ────────────────────────────────────────────────
    // Try /meta.json endpoint (publicly available on Shopify stores)
    let shopName = ''
    let currency = ''
    let country  = ''
    try {
      const metaRes = await fetch(`${urlObj.origin}/meta.json`, {
        signal: AbortSignal.timeout(5000),
        headers: { 'Accept': 'application/json' },
      })
      if (metaRes.ok) {
        const meta = await metaRes.json()
        shopName = meta.name || ''
        currency = meta.currency || ''
        country  = meta.country || ''
      }
    } catch { /* meta.json not available */ }

    // Also check page HTML for shop name
    if (!shopName) {
      const shopNameMatch = html.match(/Shopify\.shop\s*=\s*["']([^"']+)["']/i) ||
                            html.match(/"shop_name"\s*:\s*"([^"]+)"/i) ||
                            html.match(/<title>([^|<]+)/i)
      if (shopNameMatch) shopName = shopNameMatch[1].trim()
    }

    // Currency from HTML
    if (!currency) {
      const currMatch = html.match(/Shopify\.currency\s*=\s*["']([A-Z]{3})["']/i) ||
                        html.match(/"currency"\s*:\s*"([A-Z]{3})"/i)
      if (currMatch) currency = currMatch[1]
    }

    // Shopify Plus detection
    const isPlus = html.includes('shopifyplus') || html.includes('Shopify Plus') || html.includes('plus.shopify')

    // ── Build response ────────────────────────────────────────────
    return NextResponse.json({
      isShopify: true,
      theme: themeName ? {
        name:       themeName,
        id:         themeId,
        themeStore: knownTheme?.themeStore || false,
        themeUrl:   knownTheme?.themeUrl,
        author:     knownTheme?.author,
        price:      knownTheme?.price,
        isPremium:  knownTheme ? knownTheme.price !== 'Free' : false,
      } : undefined,
      shop: {
        name:     shopName || urlObj.hostname,
        domain:   urlObj.hostname,
        currency: currency || undefined,
        country:  country  || undefined,
        platform: isPlus ? 'Shopify Plus' : 'Shopify',
      },
      url: normalized,
    })

  } catch (err) {
    console.error('[detect-shopify]', err)
    return NextResponse.json({ error: 'Detection failed. Please try again.' }, { status: 500 })
  }
}
