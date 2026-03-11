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
  // Skip revalidation in CI environment (no Next.js context available)
  if (process.env.CI) {
    return
  }

  try {
    revalidatePath('/')
    console.log('[Revalidate] Homepage cache invalidated')
  } catch (error) {
    // Log full error details server-side, but don't throw
    // This ensures CMS saves succeed even if revalidation fails
    console.error('[Revalidate] Failed to revalidate homepage:', error)
  }
}

/**
 * Revalidate blog-related caches.
 *
 * When blog content changes (posts, categories, tags), revalidates:
 * - /blog listing page
 * - Individual post pages via layout revalidation
 *
 * @param slug - Optional post slug for targeted revalidation
 * @returns Promise that resolves when revalidation completes (or fails gracefully)
 */
export async function revalidateBlog(slug?: string): Promise<void> {
  // Skip revalidation in CI environment (no Next.js context available)
  if (process.env.CI) {
    return
  }

  try {
    // Always revalidate the blog listing
    revalidatePath('/blog')

    // If a specific post slug is provided, revalidate that post
    if (slug) {
      revalidatePath(`/blog/${slug}`)
    }

    console.log('[Revalidate] Blog cache invalidated', slug ? `(post: ${slug})` : '')
  } catch (error) {
    // Log full error details server-side, but don't throw
    // This ensures CMS saves succeed even if revalidation fails
    console.error('[Revalidate] Failed to revalidate blog:', error)
  }
}
