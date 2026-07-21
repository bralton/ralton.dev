---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - ux-design-specification-redesign.md
  - redesign-mockup-approved.html
  - prd.md (NFR carryovers only — FRs 1–54 shipped under epics 1–9)
  - architecture.md
relatedEpics: epics/ (v1, epics 1–9 — numbering continues at 10)
---

# personal_website - Epic Breakdown — Frontend Redesign

## Overview

This document provides the epic and story breakdown for the **frontend redesign** of personal_website, decomposing the redesign UX specification (`ux-design-specification-redesign.md`) into implementable stories. Backend, Payload collections, and admin are out of scope and unchanged. Requirements use FR-R / NFR-R numbering to avoid collision with the v1 PRD's FR1–54. Epic numbering continues from the existing v1 set (epics 1–9).

## Requirements Inventory

### Functional Requirements

FR-R1: Design tokens (12-color palette, type scale, spacing, radii per UX spec §Visual Design Foundation) are defined as CSS custom properties in `globals.css`; components reference tokens, never raw hex values.
FR-R2: A shared `Section` wrapper component owns all section vertical rhythm (~96px top desktop / ~64px mobile, ~16px bottom); no section or child component sets its own vertical section padding.
FR-R3: A `SectionHeader` component renders the mono `~/label` (teal, `~/` prefix in tertiary), a flex hairline rule, and an optional right-aligned mono meta slot, while preserving `<h2>` semantics.
FR-R4: Navigation is reduced to logo + wordmark (links home/top) and four items — Projects, Experience, Writing, `get in touch →` CTA — sticky at 56px with blur backdrop; below 900px only wordmark + CTA remain (no hamburger).
FR-R5: The hero renders as a two-column split (1.15fr/1fr): left — avatar, `$ whoami` prompt, name, role, pitch, six skill chips, primary + ghost CTAs (all from Hero global, About photo, Skills collection); right — the ProofPanel.
FR-R6: The ProofPanel server-renders the GitHub contribution graph (5-shade teal scale, 26 weeks desktop / trailing weeks mobile) plus a 3-stat row (contributions from GitHubData; years derived from earliest Experience; cert label from Education) with zero layout shift.
FR-R7: If GitHubData is stale or missing, the ProofPanel hides the graph but retains the stats row; the page renders without error.
FR-R8: The homepage renders exactly five sections — hero, `~/projects`, `~/experience`, `~/writing`, `~/contact` — plus footer; `AboutSection`, `SkillsSection`, `EducationSection`, and the standalone `GitHubGraph` band are removed from the page and their content re-homed per the UX spec.
FR-R9: Project cards render thumbnail (Media image or generated-SVG fallback), title, `StatusBadge` (active = teal / archived = grey), one-sentence summary, tags, external repo link, and a collapsed full write-up in a native `<details>` element.
FR-R10: Clicking anywhere on a project card (excluding links, and ignoring clicks that complete a text selection) toggles its write-up; the `<summary>` control remains independently keyboard-operable.
FR-R11: The experience section renders a 1.5fr/1fr split: timeline of Experience entries (teal-ringed dot when end date is empty, dot aligned to the item header) beside a sidebar of Education rows and a six-line categorized skills "toolbox".
FR-R12: The timeline shows the four most recent roles; older roles render inside a `+ earlier roles` `<details>` expander which self-hides when four or fewer roles exist. All CMS entries always render somewhere — nothing is dropped.
FR-R13: `~/writing` renders the three latest posts as `PostCard`s (mono date, title, ~120-char excerpt, `read →`) with an `all posts →` link to `/blog`.
FR-R14: `~/contact` renders a 1fr/1.2fr split: blurb + SocialLinks beside the existing contact form restyled to tokens; submission logic, validation, and notifications are unchanged; success replaces the form with a mono confirmation line.
FR-R15: Any section whose data source is empty renders nothing at all (no header, no gap); missing optional data collapses element-level (e.g., no thumbnail → text-only card top).
FR-R16: Blog index and post pages adopt the new tokens, nav, and section-header styling; post body remains a single ~65ch reading column.
FR-R17: Blog post pages end with an `AuthorFooterCard` (avatar, one-line pitch, home link) and a "more posts" row.
FR-R18: The footer renders a hairline rule, copyright line, and `uptime: excellent` in mono.
FR-R19: The homepage total scroll height on desktop is ≤ ~4 viewports with current content volume (v1 baseline ~10).

### NonFunctional Requirements

NFR-R1: WCAG 2.1 AA maintained site-wide: all text token pairs ≥ 4.5:1 (verify `--text-3` on `--panel` at implementation; bump token if failing), 2px teal focus ring with 2px offset on every interactive element, ≥44px touch targets, skip-to-content retained.
NFR-R2: The existing Lighthouse accessibility CI gate must remain green; redesigned blog routes are added to the Lighthouse run if not covered.
NFR-R3: `prefers-reduced-motion` disables all transitions and smooth scrolling; permitted motion is limited to border-color, expander height (~200ms), and smooth scroll.
NFR-R4: Contribution graph is `aria-hidden` with a text alternative; `<ul role="list">`/`aria-label` conventions carried from v1; decorative SVGs `aria-hidden`; expanders are native `<details>/<summary>`.
NFR-R5: Client-side JavaScript is limited to card-click toggling and nav behavior; all data-bearing components are server components; no client data fetching introduced.
NFR-R6: No Payload schema changes; every rendered element maps to existing globals/collections/fields (the CMS is the contract).
NFR-R7: Single primary responsive breakpoint at 900px (Tailwind defaults permitted for minor adjustments, e.g. 640px); container max-width 1120px with 24px side padding.
NFR-R8: JetBrains Mono is used only for the defined mono vocabulary (labels, prompts, dates, tags, badges, stats, form-flight states, footer); reading prose is always Inter.
NFR-R9: Existing security headers, CSP, and admin protections are untouched by the redesign.

### Additional Requirements

- The approved mockup (`redesign-mockup-approved.html`) is the visual source of truth; where spec is silent, match the mockup. Where mockup and spec disagree, the spec wins.
- Retired components (`AboutSection`, `SkillsSection`, `EducationSection`, standalone `GitHubGraph`) are deleted from the codebase once replacements ship (same epic — no dead code left).
- Implementation follows the spec's three phases: (1) tokens + Section/SectionHeader + hero; (2) remaining homepage sections + footer; (3) blog re-theme + retirement/cleanup.
- Local build verification uses `npx next build` (no DB); Lighthouse/sitemap/robots CI on PR per existing workflows.
- Prettier conventions and `@/` import alias per CLAUDE.md; PascalCase component filenames.

### FR Coverage Map

FR-R1: Epic 10 - Design tokens in globals.css
FR-R2: Epic 10 - Section rhythm-owner component
FR-R3: Epic 10 - SectionHeader (~/label + rule + meta)
FR-R4: Epic 10 - Reduced sticky navigation
FR-R5: Epic 10 - Hero two-column intro
FR-R6: Epic 10 - ProofPanel with contribution graph + stats
FR-R7: Epic 10 - ProofPanel stale-data fallback
FR-R8: Epic 10 - Five-section homepage consolidation
FR-R9: Epic 10 - Project cards (thumb, badge, tags, details)
FR-R10: Epic 10 - Whole-card expansion interaction
FR-R11: Epic 10 - Experience timeline + sidebar split
FR-R12: Epic 10 - Four visible roles + earlier-roles expander
FR-R13: Epic 10 - Latest three posts section
FR-R14: Epic 10 - Contact split with restyled form
FR-R15: Epic 10 - Empty/degraded state suppression
FR-R16: Epic 11 - Blog index + post pages re-themed
FR-R17: Epic 11 - AuthorFooterCard + more-posts row
FR-R18: Epic 10 - Footer (hairline, copyright, uptime)
FR-R19: Epic 10 - Homepage <= ~4 viewports

NFR-R1 through NFR-R9: cross-cutting - bind all stories in Epics 10 and 11.

## Epic List

### Epic 10: Redesigned Homepage Experience

Visitors experience the complete new homepage: dense five-section layout, hero with live proof panel, expandable project cards, timeline with sidebar, latest writing, and restyled contact — with the old nine-section layout and its retired components fully replaced and removed. Tokens land here; ships as one coherent visual change delivering the entire "land, get it, wander" experience standalone.
**FRs covered:** FR-R1, FR-R2, FR-R3, FR-R4, FR-R5, FR-R6, FR-R7, FR-R8, FR-R9, FR-R10, FR-R11, FR-R12, FR-R13, FR-R14, FR-R15, FR-R18, FR-R19

### Epic 11: Unified Blog Reading Experience

Readers arriving at blog routes (index or shared post links) get the same visual identity as the homepage: new tokens and nav, section-header styling, comfortable reading column, and post pages ending with an author card and "more posts" row — turning every shared post into a soft entry point to the site. Builds on Epic 10's foundation but delivers its own complete value; Epic 10 functions fully without it.
**FRs covered:** FR-R16, FR-R17

**Dependency note:** Epic 11 requires Epic 10's tokens/nav to exist. Stories within Epic 10 sequence per the UX spec phases: foundation (tokens, Section, nav) → hero → content sections → cleanup/retirement.

## Epic 10: Redesigned Homepage Experience

Visitors experience the complete new homepage — dense five-section layout, hero with live proof panel, expandable project cards, timeline with sidebar, latest writing, and restyled contact — with the old nine-section layout and its retired components fully replaced and removed.

### Story 10.1: New design tokens across the site

As a visitor,
I want the site rendered in the new visual palette,
So that every page immediately feels like the redesigned brand.

**Acceptance Criteria:**

**Given** the site loads any page
**When** styles apply
**Then** all 12 tokens from the UX spec (§Visual Design Foundation) are defined as CSS custom properties in `globals.css` and mapped into the Tailwind/shadcn theme config
**And** no component references raw hex values
**And** `--text-3` on `--panel` is verified ≥ 4.5:1 contrast (token bumped if it fails)
**And** the Lighthouse accessibility CI gate remains green

### Story 10.2: Condensed navigation and new footer

As a visitor,
I want a minimal sticky nav and a quiet footer,
So that wayfinding is effortless and the page starts and ends in the site's voice.

**Acceptance Criteria:**

**Given** any viewport ≥ 900px
**When** the page renders
**Then** the nav shows logo + wordmark (linking home/top) and exactly Projects / Experience / Writing / `get in touch →` (mono, teal-outline CTA), sticky at 56px with blur backdrop

**Given** a viewport < 900px
**When** the page renders
**Then** only wordmark + CTA remain (no hamburger)
**And** all targets are ≥ 44px

**Given** any page bottom
**Then** the footer renders a hairline rule, copyright line, and mono `uptime: excellent`

### Story 10.3: Hero with intro and GitHub proof panel

As a network visitor,
I want Ben's identity, pitch, and live activity in the first viewport,
So that I understand who he is and that he's active without scrolling.

**Acceptance Criteria:**

**Given** Hero global, About photo, Skills, GitHubData, Education, and Experiences data exist
**When** the homepage renders at 1440×900
**Then** the two-column hero (1.15fr/1fr: avatar, `$ whoami`, name, role, pitch, six skill chips, primary + ghost CTAs ⟂ ProofPanel with contribution graph and 3-stat row) fits within the first viewport
**And** it is server-rendered with zero layout shift, graph `aria-hidden` with text alternative

**Given** GitHubData is missing or stale
**When** the hero renders
**Then** the graph is hidden, the stats row remains, and the page renders without error

**Given** a viewport < 900px
**Then** the intro stacks above the panel and the graph shows trailing weeks at legible cell size

### Story 10.4: Section system and expandable project cards

As a visitor,
I want projects presented as scannable, expandable cards under a consistent section header,
So that I can skim or go deep on my terms.

**Acceptance Criteria:**

**Given** the Projects collection has entries
**When** `~/projects` renders
**Then** it uses the shared `Section` + `SectionHeader` components (vertical rhythm owned solely by `Section`; `<h2>` semantics preserved)
**And** cards render 2-up (1-up < 900px) with thumbnail (generated-SVG fallback), title, `StatusBadge` (active teal / archived grey), one-sentence summary, tags, `github ↗` external link, and collapsed `<details>` write-up

**Given** a project card
**When** I click anywhere except links, or after completing a text selection
**Then** the write-up toggles with the `+`/`−` glyph flip (~200ms height transition; instant under reduced motion)
**And** the `<summary>` element alone remains keyboard-operable

### Story 10.5: Experience timeline with education & toolbox sidebar

As a visitor,
I want Ben's career, education, and skills in one dense view,
So that his history is scannable without three separate sections.

**Acceptance Criteria:**

**Given** Experiences, Education, and Skills data exist
**When** `~/experience` renders
**Then** a 1.5fr/1fr split shows the timeline (teal-ringed dots for roles with no end date, dots aligned to item headers) beside education rows (name, institution, mono year range) and the six-line categorized toolbox

**Given** more than four roles exist
**Then** the four most recent render visible and the remainder render inside a `+ earlier roles` `<details>` expander

**Given** four or fewer roles exist
**Then** no expander renders
**And** every CMS experience entry renders somewhere — nothing is dropped

### Story 10.6: Latest writing section

As a visitor,
I want the three latest posts on the homepage,
So that I can see Ben writes and jump in.

**Acceptance Criteria:**

**Given** at least one published post exists
**When** `~/writing` renders
**Then** up to three `PostCard`s show (mono date, title, ~120-char excerpt, `read →`) with an `all posts →` link to `/blog`

**Given** zero published posts
**Then** the section renders nothing at all — no header, no gap

### Story 10.7: Contact section with side-by-side blurb and form

As a visitor,
I want contact options and the form together in one compact band,
So that reaching out takes one glance.

**Acceptance Criteria:**

**Given** `~/contact` renders
**Then** blurb + SocialLinks sit beside the restyled form (name/email row, message, primary submit) in a 1fr/1.2fr split, with submission logic, validation, and notifications unchanged

**When** submission succeeds
**Then** a mono teal confirmation line replaces the form, with social links still visible

**When** validation fails
**Then** plain-language inline errors render below fields in Inter (never mono), with semantic red

### Story 10.8: Five-section consolidation and component retirement

As a visitor,
I want one coherent five-section homepage,
So that the old sparse layout is fully gone.

**Acceptance Criteria:**

**Given** stories 10.1–10.7 are shipped
**When** the homepage renders
**Then** exactly hero + `~/projects` + `~/experience` + `~/writing` + `~/contact` + footer appear in that order
**And** `AboutSection`, `SkillsSection`, `EducationSection`, and the standalone `GitHubGraph` band are deleted from the codebase
**And** every section suppresses itself entirely when its data source is empty
**And** desktop scroll height is ≤ ~4 viewports with current content
**And** `npx next build` passes and Lighthouse/sitemap CI stays green

## Epic 11: Unified Blog Reading Experience

Readers arriving at blog routes get the same visual identity as the homepage — new tokens and nav, comfortable reading column, and post pages ending with an author card and "more posts" row — turning every shared post into a soft entry point to the site.

### Story 11.1: Blog index in the new visual identity

As a reader,
I want the blog index to match the redesigned site,
So that browsing posts feels like the same product as the homepage.

**Acceptance Criteria:**

**Given** `/blog` renders
**When** styles apply
**Then** the page uses the new tokens, the condensed nav (items linking back to `/#projects` etc.), the `~/writing`-style section header treatment, and `PostCard`s consistent with the homepage's
**And** existing pagination is restyled to tokens with unchanged behavior

**Given** a viewport < 900px
**Then** cards stack single-column with ≥ 44px touch targets

### Story 11.2: Blog posts with author card and onward path

As a reader arriving from a shared link,
I want a comfortable reading experience that ends with who wrote it and where to go next,
So that every post is a soft entry point to the site.

**Acceptance Criteria:**

**Given** a post page renders
**Then** it uses the new tokens + condensed nav, the body remains a single ~65ch reading column (Inter for prose; mono only for dates/tags/code)
**And** `CodeBlock` styling matches the token palette

**Given** the end of a post
**Then** an `AuthorFooterCard` renders (avatar, one-line pitch, home link) followed by a "more posts" row
**And** when no other posts exist, the row suppresses itself

**Given** the CI pipeline runs
**Then** blog routes are included in the Lighthouse accessibility audit and the gate stays green
