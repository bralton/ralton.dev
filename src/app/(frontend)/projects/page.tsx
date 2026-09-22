/**
 * Projects Index Page
 *
 * Lists every visible project in admin drag-and-drop order at /projects.
 * The homepage showcases only the first few; this is the full catalogue.
 */

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ProjectCard } from '@/components/ProjectCard'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

const description =
  'Everything Ben Ralton has shipped - web apps, mobile apps, homelab tooling and open source, with full write-ups.'

export const metadata: Metadata = {
  title: 'Projects',
  description,
  openGraph: {
    type: 'website',
    title: 'Projects | Ben Ralton',
    description,
    url: `${siteUrl}/projects`,
    siteName: 'Ben Ralton',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ben Ralton - Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Ben Ralton',
    description,
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/projects',
  },
}

export default async function ProjectsPage() {
  const payload = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    where: {
      isVisible: { equals: true },
    },
    sort: '_order', // Admin drag-and-drop order (orderable: true); unordered docs sort last
    limit: 1000,
    depth: 1, // Populate image relationship
  })

  const count = projects.docs.length

  return (
    <>
      <Navigation />
      <main id="main-content" className="pb-16">
        <section aria-labelledby="projects-heading" className="px-6 pb-4 pt-12 desk:pt-16">
          <div className="mx-auto max-w-[1120px]">
            <div className="mb-7 flex items-baseline gap-4">
              <h1
                id="projects-heading"
                className="whitespace-nowrap font-mono text-[13px] text-teal"
              >
                <span aria-hidden="true" className="text-text-tertiary">
                  ~/
                </span>
                projects
              </h1>
              <span aria-hidden="true" className="h-px flex-1 bg-border-soft" />
              <span className="whitespace-nowrap font-mono text-[11.5px] text-text-tertiary">
                {count} shipped · full write-ups on click
              </span>
            </div>

            {count === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center px-4">
                <p className="font-mono text-sm text-text-tertiary">
                  nothing here yet — check back soon
                </p>
              </div>
            ) : (
              <ul
                role="list"
                aria-label="All projects"
                className="grid grid-cols-1 gap-5 desk:grid-cols-2"
              >
                {projects.docs.map((project, index) => (
                  <li key={project.id}>
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      techStack={project.techStack || []}
                      links={project.links ?? []}
                      privacyPolicyHref={
                        project.privacyPolicy ? `/projects/${project.slug}/privacy` : null
                      }
                      image={project.image}
                      index={index}
                      headingLevel="h2"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
