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
    ctaLabel: 'Request Membership',
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
    ctaLabel: 'Lock In Founding Member Pricing',
    membershipOptions: optionsForSlugs([
      '1_year_paid_in_full',
      '12_month_contract',
      'month_to_month',
    ]),
    presaleNote:
      'Founding member pricing available now — location opening soon.',
    grandOpeningNote: 'Official Grand Opening Date — Coming Soon',
  },
}

export const LOCATION_LIST: readonly GymLocation[] = LOCATION_IDS.map(
  (id) => LOCATIONS[id]
)

