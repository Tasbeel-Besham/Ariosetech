# URGENT — rollback + serialization fix

10 files. Apply on top of everything else and redeploy. This reverts a change
of mine that broke your site.

Verified: `next build` compiles with **no database access at build time** and
`tsc` 0 errors, `eslint` 0 errors.

---

## What I broke

Your original `app/layout.tsx` had `export const dynamic = 'force-dynamic'`.
Because it was on the **root layout**, it forced *every page in the app* to
render per request. I read that as a performance problem and changed it to
`revalidate = 3600`.

That flipped the entire site from "always fresh from the database" to
"prerendered at build time" — **including pages whose files I never edited.**

The consequence: any page whose database read failed or returned empty *during
the build* had that empty result baked into the deployment and served to
everyone. That is exactly your blog page with no blogs, and your portfolio page
still saying "No projects to show yet" — I confirmed the latter is live right
now.

I then made it worse by adding `generateStaticParams` to four routes, which
made the build itself depend on MongoDB being reachable. Vercel's build
machines are not usually in a MongoDB Atlas IP allowlist, so a build that can't
connect produces a site full of empty pages, silently, with a green checkmark.

**This is my error, not a configuration problem on your side.** The caching idea
was sound; applying it to a root layout that was deliberately dynamic was not,
and I should have treated `force-dynamic` on a root layout as a decision someone
made on purpose rather than an oversight.

## What this zip does

1. **Restores `force-dynamic`** on the root layout and the 7 other routes I
   changed. Back to your original rendering behaviour.
2. **Removes all 4 `generateStaticParams`**, so the build no longer touches the
   database at all.
3. **Fixes a second bug** (below).

Everything else stays: the server-side data hydration still runs — now per
request, which is where it always should have been. Your portfolio and blog
content will be in the server HTML *and* always current.

## The second bug

`lib/builder/server-data.ts` passed raw MongoDB documents into `BuilderRenderer`,
which is a Client Component. A Mongo document carries an `ObjectId` `_id` and
`Date` fields — class instances React cannot serialize across the
server/client boundary. That throws *"Only plain objects can be passed to Client
Components"*, which takes down the **entire page**, not just the section.

Any builder page containing a blog section would have crashed. Now every field
is mapped to a plain string or number before it crosses the boundary.

## After deploying

1. `/blog` — posts should be back
2. `/portfolio` — projects should be back; also check
   `view-source:` and search for a client name, it should be in the raw HTML
3. `/contact` — confirm the form is back
4. `/about` — confirm the icons render

## About re-introducing caching later

Worth doing, but not before verifying your MongoDB Atlas Network Access allows
Vercel to connect during builds, and then only on individual pages — never on
the root layout, where one line silently changes every route in the app.

---

## Still unexplained

I could not reproduce the **About page icon** problem. Those icons are inline
`<svg>` elements hardcoded in `app/(site)/about/page.tsx`, and I verified that
file is byte-identical to your original — I never touched it, nor `Icons.tsx`,
nor `contact/page.tsx`. I also diffed `globals.css` against your original and
confirmed nothing was removed except the intended `.pfc-shot` block.

If the icons are still wrong after this deploy, send me a screenshot and I'll
chase it properly rather than guess.
