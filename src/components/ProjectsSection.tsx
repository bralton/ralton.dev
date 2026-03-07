import { getPayload } from 'payload'
import config from '@payload-config'
import { ProjectCard } from './ProjectCard'

export async function ProjectsSection() {
  const payload = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    where: {
      isVisible: { equals: true },
    },
    sort: '-createdAt',
    depth: 1, // Populate image relationship
  })

  if (projects.docs.length === 0) {
    return null // Hide section entirely if no visible projects
  }

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2
          id="projects-heading"
          className="mb-8 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
        >
          Projects
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {projects.docs.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              techStack={project.techStack || []}
              repoUrl={project.repoUrl}
              liveUrl={project.liveUrl}
              image={project.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
