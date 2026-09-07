/**
 * The single source of truth for whether a blog post is visible to the public.
 *
 * A post is in one of three states:
 *
 *   draft      — written but not for anyone's eyes yet.
 *   scheduled  — finished, with a date and time it should appear on.
 *   published  — live now.
 *
 * Scheduling is resolved at query time rather than by a background job. There
 * is no cron, no queue and nothing to fall over at 3am: a scheduled post is
 * simply one whose `scheduledFor` has passed, and every read asks that question
 * fresh. The public blog routes are `force-dynamic`, so a post scheduled for
 * 09:00 is served from 09:00 — not at the next cache sweep.
 *
 * The reason this lives in one module rather than inline at each call site is
 * the failure mode. Nine separate places query for public posts — the listing,
 * the post page, related posts, the homepage, two sitemaps, the RSS feed,
 * IndexNow and the public API. If any one of them keeps a plain
 * `{ published: true }` it will simply miss scheduled posts; worse, if any one
 * of them drops the time comparison it will publish a post early to Google via
 * the sitemap while the site itself still 404s it. Both bugs are invisible
 * until they are embarrassing, so the filter is written once and imported.
 */

import type { BlogDoc } from '@/types'

export const BLOG_STATUSES = ['draft', 'scheduled', 'published'] as const
export type BlogStatus = (typeof BLOG_STATUSES)[number]

/** The subset of a post this module needs. Keeps the helpers testable. */
export type StatusFields = {
  status?: string
  published?: boolean
  scheduledFor?: string | null
}

/**
 * Timestamps are stored as `Date.prototype.toISOString()` output and nothing
 * else: always UTC, always `YYYY-MM-DDTHH:mm:ss.sssZ`, always the same width.
 * That is what makes the `$lte` string comparison in `liveFilter` exact rather
 * than approximate — fixed-width UTC ISO strings sort chronologically. Every
 * write goes through here so the format cannot drift into something (a local
 * time, a missing zone, a dropped milliseconds field) that would break it.
 *
 * Returns null for anything unparseable, which callers treat as "not scheduled"
 * rather than as "scheduled for the epoch".
 */
export function toStoredTime(input: unknown): string | null {
  if (!input) return null
  // A number is epoch milliseconds and must be passed to Date as a number.
  // Stringifying it first gives `new Date("1789000000000")`, which is not a
  // date format any engine parses — the value would silently become null and
  // a scheduled post would quietly turn back into a draft.
  const d =
    input instanceof Date ? input
    : typeof input === 'number' ? new Date(input)
    : new Date(String(input))
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

/**
 * Is this post visible to the public right now?
 *
 * `published: true` wins outright — that is a post someone deliberately made
 * live, and it stays live regardless of any stale `scheduledFor` left on the
 * record from an earlier plan.
 */
export function isLive(post: StatusFields, now: Date = new Date()): boolean {
  if (post.published === true) return true
  if (post.status !== 'scheduled') return false
  const at = toStoredTime(post.scheduledFor)
  return at !== null && at <= now.toISOString()
}

/**
 * The MongoDB equivalent of `isLive`, for queries that must filter in the
 * database rather than in JavaScript.
 *
 * These two are required to agree. `t_blog_status.mjs` runs a matrix of posts
 * through both and fails if they ever disagree, because a divergence here is
 * exactly how a post ends up live on the site but missing from the sitemap.
 */
export function liveFilter(now: Date = new Date()) {
  return {
    $or: [
      { published: true },
      // `as const` matters: without it TypeScript widens this to `string`,
      // which no longer satisfies Mongo's Filter<BlogDoc> for the narrowed
      // status union and every call site fails to typecheck.
      { status: 'scheduled' as const, scheduledFor: { $lte: now.toISOString() } },
    ],
  }
}

/**
 * What the admin list should show.
 *
 * A scheduled post whose time has passed is live, so calling it "Scheduled"
 * forever would be a lie — the stored record is never rewritten, so the label
 * is computed instead. This is why no cron job is needed to "flip" anything.
 */
export function displayStatus(post: StatusFields, now: Date = new Date()): BlogStatus {
  if (isLive(post, now)) return 'published'
  return post.status === 'scheduled' ? 'scheduled' : 'draft'
}

/**
 * Normalise what an editor submitted into the fields actually stored.
 *
 * Everything the API writes for these three fields comes from here, so the
 * record can never end up in a contradictory state — published with a future
 * date, scheduled with no date, or a status string that is not one of the
 * three. `publishedAt` is the separate, permanent record of when a post first
 * went live and is preserved from `previous` rather than being stamped again,
 * because overwriting it on every edit would keep resetting the article's age
 * in schema.org and in Google's eyes.
 */
export function normalizeStatus(
  input: { status?: unknown; published?: unknown; scheduledFor?: unknown },
  previous?: { publishedAt?: string | null },
  now: Date = new Date(),
): { status: BlogStatus; published: boolean; scheduledFor: string | null; publishedAt: string | null } {
  const at = toStoredTime(input.scheduledFor)
  const asked = String(input.status ?? '')

  // An explicit status wins; otherwise fall back to the legacy boolean, which
  // is all the older editor sent.
  let status: BlogStatus =
    (BLOG_STATUSES as readonly string[]).includes(asked)
      ? (asked as BlogStatus)
      : input.published === true ? 'published' : 'draft'

  // "Scheduled" with no usable date is not a state anything can act on. Treat
  // it as the draft it effectively is rather than storing a post that no query
  // will ever match and no editor will ever think to look for.
  if (status === 'scheduled' && at === null) status = 'draft'

  // A time already in the past is not a schedule, it is a publish. Saying so
  // now avoids a post sitting in the list labelled "Scheduled" while already
  // being served, which reads like a bug even though the gate is doing the
  // right thing.
  if (status === 'scheduled' && at !== null && at <= now.toISOString()) status = 'published'

  const published = status === 'published'

  return {
    status,
    published,
    // Only a scheduled post carries a date. Clearing it on the other two
    // states stops an abandoned schedule from lingering on the record and
    // confusing the next person to open the post.
    scheduledFor: status === 'scheduled' ? at : null,
    publishedAt: previous?.publishedAt || (published ? now.toISOString() : null),
  }
}

/**
 * `<input type="datetime-local">` speaks local wall-clock time with no zone
 * ("2026-09-10T09:00"), while storage is UTC. These two convert between them
 * using the browser's own offset, so an editor in Lahore who types 09:00 gets a
 * post that appears at 09:00 for them — not at 09:00 UTC, five hours late.
 */
export function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function fromLocalInput(local: string): string | null {
  if (!local) return null
  // `new Date('2026-09-10T09:00')` is interpreted as local time by every
  // engine that follows the spec, which is what we want here.
  const d = new Date(local)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

/** Human-readable "in 3 days" / "in 2 hours", for the editor's confirmation line. */
export function describeDelay(iso: string | null | undefined, now: Date = new Date()): string {
  const at = toStoredTime(iso)
  if (!at) return ''
  const ms = new Date(at).getTime() - now.getTime()
  if (ms <= 0) return 'now'
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `in ${mins} minute${mins === 1 ? '' : 's'}`
  const hours = Math.round(mins / 60)
  if (hours < 48) return `in ${hours} hour${hours === 1 ? '' : 's'}`
  const days = Math.round(hours / 24)
  return `in ${days} day${days === 1 ? '' : 's'}`
}

/** Convenience for the handful of places that hold a full document. */
export function isPostLive(post: Pick<BlogDoc, 'published'> & StatusFields, now?: Date): boolean {
  return isLive(post, now)
}
