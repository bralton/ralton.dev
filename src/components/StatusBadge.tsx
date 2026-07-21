interface StatusBadgeProps {
  status: 'active' | 'archived'
  detail?: string
}

export function StatusBadge({ status, detail }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-[3px] border px-1.5 py-0.5 align-[2px] font-mono text-[10.5px] ${
        status === 'active' ? 'border-teal-deep text-teal' : 'border-border text-text-tertiary'
      }`}
    >
      {status}
      {detail ? ` · ${detail}` : ''}
    </span>
  )
}
