/**
 * Revalidation Helpers
 *
 * Utilities for triggering Next.js on-demand revalidation (ISR)
 * when Payload CMS content changes. Used by Payload hooks to ensure
 * the frontend reflects content updates without a full rebuild.
 *
 * Error Handling Strategy:
 * - Log failures with [Revalidate] prefix for Axiom filtering
 * - Never throw - revalidation failure should not block CMS saves
 */

import { revalidatePath } from 'next/cache'

/**
 * Revalidate the homepage cache.
 *
 * All portfolio content (Hero, About, Experience, Education, Projects, Skills)
 * is displayed on the homepage (/), so we only need to revalidate that path.
 *
 * @returns Promise that resolves when revalidation completes (or fails gracefully)
 */
export async function revalidateHomepage(): Promise<void> {
  try {
    revalidatePath('/')
    console.log('[Revalidate] Homepage cache invalidated')
  } catch (error) {
    // Log full error details server-side, but don't throw
    // This ensures CMS saves succeed even if revalidation fails
    console.error('[Revalidate] Failed to revalidate homepage:', error)
  }
}
