import { describe, it, expect } from 'vitest'
import { interpolateCount, formatCountDisplay } from '@/lib/count-up'

describe('interpolateCount', () => {
  it('returns 0 at progress 0', () => {
    expect(interpolateCount(0, 7500)).toBe(0)
  })

  it('returns target at progress 1', () => {
    expect(interpolateCount(1, 7500)).toBe(7500)
    expect(interpolateCount(1, 70)).toBe(70)
  })

  it('clamps progress below 0 and above 1', () => {
    expect(interpolateCount(-0.5, 100)).toBe(0)
    expect(interpolateCount(1.5, 100)).toBe(100)
  })

  it('rounds to nearest integer', () => {
    expect(interpolateCount(0.5, 70)).toBe(35)
  })
})

describe('formatCountDisplay', () => {
  it('formats sq ft with locale separators', () => {
    expect(formatCountDisplay(7500, { suffix: ' SQ FT' })).toBe('7,500 SQ FT')
  })

  it('formats count with plus suffix', () => {
    expect(formatCountDisplay(70, { suffix: '+' })).toBe('70+')
  })
})
