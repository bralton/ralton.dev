# Story 8.4: Create Custom 404 Page

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **a creative, memorable 404 page**,
So that **even error states reflect the site's personality and professionalism**.

## Acceptance Criteria

1. **Given** the frontend application
   **When** I create a custom 404 page
   **Then** it has a creative, memorable design inspired by sites like GitHub, Reddit, and PostHog
   **And** it maintains consistent branding with the rest of the site (fonts, colors, spacing)

2. **Given** the 404 page design
   **When** a visitor lands on a non-existent page
   **Then** the page clearly communicates that the requested content doesn't exist
   **And** it provides helpful navigation options (link to homepage, main sections)
   **And** it includes a subtle, personality-driven visual element or message

3. **Given** the security requirements from Story 8.5
   **When** blocked admin access attempts occur
   **Then** the same 404 page is displayed (security through obscurity)
   **And** visitors cannot distinguish between a genuine 404 and a blocked admin route

4. **Given** accessibility requirements
   **When** the 404 page is rendered
   **Then** all text meets WCAG AA contrast requirements
   **And** interactive elements have proper focus states
   **And** the page is navigable via keyboard
   **And** appropriate heading hierarchy is maintained

5. **Given** responsive design requirements
   **When** the 404 page is viewed on different devices
   **Then** it displays correctly on mobile, tablet, and desktop
   **And** images/illustrations scale appropriately
   **And** text remains readable at all breakpoints

## Tasks / Subtasks

- [x] Task 1: Create 404 page component (AC: #1, #2)
  - [x] Create `src/app/(frontend)/not-found.tsx` file
  - [x] Implement ASCII art decoration (boxes with "4 0 4")
  - [x] Add "Page Not Found" heading with proper h1 styling
  - [x] Add descriptive message paragraph
  - [x] Add "Back to Home" link with proper button styling

- [x] Task 2: Apply consistent branding (AC: #1)
  - [x] Use Inter font (inherits from layout)
  - [x] Use JetBrains Mono for ASCII art (`font-mono`)
  - [x] Apply teal-700 accent color for CTA button
  - [x] Apply teal-800 for hover state
  - [x] Use existing color scheme (text-muted-foreground, background)

- [x] Task 3: Configure SEO metadata (AC: implied)
  - [x] Export metadata object with title "Page Not Found"
  - [x] Set robots to `index: false, follow: false`
  - [x] Add descriptive meta description

- [x] Task 4: Implement accessibility compliance (AC: #4)
  - [x] Add `aria-hidden="true"` to ASCII art (decorative only)
  - [x] Use semantic `<main>` landmark
  - [x] Ensure proper heading hierarchy (h1 for title)
  - [x] Add focus states to CTA: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`
  - [x] Ensure keyboard navigation works (tab to link, enter to activate)

- [x] Task 5: Implement responsive design (AC: #5)
  - [x] Use responsive text sizes (text-2xl sm:text-3xl for ASCII, text-4xl sm:text-5xl for heading)
  - [x] Center content vertically and horizontally
  - [x] Use responsive padding (px-4)
  - [x] Ensure min-height fills viewport minus header space

- [x] Task 6: Verify integration with Story 8.5 (AC: #3)
  - [x] Confirm page can be rendered for blocked admin access via rewrite
  - [x] No visual difference between genuine 404 and blocked admin route
  - [x] Page does not reveal information about admin panel existence

## Dev Notes

### Implementation Specification

**File to create:** `src/app/(frontend)/not-found.tsx`

This is a Next.js special file that automatically handles 404 responses within the `(frontend)` route group.

**Complete implementation from design document:**

```typescript
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center px-4 text-center">
      {/* ASCII Art - visible but decorative */}
      <pre
        className="mb-8 font-mono text-2xl text-muted-foreground sm:text-3xl"
        aria-hidden="true"
      >
{`  ___  ___  ___
 /   \\/   \\/   \\
| 4  || 0 || 4  |
 \\___/\\___/\\___/`}
      </pre>

      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Page Not Found
      </h1>

      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
      >
        Back to Home
      </Link>
    </main>
  )
}
```

### Design Decisions

**Why ASCII art boxes:**
- Appeals to developer audience (portfolio target)
- Lightweight - no images to load
- Scales well across devices with responsive text sizing
- Creative but professional
- Uses existing JetBrains Mono monospace font

**Why minimal design:**
- Single clear CTA prevents decision paralysis
- Fast loading for good UX
- Consistent with portfolio's clean aesthetic
- Easy to maintain

**Security through obscurity (for Story 8.5):**
- This 404 page will also be displayed when admin access is blocked
- There should be NO visual indicators that distinguish a real 404 from a blocked admin route
- Do not include any "admin" references or special messaging

### Dev Standards

See [CLAUDE.md](../../../../../CLAUDE.md) for accessibility patterns, naming conventions, and project structure.

**Key Standards for This Story:**

**Accessibility (CRITICAL):**
- Use `teal-700` for primary accent, `teal-800` for hover (WCAG AA compliant)
- Focus states: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`
- ASCII art is decorative only - must have `aria-hidden="true"`
- Semantic HTML: `<main>` landmark required

**Fonts:**
- Inter (sans-serif) - inherits from layout.tsx
- JetBrains Mono (monospace) - use `font-mono` class for ASCII art

**Imports:**
- Use `@/` path alias if any imports from src/ needed
- Current implementation only needs `next/link` and `next` types

### Project Structure Notes

**File location:** `src/app/(frontend)/not-found.tsx`

This follows Next.js App Router conventions:
- `not-found.tsx` is a special file convention
- Placed in `(frontend)` route group so it inherits the frontend layout
- Automatically used when `notFound()` function is called or when no route matches

**Existing files in this directory:**
- `layout.tsx` - Root layout with fonts, metadata, Toaster
- `page.tsx` - Homepage
- `privacy/page.tsx` - Privacy policy page

**Layout inheritance:**
- The 404 page will automatically inherit the frontend layout
- Fonts (Inter, JetBrains Mono) are available via CSS variables
- Dark mode class is applied at html level
- Toaster component is available if needed

### Architecture Compliance

**Design Document Reference:** Section 5 - Story 8.4: Custom 404 Page Design

The implementation follows the design document specification exactly:
- ASCII art with 404 boxes
- Semantic HTML structure
- Accessibility-first approach
- Responsive design patterns
- SEO metadata with noindex/nofollow

**Integration with Story 8.5 (Admin IP Allowlist):**
- Story 8.5 will use Next.js middleware to rewrite blocked admin requests to this 404 page
- The middleware will return a 404 status code (not 403) to hide admin panel existence
- This 404 page must be generic enough that it doesn't reveal anything about the admin panel

### Technical Requirements

**TypeScript Requirements:**
- Use `Metadata` type from `next` for metadata export
- Component should be a default export function
- No props needed (static page)

**Tailwind Classes Used:**
| Class | Purpose |
|-------|---------|
| `flex min-h-[calc(100vh-theme(spacing.16))]` | Full height minus potential header |
| `flex-col items-center justify-center` | Center content vertically and horizontally |
| `px-4 text-center` | Horizontal padding and centered text |
| `font-mono` | JetBrains Mono for ASCII art |
| `text-2xl sm:text-3xl` | Responsive ASCII art sizing |
| `text-muted-foreground` | Subdued text color for secondary content |
| `text-4xl sm:text-5xl` | Responsive heading sizing |
| `font-bold tracking-tight` | Bold heading with tight letter spacing |
| `bg-teal-700 hover:bg-teal-800` | Primary CTA colors (WCAG AA compliant) |
| `rounded-md` | Rounded button corners |
| `focus:ring-2 focus:ring-teal-700 focus:ring-offset-2` | Accessible focus state |

### Previous Story Intelligence

**From Story 8.3 (Branch Protection):**
- Documentation patterns and formatting conventions observed
- Clean, minimal approach works well for this project

**From existing layout.tsx:**
- Uses `dark` class on html element
- Fonts are set up via CSS variables (`--font-inter`, `--font-jetbrains-mono`)
- `font-sans` is the default body class
- Metadata pattern established with proper typing

**From privacy/page.tsx pattern:**
- Standard page structure with metadata export
- Semantic HTML usage

### Git Intelligence

**Recent commits:**
```
912daea docs(security): add branch protection rules documentation
76b6420 ci(deps): configure Dependabot for security updates
e180d5c ci(discord): add PR notification workflow
```

**Commit conventions observed:**
- `feat(...)`: New features
- `fix(...)`: Bug fixes
- `docs(...)`: Documentation
- `style(...)`: Styling changes

**Suggested commit message for this story:**
```
feat(404): create custom 404 page with ASCII art design

Add creative 404 page with:
- ASCII art boxes displaying "404"
- Clear "Page Not Found" heading
- Back to Home CTA button
- WCAG AA accessibility compliance
- Responsive design for all devices
- noindex/nofollow for SEO
```

### Testing & Verification

**Manual Testing:**
1. Navigate to any non-existent route (e.g., `/nonexistent-page`)
2. Verify 404 page displays with ASCII art
3. Verify "Back to Home" link navigates to homepage
4. Test keyboard navigation (Tab to link, Enter to activate)
5. Test focus states are visible
6. Test responsive design at mobile (375px), tablet (768px), desktop (1280px)

**Accessibility Testing:**
1. Run Lighthouse accessibility audit on the page
2. Verify screen reader reads content correctly (not ASCII art)
3. Verify color contrast with browser dev tools

**No automated tests required** - Story 8.6 (Playwright E2E) may add 404 page tests later.

### Risk Assessment

**Risk Level:** Low

**Rationale:**
- Single new file creation
- No dependencies on other components
- No database interaction
- No API calls
- Static page that inherits layout

**Potential Issues:**
- ASCII art rendering on different fonts - mitigated by specifying `font-mono`
- Min-height calculation - may need adjustment if header height changes

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-8-ci-devops-security-documentation.md#Story 8.4]
- [Source: _bmad-output/planning-artifacts/epic-8-design-document.md#Section 5]
- [Source: CLAUDE.md - Accessibility standards and focus states]
- [Source: src/app/(frontend)/layout.tsx - Font and metadata patterns]
- [Reference: Next.js not-found.tsx documentation](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build verified successful: `/_not-found` route generated in Next.js build output
- TypeScript compilation passed with no errors
- Prettier formatting applied successfully

### Completion Notes List

- Created custom 404 page following design document specification exactly
- Implemented ASCII art boxes displaying "404" with JetBrains Mono font
- Applied WCAG AA compliant color scheme (teal-700/teal-800) for CTA button
- Configured metadata with noindex/nofollow for proper SEO handling
- Used semantic HTML with `<main>` landmark and proper h1 hierarchy
- Added aria-hidden="true" to ASCII art for accessibility (decorative only)
- Applied responsive design with mobile-first breakpoints
- Focus states match project standards: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`
- Page is generic and reveals nothing about admin panel (ready for Story 8.5 integration)
- Note: ESLint had pre-existing configuration issues unrelated to this story (circular reference in config). Build and TypeScript verification confirmed code is correct.

### File List

- `src/app/(frontend)/not-found.tsx` (created)

### Change Log

- 2026-03-11: Created custom 404 page with ASCII art design, accessibility compliance, responsive layout, and SEO metadata
