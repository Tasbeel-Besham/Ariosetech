# ARIOSETECH — build hardening (remaining fixes)

Extract into your `ariosetech-v2` project root. 11 files.

**Apply this AFTER the `ariosetech-seo-fixes` zip.** Four files overlap
(`next.config.ts`, `app/layout.tsx`, `app/sitemap.xml/route.ts`,
`app/(site)/portfolio/[category]/page.tsx`) and the versions here are newer.
`components/ui/MediaPickerModal.tsx` also supersedes the portfolio-screenshot
zip's copy — one unused import removed, nothing else.

Verified by actually running `tsc`, `eslint` and `next build` against your code
with dependencies installed. Final state: **0 type errors, 0 lint errors,
build passes.**

---

## I was wrong about the type-error backlog

I said flipping `ignoreBuildErrors` would "almost certainly fail your next
build until the backlog of existing type errors is cleared." I ran it. There is
no backlog — **0 TypeScript errors.** The caution was unfounded and cost you a
round trip. Both flags are now `false`:

```ts
eslint:     { ignoreDuringBuilds: false },
typescript: { ignoreBuildErrors: false },
```

A broken type or a bad link now fails the deploy instead of shipping a broken
page you'd discover from a ranking drop.

### Lint: 18 errors → 0

Five were real, in shipped code, and are fixed:

| File | Error | Fix |
| --- | --- | --- |
| `components/sections/WhyUsSection.tsx` | 3 × `prefer-const` | `let` → `const` |
| `app/admin/authors/page.tsx` | `<a>` to an internal page | `<Link>` |
| `components/tools/SeoAuditClient.tsx` | `<a href="/contact">` | `<Link>` — this one also forced a full page reload instead of a client-side transition |

The other 13 were all in throwaway root-level files never imported by the app —
`find-icons.js`, `generate-icons.js`, `replace-icons.js`, `fix-image-icon.js`,
`scratch_db.js`, `seed-footer.js`, `db.ts`, `old_hero.tsx` — plus the
auto-generated `next-env.d.ts`, whose triple-slash reference is required and
cannot be "fixed". These are now in the `ignores` block of `eslint.config.mjs`
so lint gates the code that actually ships.

133 warnings remain (mostly `any` and unused imports). Warnings don't fail
builds. Worth chipping away at, not worth blocking on.

**Those eight root files are dead weight** — consider deleting them or moving
them under `scripts/`. I left them alone since they're yours and I can't tell
what you still use.

---

## A regression from the last zip — found and fixed

Moving pages from `force-dynamic` to `revalidate` means Next now **prerenders at
build time**, so the build talks to MongoDB. It didn't before.

`app/sitemap.xml/route.ts` had unguarded DB reads. My first build failed:

```
MongoServerSelectionError: Server selection timed out after 5000 ms
Export encountered an error on /sitemap.xml/route, exiting the build.
```

On Vercel your DB is reachable, so you might never have hit this — but it meant
**a five-second database blip during a build would fail the whole deployment.**
Previously that was impossible.

Every build-time DB read is now individually fail-safe. A failed read degrades
to an empty list; the sitemap still ships with its static routes and ISR fills
in the rest within the hour. I re-ran the build with MongoDB unreachable and it
**completed successfully** — that's the proof the guards hold.

Same treatment for `blog/[slug]`, whose `generateMetadata` and page component
both had unguarded reads that would now run at build.

---

## Prerendering the pages that matter

Added `generateStaticParams` so your SEO landing pages are prerendered rather
than rendered on demand. Without it, the first visitor after each revalidation —
frequently Googlebot — pays for the database round trip.

| Route | Effect |
| --- | --- |
| `app/(site)/[...slug]/page.tsx` | Prerenders every published page — this is `/services/*` and `/industries/*`, your actual landing pages |
| `app/(site)/portfolio/[category]/page.tsx` | Prerenders the four category pages |
| `app/(site)/blog/[slug]/page.tsx` | Prerenders published posts |

Confirmed in the build output:

```
● /portfolio/[category]
  ├ /portfolio/wordpress
  ├ /portfolio/woocommerce
  ├ /portfolio/shopify
  └ /portfolio/seo
```

All three return `[]` if the DB is unreachable, falling back to on-demand
rendering rather than failing the build.

---

## One thing to fix on your machine

Your local `node_modules` is **missing all six `@tiptap/*` packages** even though
they're in `package.json`. Your blog rich-text editor imports them, so a local
`npm run build` fails with five "Cannot find module" errors that have nothing to
do with your code. Vercel installs from `package.json` so production is fine.

```bash
npm install
```

Worth doing before you trust any local build result.

---

## After deploying

1. Watch this deploy specifically. It's the first that can fail on type or lint
   errors — that's the point, but it's a change in behaviour.
2. If it fails, the error will name a file and line. Nothing here is subtle.
3. Confirm `/portfolio/shopify` and a `/services/*` page still render.

## Still outstanding

Neither is a code change:

- **Market focus.** Six markets from a standing start is still the most likely
  reason to see nothing move in six months.
- **Homepage copy.** "Save 60%" leads on price to buyers you've priced at
  $10,000+ minimum, and the process section appears twice with near-identical
  content. Both are admin edits. Happy to draft alternatives.
