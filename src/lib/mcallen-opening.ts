/** McAllen's announced opening day, interpreted in America/Chicago. */
export const MCALLEN_OPENING_DAY = '2026-11-28'

export const MCALLEN_OPENS_LABEL = 'Opens Nov 28'
export const MCALLEN_NOW_OPEN_LABEL = 'Now open'

export function chicagoDateKey(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/** True on and after 28 Nov 2026 in America/Chicago. */
export function isMcAllenOpen(now = new Date()): boolean {
  return chicagoDateKey(now) >= MCALLEN_OPENING_DAY
}
