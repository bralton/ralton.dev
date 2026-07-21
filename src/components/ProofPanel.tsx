import { getPayload } from 'payload'
import config from '@payload-config'
import type { ContributionDay, ContributionWeek } from '@/lib/github'

/**
 * Type guard to validate contribution data structure from database.
 * Ensures JSON data matches expected ContributionWeek[] shape.
 */
function isValidContributionData(data: unknown): data is ContributionWeek[] {
  if (!Array.isArray(data)) return false
  if (data.length === 0) return true
  const firstWeek = data[0]
  return (
    typeof firstWeek === 'object' &&
    firstWeek !== null &&
    'contributionDays' in firstWeek &&
    Array.isArray(firstWeek.contributionDays)
  )
}

const levelToColorClass: Record<string, string> = {
  NONE: 'bg-panel-2',
  FIRST_QUARTILE: 'bg-teal-950',
  SECOND_QUARTILE: 'bg-teal-deep',
  THIRD_QUARTILE: 'bg-teal-dim',
  FOURTH_QUARTILE: 'bg-teal',
}

const DESKTOP_WEEKS = 26
const MOBILE_WEEKS = 16

export async function ProofPanel() {
  const payload = await getPayload({ config })

  const [githubData, experiences, education] = await Promise.all([
    payload.findGlobal({ slug: 'github-data' }),
    payload.find({
      collection: 'experiences',
      where: { isVisible: { equals: true } },
      sort: 'startDate',
      limit: 1,
    }),
    payload.find({
      collection: 'education',
      where: { isVisible: { equals: true } },
      sort: '-startDate',
      limit: 1,
    }),
  ])

  const hasGraph =
    !!githubData?.contributionData && isValidContributionData(githubData.contributionData)
  const weeks: ContributionWeek[] = hasGraph
    ? (githubData.contributionData as ContributionWeek[]).slice(-DESKTOP_WEEKS)
    : []
  const totalContributions = githubData?.totalContributions ?? null
  const username = typeof githubData?.username === 'string' ? githubData.username : null

  const earliestStart = experiences.docs[0]?.startDate
  const yearsInTech = earliestStart
    ? Math.max(1, Math.floor((Date.now() - new Date(earliestStart).getTime()) / 31557600000))
    : null

  const cert = education.docs[0] ?? null

  // Nothing to prove - suppress the panel entirely (FR-R15)
  if (!hasGraph && totalContributions === null && yearsInTech === null && !cert) {
    return null
  }

  return (
    <aside
      aria-label="GitHub activity and career stats"
      className="rounded-panel border border-border bg-panel p-5 desk:p-6"
    >
      {(username || hasGraph) && (
        <div className="mb-3.5 flex items-baseline justify-between gap-4">
          <span className="truncate font-mono text-xs text-text-tertiary">
            {username ? (
              <>
                <span className="font-semibold text-text-secondary">github.com/{username}</span> —
                last 12 months
              </>
            ) : (
              'github — last 12 months'
            )}
          </span>
          {username && (
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded font-mono text-xs text-teal hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-panel"
            >
              view ↗
            </a>
          )}
        </div>
      )}

      {hasGraph && (
        <>
          <div aria-hidden="true" className="mb-4 flex justify-between gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className={`flex-col gap-[3px] ${
                  weekIndex < DESKTOP_WEEKS - MOBILE_WEEKS ? 'hidden sm:flex' : 'flex'
                }`}
              >
                {week.contributionDays.map((day: ContributionDay) => (
                  <div
                    key={day.date}
                    className={`aspect-square w-2.5 rounded-[2px] ${
                      levelToColorClass[day.contributionLevel] || 'bg-panel-2'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
          <p className="sr-only">
            GitHub contribution graph showing {totalContributions ?? 'recent'} contributions in the
            last year.
          </p>
        </>
      )}

      <dl className="grid grid-cols-3 gap-3 border-t border-border-soft pt-4">
        {totalContributions !== null && (
          <div>
            <dd className="text-xl font-bold tabular-nums text-foreground">
              {totalContributions.toLocaleString()}
            </dd>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
              contributions
            </dt>
          </div>
        )}
        {yearsInTech !== null && (
          <div>
            <dd className="text-xl font-bold tabular-nums text-foreground">{yearsInTech}+</dd>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
              years in tech
            </dt>
          </div>
        )}
        {cert && (
          <div>
            <dd className="truncate text-xl font-bold text-foreground">{cert.institution}</dd>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
              certified
            </dt>
          </div>
        )}
      </dl>
    </aside>
  )
}
