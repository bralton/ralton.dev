/**
 * CI Seed Script
 * Seeds minimal test data for Lighthouse accessibility testing
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

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
      bio: [
        {
          type: 'paragraph',
          children: [{ text: 'A passionate developer with experience in modern web technologies.' }],
        },
      ],
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
      description: [
        {
          type: 'paragraph',
          children: [{ text: 'Led development of web applications.' }],
        },
      ],
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
      description: [
        {
          type: 'paragraph',
          children: [{ text: 'A modern portfolio built with Next.js and Payload CMS.' }],
        },
      ],
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

  console.log('[Seed] CI data seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('[Seed] Error:', err)
  process.exit(1)
})
