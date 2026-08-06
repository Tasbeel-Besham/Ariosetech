# Breadcrumbs — centralized, compact, on every page

Extract into your project root. 7 files. Apply **after** all previous zips —
four files overlap and these are newest.

Verified: `tsc` 0 errors, `eslint` 0 errors, `next build` compiles.

---

## Why /about had no breadcrumb

Breadcrumbs were added page by page, and only two routes ever got them: the
catch-all and case studies. **Eleven routes had none** — /about, /contact,
/blog, /blog/[slug], /faq, /portfolio/[category], /author/[slug],
/privacy-policy, /terms-of-service and all three /tools pages. Any new page
would have started out missing them too.

They're now rendered once from `app/(site)/layout.tsx` and derived from the
pathname, so every page has them automatically and they can't fall out of sync
with the URL. The two per-page copies were removed so nothing renders twice.

Homepage returns `null` — a breadcrumb there would only point at itself.

## The spacing

The header is fixed at 64px, so whichever element comes first carries the
clearance. Two were doing it: the breadcrumb bar **and** the section below
(`.hero-section-wrapper > .container` at 88px, `.section` at 100px, `.pd-hero`
at 100px). They stacked into ~200px of dead space.

The bar now owns the clearance and `.with-breadcrumbs` on `<main>` collapses the
section's. **About 200px down to roughly 108px.**

A class on `<main>` rather than an adjacent-sibling selector because pages emit
`<script>` tags for their JSON-LD, which sit between the bar and the section in
the DOM and would break `+` matching. That's why the previous attempt was
fragile.

## The design

Minimal, matching the mono/uppercase treatment already in your UI:

- House icon for Home, then 10px uppercase mono at `0.12em` tracking
- Muted `--text-3`, hover to `--primary`, current page in `--text-2`
- Separators at 30% opacity
- Whole row is ~12px tall
- Long trails scroll horizontally instead of wrapping to a second line, which
  would put the height straight back
- Current crumb truncates with an ellipsis at 38ch (22ch on mobile), so a long
  case-study title can't widen the row

## Label casing

`lib/breadcrumb-labels.ts` holds one shared label map. Without it,
`/services/woocommerce` renders as "Woocommerce" — careless on a page selling
WooCommerce expertise. Covers WordPress, WooCommerce, Shopify, SEO, FAQ, UI/UX,
API, SaaS, B2B, USA, UAE, UK and more. Add to `LABEL_OVERRIDES` as needed.

## Structured data now matches

Google requires structured data to describe visible content. Two mismatches
existed:

1. `trailFromPath` used the **page title** for the last crumb while the visible
   trail used the URL segment.
2. Case studies declared three levels (Home / Portfolio / Title) while the URL
   and visible trail have four (Home / Portfolio / Category / Slug).

Both now build from the same helper as the visible component.

## Check after deploy

- `/about` — breadcrumb present, was missing
- `/services/woocommerce` — reads "WooCommerce", not "Woocommerce"
- `/portfolio` — the gap in your screenshot
- A case study — four levels, long title truncates
- The homepage — **no breadcrumb, spacing unchanged**
- One page at 375px wide
- Rich Results Test on a case study — BreadcrumbList should list four items
