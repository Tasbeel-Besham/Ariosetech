/**
 * Shared breadcrumb labels.
 *
 * Used by BOTH the visible breadcrumb component and the BreadcrumbList
 * structured data. Google's guidance is that structured data must describe what
 * is actually visible on the page, so these must never drift apart — hence one
 * source of truth rather than two humanising functions.
 */

/**
 * Casing that a naive title-case would get wrong. Without this, /services/
 * woocommerce renders as "Woocommerce" — which looks careless on a page whose
 * whole pitch is WooCommerce expertise.
 */
const LABEL_OVERRIDES: Record<string, string> = {
  woocommerce: 'WooCommerce',
  wordpress: 'WordPress',
  shopify: 'Shopify',
  seo: 'SEO',
  faq: 'FAQ',
  ui: 'UI',
  ux: 'UX',
  api: 'API',
  saas: 'SaaS',
  b2b: 'B2B',
  b2c: 'B2C',
  ecommerce: 'E-commerce',
  'e-commerce': 'E-commerce',
  cms: 'CMS',
  php: 'PHP',
  css: 'CSS',
  html: 'HTML',
  ai: 'AI',
  usa: 'USA',
  uae: 'UAE',
  uk: 'UK',
}

/** Turn a URL segment into a human label. */
export function labelForSegment(segment: string): string {
  const key = decodeURIComponent(segment || '').toLowerCase()
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key]

  return key
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    // Fix casing inside multi-word slugs too: "custom-woocommerce-build".
    .split(' ')
    .map(word => LABEL_OVERRIDES[word.toLowerCase()] || word)
    .join(' ')
}

export type Crumb = { name: string; href?: string }

/** Build the trail for a path. Home is always first; the last crumb is current. */
export function trailFor(pathname: string): Crumb[] {
  const parts = (pathname || '/').split('/').filter(Boolean)
  const trail: Crumb[] = [{ name: 'Home', href: '/' }]
  let acc = ''
  parts.forEach((part, i) => {
    acc += `/${part}`
    trail.push({
      name: labelForSegment(part),
      href: i === parts.length - 1 ? undefined : acc,
    })
  })
  return trail
}
