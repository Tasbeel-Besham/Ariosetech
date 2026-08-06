# Breadcrumb — tight spacing + no background seam

**One file: `styles/globals.css`.** Drop it in, replacing the existing one.
Apply after all previous zips. No component or page changes.

Verified: `next build` compiles, `tsc` 0 errors.

---

## I was wrong about the header

I built the last two fixes on the assumption that the header is fixed and
something had to clear it. It isn't — `.nav-header` is `position: sticky`, which
occupies space in normal flow. Content already starts below it.

So there was never any clearance to carry. The original `pt-[92px]` on the
breadcrumb wrapper, and the 82px I replaced it with, were **both pure waste**,
sitting on top of the hero's own `pt-[88px]`. That's why the gap stayed large
after two attempts — I kept re-adding the thing that was causing it.

## The background seam

The bar sat above the hero, on the flat page background. The hero's decorative
backdrop — the faint grid and brand glow — began at the hero's top edge, so the
boundary showed as a hard horizontal line right under the breadcrumb.

Now the bar is pulled into the section below with `margin-bottom: -32px` and
`z-index: 5`, so the hero's backdrop paints **behind** it. No edge, because
there's no longer a boundary there. The breadcrumb now lives inside the hero's
existing top padding instead of adding a band of its own.

## Numbers

| | Before | After |
|---|---|---|
| Header bottom → breadcrumb | ~110px | 20px |
| Header bottom → hero eyebrow | ~130px | 60px |

Mobile: 14px and 46px.

`.section`, `.pd-hero`, `.dt-hero` and `.faqp-main` starts tightened to 76px
(56px mobile) — enough to clear the overlapping breadcrumb plus breathing room.

## One detail worth knowing

The bar is `pointer-events: none` with the list re-enabling itself. It now
overlaps the hero, and a full-width invisible strip would otherwise swallow
clicks on anything beneath it — including a hero CTA sitting high in the layout.

## Check after deploy

- `/services` in **light mode** — the seam from your screenshot should be gone
- `/services` in dark mode
- The homepage — no breadcrumb, spacing **unchanged**
- A case study (`.pd-hero`) and `/faq` (`.faqp-main`)
- Hover a hero button near the top to confirm clicks aren't blocked
- One page at 375px
