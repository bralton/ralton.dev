import { Section } from './Section'
import { ContactForm } from './ContactForm'
import { SocialLinks } from './SocialLinks'

export function ContactSection() {
  return (
    <Section id="contact" label="contact">
      <div className="grid gap-10 desk:grid-cols-[1fr_1.2fr] desk:gap-12">
        <div>
          <h3 className="mb-3 text-2xl font-bold tracking-tight text-foreground">Say hello</h3>
          <p className="mb-5 max-w-[40ch] text-text-secondary">
            Open to interesting conversations — infrastructure war stories, side-project ideas, or
            just what you&apos;re building. I&apos;ll get back to you quickly.
          </p>
          <SocialLinks />
        </div>
        <ContactForm />
      </div>
    </Section>
  )
}
