# Header flash — complete fix (v2)

Supersedes `ariosetech-header-ssr`. Verified: `next build` compiles, `tsc` 0
errors, `eslint` 0 errors, and the cache logic was unit-tested including
failure recovery.

---

## Your observation explains it exactly

> "I see it on a few pages, and those are the pages where I see the loading screen"

That correlation is the diagnosis, and it confirms the cause.

The loading screen shows **once per browser session**. So the pages where you
see it are the pages you loaded **fresh** — typed the URL, refreshed, or arrived
from outside. Clicking a link inside the site is a client-side navigation: the
layout never unmounts, the navbar keeps the logo it already has, and there is
nothing to flash.

So it isn't "a few pages". It is **every full page load**, which happens to be
the same set of pages where the preloader appears. Same trigger, two symptoms.

On a fresh load the sequence was:

1. Server sends HTML with an empty logo → the text wordmark paints
2. Preloader covers the screen for about a second
3. Browser fetches `/api/settings` and `/api/menus`
4. Curtain lifts — if the fetch hasn't landed yet, you watch the swap

On a cold serverless start those API calls can easily outlast the preloader,
which is why it is intermittent rather than constant.

## What changed since the last zip

The previous version server-rendered only the **branding**. Your screenshots
showed the nav **order** changing too, so the menus were still client-fetched.
Both are now read on the server.

The menu transforms moved out of `useEffect` into plain functions used as
`useState` lazy initialisers. Client components are pre-rendered on the server,
so state computed from props during first render lands in the HTML — state set
from an effect does not. That distinction was the entire bug.

## And a cost I introduced, now handled

Reading this server-side puts five database queries in front of every page
render, and the site is force-dynamic, so every request would pay it. That would
have traded a visible flash for a slower server response — a bad deal.

`lib/header.ts` now has a 60-second in-process cache plus React `cache()` for
per-request dedup. Header settings change only when you save them in the admin,
so a warm instance serves them from memory.

`clearHeaderCache()` is called by the header, settings and menus save routes, so
your admin edits still appear immediately rather than up to a minute later.

One detail worth knowing: a **fallback result is never cached**. If the database
blips, the header falls back to the wordmark for that one request and the next
request retries — rather than pinning the wordmark in place for a minute.

## How to confirm it is actually deployed

This is the check that settles it:

```
view-source:https://ariosetech.com/services/shopify
```

Search for your logo URL. If it is in the raw HTML, the fix is live. If you only
find the wordmark text, the deploy has not gone out yet — and no amount of
refreshing will change the behaviour.

## The Shopify content — still needs one action

`fix-shopify-in-browser.js` is included again. No terminal:

1. Open `/admin/pages` while logged in
2. **F12** → **Console**
3. Paste the file, Enter
4. Reload `/services/shopify`

That headline lives in your MongoDB `pages` collection, not in the code. Nothing
in a deploy rewrites database rows, so this will keep saying WordPress until the
script runs or you edit the two fields in the builder by hand.
