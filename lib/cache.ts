import { revalidatePath } from 'next/cache'

/**
 * Flush the cached public site.
 *
 * The public pages moved from `force-dynamic` to `revalidate = 3600`. That
 * removed a full MongoDB round trip from every visitor request and every
 * Googlebot crawl, but it means a save in the admin would otherwise take up to
 * an hour to appear. Calling this from any route that mutates published content
 * gives back the instant-update behaviour without the per-request cost.
 *
 * `revalidatePath('/', 'layout')` invalidates everything nested under the root
 * layout — the whole public site. Coarse on purpose: content here is small and
 * highly interlinked (a renamed page changes the nav on every other page), so
 * targeted invalidation would routinely miss things and serve stale
 * navigation. Regenerating on the next request is cheap.
 *
 * Never throws: a cache miss must not fail the admin's save.
 */
export function revalidateSite(): void {
  try {
    revalidatePath('/', 'layout')
    revalidatePath('/sitemap.xml')
  } catch (e) {
    console.error('[cache] revalidateSite failed:', e)
  }
}
