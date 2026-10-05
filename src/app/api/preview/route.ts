/**
 * Preview Mode API Route
 *
 * Enables Next.js draft mode for previewing unpublished/draft content.
 * Used by Payload CMS admin panel to show content editors how changes
 * will look before publishing.
 *
 * Security:
 * - Requires a signed-in Payload admin (the preview pane loads this route in
 *   the admin's own browser, so the session cookie is present), or
 *   PAYLOAD_PREVIEW_SECRET for links opened outside the admin panel
 * - Only redirects to paths on this site
 */

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request): Promise<Response | never> {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || '/'

  // Verify the caller before enabling draft mode
  const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET
  const hasSecret = Boolean(previewSecret) && secret === previewSecret
  if (!hasSecret) {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      console.error('[Preview] Unauthorized access attempt')
      return new Response('Invalid token', { status: 401 })
    }
  }

  // Only ever redirect within this site
  if (!slug.startsWith('/') || slug.startsWith('//') || slug.includes('\\')) {
    return new Response('Invalid slug', { status: 400 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the path to preview
  redirect(slug)
}
