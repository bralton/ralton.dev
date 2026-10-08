'use client'

import { usePathname } from 'next/navigation'

/**
 * Echoes the path the visitor actually asked for, so the 404 page reads like
 * the request that produced it. Renders a bare "/" when there is no pathname
 * (e.g. during a static prerender).
 */
export function RequestedPath({ className }: { className?: string }) {
  const pathname = usePathname() || '/'
  return <span className={className}>{pathname}</span>
}
