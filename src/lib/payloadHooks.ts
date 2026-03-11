/**
 * Payload CMS Hook Factories
 *
 * Reusable hooks for collections and globals that trigger Next.js
 * on-demand revalidation when content changes. These hooks ensure
 * the frontend reflects CMS updates without requiring a full rebuild.
 *
 * Hook Types:
 * - afterChange: Fires after document create or update
 * - afterDelete: Fires after document deletion
 *
 * All hooks return the doc to maintain the hook chain.
 */

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidateHomepage, revalidateBlog } from './revalidate'

/**
 * Collection afterChange hook that revalidates the homepage.
 * Use this for all collections that display content on the homepage.
 */
export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateHomepage()
  return doc
}

/**
 * Collection afterDelete hook that revalidates the homepage.
 * Use this for all collections that display content on the homepage.
 */
export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateHomepage()
  return doc
}

/**
 * Global afterChange hook that revalidates the homepage.
 * Use this for all globals that display content on the homepage.
 */
export const revalidateGlobalAfterChange: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidateHomepage()
  return doc
}

/**
 * Collection afterChange hook that revalidates blog pages.
 * Use this for Posts collection to revalidate blog listing and individual post.
 */
export const revalidateBlogAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateBlog(doc.slug)
  return doc
}

/**
 * Collection afterDelete hook that revalidates blog pages.
 * Use this for Posts collection to revalidate blog listing after deletion.
 */
export const revalidateBlogAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateBlog(doc.slug)
  return doc
}
