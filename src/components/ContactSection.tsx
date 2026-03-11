import { ContactForm } from './ContactForm'

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-[600px]">
          <h2
            id="contact-heading"
            className="mb-4 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]"
          >
            Get in Touch
          </h2>
          <p className="mb-8 text-text-secondary">
            Have a question or want to work together? Send me a message and I&apos;ll get back to
            you as soon as possible.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
