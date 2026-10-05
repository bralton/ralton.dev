/**
 * Blog post visibility
 *
 * A post is live when its status is `published` and its publish date has
 * arrived. Setting a future `publishedAt` on a published post schedules it:
 * it stays hidden from every public page, feed and sitemap until then.
 *
 * Pages that list posts are cached, so they also re-check on a timer
 * (`export const revalidate = 600` in each page) to pick a scheduled post up
 * within about ten minutes of its time.
 */

import type { Where } from 'payload'

/** Query conditions for posts the public may see right now. */
export function livePostsWhere(): Where {
  return {
    and: [
      { status: { equals: 'published' } },
      {
        or: [
          { publishedAt: { less_than_equal: new Date().toISOString() } },
          { publishedAt: { exists: false } },
        ],
      },
    ],
  }
}
