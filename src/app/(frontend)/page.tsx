import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { LatestPostsSection } from '@/components/LatestPostsSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { PersonStructuredData } from '@/components/PersonStructuredData'

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
