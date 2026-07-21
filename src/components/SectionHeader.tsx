interface SectionHeaderProps {
  label: string
  meta?: React.ReactNode
  headingId: string
}

export function SectionHeader({ label, meta, headingId }: SectionHeaderProps) {
  return (
    <div className="mb-7 flex items-baseline gap-4">
      <h2 id={headingId} className="whitespace-nowrap font-mono text-[13px] text-teal">
        <span aria-hidden="true" className="text-text-tertiary">
          ~/
        </span>
        {label}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-border-soft" />
      {meta && (
        <span className="whitespace-nowrap font-mono text-[11.5px] text-text-tertiary">{meta}</span>
      )}
    </div>
  )
}
