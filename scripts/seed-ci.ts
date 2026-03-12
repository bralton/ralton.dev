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

  // Seed Blog Posts (12 posts to test pagination - page size is 10)
  const blogPosts = [
    {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      excerpt: 'Learn the basics of Next.js and start building modern web applications.',
      content: 'Next.js is a powerful React framework that makes building web applications easier. In this post, we will explore the basics of Next.js and how to get started with your first project.',
      categories: [techCategory.id, tutorialCategory.id],
      tags: [reactTag.id, nextjsTag.id, typescriptTag.id],
    },
    {
      title: 'Understanding TypeScript Generics',
      slug: 'understanding-typescript-generics',
      excerpt: 'A deep dive into TypeScript generics and how to use them effectively.',
      content: 'TypeScript generics provide a way to create reusable components that work with multiple types. This post explores how to leverage generics in your codebase.',
      categories: [techCategory.id],
      tags: [typescriptTag.id],
    },
    {
      title: 'React Server Components Explained',
      slug: 'react-server-components-explained',
      excerpt: 'Understanding the new React Server Components paradigm.',
      content: 'React Server Components represent a fundamental shift in how we build React applications. Learn about the benefits and trade-offs.',
      categories: [techCategory.id],
      tags: [reactTag.id, nextjsTag.id],
    },
    {
      title: 'Building APIs with Next.js Route Handlers',
      slug: 'building-apis-nextjs-route-handlers',
      excerpt: 'Create robust APIs using Next.js App Router route handlers.',
      content: 'Next.js route handlers provide a simple way to build API endpoints. This tutorial walks through creating a complete API.',
      categories: [tutorialCategory.id],
      tags: [nextjsTag.id, typescriptTag.id],
    },
    {
      title: 'State Management in React 2024',
      slug: 'state-management-react-2024',
      excerpt: 'An overview of state management options in modern React applications.',
      content: 'From useState to Zustand, this post compares different state management approaches and when to use each.',
      categories: [techCategory.id],
      tags: [reactTag.id],
    },
    {
      title: 'CSS-in-JS vs Tailwind CSS',
      slug: 'css-in-js-vs-tailwind',
      excerpt: 'Comparing styling approaches for React applications.',
      content: 'Both CSS-in-JS and Tailwind CSS have their merits. This post helps you choose the right approach for your project.',
      categories: [techCategory.id],
      tags: [reactTag.id],
    },
    {
      title: 'Testing Next.js Applications with Playwright',
      slug: 'testing-nextjs-playwright',
      excerpt: 'End-to-end testing strategies for Next.js apps.',
      content: 'Playwright provides powerful E2E testing capabilities. Learn how to set up and write effective tests for your Next.js application.',
      categories: [tutorialCategory.id],
      tags: [nextjsTag.id, typescriptTag.id],
    },
    {
      title: 'Optimizing React Performance',
      slug: 'optimizing-react-performance',
      excerpt: 'Techniques for improving React application performance.',
      content: 'From memoization to code splitting, explore various techniques to make your React apps faster.',
      categories: [techCategory.id],
      tags: [reactTag.id],
    },
    {
      title: 'Introduction to Payload CMS',
      slug: 'introduction-to-payload-cms',
      excerpt: 'Getting started with Payload CMS for your next project.',
      content: 'Payload CMS is a powerful headless CMS built with TypeScript. This introduction covers the basics.',
      categories: [tutorialCategory.id],
      tags: [typescriptTag.id, nextjsTag.id],
    },
    {
      title: 'Database Design for Web Applications',
      slug: 'database-design-web-applications',
      excerpt: 'Best practices for designing databases in web apps.',
      content: 'Good database design is crucial for application success. Learn about normalization, indexing, and more.',
      categories: [techCategory.id],
      tags: [typescriptTag.id],
    },
    {
      title: 'Authentication Patterns in Next.js',
      slug: 'authentication-patterns-nextjs',
      excerpt: 'Implementing secure authentication in Next.js applications.',
      content: 'From JWT to session-based auth, explore different authentication patterns and their implementation in Next.js.',
      categories: [tutorialCategory.id],
      tags: [nextjsTag.id, typescriptTag.id],
    },
    {
      title: 'Deploying Next.js to Vercel',
      slug: 'deploying-nextjs-vercel',
      excerpt: 'A complete guide to deploying your Next.js app on Vercel.',
      content: 'Vercel provides the best deployment experience for Next.js. This guide covers everything from setup to production.',
      categories: [tutorialCategory.id],
      tags: [nextjsTag.id],
    },
  ]

  // Create posts with staggered publish dates for proper ordering
  const baseDate = new Date()
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i]
    const publishDate = new Date(baseDate)
    publishDate.setDate(publishDate.getDate() - i) // Each post 1 day older

    await payload.create({
      collection: 'posts',
      data: {
        title: post.title,
        slug: post.slug,
        content: richText(post.content),
        excerpt: post.excerpt,
        status: 'published',
        publishedAt: publishDate.toISOString(),
        categories: post.categories,
        tags: post.tags,
      },
    })
  }
  console.log(`[Seed] ${blogPosts.length} Blog Posts seeded`)

  console.log('[Seed] CI data seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('[Seed] Error:', err)
  process.exit(1)
})
