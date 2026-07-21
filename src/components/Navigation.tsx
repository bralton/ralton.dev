'use client'

import Image from 'next/image'

/**
 * Navigation Links
 *
 * SECURITY: The /admin route is intentionally NOT included here.
 * The admin panel should only be accessed by typing /admin directly.
 * This is a security decision per NFR12 - admin credentials and
 * access points should not be publicly exposed (AC #1, Story 3.1).
 */
const navLinks = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Writing', href: '/#writing' },
]

export function Navigation() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.split('#')[1]
    if (!targetId) return

    // If not on homepage, allow normal navigation
    if (window.location.pathname !== '/') return

    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 72 // 56px header + buffer
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })

      window.history.pushState(null, '', href)
    }
  }

  return (
    <>
      {/* Skip to Content Link - only visible on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Skip to content
      </a>

      <header className="sticky left-0 right-0 top-0 z-50 border-b border-border-soft bg-background/85 backdrop-blur-md">
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-6"
        >
          {/* Logo + wordmark */}
          <a
            href="/"
            className="flex min-h-[44px] items-center gap-2.5 rounded font-mono text-sm font-semibold text-foreground transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <Image src="/icon.png" alt="" width={160} height={160} className="h-8 w-8" priority />
            <span>
              ben ralton<span className="text-teal">.dev</span>
            </span>
          </a>

          <ul role="list" className="flex items-center gap-1" aria-label="Site sections">
            {navLinks.map((link) => (
              <li key={link.href} className="hidden desk:block">
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-panel-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, '/#contact')}
                className="hover:bg-teal/10 ml-2 inline-flex min-h-[44px] items-center rounded-md border border-teal-deep px-3.5 font-mono text-xs text-teal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                get in touch →
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
