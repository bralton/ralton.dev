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
              <h2 className="text-text-primary text-2xl font-semibold">Information I Collect</h2>
              <p className="mt-4 text-text-secondary">
                When you use the contact form on this site, I collect:
              </p>
              <ul
                className="mt-4 list-disc space-y-2 pl-5 text-text-secondary"
                role="list"
                aria-label="Information collected through the contact form"
              >
                <li>Your name (so I know who I&apos;m talking to)</li>
                <li>Your email address (so I can reply to you)</li>
                <li>Your message (the reason you&apos;re reaching out)</li>
                <li>Your IP address (to prevent spam and abuse)</li>
              </ul>
              <p className="mt-4 text-text-secondary">
                I don&apos;t use cookies for tracking, and I don&apos;t collect any other personal
                information.
              </p>
            </section>

            <section>
              <h2 className="text-text-primary text-2xl font-semibold">
                How I Use Your Information
              </h2>
              <p className="mt-4 text-text-secondary">I use your contact form information to:</p>
              <ul
                className="mt-4 list-disc space-y-2 pl-5 text-text-secondary"
                role="list"
                aria-label="How your information is used"
              >
                <li>Read and respond to your message</li>
                <li>
                  Prevent spam by limiting how many messages can be sent from one IP address (5 per
                  hour)
                </li>
              </ul>
              <p className="mt-4 text-text-secondary">
                That&apos;s it. I don&apos;t use your information for marketing, I don&apos;t build
                profiles, and I don&apos;t sell or share your data. When you submit the contact
                form, I receive an email notification so I can respond promptly.
              </p>
            </section>

            <section>
              <h2 className="text-text-primary text-2xl font-semibold">Data Retention</h2>
              <p className="mt-4 text-text-secondary">
                Contact form submissions are automatically deleted after 90 days. This happens
                through an automated daily cleanup process.
              </p>
              <p className="mt-4 text-text-secondary">
                If you&apos;d like your submission deleted sooner, just let me know through the
                contact form and I&apos;ll remove it manually.
              </p>
            </section>

            <section>
              <h2 className="text-text-primary text-2xl font-semibold">Third-Party Services</h2>
              <p className="mt-4 text-text-secondary">
                To keep this site running, I use a few service providers:
              </p>
              <ul
                className="mt-4 list-disc space-y-2 pl-5 text-text-secondary"
                role="list"
                aria-label="Third-party services used"
              >
                <li>
                  <strong>Vercel</strong> hosts the website and database
                </li>
                <li>
                  <strong>Resend</strong> delivers email notifications when someone contacts me
                </li>
                <li>
                  <strong>Discord</strong> sends me internal notifications when a contact form is
                  submitted (your name, email, and message are included in the notification)
                </li>
              </ul>
              <p className="mt-4 text-text-secondary">
                These services only process your data as needed to provide their services. I
                don&apos;t sell or share your information with anyone for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-text-primary text-2xl font-semibold">Contact</h2>
              <p className="mt-4 text-text-secondary">
                Questions about this privacy policy? Want to know what data I have about you, or
                want it deleted? Just use the contact form on the homepage and I&apos;ll be happy to
                help.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
