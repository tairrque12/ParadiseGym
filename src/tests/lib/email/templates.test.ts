import { describe, it, expect } from 'vitest'
import {
  formatMembershipRequestEmail,
  formatTourRequestEmail,
} from '@/lib/email/templates'

const membershipFields = {
  first_name: 'Marcus',
  last_name: 'Torres',
  email: 'marcus@example.com',
  phone: '956-244-6692',
  age: 28,
  membership_type: '12_month_contract',
}

const tourFields = {
  first_name: 'Elena',
  last_name: 'Rivera',
  email: 'elena@example.com',
  phone: '956-244-6692',
  preferred_date: '2026-08-01',
  preferred_time: '10:00 AM',
}

const submittedAt = new Date('2026-07-02T15:30:00Z')

describe('email templates', () => {
  it('renders membership email with brand header, heading, badge, and footer', () => {
    const { html, text } = formatMembershipRequestEmail(
      membershipFields,
      submittedAt
    )

    expect(html).toContain('Paradise Gym')
    expect(html).toContain('New Membership Request')
    expect(html).toContain('background-color:#0A0A0A')
    expect(html).toContain('color:#39FF14')
    expect(html).toContain('12 Month Contract')
    expect(html).toContain('border-radius:999px')
    expect(html).toContain('paradisegymofficial.com')
    expect(html).toContain('max-width:600px')
    expect(html).toContain('background-color:#ffffff')

    expect(text).toContain('New Membership Request')
    expect(text).toContain('membership type: 12 Month Contract')
    expect(text).toContain('paradisegymofficial.com')
  })

  it('renders tour email with highlighted date and time when provided', () => {
    const { html } = formatTourRequestEmail(tourFields, submittedAt)

    expect(html).toContain('New Tour Request')
    expect(html).toContain('2026-08-01')
    expect(html).toContain('10:00 AM')
    expect(html).toContain('background-color:#0A0A0A')
    expect(html).toContain('color:#39FF14')
  })

  it('does not highlight empty tour date/time fields', () => {
    const { html } = formatTourRequestEmail(
      {
        ...tourFields,
        preferred_date: null,
        preferred_time: '',
      },
      submittedAt
    )

    expect(html).toContain('preferred date')
    expect(html).toContain('preferred time')
    expect(html).not.toMatch(/preferred date[\s\S]*border-radius:6px/)
  })

  it('escapes user-supplied HTML in field values', () => {
    const { html, text } = formatMembershipRequestEmail(
      {
        ...membershipFields,
        first_name: '<script>alert("x")</script>',
      },
      submittedAt
    )

    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
    expect(text).toContain('<script>alert("x")</script>')
  })
})
