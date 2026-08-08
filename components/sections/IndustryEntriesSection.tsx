import Link from 'next/link'

/**
 * Industry Entries — the substance of the page.
 *
 * One entry per vertical, laid out as a specimen sheet: number, name, the
 * problem that vertical actually hits, what gets built for it, and the stack
 * it usually lands on. Numbering is used because the index above refers to it,
 * so the order carries real information rather than decoration.
 *
 * Every entry is rendered in full. No tabs, no accordion, nothing revealed on
 * click — a crawler and an answer engine see all eleven without running any
 * JavaScript, which is the whole reason this content exists.
 */

type Entry = {
  anchor: string
  name: string
  problem: string
  build: string
  stack: string
}

type Props = {
  headingTag?: string
  eyebrow?: string
  headline?: string
  entries?: Entry[]
  closingTitle?: string
  closingText?: string
  ctaLabel?: string
  ctaHref?: string
}

const DEFAULT_ENTRIES: Entry[] = [
  {
    anchor: 'fashion-apparel',
    name: 'Fashion & Apparel',
    problem: 'A few hundred styles become thousands of variants once colour and size are combined, and shoppers filter by colour before they filter by anything else. When colour is stored as free text on some products and as a taxonomy reference on others, the filter returns an empty page and nobody reports it.',
    build: 'A single colour taxonomy applied across the whole catalogue, size charts that vary by garment type rather than one chart sitewide, and a returns flow that assumes most returns are exchanges for a different size.',
    stack: 'Shopify · WooCommerce',
  },
  {
    anchor: 'beauty-cosmetics',
    name: 'Beauty & Cosmetics',
    problem: 'Shade is the entire purchasing decision and a screenshot of a swatch is not enough. Shoppers also need ingredients before they buy, and the list differs by market.',
    build: 'Shade selectors that carry real swatch data rather than a colour name, ingredient panels that stay accurate per region, and a repeat-purchase path that gets a known shade back into the basket in one tap.',
    stack: 'Shopify · WooCommerce',
  },
  {
    anchor: 'fragrances-perfumes',
    name: 'Fragrances & Perfumes',
    problem: 'You cannot smell a website. Samples carry the discovery load, but a sample is a separate product with separate margin, and shipping fragrance is restricted on most carriers.',
    build: 'Sample-to-full-bottle credit, scent family navigation that works for someone who cannot name what they want, and carrier rules that stop a restricted order at checkout instead of at the depot.',
    stack: 'Shopify · WooCommerce',
  },
  {
    anchor: 'sports-equipment',
    name: 'Sports Equipment',
    problem: 'Custom kit is manufactured after the order, so a stock number means nothing. The page has to commit to a date, and team orders arrive as one basket with twenty different names and sizes in it.',
    build: 'Made-to-order configurators with lead times on the product page, bulk team ordering that does not require twenty separate line items, and verification pages so a buyer can confirm a product is genuine.',
    stack: 'Shopify Liquid · WooCommerce',
  },
  {
    anchor: 'b2b-wholesale',
    name: 'B2B Wholesale',
    problem: 'Price depends on who is asking. A logged-out visitor should see nothing, an approved account sees their tier, and a contract customer sees a number that was negotiated offline. Retail checkout assumes the opposite of all three.',
    build: 'Gated catalogues with account approval, quantity-break pricing per customer group, minimum order rules, and quote requests for anything the pricing table cannot answer.',
    stack: 'WooCommerce · Shopify Plus',
  },
  {
    anchor: 'jewelry-accessories',
    name: 'Jewelry & Accessories',
    problem: 'High value per parcel, low tolerance for ambiguity. Ring sizing, metal and stone options multiply quickly, and made-to-order pieces need a date rather than a dispatch estimate.',
    build: 'Configurators that price a combination rather than a product, certification and hallmark detail on the page where it is needed, and insured delivery presented clearly enough to reduce pre-purchase questions.',
    stack: 'Shopify · WooCommerce',
  },
  {
    anchor: 'health-wellness',
    name: 'Health & Wellness',
    problem: 'Revenue lives in the second order, not the first, so subscription mechanics matter more than the storefront. Claims about what a product does are regulated, and the rules differ by market.',
    build: 'Subscription flows with pause, skip and swap that customers can operate themselves, plus content structured so compliance-sensitive claims can be changed in one place rather than fifty.',
    stack: 'Shopify · WooCommerce',
  },
  {
    anchor: 'home-decor',
    name: 'Home & Decor',
    problem: 'Freight, not parcels. Delivery is a window rather than a day, returns can cost more than the item made, and shoppers want to know how something looks in a room they are standing in.',
    build: 'Dimensional shipping rules that quote real freight, room and scale context on the product page, and a returns policy the checkout actually enforces instead of one that only exists on a policy page.',
    stack: 'WooCommerce · WordPress',
  },
  {
    anchor: 'transport-logistics',
    name: 'Transport & Logistics',
    problem: 'Nothing is bought from the page. The job is to turn a visitor into a qualified quote request with enough detail that the first reply can contain a price.',
    build: 'Quote forms that ask the four questions dispatch actually needs, service-area pages that rank for the routes you run, and lead routing that reaches a phone rather than an inbox nobody opens.',
    stack: 'WordPress · Next.js',
  },
  {
    anchor: 'telecommunications',
    name: 'Telecommunications',
    problem: 'Availability is a postcode question before it is a product question. Showing a plan that cannot be installed at an address wastes an engineer visit and a customer.',
    build: 'Address-first availability checks, plan comparison that stays readable at ten plans, and disclosure copy that satisfies the provider agreement without burying the offer.',
    stack: 'WordPress · MySQL · Next.js',
  },
  {
    anchor: 'education',
    name: 'Education',
    problem: 'Enrolment is a considered decision made over several visits, often by someone who is not the student. Course information ages badly and is usually maintained by people who do not work in the CMS.',
    build: 'Course structures that non-technical staff can update without breaking layout, enrolment forms that survive part-completion, and intake deadlines that are visible before someone has invested an hour.',
    stack: 'WordPress · Next.js',
  },
]

export default function IndustryEntriesSection({
  headingTag = 'h2',
  eyebrow = 'The entries',
  headline = 'What each one actually needs',
  entries = DEFAULT_ENTRIES,
  closingTitle = 'Not on the list?',
  closingText = 'Eleven verticals is where our experience is deep enough to be useful on day one. It is not a limit. If you sell something that is not here, tell us how it is ordered, priced and delivered, and we will tell you honestly whether we are the right build partner.',
  ctaLabel = 'Describe your project',
  ctaHref = '/contact',
}: Props) {
  const list = Array.isArray(entries) && entries.length ? entries : DEFAULT_ENTRIES
  const Heading = (headingTag || 'h2') as 'h2' | 'h3'

  return (
    <section className="ind-entries">
      <div className="ind-shell">
        <div className="ind-entries-head">
          <p className="ind-eyebrow">{eyebrow}</p>
          <Heading className="ind-entries-title">{headline}</Heading>
        </div>

        <div className="ind-entry-list">
          {list.map((entry, i) => (
            <article className="ind-entry" id={entry.anchor} key={entry.anchor || i}>
              <div className="ind-entry-mark">
                <span className="ind-entry-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="ind-entry-rule" aria-hidden="true" />
              </div>

              <div className="ind-entry-body">
                <h3 className="ind-entry-name">{entry.name}</h3>

                <div className="ind-entry-grid">
                  <div className="ind-entry-cell">
                    <p className="ind-entry-label">The problem</p>
                    <p className="ind-entry-text">{entry.problem}</p>
                  </div>
                  <div className="ind-entry-cell">
                    <p className="ind-entry-label">What we build</p>
                    <p className="ind-entry-text">{entry.build}</p>
                  </div>
                </div>

                <p className="ind-entry-stack">
                  <span className="ind-entry-stack-label">Usually</span>
                  <span className="ind-entry-stack-value">{entry.stack}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Closing note — deliberately plain. An oversized CTA after eleven
            detailed entries would undercut the tone of the page. */}
        <div className="ind-closing">
          <h3 className="ind-closing-title">{closingTitle}</h3>
          <p className="ind-closing-text">{closingText}</p>
          {ctaLabel && (
            <Link href={ctaHref} className="ind-closing-link">
              {ctaLabel}
              <span aria-hidden="true">&#8594;</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
