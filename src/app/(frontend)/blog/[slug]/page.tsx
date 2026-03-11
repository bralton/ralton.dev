/**
 * Blog Post Page
 *
 * Displays individual blog post with full content, syntax highlighting,
 * and SEO metadata. Statically generated at build time.
 *
 * Features:
 * - Full post content with Shiki syntax highlighting (build-time)
 * - Featured image with 16:9 aspect ratio
 * - Categories and tags as linked badges
 * - Draft preview mode support
 * - SEO-optimized with OpenGraph article metadata
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Calendar, Clock, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { RichText } from '@/lib/lexicalSerializer'
import type { Post, Category, Tag as TagType, Media } from '@/payload-types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

/**
 * Formats a date string to "MMM DD, YYYY" format (e.g., "Mar 11, 2026")
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Fetches a single post by slug.
 * Respects draft mode for preview functionality.
 */
async function getPost(slug: string, isDraftMode: boolean): Promise<Post | null> {
  const payload = await getPayload({ config })

  if (isDraftMode) {
    const posts = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      depth: 2, // Populate categories, tags, featuredImage
      limit: 1,
    })
    return posts.docs[0] || null
  }

  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2, // Populate categories, tags, featuredImage
    limit: 1,
  })

  return posts.docs[0] || null
}

/**
 * Generate static paths for all published posts.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    limit: 1000,
    select: {
      slug: true,
    },
  })

  return posts.docs.map((post) => ({
    slug: post.slug,
  }))
}

/**
 * Generate SEO metadata for the blog post.
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const post = await getPost(slug, isDraftMode)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  // Get featured image URL (must be absolute for OpenGraph)
  const featuredImage =
    post.featuredImage && typeof post.featuredImage !== 'number' ? post.featuredImage : null
  const ogImage = featuredImage?.url
    ? (featuredImage.url.startsWith('http') ? featuredImage.url : `${siteUrl}${featuredImage.url}`)
    : `${siteUrl}/og-image.png`

  // Get tag names for article metadata
  const tags =
    post.tags
      ?.filter((tag): tag is TagType => typeof tag !== 'number')
      .map((tag) => tag.name) || []

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on Ben Ralton's blog.`,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Ben Ralton's blog.`,
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: 'Ben Ralton',
      publishedTime: post.publishedAt || undefined,
      authors: ['Ben Ralton'],
      tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Ben Ralton's blog.`,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const post = await getPost(slug, isDraftMode)

  if (!post) {
    notFound()
  }

  // Type-guard for featured image
  const featuredImage: Media | null =
    post.featuredImage && typeof post.featuredImage !== 'number' ? post.featuredImage : null

  // Filter and type-guard categories
  const categories =
    post.categories?.filter((cat): cat is Category => typeof cat !== 'number' && cat !== null) ||
    []

  // Filter and type-guard tags
  const tags =
    post.tags?.filter((tag): tag is TagType => typeof tag !== 'number' && tag !== null) || []

  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-24">
        {/* Draft mode indicator */}
        {isDraftMode && (
          <div className="bg-amber-600 px-4 py-2 text-center text-sm font-medium text-white">
            <Eye className="mr-1.5 inline-block h-4 w-4" aria-hidden="true" />
            Draft Preview Mode - This content is not published
          </div>
        )}

        <article className="px-4 py-16 md:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-[800px]">
            {/* Post header */}
            <header className="mb-8">
              {/* Categories */}
              {categories.length > 0 && (
                <ul role="list" aria-label="Post categories" className="mb-4 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/blog/category/${category.slug}`}
                        className="rounded focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
                      >
                        <Badge
                          variant="outline"
                          className="border-teal-700/50 bg-teal-900/30 text-teal-400 transition-colors hover:border-teal-700 hover:bg-teal-900/50"
                        >
                          {category.name}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {/* Date and Reading Time */}
              <div className="flex flex-wrap items-center gap-4 text-text-secondary">
                {post.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </span>
                )}
                {post.readingTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>{post.readingTime} min read</span>
                  </span>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {featuredImage?.url && (
              <figure className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={featuredImage.url}
                  alt={featuredImage.alt || `Featured image for ${post.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 800px) 100vw, 800px"
                  priority
                />
              </figure>
            )}

            {/* Post Content */}
            <RichText content={post.content} />

            {/* Tags */}
            {tags.length > 0 && (
              <footer className="mt-12 border-t border-zinc-800 pt-8">
                <h2 className="mb-4 text-sm font-medium text-text-secondary">Tags</h2>
                <ul role="list" aria-label="Post tags" className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <Link
                        href={`/blog/tag/${tag.slug}`}
                        className="rounded focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
                      >
                        <Badge
                          variant="outline"
                          className="border-zinc-700 bg-zinc-800/50 text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-700/50"
                        >
                          #{tag.name}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </footer>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
