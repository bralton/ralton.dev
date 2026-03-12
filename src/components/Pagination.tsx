import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

/**
 * Reusable pagination component for navigating between pages.
 *
 * Features:
 * - Previous/Next navigation buttons
 * - Current page / total pages indicator
 * - Accessible with proper aria labels
 * - URL-based navigation using query params
 */
export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  // Build pagination URLs
  const previousUrl = currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`
  const nextUrl = `${basePath}?page=${currentPage + 1}`

  return (
    <nav aria-label="Blog pagination" className="mt-12 flex items-center justify-center gap-4">
      {/* Previous Page Button */}
      {hasPreviousPage ? (
        <Link
          href={previousUrl}
          className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-foreground transition-colors hover:border-teal-700 hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span>Previous</span>
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="flex cursor-not-allowed items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-600"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span>Previous</span>
        </button>
      )}

      {/* Page Indicator */}
      <span className="text-sm text-text-secondary" aria-current="page">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Page Button */}
      {hasNextPage ? (
        <Link
          href={nextUrl}
          className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-foreground transition-colors hover:border-teal-700 hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Go to next page"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="flex cursor-not-allowed items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-600"
          aria-label="Go to next page"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </nav>
  )
}
