# Logo flash fix + the Shopify page

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors.

---

## Why the Shopify page still says WordPress

**Because I only gave you half a fix, and I should have said so more plainly.**

That headline is not in the code. It is a saved value sitting in your MongoDB
`pages` collection:

```
props.headline = "Powerful WordPress development for your business"
```

The code change I shipped only altered the *defaults* used when someone adds a
**new** Tool Hero section. It cannot reach a section that was saved months ago —
nothing in a code deploy rewrites your database.

`fix-content.mongosh.js` is included again here. Until it runs, the page will
keep saying WordPress no matter how many times you deploy.

### Two ways to fix it

**Fastest — 30 seconds, no terminal:**

1. Admin → Pages → Shopify Services → open in the builder
2. Select the **Tool Hero** section (the top one)
3. Change **Headline** to something Shopify-specific
4. Find the hidden **Hero (Interactive)** section and unhide it — it carries
   your real H1, "Professional Shopify Development Services"
5. Save

**Or run the script**, which does both plus four other fixes:

```bash
mongosh "<YOUR_MONGODB_URI>" fix-content.mongosh.js
```

Either way, that page has a second problem worth knowing about: its real hero,
the one with the correct H1, is currently set to hidden. So the page has no
correct H1 at all — the tool's WordPress headline is standing in for it.

---

## The logo flash — a real bug, now fixed

You are seeing the text wordmark paint first, then get replaced by the logo
image. Here is why:

`app/(site)/layout.tsx` was a **client component** (it called `usePathname` to
decide on breadcrumbs). That forced the navbar to be client-side too, so it
started with an empty logo, rendered the wordmark, then fetched
`/api/settings` in the browser and swapped the image in.

That costs you three things on every single page load: the visible flash, a
layout shift that counts against Cumulative Layout Shift, and a round trip
before the header is correct.

### The fix

- `components/layout/SiteMain.tsx` — **new.** The one piece that genuinely
  needs the pathname (breadcrumbs) moved here.
- `app/(site)/layout.tsx` — now a **server component**. Reads the header
  branding on the server and passes it to the navbar as props.
- `lib/header.ts` — **new.** Server-side read of logo, site name and width,
  using the exact same precedence the client fetch used, so nothing about which
  logo wins has changed.
- `components/layout/Navbar.tsx` — seeds its state from the server value. The
  client fetch still runs for menu data, but skips the branding fields when the
  server already supplied them, so there is nothing to repaint.

The correct logo is now in the server HTML on first paint. Nothing swaps.

Fail-safe: if the database read fails, it falls back to the wordmark and the
header still renders. The page will not break over a logo.

## What to check after deploying

1. Hard-refresh any page — the logo should be correct on the **first frame**,
   with no wordmark flash
2. `view-source:` and search for your Cloudinary logo URL — it should be in the
   raw HTML
3. Mobile drawer still shows the logo
4. Then run the script (or do the two admin edits) and re-check
   `/services/shopify`
