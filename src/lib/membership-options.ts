export const MEMBERSHIP_TYPES = [
  '12_month_contract',
  'month_to_month',
  '1_year_paid_in_full',
  '6_months_paid_in_full',
  'one_month',
  'week_pass',
  'day_pass',
] as const

export type MembershipType = (typeof MEMBERSHIP_TYPES)[number]

export type MembershipCategory = 'recurring' | 'single_payment'

export type MembershipOption = {
  slug: MembershipType
  name: string
  price: string
  priceNote?: string
  subLabel?: string
  category: MembershipCategory
}

export const MEMBERSHIP_OPTIONS: MembershipOption[] = [
  {
    slug: '12_month_contract',
    name: '12 Month Contract',
    price: '$39.99/mo',
    priceNote: '+ tax',
    category: 'recurring',
  },
  {
    slug: 'month_to_month',
    name: 'Month to Month',
    price: '$49.99/mo',
    priceNote: '+ tax',
    subLabel: 'No contract',
    category: 'recurring',
  },
  {
    slug: '1_year_paid_in_full',
    name: '1 Year Paid in Full',
    price: '$430',
    category: 'single_payment',
  },
  {
    slug: '6_months_paid_in_full',
    name: '6 Months Paid in Full',
    price: '$325.44',
    category: 'single_payment',
  },
  {
    slug: 'one_month',
    name: 'One Month',
    price: '$89.99',
    priceNote: '+ tax',
    category: 'single_payment',
  },
  {
    slug: 'week_pass',
    name: 'Week Pass',
    price: '$44.99',
    priceNote: '+ tax',
    category: 'single_payment',
  },
  {
    slug: 'day_pass',
    name: 'Day Pass',
    price: '$17.99',
    priceNote: '+ tax',
    category: 'single_payment',
  },
]

export const RECURRING_MEMBERSHIP_OPTIONS = MEMBERSHIP_OPTIONS.filter(
  (option) => option.category === 'recurring'
)

export const SINGLE_PAYMENT_MEMBERSHIP_OPTIONS = MEMBERSHIP_OPTIONS.filter(
  (option) => option.category === 'single_payment'
)

const MEMBERSHIP_OPTION_BY_SLUG = Object.fromEntries(
  MEMBERSHIP_OPTIONS.map((option) => [option.slug, option])
) as Record<MembershipType, MembershipOption>

export function getMembershipOption(
  slug: string
): MembershipOption | undefined {
  return MEMBERSHIP_OPTION_BY_SLUG[slug as MembershipType]
}

export function getMembershipTypeLabel(slug: string): string {
  return getMembershipOption(slug)?.name ?? slug.replaceAll('_', ' ')
}

export function getMembershipSelectLabel(slug: MembershipType): string {
  const option = MEMBERSHIP_OPTION_BY_SLUG[slug]
  if (!option) return slug

  const priceSuffix = option.priceNote
    ? ` — ${option.price} ${option.priceNote}`
    : ` — ${option.price}`

  return `${option.name}${priceSuffix}`
}

export const PRICING_DISCOUNT_NOTE =
  'Teachers, veterans, and first responders receive discounts on recurring memberships.'

export const PRICING_FOOTER_NOTE =
  'Please see front desk for current enrollment details.'
