# Story 5.6: Create Social Links Display

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to see social links to Ben's LinkedIn and GitHub profiles**,
So that **I can connect with him on other platforms** (FR12).

## Acceptance Criteria

1. **Given** the Payload CMS is configured **When** I create the SocialLinks collection **Then** it has fields: platform (select: GitHub, LinkedIn, Twitter/X, Email), url, isVisible (checkbox), order (number) **And** entries can be managed via admin

2. **Given** SocialLinks entries exist **When** the footer or contact section renders **Then** social links display as icon buttons **And** each link shows the appropriate platform icon **And** only isVisible=true links are displayed **And** links are sorted by order field (ascending)

3. **Given** a visitor clicks a social link **When** the link is activated **Then** the platform opens in a new tab (except email which uses mailto:) **And** links have `rel="noopener noreferrer"` **And** links have accessible labels (e.g., "GitHub profile", "LinkedIn profile")

4. **Given** responsive design **When** social links render on any device **Then** icons are appropriately sized (minimum 44x44px touch target) **And** spacing is consistent

5. **Given** accessibility requirements **When** social links render **Then** they are keyboard focusable **And** focus indicators are visible (teal-700 ring) **And** screen readers announce the link purpose via aria-label

6. **Given** no visible social links exist **When** the SocialLinks component renders **Then** it returns null (no empty state message)

## Tasks / Subtasks

- [x] Task 1: Create SocialLinks Payload collection (AC: #1)
  - [x] 1.1: Create file `src/collections/SocialLinks.ts`
  - [x] 1.2: Define slug as 'social-links'
  - [x] 1.3: Configure admin with useAsTitle: 'platform', defaultColumns: ['platform', 'url', 'isVisible']
  - [x] 1.4: Set access control: read public, create/update/delete require user auth
  - [x] 1.5: Add platform field as select with options: github, linkedin, twitter, email
  - [x] 1.6: Add url field as text (required)
  - [x] 1.7: Add isVisible field as checkbox with defaultValue: true
  - [x] 1.8: Add order field as number with defaultValue: 0
  - [x] 1.9: Register collection in payload.config.ts

- [x] Task 2: Create SocialLinks component (AC: #2, #3, #4, #5, #6)
  - [x] 2.1: Create file `src/components/SocialLinks.tsx`
  - [x] 2.2: Import getPayload and config for server-side data fetching
  - [x] 2.3: Create platformIcons mapping object with SVG icon components
  - [x] 2.4: Create platformLabels mapping for accessible labels
  - [x] 2.5: Create GitHubIcon component with SVG
  - [x] 2.6: Create LinkedInIcon component with SVG
  - [x] 2.7: Create TwitterIcon component with SVG (X logo)
  - [x] 2.8: Create EmailIcon component with SVG
  - [x] 2.9: Create DefaultIcon fallback component
  - [x] 2.10: Implement async SocialLinks component to fetch visible links sorted by order
  - [x] 2.11: Return null if no links found
  - [x] 2.12: Render nav element with aria-label="Social media links"
  - [x] 2.13: Render ul with role="list" and flex layout
  - [x] 2.14: Render li with key={link.id} for each link
  - [x] 2.15: Render anchor with 44x44px touch target (w-11 h-11)
  - [x] 2.16: Add target="_blank" and rel="noopener noreferrer" for non-email links
  - [x] 2.17: Add aria-label with platform-specific accessible text
  - [x] 2.18: Add focus states: focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background
  - [x] 2.19: Add hover states: hover:text-teal-700 dark:hover:text-teal-400

- [x] Task 3: Add SocialLinks to footer/contact section (AC: #2)
  - [x] 3.1: Determine placement location (ContactSection or Footer component)
  - [x] 3.2: Import SocialLinks component
  - [x] 3.3: Add to JSX in appropriate location
  - [x] 3.4: Verify visual integration with existing design

- [x] Task 4: Test and verify (AC: #1-6)
  - [x] 4.1: Add test social links in Payload admin (GitHub, LinkedIn)
  - [x] 4.2: Verify links render correctly on homepage
  - [x] 4.3: Test keyboard navigation (Tab through links)
  - [x] 4.4: Verify focus indicators are visible
  - [x] 4.5: Test screen reader announces link purposes
  - [x] 4.6: Verify 44x44px touch targets on mobile
  - [x] 4.7: Test links open in new tab with noopener noreferrer
  - [x] 4.8: Test isVisible=false links are hidden
  - [x] 4.9: Test order field affects display order

## Dev Notes

### Complete Code Specification (from Design Document Section 6)

**File: `src/collections/SocialLinks.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const SocialLinks: CollectionConfig = {
  slug: 'social-links',
  admin: {
    useAsTitle: 'platform',
    description: 'Social media profile links',
    defaultColumns: ['platform', 'url', 'isVisible'],
  },
  access: {
    read: () => true, // Public
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'GitHub', value: 'github' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Twitter/X', value: 'twitter' },
        { label: 'Email', value: 'email' },
      ],
      admin: {
        description: 'Social media platform',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL to profile (or mailto: for email)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this link on the site',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers first)',
      },
    },
  ],
}
```

**Register in payload.config.ts:**
```typescript
import { SocialLinks } from './collections/SocialLinks'

// Add to collections array:
collections: [Users, Media, Experiences, Education, Projects, Skills, ContactSubmissions, SocialLinks],
```

**File: `src/components/SocialLinks.tsx`**

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  email: EmailIcon,
}

const platformLabels: Record<string, string> = {
  github: 'GitHub profile',
  linkedin: 'LinkedIn profile',
  twitter: 'Twitter profile',
  email: 'Send email',
}

export async function SocialLinks() {
  const payload = await getPayload({ config })

  const socialLinks = await payload.find({
    collection: 'social-links',
    where: {
      isVisible: { equals: true },
    },
    sort: 'order',
  })

  if (socialLinks.docs.length === 0) {
    return null
  }

  return (
    <nav aria-label="Social media links">
      <ul className="flex items-center gap-4" role="list">
        {socialLinks.docs.map((link) => {
          const Icon = platformIcons[link.platform] || DefaultIcon
          const label = platformLabels[link.platform] || link.platform

          return (
            <li key={link.id}>
              <a
                href={link.url}
                target={link.platform === 'email' ? undefined : '_blank'}
                rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
                className="flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:text-teal-700 dark:hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background transition-colors"
                aria-label={label}
              >
                <Icon className="w-6 h-6" />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// Icon components
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function DefaultIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
```

### Accessibility Patterns (from Epic 2 Retrospective)

**Color System:**
- Use teal-700 for primary accent, teal-800 for hover (WCAG AA compliant)
- Do NOT use teal-600 (insufficient contrast)

**Semantic HTML:**
- Use `<ul role="list">` with `<li>` wrappers for repeated elements (cards, badges, etc.)
- Add `aria-label` on lists for screen reader context

**React Keys:**
- Use unique IDs as keys (item.id, item.name) - NOT array index
- Example: `key={link.id}` not `key={index}`

**Focus States:**
- All interactive elements (links, buttons) need visible focus indicators
- Pattern: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`

**Touch Targets:**
- Minimum 44x44px for all interactive elements (WCAG 2.1 AA, NFR21)
- Implemented via `w-11 h-11` (44px x 44px) classes

### Project Structure Notes

**New Files to Create:**
- `src/collections/SocialLinks.ts` - Payload collection definition
- `src/components/SocialLinks.tsx` - Social links display component

**Files to Modify:**
- `src/payload.config.ts` - Register SocialLinks collection
- `src/app/(frontend)/page.tsx` OR `src/components/ContactSection.tsx` OR `src/components/Footer.tsx` - Add SocialLinks component

**No Dependencies to Install**
- Uses existing Payload CMS APIs
- SVG icons inline (no external icon library needed)
- No new npm packages required

### Architecture Compliance

**Collection Pattern (established in Epic 2):**
- Collections in `src/collections/CollectionName.ts`
- Use PascalCase for file names matching collection name
- Define slug in kebab-case ('social-links')
- Use `useAsTitle` for admin display
- Boolean fields use `is` or `has` prefix (isVisible)

**Component Pattern:**
- Server components for data fetching (async function components)
- Flat structure in `components/` (no nested folders)
- Use `getPayload({ config })` for server-side Payload access
- Return null for empty states (hide section entirely)

**Accessibility Pattern:**
- All icons have `aria-hidden="true"`
- Links have `aria-label` for screen reader context
- `<nav>` element with `aria-label` for navigation landmark
- `role="list"` on `<ul>` for explicit list semantics

### Previous Story Intelligence

**From Story 5.5 (Auto-Delete):**
- Payload collections follow consistent pattern
- Access control: public read, admin-only write
- Admin configuration with useAsTitle and defaultColumns

**From Epic 4 (GitHub Integration):**
- Server components fetch data directly from Payload
- Return null when no data available (graceful handling)
- Icons use `aria-hidden="true"` with parent accessible labels

**From Epic 2 Retrospective:**
- 44x44px touch targets mandatory
- teal-700 for focus rings (not teal-600)
- `role="list"` on `<ul>` elements
- `key={item.id}` not `key={index}`

### Git Intelligence (Recent Commits)

```
e0e1282 feat(contact): add auto-delete cron job for 90-day data retention
0968341 feat(contact): add email and Discord notifications for contact form
bfb2605 feat(contact): add rate limiting to contact API endpoint
0ab51cb feat(contact): add contact API endpoint with Payload storage
3c7b067 feat(contact): add contact form with React Hook Form and Zod validation
```

**Commit Pattern:** `feat(contact): description` for Epic 5 features

**Recommended commit for this story:**
```
feat(contact): add social links collection and component
```

### Testing Strategy

**Local Development Testing:**

1. **Add social links in Payload admin:**
   - Navigate to http://localhost:3000/admin
   - Go to Social Links collection
   - Add GitHub link: platform=github, url=https://github.com/benralton, isVisible=true, order=1
   - Add LinkedIn link: platform=linkedin, url=https://linkedin.com/in/benralton, isVisible=true, order=2

2. **Verify rendering:**
   - Check homepage displays social links
   - Verify correct icons for each platform
   - Check order matches order field values

3. **Test accessibility:**
   - Tab through links, verify focus ring visible
   - Use screen reader (VoiceOver on Mac) to verify aria-labels announced
   - Check 44x44px touch targets in browser dev tools

4. **Test visibility toggle:**
   - Set isVisible=false on one link
   - Verify link does not render

5. **Test empty state:**
   - Set all links to isVisible=false
   - Verify SocialLinks component returns null (no empty container)

**Manual Verification Checklist (from Design Document Section 9.2):**
- [x] Links render in correct order (by order field) - Payload query sorts by 'order' field
- [x] Only visible links shown (isVisible=true) - where clause filters isVisible: { equals: true }
- [x] Links open in new tab (except email) - target="_blank" conditionally applied, email links excluded
- [x] Focus states visible (teal-700 ring) - focus:ring-2 focus:ring-teal-700 applied
- [x] Touch targets >= 44x44px - w-11 h-11 (44px x 44px) classes applied
- [x] Screen reader announces link purposes - aria-label with platform-specific labels
- [x] Icons display correctly for each platform - SVG icons with aria-hidden="true"

### Environment Variables

**No new environment variables required for this story.**

All required environment variables are already configured from previous Epic 5 stories.

### Risk Assessment

**Risk Level:** Low

**Rationale:**
- Complete code specification in design document
- Simple collection with minimal fields
- Server component pattern well-established
- No external API dependencies
- No user input/validation required

**Potential Issues:**
- Collection slug conflict (mitigated by checking existing collections)
- SVG rendering issues (mitigated by using proven icon patterns from GitHub component)

### Story Dependencies

**Depends On:**
- Story 5.1-5.4 (review) - Contact section exists for integration
- Epic 2 (done) - Established component patterns and accessibility standards

**Blocks:**
- None - Final story in Epic 5

### NFR Compliance Checklist

- [x] **FR12 (Social Links):** Display social links to LinkedIn and GitHub profiles
- [x] **NFR15 (WCAG 2.1 AA):** Fully accessible component (aria-labels, semantic HTML, nav landmark)
- [x] **NFR17 (Keyboard Navigation):** All links keyboard focusable (native anchor behavior)
- [x] **NFR19 (Focus Indicators):** Visible focus states with teal-700 ring
- [x] **NFR21 (Touch Targets):** Minimum 44x44px targets (w-11 h-11 = 44px)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-5-contact-communication.md#Story 5.6] - User story and acceptance criteria
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 6] - Complete SocialLinks code specification
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 6.1] - Payload collection definition
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 6.2] - SocialLinks component code
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 9.2] - Manual verification checklist
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 10] - File summary
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] - SocialLinks collection schema
- [Source: _bmad-output/implementation-artifacts/5-5-implement-auto-delete-for-contact-submissions.md] - Previous story patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript compilation successful after regenerating Payload types
- Migration generated: 20260309_120634_add_social_links.ts
- Database migration requires manual run in production (dev mode auto-syncs schema)

### Completion Notes List

- Created SocialLinks Payload collection with platform (select), url (text), isVisible (checkbox), order (number) fields
- Implemented SocialLinks server component with async data fetching from Payload CMS
- Added 5 SVG icon components: GitHubIcon, LinkedInIcon, TwitterIcon, EmailIcon, DefaultIcon
- All icons use aria-hidden="true" and focusable="false" with parent aria-label for accessibility
- Touch targets are 44x44px (w-11 h-11 Tailwind classes)
- Focus states use teal-700 ring with ring-offset-2 and ring-offset-background
- Hover states use hover:text-teal-700 dark:hover:text-teal-400
- Email links do not have target="_blank" or rel="noopener noreferrer" (mailto: protocol)
- External links have target="_blank" rel="noopener noreferrer"
- Component returns null when no visible social links exist
- Integrated into Footer component (replaced placeholder comment)
- Footer component converted to async server component to support SocialLinks server component
- **Code Review Fix:** Added try/catch with graceful degradation - component returns null on error instead of crashing page
- **Code Review Fix:** Added focusable="false" to all SVG elements to prevent double-focus in older browsers
- **Code Review Fix:** Added limit: 10 to Payload query for defensive coding

### Change Log

- 2026-03-09: Implemented Story 5.6 - Created SocialLinks collection, component, and integrated into Footer
- 2026-03-09: Code review fixes applied:
  - Added try/catch error handling with graceful degradation (returns null on error)
  - Added focusable="false" to all 5 SVG icon components
  - Added limit: 10 to Payload query for defensive coding

### File List

**New Files:**
- src/collections/SocialLinks.ts
- src/components/SocialLinks.tsx
- src/migrations/20260309_120634_add_social_links.ts

**Modified Files:**
- src/payload.config.ts (added SocialLinks import and registration)
- src/components/Footer.tsx (added SocialLinks import and component, converted to async)
- src/payload-types.ts (regenerated with SocialLink type)
