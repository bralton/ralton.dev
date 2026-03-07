# Story 2.2: Create About Section with Payload Collection

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to see an about section with Ben's background and specialties**,
So that **I can understand his expertise and focus areas** (FR2).

## Acceptance Criteria

1. **AC1: Payload About Global Configuration**
   - **Given** the Payload CMS is configured
   - **When** I create the About global
   - **Then** the global has fields for: bio (rich text), photo (upload), highlights (array of strings)
   - **And** the photo field accepts image uploads
   - **And** the global is editable via Payload admin

2. **AC2: AboutSection Component Displays Content**
   - **Given** the About global exists with content
   - **When** a visitor loads the homepage
   - **Then** the AboutSection component displays the bio text
   - **And** the photo displays with proper aspect ratio
   - **And** highlights display as a list or badges

3. **AC3: Photo Optimization**
   - **Given** the about section has a photo
   - **When** the section renders
   - **Then** the image uses Next.js Image component for optimization (NFR7)
   - **And** the image has descriptive alt text (FR34, NFR18)
   - **And** the image lazy loads with blur placeholder

4. **AC4: Mobile Responsive Layout**
   - **Given** responsive design requirements
   - **When** viewed on mobile
   - **Then** the layout stacks vertically (photo above or below bio)
   - **And** text remains readable at 16px minimum

5. **AC5: Desktop Responsive Layout**
   - **Given** viewed on desktop
   - **When** the section renders
   - **Then** photo and bio can display side-by-side
   - **And** section uses max-width container (1200px)

6. **AC6: Accessibility Requirements**
   - **Given** accessibility requirements
   - **When** the section renders
   - **Then** the section has a proper heading (H2) with id for navigation
   - **And** semantic HTML is used throughout (NFR20)
   - **And** screen readers can access all content (FR33)

## Tasks / Subtasks

- [x] Task 1: Create About Global in Payload CMS (AC: #1)
  - [x] 1.1: Create `src/collections/About.ts` global configuration file
  - [x] 1.2: Define `bio` field as rich text using Lexical editor
  - [x] 1.3: Define `photo` field as upload relationship to Media collection
  - [x] 1.4: Define `highlights` array field with text items
  - [x] 1.5: Register global in `src/payload.config.ts` globals array
  - [x] 1.6: Run `pnpm generate:types` to update payload-types.ts
  - [x] 1.7: Verify global appears in Payload admin at /admin

- [x] Task 2: Create AboutSection Component (AC: #2, #4, #5)
  - [x] 2.1: Create `src/components/AboutSection.tsx` as a Server Component
  - [x] 2.2: Fetch About global data using Payload local API
  - [x] 2.3: Add section with id="about" for navigation anchor
  - [x] 2.4: Render H2 heading "About" with proper styling
  - [x] 2.5: Render bio using RichText component from Payload
  - [x] 2.6: Implement responsive grid: single column mobile, side-by-side desktop
  - [x] 2.7: Apply max-width 1200px container with proper padding
  - [x] 2.8: Ensure 64px vertical section spacing per UX spec

- [x] Task 3: Implement Photo Display with Next.js Image (AC: #3)
  - [x] 3.1: Import Next.js Image component
  - [x] 3.2: Extract photo URL from Media relationship
  - [x] 3.3: Display image with proper aspect ratio (square or 3:4 portrait recommended)
  - [x] 3.4: Add descriptive alt text from global or fallback "Ben Ralton profile photo"
  - [x] 3.5: Configure lazy loading with blur placeholder
  - [x] 3.6: Add rounded corners for polished appearance

- [x] Task 4: Display Highlights as Badges (AC: #2)
  - [x] 4.1: Import Badge component from shadcn/ui
  - [x] 4.2: Map highlights array to Badge components
  - [x] 4.3: Style badges with dark green accent (teal-700)
  - [x] 4.4: Use flex-wrap layout for responsive badge display

- [x] Task 5: Integrate AboutSection into Homepage (AC: #2)
  - [x] 5.1: Import AboutSection into `src/app/(frontend)/page.tsx`
  - [x] 5.2: Add AboutSection below HeroSection
  - [x] 5.3: Verify content displays from Payload global

- [x] Task 6: Add Seed Data for Testing (AC: #1, #2)
  - [x] 6.1: Access Payload admin at /admin
  - [x] 6.2: Navigate to About global
  - [x] 6.3: Add test bio content with rich text formatting
  - [x] 6.4: Upload a test profile photo
  - [x] 6.5: Add 3-5 highlight strings
  - [x] 6.6: Verify content displays on homepage

- [x] Task 7: Accessibility Testing (AC: #6)
  - [x] 7.1: Verify H2 heading with id="about" for navigation
  - [x] 7.2: Verify image has descriptive alt text
  - [x] 7.3: Verify rich text renders with semantic HTML
  - [x] 7.4: Run accessibility audit (Firefox Accessibility Inspector or axe)
  - [x] 7.5: Verify screen reader can access all content

## Dev Notes

### Previous Story Intelligence (Story 2.1 Complete)

**What was established in Story 2.1:**
- Hero global created with pattern: `GlobalConfig` type, slug, fields array
- HeroSection component as Server Component using `getPayload({ config })` and `payload.findGlobal()`
- Responsive layout: 70vh mobile, 85vh desktop using Tailwind responsive prefixes
- Color system: `teal-700` for primary, `teal-800` for hover (WCAG AA compliant)
- Button styling uses shadcn Button with variant overrides
- CSS classes use `text-foreground`, `text-text-secondary` for consistent theming

**Key files from Story 2.1 (reference patterns):**
- `src/collections/Hero.ts` - Global configuration pattern
- `src/components/HeroSection.tsx` - Server component fetching pattern
- `src/payload.config.ts` - Globals array registration

**Code Review Feedback Applied:**
- Use teal-700/800 for WCAG AA compliance (not teal-600)
- Consistent color approach (don't mix CSS vars with Tailwind colors in same component)
- Document auto-generated file changes

### Architecture Compliance

**CRITICAL: Follow these exact patterns from Architecture document:**

**Payload Global Pattern (same as Hero):**
```typescript
// src/collections/About.ts
import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  fields: [
    {
      name: 'bio',
      type: 'richText',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
```

**Component Data Fetching Pattern (same as HeroSection):**
```typescript
// src/components/AboutSection.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export async function AboutSection() {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({ slug: 'about' })

  return (
    // ... JSX
  )
}
```

**Rich Text Rendering:**
- Payload's Lexical editor stores rich text as JSON
- Use `RichText` component from `@payloadcms/richtext-lexical/react` OR serialize to HTML
- Alternative: Extract plain text if rich formatting not needed initially

**Media Relationship Pattern:**
- Photo field uses `relationTo: 'media'`
- Access URL via `about.photo?.url` or `about.photo?.filename`
- Media collection already exists from Epic 1

### Visual Design Requirements (from UX Specification)

**Color System (same as Hero):**
| Role | Color | Hex/Class |
|------|-------|-----------|
| Background | Near-black | `#09090b` |
| Primary (accent) | Dark green (teal) | `teal-700` |
| Primary Hover | Lighter green | `teal-800` |
| Text Primary | Off-white | `text-foreground` |
| Text Secondary | Light gray | `text-text-secondary` |

**Typography Scale:**
| Element | Desktop | Mobile | Weight |
|---------|---------|--------|--------|
| H2 (section heading) | 32px | 24px | 600 |
| Body (bio) | 16px | 16px | 400 |

**Layout Requirements:**
- Max content width: 1200px
- Section spacing: 64px vertical gaps
- Content padding: 16px mobile, 24px tablet, 32px desktop
- Photo/bio: Stack on mobile, side-by-side on desktop (lg:)

**Badge Styling:**
- Use shadcn Badge component
- Dark background with teal accent for highlights
- Consistent with tech stack badges from design system

### Technical Implementation Guide

**About Global Registration:**
```typescript
// src/payload.config.ts - ADD About to imports and globals
import { About } from './collections/About'

export default buildConfig({
  // ... existing config
  globals: [Hero, About],  // Add About to globals array
})
```

**AboutSection Component Structure:**
```typescript
// src/components/AboutSection.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function AboutSection() {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({ slug: 'about' })

  return (
    <section id="about" className="px-4 py-16 md:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-8 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]">
          About
        </h2>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Photo */}
          {about.photo && typeof about.photo !== 'number' && (
            <div className="relative aspect-square overflow-hidden rounded-lg lg:aspect-[3/4]">
              <Image
                src={about.photo.url || ''}
                alt={about.photo.alt || 'Ben Ralton profile photo'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}

          {/* Bio + Highlights */}
          <div className="flex flex-col justify-center">
            <div className="prose prose-invert max-w-none text-text-secondary">
              <RichText data={about.bio} />
            </div>

            {about.highlights && about.highlights.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {about.highlights.map((highlight, index) => (
                  <Badge
                    key={highlight.id ?? index}
                    className="bg-teal-700 text-white hover:bg-teal-800"
                  >
                    {highlight.text}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Homepage Integration:**
```typescript
// src/app/(frontend)/page.tsx
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      {/* Future sections will be added here */}
    </main>
  )
}
```

### Project Structure Notes

**Files to Create:**
- `src/collections/About.ts` - About global configuration

**Files to Create:**
- `src/components/AboutSection.tsx` - About section component

**Files to Modify:**
- `src/payload.config.ts` - Add About global to globals array
- `src/app/(frontend)/page.tsx` - Add AboutSection component

**Auto-generated Files (will be modified by Payload):**
- `src/payload-types.ts` - After running `pnpm generate:types`
- `src/app/(payload)/admin/importMap.js` - Payload admin imports

### Rich Text Considerations

**Option 1: Use Payload's RichText component (recommended)**
```typescript
import { RichText } from '@payloadcms/richtext-lexical/react'
// Renders Lexical JSON directly
<RichText data={about.bio} />
```

**Option 2: Serialize to HTML if custom styling needed**
```typescript
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical'
// Convert and render as HTML
```

**Option 3: Start with plain text field if rich text adds complexity**
- Change `bio` to `type: 'textarea'` initially
- Upgrade to richText later if formatting needed

The recommendation is to start with Option 1 (RichText component) as it provides the most straightforward implementation.

### Testing This Story

After completion, verify:

1. **Payload Admin:** Navigate to /admin -> About global appears in sidebar
2. **Content Entry:** Can create/edit about content with all fields (bio, photo, highlights)
3. **Homepage Display:** Visit homepage -> About section displays below Hero
4. **Desktop Layout:** Photo and bio side-by-side, max-width 1200px
5. **Mobile Layout:** Content stacks vertically, photo full-width
6. **Image Optimization:** Verify Next.js Image component used (check network tab for optimized format)
7. **Accessibility:**
   - H2 has id="about" for anchor navigation
   - Image has alt text
   - Screen reader can access all content
8. **Lighthouse:** Run audit, accessibility score should be 100

### CRITICAL WARNINGS

**DO NOT:**
- Create nested folders for components (keep flat in `src/components/`)
- Use client-side data fetching for About data (use Server Component)
- Hardcode content - all content must come from Payload global
- Skip the id="about" attribute on section (needed for navigation)
- Use raw img tag instead of Next.js Image component
- Forget to run `pnpm generate:types` after creating the global
- Use inline styles when Tailwind classes exist

**DO:**
- Use Payload's `findGlobal` API for data fetching (same pattern as Hero)
- Use Next.js Image component with proper sizes attribute
- Use shadcn Badge component for highlights
- Apply Tailwind responsive classes (lg:) for breakpoints
- Test on mobile viewport sizes
- Verify image alt text is present and descriptive
- Add the global to `globals` array in payload.config.ts (after Hero)

### Git Intelligence (Recent Commits)

Recent commits show established patterns:
```
ca1ad2e feat: add hero section with Payload CMS global
5d6d849 docs: complete epic 1 retrospective and mark epic done
bb956dd feat: add structured logging with Axiom transport
```

**Commit patterns established:**
- Commit messages use conventional format: `type: description`
- Types: `fix`, `feat`, `chore`, `docs`
- Keep commits focused on single concerns

**Recommended commits for this story:**
```
feat: add About global to Payload CMS
feat: create AboutSection component with responsive layout
```

### References

- [Source: architecture.md#Data Architecture] - Payload collections and globals
- [Source: architecture.md#Implementation Patterns & Consistency Rules] - Naming conventions
- [Source: ux-design-specification.md#Visual Design Foundation] - Color system, typography
- [Source: ux-design-specification.md#Component Strategy] - Hero/About Section specs
- [Source: ux-design-specification.md#Design Direction Decision] - Section order (About after Hero)
- [Source: epic-2-core-portfolio-content.md#Story 2.2] - Acceptance criteria
- [Source: prd.md#Functional Requirements] - FR2, FR33, FR34
- [Source: prd.md#Non-Functional Requirements] - NFR7, NFR18, NFR20
- [Source: 2-1-create-hero-section-with-payload-collection.md] - Previous story patterns and learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript compilation: passed without errors
- Payload types generated successfully

### Completion Notes List

- Created About global following the exact same pattern as Hero global from Story 2.1
- AboutSection component implemented as a Server Component using `getPayload({ config })` and `payload.findGlobal({ slug: 'about' })`
- RichText component from `@payloadcms/richtext-lexical/react` used for bio rendering
- Next.js Image component used with blur placeholder, lazy loading, and responsive sizes
- Responsive layout: single column on mobile (default), side-by-side grid on desktop (lg:grid-cols-2)
- Badge component from shadcn/ui used for highlights with teal-700/800 color scheme
- Section includes id="about" for anchor navigation
- H2 heading styled with responsive typography (24px mobile, 32px desktop)
- Max-width 1200px container with responsive padding (16px/24px/32px)
- 64px section spacing implemented with py-16

### Change Log

- 2026-03-07: Created About global configuration (AC1)
- 2026-03-07: Created AboutSection component with responsive layout (AC2, AC4, AC5)
- 2026-03-07: Implemented photo display with Next.js Image optimization (AC3)
- 2026-03-07: Added highlights badge display (AC2)
- 2026-03-07: Integrated AboutSection into homepage (AC2)
- 2026-03-07: Accessibility requirements implemented (AC6)

### File List

**New Files:**
- src/collections/About.ts
- src/components/AboutSection.tsx

**Modified Files:**
- src/payload.config.ts (added About global import and registration)
- src/app/(frontend)/page.tsx (added AboutSection import and usage)

**Auto-generated Files (modified by Payload):**
- src/payload-types.ts (About type definitions added)
- src/app/(payload)/admin/importMap.js (updated by Payload)

## Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.5
**Date:** 2026-03-07
**Outcome:** APPROVED with fixes applied

### Review Summary

All 6 Acceptance Criteria verified as implemented. Code review identified 4 issues (0 HIGH, 3 MEDIUM, 1 LOW) which were fixed during review.

### Issues Found and Fixed

| Severity | Issue | Fix Applied |
|----------|-------|-------------|
| MEDIUM | Missing explicit `loading="lazy"` attribute on Image component | Added `loading="lazy"` to Image component |
| MEDIUM | Missing ARIA accessibility attributes on section | Added `aria-labelledby="about-heading"` to section and `id="about-heading"` to h2 |
| MEDIUM | Highlights rendered as div instead of semantic list | Changed to `<ul role="list" aria-label="...">` with `<li>` wrapping each Badge |
| LOW | Hardcoded blur placeholder instead of dynamic generation | Kept as-is (acceptable for MVP, can be improved later) |

### Verification Checklist

- [x] AC1: Payload About Global Configuration - VERIFIED
  - bio field: richText, required
  - photo field: upload to media
  - highlights: array with text subfield
  - Global registered in payload.config.ts
- [x] AC2: AboutSection Component Displays Content - VERIFIED
  - RichText component renders bio
  - Photo displays with proper aspect ratio
  - Highlights display as badges in semantic list
- [x] AC3: Photo Optimization - VERIFIED
  - Next.js Image component used
  - Alt text with fallback present
  - Lazy loading enabled
  - Blur placeholder configured
- [x] AC4: Mobile Responsive Layout - VERIFIED
  - Grid defaults to single column
  - Content stacks vertically on mobile
- [x] AC5: Desktop Responsive Layout - VERIFIED
  - lg:grid-cols-2 for side-by-side layout
  - max-w-[1200px] container applied
- [x] AC6: Accessibility Requirements - VERIFIED
  - Section has id="about" for navigation
  - H2 heading with id for aria-labelledby
  - Semantic HTML (section, h2, ul, li)
  - Screen reader accessible with ARIA labels

### Pattern Consistency with Story 2.1 (HeroSection)

- [x] Same data fetching pattern: `getPayload({ config })` + `findGlobal()`
- [x] Same import structure for Payload config
- [x] Same color system: teal-700/teal-800
- [x] Same max-width container: 1200px
- [x] Same responsive padding pattern: px-4 md:px-6 lg:px-8

### TypeScript Compilation

- [x] `pnpm exec tsc --noEmit` passes with no errors

### Files Modified During Review

- src/components/AboutSection.tsx (accessibility improvements)

