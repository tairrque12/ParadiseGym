import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { handleMembershipRequest } from '@/lib/api/membership-request'

const validPayload = {
  first_name: 'Marcus',
  last_name: 'Torres',
  email: 'marcus@example.com',
  phone: '(956) 244-6692',
  age: 28,
  membership_type: '12_month_contract',
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
  return new NextRequest('http://localhost/api/membership-request', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/membership-request', () => {
  beforeEach(() => {
    mockInsert.mockReset()
    mockSendEmail.mockReset()
    mockInsert.mockResolvedValue({ error: null })
    mockSendEmail.mockResolvedValue({ error: null })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 200 and inserts + emails on valid payload', async () => {
    const response = await handleMembershipRequest(createRequest(validPayload))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockInsert).toHaveBeenCalledOnce()
    expect(mockSendEmail).toHaveBeenCalledOnce()
    expect(mockSendEmail.mock.calls[0][0].subject).toMatch(/Membership Request/i)
    expect(mockSendEmail.mock.calls[0][0].replyTo).toBe('marcus@example.com')
  })

  it('returns 400 on invalid payload without calling Supabase or Resend', async () => {
    const response = await handleMembershipRequest(
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

    const response = await handleMembershipRequest(createRequest(validPayload))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockInsert).toHaveBeenCalledOnce()
    expect(mockSendEmail).toHaveBeenCalledOnce()
    expect(mockSendEmail.mock.calls[0][0].subject).toBe(
      'New Paradise Gym Membership Request'
    )
    expect(mockSendEmail.mock.calls[0][0].replyTo).toBe('marcus@example.com')
    expect(console.error).toHaveBeenCalledWith(
      'Membership insert failed:',
      expect.objectContaining({ message: 'TypeError: fetch failed' })
    )
  })

  it('returns 200 when a schema error blocks the insert and the notification email sends', async () => {
    const schemaError = {
      code: 'PGRST205',
      details: null,
      hint: null,
      message: "Could not find the table 'public.membership_requests' in the schema cache",
    }
    mockInsert.mockResolvedValue({ error: schemaError })

    const response = await handleMembershipRequest(createRequest(validPayload))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockInsert).toHaveBeenCalledOnce()
    expect(mockSendEmail).toHaveBeenCalledOnce()
    expect(mockSendEmail.mock.calls[0][0].subject).toBe(
      'New Paradise Gym Membership Request'
    )
    expect(mockSendEmail.mock.calls[0][0].replyTo).toBe('marcus@example.com')
    expect(console.error).toHaveBeenCalledWith(
      'Membership insert failed:',
      schemaError
    )
  })

  it('returns 500 when the database and the notification email both fail', async () => {
    mockInsert.mockResolvedValue({
      error: { message: 'TypeError: fetch failed' },
    })
    mockSendEmail.mockResolvedValue({ error: new Error('email failed') })

    const response = await handleMembershipRequest(createRequest(validPayload))
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to save request')
    expect(mockInsert).toHaveBeenCalledOnce()
    expect(mockSendEmail).toHaveBeenCalledOnce()
    expect(console.error).toHaveBeenCalledWith(
      'Membership insert failed:',
      expect.objectContaining({ message: 'TypeError: fetch failed' })
    )
    expect(console.error).toHaveBeenCalledWith(
      'Membership email failed:',
      expect.any(Error)
    )
  })

  it('returns 200 when Resend fails after successful insert', async () => {
    mockSendEmail.mockResolvedValue({ error: new Error('email failed') })

    const response = await handleMembershipRequest(createRequest(validPayload))

    expect(response.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledOnce()
    expect(console.error).toHaveBeenCalled()
  })

  it('returns 200 when Resend is not configured after successful insert', async () => {
    mockSendEmail.mockResolvedValue({
      error: new Error('Resend environment variables are not configured'),
    })

    const response = await handleMembershipRequest(createRequest(validPayload))

    expect(response.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledOnce()
  })
})
