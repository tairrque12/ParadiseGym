import '@/tests/mocks/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { track } from '@vercel/analytics'
import Home from '@/app/page'
import McAllenPage from '@/app/mcallen/page'
import { Providers } from '@/components/providers'
import { CONTACT } from '@/lib/contact'

const usePathname = vi.hoisted(() => vi.fn(() => '/'))

vi.mock('next/navigation', () => ({ usePathname }))

vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}))

function renderHome() {
  usePathname.mockReturnValue('/')
  return render(
    <Providers>
      <Home />
    </Providers>
  )
}

function renderMcAllen() {
  usePathname.mockReturnValue('/mcallen')
  return render(
    <Providers>
      <McAllenPage />
    </Providers>
  )
}

async function fillTourForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/first name/i), 'Elena')
  await user.type(screen.getByLabelText(/last name/i), 'Rivera')
  await user.type(screen.getByLabelText(/email/i), 'elena@example.com')
  await user.type(screen.getByLabelText(/phone/i), '956-244-6692')
  const days = within(screen.getByRole('group', { name: /preferred day/i })).getAllByRole(
    'button'
  )
  await user.click(days[days.length - 1])
  await user.click(screen.getByRole('button', { name: '10:00 AM' }))
}

describe('conversion events', () => {
  beforeEach(() => {
    vi.mocked(track).mockClear()
    usePathname.mockReturnValue('/')
  })

  it('records Harlingen membership clicks and the footer phone tap', async () => {
    const user = userEvent.setup()
    renderHome()

    await user.click(
      within(screen.getByRole('main')).getByRole('link', {
        name: 'Join now',
      })
    )
    await user.click(screen.getByTestId('header-cta'))
    await user.click(
      within(document.getElementById('pricing') as HTMLElement).getByRole(
        'link',
        { name: /12 month contract/i }
      )
    )
    await user.click(screen.getByRole('link', { name: CONTACT.phone }))

    await user.click(screen.getByTestId('mobile-menu-button'))
    await user.click(
      within(screen.getByRole('navigation', { name: /mobile/i })).getByTestId(
        'mobile-join'
      )
    )

    expect(track).toHaveBeenCalledWith('join_online_click', {
      location: 'harlingen',
      placement: 'hero',
    })
    expect(track).toHaveBeenCalledWith('join_online_click', {
      location: 'harlingen',
      placement: 'header',
    })
    expect(track).toHaveBeenCalledWith('join_online_click', {
      location: 'harlingen',
      placement: 'mobile_menu',
    })
    expect(track).toHaveBeenCalledWith('plan_click', {
      plan: '12 Month Contract',
      location: 'harlingen',
    })
    expect(track).toHaveBeenCalledWith('phone_click', {
      location: 'harlingen',
      placement: 'footer',
    })
  })

  it('records each tour button as a tour CTA click', async () => {
    const user = userEvent.setup()
    renderHome()

    await user.click(
      within(screen.getByRole('main')).getAllByRole('button', {
        name: 'Not ready? Book a free tour',
      })[0]
    )
    await user.click(screen.getByRole('button', { name: /close/i }))
    await user.click(screen.getByTestId('header-tour'))
    await user.click(screen.getByRole('button', { name: /close/i }))
    await user.click(screen.getByTestId('mobile-menu-button'))
    await user.click(screen.getByTestId('mobile-tour'))

    expect(track).toHaveBeenCalledWith('tour_cta_click', {
      location: 'harlingen',
      placement: 'hero',
    })
    expect(track).toHaveBeenCalledWith('tour_cta_click', {
      location: 'harlingen',
      placement: 'header',
    })
    expect(track).toHaveBeenCalledWith('tour_cta_click', {
      location: 'harlingen',
      placement: 'mobile_menu',
    })
  })

  it('records a tour form submit for the page the visitor is on', async () => {
    const user = userEvent.setup()
    renderMcAllen()

    await user.click(screen.getByTestId('header-tour'))
    await fillTourForm(user)
    await user.click(screen.getByRole('button', { name: /request tour/i }))

    await waitFor(() => {
      expect(screen.getByText(/tour requested/i)).toBeInTheDocument()
    })
    expect(track).toHaveBeenCalledWith('tour_cta_click', {
      location: 'mcallen',
      placement: 'header',
    })
    expect(track).toHaveBeenCalledWith('tour_form_submit', {
      location: 'mcallen',
    })
    expect(track).not.toHaveBeenCalledWith(
      'tour_form_submit',
      expect.objectContaining({ source: expect.anything() })
    )
  })

  it('records McAllen join clicks and the footer phone tap', async () => {
    const user = userEvent.setup()
    renderMcAllen()

    await user.click(
      screen.getByRole('link', { name: /join founding membership/i })
    )
    await user.click(screen.getByTestId('header-cta'))
    await user.click(
      within(document.getElementById('pricing') as HTMLElement).getByRole(
        'link',
        { name: /month to month/i }
      )
    )
    await user.click(screen.getByRole('link', { name: CONTACT.phone }))
    await user.click(screen.getByTestId('mobile-menu-button'))
    await user.click(screen.getByTestId('mobile-join'))

    expect(track).toHaveBeenCalledWith('join_online_click', {
      location: 'mcallen',
      placement: 'hero',
    })
    expect(track).toHaveBeenCalledWith('join_online_click', {
      location: 'mcallen',
      placement: 'header',
    })
    expect(track).toHaveBeenCalledWith('join_online_click', {
      location: 'mcallen',
      placement: 'mobile_menu',
    })
    expect(track).toHaveBeenCalledWith('plan_click', {
      plan: 'Month to Month',
      location: 'mcallen',
    })
    expect(track).toHaveBeenCalledWith('phone_click', {
      location: 'mcallen',
      placement: 'footer',
    })
  })
})
