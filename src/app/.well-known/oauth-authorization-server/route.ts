import { metadataCorsOptionsRequestHandler } from 'mcp-handler'
import { getAuthorizationServerMetadata } from '@/lib/mcp/oauth'

/**
 * OAuth Authorization Server Metadata (RFC 8414).
 * Tells Claude where to send the owner to approve a connection and where to
 * exchange codes for tokens.
 */
export function GET() {
  return Response.json(getAuthorizationServerMetadata(), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=3600',
    },
  })
}

export const OPTIONS = metadataCorsOptionsRequestHandler()
