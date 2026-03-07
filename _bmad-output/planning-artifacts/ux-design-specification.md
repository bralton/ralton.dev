---
stepsCompleted:
  [
    step-01-init,
    step-02-discovery,
    step-03-core-experience,
    step-04-emotional-response,
    step-05-inspiration,
    step-06-design-system,
    step-07-defining-experience,
    step-08-visual-foundation,
    step-09-design-directions,
    step-10-user-journeys,
    step-11-component-strategy,
    step-12-ux-patterns,
    step-13-responsive-accessibility,
    step-14-complete,
  ]
inputDocuments:
  - prd.md
  - product-brief-personal_website-2026-03-06.md
---

# UX Design Specification personal_website

**Author:** Ben
**Date:** 2026-03-06

---

## Executive Summary

### Project Vision

A personal portfolio website providing Ben with editorial control over his professional online presence. The site showcases work experience, projects, and skills with a minimalist dark-mode aesthetic featuring distinctive dark green branding. Built on Next.js with Payload CMS, it bridges the gap between "fully automatic but no control" and "fully manual and tedious" — offering LinkedIn-mirrored data with simple visibility toggles for curation.

### Target Users

**Primary Users:**

- **Recruiters** — Assessing Ben for full-time or contract roles; need quick credibility signals and evidence of recent activity
- **Potential Clients** — Evaluating expertise for freelance projects; looking for relevant tech stack experience and project examples

**Secondary Users:**

- **Peer Developers** — Exploring Ben's work via GitHub; interested in tech choices, open source contributions, and collaboration potential

**Admin User:**

- **Ben** — Managing content via Payload CMS admin panel; requires simple visibility toggles without code changes

### Key Design Challenges

1. **First Impression Speed** — Recruiters decide within seconds; the hero section must communicate expertise and professionalism instantly
2. **Scannable Content** — Work experience and projects must be digestible at a glance without feeling like a resume dump
3. **Dark Green Accessibility** — The signature accent color must meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for UI elements) against dark backgrounds
4. **Mobile-First Hierarchy** — Content structure must work vertically for phone-based browsing, the primary context for recruiters

### Design Opportunities

1. **GitHub Commit Graph as Trust Signal** — Real contribution activity adds authenticity and credibility beyond static content
2. **Dark Mode as Brand Differentiator** — Most developer portfolios default to light themes; dark mode with green accents creates memorable visual identity
3. **Effortless Admin Experience** — Visibility toggles and simple content editing make maintenance feel lightweight, encouraging regular updates

## Core User Experience

### Defining Experience

The core user action is **credibility assessment** — visitors arrive to quickly determine if Ben is worth contacting. Within seconds and a single scroll, users must "get" who Ben is. Everything else (projects, experience, contact) serves this primary assessment loop.

### Platform Strategy

- **Platform:** Web only, responsive design
- **Primary Context:** Mobile-first (recruiters browse on phones)
- **Input Methods:** Touch and mouse/keyboard support
- **Offline:** Not required
- **Device Capabilities:** Standard web features; no native APIs needed

### Effortless Interactions

1. **Smooth Content Scanning** — Zero jank scrolling, no layout shifts, instant visual hierarchy
2. **At-a-Glance Project Assessment** — Tech stack visible without clicking; relevant work identifiable in seconds
3. **Frictionless Contact** — Minimal form fields, instant submission confirmation
4. **One-Click Admin Toggles** — Visibility changes require single click, reflect immediately

### Critical Success Moments

| Moment                   | What Success Feels Like                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| **First 5 Seconds**      | "This person is professional" — clean layout, clear headline, distinctive branding |
| **Project Discovery**    | "This matches what I need" — relevant tech stack found without effort              |
| **Contact Submission**   | "Done" — instant confirmation, no uncertainty                                      |
| **Admin Content Update** | "That was easy" — toggle click, immediate result                                   |

### Experience Principles

1. **Credibility in Seconds** — Every pixel above the fold serves the "Is this person legit?" question
2. **Scannable Over Readable** — Structure content for skim-first; provide details for those who dig deeper
3. **Zero-Friction Contact** — The path from "interested" to "message sent" must be effortless
4. **Lighter Than a Doc** — Admin content management should feel simpler than editing a Google Doc

## Desired Emotional Response

### Primary Emotional Goals

| Emotion       | Description                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------- |
| **Impressed** | Visitors immediately recognize professional competence — "This person knows their stuff"    |
| **Trust**     | Authenticity confirmed through real activity and work — "This is a legitimate professional" |
| **Curious**   | Engagement drives deeper exploration — "I want to see more of their work"                   |
| **Confident** | Low friction enables action — "I can easily reach out"                                      |

### Emotional Journey Mapping

| Stage                 | Target Emotion          | Design Support                                          |
| --------------------- | ----------------------- | ------------------------------------------------------- |
| **First Discovery**   | Professional impression | Clean dark layout, distinctive branding, clear headline |
| **Exploration**       | Growing respect         | Well-organized experience, quality project descriptions |
| **Project Discovery** | Recognition of fit      | Visible tech stacks, relevant work easily found         |
| **Contact Decision**  | Confidence to act       | Clear CTA, minimal form friction                        |
| **Post-Contact**      | Certainty               | Instant confirmation, professional acknowledgment       |

### Micro-Emotions

| Positive State | Negative to Avoid | Design Approach                                                   |
| -------------- | ----------------- | ----------------------------------------------------------------- |
| Confidence     | Confusion         | Clear navigation, obvious visual hierarchy                        |
| Trust          | Skepticism        | GitHub activity graph, real project links, professional aesthetic |
| Accomplishment | Frustration       | Instant form feedback, smooth interactions                        |
| Interest       | Boredom           | Distinctive dark green branding, memorable visual identity        |

### Design Implications

1. **Dark Mode + Clean Layout** — Signals professionalism and modern technical sensibility
2. **GitHub Commit Graph** — Builds trust through authentic, verifiable activity
3. **Typography Hierarchy** — Creates confident navigation and scannable content
4. **Smooth Micro-Interactions** — Demonstrates attention to detail and technical competence
5. **Instant Feedback** — Contact form confirmation provides certainty and closure

### Emotional Design Principles

1. **First Impressions Are Everything** — Visitors decide within seconds; every above-fold element must reinforce professionalism
2. **Authenticity Builds Trust** — Real data (GitHub activity, actual projects) outweighs polished but empty content
3. **Friction Destroys Confidence** — Any hesitation or confusion undermines the "competent professional" impression
4. **Delight Through Details** — Subtle polish in animations and interactions signals quality craftsmanship

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

| Product             | Key UX Strength                                             | Applicable Learning                              |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| **Linear**          | Dark mode aesthetic, subtle animations, professional polish | Motion should feel intentional, never decorative |
| **Stripe**          | Typography hierarchy, information density without clutter   | Clear visual hierarchy enables scanning          |
| **GitHub Profiles** | Activity graphs as credibility, real data integration       | Authentic activity beats polished emptiness      |
| **Vercel**          | Minimalist dark theme, every element earns its space        | Restraint creates impact                         |

### Transferable UX Patterns

**Navigation:**

- Single-page scroll with sticky header and section anchors
- Minimal nav items (logo + 4-5 key sections max)

**Content Structure:**

- Hero: Name, tagline, one-line intro — instant clarity above fold
- Work experience as scannable timeline or cards
- Projects as cards with visible tech stack badges
- GitHub commit graph embedded for authenticity

**Interaction Design:**

- Smooth scroll between sections
- Subtle hover states on interactive elements
- Inline form validation for confidence

### Anti-Patterns to Avoid

| Anti-Pattern           | Risk                                  | Alternative                                  |
| ---------------------- | ------------------------------------- | -------------------------------------------- |
| Complex animations     | Distracts, signals inexperience       | Subtle, purposeful motion                    |
| Creative navigation    | Increases cognitive load, bounce rate | Conventional nav, distinctive aesthetics     |
| Multiple accent colors | Dilutes brand identity                | Single accent (dark green) used consistently |
| Text walls             | Visitors skim, don't read             | Scannable chunks, clear hierarchy            |
| Autoplay media         | Jarring, unprofessional               | Static content, user-initiated interaction   |

### Design Inspiration Strategy

**Adopt:**

- Dark mode with single accent color — creates memorable identity
- GitHub activity integration — proven trust builder
- Tech stack badges — instant project categorization

**Adapt:**

- Card-based layouts — simplified for portfolio scale
- Single-page structure — sections flow naturally via scroll
- Minimal sticky navigation — smooth anchor links

**Avoid:**

- Animated backgrounds/particles — signals "junior developer"
- Page transitions — unnecessary complexity for single-page
- Competing visual elements — restraint creates impact

## Design System Foundation

### Design System Choice

**Selected System:** shadcn/ui with Tailwind CSS

shadcn/ui provides the ideal balance for this project: accessible, themeable components that integrate seamlessly with Next.js while allowing full brand customization.

### Rationale for Selection

| Requirement                 | How shadcn/ui Delivers                             |
| --------------------------- | -------------------------------------------------- |
| Dark mode branding          | First-class dark mode support via CSS variables    |
| Dark green accent           | Full theme customization via Tailwind config       |
| Accessibility (WCAG 2.1 AA) | Radix UI primitives with built-in a11y             |
| Next.js compatibility       | Designed specifically for React/Next.js            |
| Minimal bundle              | Copy-paste architecture — only include what's used |
| Speed to build              | Pre-built components reduce development time       |

### Implementation Approach

**Theme Configuration:**

- Default to dark mode (no toggle for MVP)
- Primary accent: Dark green (teal-green range, e.g., `#0d9488`)
- Background: Near-black neutrals
- Text: High-contrast whites/grays
- CSS variables for consistent theming

**Component Strategy:**
| Category | shadcn Components | Custom Components |
|----------|-------------------|-------------------|
| Navigation | `NavigationMenu` | — |
| Content | `Card`, `Badge` | GitHub Commit Graph |
| Forms | `Input`, `Textarea`, `Button` | — |
| Layout | Base primitives | Hero, Timeline |
| Feedback | `Toast` | — |

### Customization Strategy

**Brand Layer:**

- Override shadcn CSS variables with dark green palette
- Custom font stack (system fonts or selected web fonts)
- Consistent spacing scale via Tailwind config

**Component Overrides:**

- Card hover states with green accent
- Button variants for primary (green) and secondary (gray)
- Badge styling for tech stack tags
- Form inputs styled for dark backgrounds

**Custom Implementations:**

- GitHub Commit Graph: Custom SVG/Canvas component
- Hero Section: Custom layout composition
- Experience Timeline: Adapted from common patterns

## Defining Experience

### Core Interaction

The defining experience for this portfolio is **passive credibility assessment**: visitors scan and decide if Ben is the right fit in under 30 seconds. Unlike interactive products, the UX challenge is guiding the user's eye to the right information at the right pace.

**One-sentence description:** "Scan Ben's portfolio and know if he's worth contacting — instantly."

### User Mental Model

| Aspect        | User Expectation                                                          |
| ------------- | ------------------------------------------------------------------------- |
| Entry Context | Arrived from LinkedIn, GitHub, or referral — already partially interested |
| Primary Goal  | Quick validation of initial impression                                    |
| Mental State  | Comparing to other candidates; time-constrained                           |
| Time Budget   | 30 seconds to 2 minutes for initial assessment                            |
| Decision Type | Binary: worth contacting or not                                           |

### Success Criteria

| Milestone               | Time Target | Indicator                         |
| ----------------------- | ----------- | --------------------------------- |
| Credibility established | 5 seconds   | Hero communicates professionalism |
| Relevance confirmed     | 15 seconds  | Relevant project or skill found   |
| Decision made           | 30 seconds  | User decides to contact or leave  |
| Contact initiated       | 60 seconds  | Form submitted successfully       |

### Pattern Analysis

**Pattern Type:** Established (not novel)

This portfolio uses universally understood patterns — no user education required:

- Hero section with name and title — universal portfolio pattern
- Section-based single-page scroll — standard portfolio structure
- Card-based project display — familiar content organization
- Contact form at bottom — expected conversion placement

**Innovation approach:** Quality of execution, not interaction paradigm. Polish, speed, and distinctive dark green branding create differentiation.

### Experience Mechanics

**Initiation:**

- Direct page load — no splash screen, no loading animation
- Hero immediately visible with clear name, headline, tagline
- Dark mode + green accent establishes brand in first frame

**Interaction:**

- Vertical scroll through content sections
- Sticky navigation for orientation and quick jumps
- Cards as visual anchors for scanning
- Hover states signal interactivity

**Feedback:**

- Smooth scroll confirms responsive navigation
- Section headers confirm page position
- Interactive elements respond immediately

**Completion:**

- Contact form → instant success toast
- Clear "message sent" confirmation
- Social links visible for alternative connection paths

## Visual Design Foundation

### Color System

**Primary Palette:**

| Role           | Color             | Hex       | Usage                    |
| -------------- | ----------------- | --------- | ------------------------ |
| Background     | Near-black        | `#09090b` | Page background          |
| Surface        | Dark gray         | `#18181b` | Cards, elevated elements |
| Border         | Subtle gray       | `#27272a` | Dividers, card borders   |
| Primary        | Dark green (teal) | `#0d9488` | Accent, CTAs, links      |
| Primary Hover  | Lighter green     | `#14b8a6` | Hover states             |
| Text Primary   | Off-white         | `#fafafa` | Headings, important text |
| Text Secondary | Light gray        | `#a1a1aa` | Body text, descriptions  |
| Text Muted     | Dim gray          | `#71717a` | Captions, metadata       |

**Semantic Colors:**

| State   | Color | Hex       |
| ------- | ----- | --------- |
| Success | Green | `#22c55e` |
| Warning | Amber | `#f59e0b` |
| Error   | Red   | `#ef4444` |

### Typography System

**Font Stack:**

- Primary: Inter (system fonts fallback)
- Monospace: JetBrains Mono (code, tech badges)

**Type Scale:**

| Element | Desktop | Mobile | Weight |
| ------- | ------- | ------ | ------ |
| H1      | 48px    | 36px   | 700    |
| H2      | 32px    | 24px   | 600    |
| H3      | 20px    | 20px   | 600    |
| Body    | 16px    | 16px   | 400    |
| Small   | 14px    | 14px   | 400    |
| Caption | 12px    | 12px   | 400    |

### Spacing & Layout Foundation

**Base Unit:** 4px

**Layout:**

- Max content width: 1200px
- Content padding: 16px (mobile) → 24px (tablet) → 32px (desktop)
- Section spacing: 64px vertical gaps
- Card padding: 16px internal, 8px element gaps

**Responsive Breakpoints:**

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Accessibility Considerations

- All text colors meet WCAG 2.1 AA contrast requirements (4.5:1 body, 3:1 large text)
- Primary green (`#0d9488`) tested against dark backgrounds for compliance
- Minimum touch target: 44x44px on mobile
- Focus indicators: 2px green outline on interactive elements
- No color-only information conveyance (icons + text for states)

## Design Direction Decision

### Design Directions Explored

Three layout approaches were evaluated:

| Direction           | Approach                                        | Consideration           |
| ------------------- | ----------------------------------------------- | ----------------------- |
| A: Classic Vertical | Standard single-page scroll with clear sections | Most familiar to users  |
| B: Hero-Heavy       | Full-screen hero with dense subsequent sections | Strong first impression |
| C: Bento Grid       | Modern grid layout with varied card sizes       | Visual interest         |

### Chosen Direction

**Primary: Direction A (Classic Vertical Scroll)** with selective elements from B and C.

**Layout Structure:**

1. Hero section (85vh, not full-screen — hint of content below)
2. About section with photo and bio
3. Work Experience as timeline/cards
4. Projects as card grid
5. GitHub commit graph
6. Contact form with social links
7. Minimal footer

### Design Rationale

| Decision           | Rationale                                     |
| ------------------ | --------------------------------------------- |
| Vertical scroll    | Matches user expectations for portfolio sites |
| 85vh hero          | Strong impression without hiding content      |
| Card-based content | Scannable, familiar, responsive-friendly      |
| Single-page        | No navigation complexity, smooth flow         |
| Sticky nav         | Orientation without interrupting scroll       |

### Implementation Approach

**Section Order (scroll sequence):**

1. Hero — Name, headline, tagline, CTA buttons
2. About — Brief bio, photo, key highlights
3. Experience — Work history with visibility toggles
4. Education — Academic background (if visible)
5. Projects — Featured work with tech stacks
6. Skills — Technical competencies
7. GitHub — Commit graph integration
8. Contact — Form + social links

**Responsive Behavior:**

- Mobile: Full-width sections, stacked cards
- Tablet: 2-column card grids where appropriate
- Desktop: Max-width container (1200px), comfortable reading width

## User Journey Flows

### Journey 1: Recruiter Assessment

**Goal:** Quickly assess Ben's fit for a role and reach out

**Flow:**

1. Land on site → Hero establishes professionalism (5 sec)
2. Scroll to Experience → Scan work history (15 sec)
3. Check Projects → View tech stacks (30 sec)
4. Notice GitHub activity → Credibility confirmed
5. Scroll to Contact → Submit inquiry (60 sec)

**Critical Success Points:**

- Hero communicates expertise instantly
- Experience is scannable, not a wall of text
- Tech stacks visible on project cards without clicking
- Contact form submission is instant with clear confirmation

### Journey 2: Client Evaluation

**Goal:** Determine if Ben is the right fit for a project

**Flow:**

1. Arrive via referral → Hero + About section
2. Read specialties and focus areas
3. Browse Projects → Find similar tech stack
4. Read project descriptions for evidence
5. Submit contact form with project details

**Critical Success Points:**

- About section clearly states specialties
- Projects have enough context for fit assessment
- Message field accommodates detailed project descriptions

### Journey 3: Peer Developer Exploration

**Goal:** Learn about the person behind the GitHub commits

**Flow:**

1. Click from GitHub profile → Land on portfolio
2. Browse Projects → Click repo links
3. Explore code on GitHub
4. Check commit graph for activity level
5. Follow on GitHub for future connection

**Critical Success Points:**

- GitHub links prominent and functional
- Repo links on project cards work correctly
- Commit graph displays real activity data

### Journey 4: Admin Content Management

**Goal:** Update site content without code changes

**Flow:**

1. Navigate to /admin → Payload login
2. Access content collection (Experience/Projects/About)
3. Edit content or toggle visibility
4. Save changes → See confirmation
5. Preview site to verify

**Critical Success Points:**

- Login is quick and reliable
- Visibility toggles are prominent in edit UI
- Changes reflect immediately or with clear guidance

### Journey Patterns

**Navigation:** Single-page scroll with sticky nav; /admin for CMS access
**Decisions:** Binary assessment ("relevant?") with progressive commitment
**Feedback:** Inline validation, instant toasts, hover states for interactivity
**External Links:** Open in new tabs (GitHub, LinkedIn)

## Component Strategy

### Design System Components (shadcn/ui)

| Component        | Portfolio Usage                 |
| ---------------- | ------------------------------- |
| Button           | CTAs, form submit, social links |
| Card             | Base for custom cards           |
| Badge            | Tech stack tags                 |
| Input / Textarea | Contact form                    |
| Toast            | Form feedback                   |
| NavigationMenu   | Sticky header nav               |

### Custom Components

#### Hero Section

- **Purpose:** Establish identity in 5 seconds
- **Content:** Name (H1), headline (H2), tagline, CTA buttons
- **Height:** 85vh desktop, 70vh mobile
- **Styling:** Centered content, green accent on CTAs

#### Experience Card

- **Purpose:** Scannable work history display
- **Content:** Job title, company, dates, description
- **States:** Default, hover (elevation)
- **Admin:** Visibility toggle support

#### Project Card

- **Purpose:** Showcase projects with visible tech stacks
- **Content:** Title, description, tech badges, links
- **States:** Default, hover (green border highlight)
- **Links:** Repo and demo open in new tab

#### GitHub Commit Graph

- **Purpose:** Display authentic contribution activity
- **Data:** GitHub API contribution data
- **States:** Loading, loaded, error (fallback message)
- **Styling:** Green cells matching brand

#### Contact Form

- **Fields:** Name, Email, Message (all required)
- **Validation:** Inline on blur, email format
- **Feedback:** Success toast, inline error messages
- **Submit:** Rate-limited, instant confirmation

#### Section Header

- **Content:** H2 title, optional subtitle
- **Styling:** Green accent (underline or left border)
- **Semantics:** Proper heading hierarchy, scroll anchor

### Implementation Roadmap

| Phase | Components                         | Priority          |
| ----- | ---------------------------------- | ----------------- |
| 1     | Hero, Section Header, Contact Form | Core structure    |
| 2     | Experience Card, Project Card      | Content display   |
| 3     | GitHub Graph, Skills Grid          | Enhanced features |

## UX Consistency Patterns

### Button Hierarchy

| Type      | Usage               | Style                        |
| --------- | ------------------- | ---------------------------- |
| Primary   | Main CTAs           | Green background, white text |
| Secondary | Alternative actions | Green border, green text     |
| Ghost     | Tertiary/nav        | No border, hover underline   |
| Icon      | Social links        | Icon only, hover green       |

**States:** Default → Hover → Active → Focus (green ring)

### Feedback Patterns

| State   | Visual                  | Behavior            |
| ------- | ----------------------- | ------------------- |
| Success | Green toast + checkmark | Auto-dismiss 5s     |
| Error   | Red inline + X icon     | Persist until fixed |
| Loading | Spinner or skeleton     | Replace content     |

**Toast Position:** Bottom-right (desktop), bottom-center (mobile)

### Form Patterns

| Phase      | Behavior                          |
| ---------- | --------------------------------- |
| Empty      | Placeholders, no validation       |
| Blur       | Validate field, show inline error |
| Submit     | Validate all, focus first error   |
| Submitting | Disable button, show spinner      |
| Success    | Clear form, success toast         |

**Validation:** Inline below input, red text, specific messages

### Navigation Patterns

- **Sticky Nav:** Fixed top, semi-transparent on scroll
- **Section Links:** Smooth scroll with nav offset
- **Mobile:** Hamburger → slide-in menu
- **External:** New tab + external icon indicator

### Loading States

- **GitHub Graph:** Skeleton → fade in
- **Images:** Lazy load with blur placeholder
- **Form Submit:** Button spinner, disabled

### Link Patterns

| Type             | Behavior                       |
| ---------------- | ------------------------------ |
| Internal section | Smooth scroll, underline hover |
| External         | New tab, external icon         |
| Social           | Icon button, hover green       |

## Responsive Design & Accessibility

### Responsive Strategy

**Approach:** Mobile-first design with progressive enhancement

| Device              | Layout                                         |
| ------------------- | ---------------------------------------------- |
| Mobile (< 768px)    | Single column, hamburger nav, full-width cards |
| Tablet (768-1024px) | 2-column grids, touch-optimized spacing        |
| Desktop (> 1024px)  | Max-width 1200px, comfortable reading width    |

### Breakpoints

| Breakpoint | Value  | CSS Approach             |
| ---------- | ------ | ------------------------ |
| sm         | 640px  | Mobile-first (min-width) |
| md         | 768px  | Tablet switch            |
| lg         | 1024px | Desktop layout           |
| xl         | 1280px | Large desktop cap        |

### Accessibility (WCAG 2.1 AA)

| Requirement    | Standard                       |
| -------------- | ------------------------------ |
| Color Contrast | 4.5:1 body, 3:1 large text     |
| Keyboard       | All elements focusable         |
| Screen Readers | Semantic HTML, ARIA labels     |
| Touch Targets  | 44x44px minimum                |
| Focus          | 2px green outline              |
| Skip Links     | "Skip to content" for keyboard |

### Testing Strategy

| Type          | Tools                           |
| ------------- | ------------------------------- |
| Responsive    | Chrome DevTools, real devices   |
| Browsers      | Chrome, Firefox, Safari, Edge   |
| Accessibility | Axe-core, Lighthouse, VoiceOver |
| Keyboard      | Manual tab navigation           |

### Implementation Guidelines

**Responsive:**

- Tailwind responsive prefixes
- Relative units (rem, %, vw)
- CSS Grid/Flexbox layouts
- Fluid images

**Accessibility:**

- Semantic HTML elements
- Proper heading hierarchy
- ARIA labels where needed
- `prefers-reduced-motion` support
