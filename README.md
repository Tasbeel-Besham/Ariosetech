# Portfolio hover-scroll screenshots

Extract the contents of this folder into your `ariosetech-v2` project root.
The folder structure matches the project exactly, so all six files land in
place and overwrite the originals.

**Commit before you extract** — these are full-file replacements, so `git diff`
is your undo.

## Files replaced

| File | What changed |
| --- | --- |
| `components/builder/panels/PropertiesPanel.tsx` | Repeater sub-fields now render by type. Previously everything except `textarea` fell through to a plain text input, which is why image fields inside a repeater had no picker. Media-picker state moved to local React state so it stops being written into the saved layout. |
| `components/ui/MediaPickerModal.tsx` | Added upload + search. Uploading one file selects it immediately. Props are unchanged, so all existing call sites still work. |
| `components/sections/PortfolioSection.tsx` | Hover pan now measures the image's real intrinsic size in JS. Reads the new `screenshot` field, falls back to `image`. |
| `lib/builder/registry-init.ts` | Portfolio repeater: added `screenshot` field, changed `image` from `text` to `image` type. |
| `styles/globals.css` | Replaced the `100cqh` pan rule with easing + paint hints for the JS-driven pan. Added `.pfc-shot--cover` and a reduced-motion guard. |
| `types/index.ts` | Added `screenshot?: string` to `PortfolioDoc`. |

## After extracting

1. `npm run dev` and open the builder on a page with a Portfolio Showcase section.
2. Select the section → each project under **Projects** now has
   **Full-page screenshot** and **Cover image**, both with a Library button.
3. Click Library → Upload → pick your capture. It fills the field and previews.
4. Save, then hover a card on the live page.

## Two things to know

**Existing projects are unaffected.** `screenshot` is a new field; anything
already saved keeps its `image` and simply won't pan until you add a screenshot.
Nothing needs migrating.

**One behaviour was removed.** The old card auto-generated a thum.io screenshot
when a project had a `url` but no `image`. That path is gone. Any project
relying on it will show the platform-name fallback until you upload a
screenshot. Easy to add back if you want it as a last resort.

## Capturing the screenshots

The pan only reads as "scrolling the site" if the image is genuinely tall — a
full-page capture, not a viewport crop.

- **Chrome DevTools** — Cmd/Ctrl+Shift+P → "Capture full size screenshot".
  Set the device toolbar to 1440px wide first so you get the desktop layout.
- **Firefox** — right-click the page → "Take Screenshot" → "Save full page".

Aim for 1000–1440px wide. Height sorts itself out; a typical homepage lands
between 4000 and 8000px.

**Export as WebP or quality-80 JPEG.** A 6000px-tall PNG easily hits 4–5MB, and
the grid loads one per card. They're lazy-loaded, but a 5MB image below the fold
is still 5MB once someone scrolls.

## Tuning the pan

Constants at the top of `components/sections/PortfolioSection.tsx`:

```ts
const PAN_SPEED_PX_PER_SEC = 420   // raise = faster pan
const MIN_PAN_MS           = 1200
const MAX_PAN_MS           = 9000  // cap for very long pages
const RETURN_MS            = 650   // snap back on mouse-out
```

Duration is derived from actual travel distance, so a 6000px page and a 1500px
page scroll at the same perceived rate rather than both taking a flat 4 seconds.
