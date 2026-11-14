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
  href: string
  address: string
  sqft: number
  hours: readonly LocationHours[] | null
  joinLink: string
  ctaLabel: string
  membershipOptions: readonly MembershipOption[]
  presaleNote?: string
  grandOpeningNote?: string
}

export const HARLINGEN_JOIN_URL =
  'https://onlinejoin.abcfitness.com/signup/plan?club=32265'

export const MCALLEN_JOIN_URL =
  'https://onlinejoin.abcfitness.com/signup/plan?club=32367'

export const JOIN_NOW_LABEL = 'Join now'

export const TOUR_FALLBACK_LABEL = 'Not ready? Book a free tour'

export const ABC_CHECKOUT_NOTE =
  'Opens ABC Fitness secure checkout in a new tab.'

/** ABC kept these query params from the plan step through the profile step on 14 Nov 2026. */
export function joinUrl(locationId: LocationId, campaign: string): string {
  const base = locationId === 'mcallen' ? MCALLEN_JOIN_URL : HARLINGEN_JOIN_URL
  const url = new URL(base)
  url.searchParams.set('utm_source', 'website')
  url.searchParams.set('utm_medium', 'cta')
  url.searchParams.set('utm_campaign', `${locationId}-${campaign}`)
  return url.toString()
}

export const MCALLEN_PATH = '/mcallen'

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
    href: '/',
    address: CONTACT.address,
    sqft: 7500,
    hours: HOURS,
    joinLink: HARLINGEN_JOIN_URL,
    ctaLabel: JOIN_NOW_LABEL,
    membershipOptions: MEMBERSHIP_OPTIONS,
  },
  mcallen: {
    id: 'mcallen',
    name: 'McAllen',
    status: 'presale',
    href: MCALLEN_PATH,
    address: '1001 N. Jackson Road, McAllen, TX 78501',
    sqft: 20000,
    hours: null,
    joinLink: MCALLEN_JOIN_URL,
    ctaLabel: 'Join founding membership',
    membershipOptions: optionsForSlugs([
      '1_year_paid_in_full',
      '12_month_contract',
      'month_to_month',
    ]),
    presaleNote:
      'Founding member pricing available now — grand opening Nov 28.',
    grandOpeningNote: 'Official Grand Opening: Nov 28',
  },
}

export const LOCATION_LIST: readonly GymLocation[] = LOCATION_IDS.map(
  (id) => LOCATIONS[id]
)

