import { CONTACT, HOURS } from '@/lib/contact'
import {
  MEMBERSHIP_OPTIONS,
  type MembershipOption,
  type MembershipType,
} from '@/lib/membership-options'

export const LOCATION_IDS = ['harlingen', 'mcallen'] as const

export type LocationId = (typeof LOCATION_IDS)[number]

export type LocationStatus = 'open' | 'presale'

export type LocationHours = {
  days: string
  time: string
}

export type GymLocation = {
  id: LocationId
  name: string
  status: LocationStatus
  address: string
  sqft: number
  hours: readonly LocationHours[] | null
  joinLink: string
  ctaLabel: string
  membershipOptions: readonly MembershipOption[]
  openingTimeframe?: string
  openingTarget?: string
  presaleNote?: string
}

export const HARLINGEN_JOIN_URL =
  'https://onlinejoin.abcfitness.com/signup/plan?club=32265'

// Swap for the real McAllen signup URL once ABC Fitness issues the club id.
export const MCALLEN_JOIN_URL = 'PLACEHOLDER_MCALLEN_LINK'

export const MCALLEN_OPENING_TARGET = '2026-11-26T09:00:00-06:00'

function optionsForSlugs(
  slugs: readonly MembershipType[]
): readonly MembershipOption[] {
  return slugs.map((slug) => {
    const option = MEMBERSHIP_OPTIONS.find((entry) => entry.slug === slug)
    if (!option) {
      throw new Error(`Unknown membership option slug: ${slug}`)
    }
    return option
  })
}

export const LOCATIONS: Record<LocationId, GymLocation> = {
  harlingen: {
    id: 'harlingen',
    name: 'Harlingen',
    status: 'open',
    address: CONTACT.address,
    sqft: 7500,
    hours: HOURS,
    joinLink: HARLINGEN_JOIN_URL,
    ctaLabel: 'Request Membership',
    membershipOptions: MEMBERSHIP_OPTIONS,
  },
  mcallen: {
    id: 'mcallen',
    name: 'McAllen',
    status: 'presale',
    address: '1001 N. Jackson Road, McAllen, TX 78501',
    sqft: 20000,
    hours: null,
    joinLink: MCALLEN_JOIN_URL,
    ctaLabel: 'Lock In Founding Member Pricing',
    membershipOptions: optionsForSlugs([
      '1_year_paid_in_full',
      '12_month_contract',
      'month_to_month',
    ]),
    openingTimeframe: 'Late 2026',
    openingTarget: MCALLEN_OPENING_TARGET,
    presaleNote:
      'Founding member pricing available now — location opening soon.',
  },
}

export const LOCATION_LIST: readonly GymLocation[] = LOCATION_IDS.map(
  (id) => LOCATIONS[id]
)

export const DEFAULT_LOCATION_ID: LocationId = 'harlingen'

export function isLocationId(value: string): value is LocationId {
  return (LOCATION_IDS as readonly string[]).includes(value)
}

export function getLocation(id: LocationId): GymLocation {
  return LOCATIONS[id]
}

export function isJoinLinkReady(joinLink: string): boolean {
  return joinLink.startsWith('https://')
}
