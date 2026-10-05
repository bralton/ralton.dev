import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  type AuthorizationRequest,
  createAuthorizationCode,
  getBaseUrl,
  getResourceUrl,
  isAllowedRedirectUri,
  isValidClientId,
  signConsent,
  verifyConsent,
} from '@/lib/mcp/oauth'

/**
 * OAuth consent screen for the blog MCP server.
 *
 * GET renders the approve/deny screen, POST records the decision. Both need a
 * signed-in Payload admin, and the middleware restricts this path to the
 * admin IP allowlist, so only the site owner can mint access.
 *
 * SECURITY: Nothing is redirected to a redirect_uri until it has passed the
 * allowlist. The decision is handed back with a meta refresh rather than a
 * 302 because the site's CSP (`form-action 'self'`) blocks cross-origin
 * redirects that follow a form submission.
 */

const HTML_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function page(title: string, body: string, head = ''): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)} | ralton.dev</title>
${head}
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 16px;
    box-sizing: border-box; background: #f8fafc; color: #0f172a;
    font-family: Inter, system-ui, -apple-system, sans-serif; line-height: 1.5; }
  main { width: 100%; max-width: 440px; background: #fff; border: 1px solid #e2e8f0;
    border-radius: 12px; padding: 28px; box-sizing: border-box; }
  h1 { font-size: 1.25rem; margin: 0 0 12px; }
  p { margin: 0 0 12px; }
  dl { margin: 16px 0; padding: 12px 14px; background: #f1f5f9; border-radius: 8px; font-size: 0.875rem; }
  dt { color: #475569; }
  dd { margin: 0 0 8px; font-family: 'JetBrains Mono', ui-monospace, monospace; word-break: break-all; }
  dd:last-child { margin-bottom: 0; }
  .note { font-size: 0.875rem; color: #475569; }
  .actions { display: flex; gap: 12px; margin-top: 20px; }
  button, a.button { flex: 1; padding: 10px 16px; border-radius: 8px; font: inherit; font-weight: 600;
    cursor: pointer; text-align: center; text-decoration: none; box-sizing: border-box; }
  button:focus, a:focus { outline: none; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #0f766e; }
  .primary { background: #0f766e; color: #fff; border: 1px solid #0f766e; }
  .primary:hover { background: #115e59; }
  .secondary { background: #fff; color: #0f172a; border: 1px solid #cbd5e1; }
  .secondary:hover { background: #f1f5f9; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f172a; color: #f1f5f9; }
    main { background: #1e293b; border-color: #334155; }
    dl { background: #0f172a; }
    dt, .note { color: #cbd5e1; }
    .secondary { background: #1e293b; color: #f1f5f9; border-color: #475569; }
    .secondary:hover { background: #334155; }
    button:focus, a:focus { box-shadow: 0 0 0 2px #1e293b, 0 0 0 4px #2dd4bf; }
  }
</style>
</head>
<body><main>${body}</main></body>
</html>`
}

function errorPage(message: string): Response {
  return new Response(
    page('Connection failed', `<h1>Connection failed</h1><p>${escapeHtml(message)}</p>`),
    { status: 400, headers: HTML_HEADERS }
  )
}

/** Sends the browser back to the client with the outcome in the query string. */
function returnToClient(redirectUri: string, params: Record<string, string>): Response {
  const url = new URL(redirectUri)
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value)
  }
  const target = escapeHtml(url.toString())

  return new Response(
    page(
      'Returning to Claude',
      `<h1>Returning to Claude…</h1>
<p class="note">If nothing happens, continue manually.</p>
<div class="actions"><a class="button primary" href="${target}">Continue</a></div>`,
      `<meta http-equiv="refresh" content="0;url=${target}">`
    ),
    { headers: HTML_HEADERS }
  )
}

type Parsed = { ok: true; request: AuthorizationRequest } | { ok: false; response: Response }

/**
 * Validates an authorization request. Problems with the client or redirect
 * URI are shown to the user; anything else is reported back to the client.
 */
function parseAuthorizationRequest(resourceUrl: string, get: (name: string) => string): Parsed {
  const request: AuthorizationRequest = {
    clientId: get('client_id'),
    redirectUri: get('redirect_uri'),
    codeChallenge: get('code_challenge'),
    state: get('state'),
    scope: get('scope'),
    resource: get('resource'),
  }

  if (!isValidClientId(request.clientId)) {
    return { ok: false, response: errorPage('The client_id is missing or is not an https URL.') }
  }
  if (!isAllowedRedirectUri(request.redirectUri)) {
    return {
      ok: false,
      response: errorPage('The redirect_uri is not one this server sends authorisation codes to.'),
    }
  }

  const reject = (error: string, description: string): Parsed => ({
    ok: false,
    response: returnToClient(request.redirectUri, {
      error,
      error_description: description,
      state: request.state,
    }),
  })

  if (get('response_type') !== 'code') {
    return reject('unsupported_response_type', 'response_type must be code')
  }
  if (
    get('code_challenge_method') !== 'S256' ||
    !/^[A-Za-z0-9_-]{43}$/.test(request.codeChallenge)
  ) {
    return reject('invalid_request', 'An S256 PKCE code_challenge is required')
  }
  if (request.resource && request.resource !== resourceUrl) {
    return reject('invalid_target', 'Unknown resource')
  }

  return { ok: true, request }
}

async function getAdminUser(request: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  return user
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const parsed = parseAuthorizationRequest(
    getResourceUrl(request),
    (name) => searchParams.get(name) ?? ''
  )
  if (!parsed.ok) return parsed.response

  const user = await getAdminUser(request)
  if (!user) {
    // Sign in to the admin first, then come straight back to this screen
    const returnTo = `/oauth/authorize?${searchParams.toString()}`
    return Response.redirect(
      `${getBaseUrl(request)}/admin/login?redirect=${encodeURIComponent(returnTo)}`,
      302
    )
  }

  const { request: authRequest } = parsed
  const isLoopback = authRequest.redirectUri.startsWith('http://')
  const hidden = Object.entries({
    response_type: 'code',
    client_id: authRequest.clientId,
    redirect_uri: authRequest.redirectUri,
    code_challenge: authRequest.codeChallenge,
    code_challenge_method: 'S256',
    state: authRequest.state,
    scope: authRequest.scope,
    resource: authRequest.resource,
    consent: signConsent(user.id, authRequest),
  })
    .map(([name, value]) => `<input type="hidden" name="${name}" value="${escapeHtml(value)}">`)
    .join('\n')

  return new Response(
    page(
      'Connect Claude',
      `<h1>Connect Claude to your blog?</h1>
<p>This lets the app below list your posts and create or edit <strong>drafts</strong>. It cannot publish or delete anything.</p>
<dl>
  <dt>App</dt><dd>${escapeHtml(new URL(authRequest.clientId).host)}</dd>
  <dt>Sends you back to</dt><dd>${escapeHtml(new URL(authRequest.redirectUri).host)}</dd>
  <dt>Signed in as</dt><dd>${escapeHtml(user.email)}</dd>
</dl>
<p class="note">Only approve if you just started connecting Claude yourself.${
        isLoopback
          ? ' This request returns to an app running on this computer, such as Claude Code.'
          : ''
      } You can revoke access at any time under MCP Connections in the admin panel.</p>
<form method="post" action="/oauth/authorize">
${hidden}
<div class="actions">
  <button class="secondary" type="submit" name="decision" value="deny">Deny</button>
  <button class="primary" type="submit" name="decision" value="approve">Approve</button>
</div>
</form>`
    ),
    { headers: HTML_HEADERS }
  )
}

export async function POST(request: NextRequest) {
  // Same-origin form posts only
  const origin = request.headers.get('origin')
  if (origin && origin !== getBaseUrl(request)) {
    return errorPage('This request did not come from the consent screen.')
  }

  const form = await request.formData()
  const parsed = parseAuthorizationRequest(getResourceUrl(request), (name) => {
    const value = form.get(name)
    return typeof value === 'string' ? value : ''
  })
  if (!parsed.ok) return parsed.response
  const { request: authRequest } = parsed

  const user = await getAdminUser(request)
  if (!user) return errorPage('Your admin session has expired. Start the connection again.')

  const consent = form.get('consent')
  if (typeof consent !== 'string' || !verifyConsent(consent, user.id, authRequest)) {
    return errorPage('This consent screen has expired. Start the connection again.')
  }

  if (form.get('decision') !== 'approve') {
    return returnToClient(authRequest.redirectUri, {
      error: 'access_denied',
      error_description: 'The site owner denied the request',
      state: authRequest.state,
    })
  }

  try {
    const code = await createAuthorizationCode(user.id, authRequest)
    return returnToClient(authRequest.redirectUri, { code, state: authRequest.state })
  } catch (error) {
    console.error('[MCP/OAuth] Failed to record approval:', error)
    return returnToClient(authRequest.redirectUri, {
      error: 'server_error',
      error_description: 'Could not record the approval',
      state: authRequest.state,
    })
  }
}

export const dynamic = 'force-dynamic'
