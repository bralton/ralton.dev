/**
 * Direct image uploads for the blog MCP server.
 *
 * MCP tool calls cannot carry a file, so `create_image_upload` hands the client
 * a short-lived signed token and the client sends the bytes straight to
 * /api/mcp/upload. The token is the only credential for that request, so it is
 * kept narrow: it is issued only to an authenticated MCP client, it expires
 * after a few minutes, and it is bound to the SHA-256 of one specific file.
 * Whoever holds it can upload that exact file and nothing else.
 */

import { createHash, createHmac, timingSafeEqual } from 'crypto'

const UPLOAD_TTL_MS = 5 * 60 * 1000

/** Vercel rejects request bodies over 4.5 MB before they reach the function. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

export interface UploadGrant {
  alt: string
  name: string
  sha256: string
  expiresAt: number
}

function sign(payload: string): string {
  return createHmac('sha256', process.env.PAYLOAD_SECRET || '')
    .update(`mcp-upload:${payload}`)
    .digest('base64url')
}

export function createUploadToken(
  alt: string,
  name: string,
  sha256: string
): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + UPLOAD_TTL_MS
  const grant: UploadGrant = { alt, name, sha256: sha256.toLowerCase(), expiresAt }
  const payload = Buffer.from(JSON.stringify(grant)).toString('base64url')
  return { token: `${payload}.${sign(payload)}`, expiresAt }
}

export function verifyUploadToken(token: string): UploadGrant | null {
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null

  try {
    const grant = JSON.parse(Buffer.from(payload, 'base64url').toString()) as UploadGrant
    return grant.expiresAt > Date.now() ? grant : null
  } catch {
    return null
  }
}

/** Alt text made safe to sit inside `![...]`. */
export function markdownAlt(alt: string): string {
  return alt
    .replace(/[\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True when the uploaded bytes are the file the token was issued for. */
export function matchesGrant(grant: UploadGrant, data: Buffer): boolean {
  const actual = Buffer.from(createHash('sha256').update(data).digest('hex'))
  const expected = Buffer.from(grant.sha256)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
