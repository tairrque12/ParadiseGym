import { describe, it, expect } from 'vitest'
import {
  DEFAULT_LOCATION_ID,
  HARLINGEN_JOIN_URL,
  LOCATIONS,
  LOCATION_IDS,
  LOCATION_LIST,
  MCALLEN_JOIN_URL,
  isJoinLinkReady,
  isLocationId,
  getLocation,
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

  it('defaults to the open Harlingen location', () => {
    expect(DEFAULT_LOCATION_ID).toBe('harlingen')
    expect(getLocation(DEFAULT_LOCATION_ID).status).toBe('open')
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
    })
    expect(harlingen.membershipOptions).toEqual(MEMBERSHIP_OPTIONS)
    expect(harlingen.membershipOptions).toHaveLength(6)
    expect(harlingen.hours).toEqual([
      { days: 'Mon – Fri', time: '5am – Midnight' },
      { days: 'Saturday', time: '8am – 8pm' },
      { days: 'Sunday', time: '9am – 5pm' },
    ])
  })

  it('describes McAllen as a pre-sale location with no hours yet', () => {
    const mcallen = LOCATIONS.mcallen

    expect(mcallen).toMatchObject({
      id: 'mcallen',
      name: 'McAllen',
      status: 'presale',
      address: '1001 N. Jackson Road, McAllen, TX 78501',
      sqft: 20000,
      hours: null,
      joinLink: MCALLEN_JOIN_URL,
    })
    expect(mcallen.openingTimeframe).toBeTruthy()
    expect(mcallen.openingTarget).toBeTruthy()
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

  it('treats the McAllen join link as not ready until it is a real URL', () => {
    expect(isJoinLinkReady(HARLINGEN_JOIN_URL)).toBe(true)
    expect(isJoinLinkReady(MCALLEN_JOIN_URL)).toBe(false)
    expect(isJoinLinkReady('https://onlinejoin.abcfitness.com/signup/plan?club=1')).toBe(
      true
    )
  })

  it('validates location ids', () => {
    expect(isLocationId('harlingen')).toBe(true)
    expect(isLocationId('mcallen')).toBe(true)
    expect(isLocationId('brownsville')).toBe(false)
  })
})
