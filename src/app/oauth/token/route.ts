import type { NextRequest } from 'next/server'
import { exchangeAuthorizationCode, exchangeRefreshToken, getResourceUrl } from '@/lib/mcp/oauth'

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
  Pragma: 'no-cache',
}

function oauthError(error: string, description: string) {
  return Response.json({ error, error_description: description }, { status: 400, headers: HEADERS })
}

/**
 * OAuth token endpoint for the blog MCP server.
 *
 * Public clients only (PKCE, no client secret). Supports the
 * `authorization_code` and `refresh_token` grants; refresh tokens rotate on
 * every use.
 */
export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type')
  if (!contentType?.includes('application/x-www-form-urlencoded')) {
    return oauthError('invalid_request', 'Content-Type must be application/x-www-form-urlencoded')
  }

  const form = await request.formData()
  const field = (name: string) => {
    const value = form.get(name)
    return typeof value === 'string' ? value : ''
  }

  const clientId = field('client_id')
  if (!clientId) return oauthError('invalid_request', 'client_id is required')

  const resource = field('resource')
  if (resource && resource !== getResourceUrl(request)) {
    return oauthError('invalid_target', 'Unknown resource')
  }

  try {
    switch (field('grant_type')) {
      case 'authorization_code': {
        const code = field('code')
        const codeVerifier = field('code_verifier')
        if (!code || !codeVerifier) {
          return oauthError('invalid_request', 'code and code_verifier are required')
        }

        const tokens = await exchangeAuthorizationCode({
          code,
          codeVerifier,
          clientId,
          redirectUri: field('redirect_uri') || undefined,
        })
        if (!tokens) return oauthError('invalid_grant', 'Authorization code is invalid or expired')

        console.log(`[MCP/OAuth] Tokens issued for client ${clientId}`)
        return Response.json(tokens, { headers: HEADERS })
      }

      case 'refresh_token': {
        const refreshToken = field('refresh_token')
        if (!refreshToken) return oauthError('invalid_request', 'refresh_token is required')

        const tokens = await exchangeRefreshToken({ refreshToken, clientId })
        if (!tokens) return oauthError('invalid_grant', 'Refresh token is invalid or expired')

        return Response.json(tokens, { headers: HEADERS })
      }

      default:
        return oauthError('unsupported_grant_type', 'Unsupported grant_type')
    }
  } catch (error) {
    console.error('[MCP/OAuth] Token request failed:', error)
    return Response.json(
      { error: 'server_error', error_description: 'Token request failed' },
      { status: 500, headers: HEADERS }
    )
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  })
}
