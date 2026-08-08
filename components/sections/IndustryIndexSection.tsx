import Link from 'next/link'

/**
 * Industry Index — the page opener.
 *
 * The template answer for an industries hero is a headline over a grid of
 * icon cards. It tells a visitor nothing: eleven identical tiles read as
 * "we'll take any work". This opens instead with the contents page of a
 * technical manual — every vertical listed, numbered, with dotted leaders
 * running to a one-word specialism on the right.
 *
 * The structure is honest rather than decorative: it is a real index, each row
 * is an anchor to that entry further down, and the count is the argument. It
 * also means the whole list is in the DOM at page load, so a crawler and an
 * answer engine both see all eleven verticals without running any JavaScript.
 */

type Row = { name: string; focus: string; anchor: string }

type Props = {
  headingTag?: string
  eyebrow?: string
  headline?: string
  intro?: string
  note?: string
  rows?: Row[]
}

const DEFAULT_ROWS: Row[] = [
  { name: 'Fashion & Apparel',       focus: 'Variants',    anchor: 'fashion-apparel' },
  { name: 'Beauty & Cosmetics',      focus: 'Shade match', anchor: 'beauty-cosmetics' },
  { name: 'Fragrances & Perfumes',   focus: 'Sampling',    anchor: 'fragrances-perfumes' },
  { name: 'Sports Equipment',        focus: 'Custom kit',  anchor: 'sports-equipment' },
  { name: 'B2B Wholesale',           focus: 'Tier pricing',anchor: 'b2b-wholesale' },
  { name: 'Jewelry & Accessories',   focus: 'Made to order', anchor: 'jewelry-accessories' },
  { name: 'Health & Wellness',       focus: 'Subscriptions', anchor: 'health-wellness' },
  { name: 'Home & Decor',            focus: 'Freight',     anchor: 'home-decor' },
  { name: 'Transport & Logistics',   focus: 'Quoting',     anchor: 'transport-logistics' },
  { name: 'Telecommunications',      focus: 'Availability',anchor: 'telecommunications' },
  { name: 'Education',               focus: 'Enrolment',   anchor: 'education' },
]

export default function IndustryIndexSection({
  headingTag = 'h1',
  eyebrow = 'Industries',
  headline = 'We build for eleven kinds of catalogue. They are not the same catalogue.',
  intro = 'A perfume store and a wholesale fabric supplier both sell products. Almost nothing else about them matches — not the variants, not the pricing rules, not what "in stock" means. These are the industries we know well enough to skip the discovery call.',
  note = 'Select an industry, or read the entries below.',
  rows = DEFAULT_ROWS,
}: Props) {
  const list = Array.isArray(rows) && rows.length ? rows : DEFAULT_ROWS
  const Heading = (headingTag || 'h1') as 'h1' | 'h2'

  return (
    <section className="ind-index">
      <div className="ind-shell">

        <div className="ind-index-lede">
          <p className="ind-eyebrow">{eyebrow}</p>
          <Heading className="ind-index-title">{headline}</Heading>
          <p className="ind-index-intro">{intro}</p>
        </div>

        {/* The index itself. A real table of contents, not an ornament. */}
        <nav className="ind-toc" aria-label="Industries covered">
          <p className="ind-toc-note">{note}</p>
          <ol className="ind-toc-list">
            {list.map((row, i) => (
              <li key={row.anchor || i} className="ind-toc-row">
                <Link href={`#${row.anchor}`} className="ind-toc-link">
                  <span className="ind-toc-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ind-toc-name">{row.name}</span>
                  <span className="ind-toc-leader" aria-hidden="true" />
                  <span className="ind-toc-focus">{row.focus}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

      </div>
    </section>
  )
}
