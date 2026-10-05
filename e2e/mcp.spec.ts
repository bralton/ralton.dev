import { test, expect } from '@playwright/test'

test.describe('Blog MCP server', () => {
  test('rejects unauthenticated requests with an OAuth challenge', async ({ request }) => {
    const response = await request.post('/api/mcp', {
      headers: { Accept: 'application/json, text/event-stream' },
      data: { jsonrpc: '2.0', id: 1, method: 'tools/list' },
    })

    expect(response.status()).toBe(401)
    expect(response.headers()['www-authenticate']).toContain(
      '/.well-known/oauth-protected-resource/api/mcp'
    )
  })

  test('rejects an unknown bearer token', async ({ request }) => {
    const response = await request.post('/api/mcp', {
      headers: {
        Accept: 'application/json, text/event-stream',
        Authorization: 'Bearer not-a-real-token',
      },
      data: { jsonrpc: '2.0', id: 1, method: 'tools/list' },
    })

    expect(response.status()).toBe(401)
  })

  test('serves protected resource metadata', async ({ request }) => {
    const response = await request.get('/.well-known/oauth-protected-resource/api/mcp')
    expect(response.status()).toBe(200)

    const metadata = await response.json()
    expect(metadata.resource).toMatch(/\/api\/mcp$/)
    expect(metadata.authorization_servers).toHaveLength(1)
  })

  test('serves authorization server metadata that enables CIMD with PKCE', async ({ request }) => {
    const response = await request.get('/.well-known/oauth-authorization-server')
    expect(response.status()).toBe(200)

    const metadata = await response.json()
    expect(metadata.authorization_endpoint).toMatch(/\/oauth\/authorize$/)
    expect(metadata.token_endpoint).toMatch(/\/oauth\/token$/)
    expect(metadata.client_id_metadata_document_supported).toBe(true)
    expect(metadata.token_endpoint_auth_methods_supported).toContain('none')
    expect(metadata.code_challenge_methods_supported).toEqual(['S256'])
  })

  test('token endpoint rejects an invalid authorization code', async ({ request }) => {
    const response = await request.post('/oauth/token', {
      form: {
        grant_type: 'authorization_code',
        code: 'not-a-real-code',
        code_verifier: 'a'.repeat(43),
        client_id: 'https://claude.ai/oauth/claude-code-client-metadata',
      },
    })

    expect(response.status()).toBe(400)
    expect((await response.json()).error).toBe('invalid_grant')
  })
})
