import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Section } from './Section'
import type { Experience } from '@/payload-types'

const VISIBLE_ROLES = 4

const CATEGORY_LABELS: Record<string, string> = {
  'Cloud Platforms': 'cloud',
  DevOps: 'iac / ops',
  'CI/CD': 'ci/cd',
  'Languages & Frameworks': 'code',
  Databases: 'data',
  'Soft Skills': 'people',
  'Tools & Workflow': 'tools',
}

function formatMonthYear(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function yearOf(date: string): string {
  return String(new Date(date).getFullYear())
}

export async function ExperienceSection() {
  const payload = await getPayload({ config })

  const [experiences, education, skills] = await Promise.all([
    payload.find({
      collection: 'experiences',
      where: { isVisible: { equals: true } },
      sort: '-startDate',
      limit: 100,
    }),
    payload.find({
      collection: 'education',
      where: { isVisible: { equals: true } },
      sort: '-startDate',
      limit: 100,
    }),
    payload.find({
      collection: 'skills',
      where: { isVisible: { equals: true } },
      sort: 'category',
      limit: 200,
    }),
  ])

  if (experiences.docs.length === 0) {
    return null // Hide section entirely if no visible experiences (FR-R15)
  }

  const recentRoles = experiences.docs.slice(0, VISIBLE_ROLES)
  const earlierRoles = experiences.docs.slice(VISIBLE_ROLES)

  const skillsByCategory = new Map<string, string[]>()
  for (const skill of skills.docs) {
    const list = skillsByCategory.get(skill.category) ?? []
    list.push(skill.name)
    skillsByCategory.set(skill.category, list)
  }

  const earliest = experiences.docs[experiences.docs.length - 1]
  const meta = `${yearOf(earliest.startDate)} — present`

  return (
    <Section id="experience" label="experience" meta={meta}>
      <div className="grid gap-10 desk:grid-cols-[1.5fr_1fr] desk:gap-12">
        {/* Timeline */}
        <div className="relative pl-6">
          <span aria-hidden="true" className="absolute bottom-2 left-1 top-2 w-px bg-border" />
          <ol role="list" aria-label="Work experience history">
            {recentRoles.map((role) => (
              <TimelineItem key={role.id} role={role} />
            ))}
          </ol>
          {earlierRoles.length > 0 && (
            <details className="group/earlier">
              <summary className="cursor-pointer list-none rounded py-1 font-mono text-xs text-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="text-text-tertiary">
                  <span className="group-open/earlier:hidden">+ </span>
                  <span className="hidden group-open/earlier:inline">− </span>
                </span>
                earlier roles ({earlierRoles.length})
              </summary>
              <ol role="list" aria-label="Earlier work experience" className="pt-5">
                {earlierRoles.map((role) => (
                  <TimelineItem key={role.id} role={role} />
                ))}
              </ol>
            </details>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {education.docs.length > 0 && (
            <div>
              <h3 className="mb-3.5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-text-tertiary">
                education &amp; certs
              </h3>
              <ul role="list" aria-label="Education and certifications">
                {education.docs.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex justify-between gap-3 border-b border-border-soft py-3 first:border-t"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{entry.degree}</p>
                      <p className="text-[13px] text-text-tertiary">{entry.institution}</p>
                    </div>
                    <span className="whitespace-nowrap pt-0.5 font-mono text-[11.5px] text-text-tertiary">
                      {yearOf(entry.startDate)}–
                      {entry.endDate ? yearOf(entry.endDate).slice(2) : 'now'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {skillsByCategory.size > 0 && (
            <div>
              <h3 className="mb-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-text-tertiary">
                toolbox
              </h3>
              <ul role="list" aria-label="Skills by category">
                {[...skillsByCategory.entries()].map(([category, names]) => (
                  <li key={category} className="flex items-baseline gap-2.5 py-1.5 text-[13px]">
                    <span className="min-w-[88px] shrink-0 font-mono text-[11px] text-text-tertiary">
                      {CATEGORY_LABELS[category] ?? category.toLowerCase()}
                    </span>
                    <span className="text-text-secondary">{names.join(' · ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </Section>
  )
}

function TimelineItem({ role }: { role: Experience }) {
  const isCurrent = !role.endDate
  return (
    <li className="relative pb-7 last:pb-0">
      <span
        aria-hidden="true"
        className={`absolute -left-6 top-1.5 h-[9px] w-[9px] rounded-full border-2 ${
          isCurrent ? 'border-teal bg-teal-ink' : 'border-text-tertiary bg-background'
        }`}
      />
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h4 className="text-[15.5px] font-bold text-foreground">{role.title}</h4>
        <span className="text-sm font-medium text-teal-dim">{role.company}</span>
      </div>
      <p className="mb-2 mt-0.5 font-mono text-[11.5px] text-text-tertiary">
        {formatMonthYear(role.startDate)} —{' '}
        {role.endDate ? formatMonthYear(role.endDate) : 'present'}
      </p>
      {role.description && (
        <div className="prose prose-invert max-w-[60ch] text-[13.5px] text-text-secondary prose-p:my-1.5">
          <RichText data={role.description} />
        </div>
      )}
    </li>
  )
}
