/**
 * RSS Feed API Route
 *
 * Generates a valid RSS 2.0 XML feed of published blog posts.
 * Feed items include title, description, pubDate, link, guid, and author.
 *
 * Features:
 * - Valid RSS 2.0 XML with Atom namespace
 * - CDATA wrapping for content with special characters
 * - RFC 2822 date formatting
 * - Caching headers for performance
 * - Generates within 3 seconds (NFR31)
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Post } from '@/payload-types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'
const FEED_LIMIT = 50 // Reasonable limit for RSS feed

/**
 * Converts a date to RFC 2822 format required by RSS 2.0.
 * Example: "Thu, 12 Mar 2026 14:30:00 GMT"
 */
function toRfc2822(date: string | Date): string {
  return new Date(date).toUTCString()
}

/**
 * Escapes XML special characters for safe inclusion in XML elements.
 * Used for title and other text elements (not CDATA-wrapped content).
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Escapes CDATA content by replacing ]]> with ]]]]><![CDATA[>
 * This is the standard way to include ]]> inside a CDATA section.
 */
function escapeCdata(text: string): string {
  return text.replace(/]]>/g, ']]]]><![CDATA[>')
}

/**
 * Generates a description for a post, falling back to a generic message.
 * The returned string is safe for use in CDATA sections.
 */
function getDescription(post: Post): string {
  const description = post.excerpt || `Read "${post.title}" on Ben Ralton's blog.`
  return escapeCdata(description)
}

/**
 * Generates RSS 2.0 XML from an array of posts.
 */
function generateRssFeed(posts: Post[]): string {
  const lastBuildDate =
    posts.length > 0 && posts[0].publishedAt
      ? toRfc2822(posts[0].publishedAt)
      : toRfc2822(new Date())

  const items = posts
    .filter((post) => post.publishedAt) // Only include posts with publishedAt
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`
      const pubDate = toRfc2822(post.publishedAt!)
      const description = getDescription(post)

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${postUrl}</guid>
      <author>ben@ralton.dev (Ben Ralton)</author>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben Ralton's Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Technical articles and insights on software development, DevOps, and cloud infrastructure.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const posts = await payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
      },
      sort: '-publishedAt',
      limit: FEED_LIMIT,
      depth: 0, // No deep population needed for RSS
    })

    const xml = generateRssFeed(posts.docs)

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[RSS] Error generating feed:', error)
    return new Response('Error generating RSS feed', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
