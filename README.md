# Sitemap fixes

One file: `app/sitemap.xml/route.ts`. Apply after the rollback zip.

Verified: `next build` compiles, `tsc` 0 errors, and the generation logic was
tested against hostile input (ampersands in slugs, trailing slashes, missing
dates, duplicates, malformed paths).

---

## 1. Fifteen URLs were being submitted that may not exist

This is the most likely source of Search Console errors.

`STATIC_ROUTES` hardcoded `/services`, `/services/business-automation`,
`/about/team`, `/industries` and eleven `/industries/*` paths. **None of those
are code routes.** They're builder pages resolved through `[...slug]`, so they
only exist while a matching published page sits in the database.

Unpublish one, rename its slug, or delete it, and the URL 404s — while the
sitemap keeps submitting it. That is exactly what produces **"Submitted URL not
found (404)"** in Search Console.

They were also redundant: the pages loop already emits every published page,
with a real `lastmod`. The hardcoded list now contains only the 14 routes that
exist as files and therefore cannot 404.

**Check this first.** Search Console → Pages → "Submitted URL not found (404)".
If `/about/team` or any `/industries/*` path is listed, that's this bug.

## 2. Portfolio URLs could contradict their own canonical

The category was used raw: a project stored as `"Shopify"` produced
`/portfolio/Shopify/thekapra` in the sitemap, while the page's own canonical
says `/portfolio/shopify/thekapra`. You were submitting a URL that the page
itself disowns — Search Console reports that as **"Duplicate, submitted URL not
selected as canonical"** or **"Alternate page with proper canonical tag."**

Now lowercased to match the route exactly.

Related: items with no category were skipped entirely, so any case study missing
one was never submitted at all. They now default to `other`, matching what the
route does.

## 3. One bad slug could invalidate the entire sitemap

There was no XML escaping. A single `&` in a blog slug makes the document
malformed, and Search Console rejects **the whole sitemap** with a parse error
rather than skipping the bad line — so one typo silently costs you every URL.

Now escaped, and tested with `&` and quotes in slugs.

## 4. Smaller things

- **`lastmod` fallback** — blogs and case studies used only `updatedAt`. Posts
  carrying just a `date` produced no `lastmod` at all. Now falls back to `date`,
  then `createdAt`.
- **`changefreq` and `priority` removed** — Google has ignored both for years.
  They were noise.
- **`Content-Type`** now declares `charset=utf-8`.
- **Cache headers** — one hour at the CDN with stale-while-revalidate, so
  repeated crawler fetches don't each hit MongoDB. The route itself stays
  `force-dynamic`.

---

## What I could not check

I could not fetch your live sitemap or the `/industries/*` pages from here, so I
cannot confirm which of those 15 URLs currently 404. The fix removes the risk
either way, but the Search Console coverage report will tell you what damage was
already done.

## After deploying

1. Load `https://ariosetech.com/sitemap.xml` — confirm it renders and that no
   `/industries/*` path appears unless that page really exists.
2. Search Console → Sitemaps → resubmit.
3. Pages report → check "Submitted URL not found (404)" shrinks over the next
   few crawls.
4. Spot-check one case-study URL from the sitemap against the canonical in that
   page's source — they should match character for character.
