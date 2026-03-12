/**
 * Tag Filter Page
 *
 * Displays blog posts filtered by a specific tag.
 * Statically generated at build time for all tags.
 *
 * Features:
 * - Filter posts by tag relationship
 * - Pagination with URL query params
 * - SEO-optimized with dynamic metadata
 * - Empty state for tags with no posts
 */

import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FileText } from 'lucide-react'
import { BlogPostCard } from '@/components/BlogPostCard'
import { Pagination } from '@/components/Pagination'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import type { Tag } from '@/payload-types'

const POSTS_PER_PAGE = 10

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

interface TagPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

/**
 * Fetches a tag by slug.
 */
async function getTag(slug: string): Promise<Tag | null> {
  const payload = await getPayload({ config })

  const tags = await payload.find({
    collection: 'tags',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  return tags.docs[0] || null
}

/**
 * Generate static paths for all tags.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const payload = await getPayload({ config })

  const tags = await payload.find({
    collection: 'tags',
    limit: 1000,
    select: {
      slug: true,
    },
  })

  return tags.docs.map((tag) => ({
    slug: tag.slug,
  }))
}

/**
 * Generate SEO metadata for the tag page.
 */
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTag(slug)

  if (!tag) {
    return {
      title: 'Tag Not Found',
    }
  }

  const description = `Articles tagged with #${tag.name} by Ben Ralton.`

  return {
    title: `#${tag.name} | Blog`,
    description,
    openGraph: {
      type: 'website',
      title: `#${tag.name} | Blog | Ben Ralton`,
      description,
      url: `${siteUrl}/blog/tag/${slug}`,
      siteName: 'Ben Ralton',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `#${tag.name} - Ben Ralton's Blog`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `#${tag.name} | Blog | Ben Ralton`,
      description,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `/blog/tag/${slug}`,
    },
  }
}

async function TagContent({ params, searchParams }: TagPageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10))

  const tag = await getTag(slug)

  if (!tag) {
    notFound()
  }

  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      tags: { contains: tag.id },
    },
    sort: '-publishedAt',
    limit: POSTS_PER_PAGE,
    page: currentPage,
    depth: 1, // Populate categories and featuredImage
  })

  const totalPages = posts.totalPages
  const basePath = `/blog/tag/${slug}`

  // Empty state when no posts
  if (posts.docs.length === 0 && currentPage === 1) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        <FileText className="mb-4 h-16 w-16 text-zinc-600" aria-hidden="true" />
        <h2 className="mb-2 text-xl font-semibold text-foreground">No Posts Found</h2>
        <p className="mb-4 max-w-md text-text-secondary">
          No posts have been published with this tag yet.
        </p>
        <Link
          href="/blog"
          className="rounded-md bg-teal-700 px-4 py-2 text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
        >
          View All Posts
        </Link>
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
          href={basePath}
          className="rounded-md bg-teal-700 px-4 py-2 text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
        >
          Back to #{tag.name}
        </Link>
      </div>
    )
  }

  return (
    <>
      <ul role="list" aria-label="Blog posts" className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.docs.map((post, index) => (
          <li key={post.id}>
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
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
      )}
    </>
  )
}

export default async function TagPage(props: TagPageProps) {
  const { slug } = await props.params
  const tag = await getTag(slug)

  if (!tag) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-24">
        <section aria-labelledby="tag-heading" className="px-4 py-16 md:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-8">
              <h1
                id="tag-heading"
                className="mb-4 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
              >
                Posts tagged: #{tag.name}
              </h1>
              <Link
                href="/blog"
                className="text-teal-400 transition-colors hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
              >
                View all posts
              </Link>
            </div>

            <Suspense
              fallback={
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-text-secondary">Loading posts...</div>
                </div>
              }
            >
              <TagContent params={props.params} searchParams={props.searchParams} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
