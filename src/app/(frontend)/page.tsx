import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { EducationSection } from '@/components/EducationSection'
import { ProjectsSection } from '@/components/ProjectsSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
    </main>
  )
}
