export type GymDayHours = {
  openMinutes: number
  closeMinutes: number
}

const GYM_HOURS_BY_DAY: Record<number, GymDayHours> = {
  0: { openMinutes: 9 * 60, closeMinutes: 17 * 60 },
  1: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  2: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  3: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  4: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  5: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  6: { openMinutes: 8 * 60, closeMinutes: 20 * 60 },
}

function parseDateOnly(dateString: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null

  const [year, month, day] = dateString.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null
  }

  return parsed
}

function formatTimeLabel(minutes: number): string {
  const hours24 = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  const date = new Date(2000, 0, 1, hours24, mins)

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function getGymHoursForDate(dateInput: string): GymDayHours | null {
  const parsed = parseDateOnly(dateInput)
  if (!parsed) return null

  return GYM_HOURS_BY_DAY[parsed.getDay()] ?? null
}

export function generateTimeSlotsForDate(dateInput: string): string[] {
  const hours = getGymHoursForDate(dateInput)
  if (!hours) return []

  const slots: string[] = []

  for (
    let minutes = hours.openMinutes;
    minutes < hours.closeMinutes;
    minutes += 30
  ) {
    slots.push(formatTimeLabel(minutes))
  }

  return slots
}

export function isValidTimeSlotForDate(
  dateInput: string,
  time: string
): boolean {
  return generateTimeSlotsForDate(dateInput).includes(time)
}
