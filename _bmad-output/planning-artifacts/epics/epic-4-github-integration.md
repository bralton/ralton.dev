---
epic: 4
title: 'GitHub Integration'
status: backlog
storyCount: 4
stories: ['4.1', '4.2', '4.3', '4.4']
frs: ['FR8', 'FR9', 'FR10']
nfrs: ['NFR22', 'NFR23', 'NFR27']
shardedFrom: epics.md
date: 2026-03-07
---

# Epic 4: GitHub Integration

> **Design Document:** [epic-4-design-document.md](../epic-4-design-document.md)
> Contains verified GitHub GraphQL API queries, Vercel cron configuration, component specifications, and implementation code. Required reading before story creation.

Visitors can see Ben's authentic coding activity and credibility. The commit graph displays real contribution data, building trust beyond static content.

## Story 4.1: Create GitHub Data Collection and Cron Job

As a **developer**,
I want **a system that fetches GitHub contribution data daily**,
So that **the commit graph stays current without manual updates** (FR10).

**Acceptance Criteria:**

**Given** the Payload CMS is configured
**When** I create the GitHubData global or collection
**Then** it stores: contributionData (JSON), lastFetched (timestamp), username
**And** the data structure supports the commit graph visualization

**Given** GitHub API access is needed
**When** I configure the GitHub integration
**Then** GITHUB_TOKEN environment variable is used for authentication
**And** the token has read access to contribution data

**Given** the cron job needs to run daily
**When** I create `/api/cron/github/route.ts`
**Then** the endpoint fetches contribution data from GitHub GraphQL API
**And** the endpoint stores the data in GitHubData collection
**And** the endpoint is protected by CRON_SECRET

**Given** Vercel cron configuration
**When** I add the cron schedule to `vercel.json`
**Then** the job runs daily at 2:00 AM UTC (NFR22)
**And** the schedule follows Vercel cron syntax

**Given** the cron job executes
**When** the GitHub API is called
**Then** contribution data for the past year is fetched
**And** the lastFetched timestamp is updated
**And** old data is replaced with fresh data

## Story 4.2: Create GitHub Commit Graph Component

As a **visitor**,
I want **to see a GitHub commit graph showing contribution activity**,
So that **I can verify Ben's active coding engagement** (FR8).

**Acceptance Criteria:**

**Given** GitHubData exists in the database
**When** a visitor loads the homepage
**Then** the GitHubGraph component renders the contribution data
**And** the graph displays contribution cells in a calendar grid format

**Given** the graph renders
**When** displaying contribution levels
**Then** cells use green color shades matching the brand (#0d9488 variants)
**And** darker shades indicate more contributions
**And** empty days show as the background color

**Given** the graph needs interactivity
**When** a visitor hovers over a cell (desktop)
**Then** a tooltip shows the date and contribution count
**And** tooltips are accessible

**Given** responsive requirements
**When** viewed on mobile
**Then** the graph scales appropriately or shows a simplified view
**And** the graph doesn't cause horizontal scrolling

**Given** accessibility requirements
**When** the graph renders
**Then** it has an accessible label describing its purpose
**And** color is not the only indicator (patterns or labels available)

## Story 4.3: Add GitHub Profile Link

As a **visitor**,
I want **to click through to Ben's GitHub profile**,
So that **I can explore his repositories and contributions directly** (FR9).

**Acceptance Criteria:**

**Given** the GitHub section exists
**When** the GitHubGraph component renders
**Then** a link to Ben's GitHub profile is displayed
**And** the link includes a GitHub icon and text (e.g., "View on GitHub")

**Given** the GitHub profile link
**When** a visitor clicks it
**Then** GitHub profile opens in a new tab
**And** the link has `rel="noopener noreferrer"` for security
**And** the link has an accessible label

**Given** the SocialLinks collection (from Epic 5)
**When** GitHub is added as a social link
**Then** the GitHub section can use that URL
**Or** the GitHub username is configured in GitHubData

## Story 4.4: Implement Graceful Fallback for GitHub Data

As a **visitor**,
I want **the site to work even if GitHub data is unavailable**,
So that **the experience isn't broken by external service issues** (NFR23, NFR27).

**Acceptance Criteria:**

**Given** the GitHubData collection has cached data
**When** the cron job fails to fetch new data
**Then** the existing cached data continues to display
**And** an error is logged for debugging (Axiom)

**Given** no GitHub data exists at all
**When** a visitor loads the homepage
**Then** the GitHub section displays a friendly fallback message
**Or** the GitHub section is hidden gracefully
**And** the rest of the page functions normally

**Given** the GitHub API returns an error
**When** the cron job runs
**Then** the error is logged with details
**And** the existing data is preserved (not overwritten with error state)
**And** an alert could be configured (optional)

**Given** the frontend requests GitHub data
**When** the data fetch fails
**Then** the component shows cached data or fallback
**And** no error is shown to the visitor
**And** the page still loads within performance targets (NFR1-5)

---
