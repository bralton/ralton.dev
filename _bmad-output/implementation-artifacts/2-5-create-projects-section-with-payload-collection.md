# Story 2.5: Create Projects Section with Payload Collection

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to see project entries with descriptions, tech stacks, and links**,
So that **I can evaluate Ben's work and technical skills** (FR5).

## Acceptance Criteria

1. **AC1: Payload Projects Collection Configuration**
   - **Given** the Payload CMS is configured
   - **When** I create the Projects collection
   - **Then** the collection has fields: title, description, techStack (array of strings), repoUrl (optional), liveUrl (optional), image (upload), isVisible (boolean, default true)
   - **And** entries can be created, edited, and deleted via admin

2. **AC2: ProjectsSection Component Displays Content**
   - **Given** the Projects collection has entries
   - **When** a visitor loads the homepage
   - **Then** only entries with isVisible=true are displayed
   - **And** the ProjectsSection component renders a grid of ProjectCard components
   - **And** each card shows title, description, tech stack badges, and links

3. **AC3: Tech Stack Badge Display**
   - **Given** tech stack display requirements
   - **When** a project card renders
   - **Then** tech stack items display as Badge components
   - **And** badges use the brand styling (dark background, green accents)

4. **AC4: Project Links with Accessibility**
   - **Given** project links exist
   - **When** a project has repoUrl or liveUrl
   - **Then** links display as icon buttons (GitHub icon, external link icon)
   - **And** links open in new tab with appropriate rel attributes
   - **And** links have accessible labels for screen readers

5. **AC5: Project Images with Optimization**
   - **Given** project images exist
   - **When** a project card renders
   - **Then** the image uses Next.js Image component (NFR7)
   - **And** images have descriptive alt text (FR34)
   - **And** images display with consistent aspect ratio (16:9)

6. **AC6: Responsive Grid Layout**
   - **Given** responsive design requirements
   - **When** viewed on mobile
   - **Then** project cards stack in single column
   - **When** viewed on tablet
   - **Then** project cards display in 2-column grid
   - **When** viewed on desktop
   - **Then** project cards display in 2-3 column grid

7. **AC7: Accessibility Requirements**
   - **Given** accessibility requirements
   - **When** the section renders
   - **Then** the section has H2 heading with id for navigation
   - **And** cards are keyboard navigable (FR32)
   - **And** hover states have visible focus equivalents (NFR19)

## Tasks / Subtasks

- [x] Task 1: Create Projects Collection in Payload CMS (AC: #1)
  - [x] 1.1: Create `src/collections/Projects.ts` collection file
  - [x] 1.2: Define fields: title (text, required), description (richText, required), techStack (array of text), repoUrl (text, optional), liveUrl (text, optional), image (upload, relationship to Media), isVisible (checkbox, defaultValue: true)
  - [x] 1.3: Configure defaultSort to order by createdAt descending (newest first)
  - [x] 1.4: Register collection in `src/payload.config.ts` collections array
  - [x] 1.5: Run `pnpm generate:types` to update payload-types.ts
  - [ ] 1.6: Verify collection appears in Payload admin at /admin [MANUAL]

- [x] Task 2: Create ProjectCard Component (AC: #2, #3, #4, #5, #7)
  - [x] 2.1: Create `src/components/ProjectCard.tsx` as a client component (for hover states)
  - [x] 2.2: Accept props: title, description (rich text), techStack (string[]), repoUrl (optional), liveUrl (optional), image (Media object)
  - [x] 2.3: Use shadcn Card component as base with image at top
  - [x] 2.4: Display project image using Next.js Image component with 16:9 aspect ratio
  - [x] 2.5: Display title as H3, description using RichText component
  - [x] 2.6: Render techStack as shadcn Badge components with teal accent styling
  - [x] 2.7: Add GitHub icon link for repoUrl (if present) using lucide-react
  - [x] 2.8: Add external link icon for liveUrl (if present) using lucide-react
  - [x] 2.9: Links open in new tab with rel="noopener noreferrer"
  - [x] 2.10: Add aria-label on links for screen reader accessibility
  - [x] 2.11: Add hover state with subtle border change (teal-700 accent)
  - [x] 2.12: Use semantic `<article>` wrapper for accessibility
  - [x] 2.13: Ensure card is keyboard focusable with visible focus ring

- [x] Task 3: Create ProjectsSection Component (AC: #2, #6, #7)
  - [x] 3.1: Create `src/components/ProjectsSection.tsx` as a Server Component
  - [x] 3.2: Fetch Projects collection using Payload local API with `where: { isVisible: { equals: true } }` and `sort: '-createdAt'`
  - [x] 3.3: Use depth: 1 to populate image relationship
  - [x] 3.4: Add section with id="projects" for navigation anchor
  - [x] 3.5: Render H2 heading "Projects" with proper styling and id="projects-heading"
  - [x] 3.6: Add aria-labelledby="projects-heading" to section
  - [x] 3.7: Use CSS Grid for responsive layout: 1 col mobile, 2 cols tablet (md:), 2-3 cols desktop (lg:)
  - [x] 3.8: Apply gap-6 between grid items
  - [x] 3.9: Apply max-width 1200px container with proper padding
  - [x] 3.10: Implement 64px vertical section spacing per UX spec
  - [x] 3.11: Return null if no visible projects (hide section entirely)

- [x] Task 4: Integrate ProjectsSection into Homepage (AC: #2)
  - [x] 4.1: Import ProjectsSection into `src/app/(frontend)/page.tsx`
  - [x] 4.2: Add ProjectsSection below EducationSection
  - [ ] 4.3: Verify content displays from Payload collection [MANUAL]

- [ ] Task 5: Add Seed Data for Testing (AC: #1, #2, #3, #5) [MANUAL - User Testing Required]
  - [ ] 5.1: Access Payload admin at /admin
  - [ ] 5.2: Navigate to Projects collection
  - [ ] 5.3: Create 2-3 test project entries with varied tech stacks
  - [ ] 5.4: Upload test images for projects via Media collection first
  - [ ] 5.5: Test visibility toggle (create one with isVisible=false)
  - [ ] 5.6: Verify grid layout on different viewport sizes

- [ ] Task 6: Accessibility Testing (AC: #4, #7) [MANUAL - User Testing Required]
  - [ ] 6.1: Verify H2 heading with id="projects" for navigation
  - [ ] 6.2: Test keyboard navigation between cards (Tab key)
  - [ ] 6.3: Verify focus indicators are visible (2px teal ring)
  - [ ] 6.4: Verify external links have aria-labels
  - [ ] 6.5: Test screen reader announces link purpose
  - [ ] 6.6: Run accessibility audit (Firefox Accessibility Inspector)
  - [ ] 6.7: Verify image alt text is descriptive

## Dev Notes

### Previous Story Intelligence (Story 2.4 Complete)

**Patterns established in Stories 2.1, 2.2, 2.3, and 2.4:**
- Collections use `CollectionConfig` type with slug, fields array, and defaultSort
- Server Components use `getPayload({ config })` and `payload.find({ collection: '...', where: {...} })`
- Color system: `teal-700` for primary accent, `teal-800` for hover (WCAG AA compliant)
- Responsive layout uses Tailwind prefixes: default mobile, `md:` tablet, `lg:` desktop
- Max-width 1200px container: `max-w-[1200px] mx-auto`
- Padding pattern: `px-4 md:px-6 lg:px-8`
- Section spacing: `py-16 md:py-24` for 64px+ vertical gaps
- Rich text uses `RichText` component from `@payloadcms/richtext-lexical/react`
- Accessibility: `id` on section, `aria-labelledby` pointing to heading `id`
- Card hover: `hover:border-teal-700` with `transition-colors`
- Focus ring: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`
- Empty state: Return `null` to hide section entirely (no "no items" message)

**Key files to reference (copy patterns from):**
- `src/collections/Experiences.ts` - Collection configuration pattern with isVisible checkbox
- `src/components/ExperienceCard.tsx` - Client component for cards with hover states
- `src/components/ExperienceSection.tsx` - Server component with collection fetching

**Code Review Fixes Applied in Previous Stories:**
- Use `prose prose-invert max-w-none text-text-secondary` for RichText (not `prose-sm`)
- Place `tabIndex={0}` on Card component, not on article wrapper
- Use `focus:` states instead of `focus-within:` for keyboard navigation
- Add `focus:outline-none` before focus ring classes

### Architecture Compliance

**Payload Collection Pattern (with image upload relationship):**
```typescript
// src/collections/Projects.ts
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'techStack', 'isVisible'],
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'repoUrl',
      type: 'text',
      admin: {
        description: 'GitHub repository URL',
      },
    },
    {
      name: 'liveUrl',
      type: 'text',
      admin: {
        description: 'Live demo or deployed site URL',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Project screenshot or thumbnail (16:9 aspect ratio recommended)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Toggle to show/hide this project on the site',
      },
    },
  ],
}
```

**Collection Data Fetching Pattern (with depth for relationships):**
```typescript
// Use payload.find() with depth for image population
const projects = await payload.find({
  collection: 'projects',
  where: {
    isVisible: { equals: true },
  },
  sort: '-createdAt',
  depth: 1, // Populate image relationship
})
// Access data via projects.docs (array of Project objects)
// Image accessed via project.image (populated Media object)
```

**Naming Conventions (from architecture.md):**
| Element | Convention | Example |
|---------|-----------|---------|
| Collection names | camelCase, singular for collection slug | `projects` |
| Field names | camelCase | `techStack`, `repoUrl`, `liveUrl`, `isVisible` |
| Boolean fields | `is` or `has` prefix | `isVisible` |

**Component Location:**
- `src/components/ProjectsSection.tsx` - Server Component (data fetching)
- `src/components/ProjectCard.tsx` - Client Component (hover states)
- Keep flat in `src/components/` - NO nested folders

### Visual Design Requirements (from UX Specification)

**Color System:**
| Role | Color | Hex/Class |
|------|-------|-----------|
| Background | Near-black | `#09090b` |
| Surface (cards) | Dark gray | `#18181b` / `bg-zinc-900` |
| Border | Subtle gray | `#27272a` / `border-zinc-800` |
| Primary (accent) | Dark green (teal) | `teal-700` |
| Primary Hover | Lighter green | `teal-800` |
| Text Primary | Off-white | `text-foreground` |
| Text Secondary | Light gray | `text-text-secondary` |
| Text Muted | Dim gray | `text-zinc-500` |

**Typography Scale:**
| Element | Desktop | Mobile | Weight |
|---------|---------|--------|--------|
| H2 (section heading) | 32px | 24px | 600 |
| H3 (card title) | 20px | 20px | 600 |
| Body (description) | 16px | 16px | 400 |
| Small (badges, metadata) | 14px | 14px | 400 |

**Badge Styling (tech stack):**
- Background: `bg-zinc-800` or `bg-teal-900/30`
- Text: `text-teal-400` or `text-foreground`
- Border: `border-teal-700/50`
- Use shadcn Badge component with variant="outline" or custom styling

**Card Layout (grid-based for projects):**
- Card padding: 16-24px internal
- Card hover: border color change to teal-700
- Image: 16:9 aspect ratio at top of card
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3`
- Gap: `gap-6`

### Technical Implementation Guide

**ProjectCard Component:**
```typescript
// src/components/ProjectCard.tsx
'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Github, ExternalLink } from 'lucide-react'
import type { Project, Media } from '@/payload-types'

interface ProjectCardProps {
  title: string
  description: Project['description']
  techStack: { technology: string }[]
  repoUrl?: string | null
  liveUrl?: string | null
  image?: Media | null
}

export function ProjectCard({
  title,
  description,
  techStack,
  repoUrl,
  liveUrl,
  image,
}: ProjectCardProps) {
  return (
    <article>
      <Card
        tabIndex={0}
        className="overflow-hidden border-zinc-800 bg-zinc-900 transition-colors hover:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
      >
        {image && typeof image !== 'number' && image.url && (
          <div className="relative aspect-video w-full">
            <Image
              src={image.url}
              alt={image.alt || `Screenshot of ${title} project`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-invert max-w-none text-text-secondary">
            <RichText data={description} />
          </div>

          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-teal-700/50 bg-teal-900/30 text-teal-400"
                >
                  {tech.technology}
                </Badge>
              ))}
            </div>
          )}

          {(repoUrl || liveUrl) && (
            <div className="flex gap-3">
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${title} source code on GitHub`}
                  className="text-zinc-400 transition-colors hover:text-teal-400"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${title} live demo`}
                  className="text-zinc-400 transition-colors hover:text-teal-400"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  )
}
```

**ProjectsSection Component:**
```typescript
// src/components/ProjectsSection.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { ProjectCard } from './ProjectCard'

export async function ProjectsSection() {
  const payload = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    where: {
      isVisible: { equals: true },
    },
    sort: '-createdAt',
    depth: 1, // Populate image relationship
  })

  if (projects.docs.length === 0) {
    return null // Hide section entirely if no visible projects
  }

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2
          id="projects-heading"
          className="mb-8 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
        >
          Projects
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {projects.docs.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              techStack={project.techStack || []}
              repoUrl={project.repoUrl}
              liveUrl={project.liveUrl}
              image={project.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Collection Registration:**
```typescript
// src/payload.config.ts - ADD to imports and collections
import { Projects } from './collections/Projects'

export default buildConfig({
  // ... existing config
  globals: [Hero, About],
  collections: [Users, Media, Experiences, Education, Projects],  // Add Projects
})
```

**Homepage Integration:**
```typescript
// src/app/(frontend)/page.tsx
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { EducationSection } from '@/components/EducationSection'
import { ProjectsSection } from '@/components/ProjectsSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      {/* Future sections: Skills, GitHub, Contact */}
    </main>
  )
}
```

### Project Structure Notes

**Files to Create:**
- `src/collections/Projects.ts` - Projects collection configuration
- `src/components/ProjectCard.tsx` - Individual project card (client component)
- `src/components/ProjectsSection.tsx` - Projects grid section (server component)

**Files to Modify:**
- `src/payload.config.ts` - Add Projects to collections array
- `src/app/(frontend)/page.tsx` - Add ProjectsSection component

**Auto-generated Files (will be modified by Payload):**
- `src/payload-types.ts` - After running `pnpm generate:types`
- `src/app/(payload)/admin/importMap.js` - Payload admin imports

### CRITICAL WARNINGS

**DO NOT:**
- Use `findGlobal` for Projects - this is a COLLECTION, use `find` with collection parameter
- Create nested folders for components (keep flat in `src/components/`)
- Use client-side data fetching for ProjectsSection (use Server Component)
- Hardcode project content - all content must come from Payload
- Skip the id="projects" attribute on section (needed for navigation)
- Forget the `'use client'` directive on ProjectCard (needed for hover states)
- Skip running `pnpm generate:types` after creating the collection
- Use `prose-sm` class (makes text smaller than UX spec)
- Use `focus-within:` instead of `focus:` states
- Place tabIndex on article element (should be on Card)
- Forget depth: 1 when fetching projects (image won't populate)
- Use `<img>` tag instead of Next.js `<Image>` component

**DO:**
- Use Payload's `find` API with `collection: 'projects'` for data fetching
- Use `where` clause to filter by `isVisible: { equals: true }`
- Use `depth: 1` to populate the image relationship
- Use `sort: '-createdAt'` for descending order (newest first)
- Use shadcn Card component as base for ProjectCard
- Use shadcn Badge component for tech stack items
- Use lucide-react for GitHub and ExternalLink icons
- Use Next.js Image component for optimized images
- Apply Tailwind responsive classes (md:, lg:, xl:) for grid breakpoints
- Use CSS Grid (not flexbox) for the projects layout
- Test on mobile viewport sizes
- Verify keyboard focus states work
- Add the collection to `collections` array in payload.config.ts
- Add aria-label on external links

### Git Intelligence (Recent Commits)

```
72fda26 feat: add Education section with Payload collection
1ed8e2d feat: add Work Experience section with Payload collection
e25d274 feat: add About section with Payload CMS global
ca1ad2e feat: add hero section with Payload CMS global
```

**Commit patterns established:**
- Commit messages use conventional format: `type: description`
- Types: `fix`, `feat`, `chore`, `docs`
- Keep commits focused on single concerns

**Recommended commits for this story:**
```
feat: add Projects collection to Payload CMS
feat: create ProjectsSection and ProjectCard components
```

### External Dependencies

**lucide-react icons (already installed):**
- `Github` - for repository links
- `ExternalLink` - for live demo links
- Import from `lucide-react` package

**Next.js Image component:**
- Import from `next/image`
- Use `fill` prop with container for aspect ratio control
- Use `sizes` prop for responsive image loading
- Use `object-cover` class for proper scaling

### References

- [Source: architecture.md#Data Architecture] - Payload collections structure, Projects fields
- [Source: architecture.md#Implementation Patterns & Consistency Rules] - Naming conventions, API patterns
- [Source: ux-design-specification.md#Visual Design Foundation] - Color system, typography, card styling
- [Source: ux-design-specification.md#Component Strategy] - Project Card specifications
- [Source: epic-2-core-portfolio-content.md#Story 2.5] - Full acceptance criteria
- [Source: prd.md#Functional Requirements] - FR5, FR32, FR34, NFR7
- [Source: 2-4-create-education-section-with-payload-collection.md] - Collection patterns, code review fixes

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript compilation verified: No errors
- pnpm generate:types executed successfully
- ESLint has pre-existing configuration issue (circular structure in config) - not related to this story

### Completion Notes List

- Created Projects collection with all required fields: title (text, required), description (richText, required), techStack (array of text), repoUrl (text, optional), liveUrl (text, optional), image (upload to media), isVisible (checkbox, default true)
- Collection uses defaultSort: '-createdAt' for newest-first ordering
- Created ProjectCard client component with: Next.js Image for 16:9 aspect ratio images, shadcn Card/Badge components, lucide-react icons (Github, ExternalLink), aria-labels for accessibility, focus ring and hover states per UX spec
- Created ProjectsSection server component with: Payload find() API with depth:1 for image population, isVisible filter, responsive CSS Grid (1/2/2-3 columns), proper section/heading IDs for navigation
- Integrated ProjectsSection into homepage below EducationSection
- All code follows established patterns from Stories 2.1-2.4
- Manual testing tasks (5 and 6) remain for user verification

### File List

**New Files:**
- src/collections/Projects.ts
- src/components/ProjectCard.tsx
- src/components/ProjectsSection.tsx

**Modified Files:**
- src/payload.config.ts (added Projects import and collection registration)
- src/app/(frontend)/page.tsx (added ProjectsSection import and component)

**Auto-generated Files (modified by Payload):**
- src/payload-types.ts (regenerated with Project type)

## Senior Developer Review (AI)

**Review Date:** 2026-03-07
**Reviewer:** Claude Opus 4.5 (Code Review Agent)
**Outcome:** APPROVED (with fixes applied)

### Issues Found and Fixed

**HIGH Severity (Fixed):**
1. **Missing focus styles on external links** (AC4, AC7, NFR19)
   - Location: `src/components/ProjectCard.tsx` lines 68-89
   - Problem: GitHub and live demo links had hover styles but no focus indicators for keyboard users
   - Fix: Added `focus:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 rounded` to both anchor tags

2. **Badge key using array index** (Code Quality)
   - Location: `src/components/ProjectCard.tsx` line 56
   - Problem: Using `key={index}` is an anti-pattern that can cause rendering issues
   - Fix: Changed to `key={tech.technology}` for stable keys

**MEDIUM Severity (Accepted):**
1. **Image prop type includes number for defensive coding**
   - Location: `src/components/ProjectCard.tsx` line 16
   - Analysis: Type `Media | number | null` includes `number` for unpopulated Payload references. Since `depth: 1` is always used, this is defensive. The type guard at line 33 handles it correctly.
   - Decision: Acceptable as-is for type safety

**LOW Severity (Not Fixed - Acceptable):**
1. **sprint-status.yaml modification not documented** - Infrastructure file, not application code
2. **Grid column redundancy (lg:grid-cols-2 = md:grid-cols-2)** - Works correctly, minor optimization opportunity

### Acceptance Criteria Verification

| AC | Status | Evidence |
|----|--------|----------|
| AC1: Payload Projects Collection | PASS | `src/collections/Projects.ts` has all required fields |
| AC2: ProjectsSection Component | PASS | Server component fetches visible projects and renders grid |
| AC3: Tech Stack Badges | PASS | Badge component with teal accent styling |
| AC4: Project Links with Accessibility | PASS (after fix) | aria-labels, rel attributes, focus indicators |
| AC5: Project Images with Optimization | PASS | Next.js Image with aspect-video, sizes, fill |
| AC6: Responsive Grid Layout | PASS | grid-cols-1/md:2/xl:3 |
| AC7: Accessibility Requirements | PASS (after fix) | Section id, aria-labelledby, focus states |

### Files Modified by Review

- `src/components/ProjectCard.tsx` - Added focus styles to links, fixed Badge keys

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-03-07 | Initial implementation of Projects section with Payload collection | Claude Opus 4.5 |
| 2026-03-07 | Code review: Fixed accessibility focus states on links, fixed Badge keys | Claude Opus 4.5 (Review) |
