import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { MCP_SCOPE, RESOURCE_METADATA_PATH, verifyAccessToken } from '@/lib/mcp/oauth'
import { registerBlogTools } from '@/lib/mcp/tools'

/**
 * Blog MCP server (Streamable HTTP)
 *
 * Lets Claude create and edit blog post drafts. Every request needs an OAuth
 * access token issued by /oauth/token; without one the response is a 401 that
 * points Claude at the discovery metadata so it can start the sign-in flow.
 */
const mcpHandler = createMcpHandler(registerBlogTools, {
  serverInfo: { name: 'ralton-dev-blog', version: '1.0.0' },
  instructions:
    'Drafts blog posts for ralton.dev. Everything written here is a draft; the site owner publishes from the admin panel.',
})

const handler = withMcpAuth(
  mcpHandler,
  async (_request, bearerToken) => {
    if (!bearerToken) return undefined

    const grant = await verifyAccessToken(bearerToken)
    if (!grant) return undefined

    return {
      token: bearerToken,
      clientId: grant.clientId,
      scopes: [MCP_SCOPE],
      expiresAt: grant.expiresAt,
    }
  },
  {
    required: true,
    requiredScopes: [MCP_SCOPE],
    resourceMetadataPath: RESOURCE_METADATA_PATH,
  }
)

export { handler as GET, handler as POST, handler as DELETE }
