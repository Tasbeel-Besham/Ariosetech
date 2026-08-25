# Page Content Audits — 25 August 2026

Covers the two rows on the sheet's **Page Content Audits** tab. Both pages were
parsed from raw server HTML (what Googlebot receives), cross-referenced against
Search Console.

---

## 1. HomePage — https://ariosetech.com/

**Verdict: technically sound, commercially isolated.**

| Check | Value | Status |
| --- | --- | --- |
| HTTP status | 200 | Pass |
| Title | "WordPress, Shopify & WooCommerce Development Agency \| ARIOSETECH" | **64 chars — 4 over** |
| Meta description | "Professional WordPress, Shopify & WooCommerce development since 2017. 100+ businesses scaled globally." | **102 chars — 50 short** |
| Canonical | `https://ariosetech.com` | Pass |
| Robots | index,follow | Pass |
| H1 | 1 — "Professional WordPress, Shopify & WooCommerce Development Since 2017" | Pass |
| H2 / H3 | 13 / 13 | Pass |
| Word count | 3,300 | Pass |
| Schema | Organization, WebSite, WebPage, FAQPage | Pass |
| Images missing alt | 0 | Pass |
| og:image | Present | Pass |
| **Internal links** | **15 total** | **Fail** |

### The problem

Fifteen internal links on your most authoritative page, and of those:

- **0** links to any blog post
- **0** links to any `/industries/*` page
- **1** link to a service page
- 3 links to case studies

The latest-posts block is fetched client-side from `/api/blogs`, and `robots.txt`
disallows `/api/`. Googlebot honours that while rendering, so it never sees those
links. Your homepage passes almost no authority to anything.

### Also worth fixing

The homepage's impressions are split across **three hostname variants**:
`https://ariosetech.com/` (21 impressions, position 14.2), `http://www.ariosetech.com/`
(23, position 12.9) and `https://www.ariosetech.com/` (9, position 2.8). Three
URLs, one page, authority divided three ways.

### Actions

1. Server-render the latest-posts block so its links reach crawlers — highest impact
2. Add links to the industries pages and to more service pages
3. Extend the meta description to ~155 characters
4. Trim the title by ~4 characters
5. Confirm `http://www` redirects to `https://` apex at DNS/Vercel level

---

## 2. WordPress Services — https://ariosetech.com/services/wordpress

**Verdict: strong content, wasted metadata, completely unlinked.**

| Check | Value | Status |
| --- | --- | --- |
| HTTP status | 200 | Pass |
| Title | "WordPress Services \| ARIOSETECH" | **31 chars — 29 wasted** |
| Meta description | "Display Your Business Online with a WordPress Website" | **53 chars — headline fragment, not a description** |
| Canonical | self-referencing | Pass |
| Robots | index,follow | Pass |
| H1 | 1 — "Professional WordPress Development Services" | Pass |
| H2 / H3 | 10 / 11 | Pass |
| Word count | 2,662 | Pass |
| Schema | Organization, WebSite, BreadcrumbList, WebPage, Service, FAQPage | Pass |
| Images missing alt | 0 | Pass |
| **Internal links** | **12 total, 0 to other services, 0 to blog** | **Fail** |
| Search Console | Not in top pages — negligible impressions | **Fail** |

### The problems

**The title wastes half its budget.** "WordPress Services" uses 31 of ~60
available characters on a page targeting one of your primary commercial terms.
Nothing about development, custom builds, migration, or maintenance — all of
which the page covers in depth.

**The meta description is a headline fragment.** "Display Your Business Online
with a WordPress Website" is the second line of the hero from your content doc,
picked up by the `deriveDescription` fallback. It reads as a slogan, not a
search result. The doc's actual subheadline is proper sales copy and would fit
after a trim.

**The page is an island.** Zero links to `/services/woocommerce`, `/services/shopify`
or `/services/seo`, and zero to any blog post — despite `wordpress-speed-optimization-guide`,
`wordpress-security-best-practices` and `wordpress-website-cost-2026` all being
directly relevant and all sitting unread.

**A factual inconsistency.** The hero claims "Trusted by 100+ businesses
worldwide". Your content doc specifies 50+. `/services/woocommerce` claims 40+
and `/services/shopify` claims 30+, against a site-wide "100+ businesses" strip.
If WordPress alone is 100+, there is no room for the other two.

### Actions

1. Rewrite the title to use the full budget — e.g. "WordPress Development Services, Migration & Support" (51 + brand = 64; trim to fit)
2. Write a real meta description from the doc's subheadline, ~150 chars
3. Link to the three sibling service pages and to the three WordPress blog posts
4. Resolve the 100+ / 50+ / 40+ / 30+ contradiction
5. Add links *from* the relevant blog posts back to this page

---

## Cell values for the sheet

**HomePage**
- Updated: `25 Aug 2026`
- SEO Review: `Pass on technical (200, 1 H1, schema, canonical, alt text, 3,300 words). FAIL on internal linking — only 15 links, 0 to blog posts, 0 to industries. Latest-posts block is client-fetched from robots-blocked /api/. Title 64 chars (4 over); meta description 102 chars (50 short). Impressions split across 3 hostname variants.`

**WordPress Services**
- Updated: `25 Aug 2026`
- SEO Review: `Pass on technical (200, 1 H1, full schema, canonical, 2,662 words). FAIL on metadata — title 31 chars (29 wasted), meta description 53 chars and is a headline fragment, not a description. FAIL on internal linking — 12 links, 0 to sibling service pages, 0 to blog. Hero claims "100+ businesses" vs 50+ in content doc and 40+/30+ on sibling pages.`
