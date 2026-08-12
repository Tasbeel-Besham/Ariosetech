# Technical SEO checklist — worked through

Everything from the previous two zips is included here, so this supersedes both
`ariosetech-content-fixes` and `ariosetech-service-content`. Apply this one.

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors.

---

## The checklist, item by item

| # | Item | Status |
| --- | --- | --- |
| 1 | One canonical URL — HTTPS, non-www, no trailing slash | **Fixed** — www→apex redirect added |
| 2 | 301 redirects for legacy URLs | **Already done** — 43 rules, 0 chains, 0 duplicates |
| 3 | Only canonical indexable URLs in sitemap | **Already fixed** (sitemap zip) |
| 4 | Accurate `lastmod` | **Already fixed** (sitemap zip) |
| 5 | Validate in Rich Results Test | **Yours to run** — see below |
| 6 | Remove duplicate Service / FAQPage schema | **Already correct** — verified, see below |
| 7 | Markup only where visible evidence supports it | **Already fixed** — AggregateRating removed |
| 8 | Article schema: author, dates, image, reviewer | **Already correct** — verified |
| 9 | Image dimensions, alt, WebP/AVIF, lazy, LCP priority | **Fixed** — AVIF added; rest already done |
| 10 | PageSpeed Insights on each template | **Yours to run** |
| 11 | Screaming Frog / GSC crawl | **Yours to run** |
| 12 | Track tool errors | **Fixed** — logging added |

---

## A bug my own earlier fix would have introduced

Unhiding the Shopify hero (from the content-fixes zip) would have given
`/services/shopify` **two `<h1>` elements** — one from `hero-interactive`, one
from `tool-hero`, which hard-coded its heading as `h1`.

`ToolHeroSection` now takes a `headingTag` prop defaulting to **h2**, and the
builder exposes it as a dropdown. Dropping this section onto a page that already
has a hero can no longer break the heading order. The standalone `/tools/*`
pages are unaffected — their `h1` lives in their own client components, which I
checked.

Caught by working item 11 (heading order) before shipping, not after.

## What I verified rather than assumed

**Item 6 — duplicate FAQPage schema.** Not present. `faqFromSections()` walks
every `faq` section on a page and merges them into **one** `FAQPage` object.
Even a page with three FAQ sections emits one valid block. `Service` schema is
emitted once, only under `/services/*`. No change needed.

**Item 8 — Article schema.** Already complete: it resolves the byline to a real
author profile, emits `Person` with a URL when one exists, falls back to
`Organization` when it doesn't, and includes `dateModified` and `reviewedBy`.
Better than most agency blogs.

**Item 9 — images.** Dimensions, alt text, lazy loading and LCP `priority` were
done in the earlier zip. The gap was formats: Next defaults to WebP only.
`formats: ['image/avif', 'image/webp']` now serves AVIF where supported —
typically 20-30% smaller than WebP — falling back automatically. Cache TTL
raised to a year, which is safe because the URLs are content-hashed.

## Item 1 — the www redirect

Trailing slashes were already handled (Next redirects `/path/` → `/path` by
default). www was not. If that DNS record ever resolves, every page on your site
exists twice at two hosts, competing for the same rankings.

Added as the first redirect rule, path-preserving. It's a safety net behind
whatever your DNS does, not a replacement for it.

## Item 12 — tool error tracking

`lib/tool-errors.ts`, wired into all three tool routes. Failures previously went
to `console.error` only, which means they vanish into log retention and nobody
reviews them.

Now recorded to a `tool_errors` collection with tool, failure kind
(`unreachable` / `blocked` / `not_detected` / `timeout` / `internal`), the target
**host only**, and a timestamp. Never awaited, never throws, stores no personal
data — no IP, no user agent, no session, and no full URL with whatever query
string someone pasted.

Self-pruning at 90 days on roughly 1 request in 50, so the collection cannot
grow without bound.

What you're looking for is the **rate and the pattern**. One site blocking
scrapers is noise. Forty timeouts in an hour is an outage:

```js
db.tool_errors.aggregate([
  { $match: { at: { $gte: new Date(Date.now() - 7*86400000) } } },
  { $group: { _id: { tool: "$tool", kind: "$kind" }, n: { $sum: 1 } } },
  { $sort: { n: -1 } }
])
```

`getToolErrorSummary()` is exported if you want it on the admin dashboard.

## Also included from the previous two zips

- `/services/shopify` WordPress copy + hidden hero
- Meta title/description for the 5 pages that had none
- 9 broken portfolio links
- Invented case studies on `/services/wordpress`
- `/services/business-automation` orphan link
- Full WordPress service detail incl. the unused plan tiers
- About page: 5.0★→4.9★ Clutch, 7+→8+ years

Run both scripts after deploying:

```bash
mongosh "<YOUR_MONGODB_URI>" fix-content.mongosh.js
mongosh "<YOUR_MONGODB_URI>" fix-wordpress-content.mongosh.js
```

---

## The three I can't do for you

**Rich Results Test (5)** — run it on the homepage, one service page, one blog
post and one case study after deploying. Confirm `AggregateRating` is gone and
`FAQPage`, `BreadcrumbList`, `Service` and `Article` still validate.

**PageSpeed Insights (10)** — your instinct here is right: *do not optimise
blindly*. Lab numbers will improve immediately from the preloader and caching
work; **field data takes ~28 days** to catch up, and field data is what ranking
uses. Judging this next week will mislead you.

**Screaming Frog / GSC (11)** — a crawl is the only way to catch what static
analysis can't: real 404s from typo'd links, redirect chains introduced by
content edits, orphan pages. Worth doing once now as a baseline, then quarterly.
Set it to obey robots.txt so you see the site as Googlebot does.
