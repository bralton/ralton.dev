---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - prd.md
  - ux-design-specification.md
  - product-brief-personal_website-2026-03-06.md
workflowType: 'architecture'
project_name: 'personal_website'
user_name: 'Ben'
date: '2026-03-07'
lastStep: 8
status: 'complete'
completedAt: '2026-03-07'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
38 functional requirements spanning 8 categories:

- **Content Display (FR1-7):** Hero, About, Experience, Education, Projects, Skills sections with smooth navigation
- **GitHub Integration (FR8-10):** Commit graph display, profile linking, contribution data fetching
- **Contact & Communication (FR11-15):** Form submission, CMS storage, email notification, 90-day auto-deletion
- **Content Management (FR16-24):** Payload CMS admin with CRUD operations and visibility toggles on all content types
- **Privacy & Legal (FR25-26):** Privacy policy page with data practices disclosure
- **SEO & Discovery (FR27-31):** Meta tags, Open Graph, sitemap, structured data, robots.txt
- **Accessibility (FR32-35):** Keyboard navigation, screen reader support, alt text, color contrast
- **Responsive Experience (FR36-38):** Mobile, tablet, and desktop breakpoint support

**Non-Functional Requirements:**
28 NFRs defining quality attributes:

- **Performance (NFR1-7):** LCP < 2.5s, FID < 100ms, CLS < 0.1, TTFB < 600ms, Lighthouse > 90, CDN edge serving, image optimization
- **Security (NFR8-14):** HTTPS, Payload auth, CSP headers, rate limiting (5/IP/hour), no client-side secrets, dependency scanning, 90-day data retention
- **Accessibility (NFR15-21):** WCAG 2.1 AA, keyboard navigation, 4.5:1 contrast, alt text, focus indicators, semantic HTML, 44x44px touch targets
- **Integration (NFR22-25):** Daily GitHub data refresh, graceful API failure handling, form confirmation < 3s, email notification < 60s
- **Reliability (NFR26-28):** 99.9% uptime (Vercel), graceful degradation, static content availability during CMS downtime

**Scale & Complexity:**

- **Primary domain:** Full-stack web application (Next.js + Payload CMS)
- **Complexity level:** Low — single-user portfolio site with standard patterns
- **Estimated architectural components:** ~8-10 (pages, CMS collections, API routes, integrations)

### Technical Constraints & Dependencies

| Constraint            | Source  | Architectural Impact                                         |
| --------------------- | ------- | ------------------------------------------------------------ |
| Next.js App Router    | PRD     | Server components, SSG/SSR hybrid rendering                  |
| Payload CMS           | PRD     | Database requirement (SQLite/Postgres), admin UI at `/admin` |
| Vercel deployment     | PRD     | Edge functions, serverless constraints, built-in CDN         |
| shadcn/ui + Tailwind  | UX Spec | Component architecture, CSS utility approach                 |
| OpenTelemetry + Axiom | PRD     | Observability instrumentation, trace collection              |
| GitHub API            | PRD     | External dependency, rate limits, caching strategy needed    |
| WCAG 2.1 AA           | PRD/UX  | Accessibility-first component design                         |

### Cross-Cutting Concerns Identified

| Concern            | Affected Components            | Architectural Approach                          |
| ------------------ | ------------------------------ | ----------------------------------------------- |
| **Authentication** | Admin panel, CMS operations    | Payload built-in auth, single-user model        |
| **Performance**    | All pages, images, GitHub data | SSG where possible, image optimization, caching |
| **Accessibility**  | All UI components              | shadcn primitives, semantic HTML, ARIA          |
| **SEO**            | All public pages               | Meta tags, structured data, sitemap generation  |
| **Observability**  | API routes, external calls     | OpenTelemetry instrumentation, Axiom export     |
| **Error Handling** | GitHub API, contact form, CMS  | Graceful degradation, fallback UI states        |
| **Security**       | Contact form, admin panel      | Rate limiting, CSP headers, input validation    |

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application (Next.js + Payload CMS) based on project requirements analysis.

### Starter Options Considered

| Option                           | Description                                                    | Evaluation                                               |
| -------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| **Payload Website Template**     | Production-ready template with blog, search, redirects plugins | Overkill for portfolio — includes unnecessary complexity |
| **Payload Blank Template**       | Minimal Next.js + Payload integration                          | ✅ Clean starting point, add only what's needed          |
| **Next.js + Manual Integration** | Start fresh, add Payload separately                            | More setup work, no clear benefit                        |

### Selected Starter: Payload Blank Template + shadcn/ui

**Rationale for Selection:**

- Blank template provides clean Next.js App Router + Payload integration without excess features
- Portfolio site is low complexity — doesn't need blog, search, or redirects plugins from Website Template
- shadcn/ui adds cleanly on top with its own CLI
- Minimizes initial codebase while providing full CMS capabilities

**Initialization Commands:**

```bash
# 1. Create Payload app with blank template
pnpx create-payload-app@latest -t blank

# 2. Initialize shadcn/ui (run inside project directory)
npx shadcn@latest init

# 3. Add shadcn components as needed
npx shadcn@latest add button card input textarea toast navigation-menu badge skeleton
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**

- TypeScript configured out of the box
- Node.js runtime (Vercel serverless functions)
- ESLint + Prettier configuration included

**Styling Solution:**

- Tailwind CSS (via shadcn init)
- CSS variables for theming (dark mode support)
- shadcn/ui component primitives

**Build Tooling:**

- Next.js App Router with Turbopack
- Vercel-optimized builds
- Automatic code splitting and optimization

**Database & Storage:**

- Payload configured for PostgreSQL (Vercel Postgres / Neon)
- Vercel Blob for media uploads (or local for development)

**Code Organization:**

- `/app` — Next.js pages and routes
- `/app/(payload)` — Payload admin routes
- `/collections` — Payload CMS collection definitions
- `/components` — React components (shadcn + custom)
- `/lib` — Utilities and helpers

**Development Experience:**

- Hot reload for both frontend and CMS changes
- TypeScript autocompletion for Payload collections
- Postgres for both local development and production (Neon free-tier recommended for local)

**Deployment Architecture:**

- Single Vercel project (Next.js + Payload unified)
- Vercel Postgres or Neon for database
- Vercel Blob for media storage
- No separate backend container required

**Note:** Project initialization using these commands should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

- Payload collection structure — defines data model for all content
- GitHub integration approach — affects build/deploy pipeline
- Email notification service — required for contact form

**Important Decisions (Shape Architecture):**

- Rate limiting strategy — security requirement

**Deferred Decisions (Post-MVP):**

- Blog/articles data model (Phase 2)
- Newsletter integration (Phase 3)

### Data Architecture

**Payload CMS Collections:**

| Collection           | Type       | Key Fields                                                        | Notes                      |
| -------------------- | ---------- | ----------------------------------------------------------------- | -------------------------- |
| `hero`               | Single     | name, headline, tagline, ctaButtons                               | One record, always visible |
| `about`              | Single     | bio, photo, highlights                                            | One record                 |
| `experiences`        | Collection | title, company, startDate, endDate, description, visible          | Visibility toggle          |
| `education`          | Collection | institution, degree, startDate, endDate, visible                  | Visibility toggle          |
| `projects`           | Collection | title, description, techStack[], repoUrl, liveUrl, image, visible | Visibility toggle          |
| `skills`             | Collection | name, category, visible                                           | Grouped by category        |
| `socialLinks`        | Collection | platform, url, icon, visible                                      | LinkedIn, GitHub, etc.     |
| `contactSubmissions` | Collection | name, email, message, ip, submittedAt                             | Auto-delete after 90 days  |

**Database:** Postgres everywhere (Vercel Postgres for production, Neon for local development)

**Caching:** GitHub contribution data cached in database, refreshed via Vercel Cron daily

### Authentication & Security

**Admin Authentication:** Payload CMS built-in authentication

- Single admin user (Ben)
- Session-based auth
- Admin panel at `/admin` (not publicly linked)

**Rate Limiting:** Contact form limited to 5 submissions per IP per hour

- Implementation: Query `contactSubmissions` by IP + timestamp before accepting
- No external service required

**Security Headers:** CSP headers configured in `next.config.js`

### API & Communication Patterns

**GitHub Integration:**

- Vercel Cron job runs daily (e.g., 2:00 AM UTC)
- Fetches contribution data from GitHub GraphQL API
- Stores results in Payload `githubData` global or dedicated collection
- Frontend reads from database (fast, no API call on page load)
- Graceful fallback: display cached data if fetch fails

**Contact Form Flow:**

1. Client submits form → POST `/api/contact`
2. Server validates input + checks rate limit
3. Store submission in Payload `contactSubmissions`
4. Send notification via Resend to Ben's email
5. Return success response → client shows toast

**Email Service:** Resend

- API key stored in environment variable
- Template: Simple notification with name, email, message

### Frontend Architecture

**Rendering Strategy:**

- Static Generation (SSG) for all public pages
- Server Components for data fetching
- Revalidation on CMS content change (on-demand via Payload hooks)

**State Management:** None required

- Server components handle data fetching
- No complex client state needed for portfolio

**Component Architecture:**

- shadcn/ui primitives for base components
- Custom compositions for Hero, ExperienceCard, ProjectCard, GitHubGraph
- Tailwind CSS for styling, CSS variables for theming

### Infrastructure & Deployment

**Hosting:** Vercel (single project)

- Next.js frontend + Payload CMS unified
- Automatic HTTPS, CDN, edge caching

**Database:** Vercel Postgres or Neon

- Connection via `DATABASE_URL` environment variable
- Payload handles migrations

**Media Storage:** Vercel Blob

- Profile photo, project images
- Automatic optimization via Next.js Image

**CI/CD:** Vercel Git integration

- Auto-deploy on push to main
- Preview deployments for PRs

**Observability:**

- OpenTelemetry instrumentation
- Axiom for log aggregation and trace viewing
- Vercel Analytics for visitor metrics

**Environment Variables:**

- `DATABASE_URL` — Postgres connection
- `PAYLOAD_SECRET` — Payload encryption key
- `RESEND_API_KEY` — Email service
- `GITHUB_TOKEN` — GitHub API access
- `AXIOM_TOKEN` — Observability

### Decision Impact Analysis

**Implementation Sequence:**

1. Project initialization (Payload blank + shadcn)
2. Payload collections setup
3. Basic page structure and components
4. GitHub integration (cron + data storage)
5. Contact form with Resend
6. Observability setup
7. Deploy to Vercel

**Cross-Component Dependencies:**

- Contact form depends on Resend setup + rate limiting logic
- GitHub graph depends on cron job + data collection
- All content pages depend on Payload collections being defined

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Addressed:**

- Naming conventions (database, files, components, API)
- Project structure and file organization
- API response formats
- Error handling approach
- Loading and empty state patterns

### Naming Patterns

**Payload Collection Naming:**

| Element             | Convention                 | Example                               |
| ------------------- | -------------------------- | ------------------------------------- |
| Collection names    | camelCase, singular        | `experience`, `project`, `skill`      |
| Field names         | camelCase                  | `startDate`, `techStack`, `isVisible` |
| Boolean fields      | `is` or `has` prefix       | `isVisible`, `hasImage`               |
| Relationship fields | Referenced collection name | `author`, `category`                  |

**File & Component Naming:**

| Element             | Convention             | Example                                              |
| ------------------- | ---------------------- | ---------------------------------------------------- |
| React components    | PascalCase             | `HeroSection.tsx`, `ProjectCard.tsx`                 |
| Utilities/helpers   | camelCase              | `formatDate.ts`, `fetchGitHubData.ts`                |
| API routes          | kebab-case folders     | `/api/contact/route.ts`, `/api/github-data/route.ts` |
| Payload collections | camelCase              | `collections/experiences.ts`                         |
| shadcn components   | Default naming         | `components/ui/button.tsx`                           |
| Types/interfaces    | PascalCase with suffix | `Experience`, `ProjectCardProps`                     |

### Structure Patterns

**Component Organization:**

```
components/
├── ui/              # shadcn primitives (don't modify naming)
├── HeroSection.tsx  # Custom page sections
├── ProjectCard.tsx  # Content display components
├── ExperienceCard.tsx
├── GitHubGraph.tsx
├── ContactForm.tsx
└── Navigation.tsx
```

**Project Structure:**

```
app/
├── (frontend)/      # Public pages (grouped route)
│   ├── page.tsx     # Home/portfolio page
│   └── privacy/     # Privacy policy
├── (payload)/       # Payload admin routes
├── api/
│   ├── contact/     # Contact form endpoint
│   └── cron/        # Vercel cron jobs
│       └── github/  # Daily GitHub data fetch
└── layout.tsx

collections/         # Payload CMS collections
├── experiences.ts
├── education.ts
├── projects.ts
├── skills.ts
├── socialLinks.ts
└── contactSubmissions.ts

lib/                 # Shared utilities
├── payload.ts       # Payload client
├── github.ts        # GitHub API helpers
└── utils.ts         # General utilities (cn, formatDate, etc.)
```

### Format Patterns

**API Response Formats:**

| Scenario          | Response                            | Status |
| ----------------- | ----------------------------------- | ------ |
| Success           | `{ success: true }`                 | `200`  |
| Success with data | `{ data: {...} }`                   | `200`  |
| Validation error  | `{ error: "Specific message" }`     | `400`  |
| Rate limited      | `{ error: "Too many requests" }`    | `429`  |
| Server error      | `{ error: "Something went wrong" }` | `500`  |

**Date Formats:**

| Context            | Format                | Example                |
| ------------------ | --------------------- | ---------------------- |
| Payload storage    | ISO 8601              | `2024-03-15`           |
| Display (ranges)   | `MMM YYYY - MMM YYYY` | `Mar 2022 - Dec 2024`  |
| Display (current)  | `MMM YYYY - Present`  | `Jan 2024 - Present`   |
| Contact submission | ISO 8601 with time    | `2024-03-15T14:30:00Z` |

**Data Structures:**

| Data Type        | Format                                    |
| ---------------- | ----------------------------------------- |
| Tech stack       | String array: `["Next.js", "TypeScript"]` |
| JSON fields      | camelCase: `startDate`, `techStack`       |
| Empty arrays     | `[]` not `null`                           |
| Optional strings | `null` not `""`                           |

### Process Patterns

**Error Handling:**

```typescript
// API route pattern
export async function POST(request: Request) {
  try {
    // Validate input
    // Process request
    return Response.json({ success: true })
  } catch (error) {
    console.error('[API] Contact form error:', error) // → Axiom
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
```

**Rules:**

- Log full error details server-side (Axiom captures console.error)
- Return generic message to client
- Never expose stack traces or internal details
- Prefix console logs with `[Component/Route]` for filtering

**Loading & Empty States:**

| State                | Pattern                                         |
| -------------------- | ----------------------------------------------- |
| Page loading         | Skeleton components from shadcn                 |
| Form submitting      | Disable button + inline spinner                 |
| Empty collection     | Hide section entirely (no "No items" message)   |
| GitHub fetch failure | Display cached data, or hide section gracefully |
| Image loading        | Next.js Image blur placeholder                  |

**Form Validation:**

- Client-side: Validate on blur + on submit
- Server-side: Always re-validate (never trust client)
- Error display: Inline below field, red text
- Success: Toast notification (shadcn Toast)

### Enforcement Guidelines

**All AI Agents MUST:**

1. Follow naming conventions exactly as specified above
2. Place new files in the correct directories per structure patterns
3. Use the defined API response formats for all endpoints
4. Handle errors with the logging + generic response pattern
5. Use shadcn components before creating custom equivalents

**Before Implementation:**

- Check if a shadcn component exists for the need
- Follow existing patterns in similar files
- Use TypeScript strict mode (no `any` types)

**Anti-Patterns to Avoid:**

- ❌ Creating nested component folders (`components/cards/ProjectCard/`)
- ❌ Using `snake_case` for TypeScript variables or fields
- ❌ Returning detailed error messages to the client
- ❌ Using `""` for empty optional fields (use `null`)
- ❌ Creating custom UI primitives when shadcn has one

## Project Structure & Boundaries

### Complete Project Directory Structure

```
personal_website/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── payload.config.ts
├── .env.local                    # Local development (gitignored)
├── .env.example                  # Template for env vars
├── .gitignore
├── vercel.json                   # Vercel cron + config
│
├── app/
│   ├── (frontend)/               # Public pages (route group)
│   │   ├── page.tsx              # Home/portfolio page
│   │   ├── privacy/
│   │   │   └── page.tsx          # Privacy policy
│   │   └── layout.tsx            # Frontend layout
│   │
│   ├── (payload)/                # Payload admin (auto-generated)
│   │   ├── admin/
│   │   │   └── [[...segments]]/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts          # POST: contact form
│   │   └── cron/
│   │       └── github/
│   │           └── route.ts      # GET: daily GitHub fetch
│   │
│   ├── globals.css               # Tailwind + CSS variables
│   └── layout.tsx                # Root layout
│
├── collections/                  # Payload CMS collections
│   ├── Hero.ts                   # Single: hero content
│   ├── About.ts                  # Single: about content
│   ├── Experiences.ts            # Work history
│   ├── Education.ts              # Academic background
│   ├── Projects.ts               # Portfolio projects
│   ├── Skills.ts                 # Technical skills
│   ├── SocialLinks.ts            # Platform links
│   ├── ContactSubmissions.ts     # Form submissions
│   └── GitHubData.ts             # Cached GitHub data
│
├── components/
│   ├── ui/                       # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── badge.tsx
│   │   └── skeleton.tsx
│   │
│   ├── Navigation.tsx            # Sticky nav header
│   ├── HeroSection.tsx           # Hero with CTAs
│   ├── AboutSection.tsx          # Bio + highlights
│   ├── ExperienceSection.tsx     # Work history list
│   ├── ExperienceCard.tsx        # Single experience
│   ├── EducationSection.tsx      # Education list
│   ├── ProjectsSection.tsx       # Projects grid
│   ├── ProjectCard.tsx           # Single project
│   ├── SkillsSection.tsx         # Skills display
│   ├── GitHubGraph.tsx           # Commit graph
│   ├── ContactSection.tsx        # Contact form wrapper
│   ├── ContactForm.tsx           # Form logic
│   ├── SocialLinks.tsx           # Platform icons
│   └── Footer.tsx                # Minimal footer
│
├── lib/
│   ├── payload.ts                # Payload client helper
│   ├── github.ts                 # GitHub API functions
│   ├── email.ts                  # Resend helper
│   ├── utils.ts                  # cn(), formatDate(), etc.
│   └── validations.ts            # Zod schemas
│
├── types/
│   └── payload-types.ts          # Auto-generated by Payload
│
└── public/
    ├── favicon.ico
    ├── og-image.png              # Open Graph default
    └── robots.txt
```

### Architectural Boundaries

**API Boundaries:**

| Endpoint           | Method | Purpose                   | Auth Required      |
| ------------------ | ------ | ------------------------- | ------------------ |
| `/api/contact`     | POST   | Contact form submission   | No (rate limited)  |
| `/api/cron/github` | GET    | Daily GitHub data refresh | Vercel Cron secret |
| `/admin/*`         | ALL    | Payload CMS admin         | Payload auth       |

**Component Boundaries:**

| Boundary          | Pattern                          | Notes                                      |
| ----------------- | -------------------------------- | ------------------------------------------ |
| Page sections     | Server components fetch own data | Each section queries Payload independently |
| Contact form      | Client component                 | Uses `"use client"` for form state         |
| UI primitives     | shadcn imports                   | Never modify `components/ui/*` directly    |
| Custom components | Flat in `components/`            | No nested folders                          |

**Data Boundaries:**

| Data Source         | Access Pattern                    | Caching                      |
| ------------------- | --------------------------------- | ---------------------------- |
| Payload collections | Server component direct query     | ISR / on-demand revalidation |
| GitHub data         | Read from `GitHubData` collection | Daily cron refresh           |
| Contact submissions | Write via API route               | No caching needed            |

### Requirements to Structure Mapping

**Content Display (FR1-7):**

| Requirement     | Component/File                                                    |
| --------------- | ----------------------------------------------------------------- |
| Hero section    | `components/HeroSection.tsx` ← `collections/Hero.ts`              |
| About section   | `components/AboutSection.tsx` ← `collections/About.ts`            |
| Work experience | `components/ExperienceSection.tsx` ← `collections/Experiences.ts` |
| Education       | `components/EducationSection.tsx` ← `collections/Education.ts`    |
| Projects        | `components/ProjectsSection.tsx` ← `collections/Projects.ts`      |
| Skills          | `components/SkillsSection.tsx` ← `collections/Skills.ts`          |
| Navigation      | `components/Navigation.tsx`                                       |

**GitHub Integration (FR8-10):**

| Requirement          | Component/File                 |
| -------------------- | ------------------------------ |
| Commit graph display | `components/GitHubGraph.tsx`   |
| Data fetching        | `lib/github.ts`                |
| Cron job             | `app/api/cron/github/route.ts` |
| Data storage         | `collections/GitHubData.ts`    |

**Contact & Communication (FR11-15):**

| Requirement        | Component/File                            |
| ------------------ | ----------------------------------------- |
| Contact form UI    | `components/ContactForm.tsx`              |
| Form submission    | `app/api/contact/route.ts`                |
| Email notification | `lib/email.ts`                            |
| Submission storage | `collections/ContactSubmissions.ts`       |
| Rate limiting      | `app/api/contact/route.ts` (inline logic) |

**Content Management (FR16-24):**

| Requirement         | Component/File                          |
| ------------------- | --------------------------------------- |
| Admin panel         | `app/(payload)/admin/` (auto-generated) |
| All CRUD operations | Payload handles via collections         |
| Visibility toggles  | `isVisible` field in each collection    |

**SEO & Discovery (FR27-31):**

| Requirement     | Location                                            |
| --------------- | --------------------------------------------------- |
| Meta tags       | `app/(frontend)/layout.tsx` metadata export         |
| Open Graph      | `app/(frontend)/layout.tsx` + `public/og-image.png` |
| Sitemap         | `next-sitemap` or built-in Next.js sitemap          |
| Structured data | JSON-LD in `app/(frontend)/page.tsx`                |
| robots.txt      | `public/robots.txt`                                 |

### Integration Points

**Internal Communication:**

```
┌─────────────────┐     ┌─────────────────┐
│  Page (Server)  │────▶│  Payload CMS    │
│  app/page.tsx   │     │  collections/*  │
└─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Components     │
│  (Server/Client)│
└─────────────────┘
```

**External Integrations:**

| Service         | Integration Point   | Config Location          |
| --------------- | ------------------- | ------------------------ |
| GitHub API      | `lib/github.ts`     | `GITHUB_TOKEN` env var   |
| Resend          | `lib/email.ts`      | `RESEND_API_KEY` env var |
| Vercel Postgres | `payload.config.ts` | `DATABASE_URL` env var   |
| Vercel Blob     | `payload.config.ts` | Auto-configured          |
| Axiom           | `next.config.ts`    | `AXIOM_TOKEN` env var    |

**Data Flow:**

```
Visitor Request
      │
      ▼
┌─────────────────┐
│  Next.js SSG    │──────▶ Cached HTML (CDN)
│  (build time)   │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Payload CMS    │──────▶ Postgres DB
│  (data source)  │
└─────────────────┘

Contact Form:
User ──▶ ContactForm ──▶ /api/contact ──▶ Payload (store)
                                      ──▶ Resend (notify)

GitHub Cron:
Vercel Cron ──▶ /api/cron/github ──▶ GitHub API
                                 ──▶ Payload (cache)
```

### File Organization Patterns

**Configuration Files:**

| File                 | Purpose                       |
| -------------------- | ----------------------------- |
| `next.config.ts`     | Next.js + CSP headers + Axiom |
| `tailwind.config.ts` | Theme colors (dark green)     |
| `payload.config.ts`  | Collections, DB, storage      |
| `vercel.json`        | Cron schedule                 |
| `.env.example`       | Environment variable template |

**Environment Variables (.env.example):**

```
DATABASE_URL=
PAYLOAD_SECRET=
RESEND_API_KEY=
GITHUB_TOKEN=
AXIOM_TOKEN=
CRON_SECRET=
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** All technology choices verified compatible:

- Next.js App Router + Payload CMS 3.0 (native integration)
- shadcn/ui + Tailwind CSS (shadcn built on Tailwind)
- Vercel deployment + Vercel Postgres (native platform)
- Resend email service (standard Next.js integration)
- OpenTelemetry + Axiom (Vercel Axiom integration)

**Pattern Consistency:** All patterns align with technology stack conventions.

**Structure Alignment:** Project structure supports all architectural decisions.

### Requirements Coverage ✅

**Functional Requirements:** All 38 FRs mapped to architectural components
**Non-Functional Requirements:** All 28 NFRs addressed by architectural decisions

### Implementation Readiness ✅

**Decision Completeness:** All critical decisions documented with specific technologies
**Structure Completeness:** Complete project tree with 40+ files defined
**Pattern Completeness:** Naming, structure, API, and process patterns fully specified

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Low)
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**

- [x] Starter template selected (Payload Blank + shadcn)
- [x] Data architecture defined (9 Payload collections)
- [x] Authentication approach specified (Payload built-in)
- [x] API patterns documented
- [x] Infrastructure decisions complete

**✅ Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] API response formats specified
- [x] Error handling patterns documented
- [x] Loading/empty state patterns defined

**✅ Project Structure**

- [x] Complete directory tree defined
- [x] Component boundaries established
- [x] Requirements mapped to files
- [x] Integration points documented

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**

- Clear, low-complexity architecture appropriate for portfolio site
- Single deployment model (no separate services to manage)
- Established patterns (Next.js + Payload + shadcn well-documented ecosystem)
- Comprehensive consistency rules prevent agent conflicts

**First Implementation Priority:**

```bash
pnpx create-payload-app@latest -t blank
npx shadcn@latest init
```
