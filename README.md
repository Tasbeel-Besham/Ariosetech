# Portfolio hover pan — slower, steadier

Two files. Apply after all previous zips (`styles/globals.css` overlaps and this
is newest).

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors.

---

## Why it felt fast

Two causes, and the second mattered more than the first.

**1. The speed was too high.** 420 px/s of image travel inside a ~400px frame
is quick — the whole page went by in about three seconds.

**2. The easing doubled it in the middle.** The pan used
`cubic-bezier(0.4, 0, 0.25, 1)`, a symmetric ease-in-out. That shape peaks at
roughly **twice its average speed** halfway through, so even a reasonable
average read as a whip through the centre of the image — exactly the part
someone is trying to look at.

## What changed

| | Before | After |
|---|---|---|
| Speed | 420 px/s | 165 px/s |
| Peak speed | ~2x average | ~1.2x average |
| Max duration | 9s | 16s |
| Return | 650ms | 520ms |

The pan easing is now `cubic-bezier(0.25, 0.1, 0.75, 0.9)` — close to linear
with soft ends, because reading a page is a steady motion, not a swing. The
return keeps a normal ease-out; snapping back should feel like a release.

Raising the cap from 9s to 16s matters more than it looks: with a 9s ceiling,
any screenshot needing more than that was silently sped up to fit. Long pages
now travel at the same rate as short ones instead of rushing.

A typical 1400x6000 screenshot in a 400px frame now takes about 8.5 seconds
end to end, versus roughly 3.4 before.

## Also added: hover intent

A 140ms delay before the pan starts. Sweeping the cursor across the grid used to
set every card it touched into motion at once, which read as chaotic. The timer
is cleared on mouse-out and on unmount, so filtering the grid mid-hover doesn't
leave a pending animation behind.

## Tuning

Top of `components/sections/PortfolioSection.tsx`:

```ts
const PAN_SPEED_PX_PER_SEC = 165   // lower = slower
const MIN_PAN_MS           = 1800
const MAX_PAN_MS           = 16000
const RETURN_MS            = 520
const START_DELAY_MS       = 140
```

Speed is the only one worth touching. Try 130 if it's still brisk, 200 if it now
drags. Duration is derived from real travel distance, so changing it keeps every
card consistent regardless of screenshot height.
