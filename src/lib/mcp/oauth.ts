/**
 * OAuth 2.1 authorization server for the blog MCP server (/api/mcp)
 *
 * The site is its own authorization server so Claude (claude.ai, desktop,
 * mobile and Claude Code) can connect with nothing but the MCP URL:
 * - Clients identify themselves with a Client ID Metadata Document URL
 * - The site owner approves each connection at /oauth/authorize while signed
 *   in to the Payload admin
 * - Codes and tokens are random, stored only as SHA-256 hashes in the
 *   `mcp-grants` collection, and refresh tokens rotate on every use
 *
 * SECURITY: Authorization codes are only ever delivered to the redirect URIs
 * allowlisted below (Claude's hosted callback and the loopback callback Claude
 * Code declares). That is stricter than checking the client's own metadata
 * document, so the document is never fetched and there is no SSRF surface.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { getPublicOrigin } from 'mcp-handler'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

export const MCP_SCOPE = 'blog:drafts'

const CODE_TTL_MS = 5 * 60 * 1000
const ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000
const CONSENT_TTL_MS = 10 * 60 * 1000

const HOSTED_REDIRECT_URIS = [
  'https://claude.ai/api/mcp/auth_callback',
  'https://claude.com/api/mcp/auth_callback',
]
const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]']
const LOOPBACK_PATH = '/callback'

/**
 * The origin the request was made to (respecting proxy headers). Everything
 * OAuth advertises is built from it, so the issuer and resource always match
 * the host Claude is actually talking to.
 */
export function getBaseUrl(request: Request): string {
  return getPublicOrigin(request)
}

/** The MCP endpoint URL - must match what the user enters in Claude exactly. */
export function getResourceUrl(request: Request): string {
  return `${getBaseUrl(request)}/api/mcp`
}

export const RESOURCE_METADATA_PATH = '/.well-known/oauth-protected-resource/api/mcp'

export function getAuthorizationServerMetadata(request: Request) {
  const base = getBaseUrl(request)
  return {
    issuer: base,
    authorization_endpoint: `${base}/oauth/authorize`,
    token_endpoint: `${base}/oauth/token`,
    scopes_supported: [MCP_SCOPE],
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    token_endpoint_auth_methods_supported: ['none'],
    code_challenge_methods_supported: ['S256'],
    client_id_metadata_document_supported: true,
  }
}

/**
 * Hosted Claude uses one fixed callback; Claude Code binds an ephemeral
 * loopback port, so loopback URIs match with the port ignored (RFC 8252 7.3).
 */
export function isAllowedRedirectUri(redirectUri: string): boolean {
  if (HOSTED_REDIRECT_URIS.includes(redirectUri)) return true

  let url: URL
  try {
    url = new URL(redirectUri)
  } catch {
    return false
  }

  return (
    url.protocol === 'http:' &&
    LOOPBACK_HOSTS.includes(url.hostname) &&
    url.pathname === LOOPBACK_PATH &&
    !url.search &&
    !url.hash &&
    !url.username &&
    !url.password
  )
}

/** Client IDs are Client ID Metadata Document URLs: https with a path. */
export function isValidClientId(clientId: string): boolean {
  try {
    const url = new URL(clientId)
    return url.protocol === 'https:' && url.pathname !== '/' && !url.hash
  } catch {
    return false
  }
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('base64url')
}

function newToken(): string {
  return randomBytes(32).toString('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB)
}

export interface AuthorizationRequest {
  clientId: string
  redirectUri: string
  codeChallenge: string
  state: string
  scope: string
  resource: string
}

/**
 * Signs the consent form so approval can only be submitted from a consent
 * screen this server rendered for this admin and this exact request (CSRF).
 */
export function signConsent(
  userId: number | string,
  request: AuthorizationRequest,
  expiresAt = Date.now() + CONSENT_TTL_MS
): string {
  const payload = JSON.stringify([
    userId,
    request.clientId,
    request.redirectUri,
    request.codeChallenge,
    request.state,
    request.scope,
    request.resource,
    expiresAt,
  ])
  const signature = createHmac('sha256', process.env.PAYLOAD_SECRET || '')
    .update(`mcp-consent:${payload}`)
    .digest('base64url')
  return `${expiresAt}.${signature}`
}

export function verifyConsent(
  token: string,
  userId: number | string,
  request: AuthorizationRequest
): boolean {
  const expiresAt = Number(token.split('.')[0])
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false
  return safeEqual(token, signConsent(userId, request, expiresAt))
}

/** Drop grants whose code was never exchanged or whose refresh token lapsed. */
async function deleteStaleGrants(payload: Payload): Promise<void> {
  const now = new Date().toISOString()
  await payload.delete({
    collection: 'mcp-grants',
    where: {
      or: [
        { refreshTokenExpiresAt: { less_than: now } },
        {
          and: [{ refreshTokenHash: { exists: false } }, { codeExpiresAt: { less_than: now } }],
        },
      ],
    },
  })
}

/** Records the owner's approval and returns a single-use authorization code. */
export async function createAuthorizationCode(
  userId: number,
  request: AuthorizationRequest
): Promise<string> {
  const payload = await getPayload({ config })
  await deleteStaleGrants(payload)

  const code = newToken()
  await payload.create({
    collection: 'mcp-grants',
    data: {
      clientId: request.clientId,
      redirectUri: request.redirectUri,
      user: userId,
      scope: MCP_SCOPE,
      codeHash: sha256(code),
      codeChallenge: request.codeChallenge,
      codeExpiresAt: new Date(Date.now() + CODE_TTL_MS).toISOString(),
    },
  })
  console.log(`[MCP/OAuth] Connection approved for client ${request.clientId}`)
  return code
}

export interface TokenResponse {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token: string
  scope: string
}

/** Issues a fresh access/refresh pair for a grant, replacing any previous pair. */
async function issueTokens(payload: Payload, grantId: number): Promise<TokenResponse> {
  const accessToken = newToken()
  const refreshToken = newToken()

  await payload.update({
    collection: 'mcp-grants',
    id: grantId,
    data: {
      codeHash: null,
      codeChallenge: null,
      codeExpiresAt: null,
      accessTokenHash: sha256(accessToken),
      accessTokenExpiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_MS).toISOString(),
      refreshTokenHash: sha256(refreshToken),
      refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString(),
    },
  })

  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: ACCESS_TOKEN_TTL_MS / 1000,
    refresh_token: refreshToken,
    scope: MCP_SCOPE,
  }
}

/** Returns null when the code, client, redirect URI or PKCE verifier is wrong. */
export async function exchangeAuthorizationCode(params: {
  code: string
  codeVerifier: string
  clientId: string
  redirectUri?: string
}): Promise<TokenResponse | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mcp-grants',
    where: {
      codeHash: { equals: sha256(params.code) },
      codeExpiresAt: { greater_than: new Date().toISOString() },
    },
    limit: 1,
    depth: 0,
  })
  const grant = docs[0]
  if (!grant?.codeChallenge) return null

  if (grant.clientId !== params.clientId) return null
  if (params.redirectUri && grant.redirectUri !== params.redirectUri) return null
  if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(params.codeVerifier)) return null
  if (!safeEqual(sha256(params.codeVerifier), grant.codeChallenge)) return null

  return issueTokens(payload, grant.id)
}

/** Rotates the refresh token: the presented one stops working immediately. */
export async function exchangeRefreshToken(params: {
  refreshToken: string
  clientId: string
}): Promise<TokenResponse | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mcp-grants',
    where: {
      refreshTokenHash: { equals: sha256(params.refreshToken) },
      refreshTokenExpiresAt: { greater_than: new Date().toISOString() },
    },
    limit: 1,
    depth: 0,
  })
  const grant = docs[0]
  if (!grant || grant.clientId !== params.clientId) return null

  return issueTokens(payload, grant.id)
}

/** Resolves a bearer token to its grant, or undefined if unknown or expired. */
export async function verifyAccessToken(
  token: string
): Promise<{ clientId: string; expiresAt: number } | undefined> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mcp-grants',
    where: {
      accessTokenHash: { equals: sha256(token) },
      accessTokenExpiresAt: { greater_than: new Date().toISOString() },
    },
    limit: 1,
    depth: 0,
  })
  const grant = docs[0]
  if (!grant?.accessTokenExpiresAt) return undefined

  return {
    clientId: grant.clientId,
    expiresAt: Math.floor(new Date(grant.accessTokenExpiresAt).getTime() / 1000),
  }
}
