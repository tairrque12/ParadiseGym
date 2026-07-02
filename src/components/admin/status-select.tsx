import { REQUEST_STATUSES } from '@/lib/admin/request-status'
import { cn } from '@/lib/utils'

type StatusSelectProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  return (
    <select
      aria-label="Update status"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        'h-9 min-w-[132px] rounded-sm border border-white/15 bg-[#141414] px-2 text-sm text-white',
        'focus-visible:border-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/40',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      {REQUEST_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}
