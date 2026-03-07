---
stepsCompleted:
  [
    step-01-init,
    step-02-discovery,
    step-02b-vision,
    step-02c-executive-summary,
    step-03-success,
    step-04-journeys,
    step-05-domain,
    step-06-innovation,
    step-07-project-type,
    step-08-scoping,
    step-09-functional,
    step-10-nonfunctional,
    step-11-polish,
  ]
inputDocuments:
  - product-brief-personal_website-2026-03-06.md
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - personal_website

**Author:** Ben
**Date:** 2026-03-06

## Executive Summary

A personal portfolio website for Ben — a polished, professional online presence that showcases work experience, projects, and skills to recruiters, potential clients, and peer developers. Built with Next.js, shadcn, and Payload CMS, deployed on Vercel. Features a minimalist dark-mode design with dark green accent color and an admin interface for editorial control over displayed content.

The site serves as a branded destination beyond LinkedIn where visitors can assess Ben's expertise, view curated projects, and reach out via contact form or social links. Content is mirrored from LinkedIn (experience, education) but displayed with visibility toggles, allowing Ben to show or hide individual items without re-entering data.

### What Makes This Special

- **Editorial control without manual data entry** — LinkedIn data serves as the source of truth, but Payload CMS provides visibility toggles to curate what's displayed
- **GitHub commit graph integration** — Real contribution history adds credibility beyond static resume content
- **Distinctive dark green branding** — Minimalist dark-mode aesthetic with a unique color identity
- **Admin UI out of the box** — Payload CMS provides a ready-made admin interface for content management

The core insight: most portfolio solutions force a choice between "fully automatic but no control" or "fully manual and tedious." This gives Ben the best of both — structured data from LinkedIn, curated display with simple toggles.

## Project Classification

| Attribute           | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| **Project Type**    | Web Application (Next.js SSR/SSG)                          |
| **Domain**          | General / Personal Portfolio                               |
| **Complexity**      | Low                                                        |
| **Project Context** | Greenfield (new project)                                   |
| **Tech Stack**      | Next.js, shadcn, Payload CMS, Vercel, OpenTelemetry, Axiom |

## Success Criteria

### User Success

- Visitors quickly understand Ben's expertise and experience
- Easy navigation to relevant content (projects, experience, contact)
- Professional impression established within seconds
- Clear path to take action (contact form, LinkedIn, GitHub)

### Business Success

- A polished site Ben is proud to share and direct people to
- Increased inbound inquiries and connection requests
- Professional online presence beyond LinkedIn

### Technical Success

- Site live and performing well on Vercel
- Core Web Vitals passing
- OpenTelemetry + Axiom observability working
- 99.9% uptime (Vercel-managed)

### Measurable Outcomes

| Metric                   | Target                                     |
| ------------------------ | ------------------------------------------ |
| Site launch              | Complete and polished                      |
| Contact form submissions | Any increase from zero baseline            |
| Core Web Vitals          | All passing                                |
| Payload admin            | Functional with visibility toggles working |

## Product Scope

### MVP - Minimum Viable Product

- Hero/intro, About, Work experience (with toggles), Education (with toggles), Projects, Skills, GitHub commit graph, Contact form, Social links
- Dark mode + dark green theme, responsive layout
- Next.js, shadcn, Payload CMS, Vercel, OpenTelemetry, Axiom

### Growth Features (Post-MVP)

- Blog/articles for thought leadership and SEO
- Testimonials from clients/colleagues
- Expanded project case studies

### Vision (Future)

- Services page for consulting offerings
- Downloadable resume/CV
- Newsletter signup
- Additional integrations

## User Journeys

### Journey 1: Sarah the Recruiter (Primary User - Success Path)

**Persona:** Sarah, a technical recruiter at a mid-size tech company, is filling a senior developer role. She found Ben's LinkedIn profile and wants to assess his fit before reaching out.

**Opening Scene:** Sarah clicks the link in Ben's LinkedIn bio. She's skeptical — most developer portfolios are either bland templates or abandoned projects.

**Rising Action:** She lands on a clean, dark-mode site with distinctive green branding. Within seconds she sees Ben's headline and current role. She scrolls to work experience — it's well-organized with clear job titles, companies, and descriptions. She notices the GitHub commit graph showing consistent recent activity.

**Climax:** She clicks into a project that matches the tech stack she's hiring for. The project details are clear, with technologies listed and links to live demos or repos.

**Resolution:** Satisfied that Ben is a legitimate candidate with real, recent work, Sarah clicks the contact form and sends a message about the role. She bookmarks the site for the hiring manager to review.

**Requirements Revealed:** Clear hero section, scannable experience layout, project details with tech stack, GitHub integration, functional contact form, mobile-responsive design.

---

### Journey 2: Marcus the Potential Client (Primary User - Alternative Goal)

**Persona:** Marcus runs a small SaaS startup and needs a freelance developer for a 3-month project. He found Ben through a peer recommendation.

**Opening Scene:** Marcus arrives at the site looking for evidence that Ben can handle his project. He needs someone reliable who understands modern web development.

**Rising Action:** He scans the About section to understand Ben's background and specialties. He checks the Projects section to see the types of work Ben has done — is it similar to what he needs?

**Climax:** Marcus finds a project that uses a similar tech stack to his product. He reads the description and sees clear evidence of Ben's capabilities.

**Resolution:** Confident in the fit, Marcus fills out the contact form with project details. He also connects on LinkedIn to establish a relationship.

**Requirements Revealed:** About section with specialties/focus areas, project filtering or categorization, project descriptions with context (not just screenshots), contact form with message field.

---

### Journey 3: Dev the Peer Developer (Secondary User)

**Persona:** Dev is a fellow developer who saw Ben's open source contribution on GitHub and wants to learn more about who he is.

**Opening Scene:** Dev clicks through from Ben's GitHub profile, curious about the person behind the commits.

**Rising Action:** Dev browses the projects section, checking out tech choices and implementation approaches. The GitHub commit graph confirms Ben is actively coding.

**Climax:** Dev finds an interesting project and clicks through to the GitHub repo to explore the code.

**Resolution:** Dev follows Ben on GitHub and makes a mental note to reach out if a collaboration opportunity arises.

**Requirements Revealed:** GitHub profile link prominent, commit graph integration, project links to repos, clean technical presentation.

---

### Journey 4: Ben the Admin (Admin User)

**Persona:** Ben, the site owner, wants to update his work experience after changing jobs. He also wants to hide an old project that's no longer relevant.

**Opening Scene:** Ben logs into the Payload CMS admin panel at `/admin`.

**Rising Action:** He navigates to the Work Experience collection, finds his old job, and toggles the "visible" switch to off. Then he adds a new job entry with title, company, dates, and description.

**Climax:** Ben goes to the Projects collection, finds the outdated project, and toggles it to hidden. No deletion needed — he can unhide it later if relevant.

**Resolution:** Ben previews the site and confirms the changes are live. Total time: under 5 minutes. No code changes required.

**Requirements Revealed:** Payload CMS admin at `/admin`, visibility toggle on all content types, simple content editing interface, preview capability, no deployment needed for content changes.

---

### Journey Requirements Summary

| Capability                       | Revealed By        |
| -------------------------------- | ------------------ |
| Clear hero/intro section         | Sarah, Marcus      |
| Scannable work experience        | Sarah              |
| Projects with tech stack details | Sarah, Marcus, Dev |
| GitHub commit graph integration  | Sarah, Dev         |
| Functional contact form          | Sarah, Marcus      |
| About section with specialties   | Marcus             |
| Social links (LinkedIn, GitHub)  | Sarah, Dev         |
| Mobile-responsive design         | Sarah              |
| Payload CMS admin panel          | Ben                |
| Visibility toggles on content    | Ben                |
| Preview capability               | Ben                |

## Domain-Specific Requirements

### Privacy & Data Handling

- **Contact form submissions** stored in Payload CMS for backup access
- **Data retention:** Auto-delete contact submissions after 90 days
- **Privacy policy page** required — must explain:
  - What data is collected (name, email, message)
  - How it's used (to respond to inquiries)
  - Retention period (90 days)
  - No sharing with third parties

### Accessibility

- **WCAG 2.1 AA compliance** target
- Semantic HTML structure
- Keyboard navigation support
- Sufficient color contrast (especially with dark green theme)
- Alt text for images
- Focus indicators visible

### Admin Security

- **Payload CMS built-in authentication** — sufficient for single-user admin
- **Optional:** IP restriction to NordVPN dedicated IP for additional protection
- Admin panel at `/admin` — not publicly linked

## Web App Specific Requirements

### Project-Type Overview

Single-page application built with Next.js (hybrid SSR/SSG), deployed on Vercel. Optimized for modern browsers with basic SEO, responsive design, and WCAG 2.1 AA accessibility compliance.

### Browser Support

| Browser                     | Support Level |
| --------------------------- | ------------- |
| Chrome (latest 2 versions)  | Full support  |
| Firefox (latest 2 versions) | Full support  |
| Safari (latest 2 versions)  | Full support  |
| Edge (latest 2 versions)    | Full support  |
| Mobile Safari (iOS)         | Full support  |
| Chrome Mobile (Android)     | Full support  |
| IE11 / Legacy browsers      | Not supported |

### Responsive Design

- **Mobile-first approach** — design for mobile, enhance for desktop
- **Breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch-friendly** targets on mobile (minimum 44x44px tap areas)
- **No horizontal scrolling** at any viewport size

### Performance Targets

| Metric                         | Target  |
| ------------------------------ | ------- |
| Largest Contentful Paint (LCP) | < 2.5s  |
| First Input Delay (FID)        | < 100ms |
| Cumulative Layout Shift (CLS)  | < 0.1   |
| Time to First Byte (TTFB)      | < 600ms |
| Lighthouse Performance Score   | > 90    |

### SEO Strategy

- **Meta tags** — title, description, keywords per page
- **Open Graph tags** — for LinkedIn/Twitter sharing previews
- **Structured data** — Person schema for portfolio owner
- **Sitemap.xml** — auto-generated
- **robots.txt** — allow all crawlers
- **Canonical URLs** — prevent duplicate content issues

### Accessibility Level

- **WCAG 2.1 AA compliance** (as defined in Domain Requirements)
- shadcn components provide accessible primitives
- Dark mode with sufficient contrast ratios
- Focus management for keyboard navigation

### Implementation Considerations

- **Next.js App Router** with server components where beneficial
- **Static generation (SSG)** for public pages (performance + SEO)
- **Server-side rendering** only where dynamic content required
- **Image optimization** via Next.js Image component
- **Font optimization** via Next.js font loading

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP — focused on delivering a polished, professional presence rather than feature quantity. The goal is a site Ben is proud to share, not a feature-rich but unpolished product.

**Resource Requirements:** Solo developer, manageable scope, standard technology stack with good documentation and community support.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**

- Sarah the Recruiter — can assess experience, projects, and reach out
- Marcus the Client — can evaluate fit and make contact
- Dev the Peer — can explore projects and GitHub activity
- Ben the Admin — can manage content via Payload CMS

**Must-Have Capabilities:**

- Hero/intro section with name, tagline, headline
- About section with background and specialties
- Work experience with visibility toggles
- Education with visibility toggles
- Projects section with tech stack details
- Skills display
- GitHub commit graph integration
- Contact form (stored in Payload, 90-day retention)
- Social links (LinkedIn, GitHub)
- Privacy policy page
- Dark mode + dark green theme
- Responsive design (mobile, tablet, desktop)
- Payload CMS admin with visibility toggles
- Basic SEO (meta tags, Open Graph, sitemap)
- OpenTelemetry + Axiom observability
- WCAG 2.1 AA accessibility

### Security Considerations

**CI/CD Security:**

- Dependency vulnerability scanning (e.g., npm audit, Dependabot)
- Secret scanning in CI pipeline
- Automated security checks on PR

**Application Security:**

- Environment variables for secrets (no hardcoded credentials)
- HTTPS enforced (Vercel default)
- Content Security Policy (CSP) headers
- Rate limiting on contact form (prevent spam/abuse)

**Testing Strategy:**

- Unit tests for critical components
- Integration tests for contact form flow
- Accessibility testing (axe-core or similar)
- Lighthouse CI for performance/security audits

### Post-MVP Features

**Phase 2 (Growth):**

- Blog/articles section for thought leadership and SEO
- Testimonials from clients/colleagues
- Expanded project case studies with detailed write-ups

**Phase 3 (Vision):**

- Services page for consulting offerings
- Downloadable resume/CV
- Newsletter signup
- Additional integrations

### Risk Mitigation Strategy

**Technical Risks:** Low — Next.js, Payload CMS, Vercel are mature, well-documented technologies. No novel technical challenges.

**Security Risks:** Mitigated via CI/CD scanning, dependency audits, CSP headers, and rate limiting on contact form.

**Market Risks:** N/A — personal portfolio site, not a commercial product launch.

**Resource Risks:** Manageable solo developer scope. If time-constrained, could defer GitHub commit graph or observability setup to post-launch polish.

## Functional Requirements

### Content Display

- FR1: Visitors can view a hero section with Ben's name, headline, and tagline
- FR2: Visitors can view an about section with background and specialties
- FR3: Visitors can view work experience entries with job title, company, dates, and description
- FR4: Visitors can view education entries with institution, degree, and dates
- FR5: Visitors can view project entries with title, description, tech stack, and links
- FR6: Visitors can view a skills display showing technical competencies
- FR7: Visitors can navigate between content sections smoothly

### GitHub Integration

- FR8: Visitors can view a GitHub commit graph showing contribution activity
- FR9: Visitors can click through to Ben's GitHub profile
- FR10: System fetches and displays GitHub contribution data

### Contact & Communication

- FR11: Visitors can submit a contact form with name, email, and message
- FR12: Visitors can click social links to LinkedIn and GitHub profiles
- FR13: System stores contact form submissions in the CMS
- FR14: System sends email notification when contact form is submitted
- FR15: System auto-deletes contact submissions after 90 days

### Content Management (Admin)

- FR16: Admin can log into Payload CMS admin panel
- FR17: Admin can create, edit, and delete work experience entries
- FR18: Admin can create, edit, and delete education entries
- FR19: Admin can create, edit, and delete project entries
- FR20: Admin can toggle visibility on/off for any content item
- FR21: Admin can edit hero section content (name, headline, tagline)
- FR22: Admin can edit about section content
- FR23: Admin can manage skills list
- FR24: Admin can preview changes before publishing

### Privacy & Legal

- FR25: Visitors can view a privacy policy page
- FR26: Privacy policy explains data collection, usage, retention, and sharing practices

### SEO & Discovery

- FR27: System generates meta tags (title, description) for each page
- FR28: System generates Open Graph tags for social sharing previews
- FR29: System generates sitemap.xml automatically
- FR30: System includes structured data (Person schema) for search engines
- FR31: System generates robots.txt allowing crawlers

### Accessibility

- FR32: Visitors can navigate the site using keyboard only
- FR33: Visitors using screen readers can access all content
- FR34: All images include appropriate alt text
- FR35: Color contrast meets WCAG 2.1 AA standards

### Responsive Experience

- FR36: Visitors can view the site on mobile devices (< 768px)
- FR37: Visitors can view the site on tablet devices (768px - 1024px)
- FR38: Visitors can view the site on desktop devices (> 1024px)

## Non-Functional Requirements

### Performance

- NFR1: Page load time (LCP) under 2.5 seconds on mobile 4G connection
- NFR2: First Input Delay (FID) under 100ms
- NFR3: Cumulative Layout Shift (CLS) under 0.1
- NFR4: Time to First Byte (TTFB) under 600ms
- NFR5: Lighthouse Performance Score above 90
- NFR6: Static pages served from CDN edge (Vercel default)
- NFR7: Images optimized and lazy-loaded via Next.js Image component

### Security

- NFR8: All traffic served over HTTPS (Vercel enforced)
- NFR9: Admin panel authentication via Payload CMS built-in auth
- NFR10: Content Security Policy (CSP) headers configured
- NFR11: Contact form rate-limited to prevent spam/abuse (max 5 submissions per IP per hour)
- NFR12: No secrets or credentials in client-side code
- NFR13: Dependencies scanned for vulnerabilities in CI/CD (npm audit, Dependabot)
- NFR14: Contact form submissions auto-deleted after 90 days

### Accessibility

- NFR15: WCAG 2.1 AA compliance across all pages
- NFR16: All interactive elements keyboard-navigable
- NFR17: Color contrast ratio minimum 4.5:1 for normal text, 3:1 for large text
- NFR18: All images include descriptive alt text
- NFR19: Focus indicators visible on all focusable elements
- NFR20: Semantic HTML structure for screen reader compatibility
- NFR21: Touch targets minimum 44x44px on mobile

### Integration

- NFR22: GitHub commit graph data refreshed daily via scheduled build or ISR
- NFR23: GitHub API failures gracefully handled (display cached data or friendly fallback)
- NFR24: Contact form submission confirmation within 3 seconds
- NFR25: Email notification delivery within 60 seconds of form submission

### Reliability

- NFR26: 99.9% uptime (Vercel-managed infrastructure)
- NFR27: Graceful degradation if external services (GitHub API) are unavailable
- NFR28: Static content available even during CMS downtime
