import { describe, expect, it } from 'vitest'
import { MEMBERSHIP_OPTIONS } from '@/lib/membership-options'
import { planFeeSummary } from '@/lib/plan-fees'

describe('plan fee disclosure', () => {
  it('does not repeat the published plan price inside the checkout line', () => {
    for (const option of MEMBERSHIP_OPTIONS) {
      const summary = planFeeSummary('harlingen', option.slug) ?? ''
      expect(summary).not.toContain(option.price)
    }
  })

  it('uses the Harlingen 12-month checkout summary', () => {
    expect(planFeeSummary('harlingen', '12_month_contract')).toBe(
      'Due today $75.76 · Maintenance fee $43.29'
    )
  })

  it('uses checkout due-today and upcoming fees for Harlingen paid-in-full plans', () => {
    expect(planFeeSummary('harlingen', 'week_pass')).toBe(
      'Due today $54.11 · Upcoming fees $0.00'
    )
    expect(planFeeSummary('harlingen', 'one_month')).toBe(
      'Due today $97.41 · Upcoming fees $0.00'
    )
    expect(planFeeSummary('harlingen', '1_year_paid_in_full')).toBe(
      'Due today $541.24 · Upcoming fees $0.00'
    )
  })

  it('renders nothing for the Harlingen day pass until ABC lists it', () => {
    expect(planFeeSummary('harlingen', 'day_pass')).toBeNull()
  })

  it('uses the McAllen checkout summary and does not invent an enrollment fee', () => {
    expect(planFeeSummary('mcallen', '12_month_contract')).toBe(
      'Due today $43.29 · Maintenance fee $43.29'
    )
    expect(planFeeSummary('mcallen', 'month_to_month')).toBe(
      'Due today $54.11 · Maintenance fee $43.29'
    )
    expect(planFeeSummary('mcallen', '1_year_paid_in_full')).toBe(
      'Due today $541.24 · Upcoming fees $0.00'
    )
    expect(planFeeSummary('mcallen', '12_month_contract')).not.toMatch(/enrollment/i)
    expect(planFeeSummary('mcallen', 'day_pass')).toBeNull()
  })
})
