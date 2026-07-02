import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TourRequestModal } from '@/components/modals/tour-request-modal'

describe('TourRequestModal', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('opens and closes via onOpenChange', async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()

    render(<TourRequestModal open onOpenChange={onOpenChange} />)

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

    render(<TourRequestModal open onOpenChange={vi.fn()} />)

    await user.type(screen.getByLabelText(/first name/i), 'Elena')
    await user.type(screen.getByLabelText(/last name/i), 'Rivera')
    await user.type(screen.getByLabelText(/^email$/i), 'elena@example.com')
    await user.type(screen.getByLabelText(/phone/i), '956-244-6692')
    await user.click(screen.getByRole('button', { name: /request tour/i }))

    await waitFor(() => {
      expect(screen.getByText(/tour requested/i)).toBeInTheDocument()
    })

    expect(capturedBody).toMatchObject({
      first_name: 'Elena',
      last_name: 'Rivera',
      email: 'elena@example.com',
      phone: '956-244-6692',
    })
  })

  it('keeps preferred time disabled until a date is selected', () => {
    render(<TourRequestModal open onOpenChange={vi.fn()} />)

    expect(screen.getByLabelText(/preferred time/i)).toBeDisabled()
    expect(screen.getByText(/select a date first/i)).toBeInTheDocument()
  })

  it('populates morning time options after a weekday date is selected', async () => {
    const user = userEvent.setup()

    render(<TourRequestModal open onOpenChange={vi.fn()} />)

    await user.type(screen.getByLabelText(/preferred date/i), '2026-07-06')

    const timeSelect = screen.getByLabelText(/preferred time/i)
    expect(timeSelect).toBeEnabled()
    expect(within(timeSelect).getByRole('option', { name: '5:00 AM' })).toBeInTheDocument()
    expect(within(timeSelect).getByRole('option', { name: '10:00 AM' })).toBeInTheDocument()
  })

  it('clears an incompatible preferred time when the date changes', async () => {
    const user = userEvent.setup()

    render(<TourRequestModal open onOpenChange={vi.fn()} />)

    await user.type(screen.getByLabelText(/preferred date/i), '2026-07-12')
    await user.selectOptions(screen.getByLabelText(/preferred time/i), '10:00 AM')

    expect(screen.getByLabelText(/preferred time/i)).toHaveValue('10:00 AM')

    await user.clear(screen.getByLabelText(/preferred date/i))
    await user.type(screen.getByLabelText(/preferred date/i), '2026-07-11')
    await user.selectOptions(screen.getByLabelText(/preferred time/i), '8:00 AM')

    expect(screen.getByLabelText(/preferred time/i)).toHaveValue('8:00 AM')
  })
})
