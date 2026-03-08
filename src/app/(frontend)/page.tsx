import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { EducationSection } from '@/components/EducationSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { SkillsSection } from '@/components/SkillsSection'
import { GitHubGraph } from '@/components/GitHubGraph'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-24">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection />
        <SkillsSection />
        <GitHubGraph />
        {/* Contact section placeholder for navigation anchor - implemented in Epic 5 */}
        <section id="contact" className="sr-only" aria-label="Contact section placeholder">
          {/* Content will be implemented in Epic 5 */}
        </section>
      </main>
      <Footer />
    </>
  )
}
