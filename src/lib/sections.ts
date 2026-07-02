export const SECTION_IDS = {
  amenities: 'amenities',
  gallery: 'gallery',
  pricing: 'pricing',
  reviews: 'reviews',
  hours: 'hours',
  tour: 'tour',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]

export const NAV_LINKS = [
  { label: 'Amenities', href: `#${SECTION_IDS.amenities}` },
  { label: 'Gallery', href: `#${SECTION_IDS.gallery}` },
  { label: 'Pricing', href: `#${SECTION_IDS.pricing}` },
  { label: 'Reviews', href: `#${SECTION_IDS.reviews}` },
  { label: 'Hours', href: `#${SECTION_IDS.hours}` },
] as const

export const ADMIN_LOGIN_PATH = '/admin/login' as const
