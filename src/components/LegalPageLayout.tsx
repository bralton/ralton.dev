import type { ReactNode } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

interface LegalPageLayoutProps {
  title: string
  /** Optional line shown under the title, e.g. the project the policy applies to. */
  subtitle?: ReactNode
  /** Pre-formatted "last updated" string. Omitted when undefined. */
  lastUpdated?: string
  children: ReactNode
}

/**
 * Shared shell for long-form legal pages (site privacy policy, per-project
 * privacy policies). Provides navigation, footer, and a readable article column.
 */
export function LegalPageLayout({ title, subtitle, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-24">
        <article className="mx-auto max-w-[800px] px-4 py-16 md:px-6 lg:px-8">
          <header className="mb-12">
            <h1 className="text-text-primary text-4xl font-bold md:text-5xl">{title}</h1>
            {subtitle && <p className="mt-4 text-text-secondary">{subtitle}</p>}
            {lastUpdated && (
              <p className="text-text-muted mt-4 text-sm">Last updated: {lastUpdated}</p>
            )}
          </header>
          {children}
        </article>
      </main>
      <Footer />
    </>
  )
}
