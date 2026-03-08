'use client'
import type { DefaultCellComponentProps } from 'payload'

export const VisibilityCell = ({ cellData }: DefaultCellComponentProps) => {
  const isVisible = cellData as boolean

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: isVisible ? 'var(--theme-success-500)' : 'var(--theme-error-500)',
        opacity: isVisible ? 1 : 0.7,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isVisible
            ? 'var(--theme-success-500, #22c55e)'
            : 'var(--theme-error-500, #ef4444)',
        }}
      />
      {isVisible ? 'Visible' : 'Hidden'}
    </span>
  )
}
