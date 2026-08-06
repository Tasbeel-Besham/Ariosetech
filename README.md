# Breadcrumb spacing fix

Extract into your project root. 3 files. Apply **after** all five previous zips —
all three files overlap with earlier ones and these are newest.

Verified: `tsc` 0 errors, `next build` compiles.

## The cause

The header is fixed, so whichever element comes first has to carry the clearance
for it. Two elements were both doing that:

1. The breadcrumb wrapper — `pt-[92px]`
2. The section right below it — `.hero-section-wrapper > .container` has
   `pt-[88px]`, `.section` has `100px`, `.pd-hero` has `100px`

Neither knew about the other, so the offsets stacked: roughly 92 + 20 + 88 =
**200px of empty space** between the breadcrumb and the first heading. On pages
without breadcrumbs the hero's own 88px is correct, which is why this only shows
up on service, industry and case-study pages.

## The fix

The bar now owns the header clearance and the next sibling drops its own:

```css
.breadcrumb-bar { padding-top: 96px; padding-bottom: 0; }
.breadcrumb-bar .breadcrumbs { margin-bottom: 0; }

.breadcrumb-bar + .hero-section-wrapper > .container { padding-top: 28px; }
.breadcrumb-bar + .section  { padding-top: 44px; }
.breadcrumb-bar + .pd-hero  { padding-top: 28px; }
.breadcrumb-bar + .dt-hero  { padding-top: 28px; }
```

Roughly 200px down to about 124px, with the breadcrumb sitting close to the
content it describes rather than floating alone in a band.

The adjacent-sibling selectors mean pages **without** breadcrumbs are completely
untouched — the homepage hero keeps its original spacing.

Both call sites now use `className="container breadcrumb-bar"` instead of the
inline `pt-[92px] pb-0` utilities, so the spacing lives in one place.

Mobile breakpoints included (768px and 640px). Note `.section` carries
`!important` at 640px in your stylesheet, so the override matches it.

## Check after deploy

- `/services/woocommerce` — the gap in your screenshot
- `/portfolio/shopify/<any-case-study>` — uses `.pd-hero`
- The homepage — should be **unchanged**; if its hero moved, something matched
  that shouldn't have
- One page at 375px wide
