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

/* ═══════════════════════════════════════════════════════════════════════
   Organization + WebSite — the site-wide entity graph.
   Every other schema references ORG_ID as its publisher, so this MUST be
   emitted once site-wide (root layout) or those references resolve to
   nothing. This is the single most important schema for brand identity,
   knowledge-panel eligibility, and AI/LLM citation.
   ═══════════════════════════════════════════════════════════════════════ */
export function organizationSchema(opts?: {
  logo?: string
  sameAs?: string[]
  email?: string
  telephone?: string
  address?: { street?: string; city?: string; region?: string; postalCode?: string; country?: string }
  foundingDate?: string
  description?: string
  ratingValue?: string
  reviewCount?: string
}) {
  const o = opts || {}
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: ORG_NAME,
    alternateName: 'ArioseTech',
    url: SITE_URL,
    ...(o.logo ? { logo: { '@type': 'ImageObject', url: o.logo } } : {}),
    ...(o.description ? { description: o.description } : {}),
    ...(o.foundingDate ? { foundingDate: o.foundingDate } : {}),
    ...(o.email || o.telephone ? {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        ...(o.email ? { email: o.email } : {}),
        ...(o.telephone ? { telephone: o.telephone } : {}),
        availableLanguage: ['English', 'Urdu'],
      },
    } : {}),
    ...(o.address ? {
      address: {
        '@type': 'PostalAddress',
        ...(o.address.street ? { streetAddress: o.address.street } : {}),
        ...(o.address.city ? { addressLocality: o.address.city } : {}),
        ...(o.address.region ? { addressRegion: o.address.region } : {}),
        ...(o.address.postalCode ? { postalCode: o.address.postalCode } : {}),
        ...(o.address.country ? { addressCountry: o.address.country } : {}),
      },
    } : {}),
    ...(o.sameAs && o.sameAs.length ? { sameAs: o.sameAs } : {}),
    ...(o.ratingValue && o.reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: o.ratingValue,
        reviewCount: o.reviewCount,
        bestRating: '5',
      },
    } : {}),
  }
}

/** WebSite schema with SearchAction — helps Google understand site search. */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: ORG_NAME,
    url: SITE_URL,
    publisher: { '@id': ORG_ID },
  }
}

/** CreativeWork — for portfolio case-study pages. */
export function caseStudySchema(opts: {
  title: string
  description?: string
  url: string
  image?: string
  clientName?: string
  datePublished?: string
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.title,
    headline: opts.title,
    description: opts.description || undefined,
    url: opts.url,
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.keywords && opts.keywords.length ? { keywords: opts.keywords.join(', ') } : {}),
    ...(opts.clientName ? { about: { '@type': 'Organization', name: opts.clientName } } : {}),
    creator: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  }
}

/** ItemList — for hub pages listing children (industries, services, portfolio). */
export function itemListSchema(opts: {
  name: string
  url: string
  items: { name: string; url: string; description?: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    url: opts.url,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url,
      ...(it.description ? { description: it.description } : {}),
    })),
  }
}

/**
 * Pull FAQ pairs out of a page's saved sections so FAQPage schema is generated
 * automatically whenever an editor adds/edits an FAQ section — no manual step.
 */
export function faqFromSections(sections: unknown): { q: string; a: string }[] {
  if (!Array.isArray(sections)) return []
  const out: { q: string; a: string }[] = []
  for (const s of sections as Record<string, any>[]) {
    if (!s || s.type !== 'faq') continue
    const items = s.props?.items
    if (!Array.isArray(items)) continue
    for (const it of items) {
      const q = (it?.q ?? it?.question ?? '').toString().trim()
      const a = (it?.a ?? it?.answer ?? '').toString().trim()
      if (q && a) out.push({ q, a })
    }
  }
  return out
}

/** Person schema — for author profiles and bylines (EEAT signal). */
export function personSchema(opts: {
  name: string
  url: string
  jobTitle?: string
  description?: string
  image?: string
  sameAs?: string[]
  knowsAbout?: string[]
  email?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${opts.url}#person`,
    name: opts.name,
    url: opts.url,
    ...(opts.jobTitle ? { jobTitle: opts.jobTitle } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.email ? { email: opts.email } : {}),
    ...(opts.sameAs && opts.sameAs.length ? { sameAs: opts.sameAs } : {}),
    ...(opts.knowsAbout && opts.knowsAbout.length ? { knowsAbout: opts.knowsAbout } : {}),
    worksFor: { '@id': ORG_ID },
  }
}

/** ProfilePage schema — wraps an author page so Google reads it as a profile. */
export function profilePageSchema(opts: { name: string; url: string; person: object }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: opts.name,
    url: opts.url,
    mainEntity: opts.person,
  }
}
