import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center px-4 text-center">
      {/* ASCII Art - visible but decorative */}
      <pre className="mb-8 font-mono text-2xl text-muted-foreground sm:text-3xl" aria-hidden="true">
        {`  ___  ___  ___
 /   \\/   \\/   \\
| 4  || 0 || 4  |
 \\___/\\___/\\___/`}
      </pre>

      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Page Not Found</h1>

      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
      >
        Back to Home
      </Link>
    </main>
  )
}
