export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  isComplete: boolean
}

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export function getCountdownParts(
  target: string | number | Date,
  now: number = Date.now()
): CountdownParts {
  const targetMs = new Date(target).getTime()

  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, isComplete: true }
  }

  const remaining = targetMs - now

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, isComplete: true }
  }

  return {
    days: Math.floor(remaining / DAY_MS),
    hours: Math.floor((remaining % DAY_MS) / HOUR_MS),
    minutes: Math.floor((remaining % HOUR_MS) / MINUTE_MS),
    isComplete: false,
  }
}
