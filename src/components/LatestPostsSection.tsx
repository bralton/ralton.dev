import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Section } from './Section'
import { PostCard } from './PostCard'

export async function LatestPostsSection() {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 3,
  })

  if (posts.docs.length === 0) {
    return null // Hide section entirely if no published posts (FR-R15)
  }

  return (
    <Section
      id="writing"
      label="writing"
      meta={
        <Link
          href="/blog"
          className="rounded text-teal hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          all posts →
        </Link>
      }
    >
      <ul
        role="list"
        aria-label="Latest blog posts"
        className="grid grid-cols-1 gap-5 desk:grid-cols-3"
      >
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
    </Section>
  )
}
