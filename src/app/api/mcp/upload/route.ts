import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sniffImage, UNSUPPORTED_IMAGE } from '@/lib/mcp/fetchImage'
import {
  markdownAlt,
  matchesGrant,
  MAX_UPLOAD_BYTES,
  verifyUploadToken,
} from '@/lib/mcp/imageUpload'
import { getBaseUrl } from '@/lib/mcp/oauth'

function error(status: number, message: string) {
  return Response.json({ error: message }, { status })
}

/**
 * Receives an image file for the blog's media library.
 *
 * SECURITY: This route is reachable without OAuth, because the client's shell
 * has no access to its OAuth token. It accepts a request only with an upload
 * token from the `create_image_upload` MCP tool, which is behind OAuth. The
 * token expires in minutes and is bound to one file's SHA-256, so the body
 * must be exactly the file the signed-in client asked to upload.
 */
export async function POST(request: NextRequest) {
  const [scheme, token] = request.headers.get('authorization')?.split(' ') ?? []
  const grant = scheme?.toLowerCase() === 'bearer' && token ? verifyUploadToken(token) : null
  if (!grant) return error(401, 'Upload token is missing, invalid or expired.')

  if (Number(request.headers.get('content-length') ?? 0) > MAX_UPLOAD_BYTES) {
    return error(413, 'The image is larger than 4 MB.')
  }

  const chunks: Buffer[] = []
  let size = 0
  const reader = request.body?.getReader()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_UPLOAD_BYTES) {
      await reader.cancel()
      return error(413, 'The image is larger than 4 MB.')
    }
    chunks.push(Buffer.from(value))
  }

  const data = Buffer.concat(chunks)
  if (!matchesGrant(grant, data)) {
    return error(403, 'This file is not the one the upload token was issued for.')
  }

  const type = sniffImage(data)
  if (!type) return error(415, UNSUPPORTED_IMAGE)

  try {
    const payload = await getPayload({ config })
    const media = await payload.create({
      collection: 'media',
      data: { alt: grant.alt },
      file: {
        data,
        mimetype: type.mimetype,
        name: `${grant.name}.${type.extension}`,
        size: data.length,
      },
    })
    console.log(`[MCP] Image uploaded: ${media.filename} (${media.id})`)

    return Response.json({
      id: media.id,
      filename: media.filename,
      width: media.width ?? null,
      height: media.height ?? null,
      url: media.url ? new URL(media.url, getBaseUrl(request)).toString() : null,
      markdown: `![${markdownAlt(grant.alt)}](media:${media.id})`,
    })
  } catch (cause) {
    console.error('[MCP] Image upload failed:', cause)
    return error(500, 'Could not store the image.')
  }
}
