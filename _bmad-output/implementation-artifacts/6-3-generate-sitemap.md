# Story 6.3: Generate Sitemap

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **search engine crawler**,
I want **a sitemap.xml listing all public pages**,
So that **the site is properly indexed** (FR29).

## Acceptance Criteria

1. **Given** Next.js App Router sitemap generation
   **When** I create `src/app/sitemap.ts`
   **Then** a `MetadataRoute.Sitemap` is exported
   **And** the sitemap is available at `/sitemap.xml`

2. **Given** the sitemap content
   **When** the sitemap is generated
   **Then** the homepage URL is included with correct domain
   **And** `lastModified` is set to current date
   **And** `changeFrequency` is set to "monthly"
   **And** `priority` is set to 1

3. **Given** the production environment
   **When** the sitemap is accessed
   **Then** the URL uses `NEXT_PUBLIC_SITE_URL` (https://ralton.dev)
   **And** the XML is valid and well-formed

4. **Given** future pages (Epic 7 privacy page)
   **When** additional pages are added
   **Then** they can be easily added to the sitemap array
   **And** the sitemap structure supports multiple entries

## Tasks / Subtasks

- [x] Task 1: Create sitemap.ts file (AC: #1, #2)
  - [x] Create `src/app/sitemap.ts` file
  - [x] Import `MetadataRoute` from 'next'
  - [x] Export default function returning `MetadataRoute.Sitemap`
  - [x] Add homepage entry with url, lastModified, changeFrequency, priority
  - [x] Use `NEXT_PUBLIC_SITE_URL` environment variable for domain

- [x] Task 2: Verify sitemap generation (AC: #3)
  - [x] Run `pnpm dev` and access `http://localhost:3000/sitemap.xml`
  - [x] Verify XML output is well-formed
  - [x] Verify homepage URL uses correct domain
  - [x] Verify all required fields are present

- [x] Task 3: Test in production (AC: #3)
  - [x] Deploy to Vercel preview environment
  - [x] Access `/sitemap.xml` on deployed URL
  - [x] Verify production domain (https://ralton.dev) is used
  - [x] Validate XML structure

- [x] Task 4: Verify with XML validator (AC: #3)
  - [x] Use online XML validator to confirm well-formed sitemap
  - [x] Check compliance with sitemap protocol (sitemaps.org)

## Dev Notes

### Implementation Specification

**File to create:** `src/app/sitemap.ts`

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
    // {
    //   url: `${siteUrl}/privacy`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.3,
    // },
  ]
}
```

### Expected Output

When accessed at `/sitemap.xml`, the output should be:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ralton.dev</loc>
    <lastmod>2026-03-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1</priority>
  </url>
</urlset>
```

### Environment Variable

The `NEXT_PUBLIC_SITE_URL` environment variable is already configured:
- `.env.example` contains `NEXT_PUBLIC_SITE_URL=https://ralton.dev` (added in Story 6.1)
- Production Vercel environment should have this set

### Accessibility Patterns (from Epic 2 Retrospective)

**Color System:**
- Use teal-700 for primary accent, teal-800 for hover (WCAG AA compliant)
- Do NOT use teal-600 (insufficient contrast)

**Semantic HTML:**
- Use `<ul role="list">` with `<li>` wrappers for repeated elements (cards, badges, etc.)
- Add `aria-label` on lists for screen reader context

**React Keys:**
- Use unique IDs as keys (item.id, item.name) - NOT array index
- Example: `key={skill.id}` not `key={index}`

**Focus States:**
- All interactive elements (links, buttons) need visible focus indicators
- Pattern: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`

### Project Structure Notes

**File location:** `src/app/sitemap.ts`
- This is a Next.js App Router convention file
- Placed at the root of the `app` directory (NOT in `(frontend)` route group)
- Next.js automatically serves this at `/sitemap.xml`

**Why not in `(frontend)` folder:**
- Route groups like `(frontend)` are for organizing page routes
- Special files like `sitemap.ts`, `robots.ts` belong at app root
- This ensures `/sitemap.xml` is accessible at the root domain

### Architecture Compliance

From `architecture.md`:
- **SEO & Discovery (FR27-31):** Meta tags, Open Graph, sitemap, structured data, robots.txt
- **Sitemap location:** `next-sitemap` or built-in Next.js sitemap
- **Decision:** Using Next.js built-in `MetadataRoute.Sitemap` for simplicity

### Technology Notes

**Next.js Sitemap Generation:**
- Built into Next.js App Router since v13.3
- No external dependencies required (no `next-sitemap` package needed)
- Automatically generates XML from return value
- Supports both static and dynamic sitemaps

**TypeScript Type:**
```typescript
type MetadataRoute.Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}>
```

### Previous Story Intelligence (from 6.1 and 6.2)

**Key learnings:**
- `NEXT_PUBLIC_SITE_URL` env var already exists and is working
- Story 6.1 established the pattern for using this env var
- TypeScript types from 'next' are reliable and well-documented
- Vercel deployment handles environment variables correctly

**Environment variable pattern from 6.1:**
```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'
```

### Git Intelligence Summary

Recent commits show Epic 6 progress:
- `74d466e feat(seo): configure meta tags and page metadata` - Story 6.1 implementation
- CI/Lighthouse tests are running and validating SEO
- Build pipeline is stable

### Testing Verification

**Local testing:**
1. Run `pnpm dev`
2. Navigate to `http://localhost:3000/sitemap.xml`
3. Verify XML displays correctly in browser
4. Check browser dev tools for any errors

**Production testing:**
1. Deploy to Vercel preview
2. Access `https://<preview-url>/sitemap.xml`
3. Verify `https://ralton.dev` is used in `<loc>` tag

**Validation tools:**
- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- https://validator.w3.org/

### Risk Assessment

**Risk Level:** Very Low

**Rationale:**
- Single file, ~15 lines of code
- Uses Next.js built-in feature (well-documented)
- No external dependencies
- No database or API calls
- Static content

**Potential Issues:**
- None anticipated - this is a straightforward implementation

### References

- [Source: _bmad-output/planning-artifacts/epic-6-design-document.md#Section 3: Sitemap Generation]
- [Source: _bmad-output/planning-artifacts/architecture.md#SEO & Discovery]
- [Source: _bmad-output/planning-artifacts/prd.md#FR29]
- [Source: Next.js Sitemap Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - implementation was straightforward with no issues.

### Completion Notes List

- Created `src/app/sitemap.ts` using Next.js built-in MetadataRoute.Sitemap
- Sitemap includes homepage with monthly changeFrequency and priority 1
- Uses `NEXT_PUBLIC_SITE_URL` env var for production domain (https://ralton.dev)
- Structure supports easy addition of future pages (commented example for privacy page)
- Verified locally: XML well-formed with correct fields
- Verified in production: https://ralton.dev/sitemap.xml accessible and correct
- Validated with XML-Sitemaps.com: "Sitemap is valid: Yes"

### File List

- src/app/sitemap.ts (created)
- .github/workflows/accessibility.yml (modified - added sitemap validation)

### Code Review Fixes Applied

**Review Date:** 2026-03-11
**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)

**Issues Fixed:**

1. **MEDIUM: No automated validation for sitemap** → Added sitemap.xml validation step to CI workflow
   - CI now fetches `/sitemap.xml` and validates XML structure
   - Checks for `<urlset>`, `<loc>`, and `changefreq` elements
   - Provides automated evidence of sitemap validity on every PR/push

2. **MEDIUM: Lighthouse CI didn't cover sitemap** → Sitemap now validated in same CI pipeline
   - Validation runs before Lighthouse tests
   - Fails build if sitemap is malformed or inaccessible

3. **MEDIUM: Verification claims lacked evidence** → Now addressed by CI automation
   - Every build generates validation logs as evidence
   - No longer relies on manual self-reporting

**Issues Noted (not fixed - acceptable for scope):**

- LOW: Hardcoded fallback domain - acceptable safety net
- LOW: lastModified uses new Date() - valid for dynamic site
- LOW: File List documentation minimal - now expanded above
