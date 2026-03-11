# Epic 8 Design Document: CI/DevOps, Security & Documentation

**Date:** 2026-03-11
**Epic:** 8 - CI/DevOps, Security & Documentation
**Status:** Design Complete
**Purpose:** Enable autonomous story execution by front-loading all technical decisions

---

## Executive Summary

This document provides all technical specifications needed to implement Epic 8 autonomously. It covers:
- Discord PR notifications via GitHub Actions webhook
- Dependabot security updates configuration
- Branch protection rules documentation
- Custom 404 page design with inspiration analysis
- Admin IP allowlist via Next.js middleware
- Playwright E2E test architecture
- Comprehensive project documentation with Mermaid diagrams

**With this document, Epic 8 stories can execute autonomously like Epics 2-7.**

**Architecture Context:** The site uses Cloudflare (DNS/CDN) → Vercel (Edge/Compute) → Next.js → Payload → Postgres. IP detection must use `CF-Connecting-IP` header.

---

## 1. Epic Overview

### 1.1 Story Summary

| Story | Title | Dependencies | Priority |
|-------|-------|--------------|----------|
| 8.1 | Configure Discord PR Notifications | None | High |
| 8.2 | Enable Dependabot Security Updates | None | High |
| 8.3 | Add Branch Protection Rules Configuration | 8.1, 8.2, 8.6 | Low |
| 8.4 | Create Custom 404 Page | None | Medium |
| 8.5 | Implement Admin IP Allowlist | 8.4 | High |
| 8.6 | Set Up Playwright E2E Tests | None | High |
| 8.7 | Create Project Documentation | 8.1-8.6 | Medium |

### 1.2 Story Interconnections

```mermaid
graph TD
    A[8.1 Discord Notifications] --> C[8.3 Branch Protection]
    B[8.2 Dependabot] --> C
    D[8.4 Custom 404 Page] --> E[8.5 Admin IP Allowlist]
    F[8.6 Playwright E2E] --> C
    A --> G[8.7 Documentation]
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
```

**Key Dependencies:**
- 8.4 (404 page) must complete before 8.5 (IP allowlist) - blocked users see the 404 page
- 8.3 (branch protection) requires 8.1, 8.2, and 8.6 to define which status checks to require
- 8.7 (documentation) can start anytime but should include all implemented features

---

## 2. Story 8.1: Discord PR Notifications

### 2.1 Workflow Configuration

**File:** `.github/workflows/pr-discord.yml`

```yaml
name: PR Discord Notification

on:
  pull_request:
    types: [opened]

jobs:
  notify:
    name: Send Discord Notification
    runs-on: ubuntu-latest
    steps:
      - name: Validate Webhook URL
        run: |
          if [[ ! "${{ secrets.DISCORD_WEBHOOK_URL }}" =~ ^https://discord\.com/api/webhooks/ ]]; then
            echo "::error::Invalid Discord webhook URL format"
            exit 1
          fi

      - name: Send Discord Notification
        env:
          DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
        run: |
          # Truncate description to 3900 chars (Discord embed limit is 4096)
          DESCRIPTION=$(echo '${{ github.event.pull_request.body }}' | head -c 3900)

          # Build JSON payload safely with jq
          PAYLOAD=$(jq -n \
            --arg title "${{ github.event.pull_request.title }}" \
            --arg description "$DESCRIPTION" \
            --arg author "${{ github.event.pull_request.user.login }}" \
            --arg url "${{ github.event.pull_request.html_url }}" \
            --arg repo "${{ github.repository }}" \
            '{
              embeds: [{
                title: ("PR: " + $title),
                description: $description,
                url: $url,
                color: 3447003,
                fields: [
                  { name: "Repository", value: $repo, inline: true },
                  { name: "Author", value: $author, inline: true }
                ],
                timestamp: (now | todate)
              }]
            }')

          # Send to Discord
          RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$PAYLOAD" \
            "$DISCORD_WEBHOOK_URL")

          HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
          BODY=$(echo "$RESPONSE" | sed '$d')

          if [[ "$HTTP_CODE" != "200" && "$HTTP_CODE" != "204" ]]; then
            echo "::error::Discord webhook failed with status $HTTP_CODE"
            echo "Response body: $BODY"
            exit 1
          fi

          echo "✅ Discord notification sent successfully"
```

### 2.2 GitHub Secret Setup

**Secret Name:** `DISCORD_WEBHOOK_URL`

**Setup Steps:**
1. Create Discord webhook in desired channel (Server Settings → Integrations → Webhooks)
2. Copy webhook URL (format: `https://discord.com/api/webhooks/{id}/{token}`)
3. Add to GitHub repository (Settings → Secrets → Actions → New repository secret)

---

## 3. Story 8.2: Dependabot Security Updates

### 3.1 Dependabot Configuration

**File:** `.github/dependabot.yml`

```yaml
version: 2
updates:
  # npm dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "America/New_York"
    target-branch: "main"
    open-pull-requests-limit: 5
    commit-message:
      prefix: "chore(deps)"
    labels:
      - "dependencies"
      - "automated"
    reviewers:
      - "bralton"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    commit-message:
      prefix: "ci(deps)"
    labels:
      - "ci"
      - "automated"
```

### 3.2 Integration with Other Workflows

Dependabot PRs will automatically trigger:
- **8.1 Discord Notifications** - Alerts when Dependabot opens a PR
- **Accessibility CI** - Existing Lighthouse and sitemap/robots.txt validation
- **8.6 E2E Tests** (when implemented) - Full test suite on dependency updates

---

## 4. Story 8.3: Branch Protection Rules Configuration

### 4.1 Recommended Rules (Documentation Only)

**Note:** Branch protection is not enforceable on private repos with free GitHub tier. This story documents the recommended configuration for when the repo goes public or upgrades.

**Recommended Settings for `main` branch:**

| Setting | Value | Rationale |
|---------|-------|-----------|
| Require pull request reviews | 1 reviewer | Code quality gate |
| Dismiss stale PR approvals | Yes | Prevent bypass via new commits |
| Require status checks | Yes | Automated quality gates |
| Status checks required | `Lighthouse Accessibility Audit`, `Playwright E2E` | Comprehensive coverage |
| Require branches up to date | Yes | Prevent merge conflicts |
| Do not allow bypassing | Yes | Consistent enforcement |
| Require linear history | Optional | Cleaner git history |

### 4.2 Documentation Location

Add to README.md (Story 8.7) or create `docs/branch-protection.md`:

```markdown
## Branch Protection (Ready to Enable)

These rules are recommended for the `main` branch when branch protection becomes available:

1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging (1 approval)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings

4. Add required status checks:
   - `Lighthouse Accessibility Audit`
   - `Playwright E2E` (when available)
```

---

## 5. Story 8.4: Custom 404 Page Design

### 5.1 Inspiration Analysis

| Site | Approach | Strengths | Portfolio Applicability |
|------|----------|-----------|------------------------|
| **GitHub** | Octocat illustrations, search bar, repository suggestions | Memorable, brand-reinforcing, functional | Medium - illustration style |
| **Reddit** | Search functionality, community suggestions | Helps users find content | Low - single-page portfolio |
| **PostHog** | Hedgehog animations, playful copy | Personality, memorable | High - shows developer personality |
| **Vercel** | Minimal, clean, direct link home | Fast recovery, professional | High - matches dev portfolio |
| **Linear** | Geometric shapes, keyboard navigation hint | Technical audience appeal | High - developer-focused |

### 5.2 Design Direction for Developer Portfolio

**Recommended Approach:** Minimal with personality

**Design Elements:**
1. **Large 404 heading** - Clear indication of error
2. **Brief, friendly message** - "This page doesn't exist" or "Lost in the code?"
3. **ASCII art or code-themed decoration** - Appeals to developer audience
4. **Single CTA** - "Back to Home" button
5. **Optional:** Subtle animation (CSS only, no heavy JS)

**ASCII Art Option:**
```
    ___  ___  ___
   /   \/   \/   \
  | 4  || 0 || 4  |
   \___/\___/\___/
```

### 5.3 Component Implementation

**File:** `src/app/(frontend)/not-found.tsx`

```typescript
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center px-4 text-center">
      {/* ASCII Art - visible but decorative */}
      <pre
        className="mb-8 font-mono text-2xl text-muted-foreground sm:text-3xl"
        aria-hidden="true"
      >
{`  ___  ___  ___
 /   \\/   \\/   \\
| 4  || 0 || 4  |
 \\___/\\___/\\___/`}
      </pre>

      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Page Not Found
      </h1>

      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
      >
        Back to Home
      </Link>
    </main>
  )
}
```

### 5.4 Accessibility Requirements

- **Semantic HTML:** `<main>` landmark, proper heading hierarchy
- **Focus management:** Link has visible focus ring
- **Color contrast:** Text meets WCAG AA (4.5:1 minimum)
- **ASCII art:** Hidden from screen readers with `aria-hidden="true"`
- **Keyboard navigation:** Tab focuses on link, Enter/Space activates
- **Reduced motion:** No animations that can't be disabled

### 5.5 Integration with IP Allowlist (8.5)

The 404 page serves double duty:
1. **Standard 404:** Genuine missing pages
2. **Security 404:** Blocked admin access (security through obscurity)

Both use cases render the same page - blocked users cannot distinguish between "page doesn't exist" and "access denied."

---

## 6. Story 8.5: Admin IP Allowlist Architecture

### 6.1 Middleware Implementation

**File:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require IP allowlist protection
const PROTECTED_PATHS = ['/admin']

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

function getClientIP(request: NextRequest): string {
  // Priority 1: Cloudflare's true client IP (most reliable with CF proxy)
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }

  // Priority 2: x-forwarded-for (first IP in chain)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIP = forwardedFor.split(',')[0]
    return firstIP.trim()
  }

  // Priority 3: x-real-ip fallback
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }

  // No IP found
  return 'unknown'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only check protected paths
  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const allowedIP = process.env.ADMIN_ALLOWED_IP
  const clientIP = getClientIP(request)

  // Log attempt (for Axiom/Vercel logs)
  console.log(`[Middleware] Admin access attempt from IP: ${clientIP}, path: ${pathname}`)

  // If no allowlist configured, deny all (fail secure)
  if (!allowedIP) {
    console.warn('[Middleware] ADMIN_ALLOWED_IP not configured - blocking all admin access')
    return createNotFoundResponse(request)
  }

  // Check if IP is allowed
  if (clientIP !== allowedIP) {
    console.warn(`[Middleware] Blocked admin access - IP: ${clientIP}, expected: ${allowedIP}`)
    return createNotFoundResponse(request)
  }

  // IP matches, allow access
  console.log(`[Middleware] Admin access granted for IP: ${clientIP}`)
  return NextResponse.next()
}

function createNotFoundResponse(request: NextRequest): NextResponse {
  // Return 404 instead of 403 to hide admin existence
  const url = request.nextUrl.clone()
  url.pathname = '/not-found-page-that-triggers-404'

  // Use rewrite to 404 page while maintaining URL
  return NextResponse.rewrite(new URL('/404', request.url), {
    status: 404,
  })
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
```

### 6.2 IP Detection Priority

| Priority | Header | Source | Notes |
|----------|--------|--------|-------|
| 1 | `CF-Connecting-IP` | Cloudflare | True client IP through CF proxy |
| 2 | `x-forwarded-for` | Various proxies | First IP in comma-separated list |
| 3 | `x-real-ip` | Nginx/some proxies | Fallback |

**Why CF-Connecting-IP First:**
The site architecture uses Cloudflare in front of Vercel. `x-forwarded-for` may contain intermediate IPs, but `CF-Connecting-IP` always contains the original client IP set by Cloudflare.

### 6.3 Environment Variable

**Name:** `ADMIN_ALLOWED_IP`
**Location:** Vercel Project Settings (not committed to repo)
**Format:** Single IPv4 address (e.g., `203.0.113.42`)

**Setup Steps:**
1. Find your dedicated IP (run `curl ifconfig.me` or check with ISP)
2. Go to Vercel → Project → Settings → Environment Variables
3. Add `ADMIN_ALLOWED_IP` with your IP value
4. Set for Production environment only (or all if needed)

### 6.4 Security Design Decisions

| Decision | Rationale |
|----------|-----------|
| Return 404 (not 403) | Hides admin panel existence from attackers |
| Fail closed (no IP = deny) | Security over convenience |
| Single IP (not CIDR) | Simpler, more secure for single admin |
| Log all attempts | Audit trail in Axiom/Vercel logs |
| Edge middleware | Blocks before hitting app server |

### 6.5 Testing

**Local Testing:**
```bash
# Test with no IP set (should block)
curl -I http://localhost:3000/admin

# Test with IP header
curl -I -H "CF-Connecting-IP: 127.0.0.1" http://localhost:3000/admin
```

**Production Verification:**
1. Access `/admin` from allowed IP - should load
2. Access `/admin` from different IP/VPN - should show 404
3. Check Vercel logs for middleware output

---

## 7. Story 8.6: Playwright E2E Test Architecture

### 7.1 Installation

```bash
pnpm add -D @playwright/test
npx playwright install chromium
```

### 7.2 Configuration

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],

  webServer: process.env.CI
    ? undefined // CI builds and starts separately
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
      },
})
```

### 7.3 Test File Organization

```
e2e/
├── homepage.spec.ts      # Hero, About, Experience, Education, Projects, Skills, GitHub
├── navigation.spec.ts    # Smooth scroll, mobile menu, skip link
├── contact.spec.ts       # Form validation, submission flow
├── social-links.spec.ts  # Social link visibility and attributes
├── privacy.spec.ts       # Privacy page content
└── fixtures/
    └── index.ts          # Shared test utilities
```

### 7.4 Test Coverage Plan

**File:** `e2e/homepage.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders all main sections', async ({ page }) => {
    // Hero section
    await expect(page.locator('section#hero')).toBeVisible()
    await expect(page.getByRole('heading', { name: /ben ralton/i })).toBeVisible()

    // About section
    await expect(page.locator('section#about')).toBeVisible()

    // Experience section
    await expect(page.locator('section#experience')).toBeVisible()

    // Education section
    await expect(page.locator('section#education')).toBeVisible()

    // Projects section
    await expect(page.locator('section#projects')).toBeVisible()

    // Skills section
    await expect(page.locator('section#skills')).toBeVisible()
  })

  test('displays GitHub activity graph', async ({ page }) => {
    await expect(page.locator('section#github')).toBeVisible()
    await expect(page.getByText(/contributions in the last year/i)).toBeVisible()
  })

  test('CTA buttons are visible and accessible', async ({ page }) => {
    const ctaButtons = page.locator('section#hero').getByRole('link')
    await expect(ctaButtons.first()).toBeVisible()
    await expect(ctaButtons.first()).toHaveAttribute('href')
  })
})
```

**File:** `e2e/navigation.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('smooth scroll to sections', async ({ page }) => {
    await page.goto('/')

    // Click nav link to Projects
    await page.getByRole('link', { name: /projects/i }).click()

    // Verify scroll happened (URL hash or scroll position)
    await expect(page).toHaveURL(/#projects/)
  })

  test('mobile menu toggles correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Menu should be hidden initially
    const nav = page.getByRole('navigation')
    const menuButton = page.getByRole('button', { name: /menu/i })

    await expect(menuButton).toBeVisible()
    await menuButton.click()

    // Menu should be visible after click
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible()
  })

  test('skip link functionality', async ({ page }) => {
    await page.goto('/')

    // Tab to skip link
    await page.keyboard.press('Tab')

    // Skip link should be focused
    const skipLink = page.getByRole('link', { name: /skip to main content/i })
    await expect(skipLink).toBeFocused()
  })
})
```

**File:** `e2e/contact.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('section#contact').scrollIntoViewIfNeeded()
  })

  test('displays validation errors for empty submission', async ({ page }) => {
    await page.getByRole('button', { name: /send message/i }).click()

    await expect(page.getByText(/name must be at least/i)).toBeVisible()
    await expect(page.getByText(/valid email/i)).toBeVisible()
    await expect(page.getByText(/message must be at least/i)).toBeVisible()
  })

  test('validates email format', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/email/i).blur()

    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('successful submission shows toast', async ({ page }) => {
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/message/i).fill('This is a test message for the contact form.')

    await page.getByRole('button', { name: /send message/i }).click()

    // Wait for success toast
    await expect(page.getByText(/message sent/i)).toBeVisible({ timeout: 10000 })
  })
})
```

**File:** `e2e/social-links.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Social Links', () => {
  test('displays social links with correct attributes', async ({ page }) => {
    await page.goto('/')

    const socialNav = page.getByRole('navigation', { name: /social/i })
    await expect(socialNav).toBeVisible()

    // Check external links have proper attributes
    const externalLinks = socialNav.getByRole('link')
    const count = await externalLinks.count()

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i)
      const href = await link.getAttribute('href')

      if (href && !href.startsWith('mailto:')) {
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', /noopener/)
      }
    }
  })
})
```

### 7.5 CI Workflow

**File:** `.github/workflows/e2e.yml`

```yaml
name: Playwright E2E Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  e2e:
    name: Playwright E2E
    runs-on: ubuntu-latest
    timeout-minutes: 15

    env:
      DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db
      PAYLOAD_SECRET: ci-test-secret-not-for-production
      PLAYWRIGHT_BASE_URL: http://localhost:3000

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Run migrations
        run: npx payload migrate

      - name: Seed test data
        run: npx tsx scripts/seed-ci.ts

      - name: Build Next.js app
        run: pnpm build

      - name: Start server
        run: |
          pnpm start &
          sleep 10

      - name: Run Playwright tests
        run: pnpm test:e2e

      - name: Upload test artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-artifacts
          path: |
            playwright-report/
            test-results/
          retention-days: 7
```

### 7.6 Package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

### 7.7 Seed Data Usage

The existing `scripts/seed-ci.ts` provides all necessary test data:
- Hero with CTA buttons
- About section content
- Experience entry
- Education entry
- Project entry
- Skills
- Social links
- GitHub data (mock)

No modifications needed for E2E tests.

---

## 8. CI/CD Workflow Interconnections

### 8.1 Workflow Trigger Matrix

| Workflow | PR Opened | PR Updated | Push to Main |
|----------|-----------|------------|--------------|
| Discord Notifications (8.1) | ✅ | ❌ | ❌ |
| Accessibility CI | ✅ | ✅ | ✅ |
| Playwright E2E (8.6) | ✅ | ✅ | ✅ |
| Dependabot Updates (8.2) | Creates PRs | N/A | N/A |

### 8.2 Workflow Flow

```mermaid
graph TD
    A[Dependabot detects vulnerability] --> B[Creates PR to main]
    B --> C[Discord Notification sent]
    B --> D[Accessibility CI runs]
    B --> E[Playwright E2E runs]
    D --> F{All checks pass?}
    E --> F
    F -->|Yes| G[PR ready for review]
    F -->|No| H[Fix required]
    G --> I[Merge to main]
    I --> D
    I --> E
```

### 8.3 Status Checks for Branch Protection

When branch protection is enabled, require these checks:
1. `Lighthouse Accessibility Audit` (existing)
2. `Playwright E2E` (Story 8.6)

Optional checks (informational):
- `Discord Notification` (doesn't affect merge)

---

## 9. Story 8.7: Project Documentation (README)

### 9.1 README Structure

```markdown
# ralton.dev

Personal portfolio website built with Next.js 15, Payload CMS, and Tailwind CSS.

[![Accessibility CI](badge-url)](workflow-url)
[![Playwright E2E](badge-url)](workflow-url)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **CMS:** Payload 3
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL (Vercel Postgres)
- **Deployment:** Vercel
- **CDN/DNS:** Cloudflare
- **Monitoring:** Axiom

## Architecture

[Mermaid diagram - request flow]

## Local Development

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL 16+

### Setup
[Installation steps]

## CI/CD

[Mermaid diagram - CI flow]
[Workflow descriptions]

## Branch Protection (Ready to Enable)

[Documentation from Story 8.3]
```

### 9.2 Architecture Diagram

```mermaid
graph LR
    A[Visitor] --> B[Cloudflare CDN/DNS]
    B --> C[Vercel Edge]
    C --> D[Next.js App]
    D --> E[Payload CMS]
    E --> F[(PostgreSQL)]
    D --> G[Axiom Telemetry]
```

### 9.3 Data Model Diagram

```mermaid
erDiagram
    Hero ||--o{ CTAButton : has
    About ||--o{ Highlight : has
    Experiences ||--o{ Description : has
    Projects ||--o{ TechStack : has
    ContactSubmissions {
        string name
        string email
        string message
        string ip
        date submittedAt
    }
    SocialLinks {
        string platform
        string url
        boolean isVisible
        number order
    }
    GitHubData {
        string username
        number totalContributions
        json contributionData
        date lastFetched
    }
```

---

## 10. Implementation Order Rationale

### 10.1 Recommended Sequence

1. **Story 8.1: Discord PR Notifications**
   - No dependencies
   - Immediate value for sprint notifications
   - Quick win to build momentum

2. **Story 8.2: Dependabot Security Updates**
   - No dependencies
   - Set-and-forget configuration
   - Pairs with 8.1 for notifications

3. **Story 8.4: Custom 404 Page**
   - No dependencies
   - Required before 8.5 (IP allowlist users see 404)
   - Standalone UI component

4. **Story 8.5: Admin IP Allowlist**
   - Depends on 8.4
   - Security-critical
   - Middleware implementation

5. **Story 8.6: Playwright E2E Tests**
   - No dependencies
   - Longest implementation time
   - Can run in parallel with 8.4/8.5

6. **Story 8.3: Branch Protection Rules**
   - Depends on 8.1, 8.2, 8.6
   - Documentation only (not enforceable yet)
   - Quick to document

7. **Story 8.7: Project Documentation**
   - Benefits from all other stories being complete
   - Can start earlier, finalize last
   - Captures everything implemented

### 10.2 Parallel Execution Options

```
Timeline:
─────────────────────────────────────────────────────────────────
Day 1-2: 8.1 (Discord) + 8.2 (Dependabot) + 8.4 (404 Page)
Day 2-3: 8.5 (IP Allowlist) + 8.6 (Playwright E2E) starts
Day 3-4: 8.6 (Playwright E2E) continues
Day 4:   8.3 (Branch Protection) + 8.7 (Documentation)
─────────────────────────────────────────────────────────────────
```

---

## 11. Environment Variables Summary

### 11.1 New Variables Required

| Variable | Story | Location | Required |
|----------|-------|----------|----------|
| `ADMIN_ALLOWED_IP` | 8.5 | Vercel Project Settings | Yes (Production) |
| `DISCORD_WEBHOOK_URL` | 8.1 | GitHub Secrets | Yes |

### 11.2 Existing Variables (No Changes)

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `CRON_SECRET`
- `GITHUB_TOKEN`
- `RESEND_API_KEY`
- `DISCORD_WEBHOOK_URL` (Vercel - for contact notifications)
- `NEXT_PUBLIC_SITE_URL`

---

## 12. File Summary

### 12.1 New Files to Create

| File | Story | Purpose |
|------|-------|---------|
| `.github/workflows/pr-discord.yml` | 8.1 | Discord PR notifications |
| `.github/dependabot.yml` | 8.2 | Dependabot configuration |
| `src/app/(frontend)/not-found.tsx` | 8.4 | Custom 404 page |
| `src/middleware.ts` | 8.5 | IP allowlist middleware |
| `playwright.config.ts` | 8.6 | Playwright configuration |
| `.github/workflows/e2e.yml` | 8.6 | E2E test workflow |
| `e2e/homepage.spec.ts` | 8.6 | Homepage tests |
| `e2e/navigation.spec.ts` | 8.6 | Navigation tests |
| `e2e/contact.spec.ts` | 8.6 | Contact form tests |
| `e2e/social-links.spec.ts` | 8.6 | Social links tests |
| `e2e/privacy.spec.ts` | 8.6 | Privacy page tests |
| `README.md` | 8.7 | Project documentation |

### 12.2 Files to Modify

| File | Story | Change |
|------|-------|--------|
| `package.json` | 8.6 | Add Playwright dev dependency and test scripts |

---

## 13. Testing Checklist

### Story 8.1 - Discord Notifications
- [ ] Workflow triggers on PR open
- [ ] Discord message includes title, description, author
- [ ] Long descriptions truncated properly
- [ ] Workflow fails gracefully if webhook fails

### Story 8.2 - Dependabot
- [ ] dependabot.yml valid syntax
- [ ] PRs created for outdated deps
- [ ] Labels applied correctly
- [ ] Existing CI workflows trigger on Dependabot PRs

### Story 8.3 - Branch Protection
- [ ] Documentation complete and accurate
- [ ] Step-by-step instructions clear
- [ ] Status check names correct

### Story 8.4 - 404 Page
- [ ] Page renders at `/nonexistent-path`
- [ ] ASCII art displays correctly
- [ ] "Back to Home" link works
- [ ] Focus states visible
- [ ] Screen reader announces content properly

### Story 8.5 - IP Allowlist
- [ ] Allowed IP can access `/admin`
- [ ] Blocked IP sees 404 (not 403)
- [ ] Logs show blocked attempts
- [ ] Non-admin paths unaffected
- [ ] Works with Cloudflare proxy

### Story 8.6 - Playwright E2E
- [ ] All tests pass locally
- [ ] CI workflow completes successfully
- [ ] Artifacts uploaded on failure
- [ ] Tests cover all acceptance criteria

### Story 8.7 - Documentation
- [ ] README renders correctly on GitHub
- [ ] Mermaid diagrams display
- [ ] Installation steps work
- [ ] All environment variables documented

---

## 14. References

- [Discord Webhooks Documentation](https://discord.com/developers/docs/resources/webhook)
- [Dependabot Configuration Options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Next.js not-found.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

*Design document completed 2026-03-11*
