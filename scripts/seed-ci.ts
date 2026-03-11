/**
 * CI Seed Script
 * Seeds minimal test data for Lighthouse accessibility testing
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Helper to create Lexical rich text format
function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text,
              format: 0,
              style: '',
              detail: 0,
              mode: 'normal',
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('[Seed] Starting CI data seed...')

  // Seed Hero (global)
  await payload.updateGlobal({
    slug: 'hero',
    data: {
      name: 'Ben Ralton',
      headline: 'Full Stack Developer',
      tagline: 'Building modern web applications',
      ctaButtons: [
        { label: 'View Projects', url: '#projects', variant: 'primary' },
        { label: 'Contact Me', url: '#contact', variant: 'secondary' },
      ],
    },
  })
  console.log('[Seed] Hero seeded')

  // Seed About (global)
  await payload.updateGlobal({
    slug: 'about',
    data: {
      bio: richText('A passionate developer with experience in modern web technologies.'),
      highlights: [
        { text: 'Full Stack Development' },
        { text: 'React & Next.js' },
        { text: 'TypeScript' },
      ],
    },
  })
  console.log('[Seed] About seeded')

  // Seed GitHub Data (global)
  await payload.updateGlobal({
    slug: 'github-data',
    data: {
      username: 'testuser',
      totalContributions: 500,
      contributionData: [],
      lastFetched: new Date().toISOString(),
    },
  })
  console.log('[Seed] GitHub Data seeded')

  // Seed an Experience
  await payload.create({
    collection: 'experiences',
    data: {
      title: 'Senior Developer',
      company: 'Tech Company',
      startDate: '2022-01-01',
      description: richText('Led development of web applications.'),
      isVisible: true,
    },
  })
  console.log('[Seed] Experience seeded')

  // Seed Education
  await payload.create({
    collection: 'education',
    data: {
      institution: 'University',
      degree: 'Computer Science',
      startDate: '2018-01-01',
      endDate: '2022-01-01',
      isVisible: true,
    },
  })
  console.log('[Seed] Education seeded')

  // Seed a Project
  await payload.create({
    collection: 'projects',
    data: {
      title: 'Portfolio Website',
      description: richText('A modern portfolio built with Next.js and Payload CMS.'),
      techStack: [{ technology: 'Next.js' }, { technology: 'TypeScript' }],
      isVisible: true,
    },
  })
  console.log('[Seed] Project seeded')

  // Seed Skills
  const skills = ['TypeScript', 'React', 'Node.js', 'PostgreSQL']
  for (const name of skills) {
    await payload.create({
      collection: 'skills',
      data: {
        name,
        category: 'Technical',
        isVisible: true,
      },
    })
  }
  console.log('[Seed] Skills seeded')

  // Seed Social Links
  await payload.create({
    collection: 'social-links',
    data: {
      platform: 'github',
      url: 'https://github.com/testuser',
      isVisible: true,
      order: 1,
    },
  })
  await payload.create({
    collection: 'social-links',
    data: {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/testuser',
      isVisible: true,
      order: 2,
    },
  })
  console.log('[Seed] Social Links seeded')

  // Seed Categories
  const techCategory = await payload.create({
    collection: 'categories',
    data: {
      name: 'Technology',
      slug: 'technology',
      description: 'Posts about technology and software development',
    },
  })
  const tutorialCategory = await payload.create({
    collection: 'categories',
    data: {
      name: 'Tutorials',
      slug: 'tutorials',
      description: 'Step-by-step guides and how-tos',
    },
  })
  console.log('[Seed] Categories seeded')

  // Seed Tags
  const reactTag = await payload.create({
    collection: 'tags',
    data: {
      name: 'React',
      slug: 'react',
    },
  })
  const nextjsTag = await payload.create({
    collection: 'tags',
    data: {
      name: 'Next.js',
      slug: 'nextjs',
    },
  })
  const typescriptTag = await payload.create({
    collection: 'tags',
    data: {
      name: 'TypeScript',
      slug: 'typescript',
    },
  })
  console.log('[Seed] Tags seeded')

  // Seed a Blog Post
  await payload.create({
    collection: 'posts',
    data: {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: richText(
        'Next.js is a powerful React framework that makes building web applications easier. In this post, we will explore the basics of Next.js and how to get started with your first project.'
      ),
      excerpt: 'Learn the basics of Next.js and start building modern web applications.',
      status: 'published',
      publishedAt: new Date().toISOString(),
      categories: [techCategory.id, tutorialCategory.id],
      tags: [reactTag.id, nextjsTag.id, typescriptTag.id],
    },
  })
  console.log('[Seed] Blog Post seeded')

  console.log('[Seed] CI data seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('[Seed] Error:', err)
  process.exit(1)
})
