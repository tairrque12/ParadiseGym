import { describe, expect, it } from 'vitest'
import { analyticsLocation } from '@/lib/analytics'

describe('analyticsLocation', () => {
  it('marks the McAllen page and treats every other path as Harlingen', () => {
    expect(analyticsLocation('/mcallen')).toBe('mcallen')
    expect(analyticsLocation('/')).toBe('harlingen')
    expect(analyticsLocation('/gallery')).toBe('harlingen')
  })
})
