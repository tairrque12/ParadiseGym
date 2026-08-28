import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, within } from '@testing-library/react'
import { PresaleCountdown } from '@/components/PresaleCountdown'

const TARGET = '2026-11-26T09:00:00-06:00'

function countdown() {
  return within(screen.getByTestId('presale-countdown'))
}

describe('PresaleCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-10T15:00:00-06:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the remaining days, hours, and minutes', () => {
    render(<PresaleCountdown target={TARGET} />)

    expect(countdown().getByText(/opening in/i)).toBeInTheDocument()
    expect(countdown().getByText('46')).toBeInTheDocument()
    expect(countdown().getByText('18')).toBeInTheDocument()
    expect(countdown().getByText('0')).toBeInTheDocument()
    expect(countdown().getByText('Days')).toBeInTheDocument()
    expect(countdown().getByText('Hrs')).toBeInTheDocument()
    expect(countdown().getByText('Min')).toBeInTheDocument()
  })

  it('counts down as time passes', () => {
    render(<PresaleCountdown target={TARGET} />)

    act(() => {
      vi.advanceTimersByTime(90 * 60_000)
    })

    expect(countdown().getByText('46')).toBeInTheDocument()
    expect(countdown().getByText('16')).toBeInTheDocument()
    expect(countdown().getByText('30')).toBeInTheDocument()
  })

  it('switches to an opening message once the target passes', () => {
    vi.setSystemTime(new Date('2026-11-27T09:00:00-06:00'))

    render(<PresaleCountdown target={TARGET} />)

    expect(countdown().getByText(/any day now/i)).toBeInTheDocument()
    expect(countdown().queryByText('Days')).not.toBeInTheDocument()
  })

  it('drops the pulse animation when reduced motion is preferred', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    render(<PresaleCountdown target={TARGET} />)

    expect(countdown().getByText('46')).not.toHaveClass('animate-neon-pulse')
  })
})
