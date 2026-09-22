import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Section } from './Section'
import { ProjectCard } from './ProjectCard'

/** How many projects the homepage showcases; the rest live at /projects. */
const HOMEPAGE_PROJECT_LIMIT = 4

export async function ProjectsSection() {
  const payload = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    where: {
      isVisible: { equals: true },
    },
    sort: '_order', // Admin drag-and-drop order (orderable: true); unordered docs sort last
    limit: HOMEPAGE_PROJECT_LIMIT,
    depth: 1, // Populate image relationship
  })

  if (projects.docs.length === 0) {
    return null // Hide section entirely if no visible projects (FR-R15)
  }

  const total = projects.totalDocs
  const meta =
    total > projects.docs.length ? (
      <Link
        href="/projects"
        className="rounded text-teal hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        all {total} projects →
      </Link>
    ) : (
      `${total} shipped · full write-ups on click`
    )

  return (
    <Section id="projects" label="projects" meta={meta}>
      <div className="grid grid-cols-1 gap-5 desk:grid-cols-2">
        {projects.docs.map((project, index) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            techStack={project.techStack || []}
            links={project.links ?? []}
            privacyPolicyHref={project.privacyPolicy ? `/projects/${project.slug}/privacy` : null}
            image={project.image}
            index={index}
          />
        ))}
      </div>
    </Section>
  )
}
