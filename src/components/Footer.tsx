import Link from 'next/link'
import { SocialLinks } from './SocialLinks'

/**
 * Site Footer Component
 *
 * SECURITY: The /admin route is intentionally NOT linked here.
 * Admin access should be direct URL only, not publicly discoverable.
 * This is a security decision per NFR12 (Story 3.1, AC #1).
 */
export async function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      id="footer"
      aria-label="Site footer"
      className="border-t border-zinc-800 bg-background px-4 py-8 md:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <p className="text-sm text-text-secondary">
            &copy; {currentYear} B.RALTON · Development &amp; Operations
            <span className="mx-2 hidden md:inline">|</span>
          </p>
          <Link
            href="/privacy"
            className="rounded hover:text-text-primary text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
          >
            Privacy Policy
          </Link>
        </div>

        <SocialLinks />
      </div>
    </footer>
  )
}
