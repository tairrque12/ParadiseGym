import { describe, it, expect } from 'vitest'
import { formatRelativeTime } from '@/lib/admin/format-relative-time'

describe('formatRelativeTime', () => {
  it('formats recent timestamps as relative time', () => {
    const now = new Date('2026-07-02T14:00:00Z')
    expect(
      formatRelativeTime('2026-07-02T12:00:00Z', now)
    ).toMatch(/2 hours ago/i)
  })

  it('returns just now for very recent timestamps', () => {
    const now = new Date('2026-07-02T14:00:10Z')
    expect(formatRelativeTime('2026-07-02T14:00:00Z', now)).toBe('just now')
  })
})
