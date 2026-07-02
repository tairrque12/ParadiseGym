export type GymDayHours = {
  openMinutes: number
  closeMinutes: number
}

export const GYM_TIMEZONE = 'America/Chicago'

const GYM_HOURS_BY_DAY: Record<number, GymDayHours> = {
  0: { openMinutes: 9 * 60, closeMinutes: 17 * 60 },
  1: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  2: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  3: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  4: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  5: { openMinutes: 5 * 60, closeMinutes: 24 * 60 },
  6: { openMinutes: 8 * 60, closeMinutes: 20 * 60 },
}

export type TimeSlotGroup = {
  label: string
  slots: string[]
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

export function formatTimeLabel(minutes: number): string {
  const hours24 = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  const period = hours24 >= 12 ? 'PM' : 'AM'
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12

  return `${hour12}:${String(mins).padStart(2, '0')} ${period}`
}

export function parseTimeLabelToMinutes(timeLabel: string): number | null {
  const match = timeLabel.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/)
  if (!match) return null

  const hour = Number(match[1])
  const minute = Number(match[2])
  const period = match[3]

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null

  let hours24 = hour % 12
  if (period === 'PM') hours24 += 12

  return hours24 * 60 + minute
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

function getDateStringInGymTimezone(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: GYM_TIMEZONE })
}

function getNowMinutesInGymTimezone(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: GYM_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)

  return hour * 60 + minute
}

export function filterFutureTimeSlotsForDate(
  dateInput: string,
  slots: string[],
  now = new Date()
): string[] {
  if (getDateStringInGymTimezone(now) !== dateInput) {
    return slots
  }

  const nowMinutes = getNowMinutesInGymTimezone(now)

  return slots.filter((slot) => {
    const slotMinutes = parseTimeLabelToMinutes(slot)
    return slotMinutes !== null && slotMinutes > nowMinutes
  })
}

export function getAvailableTimeSlotsForDate(
  dateInput: string,
  now = new Date()
): string[] {
  return filterFutureTimeSlotsForDate(
    dateInput,
    generateTimeSlotsForDate(dateInput),
    now
  )
}

function getSlotGroupLabel(minutes: number): string {
  if (minutes < 12 * 60) return 'Morning'
  if (minutes < 17 * 60) return 'Afternoon'
  return 'Evening'
}

export function groupTimeSlots(slots: string[]): TimeSlotGroup[] {
  const groups = new Map<string, string[]>()

  for (const slot of slots) {
    const minutes = parseTimeLabelToMinutes(slot)
    if (minutes === null) continue

    const label = getSlotGroupLabel(minutes)
    const existing = groups.get(label) ?? []
    existing.push(slot)
    groups.set(label, existing)
  }

  return ['Morning', 'Afternoon', 'Evening']
    .map((label) => ({
      label,
      slots: groups.get(label) ?? [],
    }))
    .filter((group) => group.slots.length > 0)
}

export function isValidTimeSlotForDate(
  dateInput: string,
  time: string,
  now = new Date()
): boolean {
  return getAvailableTimeSlotsForDate(dateInput, now).includes(time)
}
