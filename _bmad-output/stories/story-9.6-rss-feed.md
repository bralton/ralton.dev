# Story 9.6: Create RSS Feed

Status: done

## Story

As a **visitor**,
I want **an RSS feed of blog posts**,
So that **I can subscribe and receive updates in my RSS reader**.

## Acceptance Criteria

1. **AC1: Valid RSS 2.0 XML feed at /api/rss**
   - Given I navigate to `/api/rss`
   - When the request is processed
   - Then I receive a valid RSS 2.0 XML feed
   - And the response includes proper `Content-Type: application/rss+xml` header
   - And the feed generates within 3 seconds

2. **AC2: Complete post metadata in feed items**
   - Given published posts exist
   - When the RSS feed is generated
   - Then each post includes title, description (excerpt), pubDate, link, and author
   - And posts are ordered by published date (newest first)

3. **AC3: RSS link discoverable on blog pages**
   - Given I am on the blog listing or post pages
   - When I look for the RSS link
   - Then I can find a link to subscribe via RSS

## Tasks / Subtasks

- [x] Task 1: Create RSS API route (AC: #1, #2)
  - [x] 1.1 Create `/src/app/api/rss/route.ts` with GET handler
  - [x] 1.2 Query published posts from Payload CMS, sorted by publishedAt desc
  - [x] 1.3 Generate valid RSS 2.0 XML with proper structure
  - [x] 1.4 Set `Content-Type: application/rss+xml; charset=utf-8` header
  - [x] 1.5 Include feed metadata: title, description, link, language, lastBuildDate
  - [x] 1.6 For each post: title, description (excerpt with fallback), pubDate, link, guid, author

- [x] Task 2: Add RSS link discovery (AC: #3)
  - [x] 2.1 Add `<link rel="alternate" type="application/rss+xml">` to blog layout head
  - [x] 2.2 Add visible RSS icon/link to blog listing page (near heading)
  - [x] 2.3 Add RSS icon/link to blog post pages (in metadata area)

- [x] Task 3: Performance and caching (AC: #1)
  - [x] 3.1 Ensure feed generates under 3 seconds (query limited posts, no heavy processing)
  - [x] 3.2 Add appropriate caching headers (`Cache-Control`, `s-maxage`)
  - [x] 3.3 Test with curl or browser to verify Content-Type and response time

## Dev Notes

### RSS 2.0 XML Structure

The feed should follow the RSS 2.0 specification:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben Ralton's Blog</title>
    <link>https://ralton.dev/blog</link>
    <description>Technical articles and insights on software development, DevOps, and cloud infrastructure.</description>
    <language>en-us</language>
    <lastBuildDate>RFC 2822 date format</lastBuildDate>
    <atom:link href="https://ralton.dev/api/rss" rel="self" type="application/rss+xml"/>

    <item>
      <title>Post Title</title>
      <link>https://ralton.dev/blog/post-slug</link>
      <description><![CDATA[Post excerpt or generated description]]></description>
      <pubDate>RFC 2822 date format</pubDate>
      <guid isPermaLink="true">https://ralton.dev/blog/post-slug</guid>
      <author>ben@ralton.dev (Ben Ralton)</author>
    </item>
    <!-- more items -->
  </channel>
</rss>
```

### Implementation Pattern

Follow existing API route patterns from `/api/contact/route.ts`:

```typescript
// src/app/api/rss/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50, // Reasonable limit for RSS
    depth: 0,  // No deep population needed
  })

  // Generate XML...
  const xml = generateRssFeed(posts.docs)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

### Date Formatting

RSS requires RFC 2822 date format. Use JavaScript's `toUTCString()` or a helper:

```typescript
// RFC 2822: "Tue, 12 Mar 2026 14:30:00 GMT"
function toRfc2822(date: string | Date): string {
  return new Date(date).toUTCString()
}
```

### XML Escaping

Excerpt content must be properly escaped or wrapped in CDATA:
- Use `<![CDATA[content]]>` for description to safely include HTML entities
- Escape `&`, `<`, `>` in title and other text elements

### RSS Link in HTML Head

Add to blog layout metadata:

```typescript
// In blog layout or page metadata
export const metadata: Metadata = {
  // ... existing metadata
  alternates: {
    types: {
      'application/rss+xml': '/api/rss',
    },
  },
}
```

This generates: `<link rel="alternate" type="application/rss+xml" href="/api/rss">`

### Visible RSS Link Component

Create a simple RSS link component or inline it:

```tsx
// Example inline approach
<a
  href="/api/rss"
  className="flex items-center gap-1.5 text-text-secondary hover:text-teal-700 transition-colors"
  title="Subscribe via RSS"
>
  <Rss className="h-4 w-4" aria-hidden="true" />
  <span className="sr-only">Subscribe via RSS</span>
</a>
```

Use the `Rss` icon from `lucide-react` (already installed).

### Dev Standards

See [CLAUDE.md](../../../../../CLAUDE.md) for accessibility patterns, naming conventions, and project structure.

### Project Structure Notes

**New Files:**
- `src/app/api/rss/route.ts` - RSS feed API endpoint

**Modified Files:**
- `src/app/(frontend)/blog/page.tsx` - Add RSS link to listing page
- `src/app/(frontend)/blog/[slug]/page.tsx` - Add RSS link to post pages (optional, may use layout)
- `src/app/(frontend)/blog/layout.tsx` - Add RSS alternate link in metadata (if layout exists, otherwise in pages)

### Performance Considerations

- Query limited posts (50 max for feed) to ensure fast generation
- Use `depth: 0` in Payload query (no deep population needed for RSS)
- Add caching headers to reduce server load
- Feed should generate well under 3 seconds even with 50 posts

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-9-blog-platform.md#Story 9.6]
- [Source: _bmad-output/planning-artifacts/prd.md#FR45] - Visitors can subscribe to blog content via RSS feed
- [Source: _bmad-output/planning-artifacts/prd.md#NFR31] - RSS feed generates within 3 seconds of request
- [Source: _bmad-output/planning-artifacts/architecture.md#RSS Feed] - API route at /api/rss, RSS 2.0 XML
- [Source: CLAUDE.md] - Project standards and patterns

### Previous Story Intelligence

**From Story 9.5 (Blog Post SEO):**
- `generateMetadata` pattern established in blog pages
- Site URL retrieved from `process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'`
- Meta description uses post excerpt with fallback pattern

**From Stories 9.2-9.4:**
- Payload query pattern for published posts established
- `lucide-react` icons used throughout blog components
- Navigation/Footer layout pattern for blog pages

**From Git Intelligence:**
- Recent commits show blog feature implementation stable
- Posts collection has `excerpt`, `publishedAt`, `title`, `slug` fields available
- Site naming convention: "Ben Ralton" used consistently

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build verification: `npx next build` completed successfully
- TypeScript check: `npx tsc --noEmit` passed with no errors
- Prettier formatting: Applied to all modified files

### Completion Notes List

- Task 1: Created `/src/app/api/rss/route.ts` with valid RSS 2.0 XML generation
  - Queries published posts from Payload CMS sorted by publishedAt desc (limit 50)
  - Returns proper `Content-Type: application/rss+xml; charset=utf-8` header
  - Includes Atom namespace for self-link
  - Uses CDATA for description content with special characters
  - Implements RFC 2822 date formatting via `toUTCString()`
  - Proper XML escaping for title and other text elements
  - Error handling with 500 response for failures

- Task 2: Added RSS link discovery to blog pages
  - Added `alternates.types['application/rss+xml']` to metadata in both blog listing and post pages
  - This generates `<link rel="alternate" type="application/rss+xml" href="/api/rss">` in HTML head
  - Added visible RSS icon (from lucide-react) next to Blog heading on listing page
  - Added RSS icon in post metadata area (next to date and reading time) on post pages
  - All links have proper accessibility: title attribute, sr-only text, focus states

- Task 3: Performance and caching implemented
  - Query limited to 50 posts with `depth: 0` (no deep population needed)
  - Cache-Control header: `public, s-maxage=3600, stale-while-revalidate=86400`
  - Build verified showing `/api/rss` route registered as dynamic

### File List

**New Files:**
- src/app/api/rss/route.ts

**Modified Files:**
- src/app/(frontend)/blog/page.tsx (added RSS import, alternates metadata, visible RSS link)
- src/app/(frontend)/blog/[slug]/page.tsx (added RSS import, alternates metadata, visible RSS link)

## Change Log

| Date | Change |
|------|--------|
| 2026-03-12 | Story implementation completed - RSS feed API route created, link discovery added to blog pages |
| 2026-03-12 | Code review fixes: Added `rounded` class to RSS links for consistent focus ring, added CDATA escape function for `]]>` edge case |
