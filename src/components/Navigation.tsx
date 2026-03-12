'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

/**
 * Navigation Links
 *
 * SECURITY: The /admin route is intentionally NOT included here.
 * The admin panel should only be accessed by typing /admin directly.
 * This is a security decision per NFR12 - admin credentials and
 * access points should not be publicly exposed (AC #1, Story 3.1).
 */
const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'GitHub', href: '/#github' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Education', href: '/#education' },
  { label: 'Contact', href: '/#contact' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Extract the hash from href (e.g., '/#about' -> 'about')
    const targetId = href.split('#')[1]
    if (!targetId) return

    // Check if we're on the homepage
    const isHomePage = window.location.pathname === '/'

    // If not on homepage, allow normal navigation
    if (!isHomePage) {
      setIsMobileMenuOpen(false)
      return
    }

    // On homepage, do smooth scroll
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 112 // Adjust based on header height (96px + buffer)
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })

      // Update URL hash without page reload
      window.history.pushState(null, '', href)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Skip to Content Link - only visible on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-md focus-visible:bg-teal-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
      >
        Skip to content
      </a>

      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 motion-reduce:transition-none ${
          isScrolled
            ? 'border-b border-zinc-800 bg-background/80 shadow-lg backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="mx-auto flex h-24 max-w-[1200px] items-center justify-between px-4 md:px-6 lg:px-8"
        >
          {/* Logo */}
          <a
            href="/"
            className="block rounded-lg transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
          >
            <Image
              src="/icon.svg"
              alt="B.Ralton - Home"
              width={80}
              height={80}
              className="h-20 w-20"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-sm px-1 text-sm text-text-secondary transition-colors hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-background"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-menu"
                className="focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-zinc-800 bg-background"
              id="mobile-nav-menu"
              aria-describedby="mobile-nav-description"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <span id="mobile-nav-description" className="sr-only">
                Navigate to different sections of the website
              </span>
              <nav className="mt-8" aria-label="Mobile navigation">
                <ul className="space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="block rounded-sm px-2 py-2 text-lg text-foreground transition-colors hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
    </>
  )
}
