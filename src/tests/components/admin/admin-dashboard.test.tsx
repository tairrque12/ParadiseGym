import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

const membershipRows = [
  {
    id: 'm-1',
    created_at: '2026-07-02T12:00:00Z',
    first_name: 'Marcus',
    last_name: 'Torres',
    email: 'marcus@example.com',
    phone: '956-244-6692',
    age: 28,
    membership_type: '12_month_contract',
    status: 'new',
  },
  {
    id: 'm-2',
    created_at: '2026-07-02T10:00:00Z',
    first_name: 'Elena',
    last_name: 'Rivera',
    email: 'elena@example.com',
    phone: '956-244-6692',
    age: 31,
    membership_type: 'week_pass',
    status: 'contacted',
  },
]

const tourRows = [
  {
    id: 't-1',
    created_at: '2026-07-02T11:00:00Z',
    first_name: 'Alex',
    last_name: 'Nguyen',
    email: 'alex@example.com',
    phone: '956-244-6692',
    preferred_date: '2026-08-01',
    preferred_time: '10:00 AM',
    status: 'new',
  },
]

const mockFrom = vi.fn()
const mockSignOut = vi.fn()
const mockPush = vi.fn()
const mockRefresh = vi.fn()

function createQueryBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn(() => builder),
    order: vi.fn(() => Promise.resolve(result)),
    update: vi.fn(() => builder),
    eq: vi.fn(() => Promise.resolve({ error: null })),
  }
  return builder
}

vi.mock('@/lib/supabase/browser', () => ({
  createSupabaseBrowserClient: () => ({
    auth: { signOut: mockSignOut },
    from: mockFrom,
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

describe('AdminDashboard', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockSignOut.mockReset()
    mockPush.mockReset()
    mockRefresh.mockReset()

    mockFrom.mockImplementation((table: string) => {
      if (table === 'membership_requests') {
        return createQueryBuilder({ data: membershipRows, error: null })
      }
      if (table === 'tour_requests') {
        return createQueryBuilder({ data: tourRows, error: null })
      }
      return createQueryBuilder({ data: [], error: null })
    })
  })

  it('renders membership and tour request data', async () => {
    render(<AdminDashboard />)

    expect(await screen.findByText('Marcus Torres')).toBeInTheDocument()
    expect(screen.getByText('12 Month Contract')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /tour requests/i })).toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('tab', { name: /tour requests/i }))

    expect(await screen.findByText('Alex Nguyen')).toBeInTheDocument()
    expect(screen.getByText('2026-08-01')).toBeInTheDocument()
  })

  it('shows new count badges for unactioned requests', async () => {
    render(<AdminDashboard />)

    const membershipTab = await screen.findByRole('tab', { name: /membership requests/i })
    expect(within(membershipTab).getByText('1')).toBeInTheDocument()

    const tourTab = screen.getByRole('tab', { name: /tour requests/i })
    expect(within(tourTab).getByText('1')).toBeInTheDocument()
  })

  it('filters rows by name and email', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard />)

    await screen.findByText('Marcus Torres')
    await user.type(screen.getByLabelText(/search requests/i), 'elena@example.com')

    expect(screen.queryByText('Marcus Torres')).not.toBeInTheDocument()
    expect(screen.getByText('Elena Rivera')).toBeInTheDocument()
  })

  it('updates membership status via Supabase', async () => {
    const user = userEvent.setup()
    const update = vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ error: null })) }))
    const order = vi.fn(() => Promise.resolve({ data: membershipRows, error: null }))
    const select = vi.fn(() => ({ order }))

    mockFrom.mockImplementation((table: string) => {
      if (table === 'membership_requests') {
        return {
          select,
          order,
          update,
          eq: vi.fn(() => Promise.resolve({ error: null })),
        }
      }
      return createQueryBuilder({ data: tourRows, error: null })
    })

    render(<AdminDashboard />)
    await screen.findByText('Marcus Torres')

    const statusSelect = screen.getAllByLabelText(/update status/i)[0]
    await user.selectOptions(statusSelect, 'contacted')

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith({ status: 'contacted' })
    })
  })

  it('renders empty states when no data exists', async () => {
    mockFrom.mockImplementation(() =>
      createQueryBuilder({ data: [], error: null })
    )

    render(<AdminDashboard />)

    expect(
      await screen.findByText(/no membership requests yet/i)
    ).toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('tab', { name: /tour requests/i }))

    expect(await screen.findByText(/no tour requests yet/i)).toBeInTheDocument()
  })

  it('logs out and redirects to login', async () => {
    const user = userEvent.setup()
    mockSignOut.mockResolvedValue({ error: null })

    render(<AdminDashboard />)
    await screen.findByText('Marcus Torres')

    await user.click(screen.getByRole('button', { name: /log out/i }))

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/admin/login')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })
})
