import { getPayload } from 'payload'
import config from '@payload-config'
import { Button } from '@/components/ui/button'

export async function HeroSection() {
  const payload = await getPayload({ config })
  const hero = await payload.findGlobal({ slug: 'hero' })

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 md:px-6 lg:min-h-[85vh] lg:px-8">
      <div className="mx-auto w-full max-w-[1200px] text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl lg:text-[48px]">
          {hero.name}
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]">
          {hero.headline}
        </h2>
        {hero.tagline && (
          <p className="mx-auto mb-8 max-w-2xl text-base text-text-secondary">{hero.tagline}</p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {hero.ctaButtons?.map((button, index) => (
            <Button
              key={button.id ?? index}
              variant={button.variant === 'primary' ? 'default' : 'outline'}
              asChild
              className={`min-h-[44px] min-w-[44px] ${
                button.variant === 'primary'
                  ? 'bg-teal-700 text-white hover:bg-teal-800'
                  : 'border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <a href={button.url}>{button.label}</a>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
