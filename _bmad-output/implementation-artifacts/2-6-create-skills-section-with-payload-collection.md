# Story 2.6: Create Skills Section with Payload Collection

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to see a skills display showing technical competencies**,
So that **I can quickly identify Ben's capabilities** (FR6).

## Acceptance Criteria

1. **AC1: Payload Skills Collection Configuration**
   - **Given** the Payload CMS is configured
   - **When** I create the Skills collection
   - **Then** the collection has fields: name, category, isVisible (boolean, default true)
   - **And** entries can be created, edited, and deleted via admin
   - **And** categories allow grouping (e.g., "Languages", "Frameworks", "Tools")

2. **AC2: SkillsSection Component Displays Content**
   - **Given** the Skills collection has entries
   - **When** a visitor loads the homepage
   - **Then** only entries with isVisible=true are displayed
   - **And** the SkillsSection component groups skills by category
   - **And** each skill displays as a badge or tag

3. **AC3: Category Grouping with Subheadings**
   - **Given** skills are grouped by category
   - **When** the section renders
   - **Then** each category has a subheading (H3)
   - **And** skills within each category display as a flex-wrap list of badges

4. **AC4: Badge Styling Requirements**
   - **Given** styling requirements
   - **When** skill badges render
   - **Then** badges use consistent styling with tech stack badges (from Projects)
   - **And** the dark green accent (teal) is used appropriately

5. **AC5: Responsive Layout**
   - **Given** responsive design requirements
   - **When** viewed on any device
   - **Then** skill badges wrap naturally without horizontal scroll
   - **And** layout remains clean and readable

6. **AC6: Accessibility Requirements**
   - **Given** accessibility requirements
   - **When** the section renders
   - **Then** the section has H2 heading with id for navigation
   - **And** semantic HTML lists are used for skill groups
   - **And** screen readers can access all skills (FR33)

## Tasks / Subtasks

- [x] Task 1: Create Skills Collection in Payload CMS (AC: #1)
  - [x] 1.1: Create `src/collections/Skills.ts` collection file
  - [x] 1.2: Define fields: name (text, required), category (text, required), isVisible (checkbox, defaultValue: true)
  - [x] 1.3: Configure admin.useAsTitle to 'name' and defaultColumns to ['name', 'category', 'isVisible']
  - [x] 1.4: Configure defaultSort to 'category' for grouped display
  - [x] 1.5: Register collection in `src/payload.config.ts` collections array
  - [x] 1.6: Run `pnpm generate:types` to update payload-types.ts
  - [ ] 1.7: Verify collection appears in Payload admin at /admin [MANUAL]

- [x] Task 2: Create SkillsSection Component (AC: #2, #3, #4, #5, #6)
  - [x] 2.1: Create `src/components/SkillsSection.tsx` as a Server Component
  - [x] 2.2: Fetch Skills collection using Payload local API with `where: { isVisible: { equals: true } }`
  - [x] 2.3: Sort skills by category for grouped display
  - [x] 2.4: Group skills by category using reduce/Object.groupBy pattern
  - [x] 2.5: Add section with id="skills" for navigation anchor
  - [x] 2.6: Render H2 heading "Skills" with proper styling and id="skills-heading"
  - [x] 2.7: Add aria-labelledby="skills-heading" to section
  - [x] 2.8: For each category, render H3 subheading with category name
  - [x] 2.9: Render skills within each category as flex-wrap list using semantic `<ul>` element
  - [x] 2.10: Use shadcn Badge component for each skill with teal accent styling
  - [x] 2.11: Apply gap-2 between badges, gap-6 between category groups
  - [x] 2.12: Apply max-width 1200px container with proper padding
  - [x] 2.13: Implement 64px vertical section spacing per UX spec
  - [x] 2.14: Return null if no visible skills (hide section entirely)

- [x] Task 3: Integrate SkillsSection into Homepage (AC: #2)
  - [x] 3.1: Import SkillsSection into `src/app/(frontend)/page.tsx`
  - [x] 3.2: Add SkillsSection below ProjectsSection
  - [ ] 3.3: Verify content displays from Payload collection [MANUAL]

- [ ] Task 4: Add Seed Data for Testing (AC: #1, #2, #3) [MANUAL - User Testing Required]
  - [ ] 4.1: Access Payload admin at /admin
  - [ ] 4.2: Navigate to Skills collection
  - [ ] 4.3: Create test skills with varied categories (Languages, Frameworks, Tools, etc.)
  - [ ] 4.4: Test visibility toggle (create one with isVisible=false)
  - [ ] 4.5: Verify skills group correctly by category
  - [ ] 4.6: Verify badge styling matches ProjectCard tech stack badges

- [ ] Task 5: Accessibility Testing (AC: #6) [MANUAL - User Testing Required]
  - [ ] 5.1: Verify H2 heading with id="skills" for navigation
  - [ ] 5.2: Verify H3 subheadings for each category
  - [ ] 5.3: Verify semantic `<ul>` and `<li>` structure for skill lists
  - [ ] 5.4: Test screen reader announces category and skill names
  - [ ] 5.5: Run accessibility audit (Firefox Accessibility Inspector)
  - [ ] 5.6: Verify badges wrap cleanly on narrow viewports

## Dev Notes

### Previous Story Intelligence (Story 2.5 Complete)

**Patterns established in Stories 2.1-2.5:**
- Collections use `CollectionConfig` type with slug, fields array, and defaultSort
- Server Components use `getPayload({ config })` and `payload.find({ collection: '...', where: {...} })`
- Color system: `teal-700` for primary accent, `teal-800` for hover (WCAG AA compliant)
- Responsive layout uses Tailwind prefixes: default mobile, `md:` tablet, `lg:` desktop
- Max-width 1200px container: `max-w-[1200px] mx-auto`
- Padding pattern: `px-4 md:px-6 lg:px-8`
- Section spacing: `py-16 md:py-24` for 64px+ vertical gaps
- Accessibility: `id` on section, `aria-labelledby` pointing to heading `id`
- Empty state: Return `null` to hide section entirely (no "no items" message)

**Badge styling from ProjectCard (reuse exactly):**
```typescript
<Badge
  variant="outline"
  className="border-teal-700/50 bg-teal-900/30 text-teal-400"
>
  {skillName}
</Badge>
```

**Key files to reference (copy patterns from):**
- `src/collections/Experiences.ts` - Collection configuration pattern with isVisible checkbox
- `src/components/ExperienceSection.tsx` - Server component with collection fetching
- `src/components/ProjectCard.tsx` - Badge styling for tech stack (lines 46-55)

**Code Review Fixes Applied in Previous Stories:**
- Use semantic HTML lists (`<ul>`, `<li>`) for accessibility
- Add `focus:outline-none` before focus ring classes
- Badge keys should use unique value (not array index)

### Architecture Compliance

**Payload Collection Pattern:**
```typescript
// src/collections/Skills.ts
import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'isVisible'],
  },
  defaultSort: 'category',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        description: 'Category for grouping (e.g., Languages, Frameworks, Tools, DevOps)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Toggle to show/hide this skill on the site',
      },
    },
  ],
}
```

**Collection Data Fetching Pattern:**
```typescript
// Use payload.find() for collection data
const skills = await payload.find({
  collection: 'skills',
  where: {
    isVisible: { equals: true },
  },
  sort: 'category',
  limit: 100, // Ensure all skills are fetched
})
// Access data via skills.docs (array of Skill objects)
```

**Naming Conventions (from architecture.md):**
| Element | Convention | Example |
|---------|-----------|---------|
| Collection names | camelCase, singular for collection slug | `skills` |
| Field names | camelCase | `isVisible` |
| Boolean fields | `is` or `has` prefix | `isVisible` |

**Component Location:**
- `src/components/SkillsSection.tsx` - Server Component (data fetching)
- Keep flat in `src/components/` - NO nested folders

### Visual Design Requirements (from UX Specification)

**Color System:**
| Role | Color | Hex/Class |
|------|-------|-----------|
| Background | Near-black | `#09090b` |
| Surface (cards) | Dark gray | `#18181b` / `bg-zinc-900` |
| Border | Subtle gray | `#27272a` / `border-zinc-800` |
| Primary (accent) | Dark green (teal) | `teal-700` |
| Text Primary | Off-white | `text-foreground` |
| Text Secondary | Light gray | `text-text-secondary` |

**Typography Scale:**
| Element | Desktop | Mobile | Weight |
|---------|---------|--------|--------|
| H2 (section heading) | 32px | 24px | 600 |
| H3 (category subheading) | 20px | 20px | 600 |
| Small (badges) | 14px | 14px | 400 |

**Badge Styling (consistent with ProjectCard):**
- Background: `bg-teal-900/30`
- Text: `text-teal-400`
- Border: `border-teal-700/50`
- Use shadcn Badge component with variant="outline"

**Layout Pattern (flex-wrap for badges):**
- Category groups: `space-y-6` vertical gap
- Badge container: `flex flex-wrap gap-2`
- Category subheading: `mb-3` below heading

### Technical Implementation Guide

**SkillsSection Component:**
```typescript
// src/components/SkillsSection.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { Badge } from '@/components/ui/badge'

export async function SkillsSection() {
  const payload = await getPayload({ config })
  const skills = await payload.find({
    collection: 'skills',
    where: {
      isVisible: { equals: true },
    },
    sort: 'category',
    limit: 100,
  })

  if (skills.docs.length === 0) {
    return null // Hide section entirely if no visible skills
  }

  // Group skills by category
  const skillsByCategory = skills.docs.reduce(
    (acc, skill) => {
      const category = skill.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills.docs>
  )

  // Sort categories alphabetically for consistent order
  const sortedCategories = Object.keys(skillsByCategory).sort()

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2
          id="skills-heading"
          className="mb-8 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
        >
          Skills
        </h2>

        <div className="space-y-6">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {category}
              </h3>
              <ul className="flex flex-wrap gap-2" role="list" aria-label={`${category} skills`}>
                {skillsByCategory[category].map((skill) => (
                  <li key={skill.id}>
                    <Badge
                      variant="outline"
                      className="border-teal-700/50 bg-teal-900/30 text-teal-400"
                    >
                      {skill.name}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
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
import { Skills } from './collections/Skills'

export default buildConfig({
  // ... existing config
  globals: [Hero, About],
  collections: [Users, Media, Experiences, Education, Projects, Skills],  // Add Skills
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
import { SkillsSection } from '@/components/SkillsSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <SkillsSection />
      {/* Future sections: GitHub, Contact */}
    </main>
  )
}
```

### Project Structure Notes

**Files to Create:**
- `src/collections/Skills.ts` - Skills collection configuration
- `src/components/SkillsSection.tsx` - Skills display section (server component)

**Files to Modify:**
- `src/payload.config.ts` - Add Skills to collections array
- `src/app/(frontend)/page.tsx` - Add SkillsSection component

**Auto-generated Files (will be modified by Payload):**
- `src/payload-types.ts` - After running `pnpm generate:types`
- `src/app/(payload)/admin/importMap.js` - Payload admin imports

### CRITICAL WARNINGS

**DO NOT:**
- Use `findGlobal` for Skills - this is a COLLECTION, use `find` with collection parameter
- Create nested folders for components (keep flat in `src/components/`)
- Use client-side data fetching for SkillsSection (use Server Component)
- Hardcode skill content - all content must come from Payload
- Skip the id="skills" attribute on section (needed for navigation)
- Use array index as key for badges (use skill.id instead)
- Skip running `pnpm generate:types` after creating the collection
- Forget limit parameter when fetching (default is 10, may miss skills)
- Create a separate SkillBadge component (use Badge directly)
- Use `<div>` instead of semantic `<ul>/<li>` for skill lists

**DO:**
- Use Payload's `find` API with `collection: 'skills'` for data fetching
- Use `where` clause to filter by `isVisible: { equals: true }`
- Use `sort: 'category'` for alphabetical category grouping
- Use `limit: 100` to ensure all skills are fetched
- Use shadcn Badge component with teal accent styling (same as ProjectCard)
- Apply Tailwind classes for responsive layout
- Use CSS flex-wrap for badge layout (not grid)
- Group skills by category with reduce pattern
- Use semantic HTML: `<section>`, `<h2>`, `<h3>`, `<ul>`, `<li>`
- Add aria-label on skill lists for screen reader context
- Test on mobile viewport sizes
- Add the collection to `collections` array in payload.config.ts

### Git Intelligence (Recent Commits)

```
d86a5a2 feat: add Projects section with Payload collection
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
feat: add Skills collection to Payload CMS
feat: create SkillsSection component with category grouping
```

### References

- [Source: architecture.md#Data Architecture] - Payload collections structure, Skills fields
- [Source: architecture.md#Implementation Patterns & Consistency Rules] - Naming conventions, API patterns
- [Source: ux-design-specification.md#Visual Design Foundation] - Color system, typography, badge styling
- [Source: ux-design-specification.md#Component Strategy] - Skills display specifications
- [Source: epic-2-core-portfolio-content.md#Story 2.6] - Full acceptance criteria
- [Source: prd.md#Functional Requirements] - FR6, FR32, FR33
- [Source: 2-5-create-projects-section-with-payload-collection.md] - Badge styling patterns, code review fixes

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - implementation proceeded without issues.

### Completion Notes List

- Created Skills collection with name, category, and isVisible fields following established Payload patterns
- Implemented SkillsSection as a Server Component with Payload local API data fetching
- Skills are grouped by category using reduce pattern with alphabetically sorted categories
- Used semantic HTML (section, h2, h3, ul, li) for accessibility compliance
- Applied teal accent Badge styling matching ProjectCard tech stack badges
- Verified TypeScript compilation passes with generated types
- Code formatted with Prettier
- Manual testing tasks remain for user verification (Tasks 4 and 5)

### File List

**Files Created:**
- src/collections/Skills.ts
- src/components/SkillsSection.tsx

**Files Modified:**
- src/payload.config.ts (added Skills import and collection)
- src/app/(frontend)/page.tsx (added SkillsSection import and component)
- src/payload-types.ts (auto-generated with Skill interface)
- src/app/(payload)/admin/importMap.js (auto-generated by Payload)
- _bmad-output/implementation-artifacts/sprint-status.yaml (story tracking update)

### Change Log

- 2026-03-07: Implemented Story 2.6 - Skills Section with Payload Collection
  - Created Skills collection configuration with name, category, isVisible fields
  - Created SkillsSection component with category grouping and badge display
  - Integrated SkillsSection into homepage below ProjectsSection
  - Generated TypeScript types for Skills collection

## Senior Developer Review (AI)

**Review Date:** 2026-03-07
**Reviewer:** Claude Opus 4.5 (claude-opus-4-5-20251101)
**Outcome:** APPROVED

### Acceptance Criteria Verification

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC1 | Payload Skills Collection Configuration | PASS | Skills.ts has name (text, required), category (text, required), isVisible (checkbox, defaultValue: true) |
| AC2 | SkillsSection Component Displays Content | PASS | Server Component fetches with `where: { isVisible: { equals: true } }`, groups by category |
| AC3 | Category Grouping with Subheadings | PASS | H3 per category, flex-wrap badge lists |
| AC4 | Badge Styling Requirements | PASS | Identical to ProjectCard: `border-teal-700/50 bg-teal-900/30 text-teal-400` |
| AC5 | Responsive Layout | PASS | `flex flex-wrap gap-2` with responsive padding |
| AC6 | Accessibility Requirements | PASS | Section id="skills", aria-labelledby, semantic ul/li, aria-label on lists |

### Task Completion Audit

All [x] marked tasks verified as correctly implemented:
- Task 1 (1.1-1.6): Skills collection created with correct fields, admin config, and registration
- Task 2 (2.1-2.14): SkillsSection component fully implemented with all specified features
- Task 3 (3.1-3.2): Homepage integration complete

### Code Quality Assessment

**Positive Findings:**
- TypeScript compiles without errors
- Pattern consistency with ExperienceSection, ProjectCard, and other sections
- Proper Server Component pattern with Payload local API
- Semantic HTML structure for accessibility
- Correct Badge styling matching ProjectCard exactly
- Proper use of skill.id as key (not array index)
- Category grouping with alphabetical sort for consistent order

**Issues Fixed During Review:**
1. Added missing sprint-status.yaml to File List documentation

### Issues Summary

| Severity | Count | Description |
|----------|-------|-------------|
| Critical | 0 | - |
| High | 0 | - |
| Medium | 1 | File List incomplete (fixed) |
| Low | 2 | Auto-generated file formatting, lint config (pre-existing) |

All issues resolved or documented as pre-existing project configuration issues.
