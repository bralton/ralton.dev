# Epic 4 Design Document: GitHub Integration

**Date:** 2026-03-08
**Epic:** 4 - GitHub Integration
**Status:** Design Complete
**Purpose:** Enable autonomous story execution by front-loading all technical decisions

---

## Executive Summary

This document provides all technical specifications needed to implement Epic 4 autonomously. It covers:
- GitHub GraphQL API query structure and authentication
- Vercel cron job configuration and security
- Commit graph component design with accessibility
- Fallback and error handling patterns
- Testing strategy

**With this document, Epic 4 stories can execute autonomously like Epics 2 and 3.**

---

## 1. GitHub GraphQL API Specification

### 1.1 API Endpoint

```
POST https://api.github.com/graphql
```

### 1.2 Authentication

**Required Header:**
```
Authorization: Bearer ${GITHUB_TOKEN}
```

**Token Scopes Required:**
- Fine-grained tokens: No special permissions needed for public contribution data
- Classic tokens: `read:user` scope for private repository contributions

**Verified Working Token Type:**
- Fine-grained personal access token (tested 2026-03-08)
- No special permissions selected - public contribution data accessible by default

**How to Generate Token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Create new token (no special permissions needed for public contributions)
3. Copy token value to `GITHUB_TOKEN` environment variable

### 1.3 GraphQL Query

```graphql
query ContributionCalendar($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            contributionLevel
            date
          }
        }
      }
    }
  }
}
```

**Variables:**
```json
{
  "username": "bralton",
  "from": "2025-03-08T00:00:00Z",
  "to": "2026-03-08T23:59:59Z"
}
```

**DateTime Format:** ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)

**Date Range:** Query the past 365 days from current date

### 1.4 Response Schema

```typescript
interface GitHubContributionResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: ContributionWeek[]
        }
      }
    }
  }
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface ContributionDay {
  contributionCount: number
  contributionLevel: ContributionLevel
  date: string // YYYY-MM-DD format
}

type ContributionLevel =
  | 'NONE'           // 0 contributions
  | 'FIRST_QUARTILE' // Low activity
  | 'SECOND_QUARTILE' // Medium activity
  | 'THIRD_QUARTILE'  // High activity
  | 'FOURTH_QUARTILE' // Very high activity
```

### 1.5 Implementation Code

**File:** `src/lib/github.ts`

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'

interface ContributionDay {
  contributionCount: number
  contributionLevel: string
  date: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface ContributionCalendar {
  totalContributions: number
  weeks: ContributionWeek[]
}

interface GitHubContributionResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar
      }
    }
  }
  errors?: Array<{ message: string }>
}

const CONTRIBUTION_QUERY = `
  query ContributionCalendar($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
            }
          }
        }
      }
    }
  }
`

export async function fetchGitHubContributions(
  username: string
): Promise<ContributionCalendar | null> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.error('[GitHub] GITHUB_TOKEN environment variable not set')
    return null
  }

  // Calculate date range (past 365 days)
  const to = new Date()
  const from = new Date()
  from.setFullYear(from.getFullYear() - 1)

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CONTRIBUTION_QUERY,
        variables: {
          username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
    })

    if (!response.ok) {
      console.error('[GitHub] API request failed:', response.status, response.statusText)
      return null
    }

    const result: GitHubContributionResponse = await response.json()

    if (result.errors) {
      console.error('[GitHub] GraphQL errors:', result.errors)
      return null
    }

    return result.data.user.contributionsCollection.contributionCalendar
  } catch (error) {
    console.error('[GitHub] Failed to fetch contributions:', error)
    return null
  }
}

export async function updateGitHubData(username: string): Promise<boolean> {
  const contributions = await fetchGitHubContributions(username)

  if (!contributions) {
    console.error('[GitHub] No contribution data to save')
    return false
  }

  try {
    const payload = await getPayload({ config })

    // Upsert the GitHub data global
    await payload.updateGlobal({
      slug: 'github-data',
      data: {
        username,
        totalContributions: contributions.totalContributions,
        contributionData: JSON.stringify(contributions.weeks),
        lastFetched: new Date().toISOString(),
      },
    })

    console.log('[GitHub] Successfully updated contribution data')
    return true
  } catch (error) {
    console.error('[GitHub] Failed to save contribution data:', error)
    return false
  }
}
```

### 1.6 Verified Response Sample

**Tested 2026-03-08 with username `bralton`:**

```json
{
  "data": {
    "user": {
      "contributionsCollection": {
        "contributionCalendar": {
          "totalContributions": 426,
          "weeks": [
            {
              "contributionDays": [
                {"contributionCount": 0, "contributionLevel": "NONE", "date": "2025-03-09"},
                {"contributionCount": 10, "contributionLevel": "SECOND_QUARTILE", "date": "2025-03-13"},
                // ... more days
              ]
            },
            // ... 52 weeks total
            {
              "contributionDays": [
                {"contributionCount": 30, "contributionLevel": "FOURTH_QUARTILE", "date": "2026-03-07"},
                {"contributionCount": 0, "contributionLevel": "NONE", "date": "2026-03-08"}
              ]
            }
          ]
        }
      }
    }
  }
}
```

**Verified contribution levels observed:**
- `NONE` - 0 contributions
- `FIRST_QUARTILE` - 1-7 contributions (observed: 1, 2, 3, 5, 7)
- `SECOND_QUARTILE` - 8-15 contributions (observed: 10, 15, 16)
- `FOURTH_QUARTILE` - 30+ contributions (observed: 30, 31, 37, 52, 59, 65)

**Note:** `THIRD_QUARTILE` exists in the schema but wasn't observed in this dataset.

### 1.7 Rate Limits

- **Primary rate limit:** 5,000 requests per hour per authenticated user
- **Secondary rate limits:** May apply based on query complexity
- **Recommendation:** Daily cron (1 request/day) is well within limits

---

## 2. Payload CMS Data Collection

### 2.1 GitHubData Global Configuration

**File:** `src/collections/GitHubData.ts`

```typescript
import type { GlobalConfig } from 'payload'

export const GitHubData: GlobalConfig = {
  slug: 'github-data',
  admin: {
    description: 'Cached GitHub contribution data fetched daily via cron job',
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      admin: {
        description: 'GitHub username to fetch contributions for',
      },
    },
    {
      name: 'totalContributions',
      type: 'number',
      admin: {
        description: 'Total contributions in the past year',
        readOnly: true,
      },
    },
    {
      name: 'contributionData',
      type: 'json',
      admin: {
        description: 'JSON array of weekly contribution data',
        readOnly: true,
      },
    },
    {
      name: 'lastFetched',
      type: 'date',
      admin: {
        description: 'Timestamp of last successful data fetch',
        readOnly: true,
        date: {
          displayFormat: 'MMM d, yyyy h:mm a',
        },
      },
    },
  ],
}
```

### 2.2 Register Global in Payload Config

**Update:** `src/payload.config.ts`

```typescript
import { GitHubData } from './collections/GitHubData'

// Add to globals array:
globals: [Hero, About, GitHubData],
```

---

## 3. Vercel Cron Job Configuration

### 3.1 vercel.json Configuration

**File:** `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/github",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Schedule Explanation:** `0 2 * * *` = Every day at 2:00 AM UTC

### 3.2 Cron Route Handler

**File:** `src/app/api/cron/github/route.ts`

```typescript
import type { NextRequest } from 'next/server'
import { updateGitHubData } from '@/lib/github'

// GitHub username to fetch contributions for
const GITHUB_USERNAME = 'bralton'

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[Cron/GitHub] Unauthorized request attempted')
    return new Response('Unauthorized', { status: 401 })
  }

  console.log('[Cron/GitHub] Starting daily GitHub data refresh')

  try {
    const success = await updateGitHubData(GITHUB_USERNAME)

    if (success) {
      console.log('[Cron/GitHub] Successfully refreshed GitHub data')
      return Response.json({
        success: true,
        message: 'GitHub data refreshed',
        timestamp: new Date().toISOString(),
      })
    } else {
      console.error('[Cron/GitHub] Failed to refresh GitHub data')
      return Response.json({
        success: false,
        message: 'Failed to refresh GitHub data',
      }, { status: 500 })
    }
  } catch (error) {
    console.error('[Cron/GitHub] Unexpected error:', error)
    return Response.json({
      success: false,
      message: 'Unexpected error during refresh',
    }, { status: 500 })
  }
}
```

### 3.3 Security: CRON_SECRET

**Environment Variable:** `CRON_SECRET`

- Generate a random 16+ character string
- Add to Vercel environment variables (Production only)
- Vercel automatically sends as `Authorization: Bearer <CRON_SECRET>` header

**Generation Example:**
```bash
openssl rand -base64 24
```

---

## 4. Commit Graph Component Design

### 4.1 Visual Specification

**Layout:**
- Calendar grid format (weeks as columns, days as rows)
- 52-53 weeks displayed (one year of data)
- 7 rows per column (Sun-Sat)
- Each cell: 10x10px with 2px gap

**Color Scale (teal brand colors):**

| Level | CSS Class | Color | Description |
|-------|-----------|-------|-------------|
| NONE | `bg-muted` | gray-200/800 | No contributions |
| FIRST_QUARTILE | `bg-teal-200` | #99f6e4 | Low activity |
| SECOND_QUARTILE | `bg-teal-400` | #2dd4bf | Medium activity |
| THIRD_QUARTILE | `bg-teal-600` | #0d9488 | High activity |
| FOURTH_QUARTILE | `bg-teal-800` | #115e59 | Very high activity |

**Dark Mode Colors:**

| Level | Dark Mode Color |
|-------|-----------------|
| NONE | gray-800 |
| FIRST_QUARTILE | teal-900 |
| SECOND_QUARTILE | teal-700 |
| THIRD_QUARTILE | teal-500 |
| FOURTH_QUARTILE | teal-300 |

### 4.2 Component Structure

**File:** `src/components/GitHubGraph.tsx`

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

interface ContributionDay {
  contributionCount: number
  contributionLevel: string
  date: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

const levelToColorClass: Record<string, string> = {
  NONE: 'bg-muted',
  FIRST_QUARTILE: 'bg-teal-200 dark:bg-teal-900',
  SECOND_QUARTILE: 'bg-teal-400 dark:bg-teal-700',
  THIRD_QUARTILE: 'bg-teal-600 dark:bg-teal-500',
  FOURTH_QUARTILE: 'bg-teal-800 dark:bg-teal-300',
}

export async function GitHubGraph() {
  const payload = await getPayload({ config })

  const githubData = await payload.findGlobal({
    slug: 'github-data',
  })

  // Handle missing data gracefully
  if (!githubData?.contributionData) {
    return null // Hide section entirely if no data
  }

  const weeks: ContributionWeek[] = JSON.parse(
    githubData.contributionData as string
  )
  const totalContributions = githubData.totalContributions ?? 0
  const username = githubData.username ?? 'GitHub'

  return (
    <section
      id="github"
      aria-labelledby="github-heading"
      className="py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="github-heading"
          className="text-2xl font-bold mb-6"
        >
          GitHub Activity
        </h2>

        <p className="text-muted-foreground mb-4">
          {totalContributions.toLocaleString()} contributions in the last year
        </p>

        {/* Contribution Grid */}
        <div
          className="overflow-x-auto pb-4"
          role="img"
          aria-label={`GitHub contribution graph showing ${totalContributions} contributions over the past year`}
        >
          <div className="inline-flex gap-0.5">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.contributionDays.map((day) => (
                  <div
                    key={day.date}
                    className={`w-2.5 h-2.5 rounded-sm ${levelToColorClass[day.contributionLevel] || 'bg-muted'}`}
                    title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            {Object.entries(levelToColorClass).map(([level, colorClass]) => (
              <div
                key={level}
                className={`w-2.5 h-2.5 rounded-sm ${colorClass}`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {/* GitHub Profile Link */}
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background rounded"
        >
          <GitHubIcon className="w-5 h-5" />
          <span>View on GitHub</span>
        </a>
      </div>
    </section>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
```

### 4.3 Accessibility Requirements

**WCAG 2.1 AA Compliance:**

1. **Color Not Sole Indicator:**
   - Legend with "Less" and "More" labels
   - Tooltips show exact contribution count
   - `aria-label` on container describes total contributions

2. **Screen Reader Support:**
   - `role="img"` on graph container
   - Comprehensive `aria-label` describing the data
   - Individual cells hidden from screen readers (`aria-hidden="true"`)
   - Alternative text in section heading and paragraph

3. **Focus States:**
   - GitHub link has visible focus ring
   - Pattern: `focus:ring-2 focus:ring-teal-700 focus:ring-offset-2`

4. **Semantic Structure:**
   - `<section>` with `aria-labelledby`
   - Proper heading hierarchy (`<h2>`)

### 4.4 Responsive Behavior

**Mobile (< 640px):**
- Horizontal scroll enabled for graph
- Graph maintains consistent cell size
- No vertical cropping

**Tablet/Desktop:**
- Full graph visible without scroll on most screens
- Max width container (4xl) centers content

---

## 5. Fallback and Error Handling

### 5.1 Fallback Strategy

**Scenario 1: No Data Exists**
```typescript
if (!githubData?.contributionData) {
  return null // Hide entire GitHub section
}
```

**Scenario 2: Cron Job Fails**
- Existing cached data preserved (not overwritten)
- Error logged to Axiom
- Frontend continues displaying last successful data

**Scenario 3: GitHub API Error**
```typescript
// In lib/github.ts
if (result.errors) {
  console.error('[GitHub] GraphQL errors:', result.errors)
  return null // Return null, don't throw
}
```

### 5.2 Error Logging Pattern

**Console Prefix:** `[GitHub]` or `[Cron/GitHub]`

```typescript
console.log('[GitHub] Successfully updated contribution data')
console.error('[GitHub] Failed to fetch contributions:', error)
console.error('[Cron/GitHub] Unauthorized request attempted')
```

**Axiom Integration:** All console.log/error statements are captured by Axiom via OpenTelemetry (already configured in Epic 1).

### 5.3 Graceful Degradation

| Scenario | Behavior | User Impact |
|----------|----------|-------------|
| No GITHUB_TOKEN | Cron fails, logged | Section hidden |
| GitHub API down | Cached data used | Stale data shown |
| First deployment (no data) | Section hidden | Clean page |
| Invalid token | Cron fails, logged | Section hidden |
| Rate limited | Cached data preserved | Stale data shown |

---

## 6. Environment Variables

### 6.1 New Variables Required

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes | GitHub personal access token with `read:user` scope |
| `CRON_SECRET` | Yes | Random 16+ char string for cron authentication |

### 6.2 Update .env Files

**File:** `.env.local`
```bash
# GitHub Integration (Epic 4)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CRON_SECRET=your-random-16-char-string
```

**File:** `.env.example`
```bash
# GitHub Integration (Epic 4)
GITHUB_TOKEN=
CRON_SECRET=
```

### 6.3 Vercel Environment Variables

Add to Vercel project settings:
1. Go to Project → Settings → Environment Variables
2. Add `GITHUB_TOKEN` (Production + Preview)
3. Add `CRON_SECRET` (Production only - cron doesn't run in Preview)

---

## 7. Testing Strategy

### 7.1 Local Development Testing

**Test GitHub API:**
```bash
# Run dev server
pnpm dev

# Test cron endpoint manually (no auth in local)
curl http://localhost:3000/api/cron/github
```

**Mock Cron Secret Locally:**
```typescript
// In route.ts, add for local testing:
if (process.env.NODE_ENV === 'development') {
  // Skip auth check in development
} else {
  // Production auth check
}
```

### 7.2 Testing Scenarios

| Test Case | Method | Expected Result |
|-----------|--------|-----------------|
| Valid GitHub token | Call API | Data stored in DB |
| Invalid GitHub token | Call API | Error logged, no data |
| Missing GITHUB_TOKEN | Call API | Error logged, null returned |
| Valid CRON_SECRET | Hit /api/cron/github | 200 OK, data updated |
| Invalid CRON_SECRET | Hit /api/cron/github | 401 Unauthorized |
| No cached data | Load component | Section hidden |
| Cached data exists | Load component | Graph renders |
| API failure with cache | Cron fails | Old data preserved |

### 7.3 Manual Verification Checklist

**Story 4.1 (Data Collection + Cron):**
- [ ] GITHUB_TOKEN works with GraphQL API
- [ ] Contribution data fetches correctly
- [ ] Data saves to GitHubData global
- [ ] Cron endpoint rejects unauthorized requests
- [ ] vercel.json cron configuration valid

**Story 4.2 (Commit Graph Component):**
- [ ] Graph renders with correct colors
- [ ] Tooltips show on hover
- [ ] Legend displays correctly
- [ ] Dark mode colors work
- [ ] Mobile scroll works

**Story 4.3 (GitHub Profile Link):**
- [ ] Link opens in new tab
- [ ] Has rel="noopener noreferrer"
- [ ] Focus state visible
- [ ] Icon renders correctly

**Story 4.4 (Fallback):**
- [ ] Section hides when no data
- [ ] Cached data persists on fetch failure
- [ ] Errors logged to console/Axiom
- [ ] Page loads normally without GitHub data

---

## 8. Implementation Sequence

### Recommended Story Order

1. **Story 4.1: Create GitHub Data Collection and Cron Job**
   - Create `src/collections/GitHubData.ts`
   - Register in `payload.config.ts`
   - Create `src/lib/github.ts`
   - Create `src/app/api/cron/github/route.ts`
   - Add `vercel.json` cron configuration
   - Update `.env.local` and `.env.example`

2. **Story 4.2: Create GitHub Commit Graph Component**
   - Create `src/components/GitHubGraph.tsx`
   - Add to homepage (after Skills section)
   - Implement color scale and legend
   - Add responsive scroll behavior

3. **Story 4.3: Add GitHub Profile Link**
   - Add link to GitHubGraph component
   - Create GitHubIcon component
   - Ensure accessibility compliance

4. **Story 4.4: Implement Graceful Fallback**
   - Add null checks to GitHubGraph
   - Verify error handling in lib/github.ts
   - Test all fallback scenarios
   - Document behavior

---

## 9. File Summary

### New Files to Create

| File | Story | Purpose |
|------|-------|---------|
| `src/collections/GitHubData.ts` | 4.1 | Payload global for cached data |
| `src/lib/github.ts` | 4.1 | GitHub API helper functions |
| `src/app/api/cron/github/route.ts` | 4.1 | Cron job endpoint |
| `vercel.json` | 4.1 | Cron schedule configuration |
| `src/components/GitHubGraph.tsx` | 4.2/4.3 | Contribution graph component |

### Files to Modify

| File | Story | Change |
|------|-------|--------|
| `src/payload.config.ts` | 4.1 | Add GitHubData to globals |
| `src/app/(frontend)/page.tsx` | 4.2 | Add GitHubGraph section |
| `.env.local` | 4.1 | Add GITHUB_TOKEN, CRON_SECRET |
| `.env.example` | 4.1 | Document new env vars |

---

## 10. References

- [GitHub GraphQL API - ContributionsCollection](https://docs.github.com/en/graphql/reference/objects#contributionscollection)
- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Vercel Cron Jobs Security](https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs)
- [Adding GitHub Contribution Graph to Next.js](https://williamcallahan.com/blog/adding-github-contribution-graph-to-nextjs)

---

*Design document completed 2026-03-08*
