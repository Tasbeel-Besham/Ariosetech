# ARIOSETECH — Google compliance fixes (zip 4 of 4)

Extract into your project root. 7 files. Apply **last**, after
`portfolio-screenshots` → `seo-fixes` → `build-hardening`. `app/layout.tsx`
overlaps with earlier zips; this version is newest.

Verified: `tsc` 0 errors, `eslint` 0 errors, `next build` compiles.

---

## 1. Self-serving review markup — the most serious finding

Your site emitted this on the homepage, attached to your own
`ProfessionalService` entity:

```json
"aggregateRating": { "ratingValue": "5.0", "reviewCount": "30" }
```

Two problems.

**It is ineligible by policy.** Google stopped showing review rich results for
`LocalBusiness` and `Organization` (and subtypes like `ProfessionalService`)
when the entity being reviewed controls the reviews. This is the "self-serving
reviews" rule. The markup earns you nothing — no stars, ever.

**The numbers contradicted the page.** The schema claimed 5.0 from 30 reviews.
Your page visibly shows 4.9 from 16 on Clutch, and a separate 5.0 for Google.
Structured data that doesn't match visible content is precisely what the
*Spammy Structured Markup* manual action targets — and that action strips rich
results across the whole domain, including your legitimate FAQ, Breadcrumb and
Article markup.

So it was zero upside against a real, sitewide downside. Removed from
`SchemaMarkup.tsx` and `app/layout.tsx`, with a warning comment left in
`lib/schema.ts` so the capability isn't reintroduced by accident.

**Your visible Clutch and Google review links are the correct way to carry this
signal** — keep those. If you want stars in search results, they have to come
from a third-party platform's own markup, not yours.

---

## 2. Second crawl trap — case study URLs

`app/(site)/portfolio/[category]/[slug]/page.tsx` looked items up by `slug`
alone and ignored the `category` segment entirely. So
`/portfolio/anything/thekapra` returned 200 with identical content — unlimited
duplicate URLs for every case study.

Now: a wrong category **301-redirects** to the single correct URL (a redirect
rather than a 404, so any existing inbound links keep working and pass their
authority), and mismatched URLs are marked `noindex` in metadata.

Also on that route:
- `Props` type was missing the `category` param altogether.
- Added `generateStaticParams` so case studies prerender.

---

## 3. Cache invalidation gaps

Auditing my own work from the last zip, three mutating routes were missing
`revalidateSite()`:

- `app/api/authors/route.ts`
- `app/api/authors/[id]/route.ts`
- `app/api/seed/route.ts`

Authors are published content — `/author/[slug]` pages, blog bylines, and the
`Person` structured data that carries your E-E-A-T signal. Editing an author
would have left all of that stale for up to an hour. Fixed.

I re-checked every remaining mutating route. The others (`users`, `auth`,
`media`, `leads`, `forms`, `tracking`, `tools`, `submit`) don't touch published
content and correctly don't invalidate.

---

## Verify after deploy

1. `/portfolio/other/thekapra` still loads (it's linked from your homepage).
2. `/portfolio/wrongcategory/thekapra` 301s to the correct URL.
3. Rich Results Test on the homepage — no more AggregateRating, FAQ and
   Organization still valid.
4. Edit an author, confirm `/author/<slug>` updates immediately.
