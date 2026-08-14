# Live crawl of ariosetech.com — findings and fixes

I fetched the live site as a crawler sees it. Two code fixes here, plus a
browser-console script for the database-level issues.

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors.

---

## First — confirmation that earlier work is live

| | |
| --- | --- |
| **Portfolio content is server-rendered** | All 19 case studies are in the raw HTML with real category URLs. The empty-portfolio problem is gone, and Google can now see your strongest commercial proof. |
| **Header is server-rendered** | Your Cloudinary logo and the saved nav order are both in the HTML. The flash fix is deployed and working. |
| **Breadcrumbs correct** | Case studies show four proper levels: Home / Portfolio / WordPress / Aruba Help. |
| **Canonicals self-referencing** | Both `/portfolio` and case studies. |
| **Review figures honest** | Clutch 4.9 from 16 and Google 5.0, both matching the visible links. |

---

## Fixed in code

**1. Case studies had the wrong Twitter card.** `openGraph` was page-specific,
but `twitter` was never set — so it fell through to the site-wide default. Every
case study shared on X showed the generic agency card and logo instead of the
project's own title and screenshot. Confirmed live on Aruba Help:

```
og:title       Aruba Help                                    ← correct
twitter:title  WordPress, Shopify & WooCommerce Development  ← generic
twitter:image  .../logo.png                                  ← not the project
```

Now set per case study.

**2. Gallery images bypassed image optimisation.** The hero used `next/image`,
but the gallery carousel used a raw `<img>` — no AVIF/WebP conversion, no
responsive `srcset`, and no intrinsic dimensions, so each slide shipped a
full-size Cloudinary PNG and shifted layout while loading. Live example: a
1.4 MB PNG per slide, three per page.

Now `next/image` with dimensions and `sizes`. First slide eager (often in view),
the rest lazy.

---

## Fixed by the console script

**3. `/portfolio` has no `<h1>` at all.** Crawled live: every heading on the
page is an `h2`. It opens at h2 with no h1 — on one of your most-linked pages.
The Portfolio Showcase section supports a heading tag; it was never set.

**4. "View All Services" points to `/services/wordpress`,** not `/services`.
Anyone wanting the full list lands on one product page.

**5. `/services/shopify` still shows WordPress copy.** Still live as of this
crawl. The real Shopify hero is hidden, so that page has **no correct h1** —
the tool hero's WordPress headline is standing in for it.

**6. Three service pages still have no meta description** — `/services/wordpress`,
`/services/woocommerce`, `/services/seo`. `/portfolio` and `/services/shopify`
now have one, so something was applied, but these three were missed.

### Running it

1. Log into the admin, open `https://ariosetech.com/admin/pages`
2. **F12** → **Console**
3. Paste all of `fix-crawl-findings.js`, press **Enter**

Uses your own admin API with your existing session cookie. Safe to run twice —
each fix checks its own state and skips.

---

## One thing worth your judgement, not a bug

Every page ends with **two stacked CTAs**. On `/portfolio`:

> "Let's Build Your Success Story" → Start a Project / View All Services
> "Ready to grow your business online?" → Schedule Free Consultation / WhatsApp

The second is the site-wide `footerCta`. It's on the case study template too.
Two consecutive asks tend to convert worse than one, because the second reads as
filler. Removing the per-page CTA where the footer one already covers it would
tighten every page — but that's your call on messaging, not a technical fix, so
I have not touched it.

---

## Checklist status after this

| # | Item | Status |
| --- | --- | --- |
| 1 | One canonical, HTTPS, non-www, no trailing slash | Done |
| 2 | 301s for legacy URLs | Done — 43 rules, verified live |
| 3 | Only canonical indexable URLs in sitemap | Done |
| 4 | Accurate `lastmod` | Done |
| 5 | Validate in Rich Results Test | **Yours** |
| 6 | No duplicate Service / FAQPage schema | Verified correct |
| 7 | Markup only where visible evidence supports | Done |
| 8 | Article schema complete | Verified correct |
| 9 | Images: dimensions, alt, AVIF/WebP, lazy, LCP priority | Done — gallery was the last gap |
| 10 | PageSpeed Insights per template | **Yours** |
| 11 | Crawl: nav, forms, links, heading order, titles, 404s | Partly done here — findings 3-6 came from it |
| 12 | Track tool errors | Done |

The three left need your own tools and your own Search Console access. For 11,
a Screaming Frog run would still be worth doing — I can fetch pages one at a
time, but it crawls every URL and catches the long tail I cannot reach.
