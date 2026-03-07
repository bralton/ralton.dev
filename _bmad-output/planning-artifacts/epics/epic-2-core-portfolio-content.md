---
epic: 2
title: "Core Portfolio Content"
status: backlog
storyCount: 7
stories: ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7"]
frs: ["FR1", "FR2", "FR3", "FR4", "FR5", "FR6", "FR7", "FR32", "FR33", "FR34", "FR35", "FR36", "FR37", "FR38"]
nfrs: ["NFR7", "NFR15", "NFR16", "NFR17", "NFR18", "NFR19", "NFR20", "NFR21"]
shardedFrom: epics.md
date: 2026-03-07
---

# Epic 2: Core Portfolio Content

Visitors can view Ben's professional profile and navigate the complete site. Recruiters, clients, and peers can scan Ben's experience, projects, and skills on any device with full accessibility support.

## Story 2.1: Create Hero Section with Payload Collection

As a **visitor**,
I want **to see a hero section with Ben's name, headline, and tagline**,
So that **I immediately understand who Ben is and what he does** (FR1).

**Acceptance Criteria:**

**Given** the Payload CMS is configured
**When** I create the Hero global
**Then** the global has fields for: name, headline, tagline, and ctaButtons array
**And** ctaButtons contains label, url, and variant (primary/secondary)
**And** the global is editable via Payload admin

**Given** the Hero global exists with content
**When** a visitor loads the homepage
**Then** the HeroSection component displays the name as H1
**And** the headline displays as H2
**And** the tagline displays below the headline
**And** CTA buttons render with correct styling (primary green, secondary outline)

**Given** the hero section is rendered
**When** viewed on desktop (> 1024px)
**Then** the section height is 85vh
**And** content is centered vertically and horizontally
**And** max-width is 1200px

**Given** the hero section is rendered
**When** viewed on mobile (< 768px)
**Then** the section height is 70vh (FR36)
**And** content remains centered and readable
**And** touch targets are minimum 44x44px (NFR21)

**Given** accessibility requirements
**When** the hero section renders
**Then** proper heading hierarchy is maintained (FR33)
**And** color contrast meets 4.5:1 for text (FR35, NFR17)
**And** all interactive elements are keyboard focusable (FR32)
**And** focus indicators are visible (NFR19)

## Story 2.2: Create About Section with Payload Collection

As a **visitor**,
I want **to see an about section with Ben's background and specialties**,
So that **I can understand his expertise and focus areas** (FR2).

**Acceptance Criteria:**

**Given** the Payload CMS is configured
**When** I create the About global
**Then** the global has fields for: bio (rich text), photo (upload), highlights (array of strings)
**And** the photo field accepts image uploads
**And** the global is editable via Payload admin

**Given** the About global exists with content
**When** a visitor loads the homepage
**Then** the AboutSection component displays the bio text
**And** the photo displays with proper aspect ratio
**And** highlights display as a list or badges

**Given** the about section has a photo
**When** the section renders
**Then** the image uses Next.js Image component for optimization (NFR7)
**And** the image has descriptive alt text (FR34, NFR18)
**And** the image lazy loads with blur placeholder

**Given** responsive design requirements
**When** viewed on mobile
**Then** the layout stacks vertically (photo above or below bio)
**And** text remains readable at 16px minimum

**Given** viewed on desktop
**When** the section renders
**Then** photo and bio can display side-by-side
**And** section uses max-width container (1200px)

**Given** accessibility requirements
**When** the section renders
**Then** the section has a proper heading (H2) with id for navigation
**And** semantic HTML is used throughout (NFR20)
**And** screen readers can access all content (FR33)

## Story 2.3: Create Work Experience Section with Payload Collection

As a **visitor**,
I want **to see work experience entries with job titles, companies, and descriptions**,
So that **I can assess Ben's professional background** (FR3).

**Acceptance Criteria:**

**Given** the Payload CMS is configured
**When** I create the Experiences collection
**Then** the collection has fields: title, company, startDate, endDate (optional), description (rich text), isVisible (boolean, default true)
**And** entries can be created, edited, and deleted via admin
**And** entries are sorted by startDate descending

**Given** the Experiences collection has entries
**When** a visitor loads the homepage
**Then** only entries with isVisible=true are displayed
**And** the ExperienceSection component renders a list of ExperienceCard components
**And** each card shows title, company, date range, and description

**Given** date display requirements
**When** experience entries render
**Then** dates display as "MMM YYYY - MMM YYYY" format
**And** entries without endDate display "MMM YYYY - Present"

**Given** responsive design requirements
**When** viewed on mobile
**Then** cards stack vertically with full width
**And** content is scannable without horizontal scrolling

**Given** viewed on desktop
**When** the section renders
**Then** cards display in a timeline or card layout
**And** hover states provide visual feedback

**Given** accessibility requirements
**When** the section renders
**Then** the section has H2 heading with id for navigation
**And** each card uses semantic HTML (article or similar)
**And** keyboard navigation works between cards (FR32)
**And** color contrast meets requirements (FR35)

## Story 2.4: Create Education Section with Payload Collection

As a **visitor**,
I want **to see education entries with institutions and degrees**,
So that **I can understand Ben's academic background** (FR4).

**Acceptance Criteria:**

**Given** the Payload CMS is configured
**When** I create the Education collection
**Then** the collection has fields: institution, degree, startDate, endDate (optional), description (optional), isVisible (boolean, default true)
**And** entries can be created, edited, and deleted via admin

**Given** the Education collection has entries
**When** a visitor loads the homepage
**Then** only entries with isVisible=true are displayed
**And** the EducationSection component renders education entries
**And** each entry shows institution, degree, and date range

**Given** date display requirements
**When** education entries render
**Then** dates display consistently with experience section format
**And** current education shows "Present" for end date

**Given** responsive design requirements
**When** viewed on any device size
**Then** education entries display cleanly (FR36, FR37, FR38)
**And** layout is consistent with the experience section style

**Given** accessibility requirements
**When** the section renders
**Then** the section has H2 heading with id for navigation
**And** semantic HTML structure is used (NFR20)
**And** screen readers can access all content (FR33)

## Story 2.5: Create Projects Section with Payload Collection

As a **visitor**,
I want **to see project entries with descriptions, tech stacks, and links**,
So that **I can evaluate Ben's work and technical skills** (FR5).

**Acceptance Criteria:**

**Given** the Payload CMS is configured
**When** I create the Projects collection
**Then** the collection has fields: title, description, techStack (array of strings), repoUrl (optional), liveUrl (optional), image (upload), isVisible (boolean, default true)
**And** entries can be created, edited, and deleted via admin

**Given** the Projects collection has entries
**When** a visitor loads the homepage
**Then** only entries with isVisible=true are displayed
**And** the ProjectsSection component renders a grid of ProjectCard components
**And** each card shows title, description, tech stack badges, and links

**Given** tech stack display requirements
**When** a project card renders
**Then** tech stack items display as Badge components
**And** badges use the brand styling (dark background, green accents)

**Given** project links exist
**When** a project has repoUrl or liveUrl
**Then** links display as icon buttons (GitHub icon, external link icon)
**And** links open in new tab with appropriate rel attributes
**And** links have accessible labels for screen readers

**Given** project images exist
**When** a project card renders
**Then** the image uses Next.js Image component (NFR7)
**And** images have descriptive alt text (FR34)
**And** images display with consistent aspect ratio

**Given** responsive design requirements
**When** viewed on mobile
**Then** project cards stack in single column
**When** viewed on tablet
**Then** project cards display in 2-column grid
**When** viewed on desktop
**Then** project cards display in 2-3 column grid

**Given** accessibility requirements
**When** the section renders
**Then** the section has H2 heading with id for navigation
**And** cards are keyboard navigable (FR32)
**And** hover states have visible focus equivalents (NFR19)

## Story 2.6: Create Skills Section with Payload Collection

As a **visitor**,
I want **to see a skills display showing technical competencies**,
So that **I can quickly identify Ben's capabilities** (FR6).

**Acceptance Criteria:**

**Given** the Payload CMS is configured
**When** I create the Skills collection
**Then** the collection has fields: name, category, isVisible (boolean, default true)
**And** entries can be created, edited, and deleted via admin
**And** categories allow grouping (e.g., "Languages", "Frameworks", "Tools")

**Given** the Skills collection has entries
**When** a visitor loads the homepage
**Then** only entries with isVisible=true are displayed
**And** the SkillsSection component groups skills by category
**And** each skill displays as a badge or tag

**Given** skills are grouped by category
**When** the section renders
**Then** each category has a subheading (H3)
**And** skills within each category display as a flex-wrap list of badges

**Given** styling requirements
**When** skill badges render
**Then** badges use consistent styling with tech stack badges
**And** the dark green accent is used appropriately

**Given** responsive design requirements
**When** viewed on any device
**Then** skill badges wrap naturally without horizontal scroll
**And** layout remains clean and readable

**Given** accessibility requirements
**When** the section renders
**Then** the section has H2 heading with id for navigation
**And** semantic HTML lists are used for skill groups
**And** screen readers can access all skills (FR33)

## Story 2.7: Create Navigation and Page Layout

As a **visitor**,
I want **to navigate between content sections smoothly**,
So that **I can easily find the information I need** (FR7).

**Acceptance Criteria:**

**Given** the page has multiple sections
**When** I create the Navigation component
**Then** it displays a sticky header with navigation links
**And** links point to section anchors (Hero, About, Experience, Education, Projects, Skills, Contact)
**And** the navigation includes the site logo or Ben's name

**Given** navigation links exist
**When** a visitor clicks a navigation link
**Then** the page smooth scrolls to the target section
**And** scroll offset accounts for sticky header height
**And** browser URL updates with the hash

**Given** responsive design requirements
**When** viewed on desktop
**Then** navigation links display horizontally in the header
**When** viewed on mobile
**Then** navigation collapses to hamburger menu
**And** hamburger opens a slide-in or dropdown menu
**And** menu closes when a link is clicked

**Given** the sticky header requirement
**When** the visitor scrolls down
**Then** the header remains fixed at the top
**And** header may become semi-transparent or add shadow on scroll

**Given** accessibility requirements (FR32, NFR16)
**When** the navigation renders
**Then** a "Skip to content" link is the first focusable element
**And** all navigation links are keyboard accessible
**And** focus indicators are visible (NFR19)
**And** mobile menu is keyboard accessible

**Given** the main page layout
**When** assembling the homepage
**Then** all sections render in order: Hero, About, Experience, Education, Projects, Skills
**And** sections have consistent vertical spacing (64px per UX spec)
**And** the page uses the root layout with proper metadata

**Given** footer requirements
**When** the page renders
**Then** a minimal footer displays at the bottom
**And** footer includes placeholder for social links (implemented in Epic 5)
**And** footer maintains consistent styling

**Given** accessibility for the full page
**When** using keyboard navigation
**Then** tab order follows logical reading order
**And** all interactive elements are reachable
**And** `prefers-reduced-motion` disables smooth scroll animations

---
