# Story 2.1: Create Hero Section with Payload Collection

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to see a hero section with Ben's name, headline, and tagline**,
So that **I immediately understand who Ben is and what he does** (FR1).

## Acceptance Criteria

1. **AC1: Payload Hero Global Configuration**
   - **Given** the Payload CMS is configured
   - **When** I create the Hero global
   - **Then** the global has fields for: name, headline, tagline, and ctaButtons array
   - **And** ctaButtons contains label, url, and variant (primary/secondary)
   - **And** the global is editable via Payload admin

2. **AC2: HeroSection Component Displays Content**
   - **Given** the Hero global exists with content
   - **When** a visitor loads the homepage
   - **Then** the HeroSection component displays the name as H1
   - **And** the headline displays as H2
   - **And** the tagline displays below the headline
   - **And** CTA buttons render with correct styling (primary green, secondary outline)

3. **AC3: Desktop Responsive Layout**
   - **Given** the hero section is rendered
   - **When** viewed on desktop (> 1024px)
   - **Then** the section height is 85vh
   - **And** content is centered vertically and horizontally
   - **And** max-width is 1200px

4. **AC4: Mobile Responsive Layout**
   - **Given** the hero section is rendered
   - **When** viewed on mobile (< 768px)
   - **Then** the section height is 70vh (FR36)
   - **And** content remains centered and readable
   - **And** touch targets are minimum 44x44px (NFR21)

5. **AC5: Accessibility Requirements**
   - **Given** accessibility requirements
   - **When** the hero section renders
   - **Then** proper heading hierarchy is maintained (FR33)
   - **And** color contrast meets 4.5:1 for text (FR35, NFR17)
   - **And** all interactive elements are keyboard focusable (FR32)
   - **And** focus indicators are visible (NFR19)

## Tasks / Subtasks

- [x] Task 1: Create Hero Global in Payload CMS (AC: #1)
  - [x] 1.1: Create `src/collections/Hero.ts` global collection file
  - [x] 1.2: Define fields: name (text, required), headline (text, required), tagline (text)
  - [x] 1.3: Define ctaButtons array field with label, url, variant (select: primary/secondary)
  - [x] 1.4: Register global in `src/payload.config.ts`
  - [x] 1.5: Run `pnpm generate:types` to update payload-types.ts
  - [x] 1.6: Verify global appears in Payload admin at /admin

- [x] Task 2: Create HeroSection Component (AC: #2, #3, #4)
  - [x] 2.1: Create `src/components/HeroSection.tsx` as a Server Component
  - [x] 2.2: Fetch Hero global data using Payload local API
  - [x] 2.3: Render name as H1 with proper typography (48px desktop, 36px mobile)
  - [x] 2.4: Render headline as H2 with proper typography (32px desktop, 24px mobile)
  - [x] 2.5: Render tagline as paragraph with secondary text color
  - [x] 2.6: Render CTA buttons using shadcn Button component
  - [x] 2.7: Apply 85vh height for desktop, 70vh for mobile
  - [x] 2.8: Center content vertically and horizontally with flex
  - [x] 2.9: Constrain max-width to 1200px with proper padding

- [x] Task 3: Style CTA Buttons per Design System (AC: #2, #5)
  - [x] 3.1: Primary variant: green background (#0d9488), white text
  - [x] 3.2: Secondary variant: transparent background, green border, green text
  - [x] 3.3: Ensure minimum 44x44px touch targets
  - [x] 3.4: Add visible focus rings (2px green outline)
  - [x] 3.5: Add hover states (primary: lighter green #14b8a6, secondary: green background)

- [x] Task 4: Integrate HeroSection into Homepage (AC: #2)
  - [x] 4.1: Import HeroSection into `src/app/(frontend)/page.tsx`
  - [x] 4.2: Add HeroSection as first component on page
  - [x] 4.3: Verify content displays from Payload global

- [x] Task 5: Add Seed Data for Testing (AC: #1, #2)
  - [x] 5.1: Access Payload admin at /admin
  - [x] 5.2: Navigate to Hero global and add test content
  - [x] 5.3: Verify content displays on homepage

- [x] Task 6: Accessibility Testing (AC: #5)
  - [x] 6.1: Verify heading hierarchy (H1 for name, H2 for headline)
  - [x] 6.2: Test keyboard navigation to all CTA buttons
  - [x] 6.3: Verify focus indicators are visible on all interactive elements
  - [x] 6.4: Run accessibility audit (Firefox Accessibility Inspector)
  - [x] 6.5: Check color contrast - Fixed: teal-700/teal-800 for WCAG AA compliance

## Dev Notes

### Previous Story Intelligence (Epic 1 Complete)

**What was established in Epic 1:**
- Payload CMS project initialized with blank template + shadcn/ui (Story 1.1)
- Project structure complete: `src/app/(frontend)/`, `src/app/(payload)/`, `src/components/ui/`, `src/lib/`, `src/types/` (Story 1.2)
- TypeScript strict mode, ESLint, Prettier configured (Story 1.2)
- Deployed to Vercel with Neon Postgres at www.ralton.dev (Story 1.3)
- **Database:** Postgres everywhere (no SQLite split) - using `@payloadcms/db-postgres`
- Observability configured: OpenTelemetry + Axiom, Vercel Speed Insights, Vercel Web Analytics (Story 1.4)
- CSP headers configured in next.config.mjs (Story 1.4)

**Key files from Epic 1 (DO NOT MODIFY unless specified):**
- `src/payload.config.ts` - Payload configuration with Postgres, Users and Media collections
- `next.config.mjs` - Next.js config with Payload, CSP headers
- `src/app/(frontend)/layout.tsx` - Frontend layout (may need modification)
- `src/app/(frontend)/page.tsx` - Homepage (currently placeholder, will be modified)
- `src/components/ui/` - shadcn components already installed: button, card, badge, input, textarea, toast, toaster, navigation-menu, skeleton

**Production URL:** www.ralton.dev

### Architecture Compliance

**CRITICAL: Follow these exact patterns from Architecture document:**

**Payload Global Pattern (for single-record data like Hero):**
```typescript
// src/collections/Hero.ts
import { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    // ... more fields
  ],
}
```

**Payload Collection Naming (from architecture.md):**
| Element | Convention | Example |
|---------|-----------|---------|
| Global names | camelCase | `hero`, `about` |
| Field names | camelCase | `ctaButtons`, `isVisible` |
| Boolean fields | `is` or `has` prefix | `isVisible` |

**Component Naming (from architecture.md):**
| Element | Convention | Example |
|---------|-----------|---------|
| React components | PascalCase | `HeroSection.tsx` |
| Custom components | Flat in `components/` | NO nested folders |

**Data Fetching Pattern (Server Components):**
```typescript
// src/components/HeroSection.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export async function HeroSection() {
  const payload = await getPayload({ config })
  const hero = await payload.findGlobal({ slug: 'hero' })

  return (
    // ... JSX
  )
}
```

**Anti-Patterns to Avoid (from architecture.md):**
- ❌ Creating nested component folders (`components/sections/HeroSection/`)
- ❌ Using `snake_case` for TypeScript variables or fields
- ❌ Creating custom UI primitives when shadcn has one (use Button from shadcn)
- ❌ Using `""` for empty optional fields (use `null`)

### Visual Design Requirements (from UX Specification)

**Color System:**
| Role | Color | Hex |
|------|-------|-----|
| Background | Near-black | `#09090b` |
| Primary (accent) | Dark green (teal) | `#0d9488` |
| Primary Hover | Lighter green | `#14b8a6` |
| Text Primary | Off-white | `#fafafa` |
| Text Secondary | Light gray | `#a1a1aa` |

**Typography Scale:**
| Element | Desktop | Mobile | Weight |
|---------|---------|--------|--------|
| H1 (name) | 48px | 36px | 700 |
| H2 (headline) | 32px | 24px | 600 |
| Body (tagline) | 16px | 16px | 400 |

**Layout (from UX Specification):**
- Hero section: 85vh desktop, 70vh mobile
- Max content width: 1200px
- Content padding: 16px mobile, 24px tablet, 32px desktop
- CTA buttons minimum touch target: 44x44px

**Button Hierarchy (from UX Specification):**
| Type | Usage | Style |
|------|-------|-------|
| Primary | Main CTAs | Green background, white text |
| Secondary | Alternative actions | Green border, green text |

**States:** Default → Hover → Active → Focus (green ring)

### Technical Implementation Guide

**Payload Global Registration:**
```typescript
// src/payload.config.ts - ADD this to existing config
import { Hero } from './collections/Hero'

export default buildConfig({
  // ... existing config
  globals: [Hero],  // Add globals array if not present
  collections: [Users, Media],  // Existing collections
})
```

**HeroSection Component Structure:**
```typescript
// src/components/HeroSection.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { Button } from '@/components/ui/button'

export async function HeroSection() {
  const payload = await getPayload({ config })
  const hero = await payload.findGlobal({ slug: 'hero' })

  return (
    <section className="flex min-h-[85vh] md:min-h-[70vh] lg:min-h-[85vh] items-center justify-center px-4 md:px-6 lg:px-8">
      <div className="max-w-[1200px] w-full text-center">
        <h1 className="text-4xl md:text-5xl lg:text-[48px] font-bold text-[#fafafa] mb-4">
          {hero.name}
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-[32px] font-semibold text-[#fafafa] mb-4">
          {hero.headline}
        </h2>
        {hero.tagline && (
          <p className="text-base text-[#a1a1aa] mb-8 max-w-2xl mx-auto">
            {hero.tagline}
          </p>
        )}
        <div className="flex flex-wrap gap-4 justify-center">
          {hero.ctaButtons?.map((button, index) => (
            <Button
              key={index}
              variant={button.variant === 'primary' ? 'default' : 'outline'}
              asChild
              className={`min-h-[44px] min-w-[44px] ${
                button.variant === 'primary'
                  ? 'bg-[#0d9488] hover:bg-[#14b8a6] text-white'
                  : 'border-[#0d9488] text-[#0d9488] hover:bg-[#0d9488] hover:text-white'
              }`}
            >
              <a href={button.url}>{button.label}</a>
            </Button>
          ))}
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

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      {/* Future sections will be added here */}
    </main>
  )
}
```

### Project Structure Notes

**Files to Create:**
- `src/collections/Hero.ts` - Hero global configuration
- `src/components/HeroSection.tsx` - Hero section component

**Files to Modify:**
- `src/payload.config.ts` - Add Hero global to globals array
- `src/app/(frontend)/page.tsx` - Add HeroSection component

**Existing Files (DO NOT MODIFY unless necessary):**
- `src/components/ui/button.tsx` - Use as-is for CTA buttons
- `src/app/(frontend)/layout.tsx` - Layout already configured

### Testing This Story

After completion, verify:

1. **Payload Admin:** Navigate to /admin → Hero global appears in sidebar
2. **Content Entry:** Can create/edit hero content with all fields
3. **Homepage Display:** Visit www.ralton.dev → Hero section displays with content
4. **Desktop Layout:** Content centered, 85vh height, max-width 1200px
5. **Mobile Layout:** Stack properly at 70vh, text readable, buttons 44px min
6. **Accessibility:** Tab through CTA buttons, focus rings visible
7. **Lighthouse:** Run audit, accessibility score should be 100

### CRITICAL WARNINGS

**DO NOT:**
- Create nested folders for components (keep flat in `src/components/`)
- Use client-side data fetching for Hero data (use Server Component)
- Hardcode content - all content must come from Payload global
- Skip accessibility requirements (focus rings, touch targets, heading hierarchy)
- Use custom button styles when shadcn Button can be configured
- Forget to run `pnpm generate:types` after creating the global

**DO:**
- Use Payload's `findGlobal` API for data fetching
- Use shadcn Button component with variant prop
- Apply Tailwind responsive classes (md:, lg:) for breakpoints
- Test on mobile viewport sizes
- Verify focus states work with keyboard navigation
- Add the global to `globals` array in payload.config.ts

### Git Intelligence (Recent Commits)

Recent commits show established patterns:
```
5d6d849 docs: complete epic 1 retrospective and mark epic done
bb956dd feat: add structured logging with Axiom transport
25e44fc feat: add OpenTelemetry instrumentation with Axiom
```

**Commit patterns established:**
- Commit messages use conventional format: `type: description`
- Types: `fix`, `feat`, `chore`, `docs`
- Keep commits focused on single concerns

**Recommended commits for this story:**
```
feat: add Hero global to Payload CMS
feat: create HeroSection component with responsive layout
```

### References

- [Source: architecture.md#Data Architecture] - Payload collections and globals
- [Source: architecture.md#Implementation Patterns & Consistency Rules] - Naming conventions
- [Source: ux-design-specification.md#Visual Design Foundation] - Color system, typography
- [Source: ux-design-specification.md#Defining Experience] - Hero section requirements
- [Source: ux-design-specification.md#Component Strategy] - Hero Section specs (85vh, centered)
- [Source: epic-2-core-portfolio-content.md#Story 2.1] - Acceptance criteria
- [Source: prd.md#Functional Requirements] - FR1, FR32, FR33, FR35, FR36
- [Source: prd.md#Non-Functional Requirements] - NFR17, NFR19, NFR21
- [Source: 1-4-set-up-observability.md] - Previous story context, project patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript compiles cleanly with `pnpm tsc --noEmit`
- Types generated successfully with `pnpm generate:types`
- No test framework currently configured in project

### Completion Notes List

- Created Hero global collection with name, headline, tagline, and ctaButtons fields (AC1)
- Created HeroSection component as Server Component using Payload local API (AC2)
- Implemented responsive layout: 70vh mobile, 85vh desktop with 1200px max-width (AC3, AC4)
- Applied design system colors using Tailwind CSS variables from existing theme
- CTA buttons use shadcn Button component with primary/outline variants
- 44x44px minimum touch targets ensured with min-h and min-w classes (NFR21)
- Proper heading hierarchy: H1 for name, H2 for headline (FR33)
- Focus rings inherit from shadcn Button defaults (ring-offset-background)
- Integrated HeroSection into homepage replacing placeholder content
- Fixed button contrast: Changed from teal-600 to teal-700/teal-800 for WCAG AA compliance (5.5:1+ ratio)

### File List

**Created:**
- src/collections/Hero.ts
- src/components/HeroSection.tsx

**Modified:**
- src/payload.config.ts
- src/app/(frontend)/page.tsx
- src/payload-types.ts (auto-generated)
- src/app/(payload)/admin/importMap.js (auto-generated by Payload)
- next-env.d.ts (auto-generated by Next.js)

## Change Log

- **2026-03-07**: Code review passed, fixes applied
  - Fixed inconsistent button styling: secondary button now uses teal-700 consistently (was mixing CSS vars with Tailwind)
  - Updated File List to document auto-generated file changes (importMap.js, next-env.d.ts)
  - Verified accessibility color fixes (teal-700/800) were intentional and correct
- **2026-03-07**: Story complete, moved to review
  - Created Payload Hero global with name, headline, tagline, ctaButtons fields
  - Created HeroSection Server Component with responsive layout (70vh mobile, 85vh desktop)
  - Integrated into homepage, seed data added, content verified
  - Fixed color contrast issue: teal-700/800 for WCAG AA compliance
  - All accessibility checks passing (Firefox Accessibility Inspector)
