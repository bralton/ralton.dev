import { getPayload } from 'payload'
import config from '@payload-config'

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'

export interface ContributionDay {
  contributionCount: number
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE'
  date: string
}

export interface ContributionWeek {
  contributionDays: ContributionDay[]
}

export interface ContributionCalendar {
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
        Authorization: `Bearer ${token}`,
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
        contributionData: contributions.weeks,
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
