import { ObjectId } from 'mongodb'

// ── Builder types ─────────────────────────────────────────────────
export type FieldSchema =
  | { type: 'text';     name: string; label: string }
  | { type: 'textarea'; name: string; label: string }
  | { type: 'image';    name: string; label: string }
  | { type: 'select';   name: string; label: string; options: string[] }
  | { type: 'repeater'; name: string; label: string; fields: FieldSchema[] }
  | { type: 'color';    name: string; label: string }
  | { type: 'boolean';  name: string; label: string }
  | { type: 'number';   name: string; label: string }

export type SectionInstance = {
  id: string
  type: string
  props: Record<string, unknown>
  styles?: Record<string, unknown>
  meta?: { locked?: boolean; hidden?: boolean; label?: string }
}

export type PageLayout = { sections: SectionInstance[] }

export type SectionDefinition = {
  type: string
  label: string
  category: string
  icon: string
  component: React.FC<Record<string, unknown>>
  defaultProps: Record<string, unknown>
  schema: FieldSchema[]
}

// ── SEO type (shared) ─────────────────────────────────────────────
export type SeoFields = {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  robots?: { index: boolean; follow: boolean }
}

export type SchemaOrg = {
  type: 'organization' | 'service' | 'webpage' | 'article'
  data: Record<string, unknown>
}

// ── MongoDB Documents ─────────────────────────────────────────────
export type PageDoc = {
  _id?: ObjectId
  title: string
  slug: string
  parentId: ObjectId | null
  fullPath: string
  layout: PageLayout
  status: 'draft' | 'published'
  seo: SeoFields
  schema?: SchemaOrg
  relatedPages?: ObjectId[]
  relatedBlogs?: ObjectId[]
  slugHistory?: string[]
  createdAt: Date
  updatedAt: Date
}

export type BlogDoc = {
  _id?: ObjectId
  slug: string
  title: string
  excerpt: string
  content: { type: 'h2' | 'p'; text: string }[]
  featuredImage?: string
  coverImage?: string
  status: 'draft' | 'published'
  published: boolean
  category: string
  tags: string[]
  readingTime?: number
  readTime?: number
  author: string
  publishedAt?: string
  date: string
  seo: SeoFields
  schema?: SchemaOrg
  relatedBlogs?: ObjectId[]
  relatedPages?: ObjectId[]
  slugHistory?: string[]
  createdAt?: Date
  updatedAt: string
}

export type PortfolioDoc = {
  _id?: ObjectId
  slug: string
  title: string
  client: string
  clientUrl: string
  category: 'wordpress' | 'woocommerce' | 'shopify' | 'seo'
  summary: string
  challenge: string
  solution: string
  quote: string
  results: { label: string; value: string }[]
  stack: string[]
  image?: string
  featured: boolean
  published: boolean
  updatedAt: string
}

export type ServicePageDoc = {
  _id?: ObjectId
  slug: string // e.g. 'shopify', 'wordpress', 'woocommerce', 'seo'
  title: string
  status: 'draft' | 'published'
  hero: {
    eyebrow: string
    headline: string
    subheadline: string
    desc: string
    bullets: string[]
    ctaPrimary: string
    ctaSecondary: string
    startingPrice?: string
  }
  services: {
    id: string
    title: string
    tagline: string
    price: string
    time: string
    desc: string
    features: string[]
    perfectFor?: string[]
    results?: string[]
    supported?: string[]
    plans?: { tier: string; price: string; features: string[] }[]
  }[]
  whyUs: {
    icon: string
    title: string
    desc: string
  }[]
  process: {
    n: string
    title: string
    sub: string
    desc: string
    time: string
  }[]
  portfolio: {
    name: string
    industry: string
    challenge: string
    solution: string
    result: string
    resultLabel: string
  }[]
  faqs: {
    q: string
    a: string
  }[]
  maintenancePlans?: {
    tier: string
    price: string
    features: string[]
  }[]
  backupPlans?: {
    tier: string
    price: string
    features: string[]
  }[]
  seo: SeoFields
  updatedAt: Date
}

export type RedirectDoc = {
  _id?: ObjectId
  from: string
  to: string
  type: 301 | 302
}

export type MediaDoc = {
  _id?: ObjectId
  url: string
  key?: string
  alt: string
  title?: string
  width?: number
  height?: number
  size?: number
  mimeType: string
  createdAt: Date
}

export type AdminUser = {
  _id?: ObjectId
  username: string
  password: string
  role: 'admin' | 'editor'
  createdAt: Date
}

export type GlobalSettings = {
  _id?: ObjectId
  key: string
  value: Record<string, unknown>
}

// ── Site Control ──────────────────────────────────────────────────
export type NavItem = {
  label: string
  href: string
  target?: '_blank' | '_self'
  children?: NavItem[]
}

export type MenuDoc = {
  _id?: ObjectId
  name: string          // e.g. "main-nav", "footer-links"
  location: string      // "header" | "footer" | "mobile"
  items: NavItem[]
  updatedAt: Date
}

export type HeaderConfig = {
  _id?: ObjectId
  key: 'header'
  logo: string
  logoAlt: string
  logoWidth: number
  showTopBar: boolean
  topBarPhone: string
  topBarEmail: string
  topBarText: string
  ctaPrimaryLabel: string
  ctaPrimaryHref: string
  ctaSecondaryLabel: string
  ctaSecondaryHref: string
  sticky: boolean
  transparent: boolean
  updatedAt: Date
}

export type FooterConfig = {
  _id?: ObjectId
  key: 'footer'
  tagline: string
  ctaHeadline: string
  ctaDesc: string
  ctaPrimaryLabel: string
  ctaPrimaryHref: string
  columns: {
    title: string
    links: { label: string; href: string }[]
  }[]
  bottomText: string
  showSocials: boolean
  updatedAt: Date
}

export type ThemeConfig = {
  _id?: ObjectId
  key: 'theme'
  colorPrimary: string
  colorSecondary: string
  colorAccent: string
  colorBg: string
  colorText: string
  fontDisplay: string
  fontBody: string
  borderRadius: string
  updatedAt: Date
}

// ── Forms / Leads ─────────────────────────────────────────────────
export type FormDoc = {
  _id?: ObjectId
  name: string
  fields: {
    name: string
    label: string
    type: 'text' | 'email' | 'phone' | 'textarea' | 'select'
    required: boolean
    options?: string[]
  }[]
  emailTo: string
  emailSubject: string
  successMessage: string
  createdAt: Date
  updatedAt: Date
}

export type LeadDoc = {
  _id?: ObjectId
  formId: string
  formName: string
  data: Record<string, string>
  source: string
  ip?: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: Date
}

// ── Tracking ──────────────────────────────────────────────────────
export type TrackingConfig = {
  _id?: ObjectId
  key: 'tracking'
  googleAnalyticsId: string
  googleTagManagerId: string
  metaPixelId: string
  hotjarId: string
  clarityId: string
  customHeadScripts: string
  customBodyScripts: string
  updatedAt: Date
}
