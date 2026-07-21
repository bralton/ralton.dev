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
      className="border-t border-border-soft bg-background px-6 py-6"
    >
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-4 desk:flex-row desk:justify-between">
        <p className="font-mono text-xs text-text-tertiary">
          © {currentYear} ben ralton — built with next + payload ·{' '}
          <Link
            href="/privacy"
            className="rounded hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            privacy
          </Link>
        </p>

        <div className="flex items-center gap-6">
          <SocialLinks />
          <span className="font-mono text-xs text-text-tertiary">uptime: excellent</span>
        </div>
      </div>
    </footer>
  )
}
