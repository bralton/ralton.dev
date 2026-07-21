import Link from 'next/link'

interface PostCardProps {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  /** Heading level for the title - h3 under a section h2 (default), h2 directly under a page h1 */
  headingLevel?: 'h2' | 'h3'
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function clampExcerpt(text: string): string {
  return text.length > 120 ? `${text.slice(0, 117)}…` : text
}

export function PostCard({
  title,
  slug,
  excerpt,
  publishedAt,
  headingLevel: Heading = 'h3',
}: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="flex h-full flex-col gap-2 rounded-panel border border-border bg-panel p-5 transition-colors hover:border-teal-deep focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background desk:px-6"
    >
      {publishedAt && (
        <time dateTime={publishedAt} className="font-mono text-[11.5px] text-text-tertiary">
          {formatDate(publishedAt)}
        </time>
      )}
      <Heading className="text-[15px] font-semibold leading-snug text-foreground">{title}</Heading>
      {excerpt && <p className="text-[13px] text-text-secondary">{clampExcerpt(excerpt)}</p>}
      <span aria-hidden="true" className="mt-auto pt-2 font-mono text-[11.5px] text-teal">
        read →
      </span>
    </Link>
  )
}
