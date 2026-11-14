import type { Metadata } from 'next'
import { CONTACT } from '@/lib/contact'
import { LOCATIONS, type GymLocation, type LocationHours } from '@/lib/locations'

export const SITE_NAME = 'Paradise Gym'
export const SITE_ORIGIN = 'https://www.paradisegymofficial.com'

/** Real Harlingen floor photo. Portrait JPEG served from its existing path. */
export const OG_IMAGE_PATH = '/images/gallery/gym-floor.png'
export const OG_IMAGE_ALT = 'Paradise Gym weight floor in Harlingen'

export const INDEXABLE_PATHS = ['/', '/mcallen', '/gallery'] as const

const SCHEMA_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

const DAY_INDEX: Record<string, number> = {
  mon: 0,
  monday: 0,
  tue: 1,
  tuesday: 1,
  wed: 2,
  wednesday: 2,
  thu: 3,
  thursday: 3,
  fri: 4,
  friday: 4,
  sat: 5,
  saturday: 5,
  sun: 6,
  sunday: 6,
}

type PostalAddress = {
  '@type': 'PostalAddress'
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  addressCountry: 'US'
}

type OpeningHoursSpecification = {
  '@type': 'OpeningHoursSpecification'
  dayOfWeek: string[]
  opens: string
  closes: string
}

export type HealthClubJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'HealthClub'
  name: string
  url: string
  telephone: string
  image?: string
  address: PostalAddress
  sameAs: string[]
  openingHoursSpecification?: OpeningHoursSpecification[]
}

export function absoluteUrl(path: string): string {
  const url = new URL(path, SITE_ORIGIN)
  if (url.pathname === '/' && url.search === '' && url.hash === '') {
    return SITE_ORIGIN
  }
  return url.href
}

function parseAddress(address: string): PostalAddress {
  const match = address.match(/^(.+),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5})$/)
  if (!match) {
    throw new Error(`Unrecognized gym address: ${address}`)
  }

  return {
    '@type': 'PostalAddress',
    streetAddress: match[1],
    addressLocality: match[2],
    addressRegion: match[3],
    postalCode: match[4],
    addressCountry: 'US',
  }
}

function expandDays(days: string): string[] {
  const parts = days
    .split(/\s*[–—-]\s*/)
    .map((part) => part.trim())
    .filter(Boolean)

  const indexes = parts.map((part) => {
    const index = DAY_INDEX[part.toLowerCase()]
    if (index === undefined) {
      throw new Error(`Unrecognized hours day label: ${days}`)
    }
    return index
  })

  if (indexes.length === 1) {
    return [SCHEMA_DAYS[indexes[0]]]
  }

  if (indexes.length === 2 && indexes[0] <= indexes[1]) {
    return SCHEMA_DAYS.slice(indexes[0], indexes[1] + 1)
  }

  throw new Error(`Unrecognized hours day label: ${days}`)
}

function to24Hour(label: string): string {
  const trimmed = label.trim()
  if (/^midnight$/i.test(trimmed)) return '00:00'

  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i)
  if (!match) {
    throw new Error(`Unrecognized hours time: ${label}`)
  }

  let hour = Number(match[1])
  const minute = Number(match[2] ?? '0')
  const period = match[3].toLowerCase()

  if (hour < 1 || hour > 12 || minute > 59) {
    throw new Error(`Unrecognized hours time: ${label}`)
  }

  if (period === 'am') {
    if (hour === 12) hour = 0
  } else if (hour !== 12) {
    hour += 12
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function toOpeningHours(
  hours: readonly LocationHours[]
): OpeningHoursSpecification[] {
  return hours.map((row) => {
    const parts = row.time
      .split(/\s*[–—-]\s*/)
      .map((part) => part.trim())
      .filter(Boolean)

    if (parts.length !== 2) {
      throw new Error(`Unrecognized hours range: ${row.time}`)
    }

    const [opensLabel, closesLabel] = parts

    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: expandDays(row.days),
      opens: to24Hour(opensLabel),
      closes: to24Hour(closesLabel),
    }
  })
}

/**
 * HealthClub for one location. Hours come only from that location's posted
 * `hours`. McAllen is omitted while `hours` is null. sameAs is the Instagram
 * and TikTok profiles already in CONTACT — there is no Google Business URL
 * on the site yet. No ratings, reviews, or coordinates.
 */
export function healthClubJsonLd(location: GymLocation): HealthClubJsonLd {
  const data: HealthClubJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    name: `${SITE_NAME} ${location.name}`,
    url: absoluteUrl(location.href),
    telephone: CONTACT.phone,
    address: parseAddress(location.address),
    sameAs: [CONTACT.instagram, CONTACT.tiktok],
  }

  if (location.id === 'harlingen') {
    data.image = absoluteUrl(OG_IMAGE_PATH)
  }

  if (location.hours && location.hours.length > 0) {
    data.openingHoursSpecification = toOpeningHours(location.hours)
  }

  return data
}

export function jsonLdScriptContent(data: HealthClubJsonLd): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c')
}

type PageCopy = {
  title: string
  description: string
  path: string
}

function formatPostedHours(hours: readonly LocationHours[]): string {
  return hours.map((row) => `${row.days} ${row.time}`).join('; ')
}

export function harlingenPageCopy(): PageCopy {
  const location = LOCATIONS.harlingen
  const hours = location.hours ? formatPostedHours(location.hours) : ''

  return {
    title: `${SITE_NAME} ${location.name}`,
    description: `${SITE_NAME} at ${location.address}. Hours: ${hours}. Phone ${CONTACT.phone}.`,
    path: location.href,
  }
}

export function mcallenPageCopy(): PageCopy {
  const location = LOCATIONS.mcallen
  const opening = location.grandOpeningNote

  return {
    title: `${SITE_NAME} ${location.name}`,
    description: opening
      ? `${SITE_NAME} at ${location.address}. ${opening}.`
      : `${SITE_NAME} at ${location.address}.`,
    path: location.href,
  }
}

export function galleryPageCopy(): PageCopy {
  return {
    title: `${SITE_NAME} Gallery`,
    description: `Photos of the ${SITE_NAME} floor in ${LOCATIONS.harlingen.name}, Texas.`,
    path: '/gallery',
  }
}

function pageMetadata(copy: PageCopy): Metadata {
  const url = absoluteUrl(copy.path)
  const imageUrl = absoluteUrl(OG_IMAGE_PATH)

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
      images: [{ url: imageUrl, alt: OG_IMAGE_ALT }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [imageUrl],
    },
  }
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  ...pageMetadata(harlingenPageCopy()),
}

export const mcallenMetadata: Metadata = pageMetadata(mcallenPageCopy())

export const galleryMetadata: Metadata = pageMetadata(galleryPageCopy())

export function sitemapEntries(): { url: string }[] {
  return INDEXABLE_PATHS.map((path) => ({ url: absoluteUrl(path) }))
}

export function robotsConfig(): {
  rules: { userAgent: string; allow: string }
  sitemap: string
} {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
