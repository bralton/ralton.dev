# Story 6.4: Add Structured Data (Person Schema)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **search engine**,
I want **structured data about the portfolio owner**,
So that **rich results can be displayed** (FR30).

## Acceptance Criteria

1. **Given** JSON-LD structured data
   **When** I add Person schema to the homepage
   **Then** the schema includes: @type Person, name, jobTitle, url
   **And** optional fields: image, sameAs (social links), description

2. **Given** the JSON-LD script
   **When** rendered on the page
   **Then** it's placed in the head or body as a script tag
   **And** the JSON is valid and follows schema.org spec

3. **Given** sameAs property
   **When** social links are configured
   **Then** the sameAs array includes LinkedIn, GitHub URLs
   **And** URLs match the SocialLinks collection data

4. **Given** search engines
   **When** they crawl the page
   **Then** they can parse the structured data
   **And** rich results may display Ben's info in search

## Tasks / Subtasks

- [x] Task 1: Create JSON-LD component (AC: #1, #2)
  - [x] Create `src/components/PersonStructuredData.tsx` as server component
  - [x] Fetch Hero data (name, headline) from Payload
  - [x] Fetch About data (description) from Payload
  - [x] Fetch visible SocialLinks from Payload for sameAs array
  - [x] Build Person schema object following schema.org spec
  - [x] Render as `<script type="application/ld+json">`

- [x] Task 2: Integrate component into homepage (AC: #2)
  - [x] Add PersonStructuredData to `src/app/(frontend)/page.tsx`
  - [x] Place inside the `<>` fragment, before or after Navigation

- [x] Task 3: Validate JSON-LD output (AC: #2, #4)
  - [x] Run `next build` and check build output
  - [x] Find `<script type="application/ld+json">` in output
  - [x] Verify JSON is valid (no syntax errors)
  - [x] Use Google Rich Results Test or Schema Markup Validator

- [x] Task 4: Test with real data (AC: #1, #3)
  - [x] Verify name and jobTitle match Hero content
  - [x] Verify sameAs array contains LinkedIn and GitHub URLs
  - [x] Verify URLs match visible SocialLinks from CMS
  - [x] Test with social links hidden - array should update accordingly

## Dev Notes

### Implementation Specification

**File to create:** `src/components/PersonStructuredData.tsx`

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

interface PersonSchema {
  '@context': 'https://schema.org'
  '@type': 'Person'
  name: string
  jobTitle?: string
  url: string
  description?: string
  image?: string
  sameAs?: string[]
}

export async function PersonStructuredData() {
  try {
    const payload = await getPayload({ config })
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

    // Fetch Hero for name and headline
    const heroData = await payload.findGlobal({ slug: 'hero' })

    // Fetch About for description
    const aboutData = await payload.findGlobal({ slug: 'about' })

    // Fetch visible social links for sameAs
    const socialLinks = await payload.find({
      collection: 'social-links',
      where: {
        isVisible: { equals: true },
        platform: { in: ['linkedin', 'github', 'twitter'] } // Exclude email
      },
      limit: 10,
    })

    // Build sameAs array from social links
    const sameAs = socialLinks.docs
      .filter(link => link.platform !== 'email')
      .map(link => link.url)

    // Build Person schema
    const personSchema: PersonSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: heroData?.name || 'Ben Ralton',
      url: siteUrl,
    }

    // Add optional fields if available
    if (heroData?.headline) {
      personSchema.jobTitle = heroData.headline
    }

    if (aboutData?.bio) {
      // Extract first sentence or limit to 160 chars for description
      const bio = typeof aboutData.bio === 'string'
        ? aboutData.bio
        : '' // Handle rich text if needed
      if (bio) {
        personSchema.description = bio.substring(0, 160)
      }
    }

    if (sameAs.length > 0) {
      personSchema.sameAs = sameAs
    }

    // Add image if og-image exists
    personSchema.image = `${siteUrl}/og-image.png`

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
    )
  } catch (error) {
    console.error('[PersonStructuredData] Failed to generate structured data:', error)
    return null
  }
}
```

**Integration in page.tsx:**

```typescript
import { PersonStructuredData } from '@/components/PersonStructuredData'

export default function HomePage() {
  return (
    <>
      <PersonStructuredData />
      <Navigation />
      {/* ... rest of page */}
    </>
  )
}
```

### Expected JSON-LD Output

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ben Ralton",
  "jobTitle": "Development & Operations",
  "url": "https://ralton.dev",
  "description": "Development & Operations professional...",
  "image": "https://ralton.dev/og-image.png",
  "sameAs": [
    "https://github.com/benralton",
    "https://linkedin.com/in/benralton"
  ]
}
```

### Schema.org Person Type Reference

Required properties:
- `@context`: Always "https://schema.org"
- `@type`: "Person"
- `name`: Full name

Recommended properties:
- `jobTitle`: Current job title or profession
- `url`: Canonical URL of the person's page
- `description`: Brief description
- `image`: URL to photo/avatar
- `sameAs`: Array of profile URLs (LinkedIn, GitHub, Twitter, etc.)

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

**File location:** `src/components/PersonStructuredData.tsx`
- Component file following project naming pattern (PascalCase)
- Server component (no "use client" directive) since it fetches from Payload

**Integration point:** `src/app/(frontend)/page.tsx`
- Add as first child inside the fragment
- Script tag will render in HTML body (acceptable per schema.org spec)

**Payload globals being accessed:**
- `hero` global - for name and headline
- `about` global - for description/bio

**Payload collection being accessed:**
- `social-links` collection - for sameAs URLs (filter out email platform)

### Architecture Compliance

From `architecture.md`:
- **SEO & Discovery (FR27-31):** Meta tags, Open Graph, sitemap, structured data, robots.txt
- **Structured data location:** JSON-LD in `app/(frontend)/page.tsx`

From project patterns:
- **Error handling:** Log full error server-side, graceful degradation (return null)
- **Naming:** Component files use PascalCase
- **Data fetching:** Server components query Payload directly

### Technology Notes

**JSON-LD placement:**
- Can be in `<head>` or `<body>` - both are valid per schema.org
- Placing in component renders it in body, which is fine
- Alternative: Use Next.js Metadata API's `other` property, but component approach is cleaner

**schema.org Person type:**
- Well-documented at https://schema.org/Person
- Google supports Person schema for knowledge panel and rich results
- LinkedIn and GitHub URLs in sameAs help establish identity connections

**Testing tools:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/
- Chrome DevTools → Elements → search for "ld+json"

### Previous Story Intelligence (from 6.3)

**Key learnings:**
- `NEXT_PUBLIC_SITE_URL` env var already exists and is working
- Payload data fetching pattern is established in components
- CI pipeline has SEO validation steps
- TypeScript types from schema.org can be defined inline

**Environment variable pattern:**
```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'
```

**SocialLinks collection pattern (from SocialLinks.tsx):**
```typescript
const socialLinks = await payload.find({
  collection: 'social-links',
  where: {
    isVisible: { equals: true },
  },
  sort: 'order',
  limit: 10,
})
```

### Git Intelligence Summary

Recent commits show Epic 6 progress:
- `b5ccd1f ci(seo): add sitemap.xml validation to CI pipeline` - CI validates SEO files
- `5f8dc89 feat(seo): add sitemap.xml generation` - Story 6.3 implementation
- `74d466e feat(seo): configure meta tags and page metadata` - Story 6.1 metadata pattern

The pattern for SEO-related commits: `feat(seo): description`

### Existing Code to Reference

**Layout metadata (src/app/(frontend)/layout.tsx:19-83):**
- Shows how metadata is structured
- `siteUrl` variable pattern established
- Open Graph and Twitter card configuration

**SocialLinks component (src/components/SocialLinks.tsx):**
- Shows Payload query pattern for social-links collection
- Filter by `isVisible: { equals: true }`
- Platform field for filtering (github, linkedin, twitter, email)

**Homepage (src/app/(frontend)/page.tsx):**
- Simple component structure
- Fragment wrapper pattern for multiple root elements

### Risk Assessment

**Risk Level:** Very Low

**Rationale:**
- Single file, ~50-70 lines of code
- Uses existing Payload fetch patterns
- JSON-LD is a standard, well-documented format
- No external dependencies
- Server component only (no client-side complexity)

**Potential Issues:**
- Rich text bio field may need extraction (handle gracefully)
- Social links may not exist yet in CMS (return empty array)
- Hero global may not exist (use fallback values)

### Testing Verification

**Local testing:**
1. Run `pnpm dev`
2. Navigate to `http://localhost:3000`
3. View page source (Ctrl+U / Cmd+U)
4. Search for `application/ld+json`
5. Verify JSON is present and valid

**Production testing:**
1. Deploy to Vercel preview
2. Access deployed URL
3. Use Google Rich Results Test with URL
4. Verify no errors in structured data

**Validation tools:**
- https://search.google.com/test/rich-results (Google's official tool)
- https://validator.schema.org/ (schema.org validator)
- Chrome DevTools → Console (check for JSON parsing errors)

### References

- [Source: _bmad-output/planning-artifacts/epic-6-seo-discovery.md#Story 6.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#SEO & Discovery]
- [Source: _bmad-output/planning-artifacts/prd.md#FR30]
- [Source: schema.org Person: https://schema.org/Person]
- [Source: Google Rich Results: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build validation confirmed JSON-LD output in `.next/server/app/index.html`
- TypeScript compilation passed with no errors

### Completion Notes List

- Created `PersonStructuredData.tsx` server component that fetches Hero, About, and SocialLinks data from Payload
- Implemented `extractTextFromRichText()` helper function to extract plain text from Lexical rich text structure for the description field
- Integrated component as first child in homepage fragment (renders before Navigation)
- Build output verified: JSON-LD contains all required and optional Person schema fields
- Email platform correctly filtered from sameAs array (only social profile URLs included)
- Graceful error handling: component returns null on failure, logs error server-side

**Known Issue to Address:**
- `pnpm build` command fails due to database migration step requiring DB connection
- Workaround: Use `npx next build` directly for build verification
- This should be documented/fixed in a future DevOps story

### File List

- `src/components/PersonStructuredData.tsx` (created)
- `src/app/(frontend)/page.tsx` (modified - added PersonStructuredData import and component)
- `pnpm-workspace.yaml` (modified - added packages field to fix pnpm workspace config)

### Change Log

- 2026-03-11: Implemented Person structured data (JSON-LD) for SEO rich results

