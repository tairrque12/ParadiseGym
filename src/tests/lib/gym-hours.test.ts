import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  filterFutureTimeSlotsForDate,
  generateTimeSlotsForDate,
  getAvailableTimeSlotsForDate,
  getGymHoursForDate,
  groupTimeSlots,
  isValidTimeSlotForDate,
} from '@/lib/gym-hours'

describe('gym-hours', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

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

  it('groups weekday slots with morning times first', () => {
    const groups = groupTimeSlots(generateTimeSlotsForDate('2026-07-06'))

    expect(groups[0]).toEqual({
      label: 'Morning',
      slots: expect.arrayContaining(['5:00 AM', '7:00 AM', '11:30 AM']),
    })
    expect(groups[0]?.slots[0]).toBe('5:00 AM')
  })

  it('filters out past slots when the selected date is today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-06T18:00:00-05:00'))

    const available = getAvailableTimeSlotsForDate('2026-07-06')

    expect(available).not.toContain('5:00 AM')
    expect(available).not.toContain('12:00 PM')
    expect(available).toContain('6:30 PM')
    expect(available).toContain('11:30 PM')
  })

  it('keeps all slots for a future date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-06T18:00:00-05:00'))

    const available = getAvailableTimeSlotsForDate('2026-07-07')

    expect(available[0]).toBe('5:00 AM')
    expect(available).toContain('10:00 AM')
  })

  it('validates whether a time is in the generated slot list for a date', () => {
    expect(isValidTimeSlotForDate('2026-07-06', '10:00 AM')).toBe(true)
    expect(isValidTimeSlotForDate('2026-07-12', '10:00 AM')).toBe(true)
    expect(isValidTimeSlotForDate('2026-07-12', '8:00 AM')).toBe(false)
    expect(isValidTimeSlotForDate('2026-07-06', 'not-a-time')).toBe(false)
  })

  it('rejects past times for today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-06T18:00:00-05:00'))

    expect(isValidTimeSlotForDate('2026-07-06', '10:00 AM')).toBe(false)
    expect(isValidTimeSlotForDate('2026-07-06', '7:00 PM')).toBe(true)
  })
})
