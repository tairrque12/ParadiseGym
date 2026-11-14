export const CONTACT = {
  phone: '956-990-5277',
  phoneHref: 'tel:+19569905277',
  address: '6201 FM 106 UNIT 16A, Harlingen, TX 78550',
  instagram: 'https://www.instagram.com/paradisegymrgv',
  tiktok: 'https://www.tiktok.com/@theparadisegymrgv',
} as const

export const HOURS = [
  { days: 'Mon – Fri', time: '5am – Midnight' },
  { days: 'Saturday', time: '8am – 8pm' },
  { days: 'Sunday', time: '9am – 5pm' },
] as const

export function openTodayLabel(now = new Date()): string {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
  }).format(now)

  const row = weekday === 'Sat' ? HOURS[1] : weekday === 'Sun' ? HOURS[2] : HOURS[0]
  return `Open today ${row.time}`
}

export const GYM_STATS = [
  { type: 'count' as const, value: 7500, suffix: '', label: 'SQ FT' },
  { type: 'count' as const, value: 70, suffix: '+', label: 'Custom Machines' },
  { type: 'text' as const, value: 'Custom-Built Equipment', label: 'Built In-House' },
] as const
