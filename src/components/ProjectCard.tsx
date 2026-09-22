'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Project, Media } from '@/payload-types'
import { StatusBadge } from './StatusBadge'
import { parseProjectStatus } from '@/lib/projectStatus'

interface ProjectCardProps {
  title: string
  description: Project['description']
  techStack: { technology: string }[]
  links: ProjectLink[]
  /** Internal path to this project's privacy policy page, when one is published. */
  privacyPolicyHref?: string | null
  image?: Media | number | null
  index: number
  /** Heading level for the title - h3 under a section h2 (default), h2 directly under a page h1 */
  headingLevel?: 'h2' | 'h3'
}

export type ProjectLink = NonNullable<Project['links']>[number]

/** Display text and accessible description for each link type. */
const LINK_LABELS: Record<ProjectLink['type'], { text: string; aria: string }> = {
  github: { text: 'github', aria: 'source code on GitHub' },
  live: { text: 'live', aria: 'live site' },
  appStore: { text: 'app store', aria: 'on the App Store' },
  googlePlay: { text: 'google play', aria: 'on Google Play' },
  other: { text: 'link', aria: 'link' },
}

function linkLabel(link: ProjectLink): { text: string; aria: string } {
  const base = LINK_LABELS[link.type] ?? LINK_LABELS.other
  if (link.type === 'other' && link.label) {
    return { text: link.label.toLowerCase(), aria: link.label }
  }
  return base
}

const linkClassName =
  'rounded font-mono text-xs text-text-secondary transition-colors hover:text-teal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-panel'

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
  links,
  privacyPolicyHref,
  image,
  index,
  headingLevel: Heading = 'h3',
}: ProjectCardProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const { displayTitle, status } = parseProjectStatus(title)
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
        <Heading className="mb-2 text-[17px] font-bold tracking-tight text-foreground">
          {displayTitle} <StatusBadge status={status} />
        </Heading>
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
          <div className="flex shrink-0 flex-wrap justify-end gap-3">
            {links.map((link) => {
              const { text, aria } = linkLabel(link)
              return (
                <a
                  key={link.id ?? `${link.type}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${displayTitle} ${aria}`}
                  className={linkClassName}
                >
                  {text} ↗
                </a>
              )
            })}
            {privacyPolicyHref && (
              <Link
                href={privacyPolicyHref}
                aria-label={`Read the ${displayTitle} privacy policy`}
                className={linkClassName}
              >
                privacy →
              </Link>
            )}
          </div>
        </div>

        <details ref={detailsRef} className="group/write mt-3.5 border-t border-border-soft">
          <summary className="cursor-pointer list-none rounded pt-3 font-mono text-xs text-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="text-text-tertiary">
              <span className="group-open/write:hidden">+ </span>
              <span className="hidden group-open/write:inline">− </span>
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
