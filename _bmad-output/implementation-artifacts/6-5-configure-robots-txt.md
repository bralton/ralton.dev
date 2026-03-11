# Story 6.5: Configure robots.txt

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **search engine crawler**,
I want **a robots.txt file**,
So that **I know what to crawl** (FR31).

## Acceptance Criteria

1. **Given** robots.txt configuration
   **When** I create `/public/robots.txt`
   **Then** the file allows all crawlers by default
   **And** the sitemap URL is referenced

2. **Given** the robots.txt content
   **When** configured
   **Then** it includes `User-agent: *` and `Allow: /`
   **And** it includes `Sitemap: https://ralton.dev/sitemap.xml`

3. **Given** admin panel protection
   **When** configuring robots.txt
   **Then** `/admin` paths are disallowed (security consideration)
   **And** `/api/` routes are disallowed (not intended for crawling)

4. **Given** search engines
   **When** they visit `/robots.txt`
   **Then** the file is served correctly
   **And** crawlers follow the directives

## Tasks / Subtasks

- [x] Task 1: Create robots.txt file (AC: #1, #2, #3)
  - [x] Create `public/robots.txt` with standard structure
  - [x] Add `User-agent: *` directive for all crawlers
  - [x] Add `Allow: /` to permit crawling of public pages
  - [x] Add `Disallow: /admin` for admin panel protection
  - [x] Add `Disallow: /api/` for API routes protection
  - [x] Add `Sitemap: https://ralton.dev/sitemap.xml` directive

- [x] Task 2: Verify robots.txt accessibility (AC: #4)
  - [x] Run `pnpm dev` and navigate to `http://localhost:3000/robots.txt`
  - [x] Confirm file is served with correct content-type (text/plain)
  - [x] Verify all directives are present and correctly formatted

- [x] Task 3: Validate sitemap reference (AC: #1, #4)
  - [x] Confirm `/sitemap.xml` is accessible (dependency from Story 6.3)
  - [x] Verify sitemap URL in robots.txt uses production domain
  - [x] Test that sitemap URL resolves correctly

## Dev Notes

### Implementation Specification

**File to create:** `public/robots.txt`

This is a **static file** implementation - the simplest approach as recommended in the Epic 6 design document. No TypeScript/Next.js code required.

```text
# robots.txt for ralton.dev

User-agent: *
Allow: /

# Disallow admin panel and API routes
Disallow: /admin
Disallow: /api/

# Sitemap location
Sitemap: https://ralton.dev/sitemap.xml
```

**Why static over dynamic:**
- The Epic 6 design document recommends static `public/robots.txt` for simplicity
- No environment-specific content needed (sitemap URL is hardcoded to production domain)
- Next.js serves files from `/public` directly at the root path
- No build step or runtime overhead

### Architecture Compliance

From `architecture.md`:
- **SEO & Discovery (FR27-31):** Meta tags, Open Graph, sitemap, structured data, robots.txt
- **robots.txt location:** `public/robots.txt`

```
└── public/
    ├── favicon.ico
    ├── og-image.png              # Open Graph default
    └── robots.txt                # ← This story
```

**File placement:** Static files in `/public` are served at root URL by Next.js App Router.

### Sitemap Dependency (Story 6.3 - DONE)

The sitemap is already implemented at `src/app/sitemap.ts` and accessible at `/sitemap.xml`.

**Current sitemap.ts implementation:**
```typescript
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Privacy page will be added in Epic 7 (Story 7.1)
  ]
}
```

The robots.txt Sitemap directive should use the production domain `https://ralton.dev/sitemap.xml`.

### robots.txt Directive Reference

| Directive | Purpose |
|-----------|---------|
| `User-agent: *` | Applies rules to all crawlers |
| `Allow: /` | Explicitly allow root and all paths (default behavior) |
| `Disallow: /admin` | Block crawling of Payload CMS admin panel |
| `Disallow: /api/` | Block crawling of API routes (not content) |
| `Sitemap:` | Point crawlers to sitemap location |

### Security Considerations

**Why disallow `/admin`:**
- Payload CMS admin panel is at `/admin`
- No SEO value in indexing admin pages
- Reduces attack surface visibility (security through obscurity layer)

**Why disallow `/api/`:**
- API routes return JSON, not HTML content
- Not useful for search indexing
- Reduces unnecessary crawler load on API endpoints

**Note:** These `Disallow` directives are recommendations, not security controls. Malicious actors will ignore robots.txt. The admin panel is still protected by Payload authentication.

### Previous Story Intelligence (from 6.4)

**Key learnings:**
- `NEXT_PUBLIC_SITE_URL` env var is set to `https://ralton.dev`
- Epic 6 SEO stories follow commit pattern: `feat(seo): description`
- CI pipeline validates SEO files
- Static files in `/public` work without issues

**Build verification pattern:**
- Run `pnpm dev` for local testing
- Files in `/public` are served directly without build step

### Git Intelligence Summary

Recent Epic 6 commits:
- `8153234 fix(seo): improve Person schema description truncation`
- `6d427f4 feat(seo): add Person structured data (JSON-LD) for rich results`
- `b5ccd1f ci(seo): add sitemap.xml validation to CI pipeline`
- `5f8dc89 feat(seo): add sitemap.xml generation`
- `74d466e feat(seo): configure meta tags and page metadata`

**Commit message pattern for this story:** `feat(seo): configure robots.txt`

### Testing Verification

**Local testing:**
1. Run `pnpm dev`
2. Navigate to `http://localhost:3000/robots.txt`
3. Verify file content matches specification
4. Check content-type is `text/plain`

**Production testing:**
1. Deploy to Vercel (automatic via PR)
2. Navigate to `https://ralton.dev/robots.txt`
3. Verify sitemap URL resolves: `https://ralton.dev/sitemap.xml`

**Validation tools:**
- Google Search Console (after deployment) - validates robots.txt parsing
- Browser DevTools Network tab - verify content-type header

### Risk Assessment

**Risk Level:** Very Low

**Rationale:**
- Single static file creation
- No code changes required
- No dependencies on external services
- No database interactions
- Standard robots.txt format

**Potential Issues:**
- None anticipated - this is the simplest story in Epic 6

### Accessibility Patterns (from Epic 2 Retrospective)

*Not applicable to this story - robots.txt is a machine-readable file, not user-facing UI.*

### Project Structure Notes

**File location:** `public/robots.txt`
- Follows Next.js convention for static assets
- Matches architecture.md specification
- No conflicts with existing files (verified: no robots.txt exists yet)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-6-seo-discovery.md#Story 6.5]
- [Source: _bmad-output/planning-artifacts/epic-6-design-document.md#Section 5: robots.txt]
- [Source: _bmad-output/planning-artifacts/architecture.md#SEO & Discovery]
- [Source: Google robots.txt spec: https://developers.google.com/search/docs/crawling-indexing/robots/intro]
- [Source: src/app/sitemap.ts - existing sitemap implementation]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Verified robots.txt served at localhost:3000/robots.txt with HTTP 200
- Confirmed Content-Type: text/plain; charset=UTF-8
- Confirmed sitemap.xml accessible at localhost:3000/sitemap.xml with HTTP 200

### Completion Notes List

- Created static robots.txt file following Epic 6 design document specification
- All directives implemented: User-agent, Allow, Disallow (admin, api), Sitemap
- Verified file accessibility via dev server with curl commands
- No TypeScript/JavaScript code changes required (static file only)
- No test framework configured in project; verification done via HTTP requests

### File List

- `public/robots.txt` (created)
- `.github/workflows/accessibility.yml` (modified - added robots.txt CI validation)

### Change Log

- 2026-03-11: Created public/robots.txt with standard SEO directives for search engine crawlers
- 2026-03-11: [Code Review] Added CI validation for robots.txt to match sitemap.xml validation pattern
