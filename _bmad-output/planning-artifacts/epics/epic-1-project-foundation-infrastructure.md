---
epic: 1
title: "Project Foundation & Infrastructure"
status: backlog
storyCount: 4
stories: ["1.1", "1.2", "1.3", "1.4"]
frs: []
nfrs: ["NFR6", "NFR8", "NFR10"]
shardedFrom: epics.md
date: 2026-03-07
---

# Epic 1: Project Foundation & Infrastructure

Establish the technical foundation that enables all future development. After this epic, a deployed site skeleton exists on Vercel with the complete development environment ready.

## Story 1.1: Initialize Project with Payload and shadcn

As a **developer**,
I want **a properly initialized project with Payload CMS and shadcn/ui configured**,
So that **I have the foundational codebase ready for building the portfolio site**.

**Acceptance Criteria:**

**Given** no existing project in the repository
**When** I run the Payload blank template initialization command
**Then** a new Next.js project is created with Payload CMS integrated
**And** the project uses TypeScript by default

**Given** the Payload project is initialized
**When** I run shadcn/ui init with dark mode configuration
**Then** shadcn/ui is configured with CSS variables for theming
**And** Tailwind CSS is properly configured

**Given** shadcn/ui is initialized
**When** I add the required components (button, card, input, textarea, toast, navigation-menu, badge, skeleton)
**Then** all components are available in `/components/ui/`
**And** components use the dark theme by default

**Given** Tailwind is configured
**When** I update the theme with brand colors
**Then** primary accent color is dark green (#0d9488)
**And** background color is near-black (#09090b)
**And** the color palette matches the UX specification

## Story 1.2: Configure Project Structure and Development Environment

As a **developer**,
I want **the project structure organized per the Architecture specification**,
So that **all future development follows consistent patterns and locations**.

**Acceptance Criteria:**

**Given** the initialized project
**When** I create the folder structure
**Then** `/app/(frontend)/` exists for public pages
**And** `/app/(payload)/` exists for Payload admin routes
**And** `/collections/` exists for Payload CMS collection definitions
**And** `/components/` exists for React components (flat structure)
**And** `/lib/` exists for utilities
**And** `/types/` exists for TypeScript types

**Given** the project structure is created
**When** I configure development tooling
**Then** TypeScript strict mode is enabled
**And** ESLint is configured with Next.js recommended rules
**And** Prettier is configured for consistent formatting

**Given** environment variables are needed
**When** I create `.env.example`
**Then** it contains all required variables: DATABASE_URL, PAYLOAD_SECRET, RESEND_API_KEY, GITHUB_TOKEN, AXIOM_TOKEN, CRON_SECRET
**And** `.env.local` is in `.gitignore`

**Given** local development needs a database
**When** I configure Payload for local development
**Then** SQLite is used for local development
**And** the database file is gitignored
**And** `pnpm dev` starts the development server successfully

## Story 1.3: Deploy to Vercel with Database

As a **developer**,
I want **the project deployed to Vercel with a production database**,
So that **I have a live environment for testing and the deployment pipeline is established**.

**Acceptance Criteria:**

**Given** the project is ready for deployment
**When** I connect the repository to Vercel
**Then** Vercel detects the Next.js framework
**And** build settings are automatically configured

**Given** the project needs a production database
**When** I provision Vercel Postgres
**Then** DATABASE_URL is automatically added to environment variables
**And** the database is accessible from the deployed application

**Given** environment variables are required
**When** I configure all environment variables in Vercel
**Then** PAYLOAD_SECRET is set with a secure random value
**And** all other required variables have placeholder or real values
**And** variables are not exposed to the client

**Given** the deployment pipeline is configured
**When** I push to the main branch
**Then** Vercel automatically builds and deploys
**And** the deployment completes without errors
**And** the site is accessible via HTTPS (NFR8)
**And** static assets are served from CDN edge (NFR6)

**Given** the site is deployed
**When** I visit the production URL
**Then** the default Payload admin panel loads at `/admin`
**And** I can create the initial admin user

## Story 1.4: Set Up Observability

As a **developer**,
I want **observability configured with OpenTelemetry and Axiom**,
So that **I can monitor application performance and debug issues in production**.

**Acceptance Criteria:**

**Given** the project needs observability
**When** I install and configure OpenTelemetry packages
**Then** the instrumentation is added to `next.config.ts`
**And** automatic instrumentation captures traces for API routes

**Given** OpenTelemetry is configured
**When** I connect Axiom as the trace exporter
**Then** AXIOM_TOKEN environment variable is used for authentication
**And** traces are exported to Axiom

**Given** security headers are required (NFR10)
**When** I configure CSP headers in `next.config.ts`
**Then** Content-Security-Policy headers are set appropriately
**And** headers don't block required functionality (Payload admin, external APIs)

**Given** observability is configured
**When** I make requests to the deployed application
**Then** traces appear in the Axiom dashboard
**And** console.error logs are captured for debugging
**And** API route performance is measurable

---
