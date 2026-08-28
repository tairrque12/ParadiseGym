import { describe, it, expect } from 'vitest'
import {
  HARLINGEN_JOIN_URL,
  LOCATIONS,
  LOCATION_IDS,
  LOCATION_LIST,
  MCALLEN_JOIN_URL,
  MCALLEN_PATH,
} from '@/lib/locations'
import { MEMBERSHIP_OPTIONS } from '@/lib/membership-options'

describe('locations data', () => {
  it('exposes Harlingen and McAllen in display order', () => {
    expect(LOCATION_IDS).toEqual(['harlingen', 'mcallen'])
    expect(LOCATION_LIST.map((location) => location.name)).toEqual([
      'Harlingen',
      'McAllen',
    ])
  })

  it('gives each location its own page route', () => {
    expect(LOCATIONS.harlingen.href).toBe('/')
    expect(LOCATIONS.mcallen.href).toBe(MCALLEN_PATH)
    expect(MCALLEN_PATH).toBe('/mcallen')
  })

  it('keeps Harlingen as the live source of truth', () => {
    const harlingen = LOCATIONS.harlingen

    expect(harlingen).toMatchObject({
      id: 'harlingen',
      name: 'Harlingen',
      status: 'open',
      address: '6201 FM 106 UNIT 16A, Harlingen, TX 78550',
      sqft: 7500,
      joinLink: HARLINGEN_JOIN_URL,
      ctaLabel: 'Request Membership',
    })
    expect(harlingen.membershipOptions).toEqual(MEMBERSHIP_OPTIONS)
    expect(harlingen.membershipOptions).toHaveLength(6)
    expect(harlingen.hours).toEqual([
      { days: 'Mon – Fri', time: '5am – Midnight' },
      { days: 'Saturday', time: '8am – 8pm' },
      { days: 'Sunday', time: '9am – 5pm' },
    ])
    expect(harlingen.grandOpeningNote).toBeUndefined()
  })

  it('describes McAllen as a pre-sale location with no hours or opening date yet', () => {
    const mcallen = LOCATIONS.mcallen

    expect(mcallen).toMatchObject({
      id: 'mcallen',
      name: 'McAllen',
      status: 'presale',
      address: '1001 N. Jackson Road, McAllen, TX 78501',
      sqft: 20000,
      hours: null,
      joinLink: 'https://onlinejoin.abcfitness.com/signup/plan?club=32367',
      ctaLabel: 'Lock In Founding Member Pricing',
      grandOpeningNote: 'Official Grand Opening Date — Coming Soon',
    })
    expect(mcallen.presaleNote).toMatch(/founding member pricing/i)
  })

  it('offers only the three McAllen pre-sale membership options', () => {
    expect(
      LOCATIONS.mcallen.membershipOptions.map((option) => [
        option.slug,
        option.name,
        option.price,
        option.priceNote,
      ])
    ).toEqual([
      ['1_year_paid_in_full', '1 Year Paid in Full', '$499.99', '+ tax'],
      ['12_month_contract', '12 Month Contract', '$39.99/mo', '+ tax'],
      ['month_to_month', 'Month to Month', '$49.99/mo', '+ tax'],
    ])
  })

  it('points each location at its own live ABC Fitness club signup', () => {
    expect(HARLINGEN_JOIN_URL).toBe(
      'https://onlinejoin.abcfitness.com/signup/plan?club=32265'
    )
    expect(MCALLEN_JOIN_URL).toBe(
      'https://onlinejoin.abcfitness.com/signup/plan?club=32367'
    )
    expect(MCALLEN_JOIN_URL).not.toBe(HARLINGEN_JOIN_URL)

    for (const location of LOCATION_LIST) {
      expect(location.joinLink).toMatch(
        /^https:\/\/onlinejoin\.abcfitness\.com\//
      )
      expect(location.joinLink).not.toMatch(/placeholder/i)
    }
  })
})
