import { describe, expect, it } from 'vitest'
import { openTodayLabel } from '@/lib/contact'

describe('openTodayLabel', () => {
  it('uses the posted hours for the Chicago weekday', () => {
    expect(openTodayLabel(new Date('2026-11-16T15:00:00Z'))).toBe(
      'Open today 5am – Midnight'
    )
    expect(openTodayLabel(new Date('2026-11-14T18:00:00Z'))).toBe(
      'Open today 8am – 8pm'
    )
    expect(openTodayLabel(new Date('2026-11-15T18:00:00Z'))).toBe(
      'Open today 9am – 5pm'
    )
  })
})
