import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function AboutSection() {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({ slug: 'about' })

  return (
    <section id="about" aria-labelledby="about-heading" className="px-4 py-16 md:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="about-heading" className="mb-8 text-2xl font-semibold text-foreground md:text-3xl lg:text-[32px]">
          About
        </h2>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Photo */}
          {about.photo && typeof about.photo !== 'number' && about.photo.url && (
            <div className="relative aspect-square overflow-hidden rounded-lg lg:aspect-[3/4]">
              <Image
                src={about.photo.url}
                alt={about.photo.alt || 'Ben Ralton profile photo'}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQIDBAAFEQYSITETQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEEMAPA/ky0SL3d4jj6XHRPYkvBrABWu0NqUMDuNx6rmvVK17vAKRaozZwcYcz9pmioAFllZGw//2Q=="
              />
            </div>
          )}

          {/* Bio + Highlights */}
          <div className="flex flex-col justify-center">
            {about.bio && (
              <div className="prose prose-invert max-w-none text-text-secondary">
                <RichText data={about.bio} />
              </div>
            )}

            {about.highlights && about.highlights.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" role="list" aria-label="Key highlights and specialties">
                {about.highlights.map((highlight, index) => (
                  <li key={highlight.id ?? index}>
                    <Badge className="bg-teal-700 text-white hover:bg-teal-800">
                      {highlight.text}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
