import { getPayload } from 'payload'
import config from '@payload-config'
import type { ContributionDay, ContributionWeek } from '@/lib/github'

/**
 * Type guard to validate contribution data structure from database.
 * Ensures JSON data matches expected ContributionWeek[] shape.
 */
function isValidContributionData(data: unknown): data is ContributionWeek[] {
  if (!Array.isArray(data)) return false
  if (data.length === 0) return true // Empty array is valid
  // Check first week has expected structure
  const firstWeek = data[0]
  return (
    typeof firstWeek === 'object' &&
    firstWeek !== null &&
    'contributionDays' in firstWeek &&
    Array.isArray(firstWeek.contributionDays)
  )
}

const levelToColorClass: Record<string, string> = {
  NONE: 'bg-muted dark:bg-gray-800',
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

  // Graceful fallback - hide section if no data or invalid data structure
  if (!githubData?.contributionData || !isValidContributionData(githubData.contributionData)) {
    return null
  }

  // Data is validated by type guard above
  const weeks: ContributionWeek[] = githubData.contributionData
  const totalContributions = githubData.totalContributions ?? 0
  const username = typeof githubData.username === 'string' ? githubData.username : 'GitHub'

  return (
    <section
      id="github"
      aria-labelledby="github-heading"
      className="px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2 id="github-heading" className="mb-6 text-2xl font-bold">
          GitHub Activity
        </h2>

        <p className="mb-4 text-muted-foreground">
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
                {week.contributionDays.map((day: ContributionDay) => (
                  <div
                    key={day.date}
                    className={`h-2.5 w-2.5 rounded-sm ${levelToColorClass[day.contributionLevel] || 'bg-muted'}`}
                    title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            {Object.entries(levelToColorClass).map(([level, colorClass]) => (
              <div
                key={level}
                className={`h-2.5 w-2.5 rounded-sm ${colorClass}`}
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
          className="mt-6 inline-flex items-center gap-2 rounded text-teal-700 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background dark:text-teal-400 dark:hover:text-teal-300"
        >
          <GitHubIcon className="h-5 w-5" />
          <span>View on GitHub</span>
        </a>
      </div>
    </section>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
