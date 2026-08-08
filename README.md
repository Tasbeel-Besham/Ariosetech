# Cleanup + blogging improvements

8 files (1 new: `app/rss.xml/route.ts`). Apply after the sitemap zip.

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors. The RSS
generator was tested against ampersands, HTML in excerpts, missing dates and
null slugs.

---

## Deleted — dead weight

**The `<meta name="keywords">` tag.** Google has ignored it since 2009. It was
being written on every builder page and into your Article schema, so filling it
in returned nothing while publishing your target keyword list to any competitor
who viewed source.

Removed from three places:
- `app/(site)/[...slug]/page.tsx` — the meta tag
- `lib/schema.ts` — two places feeding it into JSON-LD
- Both blog editors — the "Focus Keywords" / "Keywords" input, so nobody wastes
  time filling a field that does nothing

**Your stored data is untouched.** The `keywords` field still exists on the
type and in the database; it simply isn't rendered. Nothing to migrate, and it's
reversible.

## Fixed — the blog listing had no limit

`/blog` fetched and rendered **every** published post on one page. That grows
without bound: slower LCP, more bytes, worse crawl target with every post you
publish. Now capped at 24, which is roughly two screens of cards.

You'll want real pagination once you pass that — worth doing properly with
`/blog/page/2` URLs rather than a "load more" button, since infinite scroll
hides content from crawlers.

## Added — RSS feed at `/rss.xml`

Three reasons this earns its place:

1. **Perplexity and similar engines weight freshness heavily**, and a feed is
   the cheapest possible signal that new content exists.
2. **Feed readers and newsletter tools can't subscribe without one** — Feedly,
   Inoreader, Mailchimp RSS campaigns.
3. **Other people's automation consumes feeds** — roundup newsletters, Slack
   bots, "best posts this week" lists. Those are brand mentions you don't have
   to ask for, which is the lever that correlates most strongly with AI
   visibility.

Not a ranking factor. A distribution channel.

Auto-discovery added to `<head>` so browsers and readers find it, plus `host` in
robots.txt.

---

## Delete these yourself — I won't touch your files

Eight dead files in your project root, none imported by the app. They produced
every one of the lint errors that forced `ignoreDuringBuilds: true`:

```
find-icons.js   fix-image-icon.js   generate-icons.js   replace-icons.js
scratch_db.js   seed-footer.js      db.ts               old_hero.tsx
```

**Four unused dependencies** — zero imports anywhere in `app/`, `components/`,
`lib/`, `styles/` or config:

```bash
npm uninstall react-hook-form zod @hookform/resolvers geist
```

They don't reach your bundle (unused imports are tree-shaken), so this is
install time and audit surface, not page weight. Verify with `npm run build`
before committing.

---

## SEO mistakes I could NOT fix in code

Your keyword cannibalization lives in **database content**, not files. `/` and
`/services` currently target near-identical terms, and `/services/wordpress`
overlaps `/portfolio/wordpress`. Fixing that means rewriting titles, meta
descriptions and H1s in the admin — your copy, your voice, and you asked me not
to touch public-facing copy.

The rule: one primary term per page, and the title, H1, first paragraph and
inbound anchor text should agree. `/` should own the brand plus your strongest
service; `/services` should be a hub that links out rather than competing.

## Check after deploying

1. `https://ariosetech.com/rss.xml` — should list your posts
2. Paste it into [validator.w3.org/feed](https://validator.w3.org/feed/)
3. `/blog` still renders; view source and confirm no `<meta name="keywords">`
4. Open a post in the admin — the Keywords input is gone, everything else works
