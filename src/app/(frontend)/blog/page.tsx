import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Rss } from 'lucide-react'
import { PostCard } from '@/components/PostCard'
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
      <div className="flex min-h-[300px] items-center justify-center px-4">
        <p className="font-mono text-sm text-text-tertiary">no posts yet — check back soon</p>
      </div>
    )
  }

  // Invalid page number - show empty state
  if (posts.docs.length === 0 && currentPage > 1) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-mono text-sm text-text-tertiary">this page doesn&apos;t exist</p>
        <Link
          href="/blog"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          Back to all posts
        </Link>
      </div>
    )
  }

  return (
    <>
      <ul role="list" aria-label="Blog posts" className="grid grid-cols-1 gap-5 desk:grid-cols-2">
        {posts.docs.map((post) => (
          <li key={post.id} className="h-full">
            <PostCard
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              publishedAt={post.publishedAt}
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
      <main id="main-content" className="pb-16">
        <section aria-labelledby="blog-heading" className="px-6 pb-4 pt-12 desk:pt-16">
          <div className="mx-auto max-w-[1120px]">
            <div className="mb-7 flex items-baseline gap-4">
              <h1 id="blog-heading" className="whitespace-nowrap font-mono text-[13px] text-teal">
                <span aria-hidden="true" className="text-text-tertiary">
                  ~/
                </span>
                writing
              </h1>
              <span aria-hidden="true" className="h-px flex-1 bg-border-soft" />
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- RSS feed is a route handler, not a page */}
              <a
                href="/api/rss"
                className="flex items-center gap-1.5 rounded font-mono text-[11.5px] text-text-tertiary transition-colors hover:text-teal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                title="Subscribe via RSS"
              >
                <Rss className="h-4 w-4" aria-hidden="true" />
                rss
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
