import { cn } from '@/lib/utils'
import { getStatusBadgeClassName } from '@/lib/admin/request-status'

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
        getStatusBadgeClassName(status)
      )}
    >
      {status}
    </span>
  )
}
