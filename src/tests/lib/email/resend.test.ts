import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockSend = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn(function MockResend() {
    return {
      emails: { send: mockSend },
    }
  }),
}))

describe('sendOwnerNotificationEmail', () => {
  beforeEach(() => {
    mockSend.mockReset()
    mockSend.mockResolvedValue({ error: null })
    process.env.RESEND_API_KEY = 're_test_key'
    process.env.RESEND_FROM_EMAIL = 'notifications@example.com'
    delete process.env.NOTIFICATION_EMAIL
  })

  afterEach(() => {
    delete process.env.RESEND_API_KEY
    delete process.env.RESEND_FROM_EMAIL
    delete process.env.NOTIFICATION_EMAIL
    vi.resetModules()
  })

  it('sends to the gym owner email by default', async () => {
    const { sendOwnerNotificationEmail } = await import('@/lib/email/resend')

    await sendOwnerNotificationEmail({
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
    })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'Paradisegym2025@gmail.com',
      })
    )
  })

  it('sends to NOTIFICATION_EMAIL when the env var is set', async () => {
    process.env.NOTIFICATION_EMAIL = 'test-recipient@example.com'
    vi.resetModules()

    const { sendOwnerNotificationEmail } = await import('@/lib/email/resend')

    await sendOwnerNotificationEmail({
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
    })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test-recipient@example.com',
      })
    )
  })

  it('sets reply_to to the customer email when provided', async () => {
    const { sendOwnerNotificationEmail } = await import('@/lib/email/resend')

    await sendOwnerNotificationEmail({
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
      replyTo: 'customer@example.com',
    })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: 'customer@example.com',
      })
    )
  })
})
