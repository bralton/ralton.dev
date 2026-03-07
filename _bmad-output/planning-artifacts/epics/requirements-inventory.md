---
documentType: requirements-inventory
frCount: 38
nfrCount: 28
shardedFrom: epics.md
date: 2026-03-07
---

# Requirements Inventory

## Functional Requirements

**Content Display (FR1-7):**

- FR1: Visitors can view a hero section with Ben's name, headline, and tagline
- FR2: Visitors can view an about section with background and specialties
- FR3: Visitors can view work experience entries with job title, company, dates, and description
- FR4: Visitors can view education entries with institution, degree, and dates
- FR5: Visitors can view project entries with title, description, tech stack, and links
- FR6: Visitors can view a skills display showing technical competencies
- FR7: Visitors can navigate between content sections smoothly

**GitHub Integration (FR8-10):**

- FR8: Visitors can view a GitHub commit graph showing contribution activity
- FR9: Visitors can click through to Ben's GitHub profile
- FR10: System fetches and displays GitHub contribution data

**Contact & Communication (FR11-15):**

- FR11: Visitors can submit a contact form with name, email, and message
- FR12: Visitors can click social links to LinkedIn and GitHub profiles
- FR13: System stores contact form submissions in the CMS
- FR14: System sends email notification when contact form is submitted
- FR15: System auto-deletes contact submissions after 90 days

**Content Management - Admin (FR16-24):**

- FR16: Admin can log into Payload CMS admin panel
- FR17: Admin can create, edit, and delete work experience entries
- FR18: Admin can create, edit, and delete education entries
- FR19: Admin can create, edit, and delete project entries
- FR20: Admin can toggle visibility on/off for any content item
- FR21: Admin can edit hero section content (name, headline, tagline)
- FR22: Admin can edit about section content
- FR23: Admin can manage skills list
- FR24: Admin can preview changes before publishing

**Privacy & Legal (FR25-26):**

- FR25: Visitors can view a privacy policy page
- FR26: Privacy policy explains data collection, usage, retention, and sharing practices

**SEO & Discovery (FR27-31):**

- FR27: System generates meta tags (title, description) for each page
- FR28: System generates Open Graph tags for social sharing previews
- FR29: System generates sitemap.xml automatically
- FR30: System includes structured data (Person schema) for search engines
- FR31: System generates robots.txt allowing crawlers

**Accessibility (FR32-35):**

- FR32: Visitors can navigate the site using keyboard only
- FR33: Visitors using screen readers can access all content
- FR34: All images include appropriate alt text
- FR35: Color contrast meets WCAG 2.1 AA standards

**Responsive Experience (FR36-38):**

- FR36: Visitors can view the site on mobile devices (< 768px)
- FR37: Visitors can view the site on tablet devices (768px - 1024px)
- FR38: Visitors can view the site on desktop devices (> 1024px)

## NonFunctional Requirements

**Performance (NFR1-7):**

- NFR1: Page load time (LCP) under 2.5 seconds on mobile 4G connection
- NFR2: First Input Delay (FID) under 100ms
- NFR3: Cumulative Layout Shift (CLS) under 0.1
- NFR4: Time to First Byte (TTFB) under 600ms
- NFR5: Lighthouse Performance Score above 90
- NFR6: Static pages served from CDN edge (Vercel default)
- NFR7: Images optimized and lazy-loaded via Next.js Image component

**Security (NFR8-14):**

- NFR8: All traffic served over HTTPS (Vercel enforced)
- NFR9: Admin panel authentication via Payload CMS built-in auth
- NFR10: Content Security Policy (CSP) headers configured
- NFR11: Contact form rate-limited to prevent spam/abuse (max 5 submissions per IP per hour)
- NFR12: No secrets or credentials in client-side code
- NFR13: Dependencies scanned for vulnerabilities in CI/CD (npm audit, Dependabot)
- NFR14: Contact form submissions auto-deleted after 90 days

**Accessibility (NFR15-21):**

- NFR15: WCAG 2.1 AA compliance across all pages
- NFR16: All interactive elements keyboard-navigable
- NFR17: Color contrast ratio minimum 4.5:1 for normal text, 3:1 for large text
- NFR18: All images include descriptive alt text
- NFR19: Focus indicators visible on all focusable elements
- NFR20: Semantic HTML structure for screen reader compatibility
- NFR21: Touch targets minimum 44x44px on mobile

**Integration (NFR22-25):**

- NFR22: GitHub commit graph data refreshed daily via scheduled build or ISR
- NFR23: GitHub API failures gracefully handled (display cached data or friendly fallback)
- NFR24: Contact form submission confirmation within 3 seconds
- NFR25: Email notification delivery within 60 seconds of form submission

**Reliability (NFR26-28):**

- NFR26: 99.9% uptime (Vercel-managed infrastructure)
- NFR27: Graceful degradation if external services (GitHub API) are unavailable
- NFR28: Static content available even during CMS downtime

## Additional Requirements

**From Architecture - Starter Template (CRITICAL for Epic 1 Story 1):**

- Project must be initialized using Payload Blank Template + shadcn/ui
- Initialization commands:
  - `pnpx create-payload-app@latest -t blank`
  - `npx shadcn@latest init`
  - `npx shadcn@latest add button card input textarea toast navigation-menu badge skeleton`

**From Architecture - Data Model:**

- 9 Payload CMS collections required: Hero, About, Experiences, Education, Projects, Skills, SocialLinks, ContactSubmissions, GitHubData
- All content collections require `isVisible` boolean field for visibility toggles
- Database: Vercel Postgres (production) / SQLite (local development)

**From Architecture - Infrastructure:**

- Vercel deployment (single project for Next.js + Payload)
- Vercel Postgres or Neon for database
- Vercel Blob for media storage
- Environment variables: DATABASE_URL, PAYLOAD_SECRET, RESEND_API_KEY, GITHUB_TOKEN, AXIOM_TOKEN, CRON_SECRET

**From Architecture - Integrations:**

- GitHub API integration via Vercel Cron job (daily refresh at 2:00 AM UTC)
- Resend email service for contact form notifications
- OpenTelemetry + Axiom for observability

**From Architecture - Security:**

- Rate limiting: 5 submissions per IP per hour (query contactSubmissions by IP + timestamp)
- CSP headers configured in next.config.js
- Single admin user authentication via Payload built-in auth

**From Architecture - API Patterns:**

- Contact form: POST /api/contact
- GitHub cron: GET /api/cron/github
- Standard response formats: `{ success: true }`, `{ data: {...} }`, `{ error: "message" }`

**From Architecture - Project Structure:**

- `/app/(frontend)/` for public pages
- `/app/(payload)/` for Payload admin routes
- `/collections/` for Payload CMS collection definitions
- `/components/` for React components (flat structure)
- `/lib/` for utilities (payload.ts, github.ts, email.ts, utils.ts, validations.ts)

**From UX - Design System:**

- shadcn/ui components with dark mode theme
- Primary accent: Dark green (#0d9488)
- Background: Near-black (#09090b)
- Font: Inter (primary), JetBrains Mono (code)

**From UX - Responsive Requirements:**

- Mobile-first approach
- Breakpoints: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)
- Max content width: 1200px
- Touch targets: 44x44px minimum

**From UX - Component Requirements:**

- Hero section: 85vh desktop, 70vh mobile
- Card-based layouts for Experience and Projects
- GitHub commit graph with green cells matching brand
- Sticky navigation with smooth scroll
- Toast notifications for form feedback

**From UX - Accessibility:**

- Skip links for keyboard navigation
- Focus indicators: 2px green outline
- `prefers-reduced-motion` support
- Semantic HTML with proper heading hierarchy

## FR Coverage Map

| FR   | Epic   | Description                 |
| ---- | ------ | --------------------------- |
| FR1  | Epic 2 | Hero section display        |
| FR2  | Epic 2 | About section display       |
| FR3  | Epic 2 | Work experience display     |
| FR4  | Epic 2 | Education display           |
| FR5  | Epic 2 | Projects display            |
| FR6  | Epic 2 | Skills display              |
| FR7  | Epic 2 | Section navigation          |
| FR8  | Epic 4 | GitHub commit graph display |
| FR9  | Epic 4 | GitHub profile link         |
| FR10 | Epic 4 | GitHub data fetching        |
| FR11 | Epic 5 | Contact form submission     |
| FR12 | Epic 5 | Social links display        |
| FR13 | Epic 5 | Contact storage in CMS      |
| FR14 | Epic 5 | Email notification          |
| FR15 | Epic 5 | Auto-delete after 90 days   |
| FR16 | Epic 3 | Admin login                 |
| FR17 | Epic 3 | Experience CRUD             |
| FR18 | Epic 3 | Education CRUD              |
| FR19 | Epic 3 | Projects CRUD               |
| FR20 | Epic 3 | Visibility toggles          |
| FR21 | Epic 3 | Hero editing                |
| FR22 | Epic 3 | About editing               |
| FR23 | Epic 3 | Skills management           |
| FR24 | Epic 3 | Preview capability          |
| FR25 | Epic 7 | Privacy policy page         |
| FR26 | Epic 7 | Data practices disclosure   |
| FR27 | Epic 6 | Meta tags                   |
| FR28 | Epic 6 | Open Graph tags             |
| FR29 | Epic 6 | Sitemap generation          |
| FR30 | Epic 6 | Structured data             |
| FR31 | Epic 6 | robots.txt                  |
| FR32 | Epic 2 | Keyboard navigation         |
| FR33 | Epic 2 | Screen reader support       |
| FR34 | Epic 2 | Alt text for images         |
| FR35 | Epic 2 | Color contrast compliance   |
| FR36 | Epic 2 | Mobile responsive           |
| FR37 | Epic 2 | Tablet responsive           |
| FR38 | Epic 2 | Desktop responsive          |
