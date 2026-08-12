import { getCollection } from '@/lib/db/mongodb'

/**
 * Tool failure logging.
 *
 * The free tools are a genuine acquisition asset — they are the pages other
 * sites will actually link to. But a tool that fails often costs twice: the
 * visitor doesn't convert, and the failure reads as a demonstration that you
 * can't build reliable software.
 *
 * Right now failures are `console.error` only, which means they vanish into
 * Vercel's log retention and nobody ever reviews them. This records them so
 * you can see the failure RATE and, more usefully, the pattern — one site that
 * blocks scrapers is noise, forty timeouts in an hour is an outage.
 *
 * Deliberately minimal:
 *   - Never throws. A logging failure must not turn a handled error into a 500.
 *   - Never blocks the response — call it without awaiting.
 *   - Stores no personal data. The submitted URL is a public website address;
 *     no IP, no user agent, no session.
 */

export type ToolName = 'wordpress-detector' | 'shopify-detector' | 'seo-audit'

/** Keep a 90-day window; older entries are pruned opportunistically. */
const RETAIN_DAYS = 90

export type ToolErrorKind =
  | 'unreachable'      // the target site could not be fetched
  | 'blocked'          // fetched, but the site refused or returned a challenge
  | 'not_detected'     // fetched fine, nothing identifiable found
  | 'timeout'
  | 'internal'         // our bug

export function logToolError(
  tool: ToolName,
  kind: ToolErrorKind,
  targetUrl: string,
  detail?: unknown,
): void {
  void (async () => {
    try {
      const col = await getCollection('tool_errors')

      // Store the host only, not the full URL with any query string a user
      // may have pasted in.
      let host = ''
      try { host = new URL(targetUrl).host } catch { host = '' }

      await col.insertOne({
        tool,
        kind,
        host,
        message: detail instanceof Error ? detail.message : String(detail ?? '').slice(0, 300),
        at: new Date(),
      } as never)

      // Opportunistic prune — roughly 1 run in 50, so this costs nothing on a
      // normal request but the collection can never grow without bound.
      if (Math.random() < 0.02) {
        const cutoff = new Date(Date.now() - RETAIN_DAYS * 86400_000)
        await col.deleteMany({ at: { $lt: cutoff } } as never)
      }
    } catch {
      // Intentionally silent. This is diagnostics; it must never surface.
    }
  })()
}

/**
 * Failure counts by tool and kind for the last N days.
 * Used by the admin dashboard; returns [] rather than throwing.
 */
export async function getToolErrorSummary(days = 7) {
  try {
    const col = await getCollection('tool_errors')
    const since = new Date(Date.now() - days * 86400_000)
    return await col.aggregate([
      { $match: { at: { $gte: since } } },
      { $group: { _id: { tool: '$tool', kind: '$kind' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray()
  } catch (e) {
    console.error('[tool-errors] summary failed:', e)
    return []
  }
}
