import { describe, it, expect } from 'vitest'
import {
  MEMBERSHIP_TYPES,
  getMembershipSelectLabel,
  getMembershipTypeLabel,
} from '@/lib/membership-options'

describe('membership options', () => {
  it('exposes all real membership type slugs', () => {
    expect(MEMBERSHIP_TYPES).toEqual([
      '12_month_contract',
      'month_to_month',
      '1_year_paid_in_full',
      '6_months_paid_in_full',
      'one_month',
      'week_pass',
      'day_pass',
    ])
  })

  it('maps slugs to readable labels', () => {
    expect(getMembershipTypeLabel('12_month_contract')).toBe('12 Month Contract')
    expect(getMembershipTypeLabel('week_pass')).toBe('Week Pass')
  })

  it('builds select labels with pricing details', () => {
    expect(getMembershipSelectLabel('12_month_contract')).toBe(
      '12 Month Contract — $39.99/mo + tax'
    )
    expect(getMembershipSelectLabel('1_year_paid_in_full')).toBe(
      '1 Year Paid in Full — $430'
    )
  })
})
