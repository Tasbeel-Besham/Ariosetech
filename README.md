# Industries page — v2

**Replaces v1 entirely.** 4 code files + the page document.

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors, and all 11
directory links confirmed to point at real `/industries/<slug>` pages with no
in-page anchors.

---

## What was wrong with v1

**No hero.** I built a custom opener instead of using the site hero that runs on
every other page, so /industries didn't look like it belonged to the site.

**It went nowhere.** The index linked to `#anchors` further down the same page.
You have a real page per industry, so that was the wrong model twice over — it
gave visitors a dead end, and it wasted the internal links that should be
passing authority from this page to eleven child pages.

**It also duplicated them.** Eleven long entries here would compete with the
eleven pages that cover the same ground properly.

## What v2 is

| # | Section | Notes |
|---|---|---|
| 1 | `hero-interactive` | Your standard site hero, so the page matches everything else |
| 2 | `industry-directory` | **New.** 11 rows, each a real link to `/industries/<slug>` |
| 3 | `industry-contrast` | Kept from v1 — makes the case without duplicating child pages |
| 4 | `cta` | Your existing site CTA |

**Removed:** `industry-index` and `industry-entries` are deregistered and their
component files deleted. Nothing else used them.

## The directory design

Editorial two-column: a sticky lede on the left, the linked list on the right.
Rows rather than a card grid — eleven identical cards read as filler, a list
reads as a directory, which is what this is.

Each row carries a number, the industry name, a one-line "what changes here",
and platform tags. On hover an accent bar grows from the centre, the row shifts
3px, and the arrow slides. That's the only flourish; everything else stays
quiet.

Tags hide below 860px and the layout stacks below 1024px, so the name and
descriptor always carry the row on mobile.

## Applying it

Deploy the code first, then:

```bash
mongosh "<YOUR_MONGODB_URI>" industries-page.mongosh.js
```

Safe to re-run. If `/industries` exists it updates in place keeping the same
`_id`, after copying the old layout to `page_layout_backups`. `industries-page.json`
is the same document for Compass, but only use it if the page does not already
exist — a plain insert would create a duplicate `fullPath`.

## Check after applying

- `/industries` in dark **and** light mode
- Click three or four rows — each should land on that industry page
- 375px wide — tags hidden, rows still readable
- Tab through the list; focus outlines visible
- **Read the copy.** Still my draft. The one-line descriptors and the hero
  subheadline are the ones most worth rewriting in your voice.
