import Link from 'next/link'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { RequestedPath } from '@/components/RequestedPath'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
}

const links = [
  { label: 'Home', href: '/', primary: true },
  { label: 'Blog', href: '/blog', primary: false },
  { label: 'Projects', href: '/projects', primary: false },
]

export default function NotFound() {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Navigation />
        <main
          id="main-content"
          className="flex flex-1 flex-col justify-center px-6 pb-24 pt-16 desk:pt-24"
        >
          <div className="mx-auto w-full max-w-[640px]">
            <p className="mb-4 break-all font-mono text-[13px] text-teal">
              <span aria-hidden="true" className="text-text-tertiary">
                ${' '}
              </span>
              curl -I https://www.ralton.dev
              <RequestedPath />
            </p>

            <div
              aria-hidden="true"
              className="mb-8 rounded-panel border border-border bg-panel p-5 font-mono text-sm leading-7 text-text-secondary desk:p-6"
            >
              <p className="flex items-baseline gap-3">
                <span className="text-text-tertiary">HTTP/2</span>
                <span className="text-5xl font-extrabold tracking-tight text-foreground">404</span>
              </p>
            </div>

            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground desk:text-[38px] desk:leading-[1.1]">
              Nothing at this address.
            </h1>
            <p className="mb-6 max-w-[46ch] text-text-secondary">
              The link might be old, or the page was never here. These three definitely are.
            </p>

            <nav aria-label="Places to go instead" className="flex flex-wrap items-center gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background ${
                    link.primary
                      ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                      : 'border border-border bg-transparent text-text-secondary hover:border-text-tertiary hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  )
}
