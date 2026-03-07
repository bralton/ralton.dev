---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
date: 2026-03-06
author: Ben
---

# Product Brief: personal_website

## Executive Summary

A personal portfolio website for Ben, designed to showcase professional experience, projects, and skills to other developers and potential clients. Built with a modern stack (Next.js, shadcn, Payload CMS, Vercel), featuring a minimalist dark-mode aesthetic with a prominent dark green color theme and an admin interface for editorial control over displayed content.

---

## Core Vision

### Problem Statement

Ben needs a professional online presence that accurately represents his work and capabilities to potential collaborators and clients — a branded destination beyond LinkedIn that he fully controls.

### Problem Impact

Without a well-designed personal site, opportunities may be missed. Potential clients or collaborators can't easily discover Ben's full body of work, projects, and expertise in a curated, professional format.

### Why Existing Solutions Fall Short

- Generic portfolio templates lack editorial control
- LinkedIn alone doesn't provide a personalized, branded experience
- Most solutions require too much manual maintenance or offer too little control over what's displayed
- No easy way to toggle visibility of individual items (jobs, projects, etc.)

### Proposed Solution

A custom personal website built with Next.js and shadcn, using Payload CMS for content management:

- Minimalist, dark-mode design with dark green as the primary accent color
- Work experience and education (mirrored from LinkedIn) with visibility toggles
- Projects section with full CMS control
- GitHub commit graph integration
- Built-in Payload admin interface for editorial control

### Key Differentiators

- Payload CMS provides admin UI out of the box with custom visibility toggles
- LinkedIn data as source of truth, with editorial layer on top
- GitHub activity integration showcasing real contribution history
- Clean, professional aesthetic with distinctive dark green branding

---

## Target Users

### Primary Users

**Hiring Managers & Recruiters**

- Evaluating Ben for full-time roles or contract positions
- Want to quickly assess experience, technical skills, and credibility
- Looking for evidence of real work: projects, contributions, professional history
- Desired actions: Connect on LinkedIn, reach out via contact form

**Potential Clients**

- Seeking freelance development or consulting help
- Need to assess expertise and see examples of past work
- Want to understand specialties and whether Ben is the right fit for their project
- Desired actions: Contact form inquiry, LinkedIn connection

### Secondary Users

**Peer Developers**

- Curious about Ben's work, tech stack, or open source contributions
- Browsing projects, checking out GitHub activity
- May become collaborators or referral sources
- Desired actions: Follow on GitHub, explore projects

**Potential Collaborators**

- Exploring partnership opportunities on projects or ventures
- Assessing skills, working style, and areas of focus
- Desired actions: Reach out via contact form, connect on GitHub

### User Journey

1. **Discovery** — Find Ben via Google search, LinkedIn, GitHub, or word of mouth
2. **First Impression** — Land on clean, dark-mode site with professional aesthetic
3. **Exploration** — Browse projects, work experience, skills, GitHub commit graph
4. **Validation** — "This person knows their stuff" — credibility established
5. **Action** — Reach out via contact form or connect on LinkedIn/GitHub

---

## Success Metrics

### Primary Success Criteria

**Qualitative: A Polished Professional Presence**

- A site Ben is proud to share and direct people to
- Clean, professional aesthetic that accurately represents his brand
- Easy to maintain and update via Payload CMS admin

### Tracking & Analytics

**Visitor Analytics**

- Page views and unique visitors
- Time on site / engagement
- Traffic sources (LinkedIn, GitHub, direct, search)
- Contact form submissions

**Technical Observability**

- OpenTelemetry integration for tracing and metrics
- Axiom for centralized logging
- Performance monitoring (Core Web Vitals, load times)

### Business Objectives

- Establish a professional online presence beyond LinkedIn
- Provide a curated destination for recruiters, clients, and peers
- Increase inbound inquiries and connection requests

### Key Performance Indicators

| KPI                      | Target                            |
| ------------------------ | --------------------------------- |
| Site live and polished   | Launch complete                   |
| Contact form submissions | Any increase from zero (baseline) |
| Uptime                   | 99.9% (Vercel managed)            |
| Performance              | Core Web Vitals passing           |

---

## MVP Scope

### Core Features

**Content Sections**

- Hero/intro section with name, tagline, and brief introduction
- About/bio section
- Work experience (mirrored from LinkedIn, with visibility toggles)
- Education (mirrored from LinkedIn, with visibility toggles)
- Projects section (fully managed in Payload CMS)
- Skills display
- GitHub commit graph integration
- Contact form
- Social links (LinkedIn, GitHub)

**Design & UX**

- Minimalist dark-mode design
- Dark green as primary accent color
- Responsive layout (mobile, tablet, desktop)
- Clean, professional typography

**Technical Infrastructure**

- Next.js + shadcn UI
- Payload CMS with admin interface
- Visibility toggle fields on experience/education/projects
- Vercel deployment
- OpenTelemetry integration
- Axiom logging
- Basic analytics tracking

### Out of Scope for MVP

- Blog/articles section
- Testimonials
- Downloadable resume/CV
- Detailed services page
- Additional pages beyond core sections

### MVP Success Criteria

- Site is live and polished on Vercel
- All core sections populated with real content
- Payload admin functional with visibility toggles working
- GitHub commit graph displaying correctly
- Contact form operational
- Core Web Vitals passing
- Observability (otel + Axiom) confirmed working

### Future Vision

- Blog/articles for thought leadership and SEO
- Testimonials from clients/colleagues
- Expanded project case studies with detailed write-ups
- Services page for consulting offerings
- Downloadable resume/CV
- Additional integrations (e.g., newsletter signup)
