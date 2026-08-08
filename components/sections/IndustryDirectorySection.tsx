import Link from 'next/link'

/**
 * Industry Directory — the routing section for /industries.
 *
 * Each industry has its own page, so this page's job is to get people to the
 * right one, not to explain all eleven in place. Every row is a real link to
 * /industries/<slug>, which also passes internal link equity down to eleven
 * child pages that would otherwise be reachable only from the nav.
 *
 * Laid out as an editorial two-column: a sticky lede on the left, a linked list
 * on the right. Rows rather than a card grid — eleven identical cards read as
 * filler, while a list reads as a directory, which is what this is.
 */

type Item = { name: string; href: string; note: string; tags?: string }

type Props = {
  headingTag?: string
  eyebrow?: string
  headline?: string
  intro?: string
  countLabel?: string
  items?: Item[]
}

const DEFAULT_ITEMS: Item[] = [
  { name: 'Fashion & Apparel',     href: '/industries/fashion-apparel',     note: 'Colour and size multiply into thousands of variants, and colour is the first filter shoppers touch.', tags: 'Shopify · WooCommerce' },
  { name: 'Beauty & Cosmetics',    href: '/industries/beauty-cosmetics',    note: 'Shade is the whole decision, and ingredient lists change by market.',                             tags: 'Shopify · WooCommerce' },
  { name: 'Fragrances & Perfumes', href: '/industries/fragrances-perfumes', note: 'You cannot smell a website, so samples carry the discovery load.',                              tags: 'Shopify · WooCommerce' },
  { name: 'Sports Equipment',      href: '/industries/sports-equipment',    note: 'Custom kit is made after the order, so the page promises a date, not a quantity.',              tags: 'Shopify Liquid' },
  { name: 'B2B Wholesale',         href: '/industries/b2b-wholesale',       note: 'Price depends on who is logged in and what was agreed offline.',                               tags: 'WooCommerce · Plus' },
  { name: 'Jewelry & Accessories', href: '/industries/jewelry-accessories', note: 'High value per parcel, and configurators that price a combination rather than a product.',      tags: 'Shopify · WooCommerce' },
  { name: 'Health & Wellness',     href: '/industries/health-wellness',     note: 'Revenue lives in the second order, so subscription mechanics matter more than the storefront.',  tags: 'Shopify · WooCommerce' },
  { name: 'Home & Decor',          href: '/industries/home-decor',          note: 'Freight, not parcels. Free shipping here is a way to lose money quietly.',                       tags: 'WooCommerce' },
  { name: 'Transport & Logistics', href: '/industries/transport-logistics', note: 'Nothing is bought from the page. The job is a quote request detailed enough to price.',          tags: 'WordPress · Next.js' },
  { name: 'Telecommunications',    href: '/industries/telecommunications',  note: 'Availability is a postcode question before it is a product question.',                          tags: 'WordPress · MySQL' },
  { name: 'Education',             href: '/industries/education',           note: 'Enrolment is decided over several visits, often by someone who is not the student.',            tags: 'WordPress · Next.js' },
]

export default function IndustryDirectorySection({
  headingTag = 'h2',
  eyebrow = 'Industries',
  headline = 'Eleven verticals we know well enough to skip the discovery call',
  intro = 'A perfume store and a wholesale fabric supplier both sell products. Almost nothing else about them matches — not the variants, not the pricing rules, not what "in stock" means. Pick yours to see how we build for it.',
  countLabel = '11 industries',
  items = DEFAULT_ITEMS,
}: Props) {
  const list = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS
  const Heading = (headingTag || 'h2') as 'h2' | 'h3'

  return (
    <section className="inddir">
      <div className="inddir-shell">

        {/* Lede — sticky on desktop so the framing stays with the list */}
        <div className="inddir-lede">
          <p className="inddir-eyebrow">{eyebrow}</p>
          <Heading className="inddir-title">{headline}</Heading>
          <p className="inddir-intro">{intro}</p>
          {countLabel && <p className="inddir-count">{countLabel}</p>}
        </div>

        {/* The directory */}
        <ul className="inddir-list">
          {list.map((item, i) => (
            <li key={item.href || i} className="inddir-item">
              <Link href={item.href} className="inddir-row">
                <span className="inddir-bar" aria-hidden="true" />
                <span className="inddir-num">{String(i + 1).padStart(2, '0')}</span>

                <span className="inddir-main">
                  <span className="inddir-name">{item.name}</span>
                  {item.note && <span className="inddir-note">{item.note}</span>}
                </span>

                {item.tags && <span className="inddir-tags">{item.tags}</span>}

                <span className="inddir-arrow" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}
