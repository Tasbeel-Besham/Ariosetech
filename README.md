# Portfolio hover-scroll screenshots — v2 (upload fix included)

Extract into your `ariosetech-v2` project root. The folder structure matches, so
all ten files land in place. One is new (`lib/media/upload.ts`); the rest
overwrite.

**Commit before you extract.** These are full-file replacements, so `git diff`
is your undo.

---

## Why the screenshot upload was failing

Your host caps the request body of a serverless function at **4.5 MB** and
returns `413 FUNCTION_PAYLOAD_TOO_LARGE` above that. It's enforced at the
infrastructure level and cannot be raised from `vercel.json` or from route
config.

- Normal portfolio picture → a few hundred KB → passes.
- Full-page screenshot → a 1440×6000 PNG is routinely 4–8 MB → **rejected at
  the edge.** `/api/media/upload` never runs.

It also failed *silently*. The 413 comes back as an HTML error page, so
`res.json()` threw inside a `try/finally` that had no `catch` — the spinner
stopped and no message appeared.

### The fix

`lib/media/upload.ts` compresses images **in the browser** before they're sent:

- Downscales to max 1400px wide, 12000px tall, 40 MP total area.
- Re-encodes to WebP at quality 0.82 (JPEG fallback on older browsers).
- Skips files under 900 KB, plus GIF and SVG, which shouldn't be re-encoded.
- Returns the original if re-encoding made it bigger.

A 6 MB PNG screenshot typically lands around 400–700 KB. Comfortably under the
cap, and much better for the visitors loading one per portfolio card.

Every upload path now reads the response as text first, so a 413 or any other
non-JSON error surfaces as a readable message instead of a stuck spinner.

**No env vars or plan changes needed.**

---

## The other thing to understand

The Portfolio Showcase section has two sources, and one silently overrides the
other:

```ts
const displayItems = safeItems.length > 0 ? safeItems : dbItems
```

- **Builder's Projects list has items** → only those show; your case studies are
  ignored entirely.
- **Builder's Projects list is empty** → pulls every *published* case study from
  Admin → Portfolio automatically.

Since your case studies already exist, **leave the builder's Projects list
empty.** Use the repeater only for a hand-picked subset on one page.

---

## How to add the images

### Path A — case studies (recommended)

1. Admin → Portfolio → open a project.
2. Meta row now has **Cover Image URL** and **Full-Page Screenshot**.
3. **Library** → **Upload** → pick your capture. It compresses, uploads, fills
   the field, previews.
4. Save with **Published** ticked.
5. Hover a card on any page with a Portfolio Showcase section whose Projects
   list is empty.

### Path B — hand-picked in the builder

Select the section → **Projects** → each item has **Full-page screenshot** and
**Cover image**, both with a Library button.

### Which image shows

`screenshot` wins. Blank → the cover image is used and sits still. Both blank →
platform-name placeholder.

---

## Files

| File | What changed |
| --- | --- |
| `lib/media/upload.ts` | **New.** Browser-side compression + upload with real error messages. |
| `components/ui/MediaPickerModal.tsx` | Upload + search added; uses the compressing uploader; per-file errors shown. |
| `app/admin/media/page.tsx` | Compresses before upload; handles non-JSON 413 responses. |
| `app/admin/portfolio/[id]/page.tsx` | Added **Full-Page Screenshot** field; gallery upload uses the compressing uploader. |
| `app/admin/portfolio/new/page.tsx` | Same, on the create form. |
| `components/builder/panels/PropertiesPanel.tsx` | Repeater sub-fields render by type — previously everything except `textarea` fell through to a plain text input, which is why image fields in a repeater had no picker. Picker state moved to local React state so it stops being saved into the layout. |
| `components/sections/PortfolioSection.tsx` | Hover pan measures the image's real intrinsic size in JS. Reads `screenshot`, falls back to `image`. |
| `lib/builder/registry-init.ts` | Portfolio repeater: added `screenshot`; `image` changed from `text` to `image` type. |
| `styles/globals.css` | Replaced the `100cqh` pan rule with easing + paint hints. Added `.pfc-shot--cover` and a reduced-motion guard. |
| `types/index.ts` | Added `screenshot?: string` to `PortfolioDoc`. |

---

## Two things to know

**Nothing needs migrating.** `screenshot` is a new field. Existing projects keep
their cover image and won't pan until you add a capture.

**One behaviour was removed.** The old card auto-generated a thum.io screenshot
when a project had a `clientUrl` but no `image`. That's gone; affected projects
show the platform-name placeholder until you upload something. Easy to restore
as a last-resort fallback if you want it.

---

## Capturing the screenshots

- **Chrome DevTools** — Cmd/Ctrl+Shift+P → "Capture full size screenshot". Set
  the device toolbar to 1440px wide first.
- **Firefox** — right-click → "Take Screenshot" → "Save full page".

Export at whatever size is convenient — compression handles the rest now. PNG
straight out of DevTools is fine.

Do glance at each capture before uploading, though. The pan reveals the entire
page including the footer, so a stale copyright year or a frozen cookie banner
ends up on display at full size.

---

## Tuning

Pan feel — top of `components/sections/PortfolioSection.tsx`:

```ts
const PAN_SPEED_PX_PER_SEC = 420   // raise = faster
const MIN_PAN_MS           = 1200
const MAX_PAN_MS           = 9000
const RETURN_MS            = 650
```

Compression — top of `lib/media/upload.ts`:

```ts
const MAX_WIDTH = 1400   // raise for sharper screenshots, at the cost of size
const QUALITY   = 0.82
```
