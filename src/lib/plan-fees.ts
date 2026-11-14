import type { LocationId } from '@/lib/locations'
import type { MembershipType } from '@/lib/membership-options'

/**
 * Figures from the ABC Fitness checkout summary (the profile step) on
 * 14 Nov 2026. Harlingen club 32265, McAllen club 32367.
 * No personal information was entered and nothing was submitted.
 *
 * Only amounts printed on that summary are stored. Plan-card copy that
 * does not appear on the summary is not shown.
 */
export type PlanFeeDisclosure = {
  dueToday: string | null
  maintenanceFee: string | null
  upcomingFees: string | null
}

export const PLAN_FEES: Record<
  LocationId,
  Partial<Record<MembershipType, PlanFeeDisclosure>>
> = {
  harlingen: {
    // TODO(owner): The Harlingen 12-month and month-to-month plan cards list
    // a $30.00 enrollment fee, but the checkout summary does not itemize
    // enrollment. Omitted until that amount appears on the checkout totals.
    '12_month_contract': {
      dueToday: '$75.76',
      maintenanceFee: '$43.29',
      upcomingFees: null,
    },
    month_to_month: {
      dueToday: '$86.59',
      maintenanceFee: '$43.29',
      upcomingFees: null,
    },
    '1_year_paid_in_full': {
      dueToday: '$541.24',
      maintenanceFee: null,
      upcomingFees: '$0.00',
    },
    one_month: {
      dueToday: '$97.41',
      maintenanceFee: null,
      upcomingFees: '$0.00',
    },
    week_pass: {
      dueToday: '$54.11',
      maintenanceFee: null,
      upcomingFees: '$0.00',
    },
    // TODO(owner): Day Pass ($17.99) was not in the Harlingen club 32265
    // plan list on 14 Nov 2026, so checkout had no due-today, maintenance,
    // or upcoming-fee figures to show.
    day_pass: {
      dueToday: null,
      maintenanceFee: null,
      upcomingFees: null,
    },
  },
  mcallen: {
    '1_year_paid_in_full': {
      dueToday: '$541.24',
      maintenanceFee: null,
      upcomingFees: '$0.00',
    },
    '12_month_contract': {
      dueToday: '$43.29',
      maintenanceFee: '$43.29',
      upcomingFees: null,
    },
    month_to_month: {
      dueToday: '$54.11',
      maintenanceFee: '$43.29',
      upcomingFees: null,
    },
  },
}

/** Off unless NEXT_PUBLIC_SHOW_FEE_DISCLOSURE=true. Fee numbers must not render otherwise. */
export function feeDisclosureEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_FEE_DISCLOSURE === 'true'
}

/**
 * Due-today amounts re-read from the ABC profile summary on 14 Nov 2026.
 * Other plans stay behind the disclosure flag.
 */
const PUBLIC_DUE_TODAY: Record<LocationId, readonly MembershipType[]> = {
  harlingen: ['12_month_contract'],
  mcallen: ['12_month_contract'],
}

export function publicDueTodayLabel(
  location: LocationId,
  slug: MembershipType
): string | null {
  if (!PUBLIC_DUE_TODAY[location].includes(slug)) return null
  const amount = PLAN_FEES[location][slug]?.dueToday
  return amount ? `Amount due today ${amount}` : null
}

export function planFeeSummary(
  location: LocationId,
  slug: MembershipType
): string | null {
  const fees = PLAN_FEES[location][slug]
  if (!fees) return null

  const parts: string[] = []
  if (fees.dueToday) parts.push(`Due today ${fees.dueToday}`)
  if (fees.maintenanceFee) parts.push(`Maintenance fee ${fees.maintenanceFee}`)
  if (fees.upcomingFees) parts.push(`Upcoming fees ${fees.upcomingFees}`)

  return parts.length > 0 ? parts.join(' · ') : null
}
