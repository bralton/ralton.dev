import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PostCard } from './PostCard'

interface AuthorFooterCardProps {
  currentSlug: string
}

export async function AuthorFooterCard({ currentSlug }: AuthorFooterCardProps) {
  const payload = await getPayload({ config })
  const [hero, about, morePosts] = await Promise.all([
    payload.findGlobal({ slug: 'hero' }),
    payload.findGlobal({ slug: 'about' }),
    payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
        slug: { not_equals: currentSlug },
      },
      sort: '-publishedAt',
      limit: 3,
    }),
  ])

  const photo = about?.photo && typeof about.photo !== 'number' ? about.photo : null

  return (
    <div className="mt-12 space-y-10">
      {/* Author card */}
      <div className="flex items-center gap-4 rounded-panel border border-border bg-panel p-5">
        {photo?.url && (
          <Image
            src={photo.url}
            alt={photo.alt || `Photo of ${hero.name}`}
            width={96}
            height={96}
            className="h-12 w-12 shrink-0 rounded-full border-2 border-border object-cover"
          />
        )}
        <div className="min-w-0">
          <p className="font-mono text-[11.5px] text-text-tertiary">
            <span aria-hidden="true">$ </span>whoami
          </p>
          <p className="truncate text-sm text-text-secondary">
            <Link
              href="/"
              className="rounded font-semibold text-foreground hover:text-teal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-panel"
            >
              {hero.name}
            </Link>
            {hero.tagline ? ` — ${hero.tagline}` : ` — ${hero.headline}`}
          </p>
        </div>
      </div>

      {/* More posts - suppressed when none exist (FR-R15) */}
      {morePosts.docs.length > 0 && (
        <div>
          <h2 className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-text-tertiary">
            more posts
          </h2>
          <ul
            role="list"
            aria-label="More blog posts"
            className="grid grid-cols-1 gap-5 desk:grid-cols-3"
          >
            {morePosts.docs.map((post) => (
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
        </div>
      )}
    </div>
  )
}
