import { describe, it, expect } from 'vitest'
import { getCountdownParts } from '@/lib/countdown'

const NOW = new Date('2026-09-01T12:00:00Z').getTime()

describe('getCountdownParts', () => {
  it('breaks the remaining time into days, hours, and minutes', () => {
    const target = new Date('2026-10-18T00:33:00Z')

    expect(getCountdownParts(target, NOW)).toEqual({
      days: 46,
      hours: 12,
      minutes: 33,
      isComplete: false,
    })
  })

  it('counts down as time passes', () => {
    const target = new Date('2026-09-01T14:30:00Z')

    expect(getCountdownParts(target, NOW)).toMatchObject({
      days: 0,
      hours: 2,
      minutes: 30,
    })
    expect(getCountdownParts(target, NOW + 60_000)).toMatchObject({
      days: 0,
      hours: 2,
      minutes: 29,
    })
  })

  it('reports completion once the target passes', () => {
    expect(getCountdownParts(new Date(NOW), NOW)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      isComplete: true,
    })
    expect(getCountdownParts(new Date(NOW - 1000), NOW).isComplete).toBe(true)
  })

  it('treats an unparseable target as complete instead of throwing', () => {
    expect(getCountdownParts('not-a-date', NOW).isComplete).toBe(true)
  })
})
