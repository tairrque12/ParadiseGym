import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import { CONTACT } from '@/lib/contact'
import { LOCATIONS } from '@/lib/locations'
import {
  INDEXABLE_PATHS,
  OG_IMAGE_ALT,
  OG_IMAGE_PATH,
  SITE_ORIGIN,
  absoluteUrl,
  galleryMetadata,
  galleryPageCopy,
  harlingenPageCopy,
  healthClubJsonLd,
  jsonLdScriptContent,
  mcallenMetadata,
  mcallenPageCopy,
  rootMetadata,
} from '@/lib/seo'

const FORBIDDEN_KEYS = [
  'aggregateRating',
  'review',
  'reviews',
  'geo',
  'latitude',
  'longitude',
  'ratingValue',
  'reviewCount',
  'priceRange',
]

const UNCONFIRMED_CLAIMS = [
  'open gym',
  'custom-built',
  'custom built',
  'built in-house',
  'founding',
]

function keysDeep(value: unknown, found: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) keysDeep(item, found)
    return found
  }

  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      found.push(key)
      keysDeep(child, found)
    }
  }

  return found
}

function metadataText(metadata: {
  title?: unknown
  description?: unknown
}): string {
  return `${String(metadata.title ?? '')}\n${String(metadata.description ?? '')}`
}

describe('sitemap and robots', () => {
  it('lists the three public pages on the production origin', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      'https://www.paradisegymofficial.com',
      'https://www.paradisegymofficial.com/mcallen',
      'https://www.paradisegymofficial.com/gallery',
    ])
    expect(INDEXABLE_PATHS).toEqual(['/', '/mcallen', '/gallery'])
  })

  it('allows crawling and points at the sitemap', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://www.paradisegymofficial.com/sitemap.xml',
    })
  })
})

describe('page metadata', () => {
  const pages = [
    { name: 'home', metadata: rootMetadata, copy: harlingenPageCopy() },
    { name: 'mcallen', metadata: mcallenMetadata, copy: mcallenPageCopy() },
    { name: 'gallery', metadata: galleryMetadata, copy: galleryPageCopy() },
  ]

  it('gives each page its own factual title, description, and canonical', () => {
    expect(rootMetadata.metadataBase).toEqual(new URL(SITE_ORIGIN))

    const titles = pages.map((page) => page.metadata.title)
    expect(new Set(titles).size).toBe(titles.length)

    expect(titles).toEqual([
      'Paradise Gym Harlingen',
      'Paradise Gym McAllen',
      'Paradise Gym Gallery',
    ])

    for (const page of pages) {
      expect(page.metadata.description).toBe(page.copy.description)
      expect(page.metadata.alternates?.canonical).toBe(absoluteUrl(page.copy.path))
      expect(page.metadata.openGraph).toMatchObject({
        title: page.copy.title,
        description: page.copy.description,
        url: absoluteUrl(page.copy.path),
        siteName: 'Paradise Gym',
        type: 'website',
        images: [
          {
            url: 'https://www.paradisegymofficial.com/images/gallery/gym-floor.png',
            alt: OG_IMAGE_ALT,
          },
        ],
      })
      expect(page.metadata.twitter).toMatchObject({
        card: 'summary_large_image',
        title: page.copy.title,
        description: page.copy.description,
        images: [
          'https://www.paradisegymofficial.com/images/gallery/gym-floor.png',
        ],
      })
      expect(metadataText(page.metadata).toLowerCase()).not.toContain('open gym')
      for (const claim of UNCONFIRMED_CLAIMS) {
        expect(metadataText(page.metadata).toLowerCase()).not.toContain(claim)
      }
    }
  })

  it('uses an existing gym-floor photo for the share image', () => {
    expect(OG_IMAGE_PATH).toBe('/images/gallery/gym-floor.png')
    expect(
      existsSync(path.join(process.cwd(), 'public', OG_IMAGE_PATH))
    ).toBe(true)
  })

  it('describes Harlingen with the posted address, hours, and phone', () => {
    expect(harlingenPageCopy().description).toBe(
      'Paradise Gym at 6201 FM 106 UNIT 16A, Harlingen, TX 78550. Hours: Mon – Fri 5am – Midnight; Saturday 8am – 8pm; Sunday 9am – 5pm. Phone 956-990-5277.'
    )
  })

  it('describes McAllen with the Nov 28 opening and without hours', () => {
    expect(mcallenPageCopy().description).toBe(
      'Paradise Gym at 1001 N. Jackson Road, McAllen, TX 78501. Opens Nov 28.'
    )
    expect(mcallenMetadata.openGraph?.description).toBe(mcallenPageCopy().description)
    expect(mcallenPageCopy().description).not.toMatch(/5am|midnight|sq ft|shower/i)
  })
})

describe('HealthClub JSON-LD', () => {
  it('describes the Harlingen club from the posted contact data', () => {
    const data = healthClubJsonLd(LOCATIONS.harlingen)

    expect(data).toEqual({
      '@context': 'https://schema.org',
      '@type': 'HealthClub',
      name: 'Paradise Gym Harlingen',
      url: 'https://www.paradisegymofficial.com',
      telephone: CONTACT.phone,
      image: 'https://www.paradisegymofficial.com/images/gallery/gym-floor.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '6201 FM 106 UNIT 16A',
        addressLocality: 'Harlingen',
        addressRegion: 'TX',
        postalCode: '78550',
        addressCountry: 'US',
      },
      sameAs: [CONTACT.instagram, CONTACT.tiktok],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
          ],
          opens: '05:00',
          closes: '00:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '08:00',
          closes: '20:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Sunday'],
          opens: '09:00',
          closes: '17:00',
        },
      ],
    })
  })

  it('describes McAllen without hours, a photo of the other gym, or ratings', () => {
    expect(LOCATIONS.mcallen.hours).toBeNull()

    const data = healthClubJsonLd(LOCATIONS.mcallen)

    expect(data).toEqual({
      '@context': 'https://schema.org',
      '@type': 'HealthClub',
      name: 'Paradise Gym McAllen',
      url: 'https://www.paradisegymofficial.com/mcallen',
      telephone: CONTACT.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1001 N. Jackson Road',
        addressLocality: 'McAllen',
        addressRegion: 'TX',
        postalCode: '78501',
        addressCountry: 'US',
      },
      sameAs: [CONTACT.instagram, CONTACT.tiktok],
    })
    expect(data).not.toHaveProperty('openingHoursSpecification')
    expect(data).not.toHaveProperty('image')
    expect(JSON.stringify(data)).not.toMatch(/coming soon|grand opening/i)
  })

  it('does not emit ratings, reviews, coordinates, or a Google profile', () => {
    for (const location of [LOCATIONS.harlingen, LOCATIONS.mcallen]) {
      const data = healthClubJsonLd(location)
      const keys = keysDeep(data)

      for (const forbidden of FORBIDDEN_KEYS) {
        expect(keys).not.toContain(forbidden)
      }

      expect(data.sameAs).toEqual([
        'https://www.instagram.com/paradisegymrgv',
        'https://www.tiktok.com/@theparadisegymrgv',
      ])
      expect(data.sameAs.join(' ')).not.toMatch(/google|maps|yelp|facebook/i)
      expect(JSON.stringify(data).toLowerCase()).not.toContain('custom-built')
      expect(JSON.stringify(data).toLowerCase()).not.toContain('open gym')
    }
  })

  it('refuses to invent hours or an address it cannot read', () => {
    expect(() =>
      healthClubJsonLd({
        ...LOCATIONS.harlingen,
        hours: [{ days: 'Funday', time: '5am – Midnight' }],
      })
    ).toThrow(/Funday/)

    expect(() =>
      healthClubJsonLd({
        ...LOCATIONS.mcallen,
        address: 'somewhere in McAllen',
      })
    ).toThrow(/address/i)
  })

  it('escapes angle brackets in the script payload', () => {
    const content = jsonLdScriptContent({
      ...healthClubJsonLd(LOCATIONS.harlingen),
      name: 'Paradise Gym <Harlingen>',
    })

    expect(content).toContain('\\u003c')
    expect(content).not.toContain('<')
    expect(JSON.parse(content).name).toBe('Paradise Gym <Harlingen>')
  })
})
