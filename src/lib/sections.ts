export const SECTION_IDS = {
  amenities: 'amenities',
  pricing: 'pricing',
  reviews: 'reviews',
  hours: 'hours',
  tour: 'tour',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]

export const NAV_LINKS = [
  { label: 'Amenities', href: `#${SECTION_IDS.amenities}` },
  { label: 'Pricing', href: `#${SECTION_IDS.pricing}` },
  { label: 'Reviews', href: `#${SECTION_IDS.reviews}` },
  { label: 'Hours', href: `#${SECTION_IDS.hours}` },
] as const
