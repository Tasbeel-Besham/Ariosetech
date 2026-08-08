# Industries page — redesign

6 files (4 new). Apply after the blog pagination zip — `styles/globals.css` and
`lib/builder/registry-init.ts` overlap and these are newest.

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors.

---

## The design idea

An industries page is normally a grid of eleven identical icon cards. That says
nothing — eleven interchangeable tiles read as *"we'll take any work"*, which is
the opposite of the argument you want to make.

This is built as a **technical index instead**:

1. **Industry Index** — the hero is a real table of contents. Eleven verticals,
   numbered, with dotted leaders running to a one-word specialism. Each row
   jumps to its entry. The structure is honest rather than decorative: it's a
   genuine index, and the count is the argument.
2. **Industry Contrast** — the case, made by comparison. Four pairs of
   businesses that look like one job on a proposal, with the technical decision
   that separates them. Purely typographic; an icon would only decorate it.
3. **Industry Entries** — eleven numbered specimen entries: the problem that
   vertical actually hits, what gets built for it, the stack it lands on.

Hairlines and type carry the design. No cards, no gradient panels, no icon grid.
The one flourish is the dotted leader in the index, and everything around it is
kept quiet so it reads as the signature rather than one effect among many.

**Nothing is behind a tab or an accordion.** All eleven entries are in the DOM
at load, so crawlers and answer engines see the whole page without running
JavaScript — the same failure that made your portfolio invisible.

## The content

Written to be specific rather than salesy, and grounded in work you've actually
done — the colour-taxonomy filter failure from the 845-product catalogue, custom
kit lead times, wholesale tier pricing, postcode-first availability.

**Read it before publishing.** It's my draft in my words, and it should be
yours. Every field is editable in the builder, so you can rewrite in place.

Two things I'd check specifically: the stack lines ("Shopify · WooCommerce")
should match what you'd actually recommend, and the closing note says eleven
verticals is where you're strong but not a limit — make sure that's the position
you want to take.

## Applying the layout

The page content lives in MongoDB, so a code deploy alone won't change it. Deploy
first, then:

```bash
node scripts/build-industries-page.mjs             # dry run — shows the plan
node scripts/build-industries-page.mjs --apply     # writes it
node scripts/build-industries-page.mjs --restore   # undo
```

Needs `MONGODB_URI` (reads `.env.local` if it's there). Before writing, it copies
your current layout to a `page_layout_backups` collection, so `--restore` puts
it back exactly.

It only replaces `layout.sections`. Your SEO settings, slug, title and status are
untouched. It will not create the page — if `/industries` doesn't exist yet,
create it in the admin first.

**Alternatively, ignore the script entirely.** The three sections appear in the
builder's section list once deployed, so you can assemble the page by hand and
never run it.

## Check after applying

- `/industries` in dark **and** light mode
- 375px wide — the leader dots hide below 640px and the specialism moves under
  the name, since dots need horizontal room to read as leaders
- Click an index row; it should jump to that entry with the heading clear of the
  sticky header
- Tab through the index — focus outlines should be visible
