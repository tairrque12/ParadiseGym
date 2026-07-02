const UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
  { unit: 'year', seconds: 60 * 60 * 24 * 365 },
  { unit: 'month', seconds: 60 * 60 * 24 * 30 },
  { unit: 'week', seconds: 60 * 60 * 24 * 7 },
  { unit: 'day', seconds: 60 * 60 * 24 },
  { unit: 'hour', seconds: 60 * 60 },
  { unit: 'minute', seconds: 60 },
]

export function formatRelativeTime(
  dateInput: string | Date,
  now = new Date()
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000)

  if (Math.abs(diffSeconds) < 45) return 'just now'

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  for (const { unit, seconds } of UNITS) {
    const value = Math.round(diffSeconds / seconds)
    if (Math.abs(value) >= 1) {
      return formatter.format(value, unit)
    }
  }

  return 'just now'
}
