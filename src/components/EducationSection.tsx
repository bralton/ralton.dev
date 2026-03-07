import { getPayload } from 'payload'
import config from '@payload-config'
import { EducationCard } from './EducationCard'
import { formatDateRange } from '@/lib/utils'

export async function EducationSection() {
  const payload = await getPayload({ config })
  const education = await payload.find({
    collection: 'education',
    where: {
      isVisible: { equals: true },
    },
    sort: '-startDate',
  })

  if (education.docs.length === 0) {
    return null // Hide section entirely if no visible education
  }

  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2
          id="education-heading"
          className="mb-8 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
        >
          Education
        </h2>

        <ul className="space-y-6" role="list" aria-label="Education history">
          {education.docs.map((edu) => (
            <li key={edu.id}>
              <EducationCard
                degree={edu.degree}
                institution={edu.institution}
                dateRange={formatDateRange(edu.startDate, edu.endDate)}
                description={edu.description}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
