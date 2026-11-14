import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockSend = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn(function MockResend() {
    return {
      emails: { send: mockSend },
    }
  }),
}))

const payload = {
  subject: 'Test',
  html: '<p>Test</p>',
  text: 'Test',
}

const missingConfigError = 'Resend environment variables are not configured'

describe('sendOwnerNotificationEmail', () => {
  beforeEach(() => {
    mockSend.mockReset()
    mockSend.mockResolvedValue({ error: null })
    process.env.RESEND_API_KEY = 're_test_key'
    process.env.RESEND_FROM_EMAIL = 'notifications@example.com'
    process.env.NOTIFICATION_EMAIL = 'owner@example.com'
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    delete process.env.RESEND_API_KEY
    delete process.env.RESEND_FROM_EMAIL
    delete process.env.NOTIFICATION_EMAIL
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('sends to NOTIFICATION_EMAIL when it is set', async () => {
    const { sendOwnerNotificationEmail } = await import('@/lib/email/resend')

    await sendOwnerNotificationEmail(payload)

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@example.com',
        from: 'notifications@example.com',
      })
    )
  })

  it.each([undefined, ''])(
    'does not send when NOTIFICATION_EMAIL is %j',
    async (notificationEmail) => {
      if (notificationEmail === undefined) {
        delete process.env.NOTIFICATION_EMAIL
      } else {
        process.env.NOTIFICATION_EMAIL = notificationEmail
      }
      const { sendOwnerNotificationEmail } = await import('@/lib/email/resend')

      const result = await sendOwnerNotificationEmail(payload)

      expect(mockSend).not.toHaveBeenCalled()
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error?.message).toBe(missingConfigError)
      expect(console.error).toHaveBeenCalledWith(missingConfigError)
    }
  )

  it('fails the same way when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY
    const { sendOwnerNotificationEmail } = await import('@/lib/email/resend')

    const result = await sendOwnerNotificationEmail(payload)

    expect(mockSend).not.toHaveBeenCalled()
    expect(result.error).toBeInstanceOf(Error)
    expect(result.error?.message).toBe(missingConfigError)
    expect(console.error).toHaveBeenCalledWith(missingConfigError)
  })

  it('fails the same way when RESEND_FROM_EMAIL is missing', async () => {
    delete process.env.RESEND_FROM_EMAIL
    const { sendOwnerNotificationEmail } = await import('@/lib/email/resend')

    const result = await sendOwnerNotificationEmail(payload)

    expect(mockSend).not.toHaveBeenCalled()
    expect(result.error?.message).toBe(missingConfigError)
    expect(console.error).toHaveBeenCalledWith(missingConfigError)
  })

  it('sets replyTo to the customer email when provided', async () => {
    const { sendOwnerNotificationEmail } = await import('@/lib/email/resend')

    await sendOwnerNotificationEmail({
      ...payload,
      replyTo: 'customer@example.com',
    })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@example.com',
        replyTo: 'customer@example.com',
      })
    )
  })

  it('does not hardcode a notification recipient', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/lib/email/resend.ts'),
      'utf8'
    )

    expect(source).not.toMatch(/gmail\.com/i)
  })
})
