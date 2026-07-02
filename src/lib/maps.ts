export const GYM_ADDRESS = '6201 FM 106 UNIT 16A, Harlingen, TX 78550'

export type MapsPlatform = 'ios' | 'android' | 'desktop'

export function getMapsUrl(address: string, platform: MapsPlatform): string {
  const encoded = encodeURIComponent(address)
  if (platform === 'ios') {
    return `maps://maps.apple.com/?q=${encoded}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`
}

export function detectMapsPlatform(userAgent: string): MapsPlatform {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios'
  if (/Android/i.test(userAgent)) return 'android'
  return 'desktop'
}
