import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FileText, Rss } from 'lucide-react'
import { BlogPostCard } from '@/components/BlogPostCard'
import { Pagination } from '@/components/Pagination'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const POSTS_PER_PAGE = 10

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technical articles and insights on software development, DevOps, and cloud infrastructure by Ben Ralton.',
  openGraph: {
    type: 'website',
    title: 'Blog | Ben Ralton',
    description:
      'Technical articles and insights on software development, DevOps, and cloud infrastructure by Ben Ralton.',
    url: `${siteUrl}/blog`,
    siteName: 'Ben Ralton',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ben Ralton - Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Ben Ralton',
    description: 'Technical articles and insights by Ben Ralton.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': '/api/rss',
    },
  },
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

async function BlogContent({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10))

  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: POSTS_PER_PAGE,
    page: currentPage,
    depth: 1, // Populate categories and featuredImage
  })

  const totalPages = posts.totalPages

  // Empty state when no posts
  if (posts.docs.length === 0 && currentPage === 1) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        <FileText className="mb-4 h-16 w-16 text-zinc-600" aria-hidden="true" />
        <h2 className="mb-2 text-xl font-semibold text-foreground">No Posts Yet</h2>
        <p className="max-w-md text-text-secondary">
          I&apos;m working on some articles. Check back soon for technical insights and development
          stories.
        </p>
      </div>
    )
  }

  // Invalid page number - show empty state
  if (posts.docs.length === 0 && currentPage > 1) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mb-4 text-text-secondary">This page doesn&apos;t exist.</p>
        <Link
          href="/blog"
          className="rounded-md bg-teal-700 px-4 py-2 text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
        >
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <>
      <ul role="list" aria-label="Blog posts" className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.docs.map((post, index) => (
          <li key={post.id} className="h-full">
            <BlogPostCard
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              publishedAt={post.publishedAt}
              readingTime={post.readingTime}
              categories={post.categories}
              featuredImage={post.featuredImage}
              priority={index === 0}
            />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
      )}
    </>
  )
}

export default async function BlogPage(props: BlogPageProps) {
  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-24">
        <section aria-labelledby="blog-heading" className="px-4 py-16 md:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-8 flex items-center justify-between">
              <h1
                id="blog-heading"
                className="text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
              >
                Blog
              </h1>
              <a
                href="/api/rss"
                className="flex items-center gap-1.5 rounded text-text-secondary transition-colors hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
                title="Subscribe via RSS"
              >
                <Rss className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Subscribe via RSS</span>
              </a>
            </div>

            <Suspense
              fallback={
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-text-secondary">Loading posts...</div>
                </div>
              }
            >
              <BlogContent searchParams={props.searchParams} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
