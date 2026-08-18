# SEO status — full crawl, 15 August 2026

Supersedes the 14 August round. All 66 sitemap URLs crawled against **raw server
HTML** (what Googlebot receives, not the rendered DOM), plus a console and
network audit across five templates, plus Search Console data.

---

## Crawl summary

| Check | Result |
| --- | --- |
| URLs crawled | 66 |
| Non-200 responses | 0 |
| Fetch errors | 0 |
| Accidental `noindex` | 0 |
| Duplicate `<title>` | 0 |
| Images missing `alt` | 0 |
| Skipped heading levels | 0 |
| Malformed JSON-LD | 0 |
| Console errors/warnings | 0 |
| Failed network requests | 0 |
| Sitemap URLs missing `lastmod` | 1 of 66 |
| Median internal links per page | 12 |

The technical foundation is sound. Every remaining problem is **discoverability**,
not correctness.

## Search Console (90 days, to 15 Aug 2026)

- 3 clicks, 3,380 impressions, 0.1% CTR, **average position 62.7**
- 42 indexed / 61 not indexed
- **24 URLs "Discovered – currently not indexed"** — never crawled at all
- Core Web Vitals: **no field data** (insufficient traffic for CrUX)
- Breadcrumbs enhancement: 0 invalid / 5 valid
- All 3 clicks came from Pakistan; US contributed 1,550 impressions and none
- Zero commercial queries across 147 total — all informational comparisons

## Fixed this round

**Blog pagination was 301'd into a wall.** `next.config.ts` redirected
`/blog/page/:num` to `/blog`, but that is a live route and `BlogListing` links
straight at it. Rule removed. *(shipped in `fa67e11`)*

**Sitemap advertised 404s.** Uncategorised portfolio projects fell back to
`'other'`, but the `[category]` route resolves no such category — so every
`/portfolio/other/{slug}` we submitted 404'd. Now skipped with a warning.
*(shipped in `fa67e11`)*

**Case-variant duplicates.** `/Wordpress`, `/wooCommerce` and `/wooCommerce/`
sat in "Crawled, not indexed". Middleware now 301s mixed-case paths to
lowercase, excluding `/api` (ObjectIds are case-sensitive) and `/_next` (asset
hashes). *(shipped in `fa67e11`)*

**Duplicate brand in `/about` title** — was 70 chars with "ARIOSETECH" twice.
*(shipped in `fa67e11`)*

**`/services/shopify` had no `<h1>`.** Every working service page leads with a
visible `hero-interactive` section, which is what emits the H1. On Shopify it
was `hidden: true` with a `tool-hero` in front. Unhidden. *(database)*

**`/services/shopify` and `/portfolio` had empty SEO title and description
strings.** Both now authored. *(database)*

**Portfolio category pages had no `<h1>`** and all four served identical heading
text from the shared `/portfolio` document. Each now emits its own from
`CATEGORY_COPY`. *(commit `f909b42`)*

**Blog content.** Two ~250-word stubs and one 71-word stub rewritten in place at
their existing slugs (preserving ranking history); one new post published; all
13 posts now have distinct cover and OG images. Two pre-existing image faults
fixed: the courier article had Mario/Luigi figurines as its cover, and two posts
shared one image. *(database)*

## Still open — ranked

### 1. Four orphan pages
Zero inbound internal links anywhere: `/tools/shopify-theme-detector` (260
impressions), `/tools/seo-audit`, `/portfolio/seo`, `/about/team`. The `TOOLS`
nav dropdown appears client-rendered, so its links never reach server HTML.

### 2. Homepage renders only 15 internal links
Zero to blog posts, zero to `/industries/*`. The latest-posts block is fetched
client-side from `/api/blogs`, and `robots.txt` disallows `/api/`. Googlebot
honours that during rendering, so it sees none of those links. **This is the
most likely cause of the 24 never-crawled URLs.**

### 3. `/portfolio` index still has no `<h1>`
Its document has no hero section. One heading block in the builder fixes it.

### 4. Eighteen titles over 60 characters
Worst: `/services` (77), `/industries` (73), `/tools/wordpress-theme-detector`
(73), and four blog posts at 70–74.

### 5. Seven titles under 30 characters
`/services/seo` (25), `/about/team` (26), `/portfolio/seo` (29),
`/services/wordpress` (31). Wasted SERP real estate on money pages.

### 6. Two weak derived descriptions
`/services/wordpress` (53 chars) and `/services/woocommerce` (61) are the
`deriveDescription` fallback pulling hero subheadlines. Better than empty, but
these are money pages and deserve authored copy.

### 7. Blog featured-image alt text uses the post title
Non-empty and reasonable, but it describes the article rather than the photo.
The template does not read the `imageAlt` field now stored on each post.

## Checklist status

| # | Item | Status |
| --- | --- | --- |
| 1 | One canonical: HTTPS, non-www, no trailing slash | Done — verify `http://www` at DNS level |
| 2 | 301s for legacy URLs | Done — 43 rules, pagination bug fixed, case variants covered |
| 3 | Only canonical, indexable URLs in sitemap | Done — `/portfolio/other/*` no longer emitted |
| 4 | Accurate `lastmod` | Done — 65 of 66 |
| 5 | Validate structured data | Done — verified in live HTML on every template; 0 malformed |
| 6 | Remove duplicate Service/FAQPage schema | Done — verified exactly one of each |
| 7 | Markup only where visible evidence supports it | Done |
| 8 | Article schema | Done — `BlogPosting` confirmed live |
| 9 | Images: dimensions, alt, AVIF/WebP, lazy, LCP priority | Done — 0 missing alt; alt text quality noted above |
| 10 | PageSpeed per template | **Deprioritised** — no CrUX field data exists |
| 11 | Crawl: nav, forms, links, headings, titles, 404s | Mostly — see items 1–6 above |
| 12 | Track tool errors | Done — theme detector verified on success and failure paths |

## Method note

Page fetches converted to markdown strip `<script type="application/ld+json">`
and can flatten heading levels. Every finding here is from **raw HTML parsed in
the browser**, which is why several earlier conclusions were corrected:
`/services` does have a meta description, and `/services/shopify` had zero H1s
rather than two.
