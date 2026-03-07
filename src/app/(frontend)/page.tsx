import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { EducationSection } from '@/components/EducationSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
    </main>
  )
}
