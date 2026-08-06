# ARIOSETECH — SEO fix pack (items 1, 2, 3, 5)

Extract into your `ariosetech-v2` project root. 29 files; one is new
(`lib/cache.ts`), the rest overwrite.

**Commit before you extract.** `git diff` is your undo.

This pack does **not** touch the portfolio screenshot work from the previous
zip — different files, no conflict. Apply either order.

---

## 1. Portfolio category canonical bug

`app/(site)/portfolio/[category]/page.tsx`

**Was:** every category page declared `/portfolio` as its canonical, telling
Google that `/portfolio/wordpress`, `/woocommerce`, `/shopify` and `/seo` were
duplicates that shouldn't be indexed in their own right — while your sitemap
submitted them.

**Now:**
- Self-referencing canonical: `/portfolio/{category}`.
- Per-category title and description. They previously all inherited the same
  title and description from the `/portfolio` page document, so even once
  indexed they'd compete with an identical snippet.
- **Crawl-trap closed.** `[category]` matches any string, so `/portfolio/foo`
  returned a valid 200 — unlimited indexable URLs serving identical content.
  Valid categories are now the four base ones plus whatever's actually in the
  portfolio collection; anything else 404s.

**Verify after deploy:** view-source on `/portfolio/shopify` and confirm the
canonical points at itself. Then request indexing for all four in Search
Console — they need a recrawl to recover.

---

## 2. Preloader — the LCP blocker

`components/ui/Preloader.tsx`

An opaque full-screen overlay delays Largest Contentful Paint by exactly as
long as it stays up. LCP counts pixels the user can actually see, so the hero
being in the DOM behind the curtain doesn't count. The old timings held it for
~1900 ms; on top of server response time that put LCP past Google's 2500 ms
"good" threshold on every page for every visitor.

**Now:**
- **Once per browser session.** Reloads and direct entries to other pages in
  the same session skip it entirely.
- **Shorter** — gone by ~1000 ms instead of ~1900 ms.
- **Skipped** for `prefers-reduced-motion` and data-saver users.
- `aria-hidden` + `pointer-events-none` so screen readers no longer announce
  "Loading 0%" before your actual content.

To remove it completely, set `ENABLED = false` at the top of the file. Given
you're chasing Core Web Vitals in competitive markets, that's worth
considering — the animation costs you roughly a second of LCP on first visit
and buys nothing a search engine values.

---

## 3. Caching (ISR) with on-demand invalidation

`export const dynamic = 'force-dynamic'` → `export const revalidate = 3600` on
the 6 public page routes, the root layout, and `sitemap.xml`.

That alone would mean admin edits take up to an hour to appear, so `lib/cache.ts`
adds `revalidateSite()`, now called from **16 mutating API routes** (pages,
blogs, portfolio, services, menus, header, footer, theme, settings, builder
save/publish). Publishing still updates the live site instantly — it just no
longer costs a MongoDB round trip on every anonymous request.

`revalidatePath('/', 'layout')` flushes the whole public site. Coarse on
purpose: your content is small and heavily interlinked — renaming a page changes
the nav on every other page — so targeted invalidation would routinely serve
stale navigation.

**API routes keep `force-dynamic`.** That's correct for them; only pages were
wrong.

**Watch after deploy:** confirm an admin publish still shows up immediately on
the live URL. If anything looks stale, the cause will be a mutating route that
doesn't call `revalidateSite()` yet — the fix is one import plus one line.

---

## 5. next/image

Converted 7 raw `<img>` tags on public pages: testimonial avatars, the three
blog author/reviewer photos, the case-study hero and body images, and the author
page avatar. Each gets responsive `srcset`, correct intrinsic dimensions (no
layout shift) and lazy loading. The case-study hero is marked `priority` since
it's that page's LCP element.

Added `i.ibb.co` to `remotePatterns` in `next.config.ts` — that's the ImgBB
fallback host in your upload route, and `next/image` throws on non-whitelisted
hosts.

**Two deliberate exceptions:**
- `PortfolioSection.tsx` keeps a raw `<img>`. The hover pan measures
  `naturalWidth`/`naturalHeight` off the element and needs `height: auto` with
  absolute positioning — `next/image` fights both. Those images are already
  compressed client-side to ~1400px WebP, so the loss is small.
- The theme-detector tools keep raw `<img>` because they render screenshots from
  arbitrary third-party domains, which can't be whitelisted in advance.

---

## Not included

**`ignoreBuildErrors` / `ignoreDuringBuilds`** are still `true` in
`next.config.ts`. Flipping them is the right call, but it will almost certainly
fail your next build until the backlog of existing type errors is cleared — not
something to trigger blind inside an SEO deploy. Worth doing as its own task;
happy to work through the errors with you.

---

## After deploying

1. Search Console → URL Inspection → Request Indexing for `/portfolio/wordpress`,
   `/woocommerce`, `/shopify`, `/seo`.
2. PageSpeed Insights on the homepage and one case study. Lab LCP should drop
   noticeably straight away; **field data (CrUX) takes ~28 days** to reflect the
   change, so don't judge it by the field numbers next week.
3. Re-submit `sitemap.xml`.
4. Spot-check that `/portfolio/some-nonsense` now 404s.

Canonical recovery typically takes two to six weeks — Google has to recrawl and
re-evaluate. Nothing has gone wrong if the four pages don't reappear
immediately.
