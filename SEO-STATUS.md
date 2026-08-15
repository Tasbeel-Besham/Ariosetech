# Technical SEO checklist — what was still open, and what I changed

Audited the repo and crawled the live site on **14 August 2026**. The previous
round's README claimed items 6 and 8 were "verified correct" — the code says
otherwise, and the live crawl confirms it. Details below.

**Verification run:** all 15 edited files parse clean through the TypeScript
compiler; the new sitemap and breadcrumb logic was executed against sample data
and its output checked (see "How I verified" at the end). I could not run
`next build` — the sandbox has no copy of `node_modules` and your MongoDB is
IP-allowlisted, so it is unreachable from here. **Run `npm run build` before
deploying.**

---

## The big one: duplicate Service and FAQPage schema was never fixed

`BuilderRenderer` — which renders every builder page, including the homepage,
`/portfolio` and all of `/services/*` — emitted this on every page:

```jsx
<SchemaMarkup type="Service" pageUrl={...} faqs={faqs} />
```

Meanwhile `app/(site)/[...slug]/page.tsx` **already** emits `Service` schema for
`/services/*` paths and `FAQPage` schema from the same FAQ sections. So:

| Page | Service nodes | FAQPage nodes |
| --- | --- | --- |
| `/services/wordpress` | **2** | **2** |
| `/services/shopify` | **2** | **2** |
| `/services/woocommerce` | **2** | **2** |
| `/services/seo` | **2** | **2** |

Worse, `type="Service"` was hardcoded, so pages that are not services claimed to
be one:

- the **homepage** carried a `Service` schema literally named "Home"
- `/portfolio` and every `/industries/*` page carried one too

That is markup with no visible evidence behind it — checklist item 7.

There was a third fault in the same component. `SchemaMarkup` could emit a
`ProfessionalService` node using `https://ariosetech.com/#organization` — the
**exact `@id`** the real `Organization` node in `app/layout.tsx` uses. Two
different `@type`s sharing one `@id` makes the entity graph ambiguous, and every
`publisher: { "@id": ... }` reference on the site points at that id.

**Fixed.** Schema now lives in the route files, which know what each page
actually is. `SchemaMarkup.tsx` is retired to a comment explaining why, with no
default export — re-importing it fails the build, which is the point.

Because that component was also the homepage's only source of markup, the
homepage now emits its own `WebPage` + `FAQPage` (built from the FAQ section it
visibly renders) in `app/(site)/page.tsx`.

---

## BreadcrumbList: ten pages showed a trail with no schema, one contradicted itself

`AutoBreadcrumbs` renders a visible trail site-wide. Only three routes emitted
matching `BreadcrumbList` schema. So `/about`, `/contact`, `/faq`, `/blog`,
every blog post, `/privacy-policy`, `/terms-of-service`, all three `/tools/*`
pages and the four `/portfolio/{category}` pages showed breadcrumbs Google could
see but not parse.

And `/author/{slug}` was worse than missing — it declared:

```
Home / Blog / Tasbeel Besham        ← the schema
Home / Author / Tasbeel Besham      ← what the page actually shows
```

Structured data contradicting visible content is precisely what the spammy
structured markup policy targets.

**Fixed** by emitting `BreadcrumbList` from `AutoBreadcrumbs` itself, built from
the same `trail` it renders — they cannot drift now. The three per-page copies
were removed so nothing emits it twice. It is a client component, but Next
server-renders it, so the JSON-LD is in the initial HTML with no JS required.

Verified output for `/portfolio/wordpress/aruba-help`:

```
1.Home / 2.Portfolio / 3.WordPress / 4.Aruba Help
```

— which matches the visible bar exactly.

---

## Missing meta descriptions — the fallback had a blind spot

Live crawl: `/services` and `/services/wordpress` both ship with **no meta
description at all**. `/services` is the hub every other service page links to.

There is a `deriveDescription` fallback for exactly this, but it only checked
four prop names — `desc`, `intro`, `sub`, `body`. Those two pages store their
hero copy under **`subheadline`**, which the list did not know about.

**Fixed.** The fallback now checks 17 prop names across the section components,
in order of how well each summarises a page (explicit `summary` first, hero
sub-copy next, generic body copy last), skips hidden sections, collapses
whitespace and trims on a word boundary at 160 characters.

The two pages also get explicit, hand-written descriptions via the console
script below — an authored description beats a derived one.

---

## Everything else I changed

**Duplicate brand name in blog titles.** The root layout appends `| ARIOSETECH`
via its title template, and `/blog` spelled the brand out again:

```
Blog | WordPress, Shopify & WooCommerce Insights — ARIOSETECH | ARIOSETECH
```

Same on every `/blog/page/{n}`. Fixed both — that is 14 characters back in a
60-character budget.

**Sitemap `lastmod`: 14 of 101 URLs had none**, including the homepage. Those
are `.tsx` files with no `updatedAt` to read. Now:

- `/` → newest of any post, project or page (all three surface on it)
- `/blog` → newest post
- `/portfolio/{cat}` → newest project *in that category*
- the legal, contact, FAQ and tools pages → a hand-maintained constant

Deliberately **not** a build timestamp. A date that moves on every deploy is a
lie, and Google discounts `lastmod` it finds unreliable. Down from 14 missing to
0 for every route that has a real date behind it.

**`/portfolio/{category}` pages had no schema whatsoever.** The builder branch
called `BuilderRenderer` without a `pageUrl`, so nothing fired. They now emit
`WebPage` plus an `ItemList` of the projects they actually list.

**Article schema author was always an Organization.** `articleSchema()`
hardcoded `author: { '@type': 'Organization' }` regardless of what you passed.
Google's article guidance asks for the person who wrote it, with a `url` to a
page about them — that is what the "author missing url" warning in the Rich
Results Test is asking for. It now emits a `Person` with `url`, `jobTitle` and
`worksFor` when an author profile exists, and still falls back to the
Organization when one does not. Added `reviewedBy` support too.

(The blog post template at `app/(site)/blog/[slug]/page.tsx` already built a
proper `Person` inline — this fixes the shared helper the admin schema generator
uses.)

**Blog posts had a `dateModified` nothing on the page showed.** Added a visible
"Updated {date}" line, and gated *both* it and the schema field on the same rule
— at least 24 hours after publication — so a same-day typo fix cannot fake a
refresh, and the two can never disagree.

**FAQPage and ItemList could be built from hidden sections.** `BuilderRenderer`
skips sections with `meta.hidden`, but `faqFromSections()` and the ItemList
lookup did not, so a hidden FAQ block would be marked up as visible content.
Both now skip hidden sections.

**`ToolHeroSection` defaulted to WordPress copy.** Its default headline was
"Powerful WordPress development for your business", so a section saved without
an explicit headline advertised WordPress wherever it landed. That is the direct
cause of the `/services/shopify` problem below. The default is now
platform-neutral, so this cannot recur on a new page.

---

## Three things still need you — they are database content, not code

Your MongoDB is IP-allowlisted, so I could not reach it from here. `fix-remaining-seo.js`
does all three through your own admin API. Log into `/admin/pages`, press F12 →
Console, paste the file, Enter. Safe to run twice.

1. **`/services/shopify` has two `<h1>` tags**, and the first one is about the
   wrong platform:

   ```
   H1: Powerful WordPress development for your business   ← tool-hero, saved as h1
   H1: Complete Shopify Solutions for E-commerce Success  ← the real hero
   ```

   The script demotes the tool hero to `h2` and gives it Shopify copy.

2. **`/services` has no meta description.** Script adds one.
3. **`/services/wordpress` has no meta description.** Script adds one.

The earlier `fix-crawl-findings.js` was meant to cover 1 and 3; the live crawl
shows they never landed, while its other fixes did (`/portfolio` now has an h1,
and `/services/woocommerce` and `/services/seo` now have descriptions).

---

## Checklist status

| # | Item | Status |
| --- | --- | --- |
| 1 | One canonical: HTTPS, non-www, no trailing slash | Done — verified live |
| 2 | 301s for legacy portfolio and blog URLs | Done — 43 rules in `next.config.ts` |
| 3 | Only canonical, indexable URLs in the sitemap | Done |
| 4 | Accurate `lastmod` when content materially changes | **Fixed this round** — was missing on 14 URLs |
| 5 | Validate all structured data in Rich Results Test | **Yours** — needs your browser |
| 6 | Remove duplicate Service and FAQPage schema | **Fixed this round** — was double on all 4 service pages |
| 7 | Markup only where visible evidence supports it | **Fixed this round** — bogus Service on homepage/portfolio, hidden-section FAQs |
| 8 | Article schema: named author, dates, image, reviewer | **Fixed this round** — helper emitted Organization; updated date now visible |
| 9 | Images: dimensions, alt, AVIF/WebP, lazy, LCP priority | Done previously — `next.config.ts` has AVIF/WebP, gallery uses `next/image` |
| 10 | PageSpeed Insights per template | **Yours** — needs field data |
| 11 | Crawl: nav, forms, links, heading order, titles, 404s | Mostly done — duplicate titles fixed, `/services/shopify` double-h1 needs the script |
| 12 | Track tool errors | Done previously — `lib/tool-errors.ts` |

**5, 10 and 11 need your own tools and Search Console access.** For 11, a full
Screaming Frog run is still worth doing — I fetch pages one at a time, and it
crawls every URL and catches the long tail I cannot reach.

Two heading-order oddities I noticed but did not touch, because they are copy
decisions rather than technical faults:

- `/services/seo` repeats "Common SEO Problems We Help Fix" as an `h2` and then
  immediately as an `h3`
- `/services/wordpress` runs two sentences together in one `h1`: "Professional
  WordPress Development Services Display Your Business Online with a WordPress
  Website"

---

## How I verified

- **Parse check** — all 15 edited files through the TypeScript compiler's
  parser, zero syntax errors.
- **Executed the new logic** — ran the sitemap `lastmod` resolution and the
  breadcrumb JSON-LD builder against sample page/blog/portfolio documents and
  checked the output. `lastmod` coverage went from 0/14 to 12/14 on the sample
  (the two gaps were categories with no dated projects in the test data);
  breadcrumb trails matched the visible bar on all four paths tested.
- **Diff check** — confirmed exactly 15 modified files plus 1 new one, no
  accidental edits.
- **Not verified** — `npm run build`, `tsc --noEmit` and `eslint` across the
  whole project. `node_modules` is not available in this sandbox. Since
  `next.config.ts` sets `ignoreBuildErrors: false` and `ignoreDuringBuilds:
  false`, a type or lint error will fail the deploy rather than ship broken —
  **run the build locally first.**

## Files changed

```
app/(site)/[...slug]/page.tsx                    broader description fallback; no duplicate breadcrumb; hidden-section guard
app/(site)/page.tsx                              homepage WebPage + FAQPage schema
app/(site)/author/[slug]/page.tsx                removed contradictory breadcrumb schema
app/(site)/blog/[slug]/page.tsx                  visible updated date; dateModified gated to match
app/(site)/blog/page.tsx                         removed duplicate brand from title
app/(site)/blog/page/[page]/page.tsx             removed duplicate brand from title
app/(site)/portfolio/[category]/page.tsx         WebPage + ItemList schema (had none)
app/(site)/portfolio/[category]/[slug]/page.tsx  removed duplicate breadcrumb schema
app/layout.tsx                                   corrected stale comment reference
app/sitemap.xml/route.ts                         lastmod for the 14 file routes
components/builder/canvas/BuilderRenderer.tsx    removed the duplicate-schema source
components/sections/ToolHeroSection.tsx          platform-neutral default headline
components/ui/AutoBreadcrumbs.tsx                emits BreadcrumbList site-wide
components/ui/SchemaMarkup.tsx                   retired, with the reasoning kept
lib/schema.ts                                    Person author + reviewedBy; hidden-section guard
fix-remaining-seo.js                             NEW — the three database fixes
```
