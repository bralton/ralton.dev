import React from 'react'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ben Ralton | Development & Operations',
    template: '%s | Ben Ralton',
  },
  description:
    'Personal portfolio of Ben Ralton - Development & Operations professional specializing in full-stack web development, DevOps, and cloud infrastructure.',
  keywords: [
    'Ben Ralton',
    'Software Developer',
    'DevOps',
    'Full Stack Developer',
    'Web Development',
    'Cloud Infrastructure',
    'Next.js',
    'TypeScript',
    'React',
  ],
  authors: [{ name: 'Ben Ralton', url: siteUrl }],
  creator: 'Ben Ralton',
  publisher: 'Ben Ralton',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Ben Ralton',
    title: 'Ben Ralton | Development & Operations',
    description:
      'Personal portfolio of Ben Ralton - Development & Operations professional specializing in full-stack web development, DevOps, and cloud infrastructure.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ben Ralton - Development & Operations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Ralton | Development & Operations',
    description: 'Personal portfolio of Ben Ralton - Development & Operations professional.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
