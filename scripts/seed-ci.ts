/**
 * CI Seed Script
 * Seeds comprehensive test data for E2E testing and Lighthouse accessibility audits
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

// Generate sample GitHub contribution data for the past 52 weeks
function generateGitHubContributionData() {
  const weeks = []
  const today = new Date()

  for (let w = 51; w >= 0; w--) {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - w * 7)

    const days = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + d)

      // Generate realistic contribution counts (more on weekdays)
      const isWeekend = d === 0 || d === 6
      const baseContributions = isWeekend ? 1 : 4
      const count = Math.floor(Math.random() * baseContributions * 3)

      days.push({
        date: date.toISOString().split('T')[0],
        count,
        level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4,
      })
    }
    weeks.push({ days })
  }
  return weeks
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
      tagline: 'Building modern web applications with React, TypeScript, and Node.js',
      ctaButtons: [
        { label: 'View Projects', url: '#projects', variant: 'primary' },
        { label: 'Contact Me', url: '#contact', variant: 'secondary' },
      ],
    },
  })
  console.log('[Seed] Hero seeded')

  // Seed About (global) with more highlights
  await payload.updateGlobal({
    slug: 'about',
    data: {
      bio: richText(
        'A passionate full-stack developer with over 8 years of experience building scalable web applications. I specialize in React, TypeScript, and Node.js, with a strong focus on clean architecture and developer experience. Currently exploring AI/ML integrations and edge computing.'
      ),
      highlights: [
        { text: '8+ Years Experience' },
        { text: 'Full Stack Development' },
        { text: 'React & Next.js Expert' },
        { text: 'TypeScript Advocate' },
        { text: 'Open Source Contributor' },
      ],
    },
  })
  console.log('[Seed] About seeded')

  // Seed GitHub Data (global) with sample contribution data
  const contributionData = generateGitHubContributionData()
  const totalContributions = contributionData.reduce(
    (sum, week) => sum + week.days.reduce((daySum, day) => daySum + day.count, 0),
    0
  )

  await payload.updateGlobal({
    slug: 'github-data',
    data: {
      username: 'benralton',
      totalContributions,
      contributionData,
      lastFetched: new Date().toISOString(),
    },
  })
  console.log('[Seed] GitHub Data seeded with contribution graph')

  // Seed Experiences (4 total - current + 2 past + 1 hidden)
  const experiences = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      startDate: '2023-03-01',
      endDate: null, // Current position
      description:
        'Leading frontend architecture for a SaaS platform serving 50k+ users. Implemented micro-frontend architecture, reducing build times by 60%. Mentoring junior developers and conducting technical interviews.',
      isVisible: true,
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      startDate: '2020-06-01',
      endDate: '2023-02-28',
      description:
        'Built and maintained multiple React applications with Node.js backends. Implemented CI/CD pipelines and automated testing, achieving 90% code coverage. Led migration from JavaScript to TypeScript.',
      isVisible: true,
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Agency Co.',
      startDate: '2018-01-15',
      endDate: '2020-05-31',
      description:
        'Developed responsive web applications for enterprise clients. Created reusable component libraries and design systems. Collaborated with UX designers to implement pixel-perfect interfaces.',
      isVisible: true,
    },
    {
      title: 'Junior Developer',
      company: 'WebDev Studio',
      startDate: '2016-06-01',
      endDate: '2017-12-31',
      description: 'Started career building WordPress sites and learning modern JavaScript frameworks.',
      isVisible: false, // Hidden - tests visibility toggle
    },
  ]

  for (const exp of experiences) {
    await payload.create({
      collection: 'experiences',
      data: {
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: richText(exp.description),
        isVisible: exp.isVisible,
      },
    })
  }
  console.log(`[Seed] ${experiences.length} Experiences seeded`)

  // Seed Education (2 entries)
  const educationEntries = [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science in Computer Science',
      startDate: '2012-09-01',
      endDate: '2016-05-31',
      isVisible: true,
    },
    {
      institution: 'AWS',
      degree: 'AWS Certified Solutions Architect',
      startDate: '2022-01-01',
      endDate: '2022-03-15',
      isVisible: true,
    },
  ]

  for (const edu of educationEntries) {
    await payload.create({
      collection: 'education',
      data: edu,
    })
  }
  console.log(`[Seed] ${educationEntries.length} Education entries seeded`)

  // Seed Projects (6 total - varied tech stacks, 1 hidden)
  const projects = [
    {
      title: 'E-Commerce Platform',
      description:
        'A full-featured e-commerce platform with real-time inventory management, Stripe payments, and admin dashboard. Handles 10k+ daily transactions.',
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Redis'],
      repoUrl: 'https://github.com/testuser/ecommerce-platform',
      liveUrl: 'https://shop.example.com',
      isVisible: true,
    },
    {
      title: 'Task Management App',
      description:
        'A collaborative task management application with real-time updates, drag-and-drop Kanban boards, and team workspaces.',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      repoUrl: 'https://github.com/testuser/task-manager',
      liveUrl: 'https://tasks.example.com',
      isVisible: true,
    },
    {
      title: 'Developer Portfolio',
      description:
        'This portfolio website built with Next.js and Payload CMS. Features a blog with syntax highlighting, RSS feed, and dark mode.',
      techStack: ['Next.js', 'Payload CMS', 'TypeScript', 'Tailwind CSS'],
      repoUrl: 'https://github.com/testuser/portfolio',
      liveUrl: 'https://example.com',
      isVisible: true,
    },
    {
      title: 'Weather Dashboard',
      description:
        'A weather dashboard with 7-day forecasts, interactive maps, and location-based alerts. Integrates with multiple weather APIs.',
      techStack: ['React', 'TypeScript', 'OpenWeather API', 'Mapbox'],
      repoUrl: 'https://github.com/testuser/weather-app',
      isVisible: true,
    },
    {
      title: 'CLI Tool for Developers',
      description:
        'A command-line tool that automates common development tasks like project scaffolding, code generation, and deployment.',
      techStack: ['Node.js', 'TypeScript', 'Commander.js'],
      repoUrl: 'https://github.com/testuser/dev-cli',
      isVisible: true,
    },
    {
      title: 'Legacy Project',
      description: 'An older project that is no longer maintained.',
      techStack: ['jQuery', 'PHP'],
      isVisible: false, // Hidden - tests visibility toggle
    },
  ]

  for (const project of projects) {
    await payload.create({
      collection: 'projects',
      data: {
        title: project.title,
        description: richText(project.description),
        techStack: project.techStack.map((tech) => ({ technology: tech })),
        repoUrl: project.repoUrl,
        liveUrl: project.liveUrl,
        isVisible: project.isVisible,
      },
    })
  }
  console.log(`[Seed] ${projects.length} Projects seeded`)

  // Seed Skills (12 across 3 categories)
  const skillsByCategory = {
    'Languages & Frameworks': ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Python'],
    'Tools & Platforms': ['Git', 'Docker', 'AWS', 'Vercel'],
    Databases: ['PostgreSQL', 'MongoDB', 'Redis'],
  }

  for (const [category, skillNames] of Object.entries(skillsByCategory)) {
    for (const name of skillNames) {
      await payload.create({
        collection: 'skills',
        data: {
          name,
          category,
          isVisible: true,
        },
      })
    }
  }
  console.log(
    `[Seed] ${Object.values(skillsByCategory).flat().length} Skills seeded across ${Object.keys(skillsByCategory).length} categories`
  )

  // Seed Social Links (4 platforms)
  const socialLinks: Array<{
    platform: 'github' | 'linkedin' | 'twitter' | 'email'
    url: string
    order: number
  }> = [
    { platform: 'github', url: 'https://github.com/benralton', order: 1 },
    { platform: 'linkedin', url: 'https://linkedin.com/in/benralton', order: 2 },
    { platform: 'twitter', url: 'https://twitter.com/benralton', order: 3 },
    { platform: 'email', url: 'mailto:ben@example.com', order: 4 },
  ]

  for (const link of socialLinks) {
    await payload.create({
      collection: 'social-links',
      data: {
        platform: link.platform,
        url: link.url,
        isVisible: true,
        order: link.order,
      },
    })
  }
  console.log(`[Seed] ${socialLinks.length} Social Links seeded`)

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
