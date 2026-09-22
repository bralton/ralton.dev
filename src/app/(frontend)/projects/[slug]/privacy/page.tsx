/**
 * Project Privacy Policy Page
 *
 * Renders the CMS-authored privacy policy for a single project at
 * /projects/[slug]/privacy. Intended for mobile apps that need a public
 * privacy policy URL for the App Store / Google Play listings.
 *
 * Returns 404 when the project is hidden or has no privacy policy.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { LegalPageLayout } from '@/components/LegalPageLayout'
import { RichText } from '@/lib/lexicalSerializer'
import { parseProjectStatus } from '@/lib/projectStatus'
import type { Project } from '@/payload-types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

interface ProjectPrivacyPageProps {
  params: Promise<{ slug: string }>
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Strip the "(archived)"-style status suffix used in project titles. */
function displayTitle(title: string): string {
  return parseProjectStatus(title).displayTitle
}

async function getProjectWithPolicy(slug: string): Promise<Project | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'projects',
    where: {
      slug: { equals: slug },
      isVisible: { equals: true },
      privacyPolicy: { exists: true },
    },
    depth: 0,
    limit: 1,
  })
  return result.docs[0] || null
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const payload = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    where: {
      isVisible: { equals: true },
      privacyPolicy: { exists: true },
    },
    limit: 1000,
    select: { slug: true },
  })
  return projects.docs.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPrivacyPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectWithPolicy(slug)

  if (!project) {
    return { title: 'Privacy Policy Not Found' }
  }

  const name = displayTitle(project.title)
  const title = `${name} Privacy Policy`
  const description = `Privacy policy for ${name} - what data is collected, how it is used, and how it is protected.`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/projects/${project.slug}/privacy`,
    },
    openGraph: {
      type: 'article',
      title: `${title} | Ben Ralton`,
      description,
      url: `${siteUrl}/projects/${project.slug}/privacy`,
      siteName: 'Ben Ralton',
    },
  }
}

export default async function ProjectPrivacyPage({ params }: ProjectPrivacyPageProps) {
  const { slug } = await params
  const project = await getProjectWithPolicy(slug)

  if (!project || !project.privacyPolicy) {
    notFound()
  }

  const name = displayTitle(project.title)

  return (
    <LegalPageLayout
      title={`${name} Privacy Policy`}
      subtitle={
        <>
          This policy applies to the{' '}
          <Link
            href="/#projects"
            className="rounded text-teal underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
          >
            {name}
          </Link>{' '}
          app.
        </>
      }
      lastUpdated={
        project.privacyPolicyUpdatedAt ? formatDate(project.privacyPolicyUpdatedAt) : undefined
      }
    >
      <RichText content={project.privacyPolicy} />
    </LegalPageLayout>
  )
}
