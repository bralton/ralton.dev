import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for ralton.dev - how your data is collected, used, and protected.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-24">
        <article className="mx-auto max-w-[800px] px-4 py-16 md:px-6 lg:px-8">
          <header className="mb-12">
            <h1 className="text-text-primary text-4xl font-bold md:text-5xl">Privacy Policy</h1>
            <p className="text-text-muted mt-4 text-sm">Last updated: March 11, 2026</p>
          </header>

          <div className="space-y-8">
            <section>
              <h2 className="text-text-primary text-2xl font-semibold">Overview</h2>
              <p className="mt-4 text-text-secondary">
                This privacy policy explains how your information is collected, used, and protected
                when you visit ralton.dev.
              </p>
            </section>

            <section>
              <h2 className="text-text-primary text-2xl font-semibold">Information We Collect</h2>
              <p className="mt-4 text-text-secondary">
                Details about data collection practices will be provided here.
              </p>
            </section>

            <section>
              <h2 className="text-text-primary text-2xl font-semibold">
                How We Use Your Information
              </h2>
              <p className="mt-4 text-text-secondary">
                Information about how collected data is used will be provided here.
              </p>
            </section>

            <section>
              <h2 className="text-text-primary text-2xl font-semibold">Data Retention</h2>
              <p className="mt-4 text-text-secondary">
                Details about data retention periods will be provided here.
              </p>
            </section>

            <section>
              <h2 className="text-text-primary text-2xl font-semibold">Third-Party Services</h2>
              <p className="mt-4 text-text-secondary">
                Information about third-party services will be provided here.
              </p>
            </section>

            <section>
              <h2 className="text-text-primary text-2xl font-semibold">Contact</h2>
              <p className="mt-4 text-text-secondary">
                For questions about this privacy policy, please use the contact form on the
                homepage.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
