import { generateProtectedResourceMetadata, metadataCorsOptionsRequestHandler } from 'mcp-handler'
import { getBaseUrl, getResourceUrl, MCP_SCOPE } from '@/lib/mcp/oauth'

/**
 * OAuth Protected Resource Metadata (RFC 9728) for the blog MCP server.
 * Served at both the bare well-known path and the path-suffixed form
 * (/.well-known/oauth-protected-resource/api/mcp) that clients try first.
 */
export function GET(request: Request) {
  const metadata = generateProtectedResourceMetadata({
    authServerUrls: [getBaseUrl(request)],
    resourceUrl: getResourceUrl(request),
    additionalMetadata: {
      scopes_supported: [MCP_SCOPE],
      bearer_methods_supported: ['header'],
    },
  })

  return Response.json(metadata, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=3600',
    },
  })
}

export const OPTIONS = metadataCorsOptionsRequestHandler()
