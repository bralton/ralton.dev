# Story 9.5: Add Blog Post SEO and Open Graph

Status: done

## Story

As a **content creator**,
I want **each blog post to have proper SEO metadata**,
So that **posts are discoverable via search engines and display rich previews when shared**.

## Acceptance Criteria

1. **AC1: Meta tags present on blog posts**
   - Given a blog post exists
   - When search engines or social platforms fetch the page
   - Then the page includes meta title (post title + site name)
   - And meta description (post excerpt or auto-generated)
   - And Open Graph tags (og:title, og:description, og:image, og:type=article)
   - And Twitter card tags

2. **AC2: Featured image in social previews**
   - Given a post has a featured image
   - When the page is shared on social media
   - Then the featured image appears in the preview

3. **AC3: Default OG image fallback**
   - Given a post does not have a featured image
   - When the page is shared
   - Then a default OG image is used

4. **AC4: Sitemap includes blog posts**
   - Given blog posts exist
   - When the sitemap is generated
   - Then all published blog posts are included in sitemap.xml

## Tasks / Subtasks

**Note:** The majority of SEO implementation already existed from Stories 9.3 and 9.4. This story focused on verification and fixing a minor gap.

- [x] Task 1: Verify blog post SEO metadata (AC: #1, #2, #3)
  - [x] 1.1 Review `generateMetadata` in `/blog/[slug]/page.tsx` - confirmed all required tags present
  - [x] 1.2 Verify og:type is "article" for blog posts - VERIFIED
  - [x] 1.3 Verify meta title format includes site name - FIXED (was missing, now includes " | Ben Ralton")
  - [x] 1.4 Verify meta description uses excerpt with fallback - VERIFIED
  - [x] 1.5 Test Twitter card metadata (card type, title, description, image) - VERIFIED

- [x] Task 2: Verify featured image handling (AC: #2, #3)
  - [x] 2.1 Confirm featured image URL is absolute (required for OpenGraph) - VERIFIED (uses siteUrl prefix)
  - [x] 2.2 Verify fallback to `/og-image.png` when no featured image - VERIFIED
  - [x] 2.3 Confirm image dimensions are specified (1200x630 for OG) - VERIFIED

- [x] Task 3: Verify sitemap includes blog content (AC: #4)
  - [x] 3.1 Review `src/app/sitemap.ts` - confirmed all published posts included
  - [x] 3.2 Confirm categories and tags are in sitemap - VERIFIED (done in Story 9.4)
  - [x] 3.3 Verify lastModified dates are set correctly - VERIFIED (uses updatedAt)

- [x] Task 4: Fix identified gap (AC: #1)
  - [x] 4.1 Updated meta title to include site name suffix: `${post.title} | Ben Ralton`
  - [x] 4.2 Updated OpenGraph title to include site name suffix
  - [x] 4.3 Updated Twitter card title to include site name suffix
  - [x] 4.4 Canonical URLs already absolute - no change needed

## Dev Notes

### Verification Summary

**Blog Post SEO Metadata (`/blog/[slug]/page.tsx`):**

| Requirement | Status | Details |
|-------------|--------|---------|
| Meta title with site name | FIXED | Now `${post.title} \| Ben Ralton` |
| Meta description | VERIFIED | Uses `post.excerpt` with fallback |
| og:type | VERIFIED | Set to `article` |
| og:title | FIXED | Now includes site name |
| og:description | VERIFIED | Uses excerpt with fallback |
| og:image | VERIFIED | Featured image or default |
| og:url | VERIFIED | Absolute URL with siteUrl |
| og:siteName | VERIFIED | "Ben Ralton" |
| og:publishedTime | VERIFIED | Uses post.publishedAt |
| og:authors | VERIFIED | ["Ben Ralton"] |
| og:tags | VERIFIED | Tag names array |
| twitter:card | VERIFIED | "summary_large_image" |
| twitter:title | FIXED | Now includes site name |
| twitter:description | VERIFIED | Uses excerpt with fallback |
| twitter:images | VERIFIED | Featured image or default |
| canonical URL | VERIFIED | Absolute URL |

**Featured Image Handling:**
- Correctly checks if `featuredImage` is populated (not just ID)
- Converts relative URLs to absolute with `siteUrl` prefix
- Falls back to `${siteUrl}/og-image.png` when no featured image
- Specifies dimensions: 1200x630 (standard OG image size)

**Sitemap (`src/app/sitemap.ts`):**
- All published posts at `/blog/{slug}` with priority 0.8
- All categories at `/blog/category/{slug}` with priority 0.7
- All tags at `/blog/tag/{slug}` with priority 0.6
- Uses `updatedAt` for lastModified timestamps
- changeFrequency: monthly for posts, weekly for categories/tags

### Fix Applied

The only gap identified was the meta title format. Updated `generateMetadata` in `/blog/[slug]/page.tsx`:

```typescript
// Before:
title: post.title,
openGraph: { title: post.title, ... }
twitter: { title: post.title, ... }

// After:
title: `${post.title} | Ben Ralton`,
openGraph: { title: `${post.title} | Ben Ralton`, ... }
twitter: { title: `${post.title} | Ben Ralton`, ... }
```

This ensures search results and social previews display the site name, improving brand recognition.

### Dev Standards

See [CLAUDE.md](../../../../../CLAUDE.md) for accessibility patterns, naming conventions, and project structure.

### Project Structure Notes

**Files Modified:**
- `src/app/(frontend)/blog/[slug]/page.tsx` - Updated meta title format

**No new files created** - this was a verification + minor fix story.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-9-blog-platform.md#Story 9.5]
- [Source: _bmad-output/planning-artifacts/prd.md#FR46] - System generates SEO metadata for each blog post
- [Source: _bmad-output/planning-artifacts/prd.md#FR27-31] - SEO & Discovery requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#SEO & Discovery] - Meta tags, OG, sitemap patterns
- [Source: CLAUDE.md] - Project standards

### Previous Story Intelligence

**From Story 9.3 (Blog Post Page):**
- `generateMetadata` was implemented with comprehensive OpenGraph and Twitter metadata
- Featured image handling with fallback was already in place
- Canonical URLs were correctly set

**From Story 9.4 (Category/Tag Filtering):**
- Sitemap was updated to include all blog content dynamically
- Revalidation configured for all blog pages

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- No debugging required - straightforward verification and fix

### Completion Notes List

1. **Verification Complete**: All SEO requirements from FR46 verified as implemented in Stories 9.3 and 9.4

2. **Gap Identified and Fixed**: Meta title was missing site name suffix. Updated to include " | Ben Ralton" for:
   - `title` metadata property
   - `openGraph.title` property
   - `twitter.title` property

3. **Sitemap Verified**: All published blog posts, categories, and tags are included in sitemap.xml with appropriate lastModified dates and priorities

4. **Featured Image Handling Verified**:
   - Absolute URLs generated correctly
   - Fallback to default OG image works
   - Image dimensions specified (1200x630)

### File List

**Modified:**
- src/app/(frontend)/blog/[slug]/page.tsx (meta title format fix)

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-03-12 | Verified SEO implementation from Stories 9.3 and 9.4. Fixed meta title to include site name suffix. | Claude Opus 4.5 |
