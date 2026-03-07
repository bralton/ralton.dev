---
documentType: epic-list
epicCount: 7
shardedFrom: epics.md
date: 2026-03-07
---

# Epic List

## Epic 1: Project Foundation & Infrastructure

Establish the technical foundation that enables all future development. After this epic, a deployed site skeleton exists on Vercel with the complete development environment ready.

**FRs covered:** Foundation enables all FRs (Architecture requirements)

**Implementation Notes:**

- Initialize Payload Blank Template + shadcn/ui
- Project structure per Architecture spec
- Vercel deployment with Postgres
- OpenTelemetry + Axiom observability setup
- Environment variables configured

---

## Epic 2: Core Portfolio Content

Visitors can view Ben's professional profile and navigate the complete site. Recruiters, clients, and peers can scan Ben's experience, projects, and skills on any device with full accessibility support.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR32, FR33, FR34, FR35, FR36, FR37, FR38

**Implementation Notes:**

- All 7 content display sections (Hero, About, Experience, Education, Projects, Skills, Navigation)
- Payload collections: Hero, About, Experiences, Education, Projects, Skills
- Responsive design (mobile-first)
- Accessibility baked into all components (WCAG 2.1 AA)
- Sticky navigation with smooth scroll

---

## Epic 3: Content Management System

Ben can manage all site content via Payload CMS admin panel. Add, edit, delete, and toggle visibility on any content without code changes.

**FRs covered:** FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24

**Implementation Notes:**

- Payload admin at `/admin`
- CRUD for all content collections
- `isVisible` toggles on all content types
- On-demand revalidation when content changes

---

## Epic 4: GitHub Integration

Visitors can see Ben's authentic coding activity and credibility. The commit graph displays real contribution data, building trust beyond static content.

**FRs covered:** FR8, FR9, FR10

**Implementation Notes:**

- GitHub GraphQL API integration
- Vercel Cron job (daily refresh at 2:00 AM UTC)
- GitHubData collection for caching
- Graceful fallback on API failure

---

## Epic 5: Contact & Communication

Visitors can reach out to Ben easily. Contact form submissions are stored, Ben receives email notifications, and visitors see social links.

**FRs covered:** FR11, FR12, FR13, FR14, FR15

**Implementation Notes:**

- Contact form with validation
- Resend email integration
- SocialLinks collection
- Rate limiting (5/IP/hour)
- 90-day auto-deletion

---

## Epic 6: SEO & Discovery

Site is discoverable via search engines and social sharing. Site ranks well in search, social shares display rich previews.

**FRs covered:** FR27, FR28, FR29, FR30, FR31

**Implementation Notes:**

- Meta tags and Open Graph
- Sitemap.xml generation
- Person schema structured data
- robots.txt configuration

---

## Epic 7: Privacy & Legal Compliance

Site meets legal requirements for data collection disclosure. Visitors can understand how their data is handled.

**FRs covered:** FR25, FR26

**Implementation Notes:**

- Privacy policy page at `/privacy`
- Data practices disclosure (collection, usage, 90-day retention, no third-party sharing)

---
