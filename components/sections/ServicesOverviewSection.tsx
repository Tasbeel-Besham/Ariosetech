'use client'
import Link from 'next/link'
import { ArrowSVG } from '@/components/ui/IconBox'

type ServiceItem = {
  num?: string
  title?: string
  tagline?: string
  desc?: string
  features?: string   // comma separated
  price?: string
  href?: string
  anchor?: string
}

type Props = {
  eyebrow?: string
  headline?: string
  intro?: string
  items?: ServiceItem[]
}

const DEFAULT_ITEMS: ServiceItem[] = [
  { num: '01', title: 'WordPress Development', tagline: 'Powerful, scalable websites', desc: 'Custom themes, complex functionality, and lightning-fast, SEO-ready builds — from brochure sites to membership platforms.', features: 'Custom themes,Speed optimization,Security hardening,Migrations', price: 'From $799', href: '/services/wordpress' },
  { num: '02', title: 'WooCommerce Development', tagline: 'Stores built to sell', desc: 'Profitable online stores with seamless checkout, payment gateways, and inventory that scales with your business.', features: 'Store setup,Payment gateways,Multi-vendor,COD workflows', price: 'From $1,299', href: '/services/woocommerce' },
  { num: '03', title: 'Shopify Development', tagline: 'Scale without limits', desc: 'From your first storefront to Shopify Plus — custom themes, app integrations, and conversion-focused design.', features: 'Custom themes,Shopify Plus,App integration,CRO', price: 'From $999', href: '/services/shopify' },
  { num: '04', title: 'SEO Services', tagline: 'Get found faster', desc: 'Technical, local, and content SEO that moves you up the rankings and brings in customers who are ready to buy.', features: 'Technical SEO,Local SEO,Content strategy,Core Web Vitals', price: 'Custom', href: '/services/seo' },
]

export default function ServicesOverviewSection({
  eyebrow = 'What We Do',
  headline = 'Services built around your growth',
  intro = 'Four core capabilities, one senior team. Every engagement is scoped to your business goals — not a template.',
  items = [],
}: Props) {
  const list = items.length ? items : DEFAULT_ITEMS
  return (
    <section className="section svc-ov">
      <div className="container">
        <div className="svc-ov-head">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="svc-ov-headline">{headline}</h2>
          {intro && <p className="svc-ov-intro">{intro}</p>}
        </div>

        <div className="svc-ov-list">
          {list.map((s, i) => {
            const feats = (s.features || '').split(',').map(f => f.trim()).filter(Boolean)
            const href = s.href || '/contact'
            return (
              <Link href={href} key={i} id={s.anchor || undefined} className="svc-ov-card group" style={s.anchor ? { scrollMarginTop: '90px' } : undefined}>
                <div className="svc-ov-num">{s.num || String(i + 1).padStart(2, '0')}</div>
                <div className="svc-ov-body">
                  <div className="svc-ov-title-row">
                    <h3 className="svc-ov-title">{s.title}</h3>
                    {s.tagline && <span className="svc-ov-tagline">{s.tagline}</span>}
                  </div>
                  <p className="svc-ov-desc">{s.desc}</p>
                  {feats.length > 0 && (
                    <div className="svc-ov-feats">
                      {feats.map(f => <span key={f} className="svc-ov-feat">{f}</span>)}
                    </div>
                  )}
                </div>
                <div className="svc-ov-aside">
                  {s.price && <span className="svc-ov-price">{s.price}</span>}
                  <span className="svc-ov-arrow"><ArrowSVG size={16} /></span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
