import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { handleTourRequest } from '@/lib/api/tour-request'

const validPayload = {
  location: 'mcallen',
  first_name: 'Elena',
  last_name: 'Rivera',
  email: 'elena@example.com',
  phone: '956-244-6692',
  preferred_date: '2026-08-01',
  preferred_time: '10:00 AM',
}

const mockInsert = vi.fn()
const mockSendEmail = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseServerClient: () => ({
    from: () => ({
      insert: mockInsert,
    }),
  }),
}))

vi.mock('@/lib/email/resend', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/email/resend')>()
  return {
    ...actual,
    sendOwnerNotificationEmail: (...args: unknown[]) => mockSendEmail(...args),
  }
})

function createRequest(body: unknown) {
  return new NextRequest('http://localhost/api/tour-request', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/tour-request', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-02T12:00:00Z'))
    mockInsert.mockReset()
    mockSendEmail.mockReset()
    mockInsert.mockResolvedValue({ error: null })
    mockSendEmail.mockResolvedValue({ error: null })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('returns 200 and inserts + emails on valid payload', async () => {
    const response = await handleTourRequest(createRequest(validPayload))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        location: 'mcallen',
        email: 'elena@example.com',
        preferred_date: '2026-08-01',
      })
    )
    expect(mockSendEmail).toHaveBeenCalledOnce()
    expect(mockSendEmail.mock.calls[0][0].subject).toMatch(/Tour Request/i)
    expect(mockSendEmail.mock.calls[0][0].replyTo).toBe('elena@example.com')
  })

  it('returns 400 on invalid payload without calling Supabase or Resend', async () => {
    const response = await handleTourRequest(
      createRequest({ ...validPayload, email: 'bad' })
    )

    expect(response.status).toBe(400)
    expect(mockInsert).not.toHaveBeenCalled()
    expect(mockSendEmail).not.toHaveBeenCalled()
  })

  it('returns 200 when the database is down and the notification email sends', async () => {
    mockInsert.mockResolvedValue({
      error: {
        message: 'TypeError: fetch failed',
        details: 'getaddrinfo ENOTFOUND qgxptenksngduytpcgni.supabase.co',
      },
    })

    const response = await handleTourRequest(createRequest(validPayload))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockInsert).toHaveBeenCalledOnce()
    expect(mockSendEmail).toHaveBeenCalledOnce()
    expect(mockSendEmail.mock.calls[0][0].subject).toBe('New Paradise Gym Tour Request')
    expect(mockSendEmail.mock.calls[0][0].replyTo).toBe('elena@example.com')
    expect(console.error).toHaveBeenCalledWith(
      'Tour insert failed:',
      expect.objectContaining({ message: 'TypeError: fetch failed' })
    )
  })

  it('returns 500 when the database and the notification email both fail', async () => {
    mockInsert.mockResolvedValue({
      error: { message: 'TypeError: fetch failed' },
    })
    mockSendEmail.mockResolvedValue({ error: new Error('email failed') })

    const response = await handleTourRequest(createRequest(validPayload))
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to save request')
    expect(mockInsert).toHaveBeenCalledOnce()
    expect(mockSendEmail).toHaveBeenCalledOnce()
    expect(console.error).toHaveBeenCalledWith(
      'Tour insert failed:',
      expect.objectContaining({ message: 'TypeError: fetch failed' })
    )
    expect(console.error).toHaveBeenCalledWith(
      'Tour email failed:',
      expect.any(Error)
    )
  })

  it('returns 200 when Resend fails after successful insert', async () => {
    mockSendEmail.mockResolvedValue({ error: new Error('email failed') })

    const response = await handleTourRequest(createRequest(validPayload))

    expect(response.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledOnce()
    expect(console.error).toHaveBeenCalled()
  })
})
