import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminLoginForm } from '@/components/admin/admin-login-form'

const mockSignInWithPassword = vi.fn()
const mockGetSession = vi.fn()
const mockPush = vi.fn()
const mockRefresh = vi.fn()

vi.mock('@/lib/supabase/browser', () => ({
  createSupabaseBrowserClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      getSession: mockGetSession,
    },
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

describe('AdminLoginForm', () => {
  beforeEach(() => {
    mockSignInWithPassword.mockReset()
    mockGetSession.mockReset()
    mockPush.mockReset()
    mockRefresh.mockReset()
    mockGetSession.mockResolvedValue({ data: { session: null } })
  })

  it('shows an error for invalid credentials', async () => {
    const user = userEvent.setup()
    mockSignInWithPassword.mockResolvedValue({
      data: { session: null },
      error: { message: 'Invalid login credentials' },
    })

    render(<AdminLoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'owner@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(
      await screen.findByText(/invalid email or password/i)
    ).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('redirects to /admin after a successful login', async () => {
    const user = userEvent.setup()
    mockSignInWithPassword.mockResolvedValue({
      data: { session: { user: { id: 'admin-1' } } },
      error: null,
    })

    render(<AdminLoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'owner@example.com')
    await user.type(screen.getByLabelText(/password/i), 'correct-password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('restores an existing session on refresh', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'admin-1' } } },
    })

    render(<AdminLoginForm />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin')
    })
  })
})
