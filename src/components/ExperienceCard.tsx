'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Experience } from '@/payload-types'

interface ExperienceCardProps {
  title: string
  company: string
  dateRange: string
  description: Experience['description']
}

export function ExperienceCard({ title, company, dateRange, description }: ExperienceCardProps) {
  return (
    <article>
      <Card
        tabIndex={0}
        className="border-zinc-800 bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background hover:border-teal-700"
      >
        <CardHeader>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-base text-muted-foreground">{company}</p>
          <p className="text-sm text-zinc-500">{dateRange}</p>
        </CardHeader>
        {description && (
          <CardContent>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <RichText data={description} />
            </div>
          </CardContent>
        )}
      </Card>
    </article>
  )
}
