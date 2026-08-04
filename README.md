# Portfolio hover-scroll screenshots

Extract into your `ariosetech-v2` project root. The folder structure matches, so
all eight files land in place and overwrite the originals.

**Commit before you extract** — these are full-file replacements, so `git diff`
is your undo.

---

## The one thing to understand first

The Portfolio Showcase section has **two possible sources** for its projects,
and one silently overrides the other. From `PortfolioSection.tsx`:

```ts
const displayItems = safeItems.length > 0 ? safeItems : dbItems
```

- **Projects list in the builder has items** → only those show. Your case
  studies are ignored entirely.
- **Projects list in the builder is empty** → the section pulls every
  *published* case study from Admin → Portfolio automatically.

Since your case studies already exist, **leave the builder's Projects list
empty.** Manage everything from Admin → Portfolio and the showcase follows.

Use the builder repeater only when you want a hand-picked subset in a specific
order on one page — a homepage teaser, say — that differs from the full list.

---

## How to add the images

### Path A — case studies (recommended, matches what you already have)

1. Admin → Portfolio → open a project (or create one).
2. Top meta row now has two image fields:
   - **Cover Image URL** — normal thumbnail.
   - **Full-Page Screenshot** — the tall header-to-footer capture that scrolls
     on hover.
3. Click **Library** → **Upload** → pick your capture. It fills the field and
   previews below.
4. Save. Make sure **Published** is ticked or the showcase won't pull it.
5. Open any page with a Portfolio Showcase section, confirm its Projects list is
   empty, and hover a card.

### Path B — hand-picked list in the builder

1. Open the page in the builder, select the Portfolio Showcase section.
2. Under **Projects**, each item now has **Full-page screenshot** and
   **Cover image**, both with a Library button.
3. Same upload flow. Remember: filling this list hides your case studies on that
   page.

### Which image shows

`screenshot` wins. If it's blank, the cover image is used instead and simply
sits still — there's nothing taller than the frame to scroll through. If both
are blank you get the platform-name placeholder.

---

## Files replaced

| File | What changed |
| --- | --- |
| `app/admin/portfolio/[id]/page.tsx` | Added the **Full-Page Screenshot** field with picker + preview. |
| `app/admin/portfolio/new/page.tsx` | Same field on the create form. |
| `components/builder/panels/PropertiesPanel.tsx` | Repeater sub-fields now render by type. Previously everything except `textarea` fell through to a plain text input — the reason image fields inside a repeater had no picker. Media-picker state moved to local React state so it stops being written into the saved layout. |
| `components/ui/MediaPickerModal.tsx` | Added upload + search. Uploading one file selects it immediately. Props unchanged, so all existing call sites still work. |
| `components/sections/PortfolioSection.tsx` | Hover pan measures the image's real intrinsic size in JS. Reads `screenshot`, falls back to `image`. |
| `lib/builder/registry-init.ts` | Portfolio repeater: added `screenshot`, changed `image` from `text` to `image` type. |
| `styles/globals.css` | Replaced the `100cqh` pan rule with easing + paint hints for the JS-driven pan. Added `.pfc-shot--cover` and a reduced-motion guard. |
| `types/index.ts` | Added `screenshot?: string` to `PortfolioDoc`. |

---

## Two things to know

**Nothing needs migrating.** `screenshot` is a new field. Existing projects keep
their cover image and just won't pan until you add a capture.

**One behaviour was removed.** The old card auto-generated a thum.io screenshot
when a project had a `clientUrl` but no `image`. That path is gone. Any project
relying on it shows the platform-name placeholder until you upload something.
Easy to restore as a last-resort fallback if you want it.

---

## Capturing the screenshots

The pan only reads as "scrolling the site" if the image is genuinely tall — a
full-page capture, not a viewport crop.

- **Chrome DevTools** — Cmd/Ctrl+Shift+P → "Capture full size screenshot". Set
  the device toolbar to 1440px wide first so you get the desktop layout.
- **Firefox** — right-click → "Take Screenshot" → "Save full page".

Aim for 1000–1440px wide. Height sorts itself out; a typical homepage lands
between 4000 and 8000px.

**Export as WebP or quality-80 JPEG.** A 6000px-tall PNG easily hits 4–5MB, and
the grid loads one per card. They're lazy-loaded, but a 5MB image below the fold
is still 5MB once someone scrolls.

---

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
