export const US_PHONE_REGEX =
  /^(\+1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/

export function isValidUsPhone(phone: string): boolean {
  return US_PHONE_REGEX.test(phone.trim())
}

export function isFutureDate(dateString: string, now = new Date()): boolean {
  const parsed = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return false

  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  return parsed >= today
}
