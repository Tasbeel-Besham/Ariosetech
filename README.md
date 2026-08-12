# Header flash — complete fix + a no-terminal Shopify fix

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors.

---

## The header flash: my last fix was half a fix

Your two screenshots show more than the logo changing. Look at the nav order:

- **First paint:** HOME · SERVICES · **INDUSTRIES · PORTFOLIO · TOOLS** · ABOUT · BLOG · CONTACT
- **A second later:** HOME · SERVICES · **TOOLS · INDUSTRIES · PORTFOLIO** · ABOUT · CONTACT · BLOG

The links reshuffle too. That told me I fixed the wrong half.

Last time I server-rendered the **branding** (logo, site name, width) but left the
**menus** being fetched in a `useEffect`. So the navbar still painted with the
hardcoded fallback menu and then swapped to your saved one — same flash, second
cause.

### Now fixed properly

The menu transforms were buried inside that `useEffect`, meaning the resolved
menus could only exist after the browser ran JavaScript. They are now plain
functions (`resolveNavLinks`, `resolveServiceTabs`, `resolveToolLinks`) used as
`useState` lazy initialisers.

That matters because **client components are pre-rendered on the server** in the
App Router. State computed from props during first render lands in the server
HTML. State set from an effect does not. That distinction was the whole bug.

`lib/header.ts` now reads the menus alongside the branding, and the client fetch
is skipped entirely when server data is present — so there is no second paint at
all, and five API round trips disappear from every page load.

One trap handled: Mongo documents carry `ObjectId` and `Date` instances, which
React cannot serialize into a client component. They are JSON round-tripped
before being passed, otherwise the page throws "Only plain objects can be passed
to Client Components" — the same class of bug that took down the portfolio
earlier.

## The Shopify page: fix it in 20 seconds, no terminal

I have given you a mongosh script twice. Here is a version needing no terminal:

1. Open `https://ariosetech.com/admin/pages` — make sure you are logged in
2. Press **F12**, click **Console**
3. Paste all of `fix-shopify-in-browser.js`, press **Enter**
4. Reload `/services/shopify`

It uses your own admin API with the session cookie you already have, so it can
only do what you could do by hand in the builder. Safe to run twice — it checks
the state and stops if already fixed.

It does four things:
- Unhides the real Shopify hero, restoring the H1 "Professional Shopify
  Development Services" (the page currently has **no correct H1** — the tool's
  WordPress headline is standing in for it)
- Rewrites the tool hero for Shopify and sets it to `h2` so you don't end up
  with two `h1` elements
- Puts the hero first
- Adds the meta title and description the page never had

**To be explicit about why deploying alone never fixed this:** that headline is
a value saved in your MongoDB `pages` collection, not a string in the codebase.
No code deploy rewrites database rows. The code change I made earlier only
affects sections added *from now on*.

## What to check

1. Hard-refresh any page. The logo **and** the nav order should be correct on
   the first frame — no reshuffle.
2. `view-source:` and search for your logo URL; it should be in the raw HTML.
3. Run the console script, reload `/services/shopify`.
4. Confirm exactly one `<h1>` on that page (Console: `document.querySelectorAll('h1').length`).
