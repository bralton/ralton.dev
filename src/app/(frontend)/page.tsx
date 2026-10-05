import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { LatestPostsSection } from '@/components/LatestPostsSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { PersonStructuredData } from '@/components/PersonStructuredData'

// Re-check on a timer so a scheduled post appears once its publish date passes
export const revalidate = 600

export default function HomePage() {
  return (
    <>
      <PersonStructuredData />
      <Navigation />
      <main id="main-content" className="pb-12">
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
        <LatestPostsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
