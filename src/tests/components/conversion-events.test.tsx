import '@/tests/mocks/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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
    await user.click(within(screen.getByRole('dialog')).getByTestId('mobile-join'))

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

  it('records the McAllen announcement bar', async () => {
    const user = userEvent.setup()
    renderHome()

    await user.click(screen.getByTestId('opening-banner'))

    expect(track).toHaveBeenCalledWith('announcement_bar_click', {
      location: 'mcallen',
    })
    expect(track).not.toHaveBeenCalledWith(
      'tour_cta_click',
      expect.anything()
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
