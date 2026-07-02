import { describe, it, expect } from 'vitest'
import {
  detectMapsPlatform,
  getMapsUrl,
  GYM_ADDRESS,
} from '@/lib/maps'

describe('getMapsUrl', () => {
  it('generates Apple Maps URL on iOS', () => {
    const url = getMapsUrl(GYM_ADDRESS, 'ios')
    expect(url).toMatch(/^maps:\/\/maps\.apple\.com\/\?q=/)
    expect(url).toContain(encodeURIComponent(GYM_ADDRESS))
  })

  it('generates Google Maps URL on Android', () => {
    const url = getMapsUrl(GYM_ADDRESS, 'android')
    expect(url).toBe(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GYM_ADDRESS)}`
    )
  })

  it('generates Google Maps URL on desktop', () => {
    const url = getMapsUrl(GYM_ADDRESS, 'desktop')
    expect(url).toBe(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GYM_ADDRESS)}`
    )
  })
})

describe('detectMapsPlatform', () => {
  it('detects iOS from iPhone user agent', () => {
    expect(
      detectMapsPlatform(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
      )
    ).toBe('ios')
  })

  it('detects Android from Android user agent', () => {
    expect(
      detectMapsPlatform('Mozilla/5.0 (Linux; Android 14; Pixel 8)')
    ).toBe('android')
  })

  it('defaults to desktop for other user agents', () => {
    expect(
      detectMapsPlatform(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      )
    ).toBe('desktop')
  })
})
