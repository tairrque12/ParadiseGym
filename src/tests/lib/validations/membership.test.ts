import { describe, it, expect } from 'vitest'
import { membershipRequestSchema } from '@/lib/validations/membership'

const validPayload = {
  first_name: 'Marcus',
  last_name: 'Torres',
  email: 'marcus@example.com',
  phone: '(956) 244-6692',
  age: 28,
  membership_type: '12_month_contract' as const,
}

describe('membershipRequestSchema', () => {
  it('accepts a valid payload', () => {
    expect(membershipRequestSchema.safeParse(validPayload).success).toBe(true)
  })

  it('requires first and last name', () => {
    const result = membershipRequestSchema.safeParse({
      ...validPayload,
      first_name: '',
      last_name: '',
    })
    expect(result.success).toBe(false)
  })

  it('requires a valid email', () => {
    const result = membershipRequestSchema.safeParse({
      ...validPayload,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('requires a valid US phone format', () => {
    expect(
      membershipRequestSchema.safeParse({ ...validPayload, phone: '123' }).success
    ).toBe(false)
    expect(
      membershipRequestSchema.safeParse({
        ...validPayload,
        phone: '956-244-6692',
      }).success
    ).toBe(true)
  })

  it('requires age between 13 and 100', () => {
    expect(
      membershipRequestSchema.safeParse({ ...validPayload, age: 12 }).success
    ).toBe(false)
    expect(
      membershipRequestSchema.safeParse({ ...validPayload, age: 101 }).success
    ).toBe(false)
    expect(
      membershipRequestSchema.safeParse({ ...validPayload, age: 13 }).success
    ).toBe(true)
  })

  it('requires membership_type to be a valid gym membership option', () => {
    expect(
      membershipRequestSchema.safeParse({
        ...validPayload,
        membership_type: 'premium',
      }).success
    ).toBe(false)
    for (const tier of [
      '12_month_contract',
      'month_to_month',
      '1_year_paid_in_full',
      '6_months_paid_in_full',
      'one_month',
      'week_pass',
      'day_pass',
    ] as const) {
      expect(
        membershipRequestSchema.safeParse({
          ...validPayload,
          membership_type: tier,
        }).success
      ).toBe(true)
    }
  })
})
