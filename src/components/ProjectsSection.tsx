import { getPayload } from 'payload'
import config from '@payload-config'
import { Section } from './Section'
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
    return null // Hide section entirely if no visible projects (FR-R15)
  }

  const count = projects.docs.length
  return (
    <Section id="projects" label="projects" meta={`${count} shipped · full write-ups on click`}>
      <div className="grid grid-cols-1 gap-5 desk:grid-cols-2">
        {projects.docs.map((project, index) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            techStack={project.techStack || []}
            repoUrl={project.repoUrl}
            liveUrl={project.liveUrl}
            image={project.image}
            index={index}
          />
        ))}
      </div>
    </Section>
  )
}
