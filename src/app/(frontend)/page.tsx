import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { EducationSection } from '@/components/EducationSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { SkillsSection } from '@/components/SkillsSection'
import { GitHubGraph } from '@/components/GitHubGraph'
import { LatestPostsSection } from '@/components/LatestPostsSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { PersonStructuredData } from '@/components/PersonStructuredData'

export default function HomePage() {
  return (
    <>
      <PersonStructuredData />
      <Navigation />
      <main id="main-content" className="pt-24">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection />
        <SkillsSection />
        <GitHubGraph />
        <LatestPostsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
