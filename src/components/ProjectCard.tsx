'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Project, Media } from '@/payload-types'
import { StatusBadge } from './StatusBadge'

interface ProjectCardProps {
  title: string
  description: Project['description']
  techStack: { technology: string }[]
  repoUrl?: string | null
  liveUrl?: string | null
  image?: Media | number | null
  index: number
}

/** Derive display title + status from title conventions - Projects has no status field (NFR-R6). */
function parseStatus(title: string): { displayTitle: string; status: 'active' | 'archived' } {
  const match = title.match(/\s*[-–—]?\s*\((abandoned|archived|deprecated)\)\s*/i)
  if (match) {
    return { displayTitle: title.replace(match[0], ' ').trim(), status: 'archived' }
  }
  return { displayTitle: title, status: 'active' }
}

/** Plain text of the first non-empty Lexical paragraph, for the card's one-line summary. */
function extractSummary(description: Project['description']): string {
  const children = (description?.root?.children ?? []) as Array<{
    type?: string
    children?: Array<{ text?: string }>
  }>
  for (const node of children) {
    if (node.type === 'paragraph') {
      const text = (node.children ?? [])
        .map((c) => c.text ?? '')
        .join('')
        .trim()
      if (text) return text.length > 180 ? `${text.slice(0, 177)}…` : text
    }
  }
  return ''
}

export function ProjectCard({
  title,
  description,
  techStack,
  repoUrl,
  liveUrl,
  image,
  index,
}: ProjectCardProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const { displayTitle, status } = parseStatus(title)
  const summary = extractSummary(description)

  const handleCardClick = (e: React.MouseEvent) => {
    // Links and the summary control keep their own behavior; text selection is respected.
    if ((e.target as HTMLElement).closest('a, summary')) return
    if (window.getSelection()?.toString()) return
    const details = detailsRef.current
    if (details) details.open = !details.open
  }

  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-panel border border-border bg-panel transition-colors hover:border-teal-deep"
    >
      <div className="relative h-[150px] border-b border-border-soft bg-panel-2">
        {image && typeof image !== 'number' && image.url ? (
          <Image
            src={image.url}
            alt={image.alt || `Screenshot of ${displayTitle} project`}
            fill
            className="object-cover"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        ) : (
          <FallbackThumb index={index} />
        )}
      </div>

      <div className="p-5 desk:px-6">
        <h3 className="mb-2 text-[17px] font-bold tracking-tight text-foreground">
          {displayTitle} <StatusBadge status={status} />
        </h3>
        {summary && <p className="mb-3.5 text-sm text-text-secondary">{summary}</p>}

        <div className="flex items-center justify-between gap-4">
          {techStack.length > 0 && (
            <ul role="list" aria-label="Technologies used" className="flex flex-wrap gap-x-1.5">
              {techStack.map((tech, i) => (
                <li key={tech.technology} className="font-mono text-[11px] text-teal-dim">
                  {i > 0 && (
                    <span aria-hidden="true" className="mr-1.5 text-text-tertiary">
                      ·
                    </span>
                  )}
                  {tech.technology}
                </li>
              ))}
            </ul>
          )}
          <div className="flex shrink-0 gap-3">
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${displayTitle} source code on GitHub`}
                className="rounded font-mono text-xs text-text-secondary transition-colors hover:text-teal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-panel"
              >
                github ↗
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${displayTitle} live site`}
                className="rounded font-mono text-xs text-text-secondary transition-colors hover:text-teal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-panel"
              >
                live ↗
              </a>
            )}
          </div>
        </div>

        <details ref={detailsRef} className="mt-3.5 border-t border-border-soft">
          <summary className="cursor-pointer list-none rounded pt-3 font-mono text-xs text-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="text-text-tertiary">
              <span className="group-has-[details[open]]:hidden">+ </span>
              <span className="hidden group-has-[details[open]]:inline">− </span>
            </span>
            full write-up
          </summary>
          <div className="prose prose-invert mt-2.5 max-w-none text-sm text-text-secondary prose-p:my-2.5">
            <RichText data={description} />
          </div>
        </details>
      </div>
    </article>
  )
}

/** Decorative deterministic thumbnail for projects without an image. */
function FallbackThumb({ index }: { index: number }) {
  const flip = index % 2 === 1
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 150"
      className={`absolute inset-0 h-full w-full text-teal ${flip ? '-scale-x-100' : ''}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="currentColor" strokeOpacity="0.3">
        <rect x="30" y="30" width="120" height="90" rx="4" />
        <rect x="50" y="48" width="80" height="24" rx="2" />
        <rect x="50" y="82" width="80" height="24" rx="2" />
        <rect x="230" y="20" width="140" height="50" rx="4" />
        <rect x="230" y="85" width="140" height="45" rx="4" />
        <path d="M150 75 L230 45 M150 75 L230 107" />
      </g>
      <g fill="currentColor" fillOpacity="0.5">
        <circle cx="150" cy="75" r="3" />
        <circle cx="230" cy="45" r="3" />
        <circle cx="230" cy="107" r="3" />
      </g>
    </svg>
  )
}
