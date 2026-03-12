import { test, expect } from '@playwright/test'

test.describe('Blog RSS Feed', () => {
  test('returns valid XML with correct Content-Type', async ({ request }) => {
    const response = await request.get('/api/rss')

    expect(response.status()).toBe(200)

    const contentType = response.headers()['content-type']
    expect(contentType).toContain('application/rss+xml')
  })

  test('RSS feed contains required channel elements', async ({ request }) => {
    const response = await request.get('/api/rss')
    const xml = await response.text()

    // Check for RSS 2.0 structure
    expect(xml).toContain('<?xml version="1.0"')
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('<channel>')

    // Check for required channel elements
    expect(xml).toContain('<title>')
    expect(xml).toContain('<link>')
    expect(xml).toContain('<description>')
    expect(xml).toContain('<language>')
  })

  test('RSS feed contains blog post items', async ({ request }) => {
    const response = await request.get('/api/rss')
    const xml = await response.text()

    // Should have at least one item (seeded post)
    expect(xml).toContain('<item>')
    expect(xml).toContain('<title>')
    expect(xml).toContain('<link>')
    expect(xml).toContain('<pubDate>')
    expect(xml).toContain('<guid')
  })

  test('RSS feed items have correct link format', async ({ request }) => {
    const response = await request.get('/api/rss')
    const xml = await response.text()

    // Links should be absolute URLs to blog posts
    expect(xml).toMatch(/<link>https?:\/\/[^<]+\/blog\/[^<]+<\/link>/)
  })

  test('RSS feed includes author element', async ({ request }) => {
    const response = await request.get('/api/rss')
    const xml = await response.text()

    expect(xml).toContain('<author>')
  })

  test('RSS feed has Atom self-reference link', async ({ request }) => {
    const response = await request.get('/api/rss')
    const xml = await response.text()

    expect(xml).toContain('xmlns:atom=')
    expect(xml).toContain('atom:link')
    expect(xml).toContain('rel="self"')
  })

  test('RSS feed is well-formed XML', async ({ request }) => {
    const response = await request.get('/api/rss')
    const xml = await response.text()

    // Check basic XML well-formedness
    expect(xml).toMatch(/^<\?xml/)
    expect(xml).toContain('</rss>')
    expect(xml).toContain('</channel>')

    // Opening and closing tags should be balanced
    const openItems = (xml.match(/<item>/g) || []).length
    const closeItems = (xml.match(/<\/item>/g) || []).length
    expect(openItems).toBe(closeItems)
  })
})
