import { getPayload } from 'payload'
import config from '@payload-config'
import { ExperienceCard } from './ExperienceCard'
import { formatDateRange } from '@/lib/utils'

export async function ExperienceSection() {
  const payload = await getPayload({ config })
  const experiences = await payload.find({
    collection: 'experiences',
    where: {
      isVisible: { equals: true },
    },
    sort: '-startDate',
  })

  if (experiences.docs.length === 0) {
    return null // Hide section entirely if no visible experiences
  }

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2
          id="experience-heading"
          className="mb-8 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
        >
          Experience
        </h2>

        <ul className="space-y-6" role="list" aria-label="Work experience history">
          {experiences.docs.map((experience) => (
            <li key={experience.id}>
              <ExperienceCard
                title={experience.title}
                company={experience.company}
                dateRange={formatDateRange(experience.startDate, experience.endDate)}
                description={experience.description}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
