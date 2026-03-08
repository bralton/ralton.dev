/**
 * Preview Mode API Route
 *
 * Enables Next.js draft mode for previewing unpublished/draft content.
 * Used by Payload CMS admin panel to show content editors how changes
 * will look before publishing.
 *
 * Security:
 * - Requires PAYLOAD_PREVIEW_SECRET to prevent unauthorized access
 * - Secret validation before enabling draft mode
 */

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request): Promise<Response | never> {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || '/'

  // Verify secret to prevent unauthorized preview access
  const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET
  if (!previewSecret || secret !== previewSecret) {
    console.error('[Preview] Unauthorized access attempt')
    return new Response('Invalid token', { status: 401 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the path to preview
  redirect(slug)
}
