export const REQUEST_STATUSES = ['new', 'contacted', 'closed'] as const

export type RequestStatus = (typeof REQUEST_STATUSES)[number]

export function isRequestStatus(value: string): value is RequestStatus {
  return REQUEST_STATUSES.includes(value as RequestStatus)
}

export function getStatusBadgeClassName(status: string): string {
  switch (status) {
    case 'new':
      return 'border-neon/40 bg-neon/15 text-neon'
    case 'contacted':
      return 'border-amber-400/40 bg-amber-400/15 text-amber-200'
    case 'closed':
      return 'border-white/20 bg-white/10 text-white/60'
    default:
      return 'border-white/20 bg-white/10 text-white/60'
  }
}
