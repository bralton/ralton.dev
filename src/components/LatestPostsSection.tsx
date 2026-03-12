import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BlogPostCard } from './BlogPostCard'
import { ArrowRight } from 'lucide-react'

export async function LatestPostsSection() {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 1, // Populate categories and featuredImage
  })

  if (posts.docs.length === 0) {
    return null // Hide section entirely if no published posts
  }

  return (
    <section
      id="latest-posts"
      aria-labelledby="latest-posts-heading"
      className="px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex items-center justify-between">
          <h2
            id="latest-posts-heading"
            className="text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
          >
            Latest Posts
          </h2>
          <Link
            href="/blog"
            className="group flex items-center gap-1 rounded text-sm font-medium text-teal-400 transition-colors hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
          >
            View all posts
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul role="list" aria-label="Latest blog posts" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </section>
  )
}
