# Story 2.7: Create Navigation and Page Layout

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to navigate between content sections smoothly**,
So that **I can easily find the information I need** (FR7).

## Acceptance Criteria

1. **AC1: Navigation Component with Sticky Header**
   - **Given** the page has multiple sections
   - **When** I create the Navigation component
   - **Then** it displays a sticky header with navigation links
   - **And** links point to section anchors (Hero, About, Experience, Education, Projects, Skills, Contact)
   - **And** the navigation includes the site logo or Ben's name

2. **AC2: Smooth Scroll Navigation**
   - **Given** navigation links exist
   - **When** a visitor clicks a navigation link
   - **Then** the page smooth scrolls to the target section
   - **And** scroll offset accounts for sticky header height
   - **And** browser URL updates with the hash

3. **AC3: Responsive Navigation**
   - **Given** responsive design requirements
   - **When** viewed on desktop
   - **Then** navigation links display horizontally in the header
   - **When** viewed on mobile
   - **Then** navigation collapses to hamburger menu
   - **And** hamburger opens a slide-in or dropdown menu
   - **And** menu closes when a link is clicked

4. **AC4: Scroll Behavior Effects**
   - **Given** the sticky header requirement
   - **When** the visitor scrolls down
   - **Then** the header remains fixed at the top
   - **And** header may become semi-transparent or add shadow on scroll

5. **AC5: Navigation Accessibility**
   - **Given** accessibility requirements (FR32, NFR16)
   - **When** the navigation renders
   - **Then** a "Skip to content" link is the first focusable element
   - **And** all navigation links are keyboard accessible
   - **And** focus indicators are visible (NFR19)
   - **And** mobile menu is keyboard accessible

6. **AC6: Homepage Layout Assembly**
   - **Given** the main page layout
   - **When** assembling the homepage
   - **Then** all sections render in order: Hero, About, Experience, Education, Projects, Skills
   - **And** sections have consistent vertical spacing (64px per UX spec)
   - **And** the page uses the root layout with proper metadata

7. **AC7: Footer Component**
   - **Given** footer requirements
   - **When** the page renders
   - **Then** a minimal footer displays at the bottom
   - **And** footer includes placeholder for social links (implemented in Epic 5)
   - **And** footer maintains consistent styling

8. **AC8: Full Page Keyboard Navigation**
   - **Given** accessibility for the full page
   - **When** using keyboard navigation
   - **Then** tab order follows logical reading order
   - **And** all interactive elements are reachable
   - **And** `prefers-reduced-motion` disables smooth scroll animations

## Tasks / Subtasks

- [x] Task 1: Create Navigation Component (AC: #1, #3, #4)
  - [x] 1.1: Create `src/components/Navigation.tsx` as a Client Component (needs scroll state)
  - [x] 1.2: Implement sticky header with `position: fixed` or `sticky` and `top: 0`
  - [x] 1.3: Add site name/logo (Ben Ralton or BR) on the left
  - [x] 1.4: Create navigation links array: Home (Hero), About, Experience, Education, Projects, Skills, Contact
  - [x] 1.5: Implement desktop horizontal nav using flex layout
  - [x] 1.6: Add hamburger icon button for mobile (hidden on `md:` breakpoint)
  - [x] 1.7: Implement mobile slide-in menu (Sheet component) or dropdown overlay
  - [x] 1.8: Add scroll listener to detect scroll position for header effects
  - [x] 1.9: Apply semi-transparent background or shadow when scrolled
  - [x] 1.10: Apply `z-50` to ensure nav stays above content
  - [x] 1.11: Hide nav links on desktop, show hamburger on mobile (Tailwind responsive)

- [x] Task 2: Implement Smooth Scroll Navigation (AC: #2, #8)
  - [x] 2.1: Create click handler for navigation links
  - [x] 2.2: Use `scrollIntoView({ behavior: 'smooth', block: 'start' })` for smooth scrolling
  - [x] 2.3: Calculate scroll offset to account for sticky header height (approximately 64px)
  - [x] 2.4: Update URL hash on navigation without page reload
  - [x] 2.5: Check for `prefers-reduced-motion` media query
  - [x] 2.6: Use `behavior: 'auto'` instead of `smooth` when reduced motion is preferred
  - [x] 2.7: Close mobile menu after link click

- [x] Task 3: Add Skip to Content Link (AC: #5)
  - [x] 3.1: Add visually hidden "Skip to content" link as first element in Navigation
  - [x] 3.2: Style to appear on focus (absolute positioning, visible on :focus)
  - [x] 3.3: Link to `#main-content` anchor
  - [x] 3.4: Add `id="main-content"` to main element on homepage

- [x] Task 4: Create Footer Component (AC: #7)
  - [x] 4.1: Create `src/components/Footer.tsx` as a Server Component
  - [x] 4.2: Add minimal footer with copyright text (current year)
  - [x] 4.3: Add placeholder div/section for social links (to be implemented in Epic 5)
  - [x] 4.4: Apply consistent styling: dark background, proper padding, max-width container
  - [x] 4.5: Add section id="footer" for potential navigation

- [x] Task 5: Navigation Accessibility (AC: #5)
  - [x] 5.1: Add proper ARIA attributes to navigation (`role="navigation"`, `aria-label="Main navigation"`)
  - [x] 5.2: Add `aria-expanded` and `aria-controls` for mobile menu toggle
  - [x] 5.3: Ensure all nav links have visible focus states (focus ring with teal accent)
  - [x] 5.4: Add `aria-current="page"` for active section (optional for single-page)
  - [x] 5.5: Ensure mobile menu items are focusable in tab order
  - [x] 5.6: Add keyboard trap management for mobile menu (Escape to close)

- [x] Task 6: Update Homepage Layout (AC: #6)
  - [x] 6.1: Import Navigation and Footer into homepage layout or page
  - [x] 6.2: Add Navigation above main content
  - [x] 6.3: Add Footer below all sections
  - [x] 6.4: Add `id="main-content"` to main element
  - [x] 6.5: Verify section ordering: Hero, About, Experience, Education, Projects, Skills
  - [x] 6.6: Ensure 64px vertical spacing between sections (already implemented in previous stories)
  - [x] 6.7: Verify each section has proper id for navigation anchors

- [x] Task 7: Verify Section IDs for Navigation (AC: #2)
  - [x] 7.1: Verify HeroSection has `id="hero"` (or equivalent)
  - [x] 7.2: Verify AboutSection has `id="about"`
  - [x] 7.3: Verify ExperienceSection has `id="experience"`
  - [x] 7.4: Verify EducationSection has `id="education"`
  - [x] 7.5: Verify ProjectsSection has `id="projects"`
  - [x] 7.6: Verify SkillsSection has `id="skills"`
  - [x] 7.7: Add placeholder `id="contact"` section or comment for future implementation

- [ ] Task 8: Testing and Verification [MANUAL]
  - [ ] 8.1: Test smooth scroll to each section on desktop
  - [ ] 8.2: Test mobile hamburger menu opens and closes
  - [ ] 8.3: Test links close mobile menu after click
  - [ ] 8.4: Test keyboard navigation through all nav links
  - [ ] 8.5: Test Skip to Content link visibility on focus
  - [ ] 8.6: Test reduced motion respects user preference
  - [ ] 8.7: Test scroll offset accounts for sticky header
  - [ ] 8.8: Verify footer displays at bottom of page
  - [ ] 8.9: Run accessibility audit (axe-core, Firefox Accessibility Inspector)

## Dev Notes

### Previous Story Intelligence (Story 2.6 Complete)

**Patterns established in Stories 2.1-2.6:**
- Server Components use `getPayload({ config })` and `payload.find({ collection: '...', where: {...} })`
- Color system: `teal-700` for primary accent, `teal-800` for hover (WCAG AA compliant)
- Responsive layout uses Tailwind prefixes: default mobile, `md:` tablet, `lg:` desktop
- Max-width 1200px container: `max-w-[1200px] mx-auto`
- Padding pattern: `px-4 md:px-6 lg:px-8`
- Section spacing: `py-16 md:py-24` for 64px+ vertical gaps
- Accessibility: `id` on section, `aria-labelledby` pointing to heading `id`

**Sections already have IDs (verify these exist):**
- HeroSection: needs `id="hero"` (may need to add)
- AboutSection: `id="about"`
- ExperienceSection: `id="experience"`
- EducationSection: `id="education"`
- ProjectsSection: `id="projects"`
- SkillsSection: `id="skills"`

**Key files to reference (copy patterns from):**
- `src/components/HeroSection.tsx` - May need to add id attribute
- `src/components/ui/button.tsx` - shadcn Button for hamburger and nav links
- `src/components/ui/sheet.tsx` - shadcn Sheet for mobile slide-in menu (if available)

### Architecture Compliance

**Navigation Component Pattern (Client Component for interactivity):**
```typescript
// src/components/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 80 // Adjust based on header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      })

      // Update URL hash
      window.history.pushState(null, '', href)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        Skip to content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-b border-zinc-800 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-6 lg:px-8"
        >
          {/* Logo/Name */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="text-xl font-semibold text-foreground hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-background rounded-sm"
          >
            Ben Ralton
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-text-secondary hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-background rounded-sm px-1"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                className="focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background border-zinc-800">
              <nav className="mt-8">
                <ul className="space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="block py-2 text-lg text-foreground hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-sm px-2"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
    </>
  )
}
```

**Footer Component Pattern:**
```typescript
// src/components/Footer.tsx
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      id="footer"
      className="border-t border-zinc-800 bg-background px-4 py-8 md:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px] flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-sm text-text-secondary">
          &copy; {currentYear} Ben Ralton. All rights reserved.
        </p>

        {/* Social Links Placeholder - To be implemented in Epic 5 */}
        <div className="flex items-center gap-4">
          {/* Social link icons will go here */}
        </div>
      </div>
    </footer>
  )
}
```

**Homepage Layout Update:**
```typescript
// src/app/(frontend)/page.tsx
import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { EducationSection } from '@/components/EducationSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { SkillsSection } from '@/components/SkillsSection'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection />
        <SkillsSection />
        {/* Contact section to be implemented in Epic 5 */}
        <section id="contact" className="hidden">
          {/* Placeholder for navigation anchor */}
        </section>
      </main>
      <Footer />
    </>
  )
}
```

### Naming Conventions (from architecture.md)

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `Navigation.tsx`, `Footer.tsx` |
| Client Components | `'use client'` directive | Navigation (needs scroll state) |
| Server Components | Default (no directive) | Footer (no interactivity) |

### Visual Design Requirements (from UX Specification)

**Navigation Patterns:**
- **Sticky Nav:** Fixed top, semi-transparent on scroll
- **Section Links:** Smooth scroll with nav offset
- **Mobile:** Hamburger -> slide-in menu
- **External:** New tab + external icon indicator

**Color System:**
| Role | Color | Hex/Class |
|------|-------|-----------|
| Background | Near-black | `#09090b` / `bg-background` |
| Surface (header when scrolled) | Dark gray with transparency | `bg-background/80` |
| Border | Subtle gray | `#27272a` / `border-zinc-800` |
| Primary (accent) | Dark green (teal) | `teal-700` / `teal-400` for links |
| Text Primary | Off-white | `text-foreground` |
| Text Secondary | Light gray | `text-text-secondary` |

**Typography:**
| Element | Size | Weight |
|---------|------|--------|
| Logo/Name | 20px (text-xl) | 600 (font-semibold) |
| Nav Links | 14px (text-sm) | 400 (font-normal) |
| Footer text | 14px (text-sm) | 400 (font-normal) |

**Header Height:** 64px (h-16) - used for scroll offset calculation

**Layout:**
- Header: `fixed top-0 left-0 right-0 z-50`
- Max content width: 1200px (`max-w-[1200px] mx-auto`)
- Header height: 64px (`h-16`)
- Padding: `px-4 md:px-6 lg:px-8`

### shadcn/ui Components to Use

**Required:**
- `Button` - For hamburger menu toggle
- `Sheet` - For mobile slide-in menu (add if not installed)

**Install Sheet if needed:**
```bash
npx shadcn@latest add sheet
```

**lucide-react icons:**
- `Menu` - Hamburger icon
- `X` - Close icon (handled by Sheet)

### Project Structure Notes

**Files to Create:**
- `src/components/Navigation.tsx` - Navigation component (Client Component)
- `src/components/Footer.tsx` - Footer component (Server Component)

**Files to Modify:**
- `src/app/(frontend)/page.tsx` - Add Navigation and Footer, add `id="main-content"` to main
- `src/components/HeroSection.tsx` - Add `id="hero"` if missing (check first)

**shadcn Components to Add (if not installed):**
- `sheet` - For mobile menu slide-in

### CRITICAL WARNINGS

**DO NOT:**
- Make Navigation a Server Component (needs useState for scroll/menu state)
- Use complex animation libraries (keep to CSS transitions)
- Create nested component folders
- Forget the "Skip to content" accessibility link
- Use hardcoded header height without accounting for responsiveness
- Forget to close mobile menu after link click
- Skip `prefers-reduced-motion` check for smooth scroll
- Use inline styles instead of Tailwind classes
- Create separate NavLink component (keep links inline)
- Forget `z-50` on sticky header (content will overlay it)

**DO:**
- Use `'use client'` directive for Navigation component
- Use shadcn Sheet for mobile menu (better accessibility than custom)
- Use CSS `backdrop-blur` for semi-transparent effect
- Add scroll listener in useEffect with cleanup
- Implement proper keyboard navigation
- Use semantic HTML: `<header>`, `<nav>`, `<footer>`
- Apply proper ARIA attributes for accessibility
- Check for existing section IDs before assuming they exist
- Test on real mobile device or Chrome DevTools
- Account for iOS Safari safe areas if needed

### Git Intelligence (Recent Commits)

```
6cfecbe feat: add Skills section with Payload collection
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
feat: add Navigation component with smooth scroll and mobile menu
feat: add Footer component with placeholder for social links
feat: integrate Navigation and Footer into homepage layout
```

### References

- [Source: architecture.md#Project Structure & Boundaries] - Component file locations, naming patterns
- [Source: architecture.md#Implementation Patterns & Consistency Rules] - Naming conventions, component patterns
- [Source: ux-design-specification.md#Navigation Patterns] - Sticky nav, smooth scroll, mobile menu specs
- [Source: ux-design-specification.md#UX Consistency Patterns] - Navigation patterns, button hierarchy
- [Source: ux-design-specification.md#Visual Design Foundation] - Color system, typography scale
- [Source: ux-design-specification.md#Responsive Design & Accessibility] - WCAG 2.1 AA, keyboard navigation
- [Source: epic-2-core-portfolio-content.md#Story 2.7] - Full acceptance criteria
- [Source: prd.md#Functional Requirements] - FR7, FR32
- [Source: prd.md#Non-Functional Requirements] - NFR16, NFR19, NFR20, NFR21
- [Source: 2-6-create-skills-section-with-payload-collection.md] - Previous story patterns, section structure

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript compilation: Passed without errors
- Prettier formatting: All files formatted successfully
- ESLint: Project has pre-existing configuration issue (circular reference in eslint-config-next) - not related to this story's changes

### Completion Notes List

- Created Navigation component as Client Component with useState for scroll detection and mobile menu state
- Implemented sticky header with fixed positioning, z-50, and semi-transparent background on scroll using backdrop-blur-md
- Added "Ben Ralton" as site name/logo with smooth scroll to hero section
- Implemented navigation links for all sections: About, Experience, Education, Projects, Skills, Contact
- Used shadcn Sheet component for mobile slide-in menu with proper accessibility
- Implemented smooth scroll with 80px header offset, respects prefers-reduced-motion
- Added Skip to Content link as first focusable element, visible on focus with teal styling
- Created Footer component as Server Component with dynamic year and social links placeholder
- Updated homepage to include Navigation and Footer with proper main element structure
- Added id="hero" to HeroSection (was missing)
- Added placeholder contact section with id="contact" for navigation anchor
- All existing section IDs verified: about, experience, education, projects, skills
- Keyboard navigation supported via Sheet component's built-in accessibility
- Task 8 (Manual Testing) left unchecked as it requires browser testing

### File List

**Created:**
- src/components/Navigation.tsx (Client Component - sticky nav with smooth scroll)
- src/components/Footer.tsx (Server Component - minimal footer with copyright)
- src/components/ui/sheet.tsx (shadcn Sheet component for mobile menu)

**Modified:**
- src/app/(frontend)/page.tsx (added Navigation, Footer, main id, contact placeholder)
- src/components/HeroSection.tsx (added id="hero" attribute)
- _bmad-output/implementation-artifacts/sprint-status.yaml (status: in-progress -> review)
- package.json (shadcn sheet component dependencies)
- pnpm-lock.yaml (shadcn sheet component dependencies)

### Change Log

- 2026-03-08: Code review fixes - Added SheetTitle for screen reader accessibility, added motion-reduce support to header transition, added aria-label to footer, improved contact placeholder section
- 2026-03-08: Implemented Story 2.7 - Created Navigation and Footer components, integrated into homepage layout with proper accessibility features
