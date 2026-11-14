import { describe, it, expect, vi, afterEach } from 'vitest'
import { tourRequestSchema } from '@/lib/validations/tour'

const validPayload = {
  location: 'harlingen' as const,
  first_name: 'Elena',
  last_name: 'Rivera',
  email: 'elena@example.com',
  phone: '9562446692',
  preferred_date: '2027-01-04',
  preferred_time: '10:00 AM',
}

describe('tourRequestSchema', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('accepts a valid payload and an empty email', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-02T12:00:00Z'))

    expect(tourRequestSchema.safeParse(validPayload).success).toBe(true)
    expect(
      tourRequestSchema.safeParse({ ...validPayload, email: '' }).success
    ).toBe(true)
  })

  it('requires first and last name', () => {
    const result = tourRequestSchema.safeParse({
      ...validPayload,
      first_name: '',
    })
    expect(result.success).toBe(false)
  })

  it('requires a valid email', () => {
    const result = tourRequestSchema.safeParse({
      ...validPayload,
      email: 'bad-email',
    })
    expect(result.success).toBe(false)
  })

  it('requires a valid US phone format', () => {
    expect(
      tourRequestSchema.safeParse({ ...validPayload, phone: 'abc' }).success
    ).toBe(false)
    expect(
      tourRequestSchema.safeParse({
        ...validPayload,
        phone: '(956) 244-6692',
      }).success
    ).toBe(true)
  })

  it('requires a day and a valid time slot', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-02T12:00:00Z'))

    const result = tourRequestSchema.safeParse({
      ...validPayload,
      preferred_date: '2026-07-10',
      preferred_time: '10:00 AM',
    })
    expect(result.success).toBe(true)
  })

  it('rejects preferred_date in the past', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-02T12:00:00Z'))

    const result = tourRequestSchema.safeParse({
      ...validPayload,
      preferred_date: '2026-07-01',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid preferred_date values', () => {
    const result = tourRequestSchema.safeParse({
      ...validPayload,
      preferred_date: 'not-a-date',
    })
    expect(result.success).toBe(false)
  })

  it('rejects preferred_time that is not a valid slot for the chosen date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-02T12:00:00Z'))

    const result = tourRequestSchema.safeParse({
      ...validPayload,
      preferred_date: '2026-07-12',
      preferred_time: '8:00 AM',
    })

    expect(result.success).toBe(false)
  })

  it('accepts preferred_time when it matches a valid slot for the chosen date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-02T12:00:00Z'))

    const result = tourRequestSchema.safeParse({
      ...validPayload,
      preferred_date: '2026-07-10',
      preferred_time: '10:00 AM',
    })

    expect(result.success).toBe(true)
  })

  it('rejects a request with no location', () => {
    const result = tourRequestSchema.safeParse({
      ...validPayload,
      location: undefined,
    })

    expect(result.success).toBe(false)
  })

  it('rejects preferred_time without a preferred_date', () => {
    const result = tourRequestSchema.safeParse({
      ...validPayload,
      preferred_date: '',
      preferred_time: '10:00 AM',
    })

    expect(result.success).toBe(false)
  })
})
