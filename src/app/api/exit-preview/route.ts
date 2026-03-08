/**
 * Exit Preview Mode API Route
 *
 * Disables Next.js draft mode and returns to viewing published content.
 * Provides a clean way for content editors to exit preview state.
 */

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request): Promise<never> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || '/'

  // Disable draft mode
  const draft = await draftMode()
  draft.disable()

  // Redirect back to the page
  redirect(slug)
}
