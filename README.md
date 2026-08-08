# Blog pagination

5 files (3 new). Apply after the cleanup zip — `styles/globals.css` and
`app/(site)/blog/page.tsx` overlap and these are newest.

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors. The
page-window logic was tested at 3, 12, first, middle and last pages.

## What this replaces

The listing was capped at 24 posts in the last zip — which stopped the page
growing without bound, but meant post 25 became unreachable. This is the proper
fix: 12 per page at `/blog`, `/blog/page/2`, `/blog/page/3` and so on.

## Why numbered links and not "load more"

Content behind a button click is content a crawler may never reach. Every page
link here is a real `<a href>`, so Google can walk the whole archive. Same class
of bug as the portfolio one, where your case studies existed only after
JavaScript ran.

## The SEO details that matter

**Self-referencing canonicals.** `/blog/page/2` canonicalises to itself, not to
`/blog`. Pointing paginated pages at page 1 is a common and damaging mistake —
it tells Google the posts listed on page 3 are duplicates of page 1, so posts
only reachable from deeper pages stop being discovered.

**Distinct titles per page.** "Blog — Page 2 | …" rather than the same title
repeated across every paginated URL.

**`/blog/page/1` redirects to `/blog`.** Otherwise the same content sits at two
URLs competing with each other.

**Past the last page returns 404.** An empty 200 is a soft-404 — Google reports
those as errors, and it would let a crawler wander through unlimited empty
pages. Non-numeric input (`/blog/page/abc`) 404s too, with `noindex` on the
metadata as a second line of defence.

**Featured card only on page 1.** On later pages every post gets an equal card.

## Change the page size

`POSTS_PER_PAGE` at the top of `lib/blog.ts`. Counting and slicing happen in
MongoDB, so this stays cheap however large the blog gets.

## Check after deploying

1. `/blog` — 12 posts, pagination bar at the bottom (only once you have 13+)
2. `/blog/page/2` — loads, no featured card, title says "Page 2"
3. View source on page 2 — canonical points at `/blog/page/2`, not `/blog`
4. `/blog/page/1` — redirects to `/blog`
5. `/blog/page/999` and `/blog/page/abc` — both 404
6. One page at 375px wide — numbers move above the Prev/Next row

## Not included: the sitemap

Paginated URLs are deliberately left out. Google discovers them by following
links, and listing them adds bulk without adding value — your sitemap should
advertise the posts themselves, which it already does.
