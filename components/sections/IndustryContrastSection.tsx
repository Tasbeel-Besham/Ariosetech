/**
 * Industry Contrast — the argument, made by comparison.
 *
 * A claim like "we understand your industry" is unfalsifiable and every agency
 * makes it. This section proves the claim structurally instead: each row puts
 * two businesses side by side that look identical on a services page, then
 * names the one technical decision that differs between them.
 *
 * Nobody who hasn't built both can write these rows, which is the point.
 * Deliberately typographic — no icons — because the content is a comparison
 * and an icon would only decorate it.
 */

type Pair = { subject: string; left: string; leftDetail: string; right: string; rightDetail: string }

type Props = {
  headingTag?: string
  eyebrow?: string
  headline?: string
  intro?: string
  pairs?: Pair[]
}

const DEFAULT_PAIRS: Pair[] = [
  {
    subject: 'A product with options',
    left: 'Fashion',
    leftDetail: 'Colour and size multiply into hundreds of variants, each needing its own stock count, and shoppers filter by colour before anything else. Get the colour taxonomy wrong and the filter silently returns nothing.',
    right: 'Perfume',
    rightDetail: 'One scent, three bottle sizes, and a sample that is a different product with different margins. The decision is whether a sample purchase discounts the full bottle later.',
  },
  {
    subject: 'A price',
    left: 'Retail',
    leftDetail: 'One number, visible to everyone, occasionally discounted by a coupon. The checkout maths is addition.',
    right: 'Wholesale',
    rightDetail: 'Price depends on who is logged in, how many units they take, and what was agreed on their contract. Nothing is shown until an account is approved.',
  },
  {
    subject: 'Shipping',
    left: 'Jewelry',
    leftDetail: 'Small, light, insured, signature on delivery. Cost barely moves with basket size, so free shipping is safe to offer.',
    right: 'Home & Decor',
    rightDetail: 'A sofa ships by freight with a delivery window, a kerbside option, and a return that costs more than the margin. Free shipping here is a way to lose money quietly.',
  },
  {
    subject: '"In stock"',
    left: 'Sports Equipment',
    leftDetail: 'Custom kit is made after the order, so stock is really lead time. The page has to promise a date, not a quantity.',
    right: 'Telecommunications',
    rightDetail: 'Availability is a postcode question before it is a product question. The wrong answer wastes an engineer visit.',
  },
]

export default function IndustryContrastSection({
  headingTag = 'h2',
  eyebrow = 'Why the vertical matters',
  headline = 'The same brief, built two different ways',
  intro = 'Each pair below looks like one job on a proposal. In the build they diverge early, and the decision that separates them is usually made in the first week.',
  pairs = DEFAULT_PAIRS,
}: Props) {
  const list = Array.isArray(pairs) && pairs.length ? pairs : DEFAULT_PAIRS
  const Heading = (headingTag || 'h2') as 'h2' | 'h3'

  return (
    <section className="ind-contrast">
      <div className="ind-shell">
        <div className="ind-contrast-head">
          <p className="ind-eyebrow">{eyebrow}</p>
          <Heading className="ind-contrast-title">{headline}</Heading>
          <p className="ind-contrast-intro">{intro}</p>
        </div>

        <div className="ind-contrast-rows">
          {list.map((pair, i) => (
            <article className="ind-pair" key={i}>
              <h3 className="ind-pair-subject">{pair.subject}</h3>
              <div className="ind-pair-cols">
                <div className="ind-pair-col">
                  <p className="ind-pair-label">{pair.left}</p>
                  <p className="ind-pair-text">{pair.leftDetail}</p>
                </div>
                <div className="ind-pair-split" aria-hidden="true" />
                <div className="ind-pair-col">
                  <p className="ind-pair-label">{pair.right}</p>
                  <p className="ind-pair-text">{pair.rightDetail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
