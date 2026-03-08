import { getPayload } from 'payload'
import config from '@payload-config'
import { Badge } from '@/components/ui/badge'

export async function SkillsSection() {
  const payload = await getPayload({ config })
  const skills = await payload.find({
    collection: 'skills',
    where: {
      isVisible: { equals: true },
    },
    sort: 'category',
    limit: 100,
  })

  if (skills.docs.length === 0) {
    return null // Hide section entirely if no visible skills
  }

  // Group skills by category
  const skillsByCategory = skills.docs.reduce(
    (acc, skill) => {
      const category = skill.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills.docs>
  )

  // Sort categories alphabetically for consistent order
  const sortedCategories = Object.keys(skillsByCategory).sort()

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2
          id="skills-heading"
          className="mb-8 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
        >
          Skills
        </h2>

        <div className="space-y-6">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{category}</h3>
              <ul className="flex flex-wrap gap-2" role="list" aria-label={`${category} skills`}>
                {skillsByCategory[category].map((skill) => (
                  <li key={skill.id}>
                    <Badge
                      variant="outline"
                      className="border-teal-700/50 bg-teal-900/30 text-teal-400"
                    >
                      {skill.name}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
