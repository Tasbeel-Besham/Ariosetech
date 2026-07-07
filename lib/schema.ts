/**
 * JSON-LD schema builders. Pure functions — given some facts about a page,
 * they return a schema.org object. Used both by the auto-attach on dynamic
 * pages and by the manual generator tool in the admin.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'
const ORG_NAME = 'ARIOSETECH'
const ORG_ID = `${SITE_URL}/#organization`

export type BreadcrumbItem = { name: string; url: string }

/** WebPage schema — the baseline for any content page. */
export function webPageSchema(opts: {
  title: string
  description?: string
  url: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.title,
    description: opts.description || undefined,
    url: opts.url,
    ...(opts.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: opts.image } } : {}),
    isPartOf: { '@type': 'WebSite', name: ORG_NAME, url: SITE_URL },
    publisher: { '@id': ORG_ID },
  }
}

/** Service schema — for service/offering pages. */
export function serviceSchema(opts: {
  name: string
  description?: string
  url: string
  priceFrom?: string
  areaServed?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description || undefined,
    url: opts.url,
    provider: { '@type': 'Organization', name: ORG_NAME, '@id': ORG_ID, url: SITE_URL },
    ...(opts.areaServed?.length ? { areaServed: opts.areaServed } : { areaServed: ['PK', 'US', 'AE', 'CH', 'GB'] }),
    ...(opts.priceFrom
      ? { offers: { '@type': 'Offer', price: opts.priceFrom.replace(/[^0-9.]/g, ''), priceCurrency: 'USD', url: opts.url } }
      : {}),
  }
}

/** BreadcrumbList schema — helps search engines show the page hierarchy. */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** FAQPage schema. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/** Article / BlogPosting schema. */
export function articleSchema(opts: {
  headline: string
  description?: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
  author?: string
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.headline,
    description: opts.description || undefined,
    url: opts.url,
    image: opts.image ? [opts.image] : undefined,
    datePublished: opts.datePublished || undefined,
    dateModified: opts.dateModified || opts.datePublished || undefined,
    author: { '@type': 'Organization', name: opts.author || ORG_NAME },
    publisher: { '@type': 'Organization', name: ORG_NAME, '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    keywords: opts.keywords?.length ? opts.keywords.join(', ') : undefined,
  }
}

/** Build the breadcrumb trail from a URL path like /services/wordpress. */
export function trailFromPath(fullPath: string, pageTitle: string): BreadcrumbItem[] {
  const trail: BreadcrumbItem[] = [{ name: 'Home', url: `${SITE_URL}/` }]
  const parts = fullPath.split('/').filter(Boolean)
  let acc = ''
  parts.forEach((part, i) => {
    acc += `/${part}`
    const isLast = i === parts.length - 1
    trail.push({
      name: isLast ? pageTitle : part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      url: `${SITE_URL}${acc}`,
    })
  })
  return trail
}

/** Detect whether a page path looks like a service page. */
export function isServicePath(fullPath: string): boolean {
  return /^\/services(\/|$)/.test(fullPath)
}
