'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Github, ExternalLink } from 'lucide-react'
import type { Project, Media } from '@/payload-types'

interface ProjectCardProps {
  title: string
  description: Project['description']
  techStack: { technology: string }[]
  repoUrl?: string | null
  liveUrl?: string | null
  image?: Media | number | null
}

export function ProjectCard({
  title,
  description,
  techStack,
  repoUrl,
  liveUrl,
  image,
}: ProjectCardProps) {
  return (
    <article>
      <Card
        tabIndex={0}
        className="overflow-hidden border-zinc-800 bg-zinc-900 transition-colors hover:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
      >
        {image && typeof image !== 'number' && image.url && (
          <div className="relative aspect-video w-full">
            <Image
              src={image.url}
              alt={image.alt || `Screenshot of ${title} project`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-invert max-w-none text-text-secondary">
            <RichText data={description} />
          </div>

          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge
                  key={tech.technology}
                  variant="outline"
                  className="border-teal-700/50 bg-teal-900/30 text-teal-400"
                >
                  {tech.technology}
                </Badge>
              ))}
            </div>
          )}

          {(repoUrl || liveUrl) && (
            <div className="flex gap-3">
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${title} source code on GitHub`}
                  className="rounded text-zinc-400 transition-colors hover:text-teal-400 focus:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${title} live demo`}
                  className="rounded text-zinc-400 transition-colors hover:text-teal-400 focus:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  )
}
