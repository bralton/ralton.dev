import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
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

export default function NotFound() {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Navigation />
        <main
          id="main-content"
          className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
        >
          <Image
            src="/404-slot-machine.png"
            alt="404 - Page Not Found"
            width={400}
            height={500}
            className="mb-4"
            priority
          />

          <h1 className="sr-only">Page Not Found</h1>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
          >
            Back to Home
          </Link>
        </main>
        <Footer />
      </body>
    </html>
  )
}
