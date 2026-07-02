import { describe, it, expect } from 'vitest'
import {
  generateTimeSlotsForDate,
  getGymHoursForDate,
  isValidTimeSlotForDate,
} from '@/lib/gym-hours'

describe('gym-hours', () => {
  it('returns weekday hours for a Monday date', () => {
    const hours = getGymHoursForDate('2026-07-06')

    expect(hours).toEqual({
      openMinutes: 5 * 60,
      closeMinutes: 24 * 60,
    })
  })

  it('returns Saturday hours for a Saturday date', () => {
    const hours = getGymHoursForDate('2026-07-11')

    expect(hours).toEqual({
      openMinutes: 8 * 60,
      closeMinutes: 20 * 60,
    })
  })

  it('returns Sunday hours for a Sunday date', () => {
    const hours = getGymHoursForDate('2026-07-12')

    expect(hours).toEqual({
      openMinutes: 9 * 60,
      closeMinutes: 17 * 60,
    })
  })

  it('generates 30-minute slots between open and close for each day type', () => {
    const weekdaySlots = generateTimeSlotsForDate('2026-07-06')
    const saturdaySlots = generateTimeSlotsForDate('2026-07-11')
    const sundaySlots = generateTimeSlotsForDate('2026-07-12')

    expect(weekdaySlots[0]).toBe('5:00 AM')
    expect(weekdaySlots.at(-1)).toBe('11:30 PM')

    expect(saturdaySlots[0]).toBe('8:00 AM')
    expect(saturdaySlots.at(-1)).toBe('7:30 PM')

    expect(sundaySlots[0]).toBe('9:00 AM')
    expect(sundaySlots.at(-1)).toBe('4:30 PM')
  })

  it('validates whether a time is in the generated slot list for a date', () => {
    expect(isValidTimeSlotForDate('2026-07-06', '10:00 AM')).toBe(true)
    expect(isValidTimeSlotForDate('2026-07-12', '10:00 AM')).toBe(true)
    expect(isValidTimeSlotForDate('2026-07-12', '8:00 AM')).toBe(false)
    expect(isValidTimeSlotForDate('2026-07-06', 'not-a-time')).toBe(false)
  })
})
