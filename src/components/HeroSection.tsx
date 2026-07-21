import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Button } from '@/components/ui/button'
import { ProofPanel } from '@/components/ProofPanel'

export async function HeroSection() {
  const payload = await getPayload({ config })
  const [hero, about] = await Promise.all([
    payload.findGlobal({ slug: 'hero' }),
    payload.findGlobal({ slug: 'about' }),
  ])

  const photo = about?.photo && typeof about.photo !== 'number' ? about.photo : null
  const chips = (about?.highlights ?? []).slice(0, 6)

  return (
    <section id="hero" aria-label="Introduction" className="px-6 pb-10 pt-12 desk:pt-16">
      <div className="mx-auto grid max-w-[1120px] items-center gap-10 desk:grid-cols-[1.15fr_1fr] desk:gap-14">
        <div>
          {photo?.url && (
            <div className="mb-5">
              <Image
                src={photo.url}
                alt={photo.alt || `Photo of ${hero.name}`}
                width={112}
                height={112}
                priority
                className="h-14 w-14 rounded-full border-2 border-border object-cover"
              />
            </div>
          )}
          <p className="mb-4 font-mono text-[13px] text-teal">
            <span aria-hidden="true" className="text-text-tertiary">
              ${' '}
            </span>
            whoami
          </p>
          <h1 className="mb-1.5 text-4xl font-extrabold tracking-tight text-foreground desk:text-[46px] desk:leading-[1.1]">
            {hero.name}
          </h1>
          <h2 className="mb-4 text-lg font-semibold text-teal">{hero.headline}</h2>
          {hero.tagline && <p className="mb-5 max-w-[46ch] text-text-secondary">{hero.tagline}</p>}

          {chips.length > 0 && (
            <ul role="list" aria-label="Core skills" className="mb-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li
                  key={chip.id ?? chip.text}
                  className="rounded-chip border border-border bg-panel px-2.5 py-1 font-mono text-[11.5px] text-text-secondary"
                >
                  {chip.text}
                </li>
              ))}
            </ul>
          )}

          {hero.ctaButtons && hero.ctaButtons.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {hero.ctaButtons.map((button, index) => (
                <Button
                  key={button.id ?? index}
                  variant={button.variant === 'primary' ? 'default' : 'outline'}
                  asChild
                  className={`min-h-[44px] min-w-[44px] font-semibold ${
                    button.variant === 'primary'
                      ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                      : 'border-border bg-transparent text-text-secondary hover:border-text-tertiary hover:bg-transparent hover:text-foreground'
                  }`}
                >
                  <a href={button.url}>{button.label}</a>
                </Button>
              ))}
            </div>
          )}
        </div>

        <ProofPanel />
      </div>
    </section>
  )
}
