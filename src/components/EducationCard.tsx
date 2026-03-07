'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Education } from '@/payload-types'

interface EducationCardProps {
  degree: string
  institution: string
  dateRange: string
  description?: Education['description']
}

export function EducationCard({ degree, institution, dateRange, description }: EducationCardProps) {
  return (
    <article>
      <Card
        tabIndex={0}
        className="border-zinc-800 bg-zinc-900 transition-colors hover:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
      >
        <CardHeader>
          <h3 className="text-xl font-semibold text-foreground">{degree}</h3>
          <p className="text-base text-muted-foreground">{institution}</p>
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
