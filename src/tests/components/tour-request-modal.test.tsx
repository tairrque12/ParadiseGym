import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { track } from '@vercel/analytics'
import { TourRequestModal } from '@/components/modals/tour-request-modal'

vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}))

describe('TourRequestModal', () => {
  beforeEach(() => {
    vi.mocked(track).mockClear()
    vi.spyOn(global, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('opens and closes via onOpenChange', async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()

    render(<TourRequestModal open location="harlingen" onOpenChange={onOpenChange} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders required fields and submits to tour API', async () => {
    const user = userEvent.setup()
    let capturedBody: unknown

    vi.mocked(global.fetch).mockImplementation(async (_input, init) => {
      capturedBody = JSON.parse(String(init?.body))
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    })

    render(<TourRequestModal open location="mcallen" onOpenChange={vi.fn()} />)

    await user.type(screen.getByLabelText(/first name/i), 'Elena')
    await user.type(screen.getByLabelText(/last name/i), 'Rivera')
    await user.type(screen.getByLabelText(/email/i), 'elena@example.com')
    await user.type(screen.getByLabelText(/phone/i), '956-244-6692')
    const days = within(screen.getByRole('group', { name: /preferred day/i })).getAllByRole(
      'button'
    )
    await user.click(days[days.length - 1])
    await user.click(screen.getByRole('button', { name: '10:00 AM' }))
    await user.click(screen.getByRole('button', { name: /request tour/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/tour requested/i)
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(capturedBody).toMatchObject({
      location: 'mcallen',
      first_name: 'Elena',
      last_name: 'Rivera',
      email: 'elena@example.com',
      phone: '956-244-6692',
      preferred_time: '10:00 AM',
    })
    expect(track).toHaveBeenCalledTimes(1)
    expect(track).toHaveBeenCalledWith('tour_form_submit', {
      location: 'harlingen',
    })
  })

  it('records the page location on a successful submit', async () => {
    const user = userEvent.setup()
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    )

    render(
      <TourRequestModal open location="mcallen" onOpenChange={vi.fn()} />
    )

    await user.type(screen.getByLabelText(/first name/i), 'Elena')
    await user.type(screen.getByLabelText(/last name/i), 'Rivera')
    await user.type(screen.getByLabelText(/^email$/i), 'elena@example.com')
    await user.type(screen.getByLabelText(/phone/i), '956-244-6692')
    await user.click(screen.getByRole('button', { name: /request tour/i }))

    await waitFor(() => {
      expect(track).toHaveBeenCalledWith('tour_form_submit', {
        location: 'mcallen',
      })
    })
  })

  it('does not record a submit when validation fails', async () => {
    const user = userEvent.setup()
    render(<TourRequestModal open onOpenChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /request tour/i }))

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument()
    expect(track).not.toHaveBeenCalled()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('does not record a submit when the request fails', async () => {
    const user = userEvent.setup()
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: 'nope' }), { status: 500 })
    )

    render(<TourRequestModal open onOpenChange={vi.fn()} />)

    await user.type(screen.getByLabelText(/first name/i), 'Elena')
    await user.type(screen.getByLabelText(/last name/i), 'Rivera')
    await user.type(screen.getByLabelText(/^email$/i), 'elena@example.com')
    await user.type(screen.getByLabelText(/phone/i), '956-244-6692')
    await user.click(screen.getByRole('button', { name: /request tour/i }))

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
    expect(track).not.toHaveBeenCalled()
  })

  it('asks for a day before showing times', () => {
    render(<TourRequestModal open location="harlingen" onOpenChange={vi.fn()} />)

    expect(screen.getByText(/choose a day first/i)).toBeInTheDocument()
    expect(screen.getByText(/we'll text you to confirm your tour/i)).toBeInTheDocument()
    expect(screen.getByText(/harlingen gym/i)).toBeInTheDocument()
  })

  it('names the Harlingen floor when the tour starts on McAllen', () => {
    render(<TourRequestModal open location="mcallen" onOpenChange={vi.fn()} />)

    expect(screen.getByText(/open harlingen floor/i)).toBeInTheDocument()
  })

  it('clears a time that the next day does not offer', async () => {
    const user = userEvent.setup()
    render(<TourRequestModal open location="harlingen" onOpenChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /^Mon/ }))
    await user.click(screen.getByRole('button', { name: '5:00 AM' }))
    expect(screen.getByRole('button', { name: '5:00 AM' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    await user.click(screen.getByRole('button', { name: /^Sun/ }))

    expect(screen.queryByRole('button', { name: '5:00 AM' })).not.toBeInTheDocument()
  })
})
