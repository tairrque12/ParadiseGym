import React from 'react'
import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MembershipFormProvider } from '@/context/membership-form-context'
import { MembershipRequestModal } from '@/components/modals/membership-request-modal'

function renderModal(
  props: Partial<React.ComponentProps<typeof MembershipRequestModal>> = {},
  tier: string | null = null
) {
  return render(
    <MembershipFormProvider initialTier={tier}>
      <MembershipRequestModal
        open={props.open ?? true}
        onOpenChange={props.onOpenChange ?? vi.fn()}
        {...props}
      />
    </MembershipFormProvider>
  )
}

describe('MembershipRequestModal', () => {
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

    renderModal({ open: true, onOpenChange })

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders all required fields', () => {
    renderModal()

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/membership type/i)).toBeInTheDocument()
  })

  it('pre-selects tier when selectedTier is set', async () => {
    renderModal({}, 'performance')

    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue('performance')
    })
  })

  it('leaves membership type unselected when no tier is set', async () => {
    renderModal({}, null)

    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue('')
    })
  })

  it('shows validation errors on invalid submit', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole('button', { name: /submit request/i }))

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('submits valid payload to membership API', async () => {
    const user = userEvent.setup()
    let capturedBody: unknown

    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    )
    vi.mocked(global.fetch).mockImplementation(async (_input, init) => {
      capturedBody = JSON.parse(String(init?.body))
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    })

    renderModal({}, 'elite')

    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue('elite')
    })

    await user.type(screen.getByLabelText(/first name/i), 'Marcus')
    await user.type(screen.getByLabelText(/last name/i), 'Torres')
    await user.type(screen.getByLabelText(/email/i), 'marcus@example.com')
    await user.type(screen.getByLabelText(/phone/i), '956-244-6692')
    await user.type(screen.getByLabelText(/age/i), '28')
    await user.click(screen.getByRole('button', { name: /submit request/i }))

    await waitFor(() => {
      expect(screen.getByText(/request received/i)).toBeInTheDocument()
    })

    expect(capturedBody).toMatchObject({
      first_name: 'Marcus',
      last_name: 'Torres',
      email: 'marcus@example.com',
      phone: '956-244-6692',
      age: 28,
      membership_type: 'elite',
    })
  })

  it('shows error state on failed submission and allows retry', async () => {
    const user = userEvent.setup()

    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: 'fail' }), { status: 500 })
    )

    renderModal({}, 'essential')

    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue('essential')
    })

    await user.type(screen.getByLabelText(/first name/i), 'Marcus')
    await user.type(screen.getByLabelText(/last name/i), 'Torres')
    await user.type(screen.getByLabelText(/email/i), 'marcus@example.com')
    await user.type(screen.getByLabelText(/phone/i), '956-244-6692')
    await user.type(screen.getByLabelText(/age/i), '28')
    await user.click(screen.getByRole('button', { name: /submit request/i }))

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toHaveValue('Marcus')
  })

  it('disables submit while request is in-flight', async () => {
    const user = userEvent.setup()

    vi.mocked(global.fetch).mockImplementation(
      () => new Promise(() => {})
    )

    renderModal({}, 'essential')

    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue('essential')
    })

    await user.type(screen.getByLabelText(/first name/i), 'Marcus')
    await user.type(screen.getByLabelText(/last name/i), 'Torres')
    await user.type(screen.getByLabelText(/email/i), 'marcus@example.com')
    await user.type(screen.getByLabelText(/phone/i), '956-244-6692')
    await user.type(screen.getByLabelText(/age/i), '28')

    const submit = screen.getByRole('button', { name: /submit request/i })
    await user.click(submit)

    await waitFor(() => {
      expect(submit).toBeDisabled()
    })
  })
})
