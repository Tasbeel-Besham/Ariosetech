# ARIOSETECH — server-rendering fix (zip 5)

Extract into your project root. 5 files. Apply **after** the previous four zips
(`portfolio-screenshots` → `seo-fixes` → `build-hardening` →
`compliance-fixes`). Two files overlap with earlier zips; these are newest.

Verified: `tsc` 0 errors, `eslint` 0 errors, `next build` compiles.

---

## The finding

I fetched `https://ariosetech.com/portfolio` as a non-JavaScript crawler sees
it. The entire page body is:

> **"No projects to show yet."**

Your case studies are not in the server HTML. `BuilderRenderer` is a
`'use client'` component, so every section is a client component, and
`PortfolioSection` fetched `/api/portfolio` inside a `useEffect`. The projects
only exist after JavaScript runs.

Google does render JavaScript, and its cached snippet for `/portfolio` does show
your project text — so this is not invisible to Google today. But rendering is a
deferred second pass: slower, not guaranteed for every page on every crawl, and
skipped entirely by many other crawlers, including several of the pipelines
feeding AI answers.

Your strongest commercial proof — real clients, real numbers — was the one thing
not in the HTML.

`BlogSection` had the same pattern.

---

## The fix

`lib/builder/server-data.ts` fills these sections' data **on the server**,
before `BuilderRenderer` runs. The sections receive it as ordinary props and
skip their client fetch, so the content is in the initial HTML with no change to
how the builder works.

Deliberately not a rewrite of the builder into server components — that would
touch all 25 section types for no additional benefit.

- `app/(site)/[...slug]/page.tsx` — hydrates before render (this serves
  `/portfolio`, `/services/*`, `/industries/*`)
- `app/(site)/portfolio/[category]/page.tsx` — hydrates both the builder path
  and the fallback path
- `PortfolioSection` / `BlogSection` — skip the client fetch when props arrive

A hand-picked list in the page builder still wins over the full collection, and
every read is fail-safe: on a DB error the section falls back to its old
client-side fetch rather than breaking the page or the build.

**Verify after deploy:** `view-source:https://ariosetech.com/portfolio` and
search for a client name. It should be in the raw HTML.

---

## Also found on the live site (no code change needed)

**Legacy WordPress URLs are still indexed but redirect correctly.**
`/contact-us/` and `/category/stories/` both 301 properly — Google's index is
simply stale and showing old cached content, including some Lorem ipsum from the
old WordPress build. This resolves on recrawl. Nothing to fix.

**Title tags duplicate the brand.** The live contact page title is
*"Contact ARIOSETECH, Get a Free Quote | ARIOSETECH"*. The `%s | ARIOSETECH`
template appends the brand to a title that already contains it. Fix in the
admin per page — trim the page-level SEO title to *"Contact, Get a Free Quote"*
and let the template add the brand.

**Duplicate FAQ entries on `/contact`.** *"What is your pricing structure?"* and
*"How does your pricing work?"* are the same question twice, and both are in
your FAQ schema. Merge them in the admin.

**Twitter card metadata is generic.** `twitter:title` on `/contact` reads
*"WordPress, Shopify & WooCommerce Development Agency"* while `og:title` is
page-specific. Low priority; affects social CTR only.
