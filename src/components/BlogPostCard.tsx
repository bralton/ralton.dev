import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import type { Category, Media } from '@/payload-types'

interface BlogPostCardProps {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  readingTime?: number | null
  categories?: (number | Category)[] | null
  featuredImage?: (number | null) | Media
  /** Set to true for the first post in a listing to optimize LCP */
  priority?: boolean
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

export function BlogPostCard({
  title,
  slug,
  excerpt,
  publishedAt,
  readingTime,
  categories,
  featuredImage,
  priority = false,
}: BlogPostCardProps) {
  // Filter and type-guard categories to only include populated Category objects
  const populatedCategories = categories?.filter(
    (cat): cat is Category => typeof cat !== 'number' && cat !== null
  )

  // Type-guard for featured image
  const image = featuredImage && typeof featuredImage !== 'number' ? featuredImage : null

  return (
    <article>
      <Link
        href={`/blog/${slug}`}
        className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
      >
        <Card className="h-full overflow-hidden border-zinc-800 bg-zinc-900 transition-colors hover:border-teal-700">
          {image?.url && (
            <div className="relative aspect-video w-full">
              <Image
                src={image.url}
                alt={image.alt || `Featured image for ${title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                priority={priority}
              />
            </div>
          )}

          <CardHeader className="pb-2">
            <h2 className="line-clamp-2 text-xl font-semibold text-foreground">{title}</h2>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Date and Reading Time */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              {publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                </span>
              )}
              {readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{readingTime} min read</span>
                </span>
              )}
            </div>

            {/* Excerpt */}
            {excerpt && <p className="line-clamp-3 text-text-secondary">{excerpt}</p>}

            {/* Categories */}
            {populatedCategories && populatedCategories.length > 0 && (
              <ul role="list" aria-label="Post categories" className="flex flex-wrap gap-2">
                {populatedCategories.map((category) => (
                  <li key={category.id}>
                    <Badge
                      variant="outline"
                      className="border-teal-700/50 bg-teal-900/30 text-teal-400"
                    >
                      {category.name}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Link>
    </article>
  )
}
