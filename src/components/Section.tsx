import { SectionHeader } from './SectionHeader'

interface SectionProps {
  id: string
  label: string
  meta?: React.ReactNode
  children: React.ReactNode
}

/**
 * Section - the single owner of section vertical rhythm (FR-R2).
 * No section or child component may set its own vertical section padding.
 */
export function Section({ id, label, meta, children }: SectionProps) {
  const headingId = `${id}-heading`
  return (
    <section id={id} aria-labelledby={headingId} className="px-6 pb-4 pt-16 desk:pt-24">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeader label={label} meta={meta} headingId={headingId} />
        {children}
      </div>
    </section>
  )
}
